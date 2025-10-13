// Fonctions partagées pour Mad Mathematics
function formatTime(seconds){
  const m = Math.floor(seconds/60);
  const s = seconds%60;
  return m>0? `${m}m ${s}s` : `${s}s`;
}

function saveHighscore(name, score, time, level){
  let highscores = JSON.parse(localStorage.getItem(`highscores_${level}`)) || [];
  const newScore = { name, score, time, date: new Date().toISOString() };
  highscores.push(newScore);
  highscores.sort((a,b)=>{
    if(b.score !== a.score) return b.score - a.score;
    return a.time - b.time;
  });
  const isInTop5 = highscores.indexOf(newScore) < 5;
  highscores = highscores.slice(0,5);
  localStorage.setItem(`highscores_${level}`, JSON.stringify(highscores));
  return isInTop5;
}

function loadHighscoresToElement(level, element){
  const highscores = JSON.parse(localStorage.getItem(`highscores_${level}`)) || [];
  if(highscores.length === 0){
    element.innerHTML = '<li class="highscore-item">Aucun score</li>';
    return;
  }
  element.innerHTML = highscores.map((s,i)=>{
    const timeStr = formatTime(s.time || 0);
    const scoreDisplay = level === 'super-multi' ? `${s.score}pts` : `${s.score}/20`;
    const medal = i===0?'🥇': i===1 ? '🥈' : i===2 ? '🥉' : '';
    return `<li class="highscore-item"><span>${medal} ${s.name}</span><span>${scoreDisplay} (${timeStr})</span></li>`;
  }).join('');
}

// helper to persist player name
function loadPlayerName(inputId){
  const saved = localStorage.getItem('playerName');
  if(saved) document.getElementById(inputId).value = saved;
}

function savePlayerName(name){ localStorage.setItem('playerName', name); }
