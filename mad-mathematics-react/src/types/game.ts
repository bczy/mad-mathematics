/**
 * Game Types - Mad Mathematics
 * Core type definitions for game logic, questions, and state management
 */

/**
 * Supported math operations
 */
export type Operation = '×' | '+' | '−' | '÷';

/**
 * Difficulty level identifiers
 */
export type DifficultyLevel =
  | 'apprenti'
  | 'sorcier'
  | 'archimage'
  | 'confirme'
  | 'grand'
  | 'super-multi';

/**
 * Difficulty configuration for a game
 */
export interface Difficulty {
  /** Unique identifier for the difficulty */
  id: DifficultyLevel;
  /** Display name in French */
  name: string;
  /** Star rating display (⭐, ⭐⭐, ⭐⭐⭐, etc.) */
  stars: string;
  /** Time limit in seconds (0 = unlimited) */
  timeLimit: number;
  /** Number range for operands [min, max] */
  numberRange: [number, number];
  /** Number of questions in the game */
  questionCount: number;
}

/**
 * Represents a single math question
 */
export interface Question {
  /** First operand */
  num1: number;
  /** Second operand */
  num2: number;
  /** Math operation */
  operation: Operation;
  /** Correct answer */
  correctAnswer: number;
}

/**
 * User's answer to a question
 */
export interface Answer {
  /** The question that was answered */
  question: Question;
  /** User's submitted answer (null if skipped) */
  userAnswer: number | null;
  /** Whether the answer was correct */
  isCorrect: boolean;
  /** Whether the question was skipped */
  skipped: boolean;
}

/**
 * Game state during play
 */
export type GameStatus = 'selection' | 'playing' | 'results';

/**
 * Complete game state
 */
export interface GameState {
  /** Current game phase */
  status: GameStatus;
  /** Selected difficulty level */
  difficulty: Difficulty | null;
  /** All questions for the current game */
  questions: Question[];
  /** Current question index (0-based) */
  currentQuestionIndex: number;
  /** All answers submitted so far */
  answers: Answer[];
  /** Current score (correct answers count) */
  score: number;
  /** Time elapsed in seconds */
  timeElapsed: number;
  /** Whether the timer has expired */
  timerExpired: boolean;
}

/**
 * Game type identifiers for routing and storage
 */
export type GameType = 'multiplication' | 'addition' | 'soustraction' | 'division';

/**
 * Default difficulty configurations per game type
 */
export const MULTIPLICATION_DIFFICULTIES: Difficulty[] = [
  {
    id: 'apprenti',
    name: 'Apprenti',
    stars: '⭐',
    timeLimit: 60,
    numberRange: [1, 5],
    questionCount: 15,
  },
  {
    id: 'sorcier',
    name: 'Sorcier',
    stars: '⭐⭐',
    timeLimit: 60,
    numberRange: [1, 10],
    questionCount: 15,
  },
  {
    id: 'archimage',
    name: 'Archimage',
    stars: '⭐⭐⭐',
    timeLimit: 60,
    numberRange: [1, 12],
    questionCount: 15,
  },
];

export const ADDITION_DIFFICULTIES: Difficulty[] = [
  {
    id: 'apprenti',
    name: 'Apprenti',
    stars: '⭐',
    timeLimit: 30,
    numberRange: [1, 10],
    questionCount: 20,
  },
  {
    id: 'confirme',
    name: 'Confirmé',
    stars: '⭐⭐',
    timeLimit: 10,
    numberRange: [1, 20],
    questionCount: 20,
  },
  {
    id: 'grand',
    name: 'Grand',
    stars: '⭐⭐⭐',
    timeLimit: 5,
    numberRange: [1, 50],
    questionCount: 20,
  },
  {
    id: 'super-multi',
    name: 'Super-Multi',
    stars: '⭐⭐⭐⭐',
    timeLimit: 0, // Unlimited
    numberRange: [1, 100],
    questionCount: 20,
  },
];

export const SOUSTRACTION_DIFFICULTIES: Difficulty[] = [
  {
    id: 'apprenti',
    name: 'Apprenti',
    stars: '⭐',
    timeLimit: 30,
    numberRange: [1, 10],
    questionCount: 20,
  },
  {
    id: 'confirme',
    name: 'Confirmé',
    stars: '⭐⭐',
    timeLimit: 10,
    numberRange: [1, 20],
    questionCount: 20,
  },
  {
    id: 'grand',
    name: 'Grand',
    stars: '⭐⭐⭐',
    timeLimit: 5,
    numberRange: [1, 50],
    questionCount: 20,
  },
  {
    id: 'super-multi',
    name: 'Super-Multi',
    stars: '⭐⭐⭐⭐',
    timeLimit: 0, // Unlimited
    numberRange: [1, 100],
    questionCount: 20,
  },
];

export const DIVISION_DIFFICULTIES: Difficulty[] = [
  {
    id: 'apprenti',
    name: 'Apprenti',
    stars: '⭐',
    timeLimit: 30,
    numberRange: [1, 5],
    questionCount: 20,
  },
  {
    id: 'confirme',
    name: 'Confirmé',
    stars: '⭐⭐',
    timeLimit: 10,
    numberRange: [1, 10],
    questionCount: 20,
  },
  {
    id: 'grand',
    name: 'Grand',
    stars: '⭐⭐⭐',
    timeLimit: 5,
    numberRange: [1, 12],
    questionCount: 20,
  },
  {
    id: 'super-multi',
    name: 'Super-Multi',
    stars: '⭐⭐⭐⭐',
    timeLimit: 0, // Unlimited
    numberRange: [1, 15],
    questionCount: 20,
  },
];
