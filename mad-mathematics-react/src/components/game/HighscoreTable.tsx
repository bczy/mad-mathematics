/**
 * HighscoreTable Component - Mad Mathematics
 * Displays top 5 highscores with medals and formatting
 */

import { useMemo } from 'react';
import { useStore } from '../../store';
import { MEDALS, MAX_HIGHSCORES } from '../../types/highscore';

export interface HighscoreTableProps {
  /** Storage key for the highscore list */
  storageKey: string;
  /** Whether to display as X/15 (normal) or X pts (super-multi) */
  isSuperMulti?: boolean;
  /** Maximum possible score for display (e.g., 15 for normal levels) */
  maxScore?: number;
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
 * Get medal or rank number
 */
function getRankDisplay(index: number): string {
  if (index < MEDALS.length) {
    return MEDALS[index];
  }
  return `${index + 1}.`;
}

/**
 * HighscoreTable component showing top scores
 */
export function HighscoreTable({
  storageKey,
  isSuperMulti = false,
  maxScore = 15,
  className = '',
}: HighscoreTableProps) {
  // Get the raw highscores map and select just the array we need
  const highscoresMap = useStore((state) => state.highscores);

  // Create display rows (always show 5 rows, with placeholders for empty slots)
  const displayRows = useMemo(() => {
    const highscores = highscoresMap[storageKey] || [];
    return Array.from({ length: MAX_HIGHSCORES }, (_, index) => {
      const score = highscores[index];
      return {
        rank: getRankDisplay(index),
        name: score?.name ?? '---',
        score: score?.score ?? null,
        time: score?.time ?? null,
        isEmpty: !score,
      };
    });
  }, [highscoresMap, storageKey]);

  return (
    <div className={`bg-purple-900/30 rounded-xl p-4 ${className}`} role="region" aria-label="Tableau des meilleurs scores">
      <h3 className="text-xl font-bold text-yellow-400 mb-4 text-center">
        🏆 Meilleurs scores
      </h3>

      {/* Headers */}
      <div className="grid grid-cols-3 gap-2 text-sm text-gray-400 border-b border-purple-500/30 pb-2 mb-2" role="row" aria-hidden="true">
        <div>Rang</div>
        <div>Nom</div>
        <div className="text-right">Score / Temps</div>
      </div>

      {/* Score rows */}
      <div className="space-y-2" role="list" aria-label="Liste des scores">
        {displayRows.map((row, index) => (
          <div
            key={index}
            role="listitem"
            aria-label={row.isEmpty ? `Rang ${index + 1}: Aucun score` : `Rang ${index + 1}: ${row.name}, ${isSuperMulti ? `${row.score} points` : `${row.score} sur ${maxScore}`}, ${formatTime(row.time!)}`}
            className={`grid grid-cols-3 gap-2 py-2 rounded-lg ${
              row.isEmpty
                ? 'text-gray-600'
                : 'text-white bg-purple-800/30'
            }`}
          >
            <div className="font-bold">{row.rank}</div>
            <div className="truncate">{row.name}</div>
            <div className="text-right">
              {row.isEmpty ? (
                <span className="text-gray-600">-</span>
              ) : (
                <>
                  <span className="text-yellow-400 font-bold">
                    {isSuperMulti
                      ? `${row.score} pts`
                      : `${row.score}/${maxScore}`}
                  </span>
                  <span className="text-gray-400 ml-2 text-sm">
                    ({formatTime(row.time!)})
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
