## process.argv

> process.argv 属性返回一个数组, 记录了启动当前进程时的所有命令行信息。

### 固定结构：
* argv[0]：Node 引擎路径（如 node.exe 的绝对路径），即“谁在运行”。
* argv[1]：脚本文件路径（如 app.js 的绝对路径），即“运行的是哪个文件”。
* argv[2] ~ end：用户参数，即你实际传入的业务数据。

### 常用用法：
使用 process.argv.slice(2) 截取数组，直接获取纯净的用户参数列表。默认按空格分隔；若需保留空格，需用引号（"" 或 ''）包裹，引号会被自动去除。


## cwd

> 你在终端里「cd 到哪个目录」，然后在这个目录下敲 node xxx.js，这个目录就是 Node 进程的「当前工作目录」，process.cwd() 就返回这个目录的绝对路径。

可以通过 `process.chdir()` 方法手动切换当前工作目录。
```js
// 手动切换到上级目录
process.chdir('../');
console.log('切换后 cwd =', process.cwd());

// 再切换到根目录（示例）
process.chdir('/');
console.log('根目录 cwd =', process.cwd());
```