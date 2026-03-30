// parent.js
const { fork } = require('child_process');
const path = require('path');

console.log(`[父进程 ${process.pid}] 准备启动子进程...`);

// 1. 定义子进程路径
const childPath = path.join(__dirname, 'child.js');

// 2. 配置选项
const options = {
  cwd: __dirname,
  // 传递环境变量
  env: { ...process.env, NODE_ENV: 'production' },
  // 这里的 execArgv 可以传递 --inspect 等参数给子进程
  execArgv: [] 
};

// 3. 启动 Fork
// 第二个参数是传递给子进程脚本的命令行参数 (process.argv)
const child = fork(childPath, ['--debug-mode'], options);

// 4. 监听子进程的消息
child.on('message', (msg) => {
  console.log(`[父进程 ${process.pid}] 收到子进程消息:`, msg);

  if (msg.type === 'RESULT') {
    console.log(`[父进程] 验证成功！最终计算结果是: ${msg.payload}`);
    
    // 任务完成，优雅关闭子进程
    // child.kill() 是强制杀死，child.disconnect() 是断开 IPC 通道让其自然退出
    child.disconnect(); 
  }
});

// 5. 监听子进程退出
child.on('exit', (code, signal) => {
  console.log(`[父进程] 子进程已退出。代码: ${code}, 信号: ${signal}`);
  process.exit(0);
});

// 6. 监听子进程错误
child.on('error', (err) => {
  console.error('[父进程] 启动子进程失败:', err);
});

// 7. 向子进程发送数据
// 稍微延迟发送，确保子进程已经准备好监听 'message' 事件
setTimeout(() => {
  console.log(`[父进程 ${process.pid}] 发送计算任务...`);
  child.send({ type: 'CALCULATE', value: 21 });
}, 500);