document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const popupMenu = document.getElementById('popup-menu');
    const closeBtn = document.getElementById('close-btn');
    const mainContent = document.getElementById('main-content');
    const menuItems = document.querySelectorAll('.menu-item');
    const searchBar = document.getElementById('search-bar');
    const productsContainer = document.getElementById('products');

    hamburgerMenu.addEventListener('click', () => {
        popupMenu.style.display = 'flex';
        mainContent.style.filter = 'blur(5px)';
    });

    closeBtn.addEventListener('click', () => {
        popupMenu.style.display = 'none';
        mainContent.style.filter = 'none';
    });

    // Add event listener to each menu item
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove 'selected' class from all menu items
            menuItems.forEach(i => i.classList.remove('selected'));
            // Add 'selected' class to the clicked menu item
            item.classList.add('selected');
        });
    });

    // Add event listener to the search bar
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBar.value;
            fetch(`/search?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    productsContainer.innerHTML = '';
                    data.results.forEach(result => {
                        const productCard = document.createElement('div');
                        productCard.classList.add('product-card');
                        productCard.innerHTML = `
                            <img src="${result.image}" alt="${result.name}">
                            <div class="product-info">
                                <h2>${result.name}</h2>
                                <p>${result.description}</p>
                            </div>
                            <button class="buy-btn">🛒</button>
                        `;
                        productsContainer.appendChild(productCard);
                    });
                })
                .catch(error => console.error('Error:', error));
        }
    });
});
