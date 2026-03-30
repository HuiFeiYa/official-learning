import { spawn } from 'node:child_process'
import path, {dirname} from 'node:path'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const workerPath1 = path.resolve(__dirname, 'worker.js')
const pythonWorkerPath = path.resolve(__dirname, 'worker.py')
/**
 * js 子进程
 * @param {*} name 姓名
 * @param {*} count 倒计时秒数
 * @returns 
 */
// const jsWorder = spawn('node', [workerPath1, 'JS User', '5'])
// jsWorder.stdout.on('data', (data) => {
//   console.log(`[父进程收JS 数据] ${data.toString().trim()}`);
// })
// jsWorder.stderr.on('data', (data) => {
//   console.error(`[父进程收JS 错误数据] ${data.toString().trim()}`);
// })
// jsWorder.on('exit', (code, signal) => {
//   console.log(`[父进程收JS 退出] code: ${code}, signal:退出信号: ${signal}`);
// })
// jsWorder.on('error', (err) => {
//   console.error(`[父进程收JS 错误] ${err.message}`);
// })


/**
 * python 子进程
 * @param {*} name 姓名
 * @param {*} count 倒计时秒数
 * @returns 
 */
const pythonWorker = spawn('python', [pythonWorkerPath, 'Python User', '5'])
pythonWorker.stdout.on('data', (data) => {
  console.log(`[父进程收Python 数据] ${data.toString().trim()}`);
})
pythonWorker.stderr.on('data', (data) => {
  console.error(`[父进程收Python 错误数据] ${data.toString().trim()}`);
})
pythonWorker.on('exit', (code, signal) => {
  console.log(`[父进程收Python 退出] code: ${code}, signal:退出信号: ${signal}`);
})
pythonWorker.on('error', (err) => {
  console.error(`[父进程收Python 错误] ${err.message}`);
})
