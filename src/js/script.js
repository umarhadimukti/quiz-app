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

// initialize supabase
const { createClient } = supabase;
const SUPABASE_URL = 'https://cfuvqhrofsadhsjtwspa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmdXZxaHJvZnNhZGhzanR3c3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNDM0OTAsImV4cCI6MjAzNDgxOTQ5MH0.zx040IRAVKxbG0OZ4oiyf1xaVygsMpTwFLz6gnM95Mc';

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// initialize quiz variable
let currentQuestion = 0;
let quizs = [];
let userAnswers = [];
let wrongAnswers = [];
let result = 0;

const getDataFromSupa = async () => {
    const { data:dataQuiz, error, status } = await supabaseClient.from('quizs').select('*');
    
    if (error || status !== 200) {
        console.error({ status, error, message: 'terjadi kesalahan.' });
    }

    quizs = dataQuiz;

    shuffleQuiz(quizs);
};

// when buttonMain onclick
buttonMain.addEventListener('click', function () {
    menuContainer.style.display = 'none';
    quizContainer.style.display = 'flex';
});

const shuffleQuiz = (quizs) => {
    for (let i = quizs.length-1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [quizs[i], quizs[j] = quizs[j], quizs[i]];
    }
}

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

    if (answer === quizs[currentQuestion]['correct'].toUpperCase()) {
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
    await getDataFromSupa();

    let answer = getAnswerFromInput();

    if (answer) {
        if (answer === quizs[currentQuestion]['correct'].toUpperCase()) {
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
    await getDataFromSupa();

    quizs.forEach((quiz, i)=> {
        const wrapperAnswerEl = document.createElement('div');
        wrapperAnswerEl.classList.add('wrapper-answer');

        const questionEl = document.createElement('p');
        questionEl.textContent = `${i+1}.${quiz.question}`;
        wrapperAnswerEl.appendChild(questionEl);

        const userAnswerEl = document.createElement('p');
        userAnswerEl.textContent = `Jawaban kamu: ${userAnswers[i].toUpperCase()}`;
        userAnswerEl.style.color = 'black';
        if (userAnswers[i] !== quiz['correct'].toUpperCase()) {
            userAnswerEl.style.color = 'red';
        }
        wrapperAnswerEl.appendChild(userAnswerEl);

        const correctAnswerEl = document.createElement('p');
        correctAnswerEl.textContent = `Jawaban benar: ${quiz.correct.toUpperCase()}`;
        correctAnswerEl.style.color = 'green';
        wrapperAnswerEl.appendChild(correctAnswerEl);
    
        // insert wrapperAnswerEl into containerAnswer
        containerAnswer.appendChild(wrapperAnswerEl);
    });
};

// load ui quiz
const loadQuiz = async () => {
    try {
        // await loadDataQuiz('../src/quiz.json');
        await getDataFromSupa();
        questionCount.innerText = `${currentQuestion+1}`;
        questionTotal.innerText = `${quizs.length}`;
        questionNumber.innerText = `${currentQuestion+1}.`;
        questionText.innerText = `${quizs[currentQuestion]['question']}`;
        answerLabel[0].innerText = `${quizs[currentQuestion]['answerA']}`;
        answerLabel[1].innerText = `${quizs[currentQuestion]['answerB']}`;
        answerLabel[2].innerText = `${quizs[currentQuestion]['answerC']}`;
        answerLabel[3].innerText = `${quizs[currentQuestion]['answerD']}`;

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