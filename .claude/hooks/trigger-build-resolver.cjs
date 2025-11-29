#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// 获取正确的项目目录
function getProjectDir() {
    const projectDir = process.cwd();
    return path.normalize(path.resolve(projectDir));
}

async function main() {
    try {
        // 添加调试信息，确认hook被调用
        console.error('🔄 Trigger build resolver hook started...');

        const projectDir = getProjectDir();
        console.error(`📁 Project directory: ${projectDir}`);

        // 如果没有Vue项目，跳过构建解析
        const packageJsonPath = path.join(projectDir, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            console.error('❌ No package.json found, skipping build resolver...');
            process.exit(0);
        }

        // Check for git changes in the current Vue project
        const gitStatus = await new Promise((resolve) => {
            exec('git status --porcelain', { cwd: projectDir }, (error, stdout) => {
                if (error) {
                    // 如果git不可用，跳过git检查
                    resolve('');
                } else {
                    resolve(stdout.trim());
                }
            });
        });

        if (gitStatus) {
            console.error(`Vue project has changes:`, gitStatus.replace(/\n/g, ' | '));

            // Analyze what types of files changed
            const changedFiles = gitStatus.split('\n').filter(line => line.trim());
            const vueChanges = changedFiles.filter(line => line.includes('.vue'));
            const tsChanges = changedFiles.filter(line => line.includes('.ts') || line.includes('.js'));
            const styleChanges = changedFiles.filter(line => line.includes('.scss') || line.includes('.css'));
            const configChanges = changedFiles.filter(line =>
                line.includes('vite.config.') ||
                line.includes('package.json') ||
                line.includes('tsconfig.')
            );

            console.error(`File changes summary:`);
            console.error(`  Vue files: ${vueChanges.length}`);
            console.error(`  TypeScript/JS files: ${tsChanges.length}`);
            console.error(`  Style files: ${styleChanges.length}`);
            console.error(`  Config files: ${configChanges.length}`);

            // 检查是否有TypeScript文件
            const hasTsFiles = vueChanges.length > 0 || tsChanges.length > 0;

            if (hasTsFiles) {
                // 检查tsconfig文件是否存在
                const tsconfigPath = path.join(projectDir, 'tsconfig.json');
                const tsconfigAppPath = path.join(projectDir, 'tsconfig.app.json');

                if (fs.existsSync(tsconfigAppPath) || fs.existsSync(tsconfigPath)) {
                    console.error('TypeScript files changed - TypeScript check may be needed');
                }
            }

            // 检查是否需要构建
            let hasBuildScripts = false;
            let buildCommand = 'npm run build';

            try {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                hasBuildScripts = !!(packageJson.scripts && (packageJson.scripts.build || packageJson.scripts['build-only']));
                if (packageJson.scripts && packageJson.scripts['build-only']) {
                    buildCommand = 'npm run build-only';
                } else if (packageJson.scripts && packageJson.scripts.build) {
                    buildCommand = 'npm run build';
                }
                console.error(`Build scripts found. Build command: ${buildCommand}`);
            } catch (e) {
                console.error('Error reading package.json:', e.message);
            }

            if (hasBuildScripts) {
                console.error('Build may be needed after changes are complete');
            }

            console.error('Build resolver analysis complete');
        } else {
            console.error('No changes detected in Vue project — skipping build resolver.');
        }

        process.exit(0);
    } catch (error) {
        console.error('💥 Error in trigger-build-resolver hook:', error.message);
        console.error('💥 Stack trace:', error.stack);
        process.exit(0);
    }
}

main().catch((error) => {
    console.error('💥 Uncaught error in trigger-build-resolver:', error);
    console.error('💥 Stack trace:', error.stack);
    process.exit(0);
});