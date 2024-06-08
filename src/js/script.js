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

let currentQuestion = 0;
let quizs = [];
let result = 0;

// load data quiz from json
const loadDataQuiz = async (url) => {
    try {
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
}

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
    
}

const reset = () => {
    inputs.forEach(input => {
        input.checked = false;
    })
}

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

const getAnswerFromInput = () => {
    let answer;
    
    inputs.forEach(input => {
        if (input.checked) {
            answer = input.value;
        }
    });

    return answer;
}

loadQuiz();