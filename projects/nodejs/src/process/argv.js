/** node .\projects\nodejs\src\process\argv.js -arg 123 456 789
process.argv
(6) ['C:\\Users\\admin\\AppData\\Local\\Volta\\tools\\image\\node\\16.17.1\\node.exe', 'D:\\playground\\ai\\nodeapi\\projects\\nodejs\\src\\process\\argv.js', '-arg', '123', '456', '789']
0: C:\Users\admin\AppData\Local\Volta\tools\image\node\16.17.1\node.exe
argv.js:2
1: D:\playground\ai\nodeapi\projects\nodejs\src\process\argv.js
argv.js:2
2: -arg
argv.js:2
3: 123
argv.js:2
4: 456
argv.js:2
5: 789 */
process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`)
})
