const API_KEY = '8a38933b4c574da49d22b79385d2a02f'; // Replace with your actual Spoonacular API key
const BASE_URL = 'https://api.spoonacular.com/recipes/complexSearch';
const HEADERS = {
    'Content-Type': 'application/json'
};

// Function to fetch recipes starting with a specific letter
async function fetchRecipesByLetter(letter) {
    const url = `${BASE_URL}?query=${letter}&number=12&apiKey=${API_KEY}`;
    await getAndDisplayRecipes(url);
}

// Function to fetch recipes via search bar
async function fetchRecipesByKeyword() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) return alert("Please enter a keyword!");
    const url = `https://spoonacular.com{query}&number=12&apiKey=${API_KEY}`;
    await getAndDisplayRecipes(url);
}

// Core Fetch and Render logic
async function getAndDisplayRecipes(url) {
    const container = document.getElementById('recipe-container');
    container.innerHTML = '<p>Loading recipes...</p>'; // Loading state

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.results && data.results.length === 0) {
            container.innerHTML = '<p>No recipes found.</p>';
            return;
        }

        renderRecipeCards(data.results);
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        container.innerHTML = '<p>Error loading recipes. Please check your API key and network.</p>';
    }
}

// DOM manipulation to render recipe cards
function renderRecipeCards(recipes) {
    const container = document.getElementById('recipe-container');
    container.innerHTML = ''; // Clear loading state

    recipes.forEach(recipe => {
        const cardHTML = `
            <div class="recipe-card">
                <img src="${recipe.image}" alt="${recipe.title}">
                <h3>${recipe.title}</h3>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}
