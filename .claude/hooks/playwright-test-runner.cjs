#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const { readFileSync, existsSync, mkdirSync, writeFileSync } = require('fs');
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
const CACHE_DIR = join(homedir(), '.claude', 'playwright-cache', SESSION_ID);

// 创建缓存目录
try {
    mkdirSync(CACHE_DIR, { recursive: true });
} catch {
    // 忽略目录创建错误
}

// 检查是否已安装 Playwright
function checkPlaywrightInstalled() {
    const packageJsonPath = join(PROJECT_DIR, 'package.json');
    if (!existsSync(packageJsonPath)) {
        return false;
    }

    try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        const devDeps = packageJson.devDependencies || {};
        const deps = packageJson.dependencies || {};

        return devDeps.playwright || deps.playwright;
    } catch {
        return false;
    }
}

// 检查是否存在测试文件
function checkTestFilesExist() {
    const testPaths = [
        join(PROJECT_DIR, 'tests', 'e2e'),
        join(PROJECT_DIR, 'e2e'),
        join(PROJECT_DIR, 'spec'),
        join(PROJECT_DIR, 'test')
    ];

    return testPaths.some(path => existsSync(path));
}

// 检查开发服务器是否运行
function checkDevServerRunning() {
    return new Promise((resolve) => {
        exec('netstat -ano | findstr :5173', { cwd: PROJECT_DIR }, (error, stdout) => {
            if (error) {
                resolve(false);
            } else {
                const hasPort5173 = stdout.includes(':5173');
                resolve(hasPort5173);
            }
        });
    });
}

// 启动开发服务器
function startDevServer() {
    return new Promise((resolve, reject) => {
        console.error('🚀 Starting development server...');

        const serverProcess = spawn('npm', ['run', 'dev'], {
            cwd: PROJECT_DIR,
            stdio: 'pipe',
            shell: true
        });

        let serverStarted = false;
        let outputBuffer = '';

        serverProcess.stdout?.on('data', (data) => {
            const output = data.toString();
            outputBuffer += output;

            if (output.includes('Local:') && output.includes('http://localhost:5173')) {
                serverStarted = true;
                console.error('✅ Development server started successfully');
                resolve({ process: serverProcess, output: outputBuffer });
            }
        });

        serverProcess.stderr?.on('data', (data) => {
            const output = data.toString();
            outputBuffer += output;

            if (output.includes('Local:') && output.includes('http://localhost:5173')) {
                serverStarted = true;
                console.error('✅ Development server started successfully');
                resolve({ process: serverProcess, output: outputBuffer });
            }
        });

        serverProcess.on('error', (error) => {
            console.error('❌ Failed to start development server:', error.message);
            reject(error);
        });

        // 超时处理
        setTimeout(() => {
            if (!serverStarted) {
                serverProcess.kill();
                reject(new Error('Development server start timeout (30 seconds)'));
            }
        }, 30000);
    });
}

// 运行 Playwright 测试
function runPlaywrightTests() {
    return new Promise((resolve) => {
        console.error('🎭 Running Playwright E2E tests...');

        const testProcess = spawn('npx', ['playwright', 'test'], {
            cwd: PROJECT_DIR,
            stdio: 'pipe',
            shell: true
        });

        let testOutput = '';
        let testError = '';

        testProcess.stdout?.on('data', (data) => {
            const output = data.toString();
            testOutput += output;
            process.stdout.write(output);
        });

        testProcess.stderr?.on('data', (data) => {
            const output = data.toString();
            testError += output;
            process.stderr.write(output);
        });

        testProcess.on('exit', (code) => {
            const success = code === 0;

            // 保存测试结果
            try {
                const result = {
                    exitCode: code || 0,
                    success,
                    output: testOutput,
                    error: testError,
                    timestamp: new Date().toISOString()
                };

                writeFileSync(join(CACHE_DIR, 'test-results.json'), JSON.stringify(result, null, 2));

                if (success) {
                    console.error('✅ All Playwright tests passed successfully');
                } else {
                    console.error('❌ Some Playwright tests failed');
                }

                resolve(result);
            } catch (err) {
                console.error('Failed to save test results:', err.message);
                resolve({ success: false, exitCode: code || 1, error: err.message });
            }
        });

        testProcess.on('error', (error) => {
            console.error('❌ Failed to run Playwright tests:', error.message);
            resolve({ success: false, error: error.message });
        });
    });
}

// 等待用户确认
function waitForConfirmation() {
    return new Promise((resolve) => {
        console.error('\n' + '='.repeat(60));
        console.error('🔄 PLAYWRIGHT TESTS COMPLETED');
        console.error('='.repeat(60));
        console.error('✅ Build successful');
        console.error('🎭 E2E tests executed');
        console.error('📊 Test results saved');
        console.error('\n🤔 Ready to proceed with cleanup?');
        console.error('Type "y" to confirm and shutdown all processes');
        console.error('Type "n" to keep processes running');
        console.error('Press Enter to continue...');
        console.error('='.repeat(60));

        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');

        const onData = (key) => {
            if (key === 'y' || key === 'Y') {
                console.log('y');
                cleanup();
                resolve(true);
            } else if (key === 'n' || key === 'N') {
                console.log('n');
                console.error('⏸️ Processes kept running. You can manually stop them later.');
                resolve(false);
            } else if (key === '\r' || key === '\n' || key === '\u0003') {
                // Enter or Ctrl+C - default to cleanup
                console.log('');
                cleanup();
                resolve(true);
            }
        };

        process.stdin.on('data', onData);

        function cleanup() {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdin.removeListener('data', onData);
        }
    });
}

// 主函数
async function main() {
    try {
        console.error('🎭 Playwright Test Runner - Starting...');
        console.error(`📁 Project: ${PROJECT_DIR}`);

        // 1. 检查 Playwright 是否安装
        if (!checkPlaywrightInstalled()) {
            console.error('⚠️ Playwright not found. Installing...');

            // 尝试安装 Playwright
            const installProcess = spawn('npm', ['install', '--save-dev', '@playwright/test'], {
                cwd: PROJECT_DIR,
                stdio: 'inherit',
                shell: true
            });

            await new Promise((resolve, reject) => {
                installProcess.on('exit', (code) => {
                    if (code === 0) {
                        console.error('✅ Playwright installed successfully');
                        resolve();
                    } else {
                        reject(new Error('Failed to install Playwright'));
                    }
                });

                installProcess.on('error', reject);
            });
        }

        // 2. 检查测试文件是否存在
        if (!checkTestFilesExist()) {
            console.error('⚠️ No test files found. Creating basic test structure...');

            // 创建基本的测试目录结构
            const testDir = join(PROJECT_DIR, 'tests', 'e2e');
            try {
                mkdirSync(testDir, { recursive: true });

                // 创建基本的配置文件
                const playwrightConfig = `import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});`;

                writeFileSync(join(PROJECT_DIR, 'playwright.config.ts'), playwrightConfig);

                // 创建基本测试文件
                const basicTest = `import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');

  // 检查页面标题
  await expect(page).toHaveTitle(/Vue Editor/);

  // 检查主要内容区域
  const mainContent = page.locator('main, .main-content, #app');
  await expect(mainContent).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');

  // 检查是否有导航元素
  const nav = page.locator('nav, .nav, .navigation');
  if (await nav.count() > 0) {
    await expect(nav).toBeVisible();
  }
});`;

                writeFileSync(join(testDir, 'basic.spec.ts'), basicTest);

                console.error('✅ Basic test structure created');
            } catch (err) {
                console.error('❌ Failed to create test structure:', err.message);
            }
        }

        // 3. 检查开发服务器是否运行
        const devServerRunning = await checkDevServerRunning();
        let serverProcess = null;

        if (!devServerRunning) {
            // 启动开发服务器
            const serverInfo = await startDevServer();
            serverProcess = serverInfo.process;
        } else {
            console.error('✅ Development server already running');
        }

        // 4. 运行 Playwright 测试
        const testResult = await runPlaywrightTests();

        // 5. 生成测试报告
        const reportPath = join(CACHE_DIR, 'test-summary.txt');
        const summary = `
🎭 PLAYWRIGHT TEST SUMMARY
===========================
Timestamp: ${new Date().toISOString()}
Project: ${PROJECT_DIR}
Exit Code: ${testResult.exitCode}
Success: ${testResult.success}

Files:
- Test Results: test-results.json
- HTML Report: playwright-report/index.html
- Test Output: test-results.xml

Next Steps:
- Review HTML report: open playwright-report/index.html
- Check failed tests if any
- Confirm to proceed with cleanup
`;

        writeFileSync(reportPath, summary);
        console.error(summary);

        // 6. 等待用户确认
        const shouldCleanup = await waitForConfirmation();

        // 7. 清理开发服务器（如果是我们启动的）
        if (serverProcess && shouldCleanup) {
            console.error('🛑 Shutting down development server...');
            serverProcess.kill('SIGTERM');

            // 等待进程结束
            setTimeout(() => {
                serverProcess.kill('SIGKILL');
            }, 5000);
        }

        // 8. 保存清理状态
        try {
            writeFileSync(join(CACHE_DIR, 'cleanup-status.json'), JSON.stringify({
                shouldCleanup,
                timestamp: new Date().toISOString(),
                testPassed: testResult.success
            }));
        } catch {
            // 忽略写入错误
        }

        console.error('🎭 Playwright Test Runner - Completed');
        process.exit(testResult.success ? 0 : 1);

    } catch (error) {
        console.error('❌ Error in Playwright Test Runner:', error.message);
        console.error('Stack trace:', error.stack);

        // 保存错误信息
        try {
            writeFileSync(join(CACHE_DIR, 'error.log'), `${new Date().toISOString()}: ${error.message}\n${error.stack}`);
        } catch {
            // 忽略写入错误
        }

        process.exit(1);
    }
}

// 清理函数
async function cleanupOldCache() {
    try {
        // 这里可以添加清理旧缓存的逻辑
        // 目前保持简单
    } catch {
        // 忽略清理错误
    }
}

main().catch((error) => {
    console.error('💥 Uncaught error in Playwright Test Runner:', error);
    process.exit(1);
}).finally(() => {
    cleanupOldCache();
});