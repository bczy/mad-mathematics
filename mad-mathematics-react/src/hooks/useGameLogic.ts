/**
 * useGameLogic Hook - Mad Mathematics
 * Custom hook for generating questions and validating answers
 */

import { useCallback, useMemo } from 'react';
import type { Difficulty, Operation, Question } from '../types';

export interface UseGameLogicOptions {
  /** The math operation for this game */
  operation: Operation;
}

export interface UseGameLogicReturn {
  /** Generate questions for a difficulty level */
  generateQuestions: (difficulty: Difficulty) => Question[];
  /** Validate if an answer is correct */
  validateAnswer: (question: Question, answer: number | null) => boolean;
  /** Calculate result for a question (for display) */
  calculateResult: (num1: number, num2: number, operation: Operation) => number;
}

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate the result of an operation
 */
function calculate(num1: number, num2: number, operation: Operation): number {
  switch (operation) {
    case '×':
      return num1 * num2;
    case '+':
      return num1 + num2;
    case '−':
      return num1 - num2;
    case '÷':
      return num1 / num2;
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

/**
 * Generate a single question for the given operation and range
 */
function generateQuestion(
  operation: Operation,
  minNum: number,
  maxNum: number
): Question {
  let num1: number;
  let num2: number;

  switch (operation) {
    case '×':
    case '+':
      // Simple random generation
      num1 = randomInt(minNum, maxNum);
      num2 = randomInt(minNum, maxNum);
      break;

    case '−':
      // Ensure num1 >= num2 to avoid negative results
      num1 = randomInt(minNum, maxNum);
      num2 = randomInt(minNum, num1);
      break;

    case '÷':
      // Generate divisible pairs (num2 * quotient = num1)
      num2 = randomInt(Math.max(1, minNum), maxNum); // Avoid division by zero
      const quotient = randomInt(minNum, maxNum);
      num1 = num2 * quotient;
      break;

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  return {
    num1,
    num2,
    operation,
    correctAnswer: calculate(num1, num2, operation),
  };
}

/**
 * Hook for game logic: question generation and answer validation
 */
export function useGameLogic({
  operation,
}: UseGameLogicOptions): UseGameLogicReturn {
  /**
   * Generate a set of questions for the given difficulty
   */
  const generateQuestions = useCallback(
    (difficulty: Difficulty): Question[] => {
      const questions: Question[] = [];
      const [minNum, maxNum] = difficulty.numberRange;

      for (let i = 0; i < difficulty.questionCount; i++) {
        questions.push(generateQuestion(operation, minNum, maxNum));
      }

      return questions;
    },
    [operation]
  );

  /**
   * Check if an answer is correct
   */
  const validateAnswer = useCallback(
    (question: Question, answer: number | null): boolean => {
      if (answer === null) return false;
      return answer === question.correctAnswer;
    },
    []
  );

  /**
   * Calculate result for display purposes
   */
  const calculateResult = useCallback(
    (num1: number, num2: number, op: Operation): number => {
      return calculate(num1, num2, op);
    },
    []
  );

  return useMemo(
    () => ({
      generateQuestions,
      validateAnswer,
      calculateResult,
    }),
    [generateQuestions, validateAnswer, calculateResult]
  );
}
