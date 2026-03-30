// child.js

// 1. 监听来自父进程的消息
process.on('message', (msg) => {
  console.log(`[子进程 ${process.pid}] 收到消息:`, msg);

  // 模拟一个耗时的计算任务
  if (msg.type === 'CALCULATE') {
    console.log(`[子进程 ${process.pid}] 开始计算 ${msg.value} * 2 ...`);
    
    setTimeout(() => {
      const result = msg.value * 2;
      
      // 2. 向父进程发送结果
      // process.send 是 fork 模式特有的 API
      process.send({ 
        type: 'RESULT', 
        payload: result,
        status: 'success' 
      });
      
      console.log(`[子进程 ${process.pid}] 计算完成，结果已发送`);
    }, 1000); // 模拟 1 秒延迟
  }
});

// 3. 监听断开连接事件
process.on('disconnect', () => {
  console.log(`[子进程 ${process.pid}] 父进程已断开连接，子进程准备退出`);
});

// 4. 监听错误（防止未捕获异常导致崩溃）
process.on('uncaughtException', (err) => {
  console.error('[子进程] 发生未捕获异常:', err);
  process.exit(1);
});

console.log(`[子进程 ${process.pid}] 已启动，等待指令...`);