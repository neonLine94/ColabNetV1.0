document.addEventListener('DOMContentLoaded', () => {
    
    // const newUsers = [
    //    { username: 'admin', password: 'admin', role: 'admin', company: 'Admin', firstName: 'Admin', lastName: 'User', position: 'Manager' },
    //    { username: 'test', password: 'test', role: 'user', company: 'Test Company', firstName: 'Test', lastName: 'User', position: 'Manager' },
    //    { username: 'user', password: 'user', role: 'user', company: 'User Company', firstName: 'User', lastName: 'User', position: 'Technician' }
    // ];

    // localStorage.setItem('users', JSON.stringify(newUsers));

    // Initiale Benutzer erstellen, wenn keine vorhanden sind
    if (!localStorage.getItem('users')) {
        const initialUsers = [
            { username: 'admin', password: 'admin', role: 'admin', company: 'Admin', firstName: 'Admin', lastName: 'User', position: 'Admin', phone: '123456789', email: 'admin@example.com' },
            { username: 'user', password: 'user', role: 'user', company: 'User Company', firstName: 'User', lastName: 'User', position: 'Technician', phone: '987654321', email: 'user@example.com' }
        ];
        localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    // Anmeldefunktion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Ungültige Anmeldedaten');
            }
        });
    }

    // Logout-Funktion
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
});