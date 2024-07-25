document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const userProfileForm = document.getElementById('userProfileForm');
    const changePasswordForm = document.getElementById('changePasswordForm');
    const usernameInput = document.getElementById('username');
    const companyInput = document.getElementById('company');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const positionSelect = document.getElementById('position');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Benutzerinformationen laden
    usernameInput.value = user.username;
    companyInput.value = user.company;
    firstNameInput.value = user.firstName || '';
    lastNameInput.value = user.lastName || '';
    positionSelect.value = user.position || 'Manager';
    phoneInput.value = user.phone || '';
    emailInput.value = user.email || '';

    userProfileForm.addEventListener('submit', (event) => {
        event.preventDefault();

        user.firstName = firstNameInput.value;
        user.lastName = lastNameInput.value;
        user.position = positionSelect.value;
        user.phone = phoneInput.value;
        user.email = emailInput.value;

        // Benutzerinformationen im LocalStorage speichern
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.map(u => u.username === user.username ? user : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('user', JSON.stringify(user));

        alert('Profil aktualisiert');
    });

    changePasswordForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const currentPassword = currentPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (currentPassword !== user.password) {
            alert('Aktuelles Passwort ist falsch');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Neue Passwörter stimmen nicht überein');
            return;
        }

        user.password = newPassword;

        // Benutzerinformationen im LocalStorage speichern
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = users.map(u => u.username === user.username ? user : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.setItem('user', JSON.stringify(user));

        alert('Passwort geändert');
        changePasswordForm.reset(); // Passwortfelder zurücksetzen
    });
    
    // $User im Dashboard
    document.getElementById('username').textContent = user.firstName + " " + user.lastName;


