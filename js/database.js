// Chinese characters database with meanings and pronunciations
const characterDatabase = {
    // Common characters for names with positive meanings
    characters: {
        // Male-oriented characters
        male: {
            // First characters (usually for surname conversion)
            first: {
                '米': { pinyin: 'mǐ', meaning: 'rice, symbol of abundance' },
                '麦': { pinyin: 'mài', meaning: 'wheat, symbol of vitality' },
                '马': { pinyin: 'mǎ', meaning: 'horse, symbol of strength' },
                '明': { pinyin: 'míng', meaning: 'bright, brilliant' },
                '迈': { pinyin: 'mài', meaning: 'stride forward' }
            },
            // Middle characters
            middle: {
                '凯': { pinyin: 'kǎi', meaning: 'triumphant, victorious' },
                '克': { pinyin: 'kè', meaning: 'overcome, able' },
                '开': { pinyin: 'kāi', meaning: 'open, start' },
                '康': { pinyin: 'kāng', meaning: 'healthy, peaceful' }
            },
            // Last characters
            last: {
                '乐': { pinyin: 'lè', meaning: 'joy, happiness' },
                '龙': { pinyin: 'lóng', meaning: 'dragon, symbol of power' },
                '洛': { pinyin: 'luò', meaning: 'river, flowing' },
                '理': { pinyin: 'lǐ', meaning: 'logic, truth' }
            }
        },
        // Female-oriented characters
        female: {
            // First characters
            first: {
                '美': { pinyin: 'měi', meaning: 'beautiful' },
                '玛': { pinyin: 'mǎ', meaning: 'agate, precious stone' },
                '梅': { pinyin: 'méi', meaning: 'plum blossom' },
                '明': { pinyin: 'míng', meaning: 'bright, brilliant' }
            },
            // Middle characters
            middle: {
                '琳': { pinyin: 'lín', meaning: 'jade, elegant' },
                '凯': { pinyin: 'kǎi', meaning: 'triumphant' },
                '嘉': { pinyin: 'jiā', meaning: 'excellent' },
                '佳': { pinyin: 'jiā', meaning: 'beautiful, good' }
            },
            // Last characters
            last: {
                '莉': { pinyin: 'lì', meaning: 'jasmine' },
                '丽': { pinyin: 'lì', meaning: 'beautiful' },
                '娜': { pinyin: 'nà', meaning: 'elegant, graceful' },
                '雅': { pinyin: 'yǎ', meaning: 'refined, elegant' }
            }
        }
    },

    // Sound mapping from English to Chinese
    soundMapping: {
        // Consonants
        'm': ['米', '麦', '马', '明'],
        'n': ['娜', '宁', '南'],
        'l': ['乐', '理', '龙', '洛'],
        'r': ['若', '然', '荣'],
        'j': ['杰', '俊', '嘉'],
        'k': ['凯', '康', '克'],
        // Vowels
        'a': ['雅', '娜', '嘉'],
        'e': ['乐', '叶', '蕊'],
        'i': ['伊', '依', '怡'],
        'o': ['欧', '鸥', '藕'],
        'u': ['优', '宇', '瑜']
    },

    // Cultural combinations that work well together
    culturalCombinations: [
        {
            combination: ['明', '凯', '乐'],
            meaning: 'Bright and triumphant joy',
            cultural: 'Represents the pursuit of happiness through achievement'
        },
        {
            combination: ['米', '凯', '龙'],
            meaning: 'Prosperous and powerful',
            cultural: 'Symbolizes success and strength in Chinese culture'
        },
        {
            combination: ['麦', '克', '洛'],
            meaning: 'Overcoming challenges with grace',
            cultural: 'Represents resilience and adaptability'
        }
    ]
};

// Name generation rules
const nameRules = {
    // Get suitable first character based on first letter of English name
    getFirstCharacter(letter, gender) {
        letter = letter.toLowerCase();
        const possibleChars = characterDatabase.soundMapping[letter] || [];
        const genderChars = characterDatabase.characters[gender].first;
        
        // Find characters that match both sound and gender
        const suitableChars = possibleChars.filter(char => genderChars[char]);
        
        // Return random suitable character or fallback to gender-specific character
        return suitableChars.length > 0 
            ? suitableChars[Math.floor(Math.random() * suitableChars.length)]
            : Object.keys(genderChars)[Math.floor(Math.random() * Object.keys(genderChars).length)];
    },

    // Generate full name based on English name
    generateChineseName(englishName, gender = 'male') {
        const firstLetter = englishName.charAt(0);
        const firstName = this.getFirstCharacter(firstLetter, gender);
        
        // Get random middle and last characters that work well together
        const middleChars = Object.keys(characterDatabase.characters[gender].middle);
        const lastChars = Object.keys(characterDatabase.characters[gender].last);
        
        const middleChar = middleChars[Math.floor(Math.random() * middleChars.length)];
        const lastChar = lastChars[Math.floor(Math.random() * lastChars.length)];
        
        return {
            characters: [firstName, middleChar, lastChar],
            pinyin: this.getPinyin([firstName, middleChar, lastChar]),
            meaning: this.getMeaning([firstName, middleChar, lastChar]),
            cultural: this.getCulturalSignificance([firstName, middleChar, lastChar])
        };
    },

    // Get pinyin for characters
    getPinyin(characters) {
        return characters.map(char => {
            for (const group of Object.values(characterDatabase.characters)) {
                for (const position of Object.values(group)) {
                    if (position[char]) {
                        return position[char].pinyin;
                    }
                }
            }
            return '';
        }).join(' ');
    },

    // Get meaning of character combination
    getMeaning(characters) {
        const meanings = characters.map(char => {
            for (const group of Object.values(characterDatabase.characters)) {
                for (const position of Object.values(group)) {
                    if (position[char]) {
                        return position[char].meaning;
                    }
                }
            }
            return '';
        });
        
        return meanings.join(', ').replace(/symbol of /g, '');
    },

    // Get cultural significance of the combination
    getCulturalSignificance(characters) {
        // Check if this combination exists in our cultural combinations
        const culturalMatch = characterDatabase.culturalCombinations.find(combo => 
            combo.combination.every((char, index) => char === characters[index])
        );

        if (culturalMatch) {
            return culturalMatch.cultural;
        }

        // Generate generic cultural significance if no exact match
        return 'This name combines elements of ' + 
               this.getMeaning(characters).split(', ').join(' and ') + 
               ', reflecting traditional Chinese values of personal growth and harmony.';
    }
};

// Export for use in main.js
window.nameDatabase = {
    characterDatabase,
    nameRules
};
