/**
 * Store Types - Mad Mathematics
 * Type definitions for Zustand store slices and state
 */

import type { Answer, Difficulty, GameStatus, Question } from './game';
import type { Highscore, HighscoresMap } from './highscore';

/**
 * Player slice state and actions
 */
export interface PlayerSlice {
  /** Current player name */
  playerName: string;
  /** Set the player name */
  setPlayerName: (name: string) => void;
}

/**
 * Highscores slice state and actions
 */
export interface HighscoresSlice {
  /** Map of all highscores by level key */
  highscores: HighscoresMap;
  /**
   * Add a new highscore
   * @returns true if the score made it to top 5, false otherwise
   */
  addHighscore: (key: string, highscore: Highscore) => boolean;
  /** Get highscores for a specific level */
  getHighscores: (key: string) => Highscore[];
  /** Load highscores from localStorage */
  loadHighscores: () => void;
}

/**
 * Game slice state and actions
 */
export interface GameSlice {
  /** Current game phase */
  status: GameStatus;
  /** Selected difficulty */
  difficulty: Difficulty | null;
  /** All questions for current game */
  questions: Question[];
  /** Current question index (0-based) */
  currentQuestionIndex: number;
  /** All answers submitted */
  answers: Answer[];
  /** Current score */
  score: number;
  /** Time elapsed in seconds */
  timeElapsed: number;
  /** Whether timer expired */
  timerExpired: boolean;

  /** Start a new game with given difficulty and questions */
  startGame: (difficulty: Difficulty, questions: Question[]) => void;
  /** Submit an answer for the current question */
  submitAnswer: (answer: number | null, skipped?: boolean) => void;
  /** Update elapsed time */
  setTimeElapsed: (time: number) => void;
  /** Mark timer as expired */
  setTimerExpired: () => void;
  /** Go to results screen */
  finishGame: () => void;
  /** Reset game state for new game */
  resetGame: () => void;
}

/**
 * Combined store type with all slices
 */
export interface AppStore extends PlayerSlice, HighscoresSlice, GameSlice {}

/**
 * Persisted state shape (saved to localStorage)
 */
export interface PersistedState {
  playerName: string;
  highscores: HighscoresMap;
}
