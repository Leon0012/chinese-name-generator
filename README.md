# Chinese Name Generator for Foreign Friends

A smart web application that helps foreigners find culturally meaningful Chinese names.

## Project Overview

This application aims to create an intelligent Chinese name recommendation system for foreign friends. It provides personalized Chinese names with detailed cultural interpretations, helping users better understand the meaning behind their Chinese names and traditional Chinese culture.

## Core Features

### 1. Intelligent Name Generation
- Input: English name (supports both "given name" and "given name + surname" formats)
- Output: Three unique Chinese name recommendations
- Each name follows these criteria:
  - Harmonious pronunciation, close to English pronunciation
  - Compliant with Chinese naming conventions
  - Beautiful meaning and appropriate combination
  - Culturally appropriate

### 2. Cultural Interpretation
Each recommended name includes:
- Character explanation
- Overall meaning
- Cultural connotations
- Personality traits
- English explanation

### 3. User Experience
- Clean and intuitive interface
- Three-step operation process
- Clear result display
- Favorite and export name options

## Project Structure

```
给老外取个名字/
├── index.html          # Main page
├── css/               # Styling
│   └── style.css      # Main stylesheet
├── js/                # JavaScript
│   ├── main.js        # Core application logic
│   └── database.js    # Name database and rules
└── README.md          # Project documentation
```

## Technology Stack
- HTML5
- CSS3
- JavaScript (Vanilla)
- Local Storage for favorites

## Getting Started
1. Open `index.html` in your web browser
2. Enter an English name
3. Get personalized Chinese name recommendations

## Deployment
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Login to Vercel:
   ```bash
   vercel login
   ```
3. Deploy the project:
   ```bash
   vercel --prod
   ```
4. Set the environment variable `OPENAI_API_KEY` in the Vercel dashboard.

## Example
Input: "Michael"
Output:
```
1. 米凯乐 (Mi Kai Le)
   Meaning: Joy and triumph
   Cultural significance: Represents positivity and vitality

2. 明凯洛 (Ming Kai Luo)
   Meaning: Bright and cheerful spirit
   Cultural significance: Wisdom and openness

3. 麦克龙 (Mai Ke Long)
   Meaning: Distinguished and extraordinary
   Cultural significance: Unique personality and ambition
```
