// ===== Weather API =====
async function fetchWeather() {
    // ⚠️ IMPORTANT: Replace with your real OpenWeatherMap API key
    const apiKey = 'YOUR_REAL_API_KEY_HERE';

    const lat = 5.6037;
    const lon = -0.1870;

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    try {
        const weatherResponse = await fetch(currentWeatherUrl);
        if (!weatherResponse.ok) throw new Error('Weather data not available');
        const weatherData = await weatherResponse.json();

        document.getElementById('current-temp').textContent = `${Math.round(weatherData.main.temp)}°F`;
        document.getElementById('weather-description').textContent = weatherData.weather[0].description;
        document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        document.getElementById('weather-icon').alt = weatherData.weather[0].description;
        document.getElementById('weather-location').textContent = weatherData.name;

        const forecastResponse = await fetch(forecastUrl);
        if (!forecastResponse.ok) throw new Error('Forecast data not available');
        const forecastData = await forecastResponse.json();

        const forecastList = forecastData.list.filter(item => item.dt_txt.includes('12:00:00'));
        const forecastContainer = document.getElementById('forecast-container');
        forecastContainer.innerHTML = '';

        for (let i = 0; i < 3 && i < forecastList.length; i++) {
            const forecastDay = document.createElement('div');
            forecastDay.className = 'forecast-day';

            const dayName = document.createElement('p');
            dayName.className = 'forecast-day-name';
            const date = new Date(forecastList[i].dt * 1000);
            dayName.textContent = date.toLocaleDateString('en-US', { weekday: 'long' });

            const dayTemp = document.createElement('p');
            dayTemp.className = 'forecast-temp';
            dayTemp.textContent = `${Math.round(forecastList[i].main.temp)}°F`;

            forecastDay.appendChild(dayName);
            forecastDay.appendChild(dayTemp);
            forecastContainer.appendChild(forecastDay);
        }

    } catch (error) {
        console.error('Error fetching weather:', error);
        const temp = document.getElementById('current-temp');
        if (temp) temp.textContent = '--°F';
        const desc = document.getElementById('weather-description');
        if (desc) desc.textContent = 'Weather unavailable';
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

        const eligibleMembers = members.filter(member =>
            member.membershipLevel === 3 || member.membershipLevel === 2
        );

        const spotlights = getRandomSpotlights(eligibleMembers);
        displaySpotlights(spotlights);

    } catch (error) {
        console.error('Error fetching member data:', error);
        const container = document.getElementById('spotlight-container');
        if (container) {
            container.innerHTML = `
                <p style="color: red; text-align: center; padding: 1rem;">
                    ⚠️ Unable to load spotlights. Please try again later.
                </p>
            `;
        }
    }
}

function getRandomSpotlights(members) {
    const count = Math.min(members.length, Math.floor(Math.random() * 2) + 2);
    const shuffled = [...members].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function displaySpotlights(spotlights) {
    const container = document.getElementById('spotlight-container');
    if (!container) return;

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
            <p class="description">${member.description}</p>
        </div>
    `).join('');
}

// ===== Initialize =====
fetchWeather();
fetchSpotlights();