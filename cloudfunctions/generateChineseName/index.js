const { Configuration, OpenAIApi } = require('openai');

// 创建 OpenAI 配置
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 云函数入口
exports.main = async (event, context) => {
    try {
        // 获取英文名
        const { name } = event;
        
        if (!name) {
            return {
                error: '请提供英文名'
            };
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
        return {
            chineseName
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            error: '生成名字时出错'
        };
    }
}
