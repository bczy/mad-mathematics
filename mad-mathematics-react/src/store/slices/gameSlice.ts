/**
 * Game Slice - Mad Mathematics
 * Zustand slice for game state management during play
 */

import type { StateCreator } from 'zustand';
import type { Difficulty, Question, Answer, AppStore, GameSlice } from '../../types';

/**
 * Initial game state
 */
const initialGameState = {
  status: 'selection' as const,
  difficulty: null as Difficulty | null,
  questions: [] as Question[],
  currentQuestionIndex: 0,
  answers: [] as Answer[],
  score: 0,
  timeElapsed: 0,
  timerExpired: false,
};

/**
 * Creates the game slice for Zustand store
 */
export const createGameSlice: StateCreator<AppStore, [], [], GameSlice> = (
  set,
  get
) => ({
  ...initialGameState,

  startGame: (difficulty: Difficulty, questions: Question[]) => {
    set({
      status: 'playing',
      difficulty,
      questions,
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      timeElapsed: 0,
      timerExpired: false,
    });
  },

  submitAnswer: (answer: number | null, skipped = false) => {
    const state = get();
    const currentQuestion = state.questions[state.currentQuestionIndex];

    if (!currentQuestion) return;

    const isCorrect =
      !skipped && answer !== null && answer === currentQuestion.correctAnswer;

    const newAnswer: Answer = {
      question: currentQuestion,
      userAnswer: answer,
      isCorrect,
      skipped,
    };

    const newAnswers = [...state.answers, newAnswer];
    const newScore = state.score + (isCorrect ? 1 : 0);
    const newIndex = state.currentQuestionIndex + 1;

    // Check if game is finished
    const isLastQuestion = newIndex >= state.questions.length;

    set({
      answers: newAnswers,
      score: newScore,
      currentQuestionIndex: newIndex,
      status: isLastQuestion ? 'results' : 'playing',
    });
  },

  setTimeElapsed: (time: number) => {
    set({ timeElapsed: time });
  },

  setTimerExpired: () => {
    set({
      timerExpired: true,
      status: 'results',
    });
  },

  finishGame: () => {
    set({ status: 'results' });
  },

  resetGame: () => {
    set(initialGameState);
  },
});
