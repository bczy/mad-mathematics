/**
 * useGameTimer Hook - Mad Mathematics
 * Custom hook for managing game countdown timer
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseGameTimerOptions {
  /** Time limit in seconds (0 = unlimited / count-up mode) */
  timeLimit: number;
  /** Callback when time updates */
  onTick?: (elapsed: number, remaining: number) => void;
  /** Callback when timer expires */
  onTimeout?: () => void;
  /** Whether to start immediately */
  autoStart?: boolean;
}

export interface UseGameTimerReturn {
  /** Current elapsed time in seconds */
  timeElapsed: number;
  /** Remaining time in seconds (Infinity if unlimited) */
  timeRemaining: number;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Whether the timer has expired */
  hasExpired: boolean;
  /** Start the timer */
  start: () => void;
  /** Stop/pause the timer */
  stop: () => void;
  /** Reset the timer to initial state */
  reset: () => void;
}

/**
 * Hook for managing game timer with countdown/count-up functionality
 */
export function useGameTimer({
  timeLimit,
  onTick,
  onTimeout,
  autoStart = false,
}: UseGameTimerOptions): UseGameTimerReturn {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [hasExpired, setHasExpired] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTickRef = useRef(onTick);
  const onTimeoutRef = useRef(onTimeout);

  // Keep refs up to date
  useEffect(() => {
    onTickRef.current = onTick;
    onTimeoutRef.current = onTimeout;
  }, [onTick, onTimeout]);

  // Calculate remaining time
  const timeRemaining =
    timeLimit > 0 ? Math.max(0, timeLimit - timeElapsed) : Infinity;

  // Start timer
  const start = useCallback(() => {
    if (hasExpired) return;
    setIsRunning(true);
  }, [hasExpired]);

  // Stop timer
  const stop = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset timer
  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeElapsed(0);
    setHasExpired(false);
  }, []);

  // Timer tick effect
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeElapsed((prev) => {
        const newElapsed = prev + 1;
        const remaining = timeLimit > 0 ? timeLimit - newElapsed : Infinity;

        // Call onTick callback
        onTickRef.current?.(newElapsed, remaining);

        // Check for timeout
        if (timeLimit > 0 && newElapsed >= timeLimit) {
          setIsRunning(false);
          setHasExpired(true);
          onTimeoutRef.current?.();
        }

        return newElapsed;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, timeLimit]);

  return {
    timeElapsed,
    timeRemaining,
    isRunning,
    hasExpired,
    start,
    stop,
    reset,
  };
}
