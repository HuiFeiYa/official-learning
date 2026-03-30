## return await primose vs return primose
- 演示差异一：try/catch 捕获行为
  - return await 会在当前函数内“展开”Promise，拒绝会被本函数的 try/catch 捕获并可就地处理或改写再抛出。
  - return 直接返回 Promise，拒绝发生在函数返回之后，当前函数内的 try/catch 不会捕获到该拒绝。
- 演示差异二：finally 执行时机
  - return await：等待 Promise 完成后再执行 finally，再把结果/错误交给调用方。
  - return：立即执行 finally（不等待 Promise 完成），调用方稍后才收到结果/错误。


要点总结

- 错误捕获：return await 触发本函数的 try/catch；return 由调用方的 catch 处理。
- 清理时机：return await 的 finally 在等待完成后执行；return 的 finally 立即执行。
- 性能差异：return await 多一次微任务调度，通常可忽略。
- 实战建议：默认 return；只有在需要在函数内统一处理/包装错误或控制 finally 时机时使用 return await。

## 返回值对比

* 如果返回的是非 promise 会被包装成 promise” -> ✅ 正确。这是 async 函数的定义行为。
* “如果返回的是 promise 就省略了这一步（包装）” -> ✅ 正确。这叫 Promise Flattening (Promise 扁平化)，它避免了不必要的双重包装（Double Wrapping）。