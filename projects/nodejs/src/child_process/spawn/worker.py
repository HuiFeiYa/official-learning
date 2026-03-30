# worker.py (修改后的版本)
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class MyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # 1. 响应头
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()

        # 2. 响应体
        response = {"status": "running11111111111111", "message": "Python 服务正在运行"}
        self.wfile.write(json.dumps(response).encode())

def run_server():
    server_address = ('', 8000)  # 监听所有IP，端口8000
    httpd = HTTPServer(server_address, MyHandler)
    print("Python 服务已启动，正在监听端口 8000...")
    httpd.serve_forever() # 关键点：这里会一直阻塞，保持进程运行

if __name__ == "__main__":
    run_server()