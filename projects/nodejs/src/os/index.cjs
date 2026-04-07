const os = require('os');

console.log('系统平台', os.platform());
console.log('CPU架构', os.arch());
console.log('CPU核心数', os.cpus().length);
console.log('总内存', (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + 'GB');
console.log('空闲内存', (os.freemem() / 1024 / 1024).toFixed(2) + 'MB');
console.log('主目录', os.homedir());
console.log('临时目录', os.tmpdir());
console.log('本机IP', os.networkInterfaces());