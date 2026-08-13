const listeningRushState={running:false,round:0,total:20,score:0,correct:0,streak:0,bestStreak:0,start:0,times:[],current:null,pool:[],countdownTimer:null};

const listeningRushButton=document.createElement('button');
listeningRushButton.id='listeningRushButton';
listeningRushButton.className='gameLaunch';
listeningRushButton.innerHTML=`<span><strong>Audio Rush</strong><small>Hear Mandarin → tap the character</small></span><span>🔊</span>`;
document.querySelector('.gamesPanel')?.appendChild(listeningRushButton);
const listeningBadge=document.querySelector('.gamesPanel .gameBadge');
if(listeningBadge)listeningBadge.textContent='4 GAMES';

const listeningRushScreen=document.createElement('div');
listeningRushScreen.id='listeningRushScreen';
listeningRushScreen.className='hidden';
listeningRushScreen.innerHTML=`
<button id="listeningRushBack" class="backButton">← Practice</button>
<div class="rushTop">
  <div><span>Score</span><strong id="listeningRushScore">0</strong></div>
  <div><span>Streak</span><strong id="listeningRushStreak">0</strong></div>
  <div><span>Question</span><strong><span id="listeningRushNumber">1</span>/20</strong></div>
</div>
<div class="rushTimer"><div id="listeningRushTimerBar"></div></div>
<div class="rushCard listeningRushCard">
  <button id="listenAgainButton" class="listenAgainButton" type="button">🔊 Play Again</button>
  <p>Tap the character you hear</p>
  <div id="listeningRushAnswers" class="rushAnswers listeningRushAnswers"></div>
  <div id="listeningRushReaction" class="rushReaction"></div>
</div>
<div id="listeningRushCountdown" class="rushCountdown hidden"><div id="listeningRushCountdownNumber">3</div><span>Get ready!</span></div>`;
document.querySelector('.app').appendChild(listeningRushScreen);
if(typeof screens!=='undefined')screens.push(listeningRushScreen);

const listeningRushResult=document.createElement('div');
listeningRushResult.id='listeningRushResult';
listeningRushResult.className='hidden';
listeningRushResult.innerHTML=`
<button id="listeningRushResultBack" class="backButton">← Practice</button>
<h1>Audio Rush</h1>
<div class="rushResultCard">
  <div class="rushFinalScore" id="listeningRushFinalScore">0</div><span>points</span>
  <div class="rushStats">
    <div><strong id="listeningRushAccuracy">0%</strong><span>accuracy</span></div>
    <div><strong id="listeningRushAverage">—</strong><span>avg reaction</span></div>
    <div><strong id="listeningRushBest">—</strong><span>best reaction</span></div>
    <div><strong id="listeningRushBestStreak">0</strong><span>best streak</span></div>
  </div>
</div>
<button id="listeningRushPlayAgain">Play Again</button>`;
document.querySelector('.app').appendChild(listeningRushResult);
if(typeof screens!=='undefined')screens.push(listeningRushResult);

function resetListeningRush(){
  listeningRushState.running=false;listeningRushState.round=0;listeningRushState.score=0;listeningRushState.correct=0;listeningRushState.streak=0;listeningRushState.bestStreak=0;listeningRushState.times=[];listeningRushState.current=null;listeningRushState.pool=rushPool();
}

function startListeningRush(){
  resetListeningRush();
  showScreen(listeningRushScreen);
  document.getElementById('listeningRushScore').textContent='0';
  document.getElementById('listeningRushStreak').textContent='0';
  document.getElementById('listeningRushNumber').textContent='1';
  document.getElementById('listeningRushTimerBar').style.animation='none';
  runCountdown(listeningRushState,'listeningRushCountdown','listeningRushCountdownNumber','#listeningRushScreen .rushCard',nextListeningRush);
}

function nextListeningRush(){
  if(listeningRushState.round>=listeningRushState.total){finishListeningRush();return;}
  const pool=listeningRushState.pool;
  let next=rushShuffle(pool)[0];
  if(listeningRushState.current&&pool.length>1)while(next.symbol===listeningRushState.current.symbol)next=rushShuffle(pool)[0];
  listeningRushState.current=next;
  listeningRushState.round++;
  document.getElementById('listeningRushNumber').textContent=listeningRushState.round;
  document.getElementById('listeningRushScore').textContent=listeningRushState.score.toLocaleString();
  document.getElementById('listeningRushStreak').textContent=listeningRushState.streak;
  document.getElementById('listeningRushReaction').textContent='';
  const wrong=rushShuffle(pool.filter(x=>x.symbol!==next.symbol)).slice(0,3).map(x=>x.symbol);
  const choices=rushShuffle([next.symbol,...wrong]);
  const box=document.getElementById('listeningRushAnswers');box.innerHTML='';
  choices.forEach(choice=>{const b=document.createElement('button');b.className='rushAnswer listeningRushAnswer';b.textContent=choice;b.onclick=()=>answerListeningRush(b,choice);box.appendChild(b);});
  const bar=document.getElementById('listeningRushTimerBar');bar.style.animation='none';void bar.offsetWidth;bar.style.animation='rushDrain 6s linear forwards';
  speakMandarin(next.symbol,false);
  listeningRushState.start=performance.now();
}

function answerListeningRush(button,choice){
  if(!listeningRushState.running)return;
  const elapsed=performance.now()-listeningRushState.start;
  const correct=choice===listeningRushState.current.symbol;
  listeningRushState.running=false;
  document.getElementById('listeningRushTimerBar').style.animationPlayState='paused';
  document.querySelectorAll('#listeningRushAnswers .rushAnswer').forEach(b=>{b.disabled=true;if(b.textContent===listeningRushState.current.symbol)b.classList.add('correct');});
  if(correct){
    listeningRushState.correct++;listeningRushState.streak++;listeningRushState.bestStreak=Math.max(listeningRushState.bestStreak,listeningRushState.streak);listeningRushState.times.push(elapsed);
    const speed=Math.max(100,Math.round(1300-elapsed*.22));const bonus=Math.min(500,listeningRushState.streak*35);listeningRushState.score+=speed+bonus;button.classList.add('correct');
    document.getElementById('listeningRushReaction').textContent=`✓ ${(elapsed/1000).toFixed(2)} s  +${speed+bonus}`;
  }else{
    listeningRushState.streak=0;button.classList.add('incorrect');
    document.getElementById('listeningRushReaction').textContent=`✕ ${listeningRushState.current.symbol} · ${listeningRushState.current.pinyin} · ${listeningRushState.current.meaning}`;
  }
  document.getElementById('listeningRushScore').textContent=listeningRushState.score.toLocaleString();
  document.getElementById('listeningRushStreak').textContent=listeningRushState.streak;
  setTimeout(()=>{listeningRushState.running=true;nextListeningRush();},850);
}

function finishListeningRush(){
  listeningRushState.running=false;if('speechSynthesis'in window)window.speechSynthesis.cancel();showScreen(listeningRushResult);
  const accuracy=Math.round(listeningRushState.correct/listeningRushState.total*100);
  const avg=listeningRushState.times.length?listeningRushState.times.reduce((a,b)=>a+b,0)/listeningRushState.times.length:null;
  const best=listeningRushState.times.length?Math.min(...listeningRushState.times):null;
  document.getElementById('listeningRushFinalScore').textContent=listeningRushState.score.toLocaleString();
  document.getElementById('listeningRushAccuracy').textContent=`${accuracy}%`;
  document.getElementById('listeningRushAverage').textContent=avg?`${(avg/1000).toFixed(2)} s`:'—';
  document.getElementById('listeningRushBest').textContent=best?`${(best/1000).toFixed(2)} s`:'—';
  document.getElementById('listeningRushBestStreak').textContent=listeningRushState.bestStreak;
  const old=JSON.parse(localStorage.getItem('listeningRushBest')||'{}');
  if(!old.score||listeningRushState.score>old.score)localStorage.setItem('listeningRushBest',JSON.stringify({score:listeningRushState.score,accuracy,avg,best,streak:listeningRushState.bestStreak,date:new Date().toISOString()}));
}

function exitListeningRush(){clearInterval(listeningRushState.countdownTimer);listeningRushState.running=false;if('speechSynthesis'in window)window.speechSynthesis.cancel();showHome();if(typeof switchTab==='function')switchTab('practice');}

listeningRushButton.onclick=startListeningRush;
document.getElementById('listeningRushPlayAgain').onclick=startListeningRush;
document.getElementById('listeningRushBack').onclick=exitListeningRush;
document.getElementById('listeningRushResultBack').onclick=exitListeningRush;
document.getElementById('listenAgainButton').onclick=()=>{if(listeningRushState.current)speakMandarin(listeningRushState.current.symbol,false);};