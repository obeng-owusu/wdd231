// modal.js - Country detail modal with focus management

let lastFocusedElement = null;

export function initModal() {
    const modal = document.getElementById('country-modal');
    const content = document.getElementById('modal-content');
    const closeBtn = modal?.querySelector('.modal-close');

    if (!modal || !content || !closeBtn) return;

    function closeModal() {
        modal.close();
        // Return focus to the element that opened the modal
        if (lastFocusedElement) {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    // Close on button click
    closeBtn.addEventListener('click', closeModal);

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.open) {
            closeModal();
        }
    });

    // Delegate detail button clicks
    document.addEventListener('click', async (e) => {
        const btn = e.target.closest('.detail-btn');
        if (!btn) return;

        const countryName = btn.dataset.countryName;
        if (!countryName) return;

        // Store the button that opened the modal
        lastFocusedElement = btn;

        // Show loading state
        content.innerHTML = '<p>Loading country details...</p>';
        modal.showModal();

        // Focus the close button for accessibility
        setTimeout(() => closeBtn.focus(), 50);

        try {
            const countryData = await fetchCountryDetails(countryName);
            if (countryData) {
                content.innerHTML = createModalContent(countryData);
                // Focus the first heading inside the modal after content loads
                const heading = content.querySelector('h2');
                if (heading) heading.focus();
            } else {
                content.innerHTML = '<p>Unable to load country details. Please try again.</p>';
            }
        } catch (error) {
            console.error('Modal error:', error);
            content.innerHTML = '<p>Error loading country details. Please try again.</p>';
        }
    });
}

// Fetch full country data by name
async function fetchCountryDetails(name) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=true&fields=name,capital,population,region,flags,languages,currencies,maps,timezones,area,coatOfArms,subregion`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data[0];
    } catch (error) {
        console.error('Failed to fetch country details:', error);
        return null;
    }
}

// Create modal content HTML with proper aria-labelledby
function createModalContent(country) {
    const flag = country.flags?.svg || country.flags?.png || 'https://placehold.co/150x100/cccccc/333?text=Flag';
    const name = country.name?.common || 'Unknown';
    const nativeName = country.name?.nativeName ? Object.values(country.name.nativeName)[0]?.common || 'N/A' : 'N/A';
    const capital = country.capital?.[0] || 'N/A';
    const population = country.population?.toLocaleString() || 'N/A';
    const region = country.region || 'N/A';
    const subregion = country.subregion || 'N/A';
    const languages = country.languages ? Object.values(country.languages).join(', ') : 'N/A';
    const currencies = country.currencies ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol || ''})`).join(', ') : 'N/A';
    const timezones = country.timezones?.join(', ') || 'N/A';
    const area = country.area?.toLocaleString() || 'N/A';
    const maps = country.maps?.googleMaps || '#';
    const coatOfArms = country.coatOfArms?.png || '';

    return `
        <h2 id="modal-title" tabindex="-1">${name}</h2>
        <img src="${flag}" alt="Flag of ${name}" style="max-width:150px; border-radius:8px; margin:0.5rem 0;" loading="lazy" decoding="async">
        <p><strong>Native Name:</strong> ${nativeName}</p>
        <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${population}</p>
        <p><strong>Region:</strong> ${region} ${subregion !== 'N/A' ? `(${subregion})` : ''}</p>
        <p><strong>Languages:</strong> ${languages}</p>
        <p><strong>Currencies:</strong> ${currencies}</p>
        <p><strong>Timezones:</strong> ${timezones}</p>
        <p><strong>Area:</strong> ${area} km²</p>
        ${coatOfArms ? `<img src="${coatOfArms}" alt="Coat of arms" style="max-width:80px; margin:0.5rem 0;" loading="lazy" decoding="async">` : ''}
        <p style="margin-top:1rem;">
            <a href="${maps}" target="_blank" rel="noopener">📍 View on Google Maps</a>
        </p>
    `;
}