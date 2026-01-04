/**
 * Highscore Types - Mad Mathematics
 * Type definitions for highscore storage and display
 */

import type { DifficultyLevel, GameType } from './game';

/**
 * A single highscore entry
 */
export interface Highscore {
  /** Player name */
  name: string;
  /** Score achieved (correct answers or points) */
  score: number;
  /** Time taken in seconds */
  time: number;
  /** ISO date string when the score was achieved */
  date: string;
}

/**
 * Storage key format for highscores
 * Format: highscores_{gameType}_{difficultyId}
 */
export type HighscoreStorageKey = `highscores_${GameType}_${DifficultyLevel}`;

/**
 * Map of highscores by storage key
 */
export type HighscoresMap = Record<string, Highscore[]>;

/**
 * Maximum number of highscores to store per level
 */
export const MAX_HIGHSCORES = 5;

/**
 * Medal emojis for top 3 positions
 */
export const MEDALS = ['🥇', '🥈', '🥉'] as const;

/**
 * Creates a highscore storage key
 */
export function createHighscoreKey(
  gameType: GameType,
  difficultyId: DifficultyLevel
): string {
  return `highscores_${gameType}_${difficultyId}`;
}
