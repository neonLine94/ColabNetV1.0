document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
    }

    const addProductButton = document.getElementById('addProductButton');
    const productPopup = document.getElementById('productPopup');
    const detailPopup = document.getElementById('detailPopup');
    const inquirePopup = document.getElementById('inquirePopup');
    const closeButton = document.querySelector('.close-button');
    const detailCloseButton = document.getElementById('detailCloseButton');
    const inquireCloseButton = document.getElementById('inquireCloseButton');
    const newProductForm = document.getElementById('newProductForm');
    const inquireForm = document.getElementById('inquireForm');
    const productList = document.getElementById('productList');
    const inquireButton = document.getElementById('inquireButton');
    const searchBar = document.getElementById('searchBar');
    const categoryFilter = document.getElementById('categoryFilter');

    let currentProductCreator = '';
    let currentProductName = '';

    document.getElementById('productCreator').value = user.company;

    // Laden Sie die gespeicherten Produkte aus localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];

    function renderProducts() {
        productList.innerHTML = ''; // Leeren Sie die Produktliste vor dem Neurendern

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('productCard');
            productCard.dataset.name = product.name;
            productCard.dataset.description = product.description;
            productCard.dataset.price = `€${product.price}`;
            productCard.dataset.category = product.category;
            productCard.dataset.creator = product.creator;
            productCard.dataset.image = product.image;

            const productImageElement = document.createElement('img');
            productImageElement.src = product.image || 'default-image.png'; // Falls kein Bild vorhanden ist, ein Standardbild anzeigen
            productCard.appendChild(productImageElement);

            const productTitle = document.createElement('h3');
            productTitle.textContent = product.name;
            productCard.appendChild(productTitle);

            const productDesc = document.createElement('p');
            productDesc.textContent = product.description;
            productCard.appendChild(productDesc);

            const productPriceElement = document.createElement('p');
            productPriceElement.classList.add('price');
            productPriceElement.textContent = `€${product.price}`;
            productCard.appendChild(productPriceElement);

            const productCreatorElement = document.createElement('p');
            productCreatorElement.textContent = `Ersteller: ${product.creator}`;
            productCard.appendChild(productCreatorElement);

            productCard.addEventListener('click', () => {
                document.getElementById('detailProductName').textContent = productCard.dataset.name;
                document.getElementById('detailProductDescription').textContent = productCard.dataset.description;
                document.getElementById('detailProductPrice').textContent = productCard.dataset.price;
                document.getElementById('detailProductImage').src = productCard.dataset.image;
                document.getElementById('detailProductCreator').textContent = `Ersteller: ${productCard.dataset.creator}`;
                currentProductCreator = productCard.dataset.creator;
                currentProductName = productCard.dataset.name;
                detailPopup.classList.remove('hidden');
            });

            productList.appendChild(productCard);
        });
    }

    addProductButton.addEventListener('click', () => {
        productPopup.classList.remove('hidden');
    });

    closeButton.addEventListener('click', () => {
        productPopup.classList.add('hidden');
    });

    detailCloseButton.addEventListener('click', () => {
        detailPopup.classList.add('hidden');
    });

    inquireCloseButton.addEventListener('click', () => {
        inquirePopup.classList.add('hidden');
    });

    window.addEventListener('click', (event) => {
        if (event.target === productPopup) {
            productPopup.classList.add('hidden');
        }
        if (event.target === detailPopup) {
            detailPopup.classList.add('hidden');
        }
        if (event.target === inquirePopup) {
            inquirePopup.classList.add('hidden');
        }
    });

    newProductForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const productPrice = document.getElementById('productPrice').value;
        const productCategory = document.getElementById('productCategory').value;
        const productImage = document.getElementById('productImage').files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const newProduct = {
                name: productName,
                description: productDescription,
                price: productPrice,
                category: productCategory,
                image: e.target.result,
                creator: user.company,
                type: 'Produkt'
            };

            products.push(newProduct);
            localStorage.setItem('products', JSON.stringify(products));

            renderProducts();

            productPopup.classList.add('hidden');
        };

        reader.readAsDataURL(productImage);
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
            type: 'Produkt',
            name: currentProductName,
            company: currentProductCreator,
            message: inquireMessage,
            status: 'Unbearbeitet'
        });
        localStorage.setItem('inquiries', JSON.stringify(inquiries));

        alert(`Nachricht an ${currentProductCreator} gesendet: ${inquireMessage}`);
        inquireForm.reset();
        inquirePopup.classList.add('hidden');
    });

    function filterProducts() {
        const searchText = searchBar.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const productCards = document.querySelectorAll('.productCard');

        productCards.forEach(card => {
            const productName = card.dataset.name.toLowerCase();
            const productCategory = card.dataset.category;
            if (
                (productName.includes(searchText) || searchText === '') && 
                (productCategory === selectedCategory || selectedCategory === 'all')
            ) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    searchBar.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);

    // Render products on page load
    renderProducts();
});
