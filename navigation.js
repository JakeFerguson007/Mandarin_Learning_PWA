const tabShell=document.createElement("nav");tabShell.id="bottomTabs";tabShell.className="bottomTabs";tabShell.setAttribute("aria-label","Main navigation");tabShell.innerHTML=`<button data-tab="learn" class="tabButton active"><span class="tabIcon">学</span><span>Learn</span></button><button data-tab="practice" class="tabButton"><span class="tabIcon">练</span><span>Practice</span></button><button data-tab="grammar" class="tabButton"><span class="tabIcon">文</span><span>Grammar</span></button><button data-tab="progress" class="tabButton"><span class="tabIcon">✓</span><span>Progress</span></button>`;document.body.appendChild(tabShell);

const learnTab=document.createElement("div");learnTab.id="learnTab";learnTab.className="tabPage";
const practiceTab=document.createElement("div");practiceTab.id="practiceTab";practiceTab.className="tabPage hidden";
const grammarTab=document.createElement("div");grammarTab.id="grammarTab";grammarTab.className="tabPage hidden";
const progressTab=document.createElement("div");progressTab.id="progressTab";progressTab.className="tabPage hidden";

const tabHost=document.createElement("div");tabHost.id="tabHost";homeScreen.insertBefore(tabHost,homeScreen.firstChild);tabHost.append(learnTab,practiceTab,grammarTab,progressTab);
const brand=homeScreen.querySelector(".brandRow");const progressPanel=homeScreen.querySelector(".progressPanel");const courseBar=homeScreen.querySelector(".courseProgress");const review=homeScreen.querySelector("#reviewButton");const characterH=[...homeScreen.querySelectorAll("h2")].find(h=>h.textContent.trim()==="Character Lessons");const wordsH=[...homeScreen.querySelectorAll("h2")].find(h=>h.textContent.trim()==="Word Building");
learnTab.append(brand,characterH,lessonList,wordsH,wordLessonList);

practiceTab.innerHTML=`<div class="tabHeader"><h1>Practice</h1><p>Review, recall, and use what you've learned.</p></div>`;if(typeof dailyPanel!=="undefined")practiceTab.appendChild(dailyPanel);practiceTab.appendChild(review);if(typeof practicePanel!=="undefined")practiceTab.appendChild(practicePanel);

grammarTab.innerHTML=`<div class="tabHeader"><h1>Grammar</h1><p>Understand how Mandarin sentences fit together.</p></div>`;if(typeof grammarPanel!=="undefined")grammarTab.appendChild(grammarPanel);const grammarQuick=document.createElement("div");grammarQuick.className="tabInfoCard";grammarQuick.innerHTML=`<strong>Progressive guide</strong><p>Grammar lessons unlock alongside your character lessons, so examples stay familiar.</p>`;grammarTab.appendChild(grammarQuick);

progressTab.innerHTML=`<div class="tabHeader"><h1>Progress</h1><p>Your Mandarin learning at a glance.</p></div>`;progressTab.append(progressPanel,courseBar);const progressDetails=document.createElement("div");progressDetails.className="progressDetails";progressTab.appendChild(progressDetails);

function renderProgressTab(){const total=lessons.reduce((n,l)=>n+l.characters.length,0);const done=lessons.filter(l=>isLessonComplete(l.lessonNumber)).reduce((n,l)=>n+l.characters.length,0);const wordDone=wordLessons.filter(l=>isWordLessonComplete(l.lessonNumber)).reduce((n,l)=>n+l.words.length,0);const weak=progressState.weakCharacters.length+progressState.weakWords.length;progressDetails.innerHTML=`<div class="statCard"><strong>${progressState.completedLessons.length}</strong><span>character lessons passed</span></div><div class="statCard"><strong>${done}/${total}</strong><span>characters completed</span></div><div class="statCard"><strong>${wordDone}</strong><span>words practiced</span></div><div class="statCard"><strong>${weak}</strong><span>weak items</span></div>`;}

let activeTab="learn";const tabOrder=["learn","practice","grammar","progress"];
function switchTab(name){activeTab=name;[learnTab,practiceTab,grammarTab,progressTab].forEach(p=>p.classList.add("hidden"));document.getElementById(`${name}Tab`).classList.remove("hidden");document.querySelectorAll(".tabButton").forEach(b=>b.classList.toggle("active",b.dataset.tab===name));if(name==="progress")renderProgressTab();window.scrollTo({top:0,behavior:"smooth"});}
document.querySelectorAll(".tabButton").forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));

const originalShowScreen=showScreen;showScreen=function(screen){originalShowScreen(screen);tabShell.classList.toggle("hidden",screen!==homeScreen);};
const originalShowHome=showHome;showHome=function(){originalShowHome();tabShell.classList.remove("hidden");switchTab(activeTab);};

let touchStartX=0,touchStartY=0;homeScreen.addEventListener("touchstart",e=>{if(e.touches.length!==1)return;touchStartX=e.touches[0].clientX;touchStartY=e.touches[0].clientY;},{passive:true});homeScreen.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-touchStartX,dy=e.changedTouches[0].clientY-touchStartY;if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.4)return;const i=tabOrder.indexOf(activeTab);if(dx<0&&i<tabOrder.length-1)switchTab(tabOrder[i+1]);if(dx>0&&i>0)switchTab(tabOrder[i-1]);},{passive:true});

switchTab("learn");tabShell.classList.remove("hidden");
