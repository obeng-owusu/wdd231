// api.js - Fetch and process country data from REST Countries API

const API_URL = 'https://restcountries.com/v3.1/all?fields=name,capital,population,region,flags,languages,currencies,maps,timezones,area,coatOfArms';

// Fetch all countries with error handling
export async function fetchCountries() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    } catch (error) {
        console.error('Failed to fetch countries:', error);
        return getFallbackCountries();
    }
}

// Filter countries by region
export function filterByRegion(countries, region) {
    if (region === 'all' || !region) return countries;
    return countries.filter(country => country.region === region);
}

// Search countries by name
export function searchCountries(countries, query) {
    if (!query || query.trim() === '') return countries;
    const searchTerm = query.toLowerCase().trim();
    return countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm)
    );
}

// Display countries in a grid container
export function displayCountries(countries, container, limit = null) {
    if (!container) return;

    const displayList = limit ? countries.slice(0, limit) : countries;
    container.innerHTML = '';

    if (displayList.length === 0) {
        container.innerHTML = '<p class="no-results">No countries found. Try adjusting your search or filter.</p>';
        return;
    }

    displayList.forEach(country => {
        container.appendChild(createCountryCard(country));
    });
}

// Create a country card element - using <article> for semantic HTML
function createCountryCard(country) {
    const card = document.createElement('article');
    card.className = 'country-card';
    card.setAttribute('tabindex', '0');

    // Use SVG flag if available for better quality
    const flag = country.flags?.svg || country.flags?.png || 'https://placehold.co/80x50/cccccc/333?text=Flag';
    const name = country.name?.common || 'Unknown';
    const capital = country.capital?.[0] || 'N/A';
    const population = country.population?.toLocaleString() || 'N/A';
    const region = country.region || 'N/A';

    card.innerHTML = `
        <img src="${flag}" alt="Flag of ${name}" loading="lazy" decoding="async" width="80" height="50">
        <h3>${name}</h3>
        <p>Capital: ${capital}</p>
        <p>Population: ${population}</p>
        <p>Region: ${region}</p>
        <div class="card-actions">
            <button class="fav-btn" data-country="${name}" aria-pressed="false">⭐ Favorite</button>
            <button class="detail-btn" data-country-name="${name}">View Details</button>
        </div>
    `;

    return card;
}

// Fallback data in case API fails
function getFallbackCountries() {
    return [
        { name: { common: 'United States' }, flags: { svg: 'https://placehold.co/80x50/0033a0/white?text=US' }, capital: ['Washington D.C.'], population: 331000000, region: 'Americas' },
        { name: { common: 'United Kingdom' }, flags: { svg: 'https://placehold.co/80x50/00247d/white?text=UK' }, capital: ['London'], population: 67000000, region: 'Europe' },
        { name: { common: 'Japan' }, flags: { svg: 'https://placehold.co/80x50/bc002d/white?text=JP' }, capital: ['Tokyo'], population: 125800000, region: 'Asia' },
        { name: { common: 'France' }, flags: { svg: 'https://placehold.co/80x50/002395/white?text=FR' }, capital: ['Paris'], population: 67390000, region: 'Europe' },
        { name: { common: 'Brazil' }, flags: { svg: 'https://placehold.co/80x50/009739/white?text=BR' }, capital: ['Brasília'], population: 213000000, region: 'Americas' },
        { name: { common: 'Australia' }, flags: { svg: 'https://placehold.co/80x50/00008b/white?text=AU' }, capital: ['Canberra'], population: 25690000, region: 'Oceania' },
        { name: { common: 'India' }, flags: { svg: 'https://placehold.co/80x50/ff9933/white?text=IN' }, capital: ['New Delhi'], population: 1380000000, region: 'Asia' },
        { name: { common: 'South Africa' }, flags: { svg: 'https://placehold.co/80x50/007a4b/white?text=ZA' }, capital: ['Pretoria'], population: 59300000, region: 'Africa' },
        { name: { common: 'Canada' }, flags: { svg: 'https://placehold.co/80x50/ff0000/white?text=CA' }, capital: ['Ottawa'], population: 38000000, region: 'Americas' },
        { name: { common: 'Germany' }, flags: { svg: 'https://placehold.co/80x50/000000/white?text=DE' }, capital: ['Berlin'], population: 83100000, region: 'Europe' }
    ];
}