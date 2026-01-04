/**
 * Player Slice Tests - Mad Mathematics
 * Unit tests for player state management
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { useStore } from '../../src/store';

describe('playerSlice', () => {
  beforeEach(() => {
    // Reset store to initial state
    useStore.setState({
      playerName: '',
    });
    localStorage.clear();
  });

  describe('playerName', () => {
    test('initializes with empty string', () => {
      const state = useStore.getState();
      expect(state.playerName).toBe('');
    });

    test('can be set to a new value', () => {
      const { setPlayerName } = useStore.getState();

      setPlayerName('Alice');

      expect(useStore.getState().playerName).toBe('Alice');
    });

    test('can be updated multiple times', () => {
      const { setPlayerName } = useStore.getState();

      setPlayerName('Alice');
      expect(useStore.getState().playerName).toBe('Alice');

      setPlayerName('Bob');
      expect(useStore.getState().playerName).toBe('Bob');
    });

    test('handles empty string', () => {
      const { setPlayerName } = useStore.getState();

      setPlayerName('Test');
      setPlayerName('');

      expect(useStore.getState().playerName).toBe('');
    });

    test('handles Unicode characters', () => {
      const { setPlayerName } = useStore.getState();
      const unicodeName = '🎮 Mathéo 数学';

      setPlayerName(unicodeName);

      expect(useStore.getState().playerName).toBe(unicodeName);
    });

    test('handles long names', () => {
      const { setPlayerName } = useStore.getState();
      const longName = 'A'.repeat(500);

      setPlayerName(longName);

      expect(useStore.getState().playerName).toBe(longName);
    });

    test('handles special characters', () => {
      const { setPlayerName } = useStore.getState();
      const specialName = "O'Connor-Smith <test>";

      setPlayerName(specialName);

      expect(useStore.getState().playerName).toBe(specialName);
    });
  });

  describe('persistence', () => {
    test('saves player name to localStorage on change', () => {
      const { setPlayerName } = useStore.getState();

      setPlayerName('PersistTest');

      expect(localStorage.getItem('playerName')).toBe('PersistTest');
    });

    test('removes from localStorage when set to empty', () => {
      const { setPlayerName } = useStore.getState();

      setPlayerName('Test');
      expect(localStorage.getItem('playerName')).toBe('Test');

      setPlayerName('');
      expect(localStorage.getItem('playerName')).toBeNull();
    });
  });
});
