// worker.js

// 1. 获取命令行参数 (process.argv[2] 是第一个参数)
const name = process.argv[2] || '陌生人';
const count = parseInt(process.argv[3]) || 3;

console.log(`[JS Worker] 你好, ${name}! 我将开始倒计时 ${count} 秒...`);

// 2. 模拟耗时任务 (持续输出数据，验证 spawn 的流式特性)
let i = count;
const timer = setInterval(() => {
  console.log(`[JS Worker] 进度: 还剩 ${i} 秒...`);
  i--;

  if (i < 0) {
    clearInterval(timer);
    console.log(`[JS Worker] 任务完成！结果是: ${count * 2}`);
    
    // 退出进程，返回状态码 0
    process.exit(0);
  }
}, 1000);

// 3. 处理错误情况
process.on('uncaughtException', (err) => {
  console.error('[JS Worker] 发生错误:', err.message);
  process.exit(1);
});