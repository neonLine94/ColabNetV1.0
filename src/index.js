document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Dummy authentication with roles
        let validUsers = JSON.parse(localStorage.getItem('users')) || [
            { username: 'admin', password: 'admin', role: 'admin', company: 'Admin' },
            { username: 'user', password: 'user', role: 'user', company: 'User Company' }
        ];

        const user = validUsers.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = '../docs/dashboard.html';
        } else {
            errorMessage.classList.remove('hidden');
        }
    });
});
