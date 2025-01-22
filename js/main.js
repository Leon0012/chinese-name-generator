// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    window.nameGenerator = new ChineseNameGenerator();
});

class ChineseNameGenerator {
    constructor() {
        console.log('Initializing ChineseNameGenerator');
        this.init();
        this.loadFavorites();
    }

    init() {
        // Initialize DOM elements
        console.log('Initializing DOM elements');
        this.englishNameInput = document.getElementById('englishName');
        this.generateBtn = document.getElementById('generateBtn');
        this.resultsSection = document.getElementById('resultsSection');
        this.favoritesList = document.getElementById('favoritesList');
        this.nameCardTemplate = document.getElementById('nameCardTemplate');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingSpinner = document.getElementById('loadingSpinner');

        // Log if any elements are missing
        if (!this.englishNameInput) console.error('Missing englishNameInput element');
        if (!this.generateBtn) console.error('Missing generateBtn element');
        if (!this.resultsSection) console.error('Missing resultsSection element');
        if (!this.favoritesList) console.error('Missing favoritesList element');
        if (!this.nameCardTemplate) console.error('Missing nameCardTemplate element');
        if (!this.errorMessage) console.error('Missing errorMessage element');
        if (!this.loadingSpinner) console.error('Missing loadingSpinner element');

        // Bind event listeners
        console.log('Binding event listeners');
        this.generateBtn.addEventListener('click', () => {
            console.log('Generate button clicked');
            this.generateNames();
        });
        
        this.englishNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter key pressed');
                this.generateNames();
            }
        });
    }

    showError(message) {
        console.log('Showing error:', message);
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
            setTimeout(() => {
                this.errorMessage.style.display = 'none';
            }, 5000);
        } else {
            console.error('Error message element not found');
            alert(message);
        }
    }

    showLoading(show) {
        console.log('Setting loading state:', show);
        if (this.loadingSpinner && this.generateBtn) {
            this.loadingSpinner.style.display = show ? 'block' : 'none';
            this.generateBtn.disabled = show;
            this.generateBtn.textContent = show ? 'Generating...' : 'Generate Names';
        } else {
            console.error('Loading spinner or generate button not found');
        }
    }

    // Generate Chinese names based on input
    async generateNames() {
        console.log('Starting name generation');
        const englishName = this.englishNameInput.value.trim();
        
        if (!englishName) {
            console.log('No name entered');
            this.showError('Please enter your English name');
            return;
        }

        console.log('Generating names for:', englishName);
        this.showLoading(true);
        if (this.resultsSection) {
            this.resultsSection.innerHTML = '';
        }
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
        }

        try {
            console.log('Sending request to server...');
            const response = await fetch('http://localhost:3000/api/generate-name', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    englishName: englishName
                })
            });

            console.log('Server response:', response);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${errorText}`);
            }

            const data = await response.json();
            console.log('Server data:', data);
            
            if (this.resultsSection) {
                this.resultsSection.innerHTML = '';
            }

            if (data.names && data.names.length > 0) {
                console.log('Displaying names:', data.names);
                data.names.forEach(nameData => {
                    this.displayNameCard(nameData);
                });
            } else {
                throw new Error('No names were generated');
            }

        } catch (error) {
            console.error('Error generating names:', error);
            this.showError(`Error: ${error.message}. Please try again.`);
            if (this.resultsSection) {
                this.resultsSection.innerHTML = '';
            }
        } finally {
            this.showLoading(false);
        }
    }

    // Create and display a name card
    displayNameCard(nameData) {
        console.log('Displaying name card for:', nameData);
        if (!this.nameCardTemplate || !this.resultsSection) {
            console.error('Template or results section not found');
            return;
        }

        const card = this.nameCardTemplate.content.cloneNode(true);
        
        // Fill in the card details
        card.querySelector('.chinese-name').textContent = nameData.chinese;
        card.querySelector('.pinyin').textContent = nameData.pinyin;
        card.querySelector('.meaning-text').textContent = nameData.overall_meaning;
        card.querySelector('.cultural-text').textContent = nameData.cultural_explanation;
        
        // Create character explanation text
        const charExplanation = nameData.characters.map(char => {
            return `${char.character} (${char.pinyin}): ${char.meaning}\n${char.cultural_significance}`;
        }).join('\n\n');
        card.querySelector('.character-text').textContent = charExplanation;

        // Add favorite button functionality
        const favoriteBtn = card.querySelector('.favorite-btn');
        
        if (this.isFavorite(nameData.chinese)) {
            favoriteBtn.textContent = 'Remove from Favorites';
            favoriteBtn.classList.add('favorited');
        }

        favoriteBtn.addEventListener('click', () => this.toggleFavorite(nameData));

        // Add the card to the results section
        this.resultsSection.appendChild(card);
    }

    // Favorite management
    loadFavorites() {
        console.log('Loading favorites');
        this.favorites = JSON.parse(localStorage.getItem('favoriteNames') || '[]');
        this.displayFavorites();
    }

    isFavorite(nameString) {
        return this.favorites.some(fav => fav.chinese === nameString);
    }

    toggleFavorite(nameData) {
        console.log('Toggling favorite:', nameData);
        const index = this.favorites.findIndex(fav => fav.chinese === nameData.chinese);

        if (index === -1) {
            // Add to favorites
            this.favorites.push(nameData);
            this.saveFavorites();
            this.showError('Added to favorites!');
        } else {
            // Remove from favorites
            this.favorites.splice(index, 1);
            this.saveFavorites();
            this.showError('Removed from favorites');
        }

        // Update UI
        this.displayFavorites();
        this.updateFavoriteButtons();
    }

    saveFavorites() {
        console.log('Saving favorites');
        localStorage.setItem('favoriteNames', JSON.stringify(this.favorites));
    }

    displayFavorites() {
        console.log('Displaying favorites');
        if (!this.favoritesList) {
            console.error('Favorites list element not found');
            return;
        }

        this.favoritesList.innerHTML = '';
        
        this.favorites.forEach(nameData => {
            const card = this.nameCardTemplate.content.cloneNode(true);
            
            card.querySelector('.chinese-name').textContent = nameData.chinese;
            card.querySelector('.pinyin').textContent = nameData.pinyin;
            card.querySelector('.meaning-text').textContent = nameData.overall_meaning;
            card.querySelector('.cultural-text').textContent = nameData.cultural_explanation;
            
            const charExplanation = nameData.characters.map(char => {
                return `${char.character} (${char.pinyin}): ${char.meaning}\n${char.cultural_significance}`;
            }).join('\n\n');
            card.querySelector('.character-text').textContent = charExplanation;

            const favoriteBtn = card.querySelector('.favorite-btn');
            favoriteBtn.textContent = 'Remove from Favorites';
            favoriteBtn.classList.add('favorited');
            favoriteBtn.addEventListener('click', () => this.toggleFavorite(nameData));

            this.favoritesList.appendChild(card);
        });
    }

    updateFavoriteButtons() {
        console.log('Updating favorite buttons');
        const allButtons = document.querySelectorAll('.favorite-btn');
        allButtons.forEach(btn => {
            const card = btn.closest('.name-card');
            const nameString = card.querySelector('.chinese-name').textContent;
            
            if (this.isFavorite(nameString)) {
                btn.textContent = 'Remove from Favorites';
                btn.classList.add('favorited');
            } else {
                btn.textContent = 'Add to Favorites';
                btn.classList.remove('favorited');
            }
        });
    }
}
