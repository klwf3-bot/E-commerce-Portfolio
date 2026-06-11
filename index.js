// app.js
const API_KEY = '8a38933b4c574da49d22b79385d2a02f'; // Replace with your actual Spoonacular API key
const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';
const HEADERS = {
    'Content-Type': 'application/json'
};


const DOM = {
    burger: document.getElementById('burger-menu'),
    navLinks: document.getElementById('nav-links'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    recipeGrid: document.getElementById('recipe-grid'),
    loading: document.getElementById('loading'),
    alphabet: document.getElementById('alphabet-filter')
};

// Toggle Burger Menu
DOM.burger.addEventListener('click', () => {
    DOM.navLinks.classList.toggle('active');
});

// Generate Alphabet Buttons
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
alphabet.forEach(letter => {
    const btn = document.createElement('button');
    btn.textContent = letter;
    btn.classList.add('letter-btn');
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fetchRecipes(letter, true);
    });
    DOM.alphabet.appendChild(btn);
});

// Fetch & Display Recipes
async function fetchRecipes(query, isLetterSearch = false) {
    DOM.loading.classList.remove('hidden');
    DOM.recipeGrid.innerHTML = '';
    
    // Construct URL based on type of search
    let url = `${BASE_URL}?apiKey=${API_KEY}&number=12`;
    if (isLetterSearch) {
        url += `&query=${query}&sort=meta-score`;
    } else {
        url += `&query=${encodeURIComponent(query)}`;
    }

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Network error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        renderRecipes(data.results);
    } catch (error) {
        console.error("Fetch failed:", error);
        DOM.recipeGrid.innerHTML = `<p style="text-align: center; width: 100%;">Failed to load recipes. Please check your API Key and Network connection.</p>`;
    } finally {
        DOM.loading.classList.add('hidden');
    }
}

function renderRecipes(recipes) {
    DOM.recipeGrid.innerHTML = '';
    if (!recipes || recipes.length === 0) {
        DOM.recipeGrid.innerHTML = '<p style="text-align: center; width: 100%;">No recipes found.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.classList.add('recipe-card');
        card.innerHTML = `
            <img src="${recipe.image || 'https://placeholder.com'}" alt="${recipe.title}">
            <div class="recipe-card-content">
                <h3>${recipe.title}</h3>
                <a href="https://spoonacular.com{recipe.title.replace(/ /g, '-')}-${recipe.id}" target="_blank">View Recipe</a>
            </div>
        `;
        DOM.recipeGrid.appendChild(card);
    });
}

// Search Event Listeners
DOM.searchBtn.addEventListener('click', () => {
    const query = DOM.searchInput.value.trim();
    if (query) fetchRecipes(query);
});

DOM.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = DOM.searchInput.value.trim();
        if (query) fetchRecipes(query);
    }
});

// Default Load
fetchRecipes('pasta');
