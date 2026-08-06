// weather.js - Fetch and display weather for featured cities using Open-Meteo (FREE, no API key)

// Cities with latitude and longitude
const CITIES = [
    { name: 'London', lat: 51.5074, lon: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Cape Town', lat: -33.9249, lon: 18.4241 },
    { name: 'Rio de Janeiro', lat: -22.9068, lon: -43.1729 },
    { name: 'Dubai', lat: 25.2048, lon: 55.2708 }
];

// Fallback weather data
const FALLBACK_WEATHER = [
    { temp: '18°C', condition: 'Partly Cloudy', icon: '☁️' },
    { temp: '22°C', condition: 'Sunny', icon: '☀️' },
    { temp: '15°C', condition: 'Rainy', icon: '🌧️' },
    { temp: '20°C', condition: 'Clear', icon: '🌤️' },
    { temp: '24°C', condition: 'Sunny', icon: '☀️' },
    { temp: '21°C', condition: 'Partly Cloudy', icon: '⛅' },
    { temp: '28°C', condition: 'Hot', icon: '🔥' },
    { temp: '32°C', condition: 'Hot', icon: '🔥' }
];

export async function fetchWeather() {
    const weatherGrid = document.getElementById('weather-grid');
    if (!weatherGrid) return;

    try {
        const weatherData = await getWeatherData();
        displayWeather(weatherData, weatherGrid);
    } catch (error) {
        console.error('Weather fetch error:', error);
        displayWeather(FALLBACK_WEATHER, weatherGrid);
    }
}

async function getWeatherData() {
    // Open-Meteo is FREE and requires NO API key
    const promises = CITIES.map(async (city) => {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&timezone=auto`
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();

            const temp = data.current_weather?.temperature;
            const weatherCode = data.current_weather?.weathercode;

            return {
                city: city.name,
                temp: temp !== undefined ? `${Math.round(temp)}°C` : '--°C',
                condition: getWeatherCondition(weatherCode),
                icon: getWeatherIcon(weatherCode)
            };
        } catch (error) {
            console.error(`Failed to fetch weather for ${city.name}:`, error);
            return null;
        }
    });

    const results = await Promise.all(promises);

    // Filter out failed requests and use fallback for them
    return results.map((result, index) => {
        if (result) return result;
        const fallback = FALLBACK_WEATHER[index % FALLBACK_WEATHER.length];
        return {
            ...fallback,
            city: CITIES[index]?.name || 'City'
        };
    });
}

// Map WMO weather codes to human-readable conditions
function getWeatherCondition(code) {
    const conditions = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Foggy',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        61: 'Light rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        71: 'Light snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        80: 'Light showers',
        81: 'Moderate showers',
        82: 'Heavy showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm',
        99: 'Thunderstorm'
    };
    return conditions[code] || 'Unknown';
}

function getWeatherIcon(code) {
    const iconMap = {
        0: '☀️',
        1: '🌤️',
        2: '⛅',
        3: '☁️',
        45: '🌫️',
        48: '🌫️',
        51: '🌧️',
        53: '🌧️',
        55: '🌧️',
        61: '🌧️',
        63: '🌧️',
        65: '🌧️',
        71: '❄️',
        73: '❄️',
        75: '❄️',
        80: '🌦️',
        81: '🌧️',
        82: '🌧️',
        95: '⛈️',
        96: '⛈️',
        99: '⛈️'
    };
    return iconMap[code] || '🌤️';
}

function displayWeather(weatherData, container) {
    container.innerHTML = '';

    weatherData.forEach((weather, index) => {
        const card = document.createElement('div');
        card.className = 'weather-card';
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Weather in ${weather.city || CITIES[index]?.name || 'City'}`);

        card.innerHTML = `
            <div class="city-name">${weather.city || CITIES[index]?.name || 'City'}</div>
            <div class="weather-icon-small">${weather.icon || '🌤️'}</div>
            <div class="temp">${weather.temp || '--°C'}</div>
            <div class="condition">${weather.condition || 'Loading...'}</div>
        `;

        container.appendChild(card);
    });
}