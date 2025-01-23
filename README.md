# 中文名字生成器

这是一个简单的网页应用，可以根据英文名字生成匹配的中文名字建议。应用使用 OpenAI API 来生成有意义和谐的中文名字。

## 功能特点

- 简洁美观的用户界面
- 实时名字生成
- 每个生成的名字都附带详细的含义解释
- 响应式设计，支持移动设备

## 技术栈

- 前端：HTML5, CSS3, JavaScript
- 后端：Node.js, Express
- API：OpenAI GPT-3.5

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/Leon0012/chinese-name-generator.git
cd chinese-name-generator
```

2. 安装依赖：
```bash
npm install
```

3. 设置环境变量：
创建 `.env` 文件并添加你的 OpenAI API 密钥：
```
OPENAI_API_KEY=你的密钥
```

4. 启动服务器：
```bash
npm start
```

5. 访问应用：
打开浏览器访问 `http://localhost:3000`

## 部署

本项目使用 Render 进行部署。在 Render 上部署时，需要设置以下环境变量：

- `OPENAI_API_KEY`：你的 OpenAI API 密钥

## 使用方法

1. 在输入框中输入英文名字
2. 点击"生成名字"按钮
3. 等待几秒钟，系统会生成3个中文名字建议
4. 每个建议都包含名字的含义解释

## 注意事项

- 请确保 OpenAI API 密钥的安全性
- 不要在前端代码中硬编码 API 密钥
- 生成的名字仅供参考

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT
