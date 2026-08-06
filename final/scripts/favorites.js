// favorites.js - LocalStorage favorites management

const STORAGE_KEY = 'travel_favorites';

// Get all favorite country names
export function getFavorites() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error reading favorites from localStorage:', error);
        return [];
    }
}

// Save favorites array to localStorage
function saveFavorites(favorites) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Error saving favorites to localStorage:', error);
    }
}

// Toggle a country's favorite status
export function toggleFavorite(countryName) {
    const favorites = getFavorites();
    const index = favorites.indexOf(countryName);

    if (index === -1) {
        favorites.push(countryName);
    } else {
        favorites.splice(index, 1);
    }

    saveFavorites(favorites);
    updateFavCount();

    // Update all buttons with this country name
    document.querySelectorAll(`.fav-btn[data-country="${countryName}"]`).forEach(btn => {
        const isFav = isFavorite(countryName);
        btn.classList.toggle('active', isFav);
        btn.textContent = isFav ? '⭐ Favorited' : '⭐ Favorite';
        btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
    });

    return favorites;
}

// Check if a country is favorited
export function isFavorite(countryName) {
    const favorites = getFavorites();
    return favorites.includes(countryName);
}

// Update favorite count in UI
export function updateFavCount() {
    const countElement = document.getElementById('favorite-count');
    if (countElement) {
        const favorites = getFavorites();
        countElement.textContent = favorites.length;
    }
}

// Initialize favorite buttons and event listeners
export function initFavorites() {
    updateFavCount();

    // Delegate click events for favorite buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.fav-btn');
        if (!btn) return;

        const countryName = btn.dataset.country;
        if (!countryName) return;

        // Toggle favorite
        toggleFavorite(countryName);
    });

    // Initialize button states
    refreshAllFavButtons();
}

// Refresh all favorite button states
export function refreshAllFavButtons() {
    document.querySelectorAll('.fav-btn').forEach(btn => {
        const countryName = btn.dataset.country;
        if (countryName) {
            const isFav = isFavorite(countryName);
            btn.classList.toggle('active', isFav);
            btn.textContent = isFav ? '⭐ Favorited' : '⭐ Favorite';
            btn.setAttribute('aria-pressed', isFav ? 'true' : 'false');
        }
    });
}