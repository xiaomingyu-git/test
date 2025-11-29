#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 检查用户输入是否包含 "ftest" 命令
 * 如果包含，触发完整的测试流程
 */

function checkForFtestCommand() {
  try {
    // 读取用户输入日志文件（如果存在）
    const logFile = path.join(process.cwd(), '.claude', 'user-input.log');

    if (!fs.existsSync(logFile)) {
      return;
    }

    const content = fs.readFileSync(logFile, 'utf8');
    const lastLine = content.trim().split('\n').pop();

    if (lastLine && lastLine.toLowerCase().includes('/fest')) {
      console.log('🚀 检测到 /fest 命令，开始完整测试流程...');

      // 清除日志文件，避免重复触发
      fs.writeFileSync(logFile, '');

      // 触发测试流程
      runFullTestSuite();
    }
  } catch (error) {
    console.error('检查 ftest 命令时出错:', error.message);
  }
}

function runFullTestSuite() {
  console.log('\n📋 开始完整测试流程...');
  console.log('1️⃣ 检查 ESLint 和 TypeScript 错误');
  console.log('2️⃣ 执行构建');
  console.log('3️⃣ 启动项目');
  console.log('4️⃣ 运行 Playwright 测试');
  console.log('5️⃣ 清理进程\n');

  // 步骤1: 运行 vsc-check
  runProcess('node', ['.claude/hooks/vsc-check.cjs'], () => {
    // 步骤2: 运行构建
    runProcess('node', ['.claude/hooks/trigger-build-resolver.cjs'], () => {
      // 步骤3: 启动项目
      runProcess('node', ['.claude/hooks/start-project-for-tests.cjs'], () => {
        // 等待项目启动
        setTimeout(() => {
          // 步骤4: 运行 Playwright 测试
          runProcess('node', ['.claude/hooks/playwright-test-runner.cjs'], () => {
            // 步骤5: 清理进程
            runProcess('node', ['.claude/hooks/process-cleanup.cjs'], () => {
              console.log('✅ 完整测试流程完成！');
            });
          });
        }, 5000); // 等待5秒让项目完全启动
      });
    });
  });
}

function runProcess(command, args, callback) {
  const { spawn } = require('child_process');

  const process = spawn(command, args, {
    stdio: 'inherit',
    shell: true
  });

  process.on('close', (code) => {
    if (code !== 0) {
      console.error(`进程 ${command} ${args.join(' ')} 退出，代码: ${code}`);
    }
    if (callback) {
      callback();
    }
  });

  process.on('error', (error) => {
    console.error(`运行 ${command} ${args.join(' ')} 时出错:`, error.message);
    if (callback) {
      callback();
    }
  });
}

// 执行检查
checkForFtestCommand();