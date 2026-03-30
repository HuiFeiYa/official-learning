import { exec, execFile, spawn, fork} from 'node:child_process'
import process from 'node:process'

function runExec(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(error)
      else resolve({ stdout, stderr })
    })
  })
}

function runExecFile(file, args) {
  return new Promise((resolve, reject) => {
    execFile(file, args, (error, stdout, stderr) => {
      if (error) reject(error)
      else resolve({ stdout, stderr })
    })
  })
}

function runSpawn(file, args) {
  return new Promise((resolve, reject) => {
    const cp = spawn(file, args)
    let stdout = ''
    let stderr = ''
    cp.stdout?.on('data', (d) => (stdout += d.toString()))
    cp.stderr?.on('data', (d) => (stderr += d.toString()))
    cp.on('error', reject)
    cp.on('close', (code) => resolve({ stdout, stderr, code }))
  })
}

async function main() {
  const r1 = await runExec(`${process.execPath} -p "process.version"`)
  console.log('exec stdout:', r1.stdout.trim())
  if (r1.stderr) console.log('exec stderr:', r1.stderr.trim())

  const r2 = await runExecFile('git', ['--version'])
  if (r2.stderr) console.log('execFile stderr:', r2.stderr.trim())
  const pythonChildProcess = execFile('python3', ['--version'], (error, stdout, stderr) => {
    if (error) console.error('execFile error:', error)
    else console.log('execFile stdout:', stdout)
  });
  pythonChildProcess.stdout?.on('data', (d) => {
    console.log('python3 data:', d.toString())
  })

  fork('')

  // const r3 = await runSpawn(process.execPath, ['-e', 'process.stdout.write("spawn ok")'])
  // console.log('spawn stdout:', r3.stdout)
  // if (r3.stderr) console.log('spawn stderr:', r3.stderr.trim())
  // console.log('spawn exit code:', r3.code)

  // const r4 = spawnSync(process.execPath, ['-p', '1+2'])
  // console.log('spawnSync stdout:', r4.stdout.toString().trim())
  // if (r4.stderr?.length) console.log('spawnSync stderr:', r4.stderr.toString().trim())
}

main().catch((e) => {
  console.error('error:', e)
  process.exitCode = 1
})

