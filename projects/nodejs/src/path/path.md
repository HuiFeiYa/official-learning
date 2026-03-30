## path.resolve() 方法
> path.resolve() 方法将一系列路径或路径段解析为绝对路径。


* path.resolve() 默认以当前 Node.js 进程的「工作目录（process.cwd()）」为解析起点.
* 无论代码写在项目中哪个层级的 JS 文件里（比如根目录的 index.js、深层目录的 ./doc/a.js），只要这些 JS 文件属于同一个 Node.js 进程，其内部调用的 path.resolve() 所依赖的 process.cwd() 都是同一个值 —— 即启动该进程时执行 node 命令的目录（而非 JS 文件本身的存放目录，也非 JS 文件的执行目录）。

## path.join() 方法
> path.join() 方法使用特定于平台的分隔符作为分隔符，将所有给定的 path 片段连接在一起，然后规范化生成的路径。