/**
 * Validation Utilities Tests - Mad Mathematics
 */

import { describe, it, expect } from 'vitest';
import {
  HighscoreSchema,
  HighscoresArraySchema,
  HighscoresMapSchema,
  PlayerNameSchema,
  PersistedStateSchema,
  DifficultyKeySchema,
  OperationSchema,
  GameStatusSchema,
  parseHighscores,
  parseHighscoresMap,
  parsePlayerName,
  parsePersistedState,
  sanitizePlayerName,
  parseAnswerInput,
} from '../../src/utils/validation';

describe('Zod Schemas', () => {
  describe('HighscoreSchema', () => {
    it('validates valid highscore', () => {
      const valid = { name: 'Alice', score: 15, time: 45 };
      const result = HighscoreSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('validates highscore with date', () => {
      const valid = {
        name: 'Alice',
        score: 15,
        time: 45,
        date: '2025-01-01T10:00:00.000Z',
      };
      const result = HighscoreSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const invalid = { name: '', score: 15, time: 45 };
      const result = HighscoreSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects negative score', () => {
      const invalid = { name: 'Alice', score: -1, time: 45 };
      const result = HighscoreSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects negative time', () => {
      const invalid = { name: 'Alice', score: 15, time: -1 };
      const result = HighscoreSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects non-integer score', () => {
      const invalid = { name: 'Alice', score: 15.5, time: 45 };
      const result = HighscoreSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it('rejects missing fields', () => {
      const invalid = { name: 'Alice' };
      const result = HighscoreSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('HighscoresArraySchema', () => {
    it('validates empty array', () => {
      const result = HighscoresArraySchema.safeParse([]);
      expect(result.success).toBe(true);
    });

    it('validates array of highscores', () => {
      const valid = [
        { name: 'Alice', score: 15, time: 45 },
        { name: 'Bob', score: 14, time: 50 },
      ];
      const result = HighscoresArraySchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('rejects array with invalid entry', () => {
      const invalid = [
        { name: 'Alice', score: 15, time: 45 },
        { name: '', score: 14, time: 50 },
      ];
      const result = HighscoresArraySchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe('HighscoresMapSchema', () => {
    it('validates empty object', () => {
      const result = HighscoresMapSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('validates map of highscores', () => {
      const valid = {
        'multi-apprenti': [{ name: 'Alice', score: 15, time: 45 }],
        'add-facile': [{ name: 'Bob', score: 20, time: 30 }],
      };
      const result = HighscoresMapSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe('PlayerNameSchema', () => {
    it('validates valid name', () => {
      const result = PlayerNameSchema.safeParse('Mathéo');
      expect(result.success).toBe(true);
    });

    it('validates empty string', () => {
      const result = PlayerNameSchema.safeParse('');
      expect(result.success).toBe(true);
    });

    it('validates unicode and emoji', () => {
      const result = PlayerNameSchema.safeParse('🎮 Élève 学生');
      expect(result.success).toBe(true);
    });

    it('rejects string over 500 chars', () => {
      const longName = 'A'.repeat(501);
      const result = PlayerNameSchema.safeParse(longName);
      expect(result.success).toBe(false);
    });
  });

  describe('DifficultyKeySchema', () => {
    it('validates all difficulty keys', () => {
      const validKeys = [
        'apprenti',
        'sorcier',
        'archimage',
        'facile',
        'moyen',
        'difficile',
        'super-multi',
      ];

      validKeys.forEach((key) => {
        const result = DifficultyKeySchema.safeParse(key);
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid difficulty key', () => {
      const result = DifficultyKeySchema.safeParse('expert');
      expect(result.success).toBe(false);
    });
  });

  describe('OperationSchema', () => {
    it('validates all operations', () => {
      const validOps = ['×', '+', '−', '÷'];

      validOps.forEach((op) => {
        const result = OperationSchema.safeParse(op);
        expect(result.success).toBe(true);
      });
    });

    it('rejects ASCII operators', () => {
      expect(OperationSchema.safeParse('*').success).toBe(false);
      expect(OperationSchema.safeParse('-').success).toBe(false);
      expect(OperationSchema.safeParse('/').success).toBe(false);
    });
  });

  describe('GameStatusSchema', () => {
    it('validates all game statuses', () => {
      const validStatuses = ['idle', 'playing', 'finished'];

      validStatuses.forEach((status) => {
        const result = GameStatusSchema.safeParse(status);
        expect(result.success).toBe(true);
      });
    });

    it('rejects invalid status', () => {
      const result = GameStatusSchema.safeParse('paused');
      expect(result.success).toBe(false);
    });
  });

  describe('PersistedStateSchema', () => {
    it('validates empty state', () => {
      const result = PersistedStateSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('validates full state', () => {
      const valid = {
        playerName: 'Alice',
        highscores: {
          'multi-apprenti': [{ name: 'Alice', score: 15, time: 45 }],
        },
      };
      const result = PersistedStateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it('validates partial state', () => {
      const valid = { playerName: 'Alice' };
      const result = PersistedStateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });
});

describe('Safe Parse Functions', () => {
  describe('parseHighscores', () => {
    it('returns parsed array for valid data', () => {
      const valid = [{ name: 'Alice', score: 15, time: 45 }];
      const result = parseHighscores(valid);
      expect(result).toEqual(valid);
    });

    it('returns empty array for invalid data', () => {
      const invalid = [{ name: '', score: -1 }];
      const result = parseHighscores(invalid);
      expect(result).toEqual([]);
    });

    it('returns empty array for null', () => {
      expect(parseHighscores(null)).toEqual([]);
    });

    it('returns empty array for undefined', () => {
      expect(parseHighscores(undefined)).toEqual([]);
    });

    it('returns empty array for non-array', () => {
      expect(parseHighscores('invalid')).toEqual([]);
      expect(parseHighscores(123)).toEqual([]);
      expect(parseHighscores({})).toEqual([]);
    });
  });

  describe('parseHighscoresMap', () => {
    it('returns parsed map for valid data', () => {
      const valid = {
        'multi-apprenti': [{ name: 'Alice', score: 15, time: 45 }],
      };
      const result = parseHighscoresMap(valid);
      expect(result).toEqual(valid);
    });

    it('returns empty object for invalid data', () => {
      expect(parseHighscoresMap(null)).toEqual({});
      expect(parseHighscoresMap(undefined)).toEqual({});
      expect(parseHighscoresMap('invalid')).toEqual({});
    });
  });

  describe('parsePlayerName', () => {
    it('returns name for valid string', () => {
      expect(parsePlayerName('Alice')).toBe('Alice');
    });

    it('returns empty string for invalid data', () => {
      expect(parsePlayerName(null)).toBe('');
      expect(parsePlayerName(undefined)).toBe('');
      expect(parsePlayerName(123)).toBe('');
    });

    it('returns empty string for too long name', () => {
      const longName = 'A'.repeat(501);
      expect(parsePlayerName(longName)).toBe('');
    });
  });

  describe('parsePersistedState', () => {
    it('returns parsed state for valid data', () => {
      const valid = { playerName: 'Alice', highscores: {} };
      const result = parsePersistedState(valid);
      expect(result).toEqual(valid);
    });

    it('returns empty object for invalid data', () => {
      expect(parsePersistedState(null)).toEqual({});
      expect(parsePersistedState('invalid')).toEqual({});
    });
  });
});

describe('Utility Functions', () => {
  describe('sanitizePlayerName', () => {
    it('trims whitespace', () => {
      expect(sanitizePlayerName('  Alice  ')).toBe('Alice');
    });

    it('handles leading whitespace', () => {
      expect(sanitizePlayerName('   Bob')).toBe('Bob');
    });

    it('handles trailing whitespace', () => {
      expect(sanitizePlayerName('Charlie   ')).toBe('Charlie');
    });

    it('limits length to 500 characters', () => {
      const longName = 'A'.repeat(600);
      expect(sanitizePlayerName(longName)).toHaveLength(500);
    });

    it('preserves unicode', () => {
      expect(sanitizePlayerName('  🎮 Mathéo  ')).toBe('🎮 Mathéo');
    });

    it('returns empty string for whitespace-only input', () => {
      expect(sanitizePlayerName('   ')).toBe('');
    });
  });

  describe('parseAnswerInput', () => {
    it('parses valid integer', () => {
      expect(parseAnswerInput('42')).toBe(42);
    });

    it('parses zero', () => {
      expect(parseAnswerInput('0')).toBe(0);
    });

    it('parses negative numbers', () => {
      expect(parseAnswerInput('-5')).toBe(-5);
    });

    it('trims whitespace', () => {
      expect(parseAnswerInput('  42  ')).toBe(42);
    });

    it('returns null for empty string', () => {
      expect(parseAnswerInput('')).toBe(null);
    });

    it('returns null for whitespace-only', () => {
      expect(parseAnswerInput('   ')).toBe(null);
    });

    it('returns null for non-numeric input', () => {
      expect(parseAnswerInput('abc')).toBe(null);
      expect(parseAnswerInput('12abc')).toBe(12); // parseInt behavior
    });

    it('truncates decimals', () => {
      expect(parseAnswerInput('42.7')).toBe(42);
    });
  });
});
