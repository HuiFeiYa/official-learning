import path from 'path';

console.log('初始 cwd =', process.cwd());

// 手动切换到上级目录
process.chdir('../');
console.log('切换后 cwd =', process.cwd());

// 再切换到根目录（示例）
process.chdir('/');
console.log('根目录 cwd =', process.cwd());