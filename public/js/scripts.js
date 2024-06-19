document.addEventListener('DOMContentLoaded', () => {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const popupMenu = document.getElementById('popup-menu');
    const closeBtn = document.getElementById('close-btn');
    const mainContent = document.getElementById('main-content');
    const menuItems = document.querySelectorAll('.menu-item');
    const searchBar = document.getElementById('search-bar');
    const questionContainer = document.getElementById('question-container');
    const nextButton = document.getElementById('next-button');

    let currentQuestionIndex = 0;
    let questions = [];

    hamburgerMenu.addEventListener('click', () => {
        popupMenu.style.display = 'flex';
        mainContent.style.filter = 'blur(5px)';
    });

    closeBtn.addEventListener('click', () => {
        popupMenu.style.display = 'none';
        mainContent.style.filter = 'none';
    });

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            menuItems.forEach(i => i.classList.remove('selected'));
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

    nextButton.addEventListener('click', showNextQuestion);

    async function fetchQuestions() {
        try {
            const response = await fetch('/api/questions');
            questions = await response.json();
            console.log("Fetched questions:", questions); // Debugging line
            if (questions.length > 0) {
                showNextQuestion();
            } else {
                questionContainer.innerHTML = '<p>No questions available.</p>';
                nextButton.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching questions:', error);
            questionContainer.innerHTML = '<p>Error fetching questions.</p>';
            nextButton.style.display = 'none';
        }
    }

    function showNextQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionContainer.innerHTML = `
                <div class="product-card">
                    <div class="product-info">
                        <h2>Question</h2>
                        <p>${question.question}</p>
                        <div class="option-container">
                            ${question.options.map(option => `<button class="option-button" data-next-id="${option.nextQuestionId}">${option.text}</button>`).join('')}
                        </div>
                    </div>
                </div>
            `;
            const optionButtons = document.querySelectorAll('.option-button');
            optionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const nextQuestionId = button.getAttribute('data-next-id');
                    currentQuestionIndex = questions.findIndex(q => q._id === nextQuestionId);
                    if (currentQuestionIndex === -1) {
                        questionContainer.innerHTML = `
                            <div class="product-card">
                                <div class="product-info">
                                    <h2>Thank you!</h2>
                                    <p>Thank you for answering all the questions!</p>
                                </div>
                            </div>
                        `;
                        nextButton.style.display = 'none';
                    } else {
                        showNextQuestion();
                    }
                });
            });
            nextButton.style.display = 'none';
        } else {
            questionContainer.innerHTML = `
                <div class="product-card">
                    <div class="product-info">
                        <h2>Thank you!</h2>
                        <p>Thank you for answering all the questions!</p>
                    </div>
                </div>
            `;
            nextButton.style.display = 'none';
        }
    }

    fetchQuestions();
});