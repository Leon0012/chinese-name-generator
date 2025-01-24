const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

// 创建 Express 应用
exports.main = async (event, context) => {
    const app = express();

    // 创建 OpenAI 配置
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    // 中间件
    app.use(cors());
    app.use(express.json());
    app.use(express.static('public'));

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

    // 返回 Web 函数所需的对象
    return app;
};
