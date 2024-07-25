document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
    }

    const newUserForm = document.getElementById('newUserForm');
    const userCreatedMessage = document.getElementById('userCreatedMessage');
    const userTable = document.getElementById('userTable').querySelector('tbody');
    const editUserPopup = document.getElementById('editUserPopup');
    const editCloseButton = document.getElementById('editCloseButton');
    const editUserForm = document.getElementById('editUserForm');

    let users = JSON.parse(localStorage.getItem('users')) || [
        { username: 'admin', password: 'admin', role: 'admin', company: 'Admin' },
        { username: 'test', password: 'test', role: 'user', company: 'Test Company' }
    ];

    function renderUsers() {
        userTable.innerHTML = '';
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>${user.company}</td>
                <td>
                    <button onclick="editUser(${index})">Bearbeiten</button>
                    <button onclick="deleteUser(${index})">Löschen</button>
                </td>
            `;
            userTable.appendChild(row);
        });
    }

    window.editUser = (index) => {
        const user = users[index];
        document.getElementById('editUsername').value = user.username;
        document.getElementById('editRole').value = user.role;
        document.getElementById('editCompany').value = user.company;
        editUserPopup.classList.remove('hidden');
    };

    window.deleteUser = (index) => {
        if (confirm('Möchten Sie diesen Benutzer wirklich löschen?')) {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
        }
    };

    editCloseButton.addEventListener('click', () => {
        editUserPopup.classList.add('hidden');
    });

    newUserForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;
        const newRole = document.getElementById('newRole').value;
        const newCompany = document.getElementById('newCompany').value;

        users.push({ username: newUsername, password: newPassword, role: newRole, company: newCompany });
        localStorage.setItem('users', JSON.stringify(users));

        newUserForm.reset();
        userCreatedMessage.classList.remove('hidden');
        renderUsers();
    });

    editUserForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const editUsername = document.getElementById('editUsername').value;
        const editPassword = document.getElementById('editPassword').value;
        const editRole = document.getElementById('editRole').value;
        const editCompany = document.getElementById('editCompany').value;

        const userIndex = users.findIndex(user => user.username === editUsername);
        if (userIndex !== -1) {
            users[userIndex].role = editRole;
            users[userIndex].company = editCompany;
            if (editPassword) {
                users[userIndex].password = editPassword;
            }
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
            editUserPopup.classList.add('hidden');
        }
    });

    renderUsers();
});
