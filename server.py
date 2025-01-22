from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import requests
from urllib.parse import parse_qs
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.path = 'index.html'
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self):
        if self.path == '/generate':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                english_name = data.get('name', '').strip()
                
                if not english_name:
                    self.send_error(400, "Name parameter is required")
                    return

                print(f"Generating names for: {english_name}")

                # 从环境变量获取 API Key
                api_key = os.getenv('OPENAI_API_KEY')
                if not api_key:
                    self.send_error(500, "Server configuration error: OPENAI_API_KEY not set")
                    return
                    
                headers = {
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type': 'application/json'
                }

                # 构建 prompt
                prompt = f"""请为名字"{english_name}"生成3个中文名字建议。要求：
                1. 名字要朗朗上口，符合中国人的起名习惯
                2. 每个字都要有具体寓意
                3. 字的组合要和谐
                4. 响应格式：每个名字占一行，后面用括号说明含义，例如：
                张伟明（伟大光明，寓意远大前程）
                """

                # 调用 OpenAI API
                response = requests.post(
                    'https://api.openai.com/v1/chat/completions',
                    headers=headers,
                    json={
                        'model': 'gpt-3.5-turbo',
                        'messages': [
                            {'role': 'system', 'content': '你是一个专业的中文起名专家，精通中国传统文化和起名学问。'},
                            {'role': 'user', 'content': prompt}
                        ],
                        'temperature': 0.7,
                        'max_tokens': 500
                    }
                )

                if response.status_code == 200:
                    result = response.json()
                    generated_names = result['choices'][0]['message']['content'].strip()
                    
                    # 发送响应
                    self.send_response(200)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    response_data = json.dumps({'names': generated_names.split('\n')})
                    self.wfile.write(response_data.encode())
                else:
                    print(f"OpenAI API error: {response.status_code}")
                    print(response.text)
                    self.send_error(500, "Error generating names")
                    
            except Exception as e:
                print(f"Error: {str(e)}")
                self.send_error(500, str(e))
        else:
            self.send_error(404, "Not Found")

def run_server(port=8000):
    server_address = ('', port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    print(f"Server running on port {port}")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
