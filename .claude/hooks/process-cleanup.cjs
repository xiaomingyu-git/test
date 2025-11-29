#!/usr/bin/env node

const { exec } = require('child_process');
const { readFileSync, existsSync, writeFileSync } = require('fs');
const { join, resolve, normalize } = require('path');
const { homedir } = require('os');

// 获取项目目录
function getProjectDir() {
    const projectDir = process.cwd();
    return normalize(resolve(projectDir));
}

// 尝试从stdin读取输入
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

const PROJECT_DIR = getProjectDir();
const CACHE_DIR = join(homedir(), '.claude', 'cleanup-cache', SESSION_ID);

// 检查进程是否运行
function checkProcessRunning(command, port) {
    return new Promise((resolve) => {
        const checkCmd = process.platform === 'win32'
            ? `netstat -ano | findstr :${port}`
            : `lsof -ti :${port}`;

        exec(checkCmd, { cwd: PROJECT_DIR }, (error, stdout) => {
            if (error) {
                resolve(false);
            } else {
                resolve(stdout.trim().length > 0);
            }
        });
    });
}

// 获取进程ID
function getProcessId(command, port) {
    return new Promise((resolve) => {
        const checkCmd = process.platform === 'win32'
            ? `netstat -ano | findstr :${port}`
            : `lsof -ti :${port}`;

        exec(checkCmd, { cwd: PROJECT_DIR }, (error, stdout) => {
            if (error || !stdout.trim()) {
                resolve(null);
            } else {
                const lines = stdout.trim().split('\n');
                if (lines.length > 0) {
                    const parts = lines[0].trim().split(/\s+/);
                    const pid = process.platform === 'win32' ? parts[parts.length - 1] : parts[0];
                    resolve(pid);
                } else {
                    resolve(null);
                }
            }
        });
    });
}

// 杀死指定端口上的进程
function killProcessOnPort(port) {
    return new Promise((resolve) => {
        if (process.platform === 'win32') {
            // Windows
            exec(`netstat -ano | findstr :${port}`, { cwd: PROJECT_DIR }, (error, stdout) => {
                if (!error && stdout.trim()) {
                    const lines = stdout.trim().split('\n');
                    const pids = new Set();

                    lines.forEach(line => {
                        const parts = line.trim().split(/\s+/);
                        if (parts.length > 1) {
                            const pid = parts[parts.length - 1];
                            if (pid && pid !== '0') {
                                pids.add(pid);
                            }
                        }
                    });

                    const killPromises = Array.from(pids).map(pid => {
                        return new Promise(resolve => {
                            exec(`taskkill /PID ${pid} /F`, { cwd: PROJECT_DIR }, (_error, _stdout, _stderr) => {
                                console.error(`🔄 Killed process ${pid} on port ${port}`);
                                resolve();
                            });
                        });
                    });

                    Promise.all(killPromises).then(() => resolve());
                } else {
                    resolve();
                }
            });
        } else {
            // Unix-like systems
            exec(`lsof -ti :${port}`, { cwd: PROJECT_DIR }, (error, stdout) => {
                if (!error && stdout.trim()) {
                    const pids = stdout.trim().split('\n');
                    const killPromises = pids.map(pid => {
                        return new Promise(resolve => {
                            exec(`kill -9 ${pid}`, { cwd: PROJECT_DIR }, () => {
                                console.error(`🔄 Killed process ${pid} on port ${port}`);
                                resolve();
                            });
                        });
                    });

                    Promise.all(killPromises).then(() => resolve());
                } else {
                    resolve();
                }
            });
        }
    });
}

// 检查并清理开发相关进程
async function cleanupDevelopmentProcesses() {
    console.error('🧹 Starting development process cleanup...');

    const commonPorts = [5173, 3000, 8080, 4173, 3100];
    const results = [];

    for (const port of commonPorts) {
        const isRunning = await checkProcessRunning('dev', port);

        if (isRunning) {
            const pid = await getProcessId('dev', port);
            results.push({ port, pid, running: true });

            console.error(`🔍 Found process on port ${port}${pid ? ` (PID: ${pid})` : ''}`);
            await killProcessOnPort(port);
            console.error(`✅ Port ${port} cleared`);
        } else {
            results.push({ port, pid: null, running: false });
        }
    }

    return results;
}

// 清理Node.js进程
function cleanupNodeProcesses() {
    return new Promise((resolve) => {
        const findCmd = process.platform === 'win32'
            ? 'wmic process where "name=\'node.exe\'" get ProcessId,CommandLine'
            : 'ps aux | grep node';

        exec(findCmd, { cwd: PROJECT_DIR }, (error, stdout) => {
            if (error) {
                console.error('⚠️ Could not list Node.js processes');
                resolve([]);
                return;
            }

            const lines = stdout.split('\n');
            const nodeProcesses = [];

            lines.forEach(line => {
                if (line.includes('node') &&
                    (line.includes('vite') ||
                     line.includes('playwright') ||
                     line.includes('dev') ||
                     line.includes('serve'))) {

                    const parts = line.trim().split(/\s+/);
                    const pidIndex = process.platform === 'win32' ? parts.length - 1 : 1;
                    const pid = parts[pidIndex];

                    if (pid && !isNaN(parseInt(pid))) {
                        nodeProcesses.push({
                            pid: parseInt(pid),
                            command: line.trim(),
                            project: line.includes(PROJECT_DIR)
                        });
                    }
                }
            });

            // 只清理与当前项目相关的进程
            const projectProcesses = nodeProcesses.filter(p => p.project);

            projectProcesses.forEach(proc => {
                try {
                    if (process.platform === 'win32') {
                        exec(`taskkill /PID ${proc.pid} /F`, { cwd: PROJECT_DIR });
                    } else {
                        exec(`kill -9 ${proc.pid}`, { cwd: PROJECT_DIR });
                    }
                    console.error(`🔄 Killed Node.js process ${proc.pid}`);
                } catch (err) {
                    console.error(`⚠️ Failed to kill process ${proc.pid}:`, err.message);
                }
            });

            resolve(projectProcesses);
        });
    });
}

// 检查是否应该清理（基于之前的测试结果）
function shouldCleanup() {
    try {
        const playwrightCache = join(homedir(), '.claude', 'playwright-cache', SESSION_ID);
        const cleanupStatusPath = join(playwrightCache, 'cleanup-status.json');

        if (existsSync(cleanupStatusPath)) {
            const status = JSON.parse(readFileSync(cleanupStatusPath, 'utf-8'));
            return status.shouldCleanup !== false; // 默认清理
        }
    } catch {
        // 如果读取失败，默认清理
    }
    return true;
}

// 生成清理报告
function generateCleanupReport(portResults, nodeProcesses, startTime) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    const report = {
        timestamp: new Date().toISOString(),
        duration: duration,
        project: PROJECT_DIR,
        sessionId: SESSION_ID,
        results: {
            ports: portResults,
            nodeProcesses: nodeProcesses.length,
            shouldCleanup: shouldCleanup()
        }
    };

    try {
        writeFileSync(join(CACHE_DIR, 'cleanup-report.json'), JSON.stringify(report, null, 2));
    } catch (err) {
        console.error('⚠️ Could not save cleanup report:', err.message);
    }

    return report;
}

// 主函数
async function main() {
    const startTime = Date.now();

    try {
        console.error('🛑 Process Cleanup - Starting...');
        console.error(`📁 Project: ${PROJECT_DIR}`);

        // 检查是否应该执行清理
        if (!shouldCleanup()) {
            console.error('⏸️ Cleanup skipped based on previous selection');
            console.error('💡 Processes are kept running for your convenience');
            process.exit(0);
        }

        console.error('🧹 Executing full cleanup process...');

        // 1. 清理开发服务器进程
        const portResults = await cleanupDevelopmentProcesses();

        // 2. 清理Node.js相关进程
        const nodeProcesses = await cleanupNodeProcesses();

        // 3. 清理临时文件（可选，可以注释掉如果需要保留）
        // cleanupTempFiles();

        // 4. 生成清理报告
        const report = generateCleanupReport(portResults, nodeProcesses, startTime);

        // 5. 显示清理摘要
        console.error('\n' + '='.repeat(60));
        console.error('🛑 CLEANUP SUMMARY');
        console.error('='.repeat(60));
        console.error(`⏱️ Duration: ${report.duration}ms`);
        console.error(`🔌 Ports cleared: ${portResults.filter(p => p.running).length}`);
        console.error(`📦 Node.js processes killed: ${nodeProcesses.length}`);
        console.error(`📂 Project: ${PROJECT_DIR}`);
        console.error('='.repeat(60));

        if (portResults.filter(p => p.running).length > 0 || nodeProcesses.length > 0) {
            console.error('✅ Development processes cleaned up successfully');
        } else {
            console.error('ℹ️ No development processes found to clean');
        }

        console.error('\n🎉 All development processes have been stopped');
        console.error('💡 You can now safely close your development session');

        // 等待一下确保进程完全结束
        setTimeout(() => {
            console.error('\n👋 Cleanup complete. Have a great day!');
            process.exit(0);
        }, 1000);

    } catch (error) {
        console.error('❌ Error in Process Cleanup:', error.message);
        console.error('Stack trace:', error.stack);

        try {
            writeFileSync(join(CACHE_DIR, 'cleanup-error.log'), `${new Date().toISOString()}: ${error.message}\n${error.stack}`);
        } catch {
            // 忽略写入错误
        }

        process.exit(1);
    }
}

main().catch((error) => {
    console.error('💥 Uncaught error in Process Cleanup:', error);
    process.exit(1);
});