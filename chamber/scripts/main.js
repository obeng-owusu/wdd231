// scripts/main.js

// ============================================
// HAMBURGER MENU TOGGLE WITH ARIA-EXPANDED
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.getElementById('menu-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', function () {
            const isOpen = primaryNav.classList.toggle('open');
            // Update aria-expanded attribute
            this.setAttribute('aria-expanded', isOpen);
        });
    }

    // ============================================
    // SET FOOTER YEAR & LAST MODIFIED
    // ============================================
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
});