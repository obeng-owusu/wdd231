// date.js – dynamic footer dates
document.addEventListener('DOMContentLoaded', () => {
    const yearSpan = document.getElementById('currentyear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    const lastMod = document.getElementById('lastModified');
    if (lastMod) {
        lastMod.textContent = 'Last modified: ' + document.lastModified;
    }
});