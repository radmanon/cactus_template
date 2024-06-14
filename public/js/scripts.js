document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const popupMenu = document.getElementById('popup-menu');
    const closeBtn = document.getElementById('close-btn');
    const mainContent = document.getElementById('main-content');
    const menuItems = document.querySelectorAll('.menu-item');
    const searchBar = document.getElementById('search-bar');
    const productsContainer = document.getElementById('products');
    const searchResultContainer = document.getElementById('search-result-container');

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

    // Function to create a card with "Read More" functionality
    function createCard(title, content) {
        const card = document.createElement('div');
        card.classList.add('search-result-card');
        const words = content.split(' ');
        if (words.length > 100) {
            const truncatedContent = words.slice(0, 100).join(' ');
            const remainingContent = words.slice(100).join(' ');
            card.innerHTML = `
        <h2>${title}</h2>
        <p>${truncatedContent}<span class="ellipsis">...</span><span class="more-text">${remainingContent}</span></p>
        <a href="#" class="read-more">Read More</a>
      `;
            card.querySelector('.read-more').addEventListener('click', (e) => {
                e.preventDefault();
                card.querySelector('.ellipsis').style.display = 'none';
                card.querySelector('.more-text').style.display = 'inline';
                card.querySelector('.read-more').style.display = 'none';
            });
        } else {
            card.innerHTML = `
        <h2>${title}</h2>
        <p>${content}</p>
      `;
        }
        return card;
    }

    // Add event listener to the search bar
    searchBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchBar.value;
            fetch(`/search?q=${query}`)
                .then(response => response.json())
                .then(data => {
                    const questionCard = createCard('Question', query);
                    const answerCard = createCard('Answer', data.result);
                    searchResultContainer.appendChild(questionCard);
                    searchResultContainer.appendChild(answerCard);
                })
                .catch(error => console.error('Error:', error));
        }
    });
});
