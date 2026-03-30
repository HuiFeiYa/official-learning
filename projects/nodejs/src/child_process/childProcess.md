## Node.js 需要 child_process 的根本原因

* Node 是单线程，CPU 密集任务会阻塞主线程
* 子进程可以把重活剥离，不影响主服务
* 让 Node 能调用系统命令、第三方程序
  * Node.js 本身只是 JavaScript 运行时，它不会自己执行系统命令、也不会自己跑 FFmpeg、Git、Python、Java 等。Node 不负责帮你跨平台，你要自己处理
```js
    // 让 Node 执行系统命令：ls（Mac/Linux）
    const { exec } = require('child_process')
    const os = require('os')

    const isWin = os.platform() === 'win32'

    if (isWin) {
    exec('dir', (err, out) => console.log(out))
    } else {
    exec('ls', (err, out) => console.log(out))
    }

    exec('mkdir test_folder', () => {
        console.log('创建成功');
    });
  ```
* 利用多核 CPU，提升服务性能
* 隔离风险，防止任务崩溃拖垮主服务


# child_process 4 种常用方法（简单记）

* spawn：最基础，适合执行耗时命令、大数据流
* exec：简单执行命令，返回缓冲结果
* execFile：更安全，执行可执行文件
* fork：专门用于 JS 文件，进程间通信最方便（最常用）



## exec vs execFile 差异


| 对比项 | exec | execFile |
|--------|------|----------|
| 执行方式 | 通过 shell 执行命令字符串 | 直接调用可执行文件，默认不使用 shell |
| 参数形式 | 整条命令字符串 | 命令 + 参数数组 |
| shell 语法（&&, |, >） | 支持 | 不支持 |
| 安全性 | 低，存在命令注入风险 | 高，参数为纯文本，无注入风险 |
| 性能 | 稍慢（需启动 shell 进程） | 更快（直接执行） |
| 适用对象 | 命令行语句、shell 内置命令 | 可执行文件：node, git, python, ffmpeg 等 |
| Windows 内置命令（dir/copy） | 直接执行 | 默认不可执行，需配置 `{ shell: true }` |

* 多命令执行（&& 场景）


exec（支持）

```JS
const { exec } = require('child_process');

exec('node --version && npm --version', (err, stdout) => {
  console.log(stdout);
});

```
execFile（不支持，需串行调用）


```JS
const { execFile } = require('child_process');

execFile('node', ['--version'], (err, out1) => {
  execFile('npm', ['--version'], (err, out2) => {
    console.log(out1 + out2);
  });
});
```

## fork

**定义**：`child_process.fork()` 是 `spawn()` 方法的特例，**专门用于衍生新的 Node.js 进程**。
- **核心特征**：
    - **独立性**：子进程拥有独立的 V8 实例、独立的内存堆栈。
    - **内置 IPC**：与其他 spawn 方法不同，`fork` 会自动在父子进程间建立一条**额外的通信通道（IPC）**。
    - **非系统调用**：不同于操作系统的 `fork(2)`（复制当前进程），Node 的 `fork` 是启动一个新的 Node 实例来运行指定的模块文件。



### 父进程侧
```javascript
const { fork } = require('child_process');

// 启动子进程
const child = fork('./child.js', ['arg1', 'arg2'], {
  cwd: '/path/to/dir',
  env: { KEY: 'VALUE' },
  silent: false, // 是否通过管道将 stdio 传给父进程
  execPath: '/path/to/node' // 指定 Node 可执行文件路径
});

// 发送消息
child.send({ type: 'task', data: 'hello' });

// 接收消息
child.on('message', (msg) => {
  console.log('收到:', msg);
});

// 关闭连接 (优雅退出)
child.disconnect(); 

// 强制杀死
child.kill('SIGTERM');


### 子进程侧


// 接收父进程消息
process.on('message', (msg) => {
  console.log('收到父进程:', msg);
  // 处理逻辑...
  process.send({ result: 'done' });
});

// 发送消息给父进程
process.send({ status: 'started' });

// 监听断开
process.on('disconnect', () => {
  process.exit(0);
});

## spawn vs fork 使用

`spawn` 用于启动外部命令或可执行文件（如 Python、Shell 脚本、系统命令），并以流（Stream）的方式与子进程通信。它适合处理**大量数据输出**或**长时间运行的任务**。


### 基本语法

```javascript
const { spawn } = require('child_process');

// 启动外部命令（如 Python 脚本）
const child = spawn('python', ['script.py', 'arg1', 'arg2'], {
  stdio: 'pipe', // 默认值，可自定义输入输出流
});

child.stdout.on('data', (data) => {
  console.log(`输出: ${data}`);
});

child.stderr.on('data', (data) => {
  console.error(`错误: ${data}`);
});
```

### spawn 与 fork 的差异

* 用 spawn 处理外部命令、Python 脚本、Shell 脚本等。
* 用 fork 处理 Node.js 内部任务拆分、CPU 密集型计算等。

| 特性 | `spawn` | `fork` |
| :--- | :--- | :--- |
| 适用场景 | 启动外部程序（如 Python、Shell、系统命令） | 启动另一个 Node.js 脚本 |
| 通信方式 | 流式（Stream）：`stdout`/`stdin` | 进程间通信（IPC）：`send()`/`on('message')` |
| 数据处理 | 适合处理大量数据流（如日志、文件） | 适合传递 JSON 对象、结构化数据 |
| 性能开销 | 较高（启动外部进程的开销） | 较低（同为 Node.js 进程，共享 V8 实例） |
| 依赖环境 | 依赖系统环境变量和可执行文件路径 | 仅依赖 Node.js 环境 |


### spawn 与 exec 的差异

* spawn 是为了流式处理大量数据或长时间运行的进程，
* 而 exec 是为了方便地执行简单命令并一次性获取结果。

| 特性 | `spawn` | `exec` |
| :--- | :--- | :--- |
| 输出处理 | 流式 (Stream)，实时处理，无内存限制 | 缓冲 (Buffer)，一次性返回，有内存限制 (默认 200KB) |
| Shell 调用 | 默认不调用 Shell，直接执行文件 | 总是调用 Shell (`/bin/sh` 或 `cmd.exe`) |
| 参数传递 | 命令和参数分开传递 (数组形式) | 命令和参数作为一个字符串传递 |
| 适用场景 | 长时间运行、输出量大的进程 | 短期运行、输出量小的简单命令 |
| 安全性 | 高，不易受命令注入攻击 | 低，直接拼接用户输入易导致命令注入 |


* 优先使用 spawn：当你需要处理大量数据、需要实时获取输出、或运行一个长时间的服务时。*
* 谨慎使用 exec：当你只需要运行一个简单的系统命令（如 git status），并且确定输出量很小，同时需要 Shell 的语法特性时。使用时务必对用户输入进行严格过滤。*
