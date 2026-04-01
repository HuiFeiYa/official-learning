// 1. 引入内置模块
const http = require('http');
const fs = require('fs');
const path = require('path');

// 2. 创建 HTTP 服务（核心入口）
const server = http.createServer((req, res) => {
  // ==========================
  // 一、处理跨域 CORS（必备）
  // ==========================
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理预检请求 OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // ==========================
  // 二、解析 URL 和 查询参数
  // ==========================
  const baseURL = `http://${req.headers.host}`;
  const urlObj = new URL(req.url, baseURL);
  const pathname = urlObj.pathname; // 路由路径 /api/user
  const query = urlObj.searchParams; // 查询参数 ?name=node

  // ==========================
  // 三、核心路由处理
  // ==========================

  // --------------------------
  // 路由1：GET 测试接口
  // --------------------------
  if (req.method === 'GET' && pathname === '/api/hello') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      code: 200,
      message: 'Hello Node HTTP',
      query: Object.fromEntries(query)
    }));
    return;
  }

  // --------------------------
  // 路由2：POST 接收 JSON 请求体（核心：流式解析 body）
  // --------------------------
  if (req.method === 'POST' && pathname === '/api/json') {
    // 可读流：接收请求体 Buffer
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk); // 收集分片
    });

    req.on('end', () => {
      try {
        // 拼接 Buffer → 字符串 → JSON
        const bodyStr = Buffer.concat(chunks).toString();
        const body = JSON.parse(bodyStr);

        // 返回 JSON 响应
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          code: 200,
          received: body
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ code: 400, msg: 'JSON 格式错误' }));
      }
    });
    return;
  }

  // --------------------------
  // 路由3：静态资源服务（html/css/js）
  // --------------------------
  if (req.method === 'GET') {
    // 默认访问 index.html
    let filePath = pathname === '/' ? '/index.html' : pathname;
    const fullPath = path.join(__dirname, 'public', filePath);

    // 读取文件并返回
    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      // 根据文件后缀设置响应头
      const ext = path.extname(fullPath);
      let contentType = 'text/html';
      if (ext === '.css') contentType = 'text/css';
      if (ext === '.js') contentType = 'application/javascript';
      if (ext === '.json') contentType = 'application/json';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
    return;
  }

  // --------------------------
  // 404 路由
  // --------------------------
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ code: 404, msg: '接口不存在' }));
});

// 3. 启动服务，监听端口
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP 服务已启动：http://127.0.0.1:${PORT}`);
});