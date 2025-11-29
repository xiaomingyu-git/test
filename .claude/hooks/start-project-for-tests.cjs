#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 启动项目用于测试
 * 将进程信息保存到文件中，以便后续清理
 */

function startProjectForTests() {
  console.log('🚀 启动项目用于测试...');

  // 检查是否是 Vue/React 项目
  const packageJsonPath = path.join(process.cwd(), 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.log('❌ 未找到 package.json，无法启动项目');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const scripts = packageJson.scripts || {};

  // 确定启动命令
  let startCommand = 'dev';
  if (scripts.dev) {
    startCommand = 'dev';
  } else if (scripts.start) {
    startCommand = 'start';
  } else if (scripts.serve) {
    startCommand = 'serve';
  } else {
    console.log('⚠️ 未找到启动脚本，跳过项目启动');
    return;
  }

  const { spawn } = require('child_process');

  // 启动开发服务器
  const childProcess = spawn('npm', ['run', startCommand], {
    stdio: 'pipe',
    shell: true,
    detached: true
  });

  // 保存进程信息
  const processInfo = {
    pid: childProcess.pid,
    command: `npm run ${startCommand}`,
    startTime: new Date().toISOString(),
    type: 'dev-server'
  };

  const processInfoFile = path.join(process.cwd(), '.claude', 'test-process-info.json');

  // 确保目录存在
  const dir = path.dirname(processInfoFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(processInfoFile, JSON.stringify(processInfo, null, 2));

  console.log(`✅ 项目已启动 (PID: ${childProcess.pid})`);
  console.log(`📝 进程信息已保存到: ${processInfoFile}`);

  // 监听进程输出
  childProcess.stdout.on('data', (data) => {
    const output = data.toString();
    if (output.includes('Local:') || output.includes('ready')) {
      console.log('🌐 开发服务器已就绪');
    }
  });

  childProcess.stderr.on('data', (data) => {
    console.error('启动错误:', data.toString());
  });

  // 分离进程，让它继续在后台运行
  childProcess.unref();
}

// 启动项目
startProjectForTests();