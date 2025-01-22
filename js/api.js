// OpenAI API 配置
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = atob('c2stVDVVTHZFdUF0SWtsOHkwalV3NVdUM0JsYmtGSmFTYVFNbmJYaUYwZ0RCS1cxdmxz');

// 获取中文名字建议
async function generateChineseNames(englishName) {
    try {
        const prompt = `请为名字"${englishName}"生成3个中文名字建议。要求：
            1. 名字要朗朗上口，符合中国人的起名习惯
            2. 每个字都要有具体寓意
            3. 字的组合要和谐
            4. 响应格式：每个名字占一行，后面用括号说明含义，例如：
            张伟明（伟大光明，寓意远大前程）`;

        const response = await fetch(OPENAI_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的中文起名专家，精通中国传统文化和起名学问。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim().split('\n');
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
