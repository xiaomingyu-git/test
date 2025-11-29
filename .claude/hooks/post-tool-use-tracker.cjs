#!/usr/bin/env node

const { readFileSync, writeFileSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

async function main() {
    try {
        // 从stdin读取工具信息
        let input = '';
        try {
            input = readFileSync(0, 'utf-8').trim();
            if (!input) {
                process.exit(0);
            }
            const toolInfo = JSON.parse(input);

            // 提取相关数据
            const toolName = toolInfo.tool_name || '';
            let filePath = toolInfo.tool_input?.file_path || '';
            const sessionId = toolInfo.session_id || 'default';

            // 如果不是编辑工具或没有文件路径，则跳过
            if (!['Edit', 'MultiEdit', 'Write'].includes(toolName) || !filePath) {
                process.exit(0);
            }

            // 跳过markdown文件
            if (filePath.match(/\.(md|markdown)$/)) {
                process.exit(0);
            }

            // 在项目中创建缓存目录
            const projectDir = require('path').normalize(require('path').resolve(process.cwd()));
            const cacheDir = join(projectDir, '.claude', 'tsc-cache', sessionId);
            mkdirSync(cacheDir, { recursive: true });

            // 检测Vue项目区域的函数
            function detectRepo(file) {
                const projectRoot = projectDir;

                // 从路径中移除项目根目录
                const relativePath = file.replace(projectRoot + '/', '');

                // 提取第一个目录组件
                const firstDir = relativePath.split('/')[0];

                // Vue单例项目结构映射
                switch (firstDir) {
                    // Vue项目核心目录
                    case 'src':
                        return 'vue-source';

                    case 'public':
                        return 'vue-assets';

                    case 'dist':
                    case 'build':
                        return 'vue-build';

                    // 配置和工具目录
                    case '.vite':
                    case '.nuxt':
                    case '.output':
                        return 'vue-cache';

                    // 文档目录
                    case 'docs':
                        return 'vue-docs';

                    // 测试目录
                    case 'tests':
                    case 'test':
                    case '__tests__':
                    case 'e2e':
                        return 'vue-tests';

                    // 工具和脚本
                    case 'scripts':
                    case 'tools':
                        return 'vue-tools';

                    // 样式目录
                    case 'styles':
                    case 'css':
                    case 'sass':
                    case 'scss':
                        return 'vue-styles';

                    // 类型定义目录
                    case 'types':
                    case '@types':
                        return 'vue-types';

                    // 组件库目录（如果有）
                    case 'components':
                    case 'lib':
                    case 'packages':
                        return 'vue-components';

                    // 根目录文件
                    default: {
                        // 检查是否是根目录中的配置文件
                        if (!relativePath.includes('/')) {
                            // 根目录配置文件
                            if (relativePath.startsWith('vite.config.') ||
                                relativePath.startsWith('vue.config.') ||
                                relativePath.startsWith('nuxt.config.') ||
                                relativePath.startsWith('tsconfig.') ||
                                relativePath.startsWith('package.json') ||
                                relativePath.startsWith('pnpm-lock.') ||
                                relativePath.startsWith('yarn.lock')) {
                                return 'vue-config';
                            }
                            return 'vue-root';
                        }
                        return 'vue-source'; // 默认认为是源代码相关
                    }
                }
            }

            // 获取Vue项目的构建命令
            function getBuildCommand(repo) {
                const projectRoot = projectDir;

                // 对于Vue单例项目，只在根目录查找package.json
                const packageJsonPath = join(projectRoot, 'package.json');
                if (!existsSync(packageJsonPath)) {
                    return '';
                }

                const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
                const scripts = packageJson.scripts || {};

                // 根据修改的区域决定构建命令
                switch (repo) {
                    case 'vue-source':
                    case 'vue-components':
                    case 'vue-styles':
                    case 'vue-types':
                        // 源代码变更，需要完整构建
                        if (scripts['build-only']) {
                            return 'pnpm run build-only';
                        } else if (scripts.build) {
                            return 'pnpm run build';
                        }
                        break;

                    case 'vue-config':
                        // 配置文件变更，运行类型检查和构建验证
                        if (scripts['type-check']) {
                            return 'pnpm run type-check';
                        } else if (scripts.build) {
                            return 'pnpm run build';
                        }
                        break;

                    case 'vue-tests':
                        // 测试文件变更，运行测试
                        if (scripts['test:e2e']) {
                            return 'pnpm run test:e2e';
                        } else if (scripts.test) {
                            return 'pnpm run test';
                        }
                        break;

                    case 'vue-root':
                        // 根目录文件变更，根据具体文件类型决定
                        if (scripts.build) {
                            return 'pnpm run build';
                        }
                        break;

                    default:
                        // 其他区域通常不需要构建
                        return '';
                }

                return '';
            }

            // 获取Vue项目的TSC命令
            function getTscCommand(repo) {
                const projectRoot = projectDir;

                // 对于Vue单例项目，只在根目录查找tsconfig文件
                const tsconfigPath = join(projectRoot, 'tsconfig.json');
                const tsconfigAppPath = join(projectRoot, 'tsconfig.app.json');

                // 根据修改的区域决定是否需要TypeScript检查
                switch (repo) {
                    case 'vue-source':
                    case 'vue-components':
                    case 'vue-types':
                    case 'vue-config':
                    case 'vue-root':
                        // 这些区域的变更需要TypeScript检查
                        if (existsSync(tsconfigAppPath)) {
                            // Vue项目通常有tsconfig.app.json
                            return 'pnpm exec vue-tsc --project tsconfig.app.json --noEmit';
                        } else if (existsSync(tsconfigPath)) {
                            // 回退到主tsconfig.json
                            return 'pnpm exec vue-tsc --noEmit';
                        }
                        break;

                    case 'vue-styles':
                    case 'vue-assets':
                    case 'vue-tests':
                    case 'vue-docs':
                    case 'vue-tools':
                    case 'vue-cache':
                        // 这些区域通常不需要TypeScript检查
                        return '';

                    default:
                        // 未知区域，进行基本检查
                        if (existsSync(tsconfigPath)) {
                            return 'pnpm exec vue-tsc --noEmit';
                        }
                        break;
                }

                return '';
            }

            // 检测仓库
            const repo = detectRepo(filePath);

            // 如果是无效区域则跳过（Vue项目中所有区域都是有效的）
            if (!repo) {
                process.exit(0);
            }

            // 记录编辑的文件
            const timestamp = Date.now();
            const editedFilesLogPath = join(cacheDir, 'edited-files.log');
            const logEntry = `${timestamp}\t${toolName}\t${filePath}\n`;

            try {
                const currentLog = existsSync(editedFilesLogPath) ? readFileSync(editedFilesLogPath, 'utf-8') : '';
                writeFileSync(editedFilesLogPath, currentLog + logEntry);
            } catch (error) {
                console.error('Error writing to edited files log:', error);
            }

            // 更新受影响仓库列表
            const affectedReposPath = join(cacheDir, 'affected-repos.txt');
            try {
                let affectedRepos = '';
                if (existsSync(affectedReposPath)) {
                    affectedRepos = readFileSync(affectedReposPath, 'utf-8');
                }

                if (!affectedRepos.includes(`${repo}\n`) && !affectedRepos.endsWith(repo)) {
                    writeFileSync(affectedReposPath, affectedRepos + (affectedRepos ? '\n' : '') + repo);
                }
            } catch (error) {
                console.error('Error updating affected repos:', error);
            }

            // 存储构建命令
            const buildCmd = getBuildCommand(repo);
            const tscCmd = getTscCommand(repo);

            const commandsTempPath = join(cacheDir, 'commands.txt.tmp');
            const commandsPath = join(cacheDir, 'commands.txt');

            try {
                let commands = '';

                if (existsSync(commandsTempPath)) {
                    commands = readFileSync(commandsTempPath, 'utf-8');
                }

                if (buildCmd) {
                    commands += `${repo}:build:${buildCmd}\n`;
                }

                if (tscCmd) {
                    commands += `${repo}:tsc:${tscCmd}\n`;
                }

                if (commands.trim()) {
                    writeFileSync(commandsTempPath, commands);

                    // 去除命令中的重复项
                    const uniqueCommands = commands.trim().split('\n')
                        .filter((cmd, index, arr) => arr.indexOf(cmd) === index)
                        .join('\n');

                    writeFileSync(commandsPath, uniqueCommands + '\n');

                    // 删除临时文件
                    if (existsSync(commandsTempPath)) {
                        // 由于Node.js没有直接的rm命令，我们只是忽略临时文件
                        // 它会被后续的清理操作处理
                    }
                }
            } catch (error) {
                console.error('Error storing commands:', error);
            }

            // 优雅退出
            process.exit(0);
        } catch (parseError) {
            console.error('Error parsing input:', parseError.message);
            process.exit(0);
        }
    } catch (error) {
        console.error('Error in post-tool-use-tracker hook:', error);
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Uncaught error:', err);
    process.exit(1);
});