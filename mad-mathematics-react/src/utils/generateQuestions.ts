/**
 * generateQuestions Utility - Mad Mathematics
 * Question generation logic for different operations
 */

import type { Difficulty, Operation, Question } from '../types';

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate the result of a math operation
 */
export function calculate(num1: number, num2: number, operation: Operation): number {
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
export function generateQuestion(
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

    case '÷': {
      // Generate divisible pairs (num2 * quotient = num1)
      num2 = randomInt(Math.max(1, minNum), maxNum); // Avoid division by zero
      const quotient = randomInt(minNum, maxNum);
      num1 = num2 * quotient;
      break;
    }

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
 * Generate a set of questions for a game
 */
export function generateQuestions(
  operation: Operation,
  difficulty: Difficulty
): Question[] {
  const questions: Question[] = [];
  const [minNum, maxNum] = difficulty.numberRange;

  for (let i = 0; i < difficulty.questionCount; i++) {
    questions.push(generateQuestion(operation, minNum, maxNum));
  }

  return questions;
}

/**
 * Check if two questions are the same
 */
export function isSameQuestion(q1: Question, q2: Question): boolean {
  return (
    q1.num1 === q2.num1 &&
    q1.num2 === q2.num2 &&
    q1.operation === q2.operation
  );
}

/**
 * Generate a unique set of questions (no duplicates)
 * Falls back to duplicates if range is too small
 */
export function generateUniqueQuestions(
  operation: Operation,
  difficulty: Difficulty,
  maxAttempts: number = 100
): Question[] {
  const questions: Question[] = [];
  const [minNum, maxNum] = difficulty.numberRange;
  let attempts = 0;

  while (questions.length < difficulty.questionCount && attempts < maxAttempts) {
    const newQuestion = generateQuestion(operation, minNum, maxNum);
    
    // Check if question already exists
    const isDuplicate = questions.some((q) => isSameQuestion(q, newQuestion));
    
    if (!isDuplicate) {
      questions.push(newQuestion);
    }
    
    attempts++;
  }

  // If we couldn't generate enough unique questions, fill with duplicates
  while (questions.length < difficulty.questionCount) {
    questions.push(generateQuestion(operation, minNum, maxNum));
  }

  return questions;
}
