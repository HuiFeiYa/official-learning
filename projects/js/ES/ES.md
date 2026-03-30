# import.meta 详解

## 概述

`import.meta` 是 JavaScript 模块系统中的一个特殊对象，它提供当前模块的元数据信息，是 ES 标准的一部分，自 ES2020 起正式引入。它不是 Node.js 专属的特性，而是所有支持 ES 模块（ESM）的环境都可用的特性，包括现代浏览器和 Node.js。

## Node.js 支持情况

在 Node.js 中，`import.meta` 从 v12.2.0 开始支持，但需启用 ESM 模块系统：

- 通过将文件后缀设为 `.mjs`
- 或在 `package.json` 中设置 `"type": "module"`

## 核心特性

### 基本概念

- **标准属性**：所有支持 ES 模块的环境都普遍提供
- **扩展属性**：Node.js 在标准基础上增加的特有属性
- **使用限制**：与 CommonJS 模块系统不兼容，只能在 ES 模块中使用

## 标准原生属性

### `import.meta.url`

这是最常用、最核心的属性，返回当前模块的绝对 URL。

**不同环境下的表现：**

- **在浏览器中**：通常是 `http://` 或 `https://` 开头的完整 URL
- **在 Node.js 中**：是 `file://` 开头的本地文件路径

**主要用途：**

- 替代 CommonJS 中的 `__filename` 和 `__dirname`
- 用于获取当前文件的目录或拼接相对路径
- 动态加载资源时确定模块位置

**使用示例：**

```
// 获取当前模块的 URL
console.log(import.meta.url);

// 在 Node.js 中，可以结合 url 模块转换为文件路径
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
```

## Node.js 扩展属性

### `import.meta.resolve()`

一个函数，用于动态解析模块说明符。它可以返回一个模块（无论是相对路径还是 npm 包）在当前环境下的绝对 URL。

**功能特点：**

- 支持解析相对路径和 npm 包
- 返回模块的完整文件路径
- 需要异步调用

**使用示例：**

```
// 解析 npm 包路径
const lodashPath = await import.meta.resolve('lodash');
console.log(lodashPath); // file:///path/to/node_modules/lodash/index.js

// 解析相对路径
const modulePath = await import.meta.resolve('./my-module.js');
```

### `import.meta.dirname` 和 `import.meta.filename`

这两个是 Node.js v20.11.0+ 版本引入的较新语法糖，可以直接获取当前模块的目录路径和文件路径。

**优势：**

- 无需再通过 `import.meta.url` 进行转换
- 完美替代 CommonJS 中的 `__dirname` 和 `__filename`
- 提供更直观的 API

**使用示例：**

```
// 直接获取目录路径
console.log(import.meta.dirname);

// 直接获取文件路径
console.log(import.meta.filename);
```

### `import.meta.main`

一个布尔值，用于判断当前模块是否为 Node.js 进程的入口文件。

**使用场景：**

- 判断当前模块是否是直接运行的文件
- 实现模块的"可执行"与"可导入"双重功能

**使用示例：**

```
if (import.meta.main) {
  console.log('当前模块是入口文件');
  // 执行主程序逻辑
} else {
  console.log('当前模块被其他模块导入');
  // 作为模块导出功能
}
```

## 实际应用场景

### 1. 获取当前模块路径

```
// ES 模块中获取 __dirname 功能
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
```

### 2. 动态模块加载

```
// 动态加载配置文件
const configPath = new URL('./config.json', import.meta.url);
const config = await import(configPath);
```

### 3. 资源路径处理

```
// 在 Node.js 中处理静态资源路径
const imagePath = new URL('./images/logo.png', import.meta.url);
const imagePathStr = fileURLToPath(imagePath);
```

## 注意事项

1. **环境兼容性**：确保运行环境支持 ESM 和 `import.meta`
2. **路径处理**：在 Node.js 中处理 `file://` URL 时，建议使用 `node:url` 模块
3. **异步操作**：`import.meta.resolve()` 是异步方法，需要使用 `await`
4. **版本要求**：`import.meta.dirname` 和 `import.meta.filename` 需要 Node.js v20.11.0+

## 总结

`import.meta` 为 ES 模块提供了强大的元数据访问能力，特别是在 Node.js 环境中，通过扩展属性极大地增强了模块的灵活性和功能性。它不仅解决了 ES 模块中获取模块路径的问题，还提供了动态模块解析、入口文件判断等实用功能，是现代 JavaScript 开发中不可或缺的工具。

