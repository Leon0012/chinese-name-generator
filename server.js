require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const port = 3000;

// 配置OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 生成名字的Prompt
const nameGenerationPrompt = `You are a professional Chinese name expert with deep knowledge in Chinese culture and naming traditions. Your task is to generate meaningful Chinese names based on English names while following specific cultural and linguistic guidelines.

INPUT CONTEXT:
English Name: {englishName}
Gender: {gender}

REQUIREMENTS:

1. NAMING PRINCIPLES:
- Create 3 unique Chinese name options
- Each name should be 2-3 characters long
- Consider phonetic similarity to the English name
- Ensure cultural appropriateness
- Avoid unlucky or negative connotations
- Use characters that are common in modern Chinese names

2. PHONETIC RULES:
- Match initial sounds where possible
- Consider the overall rhythm and tone pattern
- Avoid tongue-twisters or difficult pronunciations
- Use standard Mandarin pronunciations

3. CHARACTER SELECTION:
- Choose characters that are commonly used in names
- Avoid overly complex or rare characters
- Ensure good fortune and positive meanings
- Consider the visual balance of the characters

4. CULTURAL CONSIDERATIONS:
- Respect traditional naming conventions
- Include elements that reflect positive Chinese values
- Avoid culturally sensitive or inappropriate combinations
- Consider the name's suitability for professional contexts

Please provide the output in the following JSON format:

{
  "names": [
    {
      "chinese": "张明华",
      "pinyin": "zhāng míng huá",
      "characters": [
        {
          "character": "张",
          "pinyin": "zhāng",
          "meaning": "to spread",
          "cultural_significance": "A common surname meaning 'to spread out'"
        },
        {
          "character": "明",
          "pinyin": "míng",
          "meaning": "bright",
          "cultural_significance": "Represents clarity and intelligence"
        },
        {
          "character": "华",
          "pinyin": "huá",
          "meaning": "splendid",
          "cultural_significance": "Symbolizes magnificence and China itself"
        }
      ],
      "overall_meaning": "A bright and splendid person",
      "cultural_explanation": "This name combines the brightness of wisdom with the magnificence of Chinese culture",
      "name_analysis": "The combination suggests someone who will spread brightness and cultural excellence",
      "pronunciation_tip": "The tones flow smoothly from first to second to fourth tone, creating a melodious sound"
    }
  ],
  "cultural_notes": "These names were chosen to reflect traditional Chinese values while maintaining modern relevance",
  "usage_context": "All names are suitable for both formal and informal situations"
}`;

// API路由
app.post('/api/generate-name', async (req, res) => {
    try {
        const { englishName, gender } = req.body;
        
        if (!englishName) {
            return res.status(400).json({ error: 'English name is required' });
        }

        const prompt = nameGenerationPrompt
            .replace('{englishName}', englishName)
            .replace('{gender}', gender || 'neutral');

        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    "role": "system",
                    "content": "You are a Chinese naming expert who specializes in creating meaningful Chinese names for foreigners."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        const response = completion.choices[0].message.content;
        let nameData;
        
        try {
            nameData = JSON.parse(response);
        } catch (error) {
            console.error('Error parsing OpenAI response:', error);
            return res.status(500).json({ error: 'Error processing the response' });
        }

        res.json(nameData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error generating names' });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
