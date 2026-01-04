/**
 * DifficultySelector Component - Mad Mathematics
 * Displays difficulty options with stars and descriptions
 */

import type { Difficulty } from '../../types';
import { Button } from '../common/Button';

export interface DifficultySelectorProps {
  /** Available difficulty levels */
  difficulties: Difficulty[];
  /** Callback when difficulty is selected */
  onSelect: (difficulty: Difficulty) => void;
  /** Currently selected difficulty (for highlighting) */
  selected?: Difficulty | null;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format time limit for display
 */
function formatTimeLimit(seconds: number): string {
  if (seconds === 0) return 'Illimité';
  if (seconds >= 60) return `${seconds / 60} min`;
  return `${seconds}s`;
}

/**
 * DifficultySelector component showing available difficulty levels
 */
export function DifficultySelector({
  difficulties,
  onSelect,
  selected,
  className = '',
}: DifficultySelectorProps) {
  return (
    <div className={`space-y-4 ${className}`} role="group" aria-labelledby="difficulty-title">
      <h2 id="difficulty-title" className="text-2xl font-bold text-white text-center mb-6">
        🎯 Choisis ton niveau
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-label="Niveaux de difficulté">
        {difficulties.map((difficulty) => {
          const isSelected = selected?.id === difficulty.id;

          return (
            <button
              key={difficulty.id}
              onClick={() => onSelect(difficulty)}
              className={`p-6 rounded-xl border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-yellow-400 bg-yellow-400/20 ring-2 ring-yellow-400'
                  : 'border-purple-500/50 bg-purple-900/30 hover:border-purple-400 hover:bg-purple-800/40'
              }`}
              aria-pressed={isSelected}
              aria-label={`${difficulty.name}: tables de ${difficulty.numberRange[0]} à ${difficulty.numberRange[1]}, ${formatTimeLimit(difficulty.timeLimit)}, ${difficulty.questionCount} questions`}
            >
              {/* Stars and name */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl" aria-hidden="true">{difficulty.stars}</span>
                <span className="text-xl font-bold text-white">
                  {difficulty.name}
                </span>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-400 space-y-1">
                <div>
                  📊 Tables de {difficulty.numberRange[0]} à{' '}
                  {difficulty.numberRange[1]}
                </div>
                <div>⏱️ {formatTimeLimit(difficulty.timeLimit)}</div>
                <div>❓ {difficulty.questionCount} questions</div>
              </div>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="mt-6 text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onSelect(selected)}
          >
            🚀 C'est parti !
          </Button>
        </div>
      )}
    </div>
  );
}
