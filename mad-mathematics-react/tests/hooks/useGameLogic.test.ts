/**
 * useGameLogic Hook Tests - Mad Mathematics
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGameLogic } from '../../src/hooks/useGameLogic';
import type { Difficulty, Question } from '../../src/types';

describe('useGameLogic', () => {
  const createDifficulty = (
    questionCount: number,
    numberRange: [number, number],
    timeLimit: number
  ): Difficulty => ({
    key: 'test',
    label: 'Test',
    questionCount,
    numberRange,
    timeLimit,
  });

  describe('generateQuestions - multiplication', () => {
    it('generates correct number of questions', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '×' })
      );

      const difficulty = createDifficulty(15, [1, 10], 60);
      const questions = result.current.generateQuestions(difficulty);

      expect(questions).toHaveLength(15);
    });

    it('generates questions with correct operation', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '×' })
      );

      const difficulty = createDifficulty(10, [2, 5], 60);
      const questions = result.current.generateQuestions(difficulty);

      questions.forEach((q) => {
        expect(q.operation).toBe('×');
      });
    });

    it('generates questions within number range', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '×' })
      );

      const difficulty = createDifficulty(20, [3, 7], 60);
      const questions = result.current.generateQuestions(difficulty);

      questions.forEach((q) => {
        expect(q.num1).toBeGreaterThanOrEqual(3);
        expect(q.num1).toBeLessThanOrEqual(7);
        expect(q.num2).toBeGreaterThanOrEqual(3);
        expect(q.num2).toBeLessThanOrEqual(7);
      });
    });

    it('calculates correct answer for multiplication', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '×' })
      );

      const difficulty = createDifficulty(10, [1, 10], 60);
      const questions = result.current.generateQuestions(difficulty);

      questions.forEach((q) => {
        expect(q.correctAnswer).toBe(q.num1 * q.num2);
      });
    });
  });

  describe('generateQuestions - addition', () => {
    it('generates questions with correct operation', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '+' })
      );

      const difficulty = createDifficulty(10, [1, 20], 60);
      const questions = result.current.generateQuestions(difficulty);

      questions.forEach((q) => {
        expect(q.operation).toBe('+');
        expect(q.correctAnswer).toBe(q.num1 + q.num2);
      });
    });
  });

  describe('generateQuestions - subtraction', () => {
    it('generates questions with correct operation', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '−' })
      );

      const difficulty = createDifficulty(10, [1, 20], 60);
      const questions = result.current.generateQuestions(difficulty);

      questions.forEach((q) => {
        expect(q.operation).toBe('−');
        expect(q.correctAnswer).toBe(q.num1 - q.num2);
      });
    });

    it('ensures num1 >= num2 (no negative results)', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '−' })
      );

      const difficulty = createDifficulty(50, [1, 100], 60);
      const questions = result.current.generateQuestions(difficulty);

      questions.forEach((q) => {
        expect(q.num1).toBeGreaterThanOrEqual(q.num2);
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('generateQuestions - division', () => {
    it('generates questions with correct operation', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '÷' })
      );

      const difficulty = createDifficulty(10, [1, 10], 60);
      const questions = result.current.generateQuestions(difficulty);

      questions.forEach((q) => {
        expect(q.operation).toBe('÷');
        expect(q.correctAnswer).toBe(q.num1 / q.num2);
      });
    });

    it('ensures whole number results (no decimals)', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '÷' })
      );

      const difficulty = createDifficulty(50, [1, 10], 60);
      const questions = result.current.generateQuestions(difficulty);

      questions.forEach((q) => {
        expect(Number.isInteger(q.correctAnswer)).toBe(true);
      });
    });

    it('never divides by zero', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '÷' })
      );

      const difficulty = createDifficulty(50, [0, 10], 60);
      const questions = result.current.generateQuestions(difficulty);

      questions.forEach((q) => {
        expect(q.num2).toBeGreaterThan(0);
      });
    });
  });

  describe('validateAnswer', () => {
    it('returns true for correct answer', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '×' })
      );

      const question: Question = {
        num1: 6,
        num2: 7,
        operation: '×',
        correctAnswer: 42,
      };

      expect(result.current.validateAnswer(question, 42)).toBe(true);
    });

    it('returns false for incorrect answer', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '×' })
      );

      const question: Question = {
        num1: 6,
        num2: 7,
        operation: '×',
        correctAnswer: 42,
      };

      expect(result.current.validateAnswer(question, 41)).toBe(false);
      expect(result.current.validateAnswer(question, 43)).toBe(false);
      expect(result.current.validateAnswer(question, 0)).toBe(false);
    });

    it('returns false for null answer (skipped)', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '×' })
      );

      const question: Question = {
        num1: 6,
        num2: 7,
        operation: '×',
        correctAnswer: 42,
      };

      expect(result.current.validateAnswer(question, null)).toBe(false);
    });
  });

  describe('calculateResult', () => {
    it('calculates multiplication correctly', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '×' })
      );

      expect(result.current.calculateResult(6, 7, '×')).toBe(42);
      expect(result.current.calculateResult(12, 12, '×')).toBe(144);
      expect(result.current.calculateResult(0, 5, '×')).toBe(0);
    });

    it('calculates addition correctly', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '+' })
      );

      expect(result.current.calculateResult(15, 27, '+')).toBe(42);
      expect(result.current.calculateResult(100, 200, '+')).toBe(300);
    });

    it('calculates subtraction correctly', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '−' })
      );

      expect(result.current.calculateResult(50, 8, '−')).toBe(42);
      expect(result.current.calculateResult(100, 100, '−')).toBe(0);
    });

    it('calculates division correctly', () => {
      const { result } = renderHook(() =>
        useGameLogic({ operation: '÷' })
      );

      expect(result.current.calculateResult(84, 2, '÷')).toBe(42);
      expect(result.current.calculateResult(100, 10, '÷')).toBe(10);
    });
  });

  describe('memoization', () => {
    it('returns stable function references', () => {
      const { result, rerender } = renderHook(() =>
        useGameLogic({ operation: '×' })
      );

      const initialGenerateQuestions = result.current.generateQuestions;
      const initialValidateAnswer = result.current.validateAnswer;
      const initialCalculateResult = result.current.calculateResult;

      rerender();

      expect(result.current.generateQuestions).toBe(initialGenerateQuestions);
      expect(result.current.validateAnswer).toBe(initialValidateAnswer);
      expect(result.current.calculateResult).toBe(initialCalculateResult);
    });

    it('updates generateQuestions when operation changes', () => {
      const { result, rerender } = renderHook(
        ({ operation }) => useGameLogic({ operation }),
        { initialProps: { operation: '×' as const } }
      );

      const initialGenerateQuestions = result.current.generateQuestions;

      rerender({ operation: '+' });

      expect(result.current.generateQuestions).not.toBe(initialGenerateQuestions);
    });
  });
});
