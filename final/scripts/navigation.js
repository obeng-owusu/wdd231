// navigation.js - Hamburger menu control

export function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('primary-nav');

    if (!hamburger || !navLinks) return;

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu on outside click (mobile)
    document.addEventListener('click', (e) => {
        const header = document.querySelector('header');
        if (header && !header.contains(e.target) && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.focus();
        }
    });
}