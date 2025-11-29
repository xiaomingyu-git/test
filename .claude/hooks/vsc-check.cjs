#!/usr/bin/env node

const { spawn } = require('child_process');
const { readFileSync, existsSync, mkdirSync, writeFileSync } = require('fs');
const { join, resolve, normalize } = require('path');
const { homedir } = require('os');

// 获取正确的项目目录
function getProjectDir() {
    // 使用当前工作目录
    const projectDir = process.cwd();
    // 规范化路径，确保在不同操作系统下都能正确工作
    return normalize(resolve(projectDir));
}

// 尝试从stdin读取输入，如果没有则使用默认值
let HOOK_INPUT = {};
let SESSION_ID = 'default';
try {
    const stdinData = readFileSync(0, 'utf-8').trim();
    if (stdinData) {
        HOOK_INPUT = JSON.parse(stdinData);
        SESSION_ID = HOOK_INPUT.session_id || 'default';
    }
} catch {
    // 忽略JSON解析错误，使用默认值
}

const CLAUDE_PROJECT_DIR = getProjectDir();
const CACHE_DIR = join(homedir(), '.claude', 'vsc-cache', SESSION_ID);

// 创建缓存目录
try {
    mkdirSync(CACHE_DIR, { recursive: true });
} catch {
    // 忽略目录创建错误
}

const TOOL_NAME = HOOK_INPUT.tool_name || '';
const TOOL_INPUT = HOOK_INPUT.tool_input || {};

// 检测Vue项目对应的TSC命令
async function getTscCommand(projectPath) {
    const normalizedProjectPath = normalize(resolve(projectPath));
    const tsconfig = join(normalizedProjectPath, 'tsconfig.json');
    const tsconfigApp = join(normalizedProjectPath, 'tsconfig.app.json');

    if (existsSync(tsconfigApp)) {
        // Vue项目通常有tsconfig.app.json
        return 'npx vue-tsc --project tsconfig.app.json --noEmit';
    } else if (existsSync(tsconfig)) {
        // 回退到主tsconfig.json
        return 'npx vue-tsc --noEmit';
    } else {
        // 默认命令
        return 'npx vue-tsc --noEmit';
    }
}

// 运行TSC检查
async function runTscCheck() {
    const cacheFile = join(CACHE_DIR, 'vue-tsc-cmd.cache');

    let tscCmd;

    // 获取或缓存TSC命令
    if (existsSync(cacheFile) && !process.env.FORCE_DETECT) {
        try {
            tscCmd = readFileSync(cacheFile, 'utf-8').trim();
        } catch {
            tscCmd = await getTscCommand(CLAUDE_PROJECT_DIR);
        }
    } else {
        tscCmd = await getTscCommand(CLAUDE_PROJECT_DIR);
        try {
            writeFileSync(cacheFile, tscCmd);
        } catch {
            // 忽略缓存写入错误
        }
    }

    return new Promise((resolve) => {
        const parts = tscCmd.split(' ');
        const [cmd, ...args] = parts;

        const child = spawn(cmd, args, {
            cwd: CLAUDE_PROJECT_DIR,
            stdio: 'pipe',
            shell: true
        });

        let stdout = '';
        let stderr = '';

        child.stdout?.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr?.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('exit', (code) => {
            resolve({
                output: stdout + stderr,
                exitCode: code || 0
            });
        });

        child.on('error', (error) => {
            resolve({
                output: error.message,
                exitCode: 1
            });
        });
    });
}

// 主函数
async function main() {
    try {
        // 在Stop hook中，TOOL_NAME可能为空，此时直接进行TypeScript检查
        if (TOOL_NAME && !['Write', 'Edit', 'MultiEdit'].includes(TOOL_NAME)) {
            process.exit(0);
        }

        // 如果没有工具输入（Stop hook情况），检查整个项目
        let shouldCheck = false;
        if (!TOOL_NAME) {
            // Stop hook - 总是执行检查
            shouldCheck = true;
            console.error('⚡ Stop hook: Running Vue TypeScript check...');
        } else {
            // PostToolUse hook - 检查是否有相关文件被修改
            let filePaths = [];

            // 提取文件路径
            if (TOOL_NAME === 'MultiEdit') {
                if (TOOL_INPUT.edits) {
                    filePaths = TOOL_INPUT.edits.map(edit => edit.file_path || '').filter(Boolean);
                }
            } else {
                filePaths = [TOOL_INPUT.file_path || ''];
            }

            // 检查是否有TypeScript/Vue文件被修改
            const hasTsFiles = filePaths.some(filePath =>
                filePath && /\.(ts|tsx|js|jsx|vue)$/.test(filePath)
            );

            if (hasTsFiles) {
                shouldCheck = true;
                console.error('⚡ PostToolUse hook: Vue files modified, running TypeScript check...');
            }
        }

        if (!shouldCheck) {
            process.exit(0);
        }

        const { output, exitCode } = await runTscCheck();

        // 检查是否有TypeScript错误
        const hasTsErrors = exitCode !== 0 || output.includes('error TS');

        if (hasTsErrors) {
            console.error('❌ TypeScript errors found');

            // 保存错误信息给agent
            try {
                writeFileSync(join(CACHE_DIR, 'last-errors.txt'), output);
                writeFileSync(join(CACHE_DIR, 'affected-repos.txt'), 'vue-project');

                // 保存使用的TSC命令
                const cmd = tscCmd || 'npx vue-tsc --noEmit';
                writeFileSync(join(CACHE_DIR, 'tsc-commands.txt'), `vue-project: ${cmd}\n`);
            } catch {
                // 忽略文件写入错误
            }

            // 输出到stderr以增加可见性
            const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚨 TypeScript errors found in Vue project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👉 IMPORTANT: Use the auto-error-resolver agent to fix the errors

WE DO NOT LEAVE A MESS BEHIND

Error Details:
${output}
`;

            console.error(errorMessage);

            // 退出代码1使stderr可见
            process.exit(1);
        } else {
            console.error('✅ No TypeScript errors');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error in vsc-check:', error.message);
        process.exit(1);
    }
}

// 清理旧的缓存目录（7天前的）- Windows兼容版本
async function cleanupOldCache() {
    try {
        // Windows上使用不同的清理方法
        if (process.platform === 'win32') {
            const { exec } = require('child_process');
            exec('forfiles /p "' + join(homedir(), '.claude', 'vsc-cache') + '" /s /m * /d -7 /c "cmd /c if @isdir==TRUE rmdir /s /q @path"', () => {
                // 忽略清理错误
            });
        } else {
            // Unix-like系统
            const { spawn } = require('child_process');
            const findProcess = spawn('find', [join(homedir(), '.claude', 'vsc-cache'), '-maxdepth', '1', '-type', 'd', '-mtime', '+7', '-exec', 'rm', '-rf', '{}', ';'], {
                stdio: 'ignore'
            });

            findProcess.on('error', () => {
                // 忽略清理错误
            });
        }
    } catch {
        // 忽略清理错误
    }
}

main().catch((error) => {
    console.error('Error in vsc-check:', error);
    process.exit(1);
}).finally(() => {
    cleanupOldCache();
});