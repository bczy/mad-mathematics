// Fonctions partagées pour Mad Mathematics
export function formatTime(seconds){
  const m = Math.floor(seconds/60);
  const s = Math.floor(seconds%60);
  return m>0? `${m}m ${s}s` : `${s}s`;
}

export function saveHighscore(name, score, time, level){
  try {
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
  } catch(e) {
    console.error('Failed to save highscore:', e);
    return false;
  }
}

export function loadHighscoresToElement(level, element){
  try {
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
        const scoreDisplay = level === 'super-multi' ? `${s.score} pts` : `${s.score}/15`;
        const medal = i===0?'🥇': i===1 ? '🥈' : i===2 ? '🥉' : '';
        const rank = i+1;
        rows.push(`<li class="highscore-item"><span class="hs-left"><span class="hs-rank">${rank}.</span> ${medal} ${s.name}</span><span class="hs-right">${scoreDisplay} <small class="hs-time">(${timeStr})</small></span></li>`);
      } else {
        const rank = i+1;
        rows.push(`<li class="highscore-item empty"><span class="hs-left"><span class="hs-rank">${rank}.</span> Aucun score</span></li>`);
      }
    }
    element.innerHTML = rows.join('');
  } catch(e) {
    console.error('Failed to load highscores:', e);
    if(element) {
      element.innerHTML = '<li class="highscore-item empty">Erreur de chargement</li>';
    }
  }
}

// helper to persist player name
export function loadPlayerName(inputId){
  try {
    const saved = localStorage.getItem('playerName');
    if(saved) document.getElementById(inputId).value = saved;
  } catch(e) {
    console.error('Failed to load player name:', e);
  }
}

export function savePlayerName(name){ 
  try {
    localStorage.setItem('playerName', name);
  } catch(e) {
    console.error('Failed to save player name:', e);
  }
}

// Timer management
export function createGameTimer(config) {
  // config: { limit, onTick, onTimeout, element }
  let timeRemaining = config.limit;
  let totalTimeSpent = 0;
  let interval = null;
  
  const api = {
    start() {
      timeRemaining = config.limit;
      if (interval) clearInterval(interval);
      
      interval = setInterval(() => {
        timeRemaining--;
        totalTimeSpent++;
        
        if (config.element) {
          config.element.textContent = timeRemaining;
        }
        
        if (config.onTick) {
          config.onTick(timeRemaining, totalTimeSpent);
        }
        
        if (timeRemaining <= 0) {
          api.stop();
          if (config.onTimeout) {
            config.onTimeout();
          }
        }
      }, 1000);
    },
    
    stop() {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    },
    
    getTotalTime() {
      return totalTimeSpent;
    },
    
    reset() {
      api.stop();
      timeRemaining = config.limit;
      totalTimeSpent = 0;
    }
  };
  
  return api;
}
