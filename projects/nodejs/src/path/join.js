import path from 'path';

// 1. path.join()：仅拼接片段，输出相对路径
console.log(path.join('src', 'utils', 'file.js')); 
// 输出：src/utils/file.js（相对路径）

// 2. path.resolve()：拼接后解析为绝对路径
console.log(path.resolve('src', 'utils', 'file.js')); 
// 输出：/user/project/src/utils/file.js（绝对路径）


// 1. path.join()：仅规范化拼接
console.log(path.join('src', '../', 'dist', './file.js')); 
// 输出：dist/file.js（相对路径，src/../ 抵消为根）

// 2. path.resolve()：规范化后解析为绝对路径
console.log(path.resolve('src', '../', 'dist', './file.js')); 

// 输出：/user/project/dist/file.js（绝对路径）



// 1. path.join()：/ 仅作为分隔符，不重置基准
console.log(path.join('src', '/dist', 'file.js')); 
// 输出：src/dist/file.js（相对路径，/dist 被视为 dist）

// 2. path.resolve()：/ 重置基准为根目录
console.log(path.resolve('src', '/dist', 'file.js')); 
// 输出：/dist/file.js（绝对路径，/dist 直接从根目录开始）


// 1. path.join()：空参数返回当前目录（.），多分隔符合并为一个
console.log(path.join('', 'src//utils', '')); 
// 输出：src/utils（规范化分隔符）

// 2. path.resolve()：空参数返回当前工作目录
console.log(path.resolve('', 'src//utils', '')); 
// 输出：/user/project/src/utils（绝对路径）



// Windows 环境下
console.log(path.join('src', 'utils')); // src\utils
console.log(path.resolve('src', 'utils')); // C:\user\project\src\utils

// Linux/macOS 环境下
console.log(path.join('src', 'utils')); // src/utils
console.log(path.resolve('src', 'utils')); // /user/project/src/utils