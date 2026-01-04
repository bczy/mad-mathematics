/**
 * Game Slice Tests - Mad Mathematics
 * Unit tests for game state management during play
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { useStore } from '../../src/store';
import type { Difficulty, Question } from '../../src/types';

describe('gameSlice', () => {
  const mockDifficulty: Difficulty = {
    id: 'apprenti',
    name: 'Apprenti',
    stars: '⭐',
    timeLimit: 60,
    numberRange: [1, 5],
    questionCount: 15,
  };

  const mockQuestions: Question[] = [
    { num1: 2, num2: 3, operation: '×', correctAnswer: 6 },
    { num1: 4, num2: 5, operation: '×', correctAnswer: 20 },
    { num1: 3, num2: 3, operation: '×', correctAnswer: 9 },
  ];

  beforeEach(() => {
    // Reset store to initial state
    useStore.setState({
      status: 'selection',
      difficulty: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      timeElapsed: 0,
      timerExpired: false,
    });
  });

  describe('initial state', () => {
    test('initializes with selection status', () => {
      const state = useStore.getState();
      expect(state.status).toBe('selection');
    });

    test('initializes with null difficulty', () => {
      const state = useStore.getState();
      expect(state.difficulty).toBeNull();
    });

    test('initializes with empty questions', () => {
      const state = useStore.getState();
      expect(state.questions).toEqual([]);
    });

    test('initializes with zero score', () => {
      const state = useStore.getState();
      expect(state.score).toBe(0);
    });
  });

  describe('startGame', () => {
    test('sets status to playing', () => {
      const { startGame } = useStore.getState();

      startGame(mockDifficulty, mockQuestions);

      expect(useStore.getState().status).toBe('playing');
    });

    test('sets difficulty', () => {
      const { startGame } = useStore.getState();

      startGame(mockDifficulty, mockQuestions);

      expect(useStore.getState().difficulty).toEqual(mockDifficulty);
    });

    test('sets questions', () => {
      const { startGame } = useStore.getState();

      startGame(mockDifficulty, mockQuestions);

      expect(useStore.getState().questions).toEqual(mockQuestions);
    });

    test('resets currentQuestionIndex to 0', () => {
      const { startGame } = useStore.getState();

      // Simulate previous game state
      useStore.setState({ currentQuestionIndex: 5 });

      startGame(mockDifficulty, mockQuestions);

      expect(useStore.getState().currentQuestionIndex).toBe(0);
    });

    test('resets answers to empty', () => {
      const { startGame } = useStore.getState();

      startGame(mockDifficulty, mockQuestions);

      expect(useStore.getState().answers).toEqual([]);
    });

    test('resets score to 0', () => {
      const { startGame } = useStore.getState();

      // Simulate previous game state
      useStore.setState({ score: 10 });

      startGame(mockDifficulty, mockQuestions);

      expect(useStore.getState().score).toBe(0);
    });

    test('resets timer state', () => {
      const { startGame } = useStore.getState();

      // Simulate previous game state
      useStore.setState({ timeElapsed: 45, timerExpired: true });

      startGame(mockDifficulty, mockQuestions);

      expect(useStore.getState().timeElapsed).toBe(0);
      expect(useStore.getState().timerExpired).toBe(false);
    });
  });

  describe('submitAnswer', () => {
    beforeEach(() => {
      const { startGame } = useStore.getState();
      startGame(mockDifficulty, mockQuestions);
    });

    test('records correct answer', () => {
      const { submitAnswer } = useStore.getState();

      submitAnswer(6); // Correct answer for 2×3

      const state = useStore.getState();
      expect(state.answers).toHaveLength(1);
      expect(state.answers[0].isCorrect).toBe(true);
      expect(state.answers[0].userAnswer).toBe(6);
    });

    test('records incorrect answer', () => {
      const { submitAnswer } = useStore.getState();

      submitAnswer(7); // Wrong answer for 2×3

      const state = useStore.getState();
      expect(state.answers).toHaveLength(1);
      expect(state.answers[0].isCorrect).toBe(false);
      expect(state.answers[0].userAnswer).toBe(7);
    });

    test('increments score for correct answer', () => {
      const { submitAnswer } = useStore.getState();

      submitAnswer(6); // Correct

      expect(useStore.getState().score).toBe(1);
    });

    test('does not increment score for incorrect answer', () => {
      const { submitAnswer } = useStore.getState();

      submitAnswer(7); // Incorrect

      expect(useStore.getState().score).toBe(0);
    });

    test('advances to next question', () => {
      const { submitAnswer } = useStore.getState();

      submitAnswer(6);

      expect(useStore.getState().currentQuestionIndex).toBe(1);
    });

    test('records skipped answer', () => {
      const { submitAnswer } = useStore.getState();

      submitAnswer(null, true);

      const state = useStore.getState();
      expect(state.answers[0].skipped).toBe(true);
      expect(state.answers[0].isCorrect).toBe(false);
      expect(state.answers[0].userAnswer).toBeNull();
    });

    test('transitions to results after last question', () => {
      const { submitAnswer } = useStore.getState();

      submitAnswer(6); // Question 1
      submitAnswer(20); // Question 2
      submitAnswer(9); // Question 3 (last)

      expect(useStore.getState().status).toBe('results');
    });

    test('calculates final score correctly', () => {
      const { submitAnswer } = useStore.getState();

      submitAnswer(6); // Correct
      submitAnswer(999); // Wrong
      submitAnswer(9); // Correct

      expect(useStore.getState().score).toBe(2);
    });
  });

  describe('setTimeElapsed', () => {
    test('updates time elapsed', () => {
      const { setTimeElapsed } = useStore.getState();

      setTimeElapsed(30);

      expect(useStore.getState().timeElapsed).toBe(30);
    });

    test('can increment time', () => {
      const { setTimeElapsed } = useStore.getState();

      setTimeElapsed(10);
      setTimeElapsed(20);
      setTimeElapsed(30);

      expect(useStore.getState().timeElapsed).toBe(30);
    });
  });

  describe('setTimerExpired', () => {
    beforeEach(() => {
      const { startGame } = useStore.getState();
      startGame(mockDifficulty, mockQuestions);
    });

    test('sets timerExpired to true', () => {
      const { setTimerExpired } = useStore.getState();

      setTimerExpired();

      expect(useStore.getState().timerExpired).toBe(true);
    });

    test('transitions to results status', () => {
      const { setTimerExpired } = useStore.getState();

      setTimerExpired();

      expect(useStore.getState().status).toBe('results');
    });
  });

  describe('finishGame', () => {
    beforeEach(() => {
      const { startGame } = useStore.getState();
      startGame(mockDifficulty, mockQuestions);
    });

    test('sets status to results', () => {
      const { finishGame } = useStore.getState();

      finishGame();

      expect(useStore.getState().status).toBe('results');
    });
  });

  describe('resetGame', () => {
    beforeEach(() => {
      const { startGame, submitAnswer } = useStore.getState();
      startGame(mockDifficulty, mockQuestions);
      submitAnswer(6);
    });

    test('resets all game state', () => {
      const { resetGame } = useStore.getState();

      resetGame();

      const state = useStore.getState();
      expect(state.status).toBe('selection');
      expect(state.difficulty).toBeNull();
      expect(state.questions).toEqual([]);
      expect(state.currentQuestionIndex).toBe(0);
      expect(state.answers).toEqual([]);
      expect(state.score).toBe(0);
      expect(state.timeElapsed).toBe(0);
      expect(state.timerExpired).toBe(false);
    });
  });

  describe('edge cases', () => {
    test('handles null answer submission', () => {
      const { startGame, submitAnswer } = useStore.getState();
      startGame(mockDifficulty, mockQuestions);

      submitAnswer(null);

      const state = useStore.getState();
      expect(state.answers[0].userAnswer).toBeNull();
      expect(state.answers[0].isCorrect).toBe(false);
    });

    test('handles empty questions array', () => {
      const { startGame } = useStore.getState();

      startGame(mockDifficulty, []);

      const state = useStore.getState();
      expect(state.questions).toEqual([]);
    });

    test('submitAnswer does nothing when no current question', () => {
      const { startGame, submitAnswer } = useStore.getState();
      startGame(mockDifficulty, []);

      // Should not throw
      submitAnswer(5);

      expect(useStore.getState().answers).toEqual([]);
    });
  });
});
