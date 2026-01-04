/**
 * Highscores Slice Tests - Mad Mathematics
 * Unit tests for highscore state management with top 5 logic
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { useStore } from '../../src/store';
import type { Highscore } from '../../src/types';

describe('highscoresSlice', () => {
  beforeEach(() => {
    // Reset store to initial state
    useStore.setState({
      highscores: {},
    });
    localStorage.clear();
  });

  const createHighscore = (
    name: string,
    score: number,
    time: number
  ): Highscore => ({
    name,
    score,
    time,
    date: new Date().toISOString(),
  });

  describe('addHighscore', () => {
    test('adds first highscore to empty list', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const score = createHighscore('Alice', 15, 45);

      const result = addHighscore('highscores_multiplication_apprenti', score);

      expect(result).toBe(true);
      const scores = getHighscores('highscores_multiplication_apprenti');
      expect(scores).toHaveLength(1);
      expect(scores[0]).toMatchObject({
        name: 'Alice',
        score: 15,
        time: 45,
      });
    });

    test('maintains top 5 limit', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';

      // Add 6 scores
      for (let i = 1; i <= 6; i++) {
        addHighscore(key, createHighscore(`Player${i}`, i, 60));
      }

      const scores = getHighscores(key);
      expect(scores).toHaveLength(5);

      // Should have top 5 scores (6, 5, 4, 3, 2) - not 1
      const scoreValues = scores.map((s) => s.score);
      expect(scoreValues).toEqual([6, 5, 4, 3, 2]);
    });

    test('returns false when score does not make top 5', () => {
      const { addHighscore } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';

      // Fill with high scores
      for (let i = 10; i <= 14; i++) {
        addHighscore(key, createHighscore(`Player${i}`, i, 30));
      }

      // Try to add a low score
      const result = addHighscore(key, createHighscore('LowScorer', 5, 60));

      expect(result).toBe(false);
    });

    test('returns true when score makes top 5', () => {
      const { addHighscore } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';

      // Fill with medium scores
      for (let i = 5; i <= 9; i++) {
        addHighscore(key, createHighscore(`Player${i}`, i, 30));
      }

      // Add a high score that should make it
      const result = addHighscore(key, createHighscore('HighScorer', 15, 30));

      expect(result).toBe(true);
    });

    test('sorts by score descending', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';

      addHighscore(key, createHighscore('Low', 5, 30));
      addHighscore(key, createHighscore('High', 15, 30));
      addHighscore(key, createHighscore('Medium', 10, 30));

      const scores = getHighscores(key);

      expect(scores[0].name).toBe('High');
      expect(scores[1].name).toBe('Medium');
      expect(scores[2].name).toBe('Low');
    });

    test('sorts by time ascending when scores are equal', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';

      addHighscore(key, createHighscore('Slow', 10, 60));
      addHighscore(key, createHighscore('Fast', 10, 30));
      addHighscore(key, createHighscore('Medium', 10, 45));

      const scores = getHighscores(key);

      expect(scores[0].name).toBe('Fast');
      expect(scores[1].name).toBe('Medium');
      expect(scores[2].name).toBe('Slow');
    });

    test('handles multiple level keys independently', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const key1 = 'highscores_multiplication_apprenti';
      const key2 = 'highscores_addition_confirme';

      addHighscore(key1, createHighscore('Player1', 10, 30));
      addHighscore(key2, createHighscore('Player2', 15, 45));

      expect(getHighscores(key1)).toHaveLength(1);
      expect(getHighscores(key2)).toHaveLength(1);
      expect(getHighscores(key1)[0].name).toBe('Player1');
      expect(getHighscores(key2)[0].name).toBe('Player2');
    });
  });

  describe('getHighscores', () => {
    test('returns empty array for non-existent key', () => {
      const { getHighscores } = useStore.getState();

      const scores = getHighscores('nonexistent_key');

      expect(scores).toEqual([]);
    });

    test('returns correct scores for existing key', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';

      addHighscore(key, createHighscore('Test', 10, 30));

      const scores = getHighscores(key);

      expect(scores).toHaveLength(1);
      expect(scores[0].name).toBe('Test');
    });
  });

  describe('persistence', () => {
    test('saves highscores to localStorage on change', () => {
      const { addHighscore } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';

      addHighscore(key, createHighscore('PersistTest', 10, 30));

      const stored = localStorage.getItem(key);
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].name).toBe('PersistTest');
    });
  });

  describe('edge cases', () => {
    test('handles Unicode in player names', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';
      const unicodeName = '🎮 Élève 数学';

      addHighscore(key, createHighscore(unicodeName, 15, 45));

      const scores = getHighscores(key);
      expect(scores[0].name).toBe(unicodeName);
    });

    test('handles very long player names', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';
      const longName = 'A'.repeat(500);

      addHighscore(key, createHighscore(longName, 15, 45));

      const scores = getHighscores(key);
      expect(scores[0].name).toBe(longName);
    });

    test('handles zero score', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const key = 'highscores_multiplication_apprenti';

      addHighscore(key, createHighscore('ZeroScorer', 0, 60));

      const scores = getHighscores(key);
      expect(scores[0].score).toBe(0);
    });

    test('handles very high scores', () => {
      const { addHighscore, getHighscores } = useStore.getState();
      const key = 'highscores_super-multi_grand';

      addHighscore(key, createHighscore('HighScorer', 9999, 30));

      const scores = getHighscores(key);
      expect(scores[0].score).toBe(9999);
    });
  });
});
