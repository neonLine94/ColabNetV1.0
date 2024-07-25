document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    if (user.role !== 'admin') {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => el.classList.add('hidden'));
    } else {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => el.classList.remove('hidden'));
    }
    
    // Willkommen $User im Dashboard
    document.getElementById('username').textContent = user.firstName + " " + user.lastName;


    // Unbearbeitete Anfragen

    document.addEventListener('DOMContentLoaded', () => {
        // ... Ihr bestehender Code ...

        function updateUnbearbeiteteAnfragenCount() {
            const count = localStorage.getItem('unbearbeiteteAnfragenCount') || 0;
            document.getElementById('unbearbeiteteAnfragenCount').textContent = count;
        }

        // Rufen Sie die Funktion auf, um die Anzahl anzuzeigen
        updateUnbearbeiteteAnfragenCount();
    });


    });
