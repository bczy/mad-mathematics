/**
 * HighscoreTable Component Tests - Mad Mathematics
 * Tests for HighscoreTable with empty slots, medals, and formatting
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HighscoreTable } from '../../src/components/game/HighscoreTable';
import { useStore } from '../../src/store';

describe('HighscoreTable', () => {
  beforeEach(() => {
    // Reset store
    useStore.setState({
      highscores: {},
    });
    localStorage.clear();
  });

  describe('empty state', () => {
    test('displays 5 empty slots when no highscores', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      // Should have 5 rows with "---" for name
      const emptyNames = screen.getAllByText('---');
      expect(emptyNames).toHaveLength(5);
    });

    test('shows rank numbers for empty slots', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      // Should have rank displays (medals for 1-3, then 4., 5.)
      expect(screen.getByText('🥇')).toBeInTheDocument();
      expect(screen.getByText('🥈')).toBeInTheDocument();
      expect(screen.getByText('🥉')).toBeInTheDocument();
      expect(screen.getByText('4.')).toBeInTheDocument();
      expect(screen.getByText('5.')).toBeInTheDocument();
    });

    test('shows dashes for empty score slots', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      const dashes = screen.getAllByText('-');
      expect(dashes.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('with highscores', () => {
    beforeEach(() => {
      useStore.setState({
        highscores: {
          highscores_test_level: [
            { name: 'Alice', score: 15, time: 45, date: '2025-01-01' },
            { name: 'Bob', score: 14, time: 50, date: '2025-01-01' },
            { name: 'Charlie', score: 13, time: 55, date: '2025-01-01' },
          ],
        },
      });
    });

    test('displays player names', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
      expect(screen.getByText('Charlie')).toBeInTheDocument();
    });

    test('displays medals for top 3', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      expect(screen.getByText('🥇')).toBeInTheDocument();
      expect(screen.getByText('🥈')).toBeInTheDocument();
      expect(screen.getByText('🥉')).toBeInTheDocument();
    });

    test('displays scores with /maxScore format', () => {
      render(
        <HighscoreTable storageKey="highscores_test_level" maxScore={15} />
      );

      expect(screen.getByText('15/15')).toBeInTheDocument();
      expect(screen.getByText('14/15')).toBeInTheDocument();
      expect(screen.getByText('13/15')).toBeInTheDocument();
    });

    test('displays time in parentheses', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      expect(screen.getByText('(45s)')).toBeInTheDocument();
      expect(screen.getByText('(50s)')).toBeInTheDocument();
      expect(screen.getByText('(55s)')).toBeInTheDocument();
    });

    test('fills remaining slots with empty placeholders', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      // 3 filled + 2 empty = 5 total
      const emptyNames = screen.getAllByText('---');
      expect(emptyNames).toHaveLength(2);
    });
  });

  describe('super-multi format', () => {
    beforeEach(() => {
      useStore.setState({
        highscores: {
          'highscores_test_super-multi': [
            { name: 'Scorer', score: 250, time: 30, date: '2025-01-01' },
          ],
        },
      });
    });

    test('displays score as "X pts" for super-multi', () => {
      render(
        <HighscoreTable
          storageKey="highscores_test_super-multi"
          isSuperMulti={true}
        />
      );

      expect(screen.getByText('250 pts')).toBeInTheDocument();
    });
  });

  describe('time formatting', () => {
    beforeEach(() => {
      useStore.setState({
        highscores: {
          highscores_test_level: [
            { name: 'Fast', score: 15, time: 30, date: '2025-01-01' },
            { name: 'Slow', score: 14, time: 90, date: '2025-01-01' },
          ],
        },
      });
    });

    test('formats seconds correctly', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      expect(screen.getByText('(30s)')).toBeInTheDocument();
    });

    test('formats minutes and seconds correctly', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      expect(screen.getByText('(1m 30s)')).toBeInTheDocument();
    });
  });

  describe('header', () => {
    test('displays trophy header', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      expect(screen.getByText('🏆 Meilleurs scores')).toBeInTheDocument();
    });

    test('displays column headers', () => {
      render(<HighscoreTable storageKey="highscores_test_level" />);

      expect(screen.getByText('Rang')).toBeInTheDocument();
      expect(screen.getByText('Nom')).toBeInTheDocument();
      expect(screen.getByText('Score / Temps')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    test('handles Unicode names', () => {
      useStore.setState({
        highscores: {
          highscores_test_level: [
            { name: '🎮 Élève 数学', score: 15, time: 45, date: '2025-01-01' },
          ],
        },
      });

      render(<HighscoreTable storageKey="highscores_test_level" />);

      expect(screen.getByText('🎮 Élève 数学')).toBeInTheDocument();
    });

    test('handles very long names with truncation', () => {
      const longName = 'A'.repeat(100);
      useStore.setState({
        highscores: {
          highscores_test_level: [
            { name: longName, score: 15, time: 45, date: '2025-01-01' },
          ],
        },
      });

      render(<HighscoreTable storageKey="highscores_test_level" />);

      const nameElement = screen.getByText(longName);
      expect(nameElement).toHaveClass('truncate');
    });

    test('handles zero score', () => {
      useStore.setState({
        highscores: {
          highscores_test_level: [
            { name: 'Zero', score: 0, time: 60, date: '2025-01-01' },
          ],
        },
      });

      render(<HighscoreTable storageKey="highscores_test_level" />);

      expect(screen.getByText('0/15')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    test('applies custom className', () => {
      const { container } = render(
        <HighscoreTable
          storageKey="highscores_test_level"
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });
});
