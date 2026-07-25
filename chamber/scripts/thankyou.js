// ===== Display Form Data from URL Parameters =====
function displayFormData() {
    const urlParams = new URLSearchParams(window.location.search);
    const container = document.getElementById("summary-container");

    if (!container) return;

    // Map of URL parameter names to display labels
    const fieldMap = {
        "first-name": "First Name",
        "last-name": "Last Name",
        "email": "Email Address",
        "phone": "Mobile Phone",
        "business-name": "Business/Organization Name",
        "timestamp": "Application Date"
    };

    let hasData = false;
    let html = "";

    for (const [key, label] of Object.entries(fieldMap)) {
        // URLSearchParams.get() already decodes values - no decodeURIComponent needed
        const value = urlParams.get(key);

        if (value) {
            hasData = true;
            html += `
                <div class="summary-item">
                    <span class="summary-label">${label}:</span>
                    <span class="summary-value">${value}</span>
                </div>
            `;
        }
    }

    if (hasData) {
        container.innerHTML = html;
    } else {
        container.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Status:</span>
                <span class="summary-value">No application data found. Please submit the form from the join page.</span>
            </div>
        `;
    }
}

// ===== Initialize =====
document.addEventListener("DOMContentLoaded", displayFormData);