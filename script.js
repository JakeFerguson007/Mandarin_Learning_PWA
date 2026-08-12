let currentLesson = null;
let characters = [];
let currentCard = 0;
let revealStep = 0;

let currentWordLesson = null;
let words = [];
let currentWordCard = 0;
let wordRevealStep = 0;

let quizQuestions = [];
let quizIndex = 0;
let quizScoreValue = 0;
let quizAnswered = false;
let reviewItems = [];
let reviewIndex = 0;

const STORAGE_KEY = "mandarinLearningProgressV3";
let progressState = loadProgress();

const screens = ["homeScreen", "lessonScreen", "quizScreen", "quizResultScreen", "wordLessonScreen", "reviewScreen"]
    .map(id => document.getElementById(id));

const homeScreen = document.getElementById("homeScreen");
const lessonScreen = document.getElementById("lessonScreen");
const quizScreen = document.getElementById("quizScreen");
const quizResultScreen = document.getElementById("quizResultScreen");
const wordLessonScreen = document.getElementById("wordLessonScreen");
const reviewScreen = document.getElementById("reviewScreen");

const lessonList = document.getElementById("lessonList");
const wordLessonList = document.getElementById("wordLessonList");
const learnedCharacters = document.getElementById("learnedCharacters");
const learnedWords = document.getElementById("learnedWords");
const courseProgressBar = document.getElementById("courseProgressBar");
const reviewButton = document.getElementById("reviewButton");
const reviewCount = document.getElementById("reviewCount");

const lessonTitle = document.getElementById("lessonTitle");
const characterElement = document.getElementById("character");
const pinyinElement = document.getElementById("pinyin");
const meaningElement = document.getElementById("meaning");
const revealButton = document.getElementById("revealButton");
const nextButton = document.getElementById("nextButton");
const cardNumber = document.getElementById("cardNumber");
const cardTotal = document.getElementById("cardTotal");
const backButton = document.getElementById("backButton");
const characterRating = document.getElementById("characterRating");
const characterAgainButton = document.getElementById("characterAgainButton");
const characterKnowButton = document.getElementById("characterKnowButton");

const quizBackButton = document.getElementById("quizBackButton");
const quizTitle = document.getElementById("quizTitle");
const quizNumber = document.getElementById("quizNumber");
const quizTotal = document.getElementById("quizTotal");
const quizCharacter = document.getElementById("quizCharacter");
const quizOptions = document.getElementById("quizOptions");
const quizFeedback = document.getElementById("quizFeedback");
const quizNextButton = document.getElementById("quizNextButton");
const quizResultTitle = document.getElementById("quizResultTitle");
const quizScore = document.getElementById("quizScore");
const quizResultMessage = document.getElementById("quizResultMessage");
const quizResultButton = document.getElementById("quizResultButton");

const wordLessonTitle = document.getElementById("wordLessonTitle");
const wordElement = document.getElementById("word");
const wordPinyinElement = document.getElementById("wordPinyin");
const wordMeaningElement = document.getElementById("wordMeaning");
const wordBreakdown = document.getElementById("wordBreakdown");
const wordRevealButton = document.getElementById("wordRevealButton");
const wordNextButton = document.getElementById("wordNextButton");
const wordCardNumber = document.getElementById("wordCardNumber");
const wordCardTotal = document.getElementById("wordCardTotal");
const wordBackButton = document.getElementById("wordBackButton");
const wordRating = document.getElementById("wordRating");
const wordAgainButton = document.getElementById("wordAgainButton");
const wordKnowButton = document.getElementById("wordKnowButton");

const reviewBackButton = document.getElementById("reviewBackButton");
const reviewProgress = document.getElementById("reviewProgress");
const reviewSymbol = document.getElementById("reviewSymbol");
const reviewPinyin = document.getElementById("reviewPinyin");
const reviewMeaning = document.getElementById("reviewMeaning");
const reviewRevealButton = document.getElementById("reviewRevealButton");
const reviewRating = document.getElementById("reviewRating");
const reviewAgainButton = document.getElementById("reviewAgainButton");
const reviewKnowButton = document.getElementById("reviewKnowButton");

function loadProgress() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved) {
            return {
                completedLessons: Array.isArray(saved.completedLessons) ? saved.completedLessons : [],
                completedWordLessons: Array.isArray(saved.completedWordLessons) ? saved.completedWordLessons : [],
                weakCharacters: Array.isArray(saved.weakCharacters) ? saved.weakCharacters : [],
                weakWords: Array.isArray(saved.weakWords) ? saved.weakWords : []
            };
        }

        const old = JSON.parse(localStorage.getItem("mandarinLearningProgressV2"));
        if (old) {
            return {
                completedLessons: Array.isArray(old.completedLessons) ? old.completedLessons : [],
                completedWordLessons: Array.isArray(old.completedWordLessons) ? old.completedWordLessons : [],
                weakCharacters: [],
                weakWords: []
            };
        }
    } catch (error) {
        console.warn("Could not load saved progress.", error);
    }

    return { completedLessons: [], completedWordLessons: [], weakCharacters: [], weakWords: [] };
}

function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
}

function showScreen(screen) {
    screens.forEach(item => item.classList.add("hidden"));
    screen.classList.remove("hidden");
    window.scrollTo(0, 0);
}

function uniquePush(array, value) {
    if (!array.includes(value)) array.push(value);
}

function removeValue(array, value) {
    const index = array.indexOf(value);
    if (index !== -1) array.splice(index, 1);
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

function allCharacters() {
    return lessons.flatMap(lesson => lesson.characters);
}

function allWords() {
    return wordLessons.flatMap(lesson => lesson.words);
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
    courseProgressBar.style.width = `${totalCharacters ? (completedCharacterCount / totalCharacters) * 100 : 0}%`;

    const weakTotal = progressState.weakCharacters.length + progressState.weakWords.length;
    reviewCount.textContent = weakTotal ? `${weakTotal} item${weakTotal === 1 ? "" : "s"} to review` : "Nothing marked yet";
    reviewButton.disabled = weakTotal === 0;
    reviewButton.classList.toggle("locked", weakTotal === 0);
}

function displayLessons() {
    lessonList.innerHTML = "";

    lessons.forEach(lesson => {
        const unlocked = isLessonUnlocked(lesson.lessonNumber);
        const completed = isLessonComplete(lesson.lessonNumber);
        const button = document.createElement("button");
        button.className = "lessonButton";
        if (!unlocked) button.classList.add("locked");
        if (completed) button.classList.add("completed");
        button.disabled = !unlocked;

        const status = completed ? "✓ Quiz passed" : unlocked ? `${lesson.characters.length} characters + quiz` : "🔒 Complete the previous lesson";
        button.innerHTML = `
            <span class="lessonTopline"><strong>Lesson ${lesson.lessonNumber}</strong><span>${completed ? "✓" : unlocked ? "→" : "🔒"}</span></span>
            <span class="lessonTitleText">${lesson.title}</span>
            <small>${status}</small>
        `;

        if (unlocked) button.addEventListener("click", () => startLesson(lesson));
        lessonList.appendChild(button);
    });
}

function displayWordLessons() {
    wordLessonList.innerHTML = "";

    wordLessons.forEach(lesson => {
        const unlocked = isWordLessonUnlocked(lesson);
        const completed = isWordLessonComplete(lesson.lessonNumber);
        const button = document.createElement("button");
        button.className = "lessonButton wordLessonButton";
        if (!unlocked) button.classList.add("locked");
        if (completed) button.classList.add("completed");
        button.disabled = !unlocked;

        const status = completed ? "✓ Completed" : unlocked ? `${lesson.words.length} words` : `🔒 Finish Character Lesson ${lesson.requiresLesson}`;
        button.innerHTML = `
            <span class="lessonTopline"><strong>Word Building ${lesson.lessonNumber}</strong><span>${completed ? "✓" : unlocked ? "→" : "🔒"}</span></span>
            <span class="lessonTitleText">${lesson.title}</span>
            <small>${status}</small>
        `;

        if (unlocked) button.addEventListener("click", () => startWordLesson(lesson));
        wordLessonList.appendChild(button);
    });
}

function refreshHome() {
    updateProgressDashboard();
    displayLessons();
    displayWordLessons();
}

function showHome() {
    refreshHome();
    showScreen(homeScreen);
}

function startLesson(lesson) {
    currentLesson = lesson;
    characters = lesson.characters;
    currentCard = 0;
    lessonTitle.textContent = `Lesson ${lesson.lessonNumber}: ${lesson.title}`;
    cardTotal.textContent = characters.length;
    showScreen(lessonScreen);
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
    characterRating.classList.add("hidden");
    revealButton.classList.remove("hidden");
    nextButton.classList.add("hidden");

    revealStep = 0;
    cardNumber.textContent = currentCard + 1;
    nextButton.textContent = currentCard === characters.length - 1 ? "Take Quiz" : "Next";
}

revealButton.addEventListener("click", () => {
    if (revealStep === 0) {
        characterElement.classList.remove("hidden");
        revealStep = 1;
    } else if (revealStep === 1) {
        pinyinElement.classList.remove("hidden");
        meaningElement.classList.remove("hidden");
        characterRating.classList.remove("hidden");
        revealButton.classList.add("hidden");
        nextButton.classList.remove("hidden");
        revealStep = 2;
    }
});

function rateCurrentCharacter(known) {
    const symbol = characters[currentCard].symbol;
    if (known) removeValue(progressState.weakCharacters, symbol);
    else uniquePush(progressState.weakCharacters, symbol);
    saveProgress();
}

characterAgainButton.addEventListener("click", () => rateCurrentCharacter(false));
characterKnowButton.addEventListener("click", () => rateCurrentCharacter(true));

nextButton.addEventListener("click", () => {
    if (currentCard === characters.length - 1) {
        startQuiz();
        return;
    }
    currentCard++;
    showCard();
});

backButton.addEventListener("click", showHome);

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function startQuiz() {
    quizQuestions = shuffle(characters).map(card => ({
        card,
        options: shuffle([
            card.pinyin,
            ...shuffle(allCharacters().filter(other => other.symbol !== card.symbol).map(other => other.pinyin)).slice(0, 3)
        ])
    }));
    quizIndex = 0;
    quizScoreValue = 0;
    quizTitle.textContent = `Lesson ${currentLesson.lessonNumber}: ${currentLesson.title}`;
    quizTotal.textContent = quizQuestions.length;
    showScreen(quizScreen);
    showQuizQuestion();
}

function showQuizQuestion() {
    quizAnswered = false;
    const question = quizQuestions[quizIndex];
    quizNumber.textContent = quizIndex + 1;
    quizCharacter.textContent = question.card.symbol;
    quizOptions.innerHTML = "";
    quizFeedback.className = "quizFeedback hidden";
    quizNextButton.classList.add("hidden");
    quizNextButton.textContent = quizIndex === quizQuestions.length - 1 ? "See Results" : "Next Question";

    question.options.forEach(option => {
        const button = document.createElement("button");
        button.className = "quizOption";
        button.textContent = option;
        button.addEventListener("click", () => answerQuiz(button, option, question.card.pinyin));
        quizOptions.appendChild(button);
    });
}

function answerQuiz(button, selected, correct) {
    if (quizAnswered) return;
    quizAnswered = true;

    const correctAnswer = selected === correct;
    if (correctAnswer) quizScoreValue++;

    [...quizOptions.children].forEach(optionButton => {
        optionButton.disabled = true;
        if (optionButton.textContent === correct) optionButton.classList.add("correct");
    });

    if (!correctAnswer) button.classList.add("incorrect");
    quizFeedback.textContent = correctAnswer ? "Correct!" : `Correct answer: ${correct}`;
    quizFeedback.className = `quizFeedback ${correctAnswer ? "success" : "error"}`;
    quizNextButton.classList.remove("hidden");
}

quizNextButton.addEventListener("click", () => {
    if (quizIndex === quizQuestions.length - 1) {
        finishQuiz();
        return;
    }
    quizIndex++;
    showQuizQuestion();
});

quizBackButton.addEventListener("click", () => {
    showScreen(lessonScreen);
    showCard();
});

function finishQuiz() {
    const passed = quizScoreValue >= 4;
    quizScore.textContent = `${quizScoreValue} / ${quizQuestions.length}`;

    if (passed) {
        uniquePush(progressState.completedLessons, currentLesson.lessonNumber);
        saveProgress();
        quizResultTitle.textContent = "Lesson Complete";
        quizResultMessage.textContent = "You passed the quiz. The next lesson is now unlocked.";
        quizResultButton.textContent = "Continue";
        quizResultButton.onclick = showHome;
    } else {
        quizResultTitle.textContent = "Almost There";
        quizResultMessage.textContent = "You need 4 out of 5 to complete the lesson. Review the cards and try again.";
        quizResultButton.textContent = "Review Lesson";
        quizResultButton.onclick = () => startLesson(currentLesson);
    }

    showScreen(quizResultScreen);
}

function startWordLesson(lesson) {
    currentWordLesson = lesson;
    words = lesson.words;
    currentWordCard = 0;
    wordLessonTitle.textContent = `Word Building ${lesson.lessonNumber}: ${lesson.title}`;
    wordCardTotal.textContent = words.length;
    showScreen(wordLessonScreen);
    showWordCard();
}

function getWordBreakdown(word) {
    const characterMap = new Map(allCharacters().map(card => [card.symbol, card]));
    return [...word.word].map(symbol => characterMap.get(symbol)).filter(Boolean);
}

function showWordCard() {
    const currentWord = words[currentWordCard];
    wordElement.textContent = currentWord.word;
    wordPinyinElement.textContent = currentWord.pinyin;
    wordMeaningElement.textContent = currentWord.meaning;

    const breakdown = getWordBreakdown(currentWord);
    wordBreakdown.innerHTML = breakdown.map(part => `
        <div class="componentChip"><strong>${part.symbol}</strong><span>${part.pinyin}</span><small>${part.meaning}</small></div>
    `).join("");

    wordElement.classList.add("hidden");
    wordPinyinElement.classList.add("hidden");
    wordMeaningElement.classList.add("hidden");
    wordBreakdown.classList.add("hidden");
    wordRating.classList.add("hidden");
    wordRevealButton.classList.remove("hidden");
    wordNextButton.classList.add("hidden");

    wordRevealStep = 0;
    wordCardNumber.textContent = currentWordCard + 1;
    wordNextButton.textContent = currentWordCard === words.length - 1 ? "Finish Words" : "Next";
}

wordRevealButton.addEventListener("click", () => {
    if (wordRevealStep === 0) {
        wordElement.classList.remove("hidden");
        wordRevealStep = 1;
    } else if (wordRevealStep === 1) {
        wordPinyinElement.classList.remove("hidden");
        wordMeaningElement.classList.remove("hidden");
        wordBreakdown.classList.remove("hidden");
        wordRating.classList.remove("hidden");
        wordRevealButton.classList.add("hidden");
        wordNextButton.classList.remove("hidden");
        wordRevealStep = 2;
    }
});

function rateCurrentWord(known) {
    const word = words[currentWordCard].word;
    if (known) removeValue(progressState.weakWords, word);
    else uniquePush(progressState.weakWords, word);
    saveProgress();
}

wordAgainButton.addEventListener("click", () => rateCurrentWord(false));
wordKnowButton.addEventListener("click", () => rateCurrentWord(true));

wordNextButton.addEventListener("click", () => {
    if (currentWordCard === words.length - 1) {
        uniquePush(progressState.completedWordLessons, currentWordLesson.lessonNumber);
        saveProgress();
        showHome();
        return;
    }
    currentWordCard++;
    showWordCard();
});

wordBackButton.addEventListener("click", showHome);

function buildReviewItems() {
    const characterMap = new Map(allCharacters().map(card => [card.symbol, card]));
    const wordMap = new Map(allWords().map(word => [word.word, word]));

    const characterItems = progressState.weakCharacters
        .map(symbol => characterMap.get(symbol))
        .filter(Boolean)
        .map(card => ({ type: "character", key: card.symbol, symbol: card.symbol, pinyin: card.pinyin, meaning: card.meaning }));

    const wordItems = progressState.weakWords
        .map(word => wordMap.get(word))
        .filter(Boolean)
        .map(item => ({ type: "word", key: item.word, symbol: item.word, pinyin: item.pinyin, meaning: item.meaning }));

    return shuffle([...characterItems, ...wordItems]);
}

function startReview() {
    reviewItems = buildReviewItems();
    if (!reviewItems.length) {
        showHome();
        return;
    }
    reviewIndex = 0;
    showScreen(reviewScreen);
    showReviewItem();
}

function showReviewItem() {
    if (!reviewItems.length) {
        showHome();
        return;
    }

    if (reviewIndex >= reviewItems.length) reviewIndex = 0;
    const item = reviewItems[reviewIndex];
    reviewProgress.textContent = `${reviewIndex + 1} of ${reviewItems.length}`;
    reviewSymbol.textContent = item.symbol;
    reviewPinyin.textContent = item.pinyin;
    reviewMeaning.textContent = item.meaning;
    reviewPinyin.classList.add("hidden");
    reviewMeaning.classList.add("hidden");
    reviewRating.classList.add("hidden");
    reviewRevealButton.classList.remove("hidden");
}

reviewRevealButton.addEventListener("click", () => {
    reviewPinyin.classList.remove("hidden");
    reviewMeaning.classList.remove("hidden");
    reviewRating.classList.remove("hidden");
    reviewRevealButton.classList.add("hidden");
});

function rateReviewItem(known) {
    const item = reviewItems[reviewIndex];
    if (known) {
        if (item.type === "character") removeValue(progressState.weakCharacters, item.key);
        else removeValue(progressState.weakWords, item.key);
        reviewItems.splice(reviewIndex, 1);
    } else {
        reviewIndex++;
    }
    saveProgress();

    if (!reviewItems.length) {
        showHome();
        return;
    }

    if (reviewIndex >= reviewItems.length) reviewIndex = 0;
    showReviewItem();
}

reviewAgainButton.addEventListener("click", () => rateReviewItem(false));
reviewKnowButton.addEventListener("click", () => rateReviewItem(true));
reviewBackButton.addEventListener("click", showHome);
reviewButton.addEventListener("click", startReview);

refreshHome();
