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
  // Insert a header immediately before the element UL if not already present
  if(element){
    let headers = element.previousElementSibling;
    if(!headers || !headers.classList.contains('hs-headers')){
      headers = document.createElement('div');
      headers.className = 'hs-headers';
      headers.innerHTML = `<div class="hs-col-rank">Rang</div><div class="hs-col-name">Nom</div><div class="hs-col-score">Score / Temps</div>`;
      element.parentElement.insertBefore(headers, element);
    }
  }
  // Ensure we always show 5 rows
  const rows = [];
  for(let i=0;i<5;i++){
    const s = highscores[i];
    if(s){
      const timeStr = formatTime(s.time || 0);
      const scoreDisplay = level === 'super-multi' ? `${s.score} pts` : `${s.score}/20`;
      const medal = i===0?'🥇': i===1 ? '🥈' : i===2 ? '🥉' : '';
      const rank = i+1;
      rows.push(`<li class="highscore-item"><span class="hs-left"><span class="hs-rank">${rank}.</span> ${medal} ${s.name}</span><span class="hs-right">${scoreDisplay} <small class="hs-time">(${timeStr})</small></span></li>`);
    } else {
      const rank = i+1;
      rows.push(`<li class="highscore-item empty"><span class="hs-left"><span class="hs-rank">${rank}.</span> Aucun score</span></li>`);
    }
  }
  element.innerHTML = rows.join('');
}

// helper to persist player name
function loadPlayerName(inputId){
  const saved = localStorage.getItem('playerName');
  if(saved) document.getElementById(inputId).value = saved;
}

function savePlayerName(name){ localStorage.setItem('playerName', name); }
