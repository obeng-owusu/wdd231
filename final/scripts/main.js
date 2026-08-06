// main.js - Application entry point

import { initNavigation } from './navigation.js';
import { fetchCountries, filterByRegion, searchCountries, displayCountries } from './api.js';
import { initFavorites, refreshAllFavButtons } from './favorites.js';
import { initModal } from './modal.js';
import { initForm } from './form.js';
import { fetchWeather } from './weather.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize all modules
    initNavigation();
    initModal();
    initFavorites();
    initForm();

    // Update footer info
    updateFooterInfo();

    // Update date display
    updateDateDisplay();

    // Determine which page we're on
    const path = window.location.pathname;
    const isDestinationsPage = path.includes('destinations.html');
    const isContactPage = path.includes('contact.html');
    const isThankYouPage = path.includes('thankyou.html');
    const isHomePage = path.includes('index.html') || path.endsWith('/') || path.endsWith('/final/');

    // Load weather on home page
    if (isHomePage) {
        fetchWeather();
    }

    // Skip API calls on contact and thank you pages
    if (isContactPage || isThankYouPage) {
        return;
    }

    // Load countries
    const countries = await fetchCountries();

    if (!countries || countries.length === 0) {
        showErrorMessage();
        return;
    }

    // Update country count
    const countElement = document.getElementById('country-count');
    if (countElement) {
        countElement.textContent = countries.length;
    }

    // Get the grid container
    const grid = document.getElementById('featured-grid');
    if (!grid) return;

    if (isDestinationsPage) {
        setupDestinationsPage(countries, grid);
    } else if (isHomePage) {
        setupHomePage(countries, grid);
    }
});

// Home page setup
function setupHomePage(countries, grid) {
    // Show 6 featured countries
    displayCountries(countries, grid, 6);
    refreshAllFavButtons();

    // Continent filter buttons
    const buttons = document.querySelectorAll('.continent-buttons button');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const region = btn.dataset.region;
            let filtered = region === 'all' ? countries : filterByRegion(countries, region);
            displayCountries(filtered, grid, 6);
            refreshAllFavButtons();

            // Update active button
            buttons.forEach(b => {
                b.style.background = '';
                b.style.color = '';
            });
            btn.style.background = '#ffb347';
            btn.style.color = '#1a1a2e';
        });
    });
}

// Destinations page setup
function setupDestinationsPage(countries, grid) {
    // Show all countries
    displayCountries(countries, grid);
    refreshAllFavButtons();

    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value;
            const filtered = searchCountries(countries, query);
            const filterSelect = document.getElementById('filter-select');
            const region = filterSelect ? filterSelect.value : 'all';
            const regionFiltered = region === 'all' ? filtered : filterByRegion(filtered, region);
            displayCountries(regionFiltered, grid);
            refreshAllFavButtons();
        });
    }

    // Filter select
    const filterSelect = document.getElementById('filter-select');
    if (filterSelect) {
        filterSelect.addEventListener('change', () => {
            const region = filterSelect.value;
            const searchInput = document.getElementById('search-input');
            const query = searchInput ? searchInput.value : '';
            let filtered = region === 'all' ? countries : filterByRegion(countries, region);
            filtered = searchCountries(filtered, query);
            displayCountries(filtered, grid);
            refreshAllFavButtons();
        });
    }
}

// Update date display
function updateDateDisplay() {
    const now = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        dateElement.textContent = dateString;
    }
}

// Update footer info
function updateFooterInfo() {
    // Update year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Update last modified - using document.lastModified as expected by BYU
    const modifiedElement = document.getElementById('last-modified');
    if (modifiedElement) {
        const lastMod = new Date(document.lastModified);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        modifiedElement.textContent = lastMod.toLocaleDateString('en-US', options);
    }
}

// Show error message if API fails
function showErrorMessage() {
    const grid = document.getElementById('featured-grid');
    if (grid) {
        grid.innerHTML = `
            <div class="error-message">
                <p>⚠️ Unable to load country data. Please check your internet connection and try again.</p>
                <button onclick="location.reload()" class="retry-button">Retry</button>
            </div>
        `;
    }
}