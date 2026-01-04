/**
 * localStorage Middleware Tests - Mad Mathematics
 * Unit tests for localStorage persistence
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { useStore } from '../../src/store';
import {
  loadPersistedState,
  savePlayerName,
  saveHighscores,
} from '../../src/store/middleware';

describe('localStorage middleware', () => {
  beforeEach(() => {
    localStorage.clear();
    useStore.setState({
      playerName: '',
      highscores: {},
    });
  });

  describe('loadPersistedState', () => {
    test('returns empty object when localStorage is empty', () => {
      const state = loadPersistedState();

      expect(state).toEqual({ highscores: {} });
    });

    test('loads player name from localStorage', () => {
      localStorage.setItem('playerName', 'StoredPlayer');

      const state = loadPersistedState();

      expect(state.playerName).toBe('StoredPlayer');
    });

    test('loads highscores from localStorage', () => {
      const scores = [{ name: 'Test', score: 10, time: 30, date: '2025-01-01' }];
      localStorage.setItem(
        'highscores_multiplication_apprenti',
        JSON.stringify(scores)
      );

      const state = loadPersistedState();

      expect(state.highscores).toBeDefined();
      expect(state.highscores!['highscores_multiplication_apprenti']).toEqual(
        scores
      );
    });

    test('handles corrupted highscore data gracefully', () => {
      localStorage.setItem('highscores_test', 'INVALID_JSON{');

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const state = loadPersistedState();

      expect(state.highscores).toEqual({});
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test('loads multiple highscore keys', () => {
      const scores1 = [{ name: 'P1', score: 10, time: 30, date: '2025-01-01' }];
      const scores2 = [{ name: 'P2', score: 15, time: 45, date: '2025-01-01' }];

      localStorage.setItem('highscores_level1', JSON.stringify(scores1));
      localStorage.setItem('highscores_level2', JSON.stringify(scores2));

      const state = loadPersistedState();

      expect(Object.keys(state.highscores!)).toHaveLength(2);
    });
  });

  describe('savePlayerName', () => {
    test('saves name to localStorage', () => {
      savePlayerName('TestPlayer');

      expect(localStorage.getItem('playerName')).toBe('TestPlayer');
    });

    test('removes key when name is empty', () => {
      localStorage.setItem('playerName', 'OldName');

      savePlayerName('');

      expect(localStorage.getItem('playerName')).toBeNull();
    });

    test('overwrites existing name', () => {
      savePlayerName('First');
      savePlayerName('Second');

      expect(localStorage.getItem('playerName')).toBe('Second');
    });

    test('handles localStorage error gracefully', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Quota exceeded');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Should not throw
      savePlayerName('Test');

      expect(consoleSpy).toHaveBeenCalled();

      spy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('saveHighscores', () => {
    test('saves highscores to localStorage', () => {
      const scores = { 'highscores_test': [{ name: 'P1', score: 10, time: 30, date: '2025-01-01' }] };

      saveHighscores(scores);

      const stored = localStorage.getItem('highscores_test');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual(scores['highscores_test']);
    });

    test('removes key when scores array is empty', () => {
      localStorage.setItem('highscores_test', JSON.stringify([{ name: 'P1', score: 10, time: 30, date: '2025-01-01' }]));

      saveHighscores({ 'highscores_test': [] });

      expect(localStorage.getItem('highscores_test')).toBeNull();
    });

    test('saves multiple keys', () => {
      const scores = {
        'highscores_level1': [{ name: 'P1', score: 10, time: 30, date: '2025-01-01' }],
        'highscores_level2': [{ name: 'P2', score: 15, time: 45, date: '2025-01-01' }],
      };

      saveHighscores(scores);

      expect(localStorage.getItem('highscores_level1')).not.toBeNull();
      expect(localStorage.getItem('highscores_level2')).not.toBeNull();
    });

    test('handles localStorage error gracefully', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Quota exceeded');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Should not throw
      saveHighscores({ 'highscores_test': [{ name: 'P1', score: 10, time: 30, date: '2025-01-01' }] });

      expect(consoleSpy).toHaveBeenCalled();

      spy.mockRestore();
      consoleSpy.mockRestore();
    });
  });

  describe('store integration', () => {
    test('persists player name changes', () => {
      const { setPlayerName } = useStore.getState();

      setPlayerName('IntegrationTest');

      expect(localStorage.getItem('playerName')).toBe('IntegrationTest');
    });

    test('persists highscore changes', () => {
      const { addHighscore } = useStore.getState();
      const key = 'highscores_test_level';

      addHighscore(key, {
        name: 'TestPlayer',
        score: 10,
        time: 30,
        date: new Date().toISOString(),
      });

      const stored = localStorage.getItem(key);
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toHaveLength(1);
    });
  });
});
