## file 协议

file 协议是一种 URL 方案（URL scheme），它的作用是将本地文件系统中的文件或目录映射成一个标准的 URL 格式。
* 标准格式：file:// + 文件在系统中的绝对路径。
* 统一分隔符：无论操作系统使用什么路径分隔符，file 协议 URL 总是使用正斜杠 /。


### 不同系统的路径格式

在 Windows 系统上，file 协议的路径格式如下：
```
file:///C:/Users/YourName/project/app.js
```



macOS 和 🐧 Linux 下的 file 协议
长相： file:///Users/name/file.txt (Mac)
长相： file:///home/name/file.txt (Linux)
为什么长这样？
Mac 和 Linux 属于 Unix-like 系统，它们的文件系统是单一树状结构，没有“C盘、D盘”的概念。
file://：协议头。
/：第三个斜杠。
/Users/...：关键点。直接跟根目录 /。在 Unix 系统中，一切皆从根目录 / 开始。




## 🛠️ `fileURLToPath` 与 `pathToFileURL` 使用场景汇总

在 Node.js 的 ES 模块开发中，这两个 API 是连接**“Web 标准（URL）”**与**“操作系统文件系统（Path）”**的桥梁。

### 📥 `fileURLToPath(url)`

**方向**：`file://` URL ➡️ 系统路径字符串

**核心场景 1：在 ES 模块中获取 `__dirname` 和 `__filename`**
这是最常见的用法。因为 ES 模块中全局变量 `__dirname` 已不存在，必须通过 `import.meta.url` 转换而来。

```javascript
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import fs from 'node:fs';

// 1. 获取当前文件的 URL (例如: file:///C:/Users/Name/project/app.js)
const currentFileUrl = import.meta.url;

// 2. 转换为本地文件路径 (例如: C:\Users\Name\project\app.js)
const currentFilePath = fileURLToPath(currentFileUrl);

// 3. 获取当前目录路径 (模拟 __dirname)
const __dirname = dirname(currentFilePath);

// 4. 使用场景：读取同目录下的配置文件
const config = fs.readFileSync(`${__dirname}/config.json`, 'utf-8');


## http 服务中无法直接访问本地文件

Not allowed to load local resource: file:///D:/playground/ai/nodeapi/projects/nodejs/public/statics/argv-debugger.png

```
<body>
    <div>111</div>
    <img 
        style="width: 200px; height: 200px; border: 1px solid #ccc;" 
        src="file:///D:/playground/ai/nodeapi/projects/nodejs/public/statics/argv-debugger.png" 
        alt="调试器图片"
    />
</body>
```

##  浏览器中直接访问本地文件

在浏览器中输入  file:///D:/playground/ai/nodeapi/projects/nodejs/public/statics/argv-debugger.png