/**
 * ResultsPanel Component - Mad Mathematics
 * Displays game results with score, corrections, and highscores
 */

import type { Answer, Difficulty, GameType } from '../../types';
import { createHighscoreKey } from '../../types/highscore';
import { Button } from '../common/Button';
import { HighscoreTable } from './HighscoreTable';

export interface ResultsPanelProps {
  /** Game type for highscore lookup */
  gameType: GameType;
  /** Selected difficulty */
  difficulty: Difficulty;
  /** Final score */
  score: number;
  /** Total questions */
  totalQuestions: number;
  /** Time taken in seconds */
  timeTaken: number;
  /** All answers for correction display */
  answers: Answer[];
  /** Whether the score made it to top 5 */
  madeHighscore: boolean;
  /** Player name */
  playerName: string;
  /** Callback to play again */
  onPlayAgain: () => void;
  /** Callback to change difficulty */
  onChangeDifficulty: () => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Format time for display
 */
function formatTime(seconds: number): string {
  if (seconds < 0) return '0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/**
 * Get score rating emoji
 */
function getScoreEmoji(ratio: number): string {
  if (ratio >= 1) return '🌟';
  if (ratio >= 0.8) return '🎉';
  if (ratio >= 0.6) return '👍';
  if (ratio >= 0.4) return '💪';
  return '📚';
}

/**
 * Get encouraging message based on score
 */
function getMessage(ratio: number, playerName: string): string {
  const name = playerName || 'Sorcier';
  if (ratio >= 1) return `Parfait, ${name} ! Tu es un vrai archimage ! ✨`;
  if (ratio >= 0.8) return `Excellent travail, ${name} ! 🎉`;
  if (ratio >= 0.6) return `Bien joué, ${name} ! Continue comme ça ! 👍`;
  if (ratio >= 0.4) return `Pas mal, ${name} ! Tu progresses ! 💪`;
  return `Continue à t'entraîner, ${name} ! Tu vas y arriver ! 📚`;
}

/**
 * ResultsPanel component for game completion screen
 */
export function ResultsPanel({
  gameType,
  difficulty,
  score,
  totalQuestions,
  timeTaken,
  answers,
  madeHighscore,
  playerName,
  onPlayAgain,
  onChangeDifficulty,
  className = '',
}: ResultsPanelProps) {
  const ratio = totalQuestions > 0 ? score / totalQuestions : 0;
  const isSuperMulti = difficulty.id === 'super-multi';
  const storageKey = createHighscoreKey(gameType, difficulty.id);

  return (
    <div className={`space-y-6 ${className}`} role="region" aria-label="Résultats du jeu">
      {/* Score header - announced to screen readers */}
      <div className="text-center" aria-live="polite" aria-atomic="true">
        <div className="text-6xl mb-4" aria-hidden="true">{getScoreEmoji(ratio)}</div>
        <h2 className="text-3xl font-bold text-white mb-2">
          {isSuperMulti ? `${score} points` : `${score} / ${totalQuestions}`}
        </h2>
        <p className="text-xl text-gray-300">{getMessage(ratio, playerName)}</p>
        <p className="text-gray-400 mt-2">⏱️ Temps: {formatTime(timeTaken)}</p>
        
        {madeHighscore && (
          <div className="mt-4 inline-block px-4 py-2 bg-yellow-400/20 border border-yellow-400 rounded-full text-yellow-400 font-bold animate-pulse">
            🏆 Nouveau record !
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-center gap-4">
        <Button variant="primary" size="lg" onClick={onPlayAgain}>
          🔄 Rejouer
        </Button>
        <Button variant="secondary" size="lg" onClick={onChangeDifficulty}>
          🎯 Changer de niveau
        </Button>
      </div>

      {/* Highscore table */}
      <HighscoreTable
        storageKey={storageKey}
        isSuperMulti={isSuperMulti}
        maxScore={totalQuestions}
      />

      {/* Corrections */}
      <div className="bg-purple-900/30 rounded-xl p-4">
        <h3 className="text-xl font-bold text-white mb-4">📝 Corrections</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {answers.map((answer, index) => {
            const { question, userAnswer, isCorrect, skipped } = answer;
            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isCorrect
                    ? 'bg-green-500/20 border border-green-500/40'
                    : 'bg-red-500/20 border border-red-500/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {isCorrect ? '✅' : '❌'}
                  </span>
                  <span className="text-white font-medium">
                    {question.num1} {question.operation} {question.num2}
                  </span>
                </div>
                <div className="text-right">
                  {skipped ? (
                    <span className="text-gray-400">Passé</span>
                  ) : (
                    <>
                      <span
                        className={
                          isCorrect ? 'text-green-400' : 'text-red-400'
                        }
                      >
                        Ta réponse: {userAnswer ?? '-'}
                      </span>
                      {!isCorrect && (
                        <span className="text-white ml-2">
                          (Réponse: {question.correctAnswer})
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
