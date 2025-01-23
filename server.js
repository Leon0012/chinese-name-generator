const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');

// 优先使用环境变量，如果没有则尝试从配置文件加载
const config = {
    PORT: process.env.PORT || 3000,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY
};

// 如果环境变量中没有API密钥，尝试从配置文件加载
if (!config.OPENAI_API_KEY) {
    try {
        const fileConfig = require('./config');
        config.OPENAI_API_KEY = fileConfig.OPENAI_API_KEY;
    } catch (error) {
        console.error('未找到 OPENAI_API_KEY，请在环境变量或 config.js 中设置');
        process.exit(1);
    }
}

const app = express();
const port = config.PORT;

// 检查必要的配置
if (!config.OPENAI_API_KEY) {
    console.error('错误: 请在环境变量或 config.js 中设置 OPENAI_API_KEY');
    process.exit(1);
}

// 创建 OpenAI 配置
const configuration = new Configuration({
    apiKey: config.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API 路由
app.post('/api/generate', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: '请提供英文名字' });
        }

        const prompt = `请为名字"${name}"生成3个中文名字建议。要求：
            1. 名字要朗朗上口，符合中国人的起名习惯
            2. 每个字都要有具体寓意
            3. 字的组合要和谐
            4. 响应格式：每个名字占一行，后面用括号说明含义，例如：
            张伟明（伟大光明，寓意远大前程）`;

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "你是一个专业的中文起名专家，精通中国传统文化和起名学问。"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        const suggestions = completion.choices[0].message.content.trim().split('\n');

        res.json({ suggestions });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '生成名字时出错' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
