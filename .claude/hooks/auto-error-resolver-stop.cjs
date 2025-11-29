#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

/**
 * 集成自动错误解析器的 Stop Hook
 * 在开发会话结束时自动检测和修复 TypeScript 错误
 */
class AutoErrorResolverStopHook {
    constructor(projectDir) {
        this.projectDir = projectDir;
        this.resolverPath = path.join(__dirname, 'auto-error-resolver.cjs');
        this.sessionCache = this.getSessionCacheDir();
    }

    /**
     * 获取当前会话缓存目录
     */
    getSessionCacheDir() {
        // 尝试从多个可能的位置获取会话ID
        const possibleCacheDirs = [
            path.join(this.projectDir, '.claude', 'tsc-cache'),
            path.join(this.projectDir, '.claude', 'session-cache')
        ];

        // 查找最新的缓存目录
        for (const cacheDir of possibleCacheDirs) {
            if (fs.existsSync(cacheDir)) {
                const sessions = fs.readdirSync(cacheDir)
                    .filter(item => {
                        const itemPath = path.join(cacheDir, item);
                        return fs.statSync(itemPath).isDirectory();
                    })
                    .sort((a, b) => {
                        const aTime = fs.statSync(path.join(cacheDir, a)).mtime;
                        const bTime = fs.statSync(path.join(cacheDir, b)).mtime;
                        return bTime - aTime;
                    });

                if (sessions.length > 0) {
                    return path.join(cacheDir, sessions[0]);
                }
            }
        }

        // 如果没有找到会话缓存，使用默认目录
        return path.join(this.projectDir, '.claude', 'tsc-cache', 'default');
    }

    /**
     * 检查是否有文件被修改
     */
    async hasModifiedFiles() {
        try {
            // 检查 edited-files.log
            const editedFilesLog = path.join(this.sessionCache, 'edited-files.log');
            if (fs.existsSync(editedFilesLog)) {
                const logContent = fs.readFileSync(editedFilesLog, 'utf-8');
                return logContent.trim().length > 0;
            }

            // 回退到 git status 检查
            const gitStatus = await new Promise((resolve) => {
                exec('git status --porcelain', { cwd: this.projectDir }, (error, stdout) => {
                    if (error) {
                        resolve('');
                    } else {
                        resolve(stdout.trim());
                    }
                });
            });

            return gitStatus.length > 0;
        } catch (error) {
            console.error('检查文件修改状态时出错:', error.message);
            return false;
        }
    }

    /**
     * 检查是否有 TypeScript 文件被修改
     */
    async hasTypeScriptChanges() {
        try {
            // 检查日志中的文件类型
            const editedFilesLog = path.join(this.sessionCache, 'edited-files.log');
            if (fs.existsSync(editedFilesLog)) {
                const logContent = fs.readFileSync(editedFilesLog, 'utf-8');
                const lines = logContent.trim().split('\n');

                return lines.some(line => {
                    const parts = line.split('\t');
                    if (parts.length >= 3) {
                        const filePath = parts[2];
                        return filePath.match(/\.(ts|tsx|vue|js|jsx)$/);
                    }
                    return false;
                });
            }

            // 回退到 git status 检查
            const gitStatus = await new Promise((resolve) => {
                exec('git status --porcelain', { cwd: this.projectDir }, (error, stdout) => {
                    if (error) {
                        resolve('');
                    } else {
                        resolve(stdout.trim());
                    }
                });
            });

            return gitStatus.split('\n').some(line =>
                line.match(/\.(ts|tsx|vue|js|jsx)$/)
            );
        } catch (error) {
            console.error('检查 TypeScript 变更时出错:', error.message);
            return false;
        }
    }

    /**
     * 检查是否需要运行自动错误修复
     */
    async shouldRunAutoFix() {
        // 1. 检查是否有文件修改
        const hasModified = await this.hasModifiedFiles();
        if (!hasModified) {
            console.error('📄 没有检测到文件修改，跳过自动错误修复');
            return false;
        }

        // 2. 检查是否有 TypeScript 相关的修改
        const hasTSChanges = await this.hasTypeScriptChanges();
        if (!hasTSChanges) {
            console.error('📄 没有 TypeScript 相关文件修改，跳过自动错误修复');
            return false;
        }

        // 3. 检查错误解析器是否存在
        if (!fs.existsSync(this.resolverPath)) {
            console.error('❌ TypeScript 错误解析器不存在:', this.resolverPath);
            return false;
        }

        // 4. 检查是否启用了自动修复（通过配置文件）
        const config = this.loadConfig();
        if (!config.autoFixEnabled) {
            console.error('📄 自动错误修复功能已禁用');
            return false;
        }

        return true;
    }

    /**
     * 加载配置
     */
    loadConfig() {
        const configPath = path.join(this.projectDir, '.claude', 'auto-fix-config.json');

        const defaultConfig = {
            autoFixEnabled: true,
            runOnStop: true,
            maxFixAttempts: 3,
            excludedFiles: [],
            excludePatterns: [
                '*.d.ts',
                'node_modules/**',
                'dist/**',
                'build/**'
            ]
        };

        if (fs.existsSync(configPath)) {
            try {
                const configContent = fs.readFileSync(configPath, 'utf-8');
                return { ...defaultConfig, ...JSON.parse(configContent) };
            } catch (error) {
                console.error('配置文件解析失败，使用默认配置:', error.message);
            }
        }

        return defaultConfig;
    }

    /**
     * 运行 TypeScript 错误自动修复
     */
    async runAutoFix() {
        console.error('🔧 开始运行 TypeScript 错误自动修复...');

        return new Promise((resolve) => {
            exec(`node "${this.resolverPath}"`, {
                cwd: this.projectDir,
                env: { ...process.env, FORCE_COLOR: '1' }
            }, (error, stdout, stderr) => {

                // 解析修复结果
                let fixResult = { fixed: 0, remaining: 0, success: false };

                try {
                    if (stdout) {
                        const lines = stdout.trim().split('\n');
                        const jsonLine = lines.find(line => line.trim().startsWith('{'));
                        if (jsonLine) {
                            fixResult = JSON.parse(jsonLine);
                        }
                    }
                } catch (parseError) {
                    console.error('解析修复结果失败:', parseError.message);
                }

                if (stderr) {
                    console.error('📋 修复器输出:');
                    console.error(stderr);
                }

                if (error && error.code !== 1) {
                    console.error('❌ 自动修复过程中发生错误:', error.message);
                    resolve({
                        success: false,
                        error: error.message,
                        fixResult
                    });
                } else {
                    console.error(`✅ 自动修复完成 - 修复了 ${fixResult.fixed} 个错误，剩余 ${fixResult.remaining} 个错误`);
                    resolve({
                        success: fixResult.success || fixResult.fixed > 0,
                        fixResult
                    });
                }
            });
        });
    }

    /**
     * 生成会话总结报告
     */
    generateSessionReport(autoFixResult) {
        const report = [];

        report.push('\n' + '='.repeat(60));
        report.push('🚀 开发会话结束 - 自动错误修复报告');
        report.push('='.repeat(60));

        // 会话信息
        report.push(`📁 项目: ${path.basename(this.projectDir)}`);
        report.push(`⏰ 时间: ${new Date().toLocaleString('zh-CN')}`);
        report.push(`📂 会话缓存: ${path.relative(this.projectDir, this.sessionCache)}`);

        // 自动修复结果
        if (autoFixResult.success) {
            report.push(`✅ 自动修复成功: 修复了 ${autoFixResult.fixResult.fixed} 个 TypeScript 错误`);

            if (autoFixResult.fixResult.remaining > 0) {
                report.push(`⚠️ 仍有 ${autoFixResult.fixResult.remaining} 个错误需要手动处理`);
                report.push('💡 建议运行 `npm run type-check` 查看详细错误信息');
            }
        } else {
            report.push(`❌ 自动修复失败: ${autoFixResult.error || '未知错误'}`);
        }

        // 下一步建议
        report.push('\n📋 下一步建议:');

        if (autoFixResult.fixResult && autoFixResult.fixResult.fixed > 0) {
            report.push('  ✨ 验证修复后的代码功能是否正常');
            report.push('  🔍 运行测试确保修复没有破坏现有功能');
            report.push('  📝 提交修复后的代码更改');
        }

        if (autoFixResult.fixResult && autoFixResult.fixResult.remaining > 0) {
            report.push('  🔧 手动处理剩余的 TypeScript 错误');
            report.push('  📖 查看错误详情: npm run type-check');
        }

        report.push('  🚀 如果满意，可以运行构建: npm run build');
        report.push('  🔄 如果需要继续开发，重新启动开发服务器: npm run dev');

        report.push('\n' + '='.repeat(60));

        return report.join('\n');
    }

    /**
     * 清理会话缓存
     */
    async cleanupSessionCache() {
        try {
            const config = this.loadConfig();

            if (!config.keepSessionCache) {
                // 保留最近3个会话的缓存
                const parentCacheDir = path.dirname(this.sessionCache);
                if (fs.existsSync(parentCacheDir)) {
                    const sessions = fs.readdirSync(parentCacheDir)
                        .map(session => ({
                            name: session,
                            path: path.join(parentCacheDir, session),
                            mtime: fs.statSync(path.join(parentCacheDir, session)).mtime
                        }))
                        .sort((a, b) => b.mtime - a.mtime);

                    // 删除旧的会话缓存（保留最近3个）
                    for (let i = 3; i < sessions.length; i++) {
                        this.removeDirectory(sessions[i].path);
                        console.error(`🗑️  已清理旧会话缓存: ${sessions[i].name}`);
                    }
                }
            }
        } catch (error) {
            console.error('清理会话缓存时出错:', error.message);
        }
    }

    /**
     * 递归删除目录
     */
    removeDirectory(dirPath) {
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
        }
    }

    /**
     * 主执行函数
     */
    async execute() {
        try {
            console.error('🛑 Stop Hook: TypeScript 自动错误解析器启动...');

            // 检查是否应该运行自动修复
            const shouldRun = await this.shouldRunAutoFix();

            if (!shouldRun) {
                console.error('⏭️  跳过自动错误修复');
                process.exit(0);
                return;
            }

            // 运行自动修复
            const autoFixResult = await this.runAutoFix();

            // 生成报告
            const report = this.generateSessionReport(autoFixResult);
            console.error(report);

            // 清理缓存
            await this.cleanupSessionCache();

            // 根据结果设置退出码
            process.exit(autoFixResult.success ? 0 : 1);

        } catch (error) {
            console.error('💥 Stop Hook 执行失败:', error.message);
            console.error(error.stack);
            process.exit(1);
        }
    }
}

/**
 * 主函数
 */
async function main() {
    const projectDir = process.cwd();
    const hook = new AutoErrorResolverStopHook(projectDir);
    await hook.execute();
}

// 运行主函数
if (require.main === module) {
    main();
}

module.exports = AutoErrorResolverStopHook;