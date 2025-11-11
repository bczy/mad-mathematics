import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  formatTime,
  saveHighscore,
  loadHighscoresToElement,
  loadPlayerName,
  savePlayerName,
  createGameTimer
} from './shared.js';
import { FIXTURES } from './tests/fixtures/index.js';

describe('formatTime', () => {
  test('formats seconds under 60', () => {
    expect(formatTime(0)).toBe('0s');
    expect(formatTime(1)).toBe('1s');
    expect(formatTime(30)).toBe('30s');
    expect(formatTime(59)).toBe('59s');
  });

  test('formats minutes and seconds', () => {
    expect(formatTime(60)).toBe('1m 0s');
    expect(formatTime(61)).toBe('1m 1s');
    expect(formatTime(65)).toBe('1m 5s');
    expect(formatTime(90)).toBe('1m 30s');
    expect(formatTime(125)).toBe('2m 5s');
  });

  test('formats large durations', () => {
    expect(formatTime(3600)).toBe('60m 0s');
    expect(formatTime(3661)).toBe('61m 1s');
    expect(formatTime(7200)).toBe('120m 0s');
  });

  describe('edge cases', () => {
    test('handles zero', () => {
      expect(formatTime(0)).toBe('0s');
    });

    test('handles negative input', () => {
      const result = formatTime(-10);
      // Math.floor with negative creates negative minutes
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    test('handles non-integer input', () => {
      expect(formatTime(90.7)).toBe('1m 30s'); // Math.floor implicit in modulo
    });
  });
});

describe('saveHighscore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saves new highscore to empty list', () => {
    const result = saveHighscore('Alice', 15, 45, 'easy');

    expect(result).toBe(true);

    const saved = JSON.parse(localStorage.getItem('highscores_easy'));
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      name: 'Alice',
      score: 15,
      time: 45
    });
    expect(saved[0].date).toBeDefined();
  });

  test('maintains top 5 limit', () => {
    // Prepare 5 existing scores
    const existing = FIXTURES.highscores.top5;
    localStorage.setItem('highscores_easy', JSON.stringify(existing));

    // Add a 6th mediocre score
    const result = saveHighscore('Newbie', 5, 60, 'easy');

    expect(result).toBe(false); // not in top 5

    const saved = JSON.parse(localStorage.getItem('highscores_easy'));
    expect(saved).toHaveLength(5); // still 5
    expect(saved.find((s) => s.name === 'Newbie')).toBeUndefined();
  });

  test('sorts by score desc then time asc', () => {
    saveHighscore('Slow', 10, 60, 'easy');
    saveHighscore('Fast', 10, 30, 'easy');
    saveHighscore('Best', 15, 45, 'easy');

    const saved = JSON.parse(localStorage.getItem('highscores_easy'));

    expect(saved[0].name).toBe('Best'); // highest score
    expect(saved[1].name).toBe('Fast'); // equal score, better time
    expect(saved[2].name).toBe('Slow'); // equal score, worse time
  });

  describe('edge cases', () => {
    test('handles very long player names', () => {
      const longName = FIXTURES.players.long;
      const result = saveHighscore(longName, 15, 45, 'easy');

      expect(result).toBe(true);

      const saved = JSON.parse(localStorage.getItem('highscores_easy'));
      expect(saved[0].name).toBe(longName);
    });

    test('handles Unicode and emoji in names', () => {
      const unicodeName = FIXTURES.players.unicode;
      const result = saveHighscore(unicodeName, 15, 45, 'easy');

      expect(result).toBe(true);

      const saved = JSON.parse(localStorage.getItem('highscores_easy'));
      expect(saved[0].name).toBe(unicodeName);
    });

    test('handles corrupted localStorage data', () => {
      localStorage.setItem('highscores_easy', 'INVALID_JSON{');

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const result = saveHighscore('Player', 15, 45, 'easy');

      // Should catch the error and return false
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('error handling', () => {
    test('returns false and logs error on localStorage failure', () => {
      // Save initial mock state
      const realLocalStorage = global.localStorage;

      // Replace localStorage with one that throws
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('localStorage disabled');
          },
          setItem: () => {
            throw new Error('localStorage disabled');
          },
          clear: () => {}
        },
        writable: true,
        configurable: true
      });

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const result = saveHighscore('Player', 15, 45, 'easy');

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save highscore:',
        expect.any(Error)
      );

      consoleSpy.mockRestore();

      // Restore localStorage
      Object.defineProperty(global, 'localStorage', {
        value: realLocalStorage,
        writable: true,
        configurable: true
      });
    });
  });
});

describe('loadHighscoresToElement', () => {
  let container, listElement;

  beforeEach(() => {
    // Create minimal DOM for testing
    document.body.innerHTML = `
      <div id="container">
        <ul id="highscore-list"></ul>
      </div>
    `;
    container = document.getElementById('container');
    listElement = document.getElementById('highscore-list');
  });

  test('renders empty slots when no highscores', () => {
    loadHighscoresToElement('easy', listElement);

    const items = listElement.querySelectorAll('.highscore-item');
    expect(items).toHaveLength(5);

    items.forEach((item, index) => {
      expect(item.classList.contains('empty')).toBe(true);
      expect(item.textContent).toContain(`${index + 1}.`);
      expect(item.textContent).toContain('Aucun score');
    });
  });

  test('renders highscores with medals', () => {
    const scores = FIXTURES.highscores.top3;
    localStorage.setItem('highscores_easy', JSON.stringify(scores));

    loadHighscoresToElement('easy', listElement);

    const items = listElement.querySelectorAll('.highscore-item:not(.empty)');
    expect(items).toHaveLength(3);

    expect(items[0].textContent).toContain('🥇');
    expect(items[1].textContent).toContain('🥈');
    expect(items[2].textContent).toContain('🥉');
  });

  test('displays score as X/15 for normal levels', () => {
    localStorage.setItem(
      'highscores_easy',
      JSON.stringify([{ name: 'Test', score: 12, time: 45 }])
    );

    loadHighscoresToElement('easy', listElement);

    expect(listElement.textContent).toContain('12/15');
  });

  test('displays score as X pts for super-multi level', () => {
    localStorage.setItem(
      'highscores_super-multi',
      JSON.stringify([{ name: 'Test', score: 250, time: 45 }])
    );

    loadHighscoresToElement('super-multi', listElement);

    expect(listElement.textContent).toContain('250 pts');
  });

  test('inserts headers before list element', () => {
    loadHighscoresToElement('easy', listElement);

    const headers = listElement.previousElementSibling;
    expect(headers).not.toBeNull();
    expect(headers.classList.contains('hs-headers')).toBe(true);
    expect(headers.textContent).toContain('Rang');
    expect(headers.textContent).toContain('Nom');
    expect(headers.textContent).toContain('Score / Temps');
  });

  test('does not duplicate headers on multiple calls', () => {
    loadHighscoresToElement('easy', listElement);
    loadHighscoresToElement('easy', listElement);
    loadHighscoresToElement('easy', listElement);

    const allHeaders = container.querySelectorAll('.hs-headers');
    expect(allHeaders).toHaveLength(1);
  });

  describe('edge cases', () => {
    test('handles corrupted localStorage gracefully', () => {
      localStorage.setItem('highscores_easy', 'INVALID{JSON');

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      loadHighscoresToElement('easy', listElement);

      expect(listElement.textContent).toContain('Erreur de chargement');

      consoleSpy.mockRestore();
    });

    test('handles null element gracefully', () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        loadHighscoresToElement('easy', null);
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    test('handles localStorage unavailable', () => {
      // Save real localStorage
      const realLocalStorage = global.localStorage;

      // Replace with throwing version
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: () => {
            throw new Error('localStorage disabled');
          },
          setItem: () => {},
          clear: () => {}
        },
        writable: true,
        configurable: true
      });

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      loadHighscoresToElement('easy', listElement);

      expect(consoleSpy).toHaveBeenCalled();
      expect(listElement.textContent).toContain('Erreur de chargement');

      consoleSpy.mockRestore();

      // Restore localStorage
      Object.defineProperty(global, 'localStorage', {
        value: realLocalStorage,
        writable: true,
        configurable: true
      });
    });
  });
});

describe('loadPlayerName', () => {
  beforeEach(() => {
    document.body.innerHTML = '<input type="text" id="player-name">';
  });

  test('populates input with saved name', () => {
    localStorage.setItem('playerName', 'Mathéo');

    loadPlayerName('player-name');

    const input = document.getElementById('player-name');
    expect(input.value).toBe('Mathéo');
  });

  test('does nothing when no saved name', () => {
    loadPlayerName('player-name');

    const input = document.getElementById('player-name');
    expect(input.value).toBe('');
  });

  test('handles missing input element gracefully', () => {
    localStorage.setItem('playerName', 'Test');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      loadPlayerName('non-existent-id');
    }).not.toThrow();

    // Should log an error when trying to access null element
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('savePlayerName', () => {
  test('saves name to localStorage', () => {
    savePlayerName('Alice');

    expect(localStorage.getItem('playerName')).toBe('Alice');
  });

  test('overwrites previous name', () => {
    savePlayerName('Alice');
    savePlayerName('Bob');

    expect(localStorage.getItem('playerName')).toBe('Bob');
  });

  describe('edge cases', () => {
    test('handles empty string', () => {
      savePlayerName('');
      expect(localStorage.getItem('playerName')).toBe('');
    });

    test('handles Unicode characters', () => {
      const name = FIXTURES.players.unicode;
      savePlayerName(name);
      expect(localStorage.getItem('playerName')).toBe(name);
    });

    test('handles localStorage error gracefully', () => {
      // Save real localStorage
      const realLocalStorage = global.localStorage;

      // Replace with throwing version
      Object.defineProperty(global, 'localStorage', {
        value: {
          getItem: () => '',
          setItem: () => {
            throw new Error('localStorage full');
          },
          clear: () => {}
        },
        writable: true,
        configurable: true
      });

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() => {
        savePlayerName('Test');
      }).not.toThrow();

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();

      // Restore localStorage
      Object.defineProperty(global, 'localStorage', {
        value: realLocalStorage,
        writable: true,
        configurable: true
      });
    });
  });
});

describe('createGameTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="timer">60</div>';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('creates timer with initial state', () => {
    const timer = createGameTimer({ limit: 30 });

    expect(timer).toHaveProperty('start');
    expect(timer).toHaveProperty('stop');
    expect(timer).toHaveProperty('getTotalTime');
    expect(timer).toHaveProperty('reset');
  });

  test('decrements time on each tick', () => {
    const element = document.getElementById('timer');
    const timer = createGameTimer({ limit: 5, element });

    timer.start();

    vi.advanceTimersByTime(1000);
    expect(element.textContent).toBe('4');

    vi.advanceTimersByTime(1000);
    expect(element.textContent).toBe('3');
  });

  test('calls onTick callback', () => {
    const onTick = vi.fn();
    const timer = createGameTimer({ limit: 3, onTick });

    timer.start();
    vi.advanceTimersByTime(1000);

    expect(onTick).toHaveBeenCalledWith(2, 1); // remaining, total
  });

  test('calls onTimeout when time expires', () => {
    const onTimeout = vi.fn();
    const timer = createGameTimer({ limit: 2, onTimeout });

    timer.start();
    vi.advanceTimersByTime(2000);

    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  test('stops timer correctly', () => {
    const onTick = vi.fn();
    const timer = createGameTimer({ limit: 10, onTick });

    timer.start();
    vi.advanceTimersByTime(3000);
    timer.stop();
    vi.advanceTimersByTime(5000); // should not trigger more ticks

    expect(onTick).toHaveBeenCalledTimes(3);
  });

  test('getTotalTime returns accumulated time', () => {
    const timer = createGameTimer({ limit: 10 });

    timer.start();
    vi.advanceTimersByTime(3000);

    expect(timer.getTotalTime()).toBe(3);
  });

  test('reset clears timer state', () => {
    const timer = createGameTimer({ limit: 10 });

    timer.start();
    vi.advanceTimersByTime(5000);
    timer.reset();

    expect(timer.getTotalTime()).toBe(0);
  });

  test('prevents multiple timers when start called twice', () => {
    const onTick = vi.fn();
    const timer = createGameTimer({ limit: 10, onTick });

    timer.start();
    timer.start(); // second call

    vi.advanceTimersByTime(1000);

    expect(onTick).toHaveBeenCalledTimes(1); // only one timer running
  });
});
