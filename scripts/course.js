// course.js – data, rendering, filtering, total credits
document.addEventListener('DOMContentLoaded', () => {
    const courses = [
        { code: 'WDD130', name: 'Web Fundamentals', credits: 3, completed: true },
        { code: 'WDD131', name: 'Dynamic Web Fundamentals', credits: 3, completed: true },
        { code: 'WDD231', name: 'Frontend Development I', credits: 3, completed: false },
        { code: 'CSE110', name: 'Programming with JavaScript', credits: 3, completed: true },
        { code: 'CSE111', name: 'Programming with Functions', credits: 3, completed: true },
        { code: 'CSE210', name: 'Programming with Classes', credits: 3, completed: true },
        { code: 'WDD330', name: 'Web Frontend Development II', credits: 3, completed: false },
        { code: 'CSE310', name: 'Web App Development', credits: 3, completed: false }
    ];

    const container = document.getElementById('course-cards');
    const totalEl = document.getElementById('total-credits');
    const buttons = document.querySelectorAll('.filter-btn');

    function renderCourses(filter = 'all') {
        if (!container) return;

        let filtered = filter === 'all'
            ? courses
            : courses.filter(c => c.code.startsWith(filter));

        container.innerHTML = filtered.map(c => {
            const completedClass = c.completed ? 'completed' : '';
            return `
        <div class="course-item ${completedClass}">
          ${c.code}
          ${c.completed ? '<span class="completed-text">✓ Completed</span>' : ''}
        </div>
      `;
        }).join('');

        const total = filtered.reduce((sum, c) => sum + c.credits, 0);
        if (totalEl) {
            totalEl.textContent = `Total credits: ${total}`;
        }
    }

    // button click: update active state + render
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            renderCourses(btn.dataset.filter);
        });
        // set initial aria-pressed
        if (btn.classList.contains('active')) {
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.setAttribute('aria-pressed', 'false');
        }
    });

    // initial render
    renderCourses('all');
});