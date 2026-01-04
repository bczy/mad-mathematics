/**
 * Highscores Slice - Mad Mathematics
 * Zustand slice for highscore state management with top 5 logic
 */

import type { StateCreator } from 'zustand';
import type { AppStore, HighscoresSlice } from '../../types';
import type { Highscore, HighscoresMap } from '../../types/highscore';
import { MAX_HIGHSCORES } from '../../types/highscore';

/**
 * Sorts highscores by score (descending), then by time (ascending)
 */
function sortHighscores(scores: Highscore[]): Highscore[] {
  return [...scores].sort((a, b) => {
    // Higher score first
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // Lower time first (faster is better)
    return a.time - b.time;
  });
}

/**
 * Creates the highscores slice for Zustand store
 */
export const createHighscoresSlice: StateCreator<
  AppStore,
  [],
  [],
  HighscoresSlice
> = (set, get) => ({
  highscores: {},

  addHighscore: (key: string, highscore: Highscore): boolean => {
    const state = get();
    const currentScores = state.highscores[key] || [];

    // Add new score and sort
    const updatedScores = sortHighscores([...currentScores, highscore]);

    // Keep only top MAX_HIGHSCORES
    const topScores = updatedScores.slice(0, MAX_HIGHSCORES);

    // Check if the new score made it to top 5
    const madeTopFive = topScores.some(
      (s) =>
        s.name === highscore.name &&
        s.score === highscore.score &&
        s.time === highscore.time &&
        s.date === highscore.date
    );

    // Update state
    set({
      highscores: {
        ...state.highscores,
        [key]: topScores,
      },
    });

    return madeTopFive;
  },

  getHighscores: (key: string): Highscore[] => {
    const state = get();
    return state.highscores[key] || [];
  },

  loadHighscores: () => {
    try {
      // Get all localStorage keys that start with 'highscores_'
      const highscores: HighscoresMap = {};

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('highscores_')) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              const parsed = JSON.parse(value);
              if (Array.isArray(parsed)) {
                highscores[key] = sortHighscores(parsed).slice(
                  0,
                  MAX_HIGHSCORES
                );
              }
            }
          } catch {
            // Skip corrupted entries
            console.warn(`Failed to parse highscore for key: ${key}`);
          }
        }
      }

      set({ highscores });
    } catch (error) {
      console.error('Failed to load highscores from localStorage:', error);
    }
  },
});
