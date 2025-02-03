document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    
    let questionsData = {};
    
    fetch('quiz3.json')
        .then(response => response.json())
        .then(data => {
            questionsData = data;
            initializeQuiz(questionsData);
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            appContainer.innerHTML = `
                <div class="error-screen">
                    <p>Failed to load quiz questions. Please check your internet connection or try again later.</p>
                    <button id="retry-fetch">Retry</button>
                </div>
            `;
            document.getElementById('retry-fetch').addEventListener('click', () => location.reload());
        });

    let selectedSubject = '';
    let selectedQuiz = [];
    let currentQuestionIndex = 0;
    let answers = [];

    function initializeQuiz(questionsData) {
        if (!questionsData || Object.keys(questionsData).length === 0) {
            appContainer.innerHTML = '<p>No quiz data found. Please try again later.</p>';
            return;
        }
        renderStartScreen(questionsData);
    }

    function renderStartScreen(data) {
        appContainer.innerHTML = `
            <div class="start-screen">
                <h1>Welcome to the Online Quiz</h1>
                <p>Please select a subject to start:</p>
                <select id="subject-select">
                    <option value="">Select a subject</option>
                    ${Object.keys(data).map(subject => `<option value="${subject}">${subject}</option>`).join('')}
                </select>
            </div>
        `;

        document.getElementById('subject-select').addEventListener('change', (event) => {
            selectedSubject = event.target.value;
            if (selectedSubject) {
                selectedQuiz = data[selectedSubject];
                currentQuestionIndex = 0;
                answers = Array(selectedQuiz.length).fill(null);
                renderQuizScreen();
            }
        });
    }

    function renderQuizScreen() {
        if (currentQuestionIndex >= selectedQuiz.length) {
            renderScoreScreen();
            return;
        }

        const currentQuestion = selectedQuiz[currentQuestionIndex];
        appContainer.innerHTML = `
            <div class="quiz-screen">
                <h2>Subject: ${selectedSubject}</h2>
                <div class="question-box">
                    <h3>${currentQuestion.question}</h3>
                    <div class="options">
                        ${currentQuestion.options.map(option => `
                            <button class="option-button ${answers[currentQuestionIndex] === option ? 'selected' : ''}" data-option="${option}">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div class="navigation">
                    ${currentQuestionIndex < selectedQuiz.length - 1 ? `
                        <button id="next-button">Next</button>
                    ` : `
                        <button id="submit-button">Submit</button>
                    `}
                    <button id="back-home">Back to Home</button>
                </div>
            </div>
        `;

        document.querySelectorAll('.option-button').forEach(button => {
            button.addEventListener('click', () => {
                const selectedOption = button.getAttribute('data-option');
                answers[currentQuestionIndex] = selectedOption;
                renderQuizScreen();
            });
        });

        document.getElementById('back-home').addEventListener('click', () => {
            renderStartScreen(questionsData);
        });

        const nextButton = document.getElementById('next-button');
        if (nextButton) {
            nextButton.addEventListener('click', () => {
                if (!answers[currentQuestionIndex]) {
                    alert('Please select an answer before proceeding!');
                } else {
                    currentQuestionIndex++;
                    renderQuizScreen();
                }
            });
        }

        const submitButton = document.getElementById('submit-button');
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                if (answers.some(answer => !answer)) {
                    alert('Please answer all questions before submitting!');
                } else {
                    renderScoreScreen();
                }
            });
        }
    }

    function renderScoreScreen() {
        const score = selectedQuiz.reduce((total, question, index) => {
            return question.correctAnswer === answers[index] ? total + 1 : total;
        }, 0);

        appContainer.innerHTML = `
            <div class="score-screen">
                <h1>Your Score</h1>
                <p>You scored ${score} out of ${selectedQuiz.length}</p>
                <button id="answer-key-button">View Answer Key</button>
                <button id="retry-button">Retry</button>
                <button id="back-home">Back to Home</button>
            </div>
        `;

        document.getElementById('retry-button').addEventListener('click', () => {
            renderStartScreen(questionsData);
        });

        document.getElementById('answer-key-button').addEventListener('click', () => {
            renderAnswerKey();
        });

        document.getElementById('back-home').addEventListener('click', () => {
            renderStartScreen(questionsData);
        });
    }

    function renderAnswerKey() {
        appContainer.innerHTML = `
            <div class="answer-key-screen">
                <h1>Answer Key</h1>
                <div class="answers-list">
                    ${selectedQuiz.map((question, index) => `
                        <div class="answer-item">
                            <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                            <p><strong>Correct Answer:</strong> ${question.correctAnswer}</p>
                            <p><strong>Your Answer:</strong> ${answers[index] || 'No answer selected'}</p>
                        </div>
                    `).join('')}
                </div>
                <button id="back-to-score">Back to Score</button>
                <button id="back-home">Back to Home</button>
            </div>
        `;

        document.getElementById('back-to-score').addEventListener('click', () => {
            renderScoreScreen();
        });

        document.getElementById('back-home').addEventListener('click', () => {
            renderStartScreen(questionsData);
        });
    }
});
