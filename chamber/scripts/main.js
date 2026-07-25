// ===== Cache DOM elements =====
const year = document.getElementById("year");
const lastModified = document.getElementById("last-modified");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("nav");

// ===== Footer Copyright Year =====
if (year) {
    year.textContent = new Date().getFullYear();
}

// ===== Last Modification Date =====
if (lastModified) {
    lastModified.textContent = document.lastModified;
}

// ===== Mobile Menu Toggle =====
if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        nav.classList.toggle("open");
        menuToggle.textContent = nav.classList.contains("open") ? "✕" : "☰";
    });

    // Close menu when a link is clicked (for mobile)
    document.querySelectorAll("#primary-nav a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle.textContent = "☰";
        });
    });
}