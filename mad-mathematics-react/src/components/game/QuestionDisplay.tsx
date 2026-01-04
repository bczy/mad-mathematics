/**
 * QuestionDisplay Component - Mad Mathematics
 * Displays current question with number input field
 */

import {
  type FormEvent,
  type KeyboardEvent,
  useRef,
  useEffect,
  useState,
} from 'react';
import type { Question } from '../../types';

export interface QuestionDisplayProps {
  /** Current question to display */
  question: Question;
  /** Current question number (1-based) */
  questionNumber: number;
  /** Total number of questions */
  totalQuestions: number;
  /** Callback when answer is submitted */
  onSubmit: (answer: number | null) => void;
  /** Callback when question is skipped */
  onSkip?: () => void;
  /** Whether input should be disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * QuestionDisplay component for showing math problems
 */
export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  onSubmit,
  onSkip,
  disabled = false,
  className = '',
}: QuestionDisplayProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount and when question changes
  useEffect(() => {
    inputRef.current?.focus();
    setInputValue('');
  }, [question]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    const numValue = inputValue.trim() === '' ? null : parseInt(inputValue, 10);
    onSubmit(isNaN(numValue as number) ? null : numValue);
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && onSkip) {
      onSkip();
      setInputValue('');
    }
  };

  return (
    <div className={`text-center ${className}`} role="region" aria-label="Zone de question">
      {/* Question counter */}
      <div className="text-gray-400 mb-4" aria-live="polite">
        Question {questionNumber} / {totalQuestions}
      </div>

      {/* Question display - announced to screen readers */}
      <div 
        className="text-5xl md:text-6xl font-bold text-white mb-8"
        aria-live="assertive"
        aria-label={`${question.num1} ${question.operation} ${question.num2} égale ?`}
      >
        {question.num1} {question.operation} {question.num2} = ?
      </div>

      {/* Answer form */}
      <form onSubmit={handleSubmit} className="space-y-4" role="form" aria-label="Formulaire de réponse">
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ta réponse..."
          className="w-48 text-center text-3xl font-bold px-4 py-3 rounded-xl bg-white/10 border-2 border-purple-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-50"
          aria-label={`Réponse pour ${question.num1} ${question.operation} ${question.num2}`}
          aria-describedby="keyboard-hint"
          autoComplete="off"
          inputMode="numeric"
          pattern="-?[0-9]*"
        />

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            disabled={disabled || inputValue.trim() === ''}
            className="px-8 py-3 text-lg font-bold bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-400 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            aria-label="Valider la réponse"
          >
            Valider ✓
          </button>

          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={disabled}
              className="px-6 py-3 text-lg font-bold bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-500 hover:to-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              aria-label="Passer cette question"
            >
              Passer →
            </button>
          )}
        </div>
      </form>

      {/* Keyboard hint */}
      <p id="keyboard-hint" className="text-gray-500 text-sm mt-4">
        Appuie sur <kbd className="bg-gray-700 px-2 py-1 rounded">Entrée</kbd> pour valider
        {onSkip && (
          <>
            {' '}ou <kbd className="bg-gray-700 px-2 py-1 rounded">Échap</kbd> pour passer
          </>
        )}
      </p>
    </div>
  );
}
