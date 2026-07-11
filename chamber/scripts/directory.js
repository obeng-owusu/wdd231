// ===== Footer Copyright Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Last Modification Date =====
document.getElementById('last-modified').textContent = document.lastModified;

// ===== Mobile Menu Toggle =====
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('nav');

menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
});

// Close menu when a link is clicked (for mobile)
document.querySelectorAll('#primary-nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.textContent = '☰';
    });
});

// ===== Fetch and Display Members =====
async function fetchMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error fetching member data:', error);
        document.getElementById('members-container').innerHTML = `
            <p style="color: red; text-align: center; padding: 2rem;">
                ⚠️ Unable to load member directory. Please try again later.
            </p>
        `;
    }
}

function displayMembers(members) {
    const container = document.getElementById('members-container');
    container.innerHTML = members.map(member => `
        <div class="member-card" data-level="${member.membershipLevel}">
            <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
            <div class="card-details">
                <h3>${member.name}</h3>
                <p class="address">📍 ${member.address}</p>
                <p class="phone">📞 ${member.phone}</p>
                <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="website">
                    Visit Website
                </a>
                <span class="membership-level level-${getLevelClass(member.membershipLevel)}">
                    ${getLevelLabel(member.membershipLevel)}
                </span>
            </div>
        </div>
    `).join('');
}

function getLevelClass(level) {
    const levels = { 1: 'member', 2: 'silver', 3: 'gold' };
    return levels[level] || 'member';
}

function getLevelLabel(level) {
    const labels = { 1: 'Member', 2: 'Silver Member', 3: 'Gold Member' };
    return labels[level] || 'Member';
}

// ===== Toggle Between Grid and List Views =====
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const container = document.getElementById('members-container');

gridViewBtn.addEventListener('click', () => {
    container.classList.remove('list-view');
    container.classList.add('grid-view');
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
});

listViewBtn.addEventListener('click', () => {
    container.classList.remove('grid-view');
    container.classList.add('list-view');
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
});

// ===== Initialize =====
fetchMembers();