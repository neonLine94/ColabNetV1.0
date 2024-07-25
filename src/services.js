document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
    }

    const addServiceButton = document.getElementById('addServiceButton');
    const servicePopup = document.getElementById('servicePopup');
    const detailPopup = document.getElementById('detailPopup');
    const inquirePopup = document.getElementById('inquirePopup');
    const closeButton = document.querySelector('.close-button');
    const detailCloseButton = document.getElementById('detailCloseButton');
    const inquireCloseButton = document.getElementById('inquireCloseButton');
    const newServiceForm = document.getElementById('newServiceForm');
    const inquireForm = document.getElementById('inquireForm');
    const serviceList = document.getElementById('serviceList');
    const inquireButton = document.getElementById('inquireButton');
    const searchBar = document.getElementById('searchBar');
    const categoryFilter = document.getElementById('categoryFilter');

    let currentServiceCreator = '';
    let currentServiceName = '';

    document.getElementById('serviceCreator').value = user.company;

    // Laden Sie die gespeicherten Dienstleistungen aus localStorage
    let services = JSON.parse(localStorage.getItem('services')) || [];

    function renderServices() {
        serviceList.innerHTML = ''; // Leeren Sie die Dienstleistungsliste vor dem Neurendern

        services.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.classList.add('serviceCard');
            serviceCard.dataset.name = service.name;
            serviceCard.dataset.description = service.description;
            serviceCard.dataset.price = `€${service.price}`;
            serviceCard.dataset.category = service.category;
            serviceCard.dataset.creator = service.creator;
            serviceCard.dataset.image = service.image;

            const serviceImageElement = document.createElement('img');
            serviceImageElement.src = service.image || 'default-image.png'; // Falls kein Bild vorhanden ist, ein Standardbild anzeigen
            serviceCard.appendChild(serviceImageElement);

            const serviceTitle = document.createElement('h3');
            serviceTitle.textContent = service.name;
            serviceCard.appendChild(serviceTitle);

            const serviceDesc = document.createElement('p');
            serviceDesc.textContent = service.description;
            serviceCard.appendChild(serviceDesc);

            const servicePriceElement = document.createElement('p');
            servicePriceElement.classList.add('price');
            servicePriceElement.textContent = `€${service.price}`;
            serviceCard.appendChild(servicePriceElement);

            const serviceCreatorElement = document.createElement('p');
            serviceCreatorElement.textContent = `Ersteller: ${service.creator}`;
            serviceCard.appendChild(serviceCreatorElement);

            serviceCard.addEventListener('click', () => {
                document.getElementById('detailServiceName').textContent = serviceCard.dataset.name;
                document.getElementById('detailServiceDescription').textContent = serviceCard.dataset.description;
                document.getElementById('detailServicePrice').textContent = serviceCard.dataset.price;
                document.getElementById('detailServiceImage').src = serviceCard.dataset.image;
                document.getElementById('detailServiceCreator').textContent = `Ersteller: ${serviceCard.dataset.creator}`;
                currentServiceCreator = serviceCard.dataset.creator;
                currentServiceName = serviceCard.dataset.name;
                detailPopup.classList.remove('hidden');
            });

            serviceList.appendChild(serviceCard);
        });
    }

    addServiceButton.addEventListener('click', () => {
        servicePopup.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        servicePopup.classList.add('hidden');
    });

    detailCloseButton.addEventListener('click', () => {
        detailPopup.classList.add('hidden');
    });

    inquireCloseButton.addEventListener('click', () => {
        inquirePopup.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target === servicePopup) {
            servicePopup.classList.add('hidden');
        }
        if (event.target === detailPopup) {
            detailPopup.classList.add('hidden');
        }
        if (event.target === inquirePopup) {
            inquirePopup.classList.add('hidden');
        }
    });

    newServiceForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const serviceName = document.getElementById('serviceName').value;
        const serviceDescription = document.getElementById('serviceDescription').value;
        const servicePrice = document.getElementById('servicePrice').value;
        const serviceCategory = document.getElementById('serviceCategory').value;
        const serviceImage = document.getElementById('serviceImage').files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const newService = {
                name: serviceName,
                description: serviceDescription,
                price: servicePrice,
                category: serviceCategory,
                image: e.target.result,
                creator: user.company,
                type: 'Dienstleistung'
            };

            services.push(newService);
            localStorage.setItem('services', JSON.stringify(services));

            renderServices();

            servicePopup.classList.add('hidden');
        };

        reader.readAsDataURL(serviceImage);
    });

    inquireButton.addEventListener('click', () => {
        detailPopup.classList.add('hidden');
        inquirePopup.classList.remove('hidden');
    });

    inquireForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const inquireMessage = document.getElementById('inquireMessage').value;

        const inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
        inquiries.push({
            timestamp: new Date().toLocaleString(),
            requester: user.username,
            type: 'Dienstleistung',
            name: currentServiceName,
            company: currentServiceCreator,
            message: inquireMessage,
            status: 'Unbearbeitet'
        });
        localStorage.setItem('inquiries', JSON.stringify(inquiries));

        alert(`Nachricht an ${currentServiceCreator} gesendet: ${inquireMessage}`);
        inquireForm.reset();
        inquirePopup.classList.add('hidden');
    });

    function filterServices() {
        const searchText = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const serviceCards = document.querySelectorAll('.serviceCard');

        serviceCards.forEach(card => {
            const serviceName = card.dataset.name.toLowerCase();
            const serviceCategory = card.dataset.category;
            if (
                (serviceName.includes(searchText) || searchText === '') && 
                (serviceCategory === selectedCategory || selectedCategory === 'all')
            ) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchBar.addEventListener('input', filterServices);
    categoryFilter.addEventListener('change', filterServices);

    // Render services on page load
    renderServices();
});
