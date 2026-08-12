const sentenceLessons = [
  { requiresLesson: 6, chinese: "你是谁？", pinyin: "nǐ shì shéi?", meaning: "Who are you?", pieces: ["你", "是", "谁"] },
  { requiresLesson: 6, chinese: "这是谁的？", pinyin: "zhè shì shéi de?", meaning: "Whose is this?", pieces: ["这", "是", "谁", "的"] },
  { requiresLesson: 7, chinese: "我有三个。", pinyin: "wǒ yǒu sān ge.", meaning: "I have three.", pieces: ["我", "有", "三", "个"] },
  { requiresLesson: 8, chinese: "今天是生日。", pinyin: "jīntiān shì shēngrì.", meaning: "Today is a birthday.", pieces: ["今", "天", "是", "生", "日"] },
  { requiresLesson: 9, chinese: "我会说。", pinyin: "wǒ huì shuō.", meaning: "I can speak.", pieces: ["我", "会", "说"] },
  { requiresLesson: 9, chinese: "你想看吗？", pinyin: "nǐ xiǎng kàn ma?", meaning: "Do you want to see/watch?", pieces: ["你", "想", "看", "吗"] },
  { requiresLesson: 10, chinese: "我要回家。", pinyin: "wǒ yào huí jiā.", meaning: "I want to go home.", pieces: ["我", "要", "回", "家"] },
  { requiresLesson: 10, chinese: "你能做吗？", pinyin: "nǐ néng zuò ma?", meaning: "Can you do it?", pieces: ["你", "能", "做", "吗"] }
];

const practicePanel = document.createElement("section");
practicePanel.className = "practicePanel";
practicePanel.innerHTML = `<h2>Practice Lab</h2><p>Use what you have learned in both directions.</p><div class="practiceButtons"><button id="mixedPracticeButton">Mixed Quiz</button><button id="sentencePracticeButton" class="secondaryButton">Build Sentences</button></div>`;
const wordHeading = [...homeScreen.querySelectorAll("h2")].find(h => h.textContent.trim() === "Word Building");
homeScreen.insertBefore(practicePanel, wordHeading);

const practiceScreen = document.createElement("div");
practiceScreen.id = "practiceScreen";
practiceScreen.className = "hidden";
practiceScreen.innerHTML = `<button id="practiceBackButton" class="backButton">← Home</button><h1 id="practiceTitle">Practice</h1><p id="practiceProgress" class="progress"></p><div id="practiceCard" class="quizCard"></div><div id="practiceOptions" class="quizOptions"></div><div id="practiceFeedback" class="quizFeedback hidden"></div><button id="practiceNextButton" class="hidden">Next</button>`;
document.querySelector(".app").appendChild(practiceScreen);
screens.push(practiceScreen);

let practiceQueue = [], practiceIndex = 0, practiceCorrect = 0, practiceMode = "mixed";
const practiceTitle = document.getElementById("practiceTitle");
const practiceProgress = document.getElementById("practiceProgress");
const practiceCard = document.getElementById("practiceCard");
const practiceOptions = document.getElementById("practiceOptions");
const practiceFeedback = document.getElementById("practiceFeedback");
const practiceNextButton = document.getElementById("practiceNextButton");

function learnedCharacterPool() {
  const completed = lessons.filter(l => isLessonComplete(l.lessonNumber)).flatMap(l => l.characters);
  return completed.length >= 5 ? completed : lessons[0].characters;
}

function makeMixedQuestions() {
  const pool = learnedCharacterPool();
  return shuffle(pool).slice(0, Math.min(10, pool.length)).map((card, i) => {
    const type = i % 3;
    if (type === 0) return { prompt: card.symbol, instruction: "Choose the Pinyin", answer: card.pinyin, choices: pool.map(x => x.pinyin) };
    if (type === 1) return { prompt: card.pinyin, instruction: "Choose the character", answer: card.symbol, choices: pool.map(x => x.symbol) };
    return { prompt: card.meaning, instruction: "Choose the character", answer: card.symbol, choices: pool.map(x => x.symbol) };
  });
}

function startMixedPractice() {
  practiceMode = "mixed"; practiceQueue = makeMixedQuestions(); practiceIndex = 0; practiceCorrect = 0;
  practiceTitle.textContent = "Mixed Quiz"; showScreen(practiceScreen); showMixedQuestion();
}

function showMixedQuestion() {
  const q = practiceQueue[practiceIndex];
  practiceProgress.textContent = `Question ${practiceIndex + 1} of ${practiceQueue.length}`;
  practiceCard.innerHTML = `<div class="practicePrompt">${q.prompt}</div><p>${q.instruction}</p>`;
  practiceOptions.innerHTML = ""; practiceFeedback.className = "quizFeedback hidden"; practiceNextButton.classList.add("hidden");
  const distractors = shuffle([...new Set(q.choices.filter(x => x !== q.answer))]).slice(0, 3);
  shuffle([q.answer, ...distractors]).forEach(choice => {
    const b = document.createElement("button"); b.className = "quizOption"; b.textContent = choice;
    b.onclick = () => answerMixed(b, choice, q.answer); practiceOptions.appendChild(b);
  });
}

function answerMixed(button, selected, answer) {
  [...practiceOptions.children].forEach(b => { b.disabled = true; if (b.textContent === answer) b.classList.add("correct"); });
  const right = selected === answer; if (right) practiceCorrect++; else button.classList.add("incorrect");
  practiceFeedback.textContent = right ? "Correct!" : `Correct answer: ${answer}`;
  practiceFeedback.className = `quizFeedback ${right ? "success" : "error"}`; practiceNextButton.classList.remove("hidden");
}

function availableSentences() {
  return sentenceLessons.filter(s => isLessonComplete(s.requiresLesson));
}

function startSentencePractice() {
  const available = availableSentences();
  if (!available.length) { alert("Complete Character Lesson 6 to unlock sentence building."); return; }
  practiceMode = "sentence"; practiceQueue = shuffle(available); practiceIndex = 0; practiceCorrect = 0;
  practiceTitle.textContent = "Build Sentences"; showScreen(practiceScreen); showSentenceQuestion();
}

function showSentenceQuestion() {
  const q = practiceQueue[practiceIndex]; q.current = [];
  practiceProgress.textContent = `Sentence ${practiceIndex + 1} of ${practiceQueue.length}`;
  practiceCard.innerHTML = `<p class="sentenceMeaning">${q.meaning}</p><div id="sentenceAnswer" class="sentenceAnswer">Tap the characters in order</div>`;
  practiceOptions.innerHTML = ""; practiceFeedback.className = "quizFeedback hidden"; practiceNextButton.classList.add("hidden");
  shuffle(q.pieces).forEach(piece => {
    const b = document.createElement("button"); b.className = "sentencePiece"; b.textContent = piece;
    b.onclick = () => { q.current.push(piece); b.disabled = true; document.getElementById("sentenceAnswer").textContent = q.current.join(""); if (q.current.length === q.pieces.length) gradeSentence(q); };
    practiceOptions.appendChild(b);
  });
}

function gradeSentence(q) {
  const right = q.current.join("") === q.pieces.join(""); if (right) practiceCorrect++;
  practiceFeedback.innerHTML = right ? `Correct!<br><strong>${q.chinese}</strong><br>${q.pinyin}` : `Correct order: <strong>${q.chinese}</strong><br>${q.pinyin}`;
  practiceFeedback.className = `quizFeedback ${right ? "success" : "error"}`; practiceNextButton.classList.remove("hidden");
}

practiceNextButton.onclick = () => {
  if (practiceIndex >= practiceQueue.length - 1) {
    practiceCard.innerHTML = `<div class="resultScore">${practiceCorrect} / ${practiceQueue.length}</div><p>Practice complete. Keep mixing recognition with recall.</p>`;
    practiceOptions.innerHTML = ""; practiceFeedback.className = "hidden"; practiceNextButton.textContent = "Back Home"; practiceNextButton.onclick = () => { practiceNextButton.textContent = "Next"; practiceNextButton.onclick = arguments.callee; showHome(); }; return;
  }
  practiceIndex++; practiceMode === "mixed" ? showMixedQuestion() : showSentenceQuestion();
};

document.getElementById("mixedPracticeButton").onclick = startMixedPractice;
document.getElementById("sentencePracticeButton").onclick = startSentencePractice;
document.getElementById("practiceBackButton").onclick = showHome;
