/**
 * generateQuestions Utility Tests - Mad Mathematics
 */

import { describe, it, expect } from 'vitest';
import {
  randomInt,
  calculate,
  generateQuestion,
  generateQuestions,
  generateUniqueQuestions,
  isSameQuestion,
} from '../../src/utils/generateQuestions';
import type { Difficulty, Question, Operation } from '../../src/types';

describe('randomInt', () => {
  it('generates numbers within range', () => {
    for (let i = 0; i < 100; i++) {
      const result = randomInt(5, 10);
      expect(result).toBeGreaterThanOrEqual(5);
      expect(result).toBeLessThanOrEqual(10);
    }
  });

  it('can return min value', () => {
    // With enough iterations, we should hit min at least once
    const results = Array.from({ length: 100 }, () => randomInt(1, 3));
    expect(results).toContain(1);
  });

  it('can return max value', () => {
    const results = Array.from({ length: 100 }, () => randomInt(1, 3));
    expect(results).toContain(3);
  });

  it('returns same value when min equals max', () => {
    expect(randomInt(5, 5)).toBe(5);
  });
});

describe('calculate', () => {
  describe('multiplication', () => {
    it('multiplies correctly', () => {
      expect(calculate(6, 7, '×')).toBe(42);
      expect(calculate(12, 12, '×')).toBe(144);
      expect(calculate(0, 5, '×')).toBe(0);
    });
  });

  describe('addition', () => {
    it('adds correctly', () => {
      expect(calculate(15, 27, '+')).toBe(42);
      expect(calculate(0, 0, '+')).toBe(0);
      expect(calculate(100, 200, '+')).toBe(300);
    });
  });

  describe('subtraction', () => {
    it('subtracts correctly', () => {
      expect(calculate(50, 8, '−')).toBe(42);
      expect(calculate(100, 100, '−')).toBe(0);
    });
  });

  describe('division', () => {
    it('divides correctly', () => {
      expect(calculate(84, 2, '÷')).toBe(42);
      expect(calculate(100, 10, '÷')).toBe(10);
    });
  });

  describe('error handling', () => {
    it('throws for unknown operation', () => {
      expect(() => calculate(5, 5, '%' as unknown as Operation)).toThrow('Unknown operation');
    });
  });
});

describe('generateQuestion', () => {
  describe('multiplication', () => {
    it('generates question with correct operation', () => {
      const q = generateQuestion('×', 1, 10);
      expect(q.operation).toBe('×');
    });

    it('generates numbers within range', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateQuestion('×', 3, 7);
        expect(q.num1).toBeGreaterThanOrEqual(3);
        expect(q.num1).toBeLessThanOrEqual(7);
        expect(q.num2).toBeGreaterThanOrEqual(3);
        expect(q.num2).toBeLessThanOrEqual(7);
      }
    });

    it('calculates correct answer', () => {
      for (let i = 0; i < 20; i++) {
        const q = generateQuestion('×', 1, 10);
        expect(q.correctAnswer).toBe(q.num1 * q.num2);
      }
    });
  });

  describe('addition', () => {
    it('generates question with correct answer', () => {
      for (let i = 0; i < 20; i++) {
        const q = generateQuestion('+', 1, 20);
        expect(q.operation).toBe('+');
        expect(q.correctAnswer).toBe(q.num1 + q.num2);
      }
    });
  });

  describe('subtraction', () => {
    it('ensures num1 >= num2 (no negative results)', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateQuestion('−', 1, 100);
        expect(q.num1).toBeGreaterThanOrEqual(q.num2);
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      }
    });

    it('calculates correct answer', () => {
      for (let i = 0; i < 20; i++) {
        const q = generateQuestion('−', 1, 50);
        expect(q.correctAnswer).toBe(q.num1 - q.num2);
      }
    });
  });

  describe('division', () => {
    it('ensures whole number results', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateQuestion('÷', 1, 10);
        expect(Number.isInteger(q.correctAnswer)).toBe(true);
      }
    });

    it('never divides by zero', () => {
      for (let i = 0; i < 50; i++) {
        const q = generateQuestion('÷', 0, 10);
        expect(q.num2).toBeGreaterThan(0);
      }
    });

    it('calculates correct answer', () => {
      for (let i = 0; i < 20; i++) {
        const q = generateQuestion('÷', 1, 10);
        expect(q.correctAnswer).toBe(q.num1 / q.num2);
      }
    });
  });
});

describe('generateQuestions', () => {
  const createDifficulty = (
    questionCount: number,
    numberRange: [number, number]
  ): Difficulty => ({
    key: 'test',
    label: 'Test',
    questionCount,
    numberRange,
    timeLimit: 60,
  });

  it('generates correct number of questions', () => {
    const difficulty = createDifficulty(15, [1, 10]);
    const questions = generateQuestions('×', difficulty);
    expect(questions).toHaveLength(15);
  });

  it('generates 20 questions', () => {
    const difficulty = createDifficulty(20, [1, 20]);
    const questions = generateQuestions('+', difficulty);
    expect(questions).toHaveLength(20);
  });

  it('all questions have correct operation', () => {
    const difficulty = createDifficulty(10, [1, 10]);
    const questions = generateQuestions('−', difficulty);
    questions.forEach((q) => {
      expect(q.operation).toBe('−');
    });
  });
});

describe('isSameQuestion', () => {
  it('returns true for identical questions', () => {
    const q1: Question = { num1: 5, num2: 3, operation: '×', correctAnswer: 15 };
    const q2: Question = { num1: 5, num2: 3, operation: '×', correctAnswer: 15 };
    expect(isSameQuestion(q1, q2)).toBe(true);
  });

  it('returns false for different num1', () => {
    const q1: Question = { num1: 5, num2: 3, operation: '×', correctAnswer: 15 };
    const q2: Question = { num1: 6, num2: 3, operation: '×', correctAnswer: 18 };
    expect(isSameQuestion(q1, q2)).toBe(false);
  });

  it('returns false for different num2', () => {
    const q1: Question = { num1: 5, num2: 3, operation: '×', correctAnswer: 15 };
    const q2: Question = { num1: 5, num2: 4, operation: '×', correctAnswer: 20 };
    expect(isSameQuestion(q1, q2)).toBe(false);
  });

  it('returns false for different operation', () => {
    const q1: Question = { num1: 5, num2: 3, operation: '×', correctAnswer: 15 };
    const q2: Question = { num1: 5, num2: 3, operation: '+', correctAnswer: 8 };
    expect(isSameQuestion(q1, q2)).toBe(false);
  });
});

describe('generateUniqueQuestions', () => {
  const createDifficulty = (
    questionCount: number,
    numberRange: [number, number]
  ): Difficulty => ({
    key: 'test',
    label: 'Test',
    questionCount,
    numberRange,
    timeLimit: 60,
  });

  it('generates correct number of questions', () => {
    const difficulty = createDifficulty(10, [1, 10]);
    const questions = generateUniqueQuestions('×', difficulty);
    expect(questions).toHaveLength(10);
  });

  it('generates mostly unique questions when range allows', () => {
    const difficulty = createDifficulty(5, [1, 10]);
    const questions = generateUniqueQuestions('×', difficulty);
    
    // Check for uniqueness
    const seen = new Set<string>();
    let uniqueCount = 0;
    questions.forEach((q) => {
      const key = `${q.num1}-${q.num2}-${q.operation}`;
      if (!seen.has(key)) {
        uniqueCount++;
        seen.add(key);
      }
    });
    
    // Should be mostly unique (at least 4 out of 5)
    expect(uniqueCount).toBeGreaterThanOrEqual(4);
  });

  it('fills with duplicates when range is too small', () => {
    // Very small range that can only produce 1 unique question
    const difficulty = createDifficulty(5, [1, 1]);
    const questions = generateUniqueQuestions('×', difficulty);
    expect(questions).toHaveLength(5);
  });
});
