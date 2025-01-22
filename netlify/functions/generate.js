const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
  // 启用 CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // 处理 OPTIONS 请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const { name } = JSON.parse(event.body);

    const prompt = `请为名字"${name}"生成3个中文名字建议。要求：
      1. 名字要朗朗上口，符合中国人的起名习惯
      2. 每个字都要有具体寓意
      3. 字的组合要和谐
      4. 响应格式：每个名字占一行，后面用括号说明含义，例如：
      张伟明（伟大光明，寓意远大前程）`;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的中文起名专家，精通中国传统文化和起名学问。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        suggestions: response.data.choices[0].message.content.trim().split('\n'),
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '生成名字时出错' }),
    };
  }
};
