// 获取中文名字建议
async function generateChineseNames(englishName) {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: englishName })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.suggestions;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
