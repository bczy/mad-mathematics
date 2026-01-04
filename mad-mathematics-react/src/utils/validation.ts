/**
 * Validation Utilities - Mad Mathematics
 * Zod schemas for runtime validation
 */

import { z } from 'zod';

/**
 * Schema for validating a single highscore entry
 */
export const HighscoreSchema = z.object({
  name: z.string().min(1).max(500),
  score: z.number().int().min(0),
  time: z.number().int().min(0),
  date: z.string().datetime().optional(),
});

/**
 * Schema for validating an array of highscores
 */
export const HighscoresArraySchema = z.array(HighscoreSchema);

/**
 * Schema for validating the highscores map from localStorage
 */
export const HighscoresMapSchema = z.record(z.string(), HighscoresArraySchema);

/**
 * Schema for player name
 */
export const PlayerNameSchema = z.string().min(0).max(500);

/**
 * Schema for persisted state from localStorage
 */
export const PersistedStateSchema = z.object({
  playerName: PlayerNameSchema.optional(),
  highscores: HighscoresMapSchema.optional(),
});

/**
 * Schema for difficulty level key
 */
export const DifficultyKeySchema = z.enum([
  'apprenti',
  'sorcier',
  'archimage',
  'facile',
  'moyen',
  'difficile',
  'super-multi',
]);

/**
 * Schema for operation symbols
 */
export const OperationSchema = z.enum(['×', '+', '−', '÷']);

/**
 * Schema for game status
 */
export const GameStatusSchema = z.enum(['idle', 'playing', 'finished']);

/**
 * Type inference from schemas
 */
export type ValidatedHighscore = z.infer<typeof HighscoreSchema>;
export type ValidatedHighscoresArray = z.infer<typeof HighscoresArraySchema>;
export type ValidatedHighscoresMap = z.infer<typeof HighscoresMapSchema>;
export type ValidatedPersistedState = z.infer<typeof PersistedStateSchema>;

/**
 * Safe parse functions that return default values on failure
 */

export function parseHighscores(data: unknown): ValidatedHighscoresArray {
  const result = HighscoresArraySchema.safeParse(data);
  return result.success ? result.data : [];
}

export function parseHighscoresMap(data: unknown): ValidatedHighscoresMap {
  const result = HighscoresMapSchema.safeParse(data);
  return result.success ? result.data : {};
}

export function parsePlayerName(data: unknown): string {
  const result = PlayerNameSchema.safeParse(data);
  return result.success ? result.data : '';
}

export function parsePersistedState(data: unknown): ValidatedPersistedState {
  const result = PersistedStateSchema.safeParse(data);
  return result.success ? result.data : {};
}

/**
 * Validate and sanitize user input for player name
 * Trims whitespace and limits length
 */
export function sanitizePlayerName(name: string): string {
  return name.trim().slice(0, 500);
}

/**
 * Validate a numeric answer input
 * Returns null if invalid
 */
export function parseAnswerInput(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed === '') return null;
  
  const num = parseInt(trimmed, 10);
  if (isNaN(num)) return null;
  
  return num;
}
