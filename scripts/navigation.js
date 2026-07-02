// navigation.js – hamburger toggle + X animation
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('primary-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            hamburger.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', isOpen);
        });
    }
});