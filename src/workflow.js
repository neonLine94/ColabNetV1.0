document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    if (user.role !== 'admin') {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => el.classList.add('hidden'));
    }

    const incomingTable = document.getElementById('incomingTable').querySelector('tbody');
    const outgoingTable = document.getElementById('outgoingTable').querySelector('tbody');
    const deletedTable = document.getElementById('deletedTable').querySelector('tbody');
    const detailPopup = document.getElementById('detailPopup');
    const detailCloseButton = document.getElementById('detailCloseButton');
    const detailProduct = document.getElementById('detailProduct');
    const detailRequester = document.getElementById('detailRequester');
    const detailTimestamp = document.getElementById('detailTimestamp');
    const detailMessage = document.getElementById('detailMessage');
    const statusSelect = document.getElementById('statusSelect');
    const updateStatusButton = document.getElementById('updateStatusButton');

    let currentInquiryIndex = -1;

    if (!incomingTable || !outgoingTable || !deletedTable || !detailPopup || !detailCloseButton || !detailProduct || !detailRequester || !detailTimestamp || !detailMessage || !statusSelect || !updateStatusButton) {
        console.error('Eines oder mehrere DOM-Elemente wurden nicht gefunden. Bitte überprüfen Sie die HTML-Datei.');
        return;
    }

    const exampleInquiries = [
        {
            timestamp: new Date().toLocaleString(),
            requester: 'test',
            type: 'Produkt',
            name: 'Beispielprodukt 1',
            company: 'User Company',
            message: 'Bitte um mehr Informationen zu Beispielprodukt 1.',
            status: 'Unbearbeitet'
        },
        //{
            //    timestamp: new Date().toLocaleString(),
            //requester: 'user',
            //type: 'Dienstleistung',
            //name: 'Beispieldienstleistung 1',
            //company: 'User Company',
            //message: 'Bitte um mehr Informationen zu Beispieldienstleistung 1.',
            //status: 'In Bearbeitung'
        //},
            //{
            //timestamp: new Date().toLocaleString(),
            //requester: 'test',
            //type: 'Dienstleistung',
            //name: 'Beispieldienstleistung 1',
            //company: 'User Company',
            //message: 'Bitte um mehr Informationen zu Beispieldienstleistung 1.',
            //status: 'In Bearbeitung'
        //} 
    ];

    if (!localStorage.getItem('inquiries')) {
        localStorage.setItem('inquiries', JSON.stringify(exampleInquiries));
    }

    if (!localStorage.getItem('deletedInquiries')) {
        localStorage.setItem('deletedInquiries', JSON.stringify([]));
    }

    let inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
    let deletedInquiries = JSON.parse(localStorage.getItem('deletedInquiries')) || [];

    function renderInquiries() {
        incomingTable.innerHTML = '';
        outgoingTable.innerHTML = '';
        deletedTable.innerHTML = '';

        inquiries.forEach((inquiry, index) => {
            const row = document.createElement('tr');
            row.classList.add(inquiry.status.replace(" ", "-").toLowerCase());
            row.innerHTML = inquiry.requester === user.username ?
                `<td>${inquiry.timestamp}</td>
                 <td>${inquiry.company}</td>
                 <td>${inquiry.type}</td>
                 <td><a href="produkte.html">${inquiry.name}</a></td>
                 <td>${inquiry.status}</td>
                 <td><button class="delete-button" data-index="${index}">Löschen</button></td>` :
                `<td>${inquiry.timestamp}</td>
                 <td>${inquiry.requester}</td>
                 <td>${inquiry.type}</td>
                 <td><a href="produkte.html">${inquiry.name}</a></td>
                 <td>${inquiry.company}</td>
                 <td>${inquiry.status}</td>
                 <td><button class="delete-button" data-index="${index}">Löschen</button></td>`;

            row.querySelector('.delete-button').addEventListener('click', (event) => {
                event.stopPropagation();
                deleteInquiry(index);
            });

            row.addEventListener('click', () => showInquiryDetails(index));
            if (inquiry.company === user.company) {
                incomingTable.appendChild(row);
            }
            if (inquiry.requester === user.username) {
                outgoingTable.appendChild(row);
            }
        });

        deletedInquiries.forEach((inquiry, index) => {
            const row = document.createElement('tr');
            row.classList.add(inquiry.status.replace(" ", "-").toLowerCase());
            row.innerHTML = `
                <td>${inquiry.timestamp}</td>
                <td>${inquiry.requester}</td>
                <td>${inquiry.type}</td>
                <td><a href="produkte.html">${inquiry.name}</a></td>
                <td>${inquiry.company}</td>
                <td>${inquiry.status}</td>
                <td><button class="restore-button" data-index="${index}">Wiederherstellen</button></td>`;

            row.querySelector('.restore-button').addEventListener('click', (event) => {
                event.stopPropagation();
                restoreInquiry(index);
            });

            deletedTable.appendChild(row);
        });
    }

    function deleteInquiry(index) {
        const deletedInquiry = inquiries.splice(index, 1)[0];
        deletedInquiries.push(deletedInquiry);
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
        localStorage.setItem('deletedInquiries', JSON.stringify(deletedInquiries));
        renderInquiries();
        updateUnbearbeiteteAnfragenCount();  // Update count
    }

    function restoreInquiry(index) {
        const restoredInquiry = deletedInquiries.splice(index, 1)[0];
        inquiries.push(restoredInquiry);
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
        localStorage.setItem('deletedInquiries', JSON.stringify(deletedInquiries));
        renderInquiries();
        updateUnbearbeiteteAnfragenCount();  // Update count
    }

    function showInquiryDetails(index) {
        const inquiry = inquiries[index];
        currentInquiryIndex = index;
        detailProduct.innerHTML = `Produkt/Dienstleistung: <a href="produkte.html">${inquiry.name}</a>`;
        detailRequester.textContent = `Angefragt von: ${inquiry.requester}`;
        detailTimestamp.textContent = `Angefragt am: ${inquiry.timestamp}`;
        detailMessage.textContent = `Nachricht: ${inquiry.message}`;
        statusSelect.value = inquiry.status;
        detailPopup.classList.remove('hidden');
    }

    detailCloseButton.addEventListener('click', () => {
        detailPopup.classList.add('hidden');
    });

    updateStatusButton.addEventListener('click', () => {
        if (currentInquiryIndex !== -1) {
            inquiries[currentInquiryIndex].status = statusSelect.value;
            localStorage.setItem('inquiries', JSON.stringify(inquiries));
            renderInquiries();
            detailPopup.classList.add('hidden');
            updateUnbearbeiteteAnfragenCount();  // Update count
        }
    });

    renderInquiries();

    // Tab-Funktionalität
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const tab = button.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tab) {
                    content.classList.add('active');
                }
            });
        });
    });

    // $User im Dashboard
    document.getElementById('username').textContent = user.firstName + " " + user.lastName;


    // unbearbeitete Anfragen
    
    function updateUnbearbeiteteAnfragenCount() {
        const inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
        const unbeantworteteAnfragen = inquiries.filter(inquiry => inquiry.status === 'Unbearbeitet').length;
        localStorage.setItem('unbearbeiteteAnfragenCount', unbeantworteteAnfragen);
    }

    // Rufen Sie die Funktion auf, nachdem Anfragen gerendert wurden
    renderInquiries();
    updateUnbearbeiteteAnfragenCount();

    // Fügen Sie diese Funktion in alle relevanten Stellen ein, wo Anfragen hinzugefügt, aktualisiert oder gelöscht werden

});
