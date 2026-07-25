// ===== Set Timestamp (ISO format) inside DOMContentLoaded =====
document.addEventListener("DOMContentLoaded", () => {
    const timestampInput = document.getElementById("timestamp");
    if (timestampInput) {
        timestampInput.value = new Date().toISOString();
    }
});

// ===== Modals =====
document.querySelectorAll(".modal-trigger").forEach(button => {
    button.addEventListener("click", () => {
        const modalId = button.dataset.modal;
        const dialog = document.getElementById(modalId);
        if (dialog) {
            dialog.showModal();
            document.body.style.overflow = "hidden";
        }
    });
});

document.querySelectorAll(".modal-close").forEach(button => {
    button.addEventListener("click", () => {
        const dialog = button.closest("dialog");
        if (dialog) {
            dialog.close();
            document.body.style.overflow = "auto";
        }
    });
});

// Close modals by clicking outside content
document.querySelectorAll(".membership-modal").forEach(dialog => {
    dialog.addEventListener("click", (e) => {
        const dialogRect = dialog.getBoundingClientRect();
        if (e.clientX < dialogRect.left || e.clientX > dialogRect.right ||
            e.clientY < dialogRect.top || e.clientY > dialogRect.bottom) {
            dialog.close();
            document.body.style.overflow = "auto";
        }
    });
});

// Close modals with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.querySelectorAll(".membership-modal[open]").forEach(dialog => {
            dialog.close();
            document.body.style.overflow = "auto";
        });
    }
});

// ===== Membership Card Animations on Load =====
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".membership-card");
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add("card-animate");
    });
});

// ===== Form Validation =====
const form = document.getElementById("membership-form");
if (form) {
    form.addEventListener("submit", () => {
        console.log("Form submitted with GET method");
    });
}