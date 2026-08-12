let currentLesson = null;
let characters = [];
let currentCard = 0;
let revealStep = 0;

let currentWordLesson = null;
let words = [];
let currentWordCard = 0;
let wordRevealStep = 0;

const STORAGE_KEY = "mandarinLearningProgressV2";
let progressState = loadProgress();

const homeScreen = document.getElementById("homeScreen");
const lessonScreen = document.getElementById("lessonScreen");
const wordLessonScreen = document.getElementById("wordLessonScreen");

const lessonList = document.getElementById("lessonList");
const wordLessonList = document.getElementById("wordLessonList");

const learnedCharacters = document.getElementById("learnedCharacters");
const learnedWords = document.getElementById("learnedWords");
const courseProgressBar = document.getElementById("courseProgressBar");

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

function loadProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved) {
            return {
                completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : [],
                completedWordLessons: Array.isArray(saved.completedWordLessons) ? saved.completedWordLessons : []
            };
        }
    } catch (error) {
        console.warn("Could not load saved progress.", error);
    }

    return { completedLessons: [], completedWordLessons: [] };
}

function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
}

function isLessonComplete(number) {
    return progressState.completedLessons.includes(number);
}

function isLessonUnlocked(number) {
    return number === 1 || isLessonComplete(number - 1) || isLessonComplete(number);
}

function isWordLessonComplete(number) {
    return progressState.completedWordLessons.includes(number);
}

function isWordLessonUnlocked(lesson) {
    return isLessonComplete(lesson.requiresLesson) || isWordLessonComplete(lesson.lessonNumber);
}

function updateProgressDashboard() {
    const completedCharacterCount = lessons
        .filter(lesson => isLessonComplete(lesson.lessonNumber))
        .reduce((total, lesson) => total + lesson.characters.length, 0);

    const completedWordCount = wordLessons
        .filter(lesson => isWordLessonComplete(lesson.lessonNumber))
        .reduce((total, lesson) => total + lesson.words.length, 0);

    learnedCharacters.textContent = completedCharacterCount;
    learnedWords.textContent = completedWordCount;

    const totalCharacters = lessons.reduce((total, lesson) => total + lesson.characters.length, 0);
    const percent = totalCharacters ? (completedCharacterCount / totalCharacters) * 100 : 0;
    courseProgressBar.style.width = `${percent}%`;
}

function displayLessons() {
    lessonList.innerHTML = "";

    lessons.forEach(function (lesson) {
        const unlocked = isLessonUnlocked(lesson.lessonNumber);
        const completed = isLessonComplete(lesson.lessonNumber);
        const lessonButton = document.createElement("button");

        lessonButton.className = "lessonButton";
        if (!unlocked) lessonButton.classList.add("locked");
        if (completed) lessonButton.classList.add("completed");
        lessonButton.disabled = !unlocked;

        const status = completed ? "✓ Completed" : unlocked ? `${lesson.characters.length} characters` : "🔒 Complete the previous lesson";

        lessonButton.innerHTML = `
            <span class="lessonTopline">
                <strong>Lesson ${lesson.lessonNumber}</strong>
                <span>${completed ? "✓" : unlocked ? "→" : "🔒"}</span>
            </span>
            <span class="lessonTitleText">${lesson.title}</span>
            <small>${status}</small>
        `;

        if (unlocked) {
            lessonButton.addEventListener("click", function () {
                startLesson(lesson);
            });
        }

        lessonList.appendChild(lessonButton);
    });
}

function displayWordLessons() {
    wordLessonList.innerHTML = "";

    wordLessons.forEach(function (lesson) {
        const unlocked = isWordLessonUnlocked(lesson);
        const completed = isWordLessonComplete(lesson.lessonNumber);
        const button = document.createElement("button");

        button.className = "lessonButton wordLessonButton";
        if (!unlocked) button.classList.add("locked");
        if (completed) button.classList.add("completed");
        button.disabled = !unlocked;

        const status = completed ? "✓ Completed" : unlocked ? `${lesson.words.length} words` : `🔒 Finish Character Lesson ${lesson.requiresLesson}`;

        button.innerHTML = `
            <span class="lessonTopline">
                <strong>Word Building ${lesson.lessonNumber}</strong>
                <span>${completed ? "✓" : unlocked ? "→" : "🔒"}</span>
            </span>
            <span class="lessonTitleText">${lesson.title}</span>
            <small>${status}</small>
        `;

        if (unlocked) {
            button.addEventListener("click", function () {
                startWordLesson(lesson);
            });
        }

        wordLessonList.appendChild(button);
    });
}

function refreshHome() {
    updateProgressDashboard();
    displayLessons();
    displayWordLessons();
}

function showHome() {
    lessonScreen.classList.add("hidden");
    wordLessonScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    refreshHome();
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function startLesson(lesson) {
    currentLesson = lesson;
    characters = lesson.characters;
    currentCard = 0;
    lessonTitle.textContent = `Lesson ${lesson.lessonNumber}: ${lesson.title}`;
    cardTotal.textContent = characters.length;
    homeScreen.classList.add("hidden");
    wordLessonScreen.classList.add("hidden");
    lessonScreen.classList.remove("hidden");
    showCard();
    window.scrollTo(0, 0);
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
    nextButton.textContent = currentCard === characters.length - 1 ? "Finish Lesson" : "Next";
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
    if (currentCard === characters.length - 1) {
        if (!isLessonComplete(currentLesson.lessonNumber)) {
            progressState.completedLessons.push(currentLesson.lessonNumber);
            saveProgress();
        }
        showHome();
        return;
    }

    currentCard++;
    showCard();
});

backButton.addEventListener("click", showHome);

function startWordLesson(lesson) {
    currentWordLesson = lesson;
    words = lesson.words;
    currentWordCard = 0;
    wordLessonTitle.textContent = `Word Building ${lesson.lessonNumber}: ${lesson.title}`;
    wordCardTotal.textContent = words.length;
    homeScreen.classList.add("hidden");
    lessonScreen.classList.add("hidden");
    wordLessonScreen.classList.remove("hidden");
    showWordCard();
    window.scrollTo(0, 0);
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
    wordNextButton.textContent = currentWordCard === words.length - 1 ? "Finish Words" : "Next";
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
    if (currentWordCard === words.length - 1) {
        if (!isWordLessonComplete(currentWordLesson.lessonNumber)) {
            progressState.completedWordLessons.push(currentWordLesson.lessonNumber);
            saveProgress();
        }
        showHome();
        return;
    }

    currentWordCard++;
    showWordCard();
});

wordBackButton.addEventListener("click", showHome);

refreshHome();
