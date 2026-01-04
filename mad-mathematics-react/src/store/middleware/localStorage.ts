/**
 * localStorage Middleware - Mad Mathematics
 * Zustand middleware for persisting playerName and highscores to localStorage
 */

import type { PersistedState } from '../../types';

/**
 * Storage keys
 */
const PLAYER_NAME_KEY = 'playerName';
const HIGHSCORES_PREFIX = 'highscores_';

/**
 * Load persisted state from localStorage
 */
export function loadPersistedState(): Partial<PersistedState> {
  const state: Partial<PersistedState> = {};

  try {
    // Load player name
    const playerName = localStorage.getItem(PLAYER_NAME_KEY);
    if (playerName) {
      state.playerName = playerName;
    }

    // Load highscores
    const highscores: PersistedState['highscores'] = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(HIGHSCORES_PREFIX)) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              highscores[key] = parsed;
            }
          }
        } catch {
          console.warn(`Failed to parse highscore for key: ${key}`);
        }
      }
    }
    state.highscores = highscores;
  } catch (error) {
    console.error('Failed to load persisted state:', error);
  }

  return state;
}

/**
 * Save player name to localStorage
 */
export function savePlayerName(name: string): void {
  try {
    if (name) {
      localStorage.setItem(PLAYER_NAME_KEY, name);
    } else {
      localStorage.removeItem(PLAYER_NAME_KEY);
    }
  } catch (error) {
    console.error('Failed to save player name:', error);
  }
}

/**
 * Save highscores to localStorage
 */
export function saveHighscores(
  highscores: PersistedState['highscores']
): void {
  try {
    for (const [key, scores] of Object.entries(highscores)) {
      if (scores.length > 0) {
        localStorage.setItem(key, JSON.stringify(scores));
      } else {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Failed to save highscores:', error);
  }
}
