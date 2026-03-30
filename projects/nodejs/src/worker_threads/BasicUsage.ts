import { Worker } from 'node:worker_threads'

async function main() {
  const worker = new Worker(
    `
      import { parentPort, workerData } from 'node:worker_threads';
      parentPort?.on('message', (msg) => {
        parentPort?.postMessage({ echo: msg, workerData });
      });
      parentPort?.postMessage({ ready: true });
    `,
    { eval: true, type: 'module', workerData: { value: 42 } }
  )

  await new Promise<void>((resolve, reject) => {
    const onReady = (msg: any) => {
      if (msg && msg.ready) resolve()
    }
    worker.once('message', onReady)
    worker.once('error', reject)
  })

  const response = await new Promise<any>((resolve, reject) => {
    const onMsg = (msg: any) => resolve(msg)
    worker.once('message', onMsg)
    worker.once('error', reject)
    worker.postMessage('ping')
  })

  console.log('worker message:', response)
  await worker.terminate()
}

main().catch((e) => {
  console.error(e)
  process.exitCode = 1
})

