// OpenAI API 配置
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = atob('c2stVDVVTHZFdUF0SWtsOHkwalV3NVdUM0JsYmtGSmFTYVFNbmJYaUYwZ0RCS1cxdmxz');

// 获取 API 基础 URL
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : '';

// 获取中文名字建议
async function generateChineseName(englishName) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: englishName })
        });

        if (!response.ok) {
            throw new Error('生成名字时出错');
        }

        const data = await response.json();
        return data.suggestions;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
