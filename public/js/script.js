const menuContainer = document.querySelector('.menu-box');
const buttonMain = document.querySelector('.btn-main');
const quizContainer = document.getElementById('quiz');
const questionCount = document.querySelector('#question-count');
const questionTotal = document.querySelector('#question-total');
const questionNumber = document.querySelector('.question-box .question-number');
const questionText = document.querySelector('.question-box .question-text');
const answerLabel = document.querySelectorAll('.wrapper-answer .answer-label')
const buttonNext = document.querySelector('.btn-next');
const buttonFinish = document.querySelector('.btn-finish');
const inputs = document.querySelectorAll(".wrapper-answer input[type='radio']");
const resultBox = document.querySelector('.result-box');
const scoreElement = document.querySelector('span#score');
const buttonAnswer = document.querySelector('.btn-answer');
const answerBox = document.querySelector('.box-answer');
const containerAnswer = document.querySelector('.box-answer .container-answer');


buttonMain.addEventListener('click', function () {
    menuContainer.style.display = 'none';
    quizContainer.style.display = 'flex';
});


let currentQuestion = 0;
let quizs = [];
let userAnswers = [];
let wrongAnswers = [];
let result = 0;

// reset inputs field
const reset = () => {
    inputs.forEach(input => {
        input.checked = false;
    })
};

// get answer value from user
const getAnswerFromInput = () => {
    let answer;
    
    inputs.forEach(input => {
        if (input.checked) {
            answer = input.value;
            userAnswers.push(answer);
        }
    });

    return answer;
};

// when user click correct answer button
buttonAnswer.addEventListener('click', function () {
    resultBox.style.display = 'none';
    answerBox.style.display = 'block';
    displayCorrectAnswer();
});

// when user click finish button
buttonFinish.addEventListener('click', function () {
    let answer = getAnswerFromInput();

    if (answer === quizs[currentQuestion]['answer'].toUpperCase()) {
        result++;
    }

    currentQuestion++;

    if (getAnswerFromInput()) {
        quizContainer.style.display = 'none';
        resultBox.style.display = 'block';
        scoreElement.innerText = `${result}/${quizs.length}`;
    }
});

// when user click next button
buttonNext.addEventListener('click', async function () {
    await loadDataQuiz('../src/quiz.json');

    let answer = getAnswerFromInput();

    if (answer) {
        if (answer === quizs[currentQuestion]['answer'].toUpperCase()) {
            result++;
        }

        currentQuestion++;

        if (currentQuestion < quizs.length) {
            loadQuiz();
        }
    }
});

// displaying correct answers
const displayCorrectAnswer = async () => {
    await loadDataQuiz('../src/quiz.json');

    quizs.forEach((quiz, i)=> {
        const wrapperAnswerEl = document.createElement('div');
        wrapperAnswerEl.classList.add('wrapper-answer');

        const questionEl = document.createElement('p');
        questionEl.textContent = `${i+1}.${quiz.question}`;
        wrapperAnswerEl.appendChild(questionEl);

        const userAnswerEl = document.createElement('p');
        userAnswerEl.textContent = `Jawaban kamu: ${userAnswers[i].toUpperCase()}`;
        userAnswerEl.style.color = 'black';
        if (userAnswers[i] !== quiz['answer'].toUpperCase()) {
            userAnswerEl.style.color = 'red';
        }
        wrapperAnswerEl.appendChild(userAnswerEl);

        const correctAnswerEl = document.createElement('p');
        correctAnswerEl.textContent = `Jawaban benar: ${quiz.answer.toUpperCase()}`;
        correctAnswerEl.style.color = 'green';
        wrapperAnswerEl.appendChild(correctAnswerEl);
    
        // insert wrapperAnswerEl into containerAnswer
        containerAnswer.appendChild(wrapperAnswerEl);
    });
};

// load data quiz from json
const loadDataQuiz = async (url) => {
    try {c
        const responseQuiz = await fetch(url);
        if (!responseQuiz.ok) {
            throw new Error('Terdapat Kesalahan: ' + responseQuiz.statusText);
        }
    
        const data = await responseQuiz.json();
        quizs = data;

    } catch (err) {
        console.error('Gagal mendapatkan data:', err);
        throw err;
    }
};

// load ui quiz
const loadQuiz = async () => {
    try {
        await loadDataQuiz('../src/quiz.json');
        questionCount.innerText = `${currentQuestion+1}`;
        questionTotal.innerText = `${quizs.length}`;
        questionNumber.innerText = `${currentQuestion+1}.`;
        questionText.innerText = `${quizs[currentQuestion]['question']}`;
        answerLabel[0].innerText = `${quizs[currentQuestion]['a']}`;
        answerLabel[1].innerText = `${quizs[currentQuestion]['b']}`;
        answerLabel[2].innerText = `${quizs[currentQuestion]['c']}`;
        answerLabel[3].innerText = `${quizs[currentQuestion]['d']}`;

        reset();

        if (currentQuestion === quizs.length-1) {
            buttonNext.style.display = 'none';
            buttonFinish.style.display = 'block';
        }

    } catch (err) {
        console.error(err);
    }
    
};

loadQuiz();