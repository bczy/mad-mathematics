/**
 * Main Store - Mad Mathematics
 * Zustand store combining all slices with localStorage persistence
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { AppStore } from '../types';
import {
  createPlayerSlice,
  createHighscoresSlice,
  createGameSlice,
} from './slices';
import {
  loadPersistedState,
  savePlayerName,
  saveHighscores,
} from './middleware';

/**
 * Main application store
 * Combines player, highscores, and game slices with localStorage persistence
 */
export const useStore = create<AppStore>()(
  subscribeWithSelector((...a) => {
    // Load persisted state
    const persistedState = loadPersistedState();

    // Create slices
    const playerSlice = createPlayerSlice(...a);
    const highscoresSlice = createHighscoresSlice(...a);
    const gameSlice = createGameSlice(...a);

    return {
      ...playerSlice,
      ...highscoresSlice,
      ...gameSlice,
      // Override with persisted values if they exist
      playerName: persistedState.playerName ?? playerSlice.playerName,
      highscores: persistedState.highscores ?? highscoresSlice.highscores,
    };
  })
);

// Subscribe to state changes for persistence
useStore.subscribe(
  (state) => state.playerName,
  (playerName) => {
    savePlayerName(playerName);
  }
);

useStore.subscribe(
  (state) => state.highscores,
  (highscores) => {
    saveHighscores(highscores);
  }
);

/**
 * Selector hooks for individual slices (for better React optimization)
 */

// Player selectors
export const usePlayerName = () => useStore((state) => state.playerName);
export const useSetPlayerName = () => useStore((state) => state.setPlayerName);

// Highscores selectors
export const useHighscores = (key: string) =>
  useStore((state) => state.getHighscores(key));
export const useAddHighscore = () => useStore((state) => state.addHighscore);

// Game selectors
export const useGameStatus = () => useStore((state) => state.status);
export const useGameDifficulty = () => useStore((state) => state.difficulty);
export const useGameQuestions = () => useStore((state) => state.questions);
export const useCurrentQuestionIndex = () =>
  useStore((state) => state.currentQuestionIndex);
export const useCurrentQuestion = () =>
  useStore((state) => state.questions[state.currentQuestionIndex]);
export const useGameAnswers = () => useStore((state) => state.answers);
export const useGameScore = () => useStore((state) => state.score);
export const useTimeElapsed = () => useStore((state) => state.timeElapsed);
export const useTimerExpired = () => useStore((state) => state.timerExpired);

// Game actions
export const useStartGame = () => useStore((state) => state.startGame);
export const useSubmitAnswer = () => useStore((state) => state.submitAnswer);
export const useSetTimeElapsed = () => useStore((state) => state.setTimeElapsed);
export const useSetTimerExpired = () => useStore((state) => state.setTimerExpired);
export const useFinishGame = () => useStore((state) => state.finishGame);
export const useResetGame = () => useStore((state) => state.resetGame);
