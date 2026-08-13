const survivalState={running:false,lives:3,score:0,questions:0,correct:0,streak:0,bestStreak:0,current:null,currentType:null,characterPool:[],wordPool:[],timer:null,countdownTimer:null,deadline:0};

const survivalButton=document.createElement('button');
survivalButton.id='survivalButton';
survivalButton.className='gameLaunch gameLaunchAlt';
survivalButton.innerHTML=`<span><strong>Survival</strong><small>3 lives · mixed recognition · gets faster</small></span><span>♥</span>`;
document.querySelector('.gamesPanel')?.appendChild(survivalButton);
const survivalBadge=document.querySelector('.gamesPanel .gameBadge');
if(survivalBadge)survivalBadge.textContent='5 GAMES';

const survivalScreen=document.createElement('div');
survivalScreen.id='survivalScreen';
survivalScreen.className='hidden';
survivalScreen.innerHTML=`
<button id="survivalBack" class="backButton">← Practice</button>
<div class="rushTop">
  <div><span>Score</span><strong id="survivalScore">0</strong></div>
  <div><span>Lives</span><strong id="survivalLives">♥♥♥</strong></div>
  <div><span>Survived</span><strong id="survivalQuestions">0</strong></div>
</div>
<div class="rushTimer"><div id="survivalTimerBar"></div></div>
<div class="rushCard">
  <div id="survivalMode" class="progress">Character → meaning</div>
  <div id="survivalPrompt" class="rushCharacter">我</div>
  <p id="survivalInstruction">Tap the meaning</p>
  <div id="survivalAnswers" class="rushAnswers"></div>
  <div id="survivalReaction" class="rushReaction"></div>
</div>
<div id="survivalCountdown" class="rushCountdown hidden"><div id="survivalCountdownNumber">3</div><span>3 lives. Stay alive.</span></div>`;
document.querySelector('.app').appendChild(survivalScreen);
if(typeof screens!=='undefined')screens.push(survivalScreen);

const survivalResult=document.createElement('div');
survivalResult.id='survivalResult';
survivalResult.className='hidden';
survivalResult.innerHTML=`
<button id="survivalResultBack" class="backButton">← Practice</button>
<h1>Survival</h1>
<div class="rushResultCard">
  <div class="rushFinalScore" id="survivalFinalScore">0</div><span>points</span>
  <div class="rushStats">
    <div><strong id="survivalFinalQuestions">0</strong><span>questions survived</span></div>
    <div><strong id="survivalAccuracy">0%</strong><span>accuracy</span></div>
    <div><strong id="survivalBestStreak">0</strong><span>longest streak</span></div>
    <div><strong id="survivalPersonalBest">0</strong><span>personal best</span></div>
  </div>
</div>
<button id="survivalPlayAgain">Play Again</button>`;
document.querySelector('.app').appendChild(survivalResult);
if(typeof screens!=='undefined')screens.push(survivalResult);

function availableSurvivalWords(){
  const unlocked=wordLessons.filter(l=>isLessonComplete(l.requiresLesson)).flatMap(l=>l.words);
  return unlocked.length>=4?unlocked:(wordLessons[0]?.words||[]);
}

function resetSurvival(){
  clearTimeout(survivalState.timer);
  survivalState.running=false;
  survivalState.lives=3;
  survivalState.score=0;
  survivalState.questions=0;
  survivalState.correct=0;
  survivalState.streak=0;
  survivalState.bestStreak=0;
  survivalState.current=null;
  survivalState.currentType=null;
  survivalState.characterPool=rushPool();
  survivalState.wordPool=availableSurvivalWords();
}

function survivalTimeLimit(){
  return Math.max(1800,6000-Math.floor(survivalState.correct/5)*450);
}

function updateSurvivalHud(){
  document.getElementById('survivalScore').textContent=survivalState.score.toLocaleString();
  document.getElementById('survivalLives').textContent='♥'.repeat(survivalState.lives)+'♡'.repeat(3-survivalState.lives);
  document.getElementById('survivalQuestions').textContent=survivalState.questions;
}

function startSurvival(){
  resetSurvival();
  showScreen(survivalScreen);
  updateSurvivalHud();
  document.getElementById('survivalReaction').textContent='';
  document.getElementById('survivalTimerBar').style.animation='none';
  runCountdown(survivalState,'survivalCountdown','survivalCountdownNumber','#survivalScreen .rushCard',nextSurvivalQuestion);
}

function chooseSurvivalType(){
  const types=['characterMeaning','pinyinCharacter'];
  if(survivalState.wordPool.length>=4)types.push('wordMeaning');
  let type=rushShuffle(types)[0];
  if(type===survivalState.currentType&&types.length>1)type=rushShuffle(types.filter(x=>x!==survivalState.currentType))[0];
  return type;
}

function buildSurvivalQuestion(type){
  if(type==='wordMeaning'){
    const pool=survivalState.wordPool;
    const item=rushShuffle(pool)[0];
    const wrong=rushShuffle(pool.filter(x=>x.meaning!==item.meaning)).slice(0,3).map(x=>x.meaning);
    return {item,prompt:item.word,answer:item.meaning,choices:rushShuffle([item.meaning,...wrong]),mode:'Word → meaning',instruction:'Tap the meaning',detail:`${item.word} · ${item.pinyin} · ${item.meaning}`};
  }
  const pool=survivalState.characterPool;
  const item=rushShuffle(pool)[0];
  if(type==='pinyinCharacter'){
    const wrong=rushShuffle(pool.filter(x=>x.symbol!==item.symbol)).slice(0,3).map(x=>x.symbol);
    return {item,prompt:item.pinyin,answer:item.symbol,choices:rushShuffle([item.symbol,...wrong]),mode:'Pinyin → character',instruction:'Tap the character',detail:`${item.symbol} · ${item.pinyin} · ${item.meaning}`};
  }
  const wrong=rushShuffle(pool.filter(x=>x.meaning!==item.meaning)).slice(0,3).map(x=>x.meaning);
  return {item,prompt:item.symbol,answer:item.meaning,choices:rushShuffle([item.meaning,...wrong]),mode:'Character → meaning',instruction:'Tap the meaning',detail:`${item.symbol} · ${item.pinyin} · ${item.meaning}`};
}

function nextSurvivalQuestion(){
  if(survivalState.lives<=0){finishSurvival();return;}
  survivalState.running=true;
  const type=chooseSurvivalType();
  survivalState.currentType=type;
  survivalState.current=buildSurvivalQuestion(type);
  survivalState.questions++;
  updateSurvivalHud();
  document.getElementById('survivalMode').textContent=survivalState.current.mode;
  const prompt=document.getElementById('survivalPrompt');
  prompt.textContent=survivalState.current.prompt;
  prompt.className=type==='pinyinCharacter'?'pinyinRushPrompt':'rushCharacter';
  document.getElementById('survivalInstruction').textContent=survivalState.current.instruction;
  document.getElementById('survivalReaction').textContent='';
  const box=document.getElementById('survivalAnswers');
  box.innerHTML='';
  survivalState.current.choices.forEach(choice=>{
    const button=document.createElement('button');
    button.className='rushAnswer';
    button.textContent=choice;
    button.onclick=()=>answerSurvival(button,choice);
    box.appendChild(button);
  });
  const duration=survivalTimeLimit();
  const bar=document.getElementById('survivalTimerBar');
  bar.style.animation='none';
  void bar.offsetWidth;
  bar.style.animation=`rushDrain ${duration}ms linear forwards`;
  survivalState.deadline=performance.now()+duration;
  clearTimeout(survivalState.timer);
  survivalState.timer=setTimeout(()=>loseSurvivalLife(null,true),duration);
}

function answerSurvival(button,choice){
  if(!survivalState.running)return;
  clearTimeout(survivalState.timer);
  if(choice===survivalState.current.answer){
    survivalState.running=false;
    document.getElementById('survivalTimerBar').style.animationPlayState='paused';
    document.querySelectorAll('#survivalAnswers .rushAnswer').forEach(b=>{b.disabled=true;if(b.textContent===survivalState.current.answer)b.classList.add('correct');});
    button.classList.add('correct');
    survivalState.correct++;
    survivalState.streak++;
    survivalState.bestStreak=Math.max(survivalState.bestStreak,survivalState.streak);
    const remaining=Math.max(0,survivalState.deadline-performance.now());
    const speedBonus=Math.round(remaining/8);
    const streakBonus=Math.min(600,survivalState.streak*40);
    const points=500+speedBonus+streakBonus;
    survivalState.score+=points;
    document.getElementById('survivalReaction').textContent=`✓ +${points} · streak ${survivalState.streak}`;
    updateSurvivalHud();
    setTimeout(nextSurvivalQuestion,550);
    return;
  }
  loseSurvivalLife(button,false);
}

function loseSurvivalLife(button,timedOut){
  if(!survivalState.running)return;
  clearTimeout(survivalState.timer);
  survivalState.running=false;
  survivalState.lives--;
  survivalState.streak=0;
  document.getElementById('survivalTimerBar').style.animationPlayState='paused';
  document.querySelectorAll('#survivalAnswers .rushAnswer').forEach(b=>{b.disabled=true;if(b.textContent===survivalState.current.answer)b.classList.add('correct');});
  if(button)button.classList.add('incorrect');
  document.getElementById('survivalReaction').textContent=timedOut?`⌛ Time! ${survivalState.current.detail}`:`✕ ${survivalState.current.detail}`;
  updateSurvivalHud();
  if(survivalState.lives<=0){setTimeout(finishSurvival,900);return;}
  setTimeout(nextSurvivalQuestion,900);
}

function finishSurvival(){
  clearTimeout(survivalState.timer);
  survivalState.running=false;
  showScreen(survivalResult);
  const attempted=survivalState.questions;
  const accuracy=attempted?Math.round(survivalState.correct/attempted*100):0;
  const old=JSON.parse(localStorage.getItem('survivalBest')||'{}');
  const previousBest=old.score||0;
  const personalBest=Math.max(previousBest,survivalState.score);
  if(survivalState.score>previousBest)localStorage.setItem('survivalBest',JSON.stringify({score:survivalState.score,questions:survivalState.questions,accuracy,streak:survivalState.bestStreak,date:new Date().toISOString()}));
  document.getElementById('survivalFinalScore').textContent=survivalState.score.toLocaleString();
  document.getElementById('survivalFinalQuestions').textContent=survivalState.questions;
  document.getElementById('survivalAccuracy').textContent=`${accuracy}%`;
  document.getElementById('survivalBestStreak').textContent=survivalState.bestStreak;
  document.getElementById('survivalPersonalBest').textContent=personalBest.toLocaleString();
}

function exitSurvival(){
  clearInterval(survivalState.countdownTimer);
  clearTimeout(survivalState.timer);
  survivalState.running=false;
  showHome();
  if(typeof switchTab==='function')switchTab('practice');
}

survivalButton.onclick=startSurvival;
document.getElementById('survivalPlayAgain').onclick=startSurvival;
document.getElementById('survivalBack').onclick=exitSurvival;
document.getElementById('survivalResultBack').onclick=exitSurvival;