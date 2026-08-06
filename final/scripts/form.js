// form.js - Contact form handling and thank you page display

export function initForm() {
    const form = document.getElementById('travel-form');

    // Check if we're on the thank you page
    if (window.location.pathname.includes('thankyou.html')) {
        displayThankYouData();
        return;
    }

    // Form submission handler
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Validate required fields with patterns
    const firstName = formData.get('firstName')?.trim();
    const lastName = formData.get('lastName')?.trim();
    const email = formData.get('email')?.trim();
    const destination = formData.get('destination')?.trim();

    // Name validation - letters, spaces, hyphens only, 2-50 characters
    const namePattern = /^[A-Za-z\s\-]{2,50}$/;

    if (!firstName || !namePattern.test(firstName)) {
        alert('Please enter a valid First Name (2-50 characters, letters only).');
        return;
    }

    if (!lastName || !namePattern.test(lastName)) {
        alert('Please enter a valid Last Name (2-50 characters, letters only).');
        return;
    }

    if (!email) {
        alert('Please enter your email address.');
        return;
    }

    if (!destination) {
        alert('Please enter your preferred destination.');
        return;
    }

    // Build query string from form data
    const params = new URLSearchParams();
    for (const [key, value] of formData.entries()) {
        if (value && value.trim() !== '') {
            params.append(key, value.trim());
        }
    }

    // Add submission date
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    params.append('submissionDate', dateString);

    // Redirect to thank you page with data
    window.location.href = `thankyou.html?${params.toString()}`;
}

// Display submitted data on thank you page
function displayThankYouData() {
    const container = document.getElementById('thankyou-data');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);

    if (params.size === 0) {
        container.innerHTML = '<p>No data submitted. Please go back and fill out the form.</p>';
        return;
    }

    // Map form field names to display labels
    const fieldLabels = {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email Address',
        destination: 'Preferred Destination',
        travelDate: 'Travel Date',
        travelers: 'Number of Travelers',
        comments: 'Additional Comments',
        submissionDate: 'Submission Date'
    };

    let html = '';
    let hasData = false;

    for (const [key, value] of params.entries()) {
        if (value && value.trim() !== '') {
            const label = fieldLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
            html += `<p><strong>${label}:</strong> ${escapeHTML(value)}</p>`;
            hasData = true;
        }
    }

    if (!hasData) {
        html = '<p>No data submitted.</p>';
    }

    container.innerHTML = html;
}

// Simple escape function to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}