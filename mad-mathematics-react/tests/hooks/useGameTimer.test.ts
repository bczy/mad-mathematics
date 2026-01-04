/**
 * useGameTimer Hook Tests - Mad Mathematics
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameTimer } from '../../src/hooks/useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initial state', () => {
    it('starts with zero elapsed time', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60 })
      );

      expect(result.current.timeElapsed).toBe(0);
    });

    it('starts not running by default', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60 })
      );

      expect(result.current.isRunning).toBe(false);
    });

    it('starts running when autoStart is true', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60, autoStart: true })
      );

      expect(result.current.isRunning).toBe(true);
    });

    it('calculates remaining time correctly', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60 })
      );

      expect(result.current.timeRemaining).toBe(60);
    });

    it('has not expired initially', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60 })
      );

      expect(result.current.hasExpired).toBe(false);
    });

    it('returns Infinity for unlimited time', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 0 })
      );

      expect(result.current.timeRemaining).toBe(Infinity);
    });
  });

  describe('start', () => {
    it('sets isRunning to true', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60 })
      );

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
    });

    it('does not start if already expired', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 1, autoStart: true })
      );

      // Let timer expire
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.hasExpired).toBe(true);

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(false);
    });
  });

  describe('stop', () => {
    it('sets isRunning to false', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60, autoStart: true })
      );

      expect(result.current.isRunning).toBe(true);

      act(() => {
        result.current.stop();
      });

      expect(result.current.isRunning).toBe(false);
    });

    it('preserves elapsed time when stopped', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      const elapsedBeforeStop = result.current.timeElapsed;

      act(() => {
        result.current.stop();
      });

      expect(result.current.timeElapsed).toBe(elapsedBeforeStop);
    });
  });

  describe('reset', () => {
    it('resets elapsed time to zero', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.timeElapsed).toBeGreaterThan(0);

      act(() => {
        result.current.reset();
      });

      expect(result.current.timeElapsed).toBe(0);
    });

    it('stops the timer', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60, autoStart: true })
      );

      act(() => {
        result.current.reset();
      });

      expect(result.current.isRunning).toBe(false);
    });

    it('clears expired state', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 1, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.hasExpired).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.hasExpired).toBe(false);
    });

    it('allows starting again after reset', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 1, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.hasExpired).toBe(true);

      // Reset first
      act(() => {
        result.current.reset();
      });

      expect(result.current.hasExpired).toBe(false);
      expect(result.current.isRunning).toBe(false);

      // Then start
      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
    });
  });

  describe('timer ticks', () => {
    it('increments elapsed time every second', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60, autoStart: true })
      );

      expect(result.current.timeElapsed).toBe(0);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeElapsed).toBe(1);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.timeElapsed).toBe(2);
    });

    it('decrements remaining time', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 10, autoStart: true })
      );

      expect(result.current.timeRemaining).toBe(10);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.timeRemaining).toBe(7);
    });

    it('does not tick when not running', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 60 })
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.timeElapsed).toBe(0);
    });
  });

  describe('onTick callback', () => {
    it('is called every second', () => {
      const onTick = vi.fn();

      renderHook(() =>
        useGameTimer({ timeLimit: 60, onTick, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onTick).toHaveBeenCalledTimes(1);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onTick).toHaveBeenCalledTimes(2);
    });

    it('receives elapsed and remaining time', () => {
      const onTick = vi.fn();

      renderHook(() =>
        useGameTimer({ timeLimit: 10, onTick, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onTick).toHaveBeenCalledWith(1, 9);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onTick).toHaveBeenCalledWith(2, 8);
    });
  });

  describe('timeout', () => {
    it('expires when time runs out', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 3, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.hasExpired).toBe(true);
      expect(result.current.isRunning).toBe(false);
    });

    it('calls onTimeout when time runs out', () => {
      const onTimeout = vi.fn();

      renderHook(() =>
        useGameTimer({ timeLimit: 2, onTimeout, autoStart: true })
      );

      expect(onTimeout).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(onTimeout).toHaveBeenCalledTimes(1);
    });

    it('does not expire with unlimited time', () => {
      const onTimeout = vi.fn();
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 0, onTimeout, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(60000);
      });

      expect(result.current.hasExpired).toBe(false);
      expect(onTimeout).not.toHaveBeenCalled();
    });

    it('remaining time does not go negative', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeLimit: 5, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.timeRemaining).toBe(0);
    });
  });

  describe('cleanup', () => {
    it('clears interval on unmount', () => {
      const { unmount } = renderHook(() =>
        useGameTimer({ timeLimit: 60, autoStart: true })
      );

      const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

      unmount();

      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
