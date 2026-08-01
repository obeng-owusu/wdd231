// scripts/discover.js - type="module"

import { placesOfInterest } from '../data/discover.mjs';

// ============================================
// 1. RENDER CARDS
// ============================================
function renderCards() {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;

    grid.innerHTML = '';

    placesOfInterest.forEach((place, index) => {
        // IMPROVEMENT 1: Use <article> instead of <div>
        const card = document.createElement('article');
        card.className = 'place-card';
        // IMPROVEMENT 6: REMOVED inline grid-area assignment - using CSS only

        card.innerHTML = `
            <figure>
                <!-- IMPROVEMENT 3: Added decoding="async" -->
                <img 
                    src="${place.image}" 
                    alt="${place.alt || place.name}" 
                    loading="lazy" 
                    decoding="async"
                    width="300" 
                    height="200">
            </figure>
            <div class="card-content">
                <h2>${place.name}</h2>
                <address>${place.address}</address>
                <p class="description">${place.description}</p>
                <!-- IMPROVEMENT 2: Added type="button" -->
                <button type="button" class="learn-btn" data-id="${place.id}">Learn More</button>
            </div>
        `;

        grid.appendChild(card);
    });

    // Add event listeners to "Learn More" buttons
    document.querySelectorAll('.learn-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = parseInt(this.dataset.id, 10);
            const place = placesOfInterest.find(p => p.id === id);
            if (place) {
                openModal(place);
            }
        });
    });
}

// ============================================
// 2. MODAL FUNCTIONS (IMPROVEMENT 5)
// ============================================
function openModal(place) {
    const modal = document.getElementById('place-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalAddress = document.getElementById('modal-address');
    const modalDescription = document.getElementById('modal-description');

    if (!modal || !modalTitle || !modalAddress || !modalDescription) return;

    modalTitle.textContent = place.name;
    modalAddress.textContent = place.address;
    modalDescription.textContent = place.description;

    modal.showModal();
}

function closeModal() {
    const modal = document.getElementById('place-modal');
    if (modal) {
        modal.close();
    }
}

// ============================================
// 3. VISIT TRACKING WITH LOCALSTORAGE
// ============================================
function trackVisit() {
    const messageEl = document.getElementById('visit-message');
    if (!messageEl) return;

    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisitDate');
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in one day

    let message = '';
    let className = '';

    if (!lastVisit) {
        // First visit
        message = '👋 Welcome! Let us know if you have any questions.';
        className = 'welcome';
    } else {
        const lastVisitNum = parseInt(lastVisit, 10);
        const diff = now - lastVisitNum;

        if (diff < oneDay) {
            // Less than a day
            message = '🔥 Back so soon! Awesome!';
            className = 'soon';
        } else {
            // Calculate whole days
            const days = Math.floor(diff / oneDay);
            const dayWord = days === 1 ? 'day' : 'days';
            message = `📅 You last visited ${days} ${dayWord} ago.`;
            className = 'days';
        }
    }

    // Store current visit timestamp
    localStorage.setItem('lastVisitDate', String(now));

    // Display message
    messageEl.textContent = message;
    messageEl.className = `visit-message ${className}`;
}

// ============================================
// 4. SET FOOTER YEAR & LAST MODIFIED
// ============================================
function setFooterInfo() {
    // Set current year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Set last modified date
    const modifiedSpan = document.getElementById('last-modified');
    if (modifiedSpan) {
        modifiedSpan.textContent = document.lastModified;
    }
}

// ============================================
// 5. MODAL EVENT LISTENERS
// ============================================
function setupModalListeners() {
    const modal = document.getElementById('place-modal');
    const closeBtn = document.getElementById('modal-close');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        // Close modal when clicking outside the modal content
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Close modal with Escape key (built into dialog)
        modal.addEventListener('cancel', closeModal);
    }
}

// ============================================
// 6. INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    setFooterInfo();
    renderCards();
    trackVisit();
    setupModalListeners();
});