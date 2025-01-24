const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// 加载加密的配置
let encryptedConfig;
try {
    encryptedConfig = require('./config.encrypted');
} catch (error) {
    console.error('未找到加密配置文件');
    process.exit(1);
}

// 解密配置
const config = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || require('./utils/crypto').decrypt(encryptedConfig.OPENAI_API_KEY)
};

// 检查必要的配置
if (!config.OPENAI_API_KEY) {
    console.error('错误: 请在环境变量或 config.encrypted.js 中设置 OPENAI_API_KEY');
    process.exit(1);
}

// 创建 OpenAI 配置
const configuration = new Configuration({
    apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// CORS 配置
const corsOptions = {
    origin: [
        'https://chinese-name-generator-1-1767981-1317344511.sh.run.tcloudbase.com',
        'https://chinese-name-generator-leon0012.webify.cloudbase.net'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // 添加静态文件服务
app.use(express.static(path.join(__dirname)));

// API 路由
app.post('/generate', async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: '请提供英文名' });
        }

        // 调用 OpenAI API
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的中文起名专家。请根据用户提供的英文名，生成一个发音相近、寓意优美的中文名字。"
                },
                {
                    role: "user",
                    content: `请为英文名 "${name}" 生成一个中文名字，只需要返回中文名字即可，不要其他解释。`
                }
            ],
            temperature: 0.7,
            max_tokens: 50
        });

        // 获取生成的中文名
        const chineseName = response.data.choices[0].message.content.trim();

        // 返回结果
        res.json({ chineseName });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '生成名字时出错' });
    }
});

// 处理所有其他路由，返回 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});
