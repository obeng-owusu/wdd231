// ===== Footer Copyright Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Last Modification Date =====
document.getElementById('last-modified').textContent = document.lastModified;

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
});

// Close menu when a link is clicked (for mobile)
document.querySelectorAll('#primary-nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.textContent = '☰';
    });
});

// ===== Weather API =====
async function fetchWeather() {
    // FIXED: Replace with your actual OpenWeatherMap API key
    const apiKey = '9bxxxxxxxxxxxxxxxxxxxxxxxx'; // <-- PUT YOUR REAL API KEY HERE

    // FIXED: Replace with your chamber city's coordinates
    // Example for Accra, Ghana:
    const lat = 5.6037;
    const lon = -0.1870;

    // Current weather URL with imperial units (Fahrenheit)
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    // 5-day forecast URL with imperial units
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    try {
        // Fetch current weather
        const weatherResponse = await fetch(currentWeatherUrl);
        if (!weatherResponse.ok) throw new Error('Weather data not available');
        const weatherData = await weatherResponse.json();

        // Update current weather display
        document.getElementById('current-temp').textContent = `${Math.round(weatherData.main.temp)}°F`;
        document.getElementById('weather-description').textContent = weatherData.weather[0].description;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        document.getElementById('weather-icon').alt = weatherData.weather[0].description;
        document.getElementById('weather-location').textContent = weatherData.name;

        // Fetch 5-day forecast
        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error('Forecast data not available');
        const forecastData = await forecastResponse.json();

        // Get one forecast per day for the next 3 days (at 12:00 PM each day)
        const forecastList = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));

        // FIXED: Build forecast HTML with separate day name and temperature
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '';

        for (let i = 0; i < 3 && i < forecastList.length; i++) {
            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';

            const dayName = document.createElement('p');
            dayName.className = 'forecast-day-name';

            if (i === 0) {
                dayName.textContent = 'Today';
            } else {
                const date = new Date(forecastList[i].dt * 1000);
                dayName.textContent = date.toLocaleDateString('en-US', { weekday: 'long' });
            }

            const dayTemp = document.createElement('p');
            dayTemp.className = 'forecast-temp';
            dayTemp.textContent = `${Math.round(forecastList[i].main.temp)}°F`;

            forecastDay.appendChild(dayName);
            forecastDay.appendChild(dayTemp);
            forecastContainer.appendChild(forecastDay);
        }

    } catch (error) {
        console.error('Error fetching weather:', error);
        document.getElementById('current-temp').textContent = '--°F';
        document.getElementById('weather-description').textContent = 'Weather unavailable';
    }
}

// ===== Fetch and Display Spotlights =====
async function fetchSpotlights() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const members = await response.json();

        // Filter gold (level 3) and silver (level 2) members
        const eligibleMembers = members.filter(member =>
            member.membershipLevel === 3 || member.membershipLevel === 2
        );

        // Randomly select 2-3 members
        const spotlights = getRandomSpotlights(eligibleMembers);
        displaySpotlights(spotlights);

    } catch (error) {
        console.error('Error fetching member data:', error);
        document.getElementById('spotlight-container').innerHTML = `
            <p style="color: red; text-align: center; padding: 1rem;">
                ⚠️ Unable to load spotlights. Please try again later.
            </p>
        `;
    }
}

function getRandomSpotlights(members) {
    const count = Math.min(members.length, Math.floor(Math.random() * 2) + 2); // 2 or 3
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displaySpotlights(spotlights) {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = spotlights.map(member => `
        <div class="spotlight-card">
            <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
            <h3>${member.name}</h3>
            <p class="address">📍 ${member.address}</p>
            <p class="phone">📞 ${member.phone}</p>
            <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="website-link">
                Visit Website
            </a>
            <span class="membership-level level-${member.membershipLevel === 3 ? 'gold' : 'silver'}">
                ${member.membershipLevel === 3 ? '⭐ Gold Member' : '⭐ Silver Member'}
            </span>
            <!-- FIXED: Added description for more informative spotlights -->
            <p class="description">${member.description}</p>
        </div>
    `).join('');
}

// ===== Initialize =====
fetchWeather();
fetchSpotlights();