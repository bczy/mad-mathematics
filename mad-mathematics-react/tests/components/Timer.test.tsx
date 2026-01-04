/**
 * Timer Component Tests - Mad Mathematics
 * Tests for Timer component countdown and callbacks
 */

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { Timer } from '../../src/components/game/Timer';

describe('Timer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('display', () => {
    test('displays remaining time when timeLimit is set', () => {
      render(
        <Timer timeLimit={60} timeElapsed={0} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveTextContent('1m 0s');
    });

    test('displays elapsed time when timeLimit is 0 (unlimited)', () => {
      render(
        <Timer timeLimit={0} timeElapsed={30} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveTextContent('30s');
    });

    test('formats time with minutes correctly', () => {
      render(
        <Timer timeLimit={120} timeElapsed={0} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveTextContent('2m 0s');
    });

    test('shows remaining time calculation', () => {
      render(
        <Timer timeLimit={60} timeElapsed={45} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveTextContent('15s');
    });
  });

  describe('color states', () => {
    test('shows green color when plenty of time remaining', () => {
      render(
        <Timer timeLimit={60} timeElapsed={0} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveClass('text-green-400');
    });

    test('shows orange color when time is low', () => {
      render(
        <Timer timeLimit={60} timeElapsed={45} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveClass('text-orange-400');
    });

    test('shows red color with pulse when time is critical', () => {
      render(
        <Timer timeLimit={60} timeElapsed={55} isRunning={false} />
      );
      const timer = screen.getByRole('timer');
      expect(timer).toHaveClass('text-red-500');
      expect(timer).toHaveClass('animate-pulse');
    });

    test('shows white color for unlimited mode', () => {
      render(
        <Timer timeLimit={0} timeElapsed={30} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveClass('text-white');
    });
  });

  describe('callbacks', () => {
    test('calls onTick when running', async () => {
      const onTick = vi.fn();
      render(
        <Timer
          timeLimit={60}
          timeElapsed={0}
          isRunning={true}
          onTick={onTick}
        />
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onTick).toHaveBeenCalledWith(1, 59);
    });

    test('calls onTimeout when time expires', () => {
      const onTimeout = vi.fn();
      render(
        <Timer
          timeLimit={2}
          timeElapsed={1}
          isRunning={true}
          onTimeout={onTimeout}
        />
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(onTimeout).toHaveBeenCalledTimes(1);
    });

    test('does not call callbacks when not running', () => {
      const onTick = vi.fn();
      render(
        <Timer
          timeLimit={60}
          timeElapsed={0}
          isRunning={false}
          onTick={onTick}
        />
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(onTick).not.toHaveBeenCalled();
    });
  });

  describe('timer control', () => {
    test('stops ticking when isRunning becomes false', () => {
      const onTick = vi.fn();
      const { rerender } = render(
        <Timer
          timeLimit={60}
          timeElapsed={0}
          isRunning={true}
          onTick={onTick}
        />
      );

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(onTick).toHaveBeenCalledTimes(1);

      rerender(
        <Timer
          timeLimit={60}
          timeElapsed={1}
          isRunning={false}
          onTick={onTick}
        />
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(onTick).toHaveBeenCalledTimes(1); // No additional calls
    });
  });

  describe('accessibility', () => {
    test('has timer role', () => {
      render(
        <Timer timeLimit={60} timeElapsed={0} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toBeInTheDocument();
    });

    test('has aria-live for screen readers', () => {
      render(
        <Timer timeLimit={60} timeElapsed={0} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveAttribute('aria-live', 'polite');
    });

    test('has descriptive aria-label for countdown mode', () => {
      render(
        <Timer timeLimit={60} timeElapsed={0} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveAttribute(
        'aria-label',
        'Temps restant: 1m 0s'
      );
    });

    test('has descriptive aria-label for count-up mode', () => {
      render(
        <Timer timeLimit={0} timeElapsed={30} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveAttribute(
        'aria-label',
        'Temps écoulé: 30s'
      );
    });
  });

  describe('edge cases', () => {
    test('handles zero time limit (unlimited)', () => {
      render(
        <Timer timeLimit={0} timeElapsed={0} isRunning={false} />
      );
      expect(screen.getByRole('timer')).toHaveTextContent('0s');
    });

    test('handles time elapsed greater than limit', () => {
      render(
        <Timer timeLimit={60} timeElapsed={70} isRunning={false} />
      );
      // Should show 0 remaining, not negative
      expect(screen.getByRole('timer')).toHaveTextContent('0s');
    });
  });
});
