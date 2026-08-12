const speechState={voices:[],preferred:null};
function loadMandarinVoices(){if(!('speechSynthesis'in window))return;speechState.voices=window.speechSynthesis.getVoices();speechState.preferred=speechState.voices.find(v=>/^zh-CN/i.test(v.lang))||speechState.voices.find(v=>/^zh/i.test(v.lang))||null;}
loadMandarinVoices();if('speechSynthesis'in window)window.speechSynthesis.onvoiceschanged=loadMandarinVoices;
function speakMandarin(text,slow=false){if(!text||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=slow?.68:.9;u.pitch=1;u.volume=1;if(speechState.preferred)u.voice=speechState.preferred;window.speechSynthesis.speak(u);}
function makeAudioControls(getText){const wrap=document.createElement('div');wrap.className='audioControls';const play=document.createElement('button');play.className='audioButton';play.innerHTML='🔊 <span>Play</span>';play.type='button';play.onclick=()=>speakMandarin(getText(),false);const slow=document.createElement('button');slow.className='audioButton audioSlowButton';slow.innerHTML='🐢 <span>Slow</span>';slow.type='button';slow.onclick=()=>speakMandarin(getText(),true);wrap.append(play,slow);return wrap;}
function installAudioControls(){const targets=[
 {host:document.querySelector('#lessonScreen .flashcard'),get:()=>characterElement.textContent},
 {host:document.querySelector('#wordLessonScreen .flashcard'),get:()=>wordElement.textContent},
 {host:document.querySelector('#reviewScreen .flashcard'),get:()=>reviewSymbol.textContent},
 {host:document.querySelector('#dailyScreen .flashcard'),get:()=>document.getElementById('dailySymbol')?.textContent||''}
];targets.forEach(t=>{if(t.host&&!t.host.querySelector('.audioControls'))t.host.appendChild(makeAudioControls(t.get));});}
function addGrammarAudio(){document.addEventListener('click',e=>{const lesson=e.target.closest('.grammarLessonButton');if(!lesson)return;setTimeout(()=>{document.querySelectorAll('.grammarExample').forEach(card=>{if(card.querySelector('.audioControls'))return;const zh=card.querySelector('.grammarChinese');if(zh)card.appendChild(makeAudioControls(()=>zh.textContent));});},0);});}
function addPracticeAudio(){const observer=new MutationObserver(()=>{const card=document.getElementById('practiceCard');if(!card||card.querySelector('.audioControls'))return;const prompt=card.querySelector('.practicePrompt');if(prompt&&/[\u3400-\u9fff]/.test(prompt.textContent))card.appendChild(makeAudioControls(()=>prompt.textContent));});observer.observe(document.body,{childList:true,subtree:true});}
installAudioControls();addGrammarAudio();addPracticeAudio();
