document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const popupMenu = document.getElementById('popup-menu');
    const closeBtn = document.getElementById('close-btn');
    const mainContent = document.getElementById('main-content');

    hamburgerMenu.addEventListener('click', () => {
        popupMenu.style.display = 'flex';
        mainContent.style.filter = 'blur(5px)';
    });

    closeBtn.addEventListener('click', () => {
        popupMenu.style.display = 'none';
        mainContent.style.filter = 'none';
    });
});
