let currentLesson = null;
let characters = [];
let currentCard = 0;
let revealStep = 0;

let currentWordLesson = null;
let words = [];
let currentWordCard = 0;
let wordRevealStep = 0;

const homeScreen = document.getElementById("homeScreen");
const lessonScreen = document.getElementById("lessonScreen");
const wordLessonScreen = document.getElementById("wordLessonScreen");

const lessonList = document.getElementById("lessonList");
const wordLessonList = document.getElementById("wordLessonList");

const lessonTitle = document.getElementById("lessonTitle");
const characterElement = document.getElementById("character");
const pinyinElement = document.getElementById("pinyin");
const meaningElement = document.getElementById("meaning");
const revealButton = document.getElementById("revealButton");
const nextButton = document.getElementById("nextButton");
const cardNumber = document.getElementById("cardNumber");
const cardTotal = document.getElementById("cardTotal");
const backButton = document.getElementById("backButton");

const wordLessonTitle = document.getElementById("wordLessonTitle");
const wordElement = document.getElementById("word");
const wordPinyinElement = document.getElementById("wordPinyin");
const wordMeaningElement = document.getElementById("wordMeaning");
const wordRevealButton = document.getElementById("wordRevealButton");
const wordNextButton = document.getElementById("wordNextButton");
const wordCardNumber = document.getElementById("wordCardNumber");
const wordCardTotal = document.getElementById("wordCardTotal");
const wordBackButton = document.getElementById("wordBackButton");

function displayLessons() {
    lessonList.innerHTML = "";

    lessons.forEach(function (lesson) {
        const lessonButton = document.createElement("button");
        lessonButton.classList.add("lessonButton");
        lessonButton.innerHTML = `
            <strong>Lesson ${lesson.lessonNumber}</strong><br>
            ${lesson.title}<br>
            <small>${lesson.characters.length} characters</small>
        `;
        lessonButton.addEventListener("click", function () {
            startLesson(lesson);
        });
        lessonList.appendChild(lessonButton);
    });
}

function displayWordLessons() {
    wordLessonList.innerHTML = "";

    wordLessons.forEach(function (lesson) {
        const button = document.createElement("button");
        button.classList.add("lessonButton");
        button.innerHTML = `
            <strong>Word Building ${lesson.lessonNumber}</strong><br>
            ${lesson.title}<br>
            <small>${lesson.words.length} words</small>
        `;
        button.addEventListener("click", function () {
            startWordLesson(lesson);
        });
        wordLessonList.appendChild(button);
    });
}

function startLesson(lesson) {
    currentLesson = lesson;
    characters = lesson.characters;
    currentCard = 0;
    lessonTitle.textContent = lesson.title;
    cardTotal.textContent = characters.length;
    homeScreen.classList.add("hidden");
    wordLessonScreen.classList.add("hidden");
    lessonScreen.classList.remove("hidden");
    showCard();
}

function showCard() {
    const card = characters[currentCard];
    characterElement.textContent = card.symbol;
    pinyinElement.textContent = card.pinyin;
    meaningElement.textContent = card.meaning;

    characterElement.classList.add("hidden");
    pinyinElement.classList.add("hidden");
    meaningElement.classList.add("hidden");
    revealButton.classList.remove("hidden");
    nextButton.classList.add("hidden");

    revealStep = 0;
    cardNumber.textContent = currentCard + 1;
}

revealButton.addEventListener("click", function () {
    if (revealStep === 0) {
        characterElement.classList.remove("hidden");
        revealStep = 1;
    } else if (revealStep === 1) {
        pinyinElement.classList.remove("hidden");
        meaningElement.classList.remove("hidden");
        revealButton.classList.add("hidden");
        nextButton.classList.remove("hidden");
        revealStep = 2;
    }
});

nextButton.addEventListener("click", function () {
    currentCard = (currentCard + 1) % characters.length;
    showCard();
});

backButton.addEventListener("click", function () {
    lessonScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});

function startWordLesson(lesson) {
    currentWordLesson = lesson;
    words = lesson.words;
    currentWordCard = 0;
    wordLessonTitle.textContent = lesson.title;
    wordCardTotal.textContent = words.length;
    homeScreen.classList.add("hidden");
    lessonScreen.classList.add("hidden");
    wordLessonScreen.classList.remove("hidden");
    showWordCard();
}

function showWordCard() {
    const currentWord = words[currentWordCard];
    wordElement.textContent = currentWord.word;
    wordPinyinElement.textContent = currentWord.pinyin;
    wordMeaningElement.textContent = currentWord.meaning;

    wordElement.classList.add("hidden");
    wordPinyinElement.classList.add("hidden");
    wordMeaningElement.classList.add("hidden");
    wordRevealButton.classList.remove("hidden");
    wordNextButton.classList.add("hidden");

    wordRevealStep = 0;
    wordCardNumber.textContent = currentWordCard + 1;
}

wordRevealButton.addEventListener("click", function () {
    if (wordRevealStep === 0) {
        wordElement.classList.remove("hidden");
        wordRevealStep = 1;
    } else if (wordRevealStep === 1) {
        wordPinyinElement.classList.remove("hidden");
        wordMeaningElement.classList.remove("hidden");
        wordRevealButton.classList.add("hidden");
        wordNextButton.classList.remove("hidden");
        wordRevealStep = 2;
    }
});

wordNextButton.addEventListener("click", function () {
    currentWordCard = (currentWordCard + 1) % words.length;
    showWordCard();
});

wordBackButton.addEventListener("click", function () {
    wordLessonScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});

displayLessons();
displayWordLessons();
