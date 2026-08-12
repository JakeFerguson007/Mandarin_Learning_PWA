const DAILY_DAY_MS = 24 * 60 * 60 * 1000;

function dailyDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function dailyMidnight(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function dailyEnsureState() {
    if (!progressState.reviewSchedule || typeof progressState.reviewSchedule !== "object") {
        progressState.reviewSchedule = {};
    }
    if (!Array.isArray(progressState.activityDates)) progressState.activityDates = [];
    if (!progressState.reviewStats || typeof progressState.reviewStats !== "object") {
        progressState.reviewStats = { correct: 0, again: 0 };
    }
    saveProgress();
}

function dailyKey(type, value) {
    return `${type}:${value}`;
}

function dailySchedule(type, value, known) {
    dailyEnsureState();
    const key = dailyKey(type, value);
    const previous = progressState.reviewSchedule[key] || { level: 0, due: dailyMidnight() };

    let level;
    let intervalDays;

    if (known) {
        level = Math.min((previous.level || 0) + 1, 5);
        intervalDays = [1, 3, 7, 14, 30][level - 1] || 30;
        progressState.reviewStats.correct++;
    } else {
        level = 0;
        intervalDays = 0;
        progressState.reviewStats.again++;
    }

    progressState.reviewSchedule[key] = {
        level,
        due: dailyMidnight() + intervalDays * DAILY_DAY_MS,
        lastReviewed: Date.now()
    };

    dailyRecordActivity();
    saveProgress();
    dailyRenderHome();
}

function dailyRecordActivity() {
    dailyEnsureState();
    const today = dailyDateKey();
    if (!progressState.activityDates.includes(today)) progressState.activityDates.push(today);
    progressState.activityDates = progressState.activityDates.slice(-120);
}

function dailyStreak() {
    dailyEnsureState();
    const set = new Set(progressState.activityDates);
    let streak = 0;
    const cursor = new Date();

    if (!set.has(dailyDateKey(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
    }

    while (set.has(dailyDateKey(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }

    return streak;
}

function dailyAvailableItems() {
    const completedCharacterSymbols = lessons
        .filter(lesson => progressState.completedLessons.includes(lesson.lessonNumber))
        .flatMap(lesson => lesson.characters)
        .map(card => card.symbol);

    const completedWords = wordLessons
        .filter(lesson => progressState.completedWordLessons.includes(lesson.lessonNumber))
        .flatMap(lesson => lesson.words)
        .map(item => item.word);

    const charMap = new Map(allCharacters().map(card => [card.symbol, card]));
    const wordMap = new Map(allWords().map(item => [item.word, item]));

    const items = [];

    completedCharacterSymbols.forEach(symbol => {
        const card = charMap.get(symbol);
        if (card) items.push({ type: "character", key: symbol, symbol, pinyin: card.pinyin, meaning: card.meaning });
    });

    completedWords.forEach(word => {
        const item = wordMap.get(word);
        if (item) items.push({ type: "word", key: word, symbol: word, pinyin: item.pinyin, meaning: item.meaning });
    });

    return items;
}

function dailyDueItems() {
    dailyEnsureState();
    const now = dailyMidnight();
    return dailyAvailableItems().filter(item => {
        const schedule = progressState.reviewSchedule[dailyKey(item.type, item.key)];
        return !schedule || schedule.due <= now;
    });
}

function dailyMasteredCount() {
    dailyEnsureState();
    return Object.values(progressState.reviewSchedule).filter(item => (item.level || 0) >= 4).length;
}

let dailyDeck = [];
let dailyIndex = 0;
let dailyCurrent = null;

function dailyCreateUI() {
    const progressPanel = document.querySelector(".progressPanel");
    if (!progressPanel || document.getElementById("dailyPanel")) return;

    const panel = document.createElement("section");
    panel.id = "dailyPanel";
    panel.className = "dailyPanel";
    panel.innerHTML = `
        <div class="dailyHeader">
            <div><span class="dailyEyebrow">TODAY</span><h2>Daily Practice</h2></div>
            <div class="streakBadge"><strong id="dailyStreak">0</strong><span>day streak</span></div>
        </div>
        <div class="dailyStats">
            <div><strong id="dailyDueCount">0</strong><span>due today</span></div>
            <div><strong id="dailyMastered">0</strong><span>mastered</span></div>
        </div>
        <button id="dailyStartButton" class="dailyStartButton">Start Daily Review</button>
    `;

    progressPanel.parentNode.insertBefore(panel, progressPanel);

    const screen = document.createElement("div");
    screen.id = "dailyScreen";
    screen.className = "hidden";
    screen.innerHTML = `
        <button id="dailyBackButton" class="backButton">← Home</button>
        <h1>Daily Review</h1>
        <p id="dailyProgress" class="progress"></p>
        <div class="flashcard dailyFlashcard">
            <div id="dailySymbol" class="character"></div>
            <div id="dailyPinyin" class="pinyin hidden"></div>
            <div id="dailyMeaning" class="meaning hidden"></div>
            <div id="dailyMasteryLabel" class="masteryLabel"></div>
        </div>
        <button id="dailyRevealButton">Reveal</button>
        <div id="dailyRating" class="ratingRow hidden">
            <button id="dailyAgainButton" class="secondaryButton">Again Today</button>
            <button id="dailyKnowButton">Got It</button>
        </div>
    `;

    document.querySelector(".app").appendChild(screen);
    screens.push(screen);

    document.getElementById("dailyStartButton").addEventListener("click", dailyStartReview);
    document.getElementById("dailyBackButton").addEventListener("click", showHome);
    document.getElementById("dailyRevealButton").addEventListener("click", dailyReveal);
    document.getElementById("dailyAgainButton").addEventListener("click", () => dailyRate(false));
    document.getElementById("dailyKnowButton").addEventListener("click", () => dailyRate(true));
}

function dailyRenderHome() {
    if (!document.getElementById("dailyPanel")) return;
    const due = dailyDueItems().length;
    document.getElementById("dailyDueCount").textContent = due;
    document.getElementById("dailyMastered").textContent = dailyMasteredCount();
    document.getElementById("dailyStreak").textContent = dailyStreak();

    const button = document.getElementById("dailyStartButton");
    button.disabled = due === 0;
    button.textContent = due ? `Review ${due} Due Item${due === 1 ? "" : "s"}` : "You're Caught Up";
    button.classList.toggle("caughtUp", due === 0);
}

function dailyStartReview() {
    dailyDeck = shuffle(dailyDueItems());
    if (!dailyDeck.length) return;
    dailyIndex = 0;
    const screen = document.getElementById("dailyScreen");
    showScreen(screen);
    dailyShowItem();
}

function dailyShowItem() {
    if (!dailyDeck.length) {
        dailyRecordActivity();
        saveProgress();
        showHome();
        dailyRenderHome();
        return;
    }

    if (dailyIndex >= dailyDeck.length) dailyIndex = 0;
    dailyCurrent = dailyDeck[dailyIndex];

    document.getElementById("dailyProgress").textContent = `${dailyIndex + 1} of ${dailyDeck.length} due today`;
    document.getElementById("dailySymbol").textContent = dailyCurrent.symbol;
    document.getElementById("dailyPinyin").textContent = dailyCurrent.pinyin;
    document.getElementById("dailyMeaning").textContent = dailyCurrent.meaning;

    const schedule = progressState.reviewSchedule[dailyKey(dailyCurrent.type, dailyCurrent.key)];
    const level = schedule ? schedule.level || 0 : 0;
    document.getElementById("dailyMasteryLabel").textContent = level >= 4 ? "Mastered" : `Mastery ${level} / 5`;

    document.getElementById("dailyPinyin").classList.add("hidden");
    document.getElementById("dailyMeaning").classList.add("hidden");
    document.getElementById("dailyRating").classList.add("hidden");
    document.getElementById("dailyRevealButton").classList.remove("hidden");
}

function dailyReveal() {
    document.getElementById("dailyPinyin").classList.remove("hidden");
    document.getElementById("dailyMeaning").classList.remove("hidden");
    document.getElementById("dailyRating").classList.remove("hidden");
    document.getElementById("dailyRevealButton").classList.add("hidden");
}

function dailyRate(known) {
    if (!dailyCurrent) return;
    dailySchedule(dailyCurrent.type, dailyCurrent.key, known);

    if (known) {
        dailyDeck.splice(dailyIndex, 1);
    } else {
        dailyIndex++;
    }

    dailyShowItem();
}

function dailyWireExistingRatings() {
    characterAgainButton.addEventListener("click", () => {
        const card = characters[currentCard];
        if (card) dailySchedule("character", card.symbol, false);
    });

    characterKnowButton.addEventListener("click", () => {
        const card = characters[currentCard];
        if (card) dailySchedule("character", card.symbol, true);
    });

    wordAgainButton.addEventListener("click", () => {
        const item = words[currentWordCard];
        if (item) dailySchedule("word", item.word, false);
    });

    wordKnowButton.addEventListener("click", () => {
        const item = words[currentWordCard];
        if (item) dailySchedule("word", item.word, true);
    });

    reviewAgainButton.addEventListener("click", () => {
        const item = reviewItems[reviewIndex];
        if (item) dailySchedule(item.type, item.key, false);
    });

    reviewKnowButton.addEventListener("click", () => {
        const item = reviewItems[reviewIndex];
        if (item) dailySchedule(item.type, item.key, true);
    });
}

dailyEnsureState();
dailyCreateUI();
dailyWireExistingRatings();
dailyRenderHome();
