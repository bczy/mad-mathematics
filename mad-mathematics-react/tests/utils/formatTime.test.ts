/**
 * formatTime Utility Tests - Mad Mathematics
 */

import { describe, it, expect } from 'vitest';
import { formatTime, formatTimeDigital } from '../../src/utils/formatTime';

describe('formatTime', () => {
  describe('seconds only', () => {
    it('formats 0 seconds', () => {
      expect(formatTime(0)).toBe('0s');
    });

    it('formats 1 second', () => {
      expect(formatTime(1)).toBe('1s');
    });

    it('formats 30 seconds', () => {
      expect(formatTime(30)).toBe('30s');
    });

    it('formats 59 seconds', () => {
      expect(formatTime(59)).toBe('59s');
    });
  });

  describe('minutes and seconds', () => {
    it('formats exactly 60 seconds as 1m 0s', () => {
      expect(formatTime(60)).toBe('1m 0s');
    });

    it('formats 61 seconds as 1m 1s', () => {
      expect(formatTime(61)).toBe('1m 1s');
    });

    it('formats 90 seconds as 1m 30s', () => {
      expect(formatTime(90)).toBe('1m 30s');
    });

    it('formats 125 seconds as 2m 5s', () => {
      expect(formatTime(125)).toBe('2m 5s');
    });
  });

  describe('large values', () => {
    it('formats 3600 seconds as 60m 0s', () => {
      expect(formatTime(3600)).toBe('60m 0s');
    });

    it('formats 7200 seconds as 120m 0s', () => {
      expect(formatTime(7200)).toBe('120m 0s');
    });
  });

  describe('edge cases', () => {
    it('handles negative values', () => {
      expect(formatTime(-10)).toBe('0s');
      expect(formatTime(-1)).toBe('0s');
    });

    it('floors decimal values', () => {
      expect(formatTime(30.7)).toBe('30s');
      expect(formatTime(90.9)).toBe('1m 30s');
    });

    it('handles Infinity', () => {
      expect(formatTime(Infinity)).toBe('∞');
    });

    it('handles NaN as 0s', () => {
      expect(formatTime(NaN)).toBe('0s');
    });
  });
});

describe('formatTimeDigital', () => {
  describe('basic formatting', () => {
    it('formats 0 seconds', () => {
      expect(formatTimeDigital(0)).toBe('00:00');
    });

    it('formats 5 seconds with leading zero', () => {
      expect(formatTimeDigital(5)).toBe('00:05');
    });

    it('formats 30 seconds', () => {
      expect(formatTimeDigital(30)).toBe('00:30');
    });

    it('formats 60 seconds as 01:00', () => {
      expect(formatTimeDigital(60)).toBe('01:00');
    });

    it('formats 65 seconds as 01:05', () => {
      expect(formatTimeDigital(65)).toBe('01:05');
    });

    it('formats 125 seconds as 02:05', () => {
      expect(formatTimeDigital(125)).toBe('02:05');
    });
  });

  describe('edge cases', () => {
    it('handles negative values', () => {
      expect(formatTimeDigital(-10)).toBe('00:00');
    });

    it('floors decimal values', () => {
      expect(formatTimeDigital(65.7)).toBe('01:05');
    });

    it('handles Infinity', () => {
      expect(formatTimeDigital(Infinity)).toBe('∞');
    });
  });
});
