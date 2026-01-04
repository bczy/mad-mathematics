/**
 * Timer Component - Mad Mathematics
 * Displays countdown timer with visual states
 */

import { useEffect, useRef } from 'react';

export interface TimerProps {
  /** Time limit in seconds (0 = unlimited) */
  timeLimit: number;
  /** Current elapsed time in seconds */
  timeElapsed: number;
  /** Callback when time updates */
  onTick?: (elapsed: number, remaining: number) => void;
  /** Callback when timer expires */
  onTimeout?: () => void;
  /** Whether timer is running */
  isRunning: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get color class based on remaining time
 */
function getTimerColor(remaining: number, total: number): string {
  if (total === 0) return 'text-white'; // Unlimited mode
  const ratio = remaining / total;
  if (ratio <= 0.17) return 'text-red-500 animate-pulse'; // < 10s on 60s timer
  if (ratio <= 0.33) return 'text-orange-400'; // < 20s on 60s timer
  return 'text-green-400';
}

/**
 * Format seconds to display string
 */
function formatTime(seconds: number): string {
  if (seconds < 0) return '0s';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

/**
 * Timer component with countdown display
 */
export function Timer({
  timeLimit,
  timeElapsed,
  onTick,
  onTimeout,
  isRunning,
  className = '',
}: TimerProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTickRef = useRef(onTick);
  const onTimeoutRef = useRef(onTimeout);

  // Keep refs up to date
  useEffect(() => {
    onTickRef.current = onTick;
    onTimeoutRef.current = onTimeout;
  }, [onTick, onTimeout]);

  // Handle timer ticking
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      const newElapsed = timeElapsed + 1;
      const remaining = timeLimit > 0 ? timeLimit - newElapsed : Infinity;

      onTickRef.current?.(newElapsed, remaining);

      if (timeLimit > 0 && newElapsed >= timeLimit) {
        onTimeoutRef.current?.();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeElapsed, timeLimit]);

  // Calculate display values
  const remaining = timeLimit > 0 ? Math.max(0, timeLimit - timeElapsed) : timeElapsed;
  const displayValue = timeLimit > 0 ? remaining : timeElapsed;
  const colorClass = getTimerColor(remaining, timeLimit);

  return (
    <div
      className={`text-3xl font-bold ${colorClass} ${className}`}
      role="timer"
      aria-live="polite"
      aria-label={
        timeLimit > 0
          ? `Temps restant: ${formatTime(remaining)}`
          : `Temps écoulé: ${formatTime(timeElapsed)}`
      }
    >
      {timeLimit > 0 ? '⏱️ ' : '⏱️ '}
      {formatTime(displayValue)}
    </div>
  );
}
