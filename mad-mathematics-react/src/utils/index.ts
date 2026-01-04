/**
 * Utils Index - Mad Mathematics
 * Re-export all utility functions
 */

export { formatTime, formatTimeDigital } from './formatTime';
export {
  randomInt,
  calculate,
  generateQuestion,
  generateQuestions,
  generateUniqueQuestions,
  isSameQuestion,
} from './generateQuestions';
export {
  HighscoreSchema,
  HighscoresArraySchema,
  HighscoresMapSchema,
  PlayerNameSchema,
  PersistedStateSchema,
  DifficultyKeySchema,
  OperationSchema,
  GameStatusSchema,
  parseHighscores,
  parseHighscoresMap,
  parsePlayerName,
  parsePersistedState,
  sanitizePlayerName,
  parseAnswerInput,
  type ValidatedHighscore,
  type ValidatedHighscoresArray,
  type ValidatedHighscoresMap,
  type ValidatedPersistedState,
} from './validation';
