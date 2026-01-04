/**
 * Color Contrast Tests - WCAG AA Compliance Verification
 * Ensures all project color combinations meet accessibility requirements
 */

import { describe, test, expect } from 'vitest';
import {
  getRelativeLuminance,
  getContrastRatio,
  meetsWCAGAA,
  PROJECT_COLORS,
  COLOR_PAIRS,
} from '../../src/utils/colorContrast';

describe('Color Contrast Utilities', () => {
  describe('getRelativeLuminance', () => {
    test('returns 0 for black', () => {
      expect(getRelativeLuminance('#000000')).toBeCloseTo(0, 5);
    });

    test('returns 1 for white', () => {
      expect(getRelativeLuminance('#ffffff')).toBeCloseTo(1, 5);
    });

    test('handles colors without hash', () => {
      expect(getRelativeLuminance('ffffff')).toBeCloseTo(1, 5);
    });
  });

  describe('getContrastRatio', () => {
    test('black on white has 21:1 ratio', () => {
      const ratio = getContrastRatio('#000000', '#ffffff');
      expect(ratio).toBeCloseTo(21, 0);
    });

    test('same color has 1:1 ratio', () => {
      const ratio = getContrastRatio('#ff0000', '#ff0000');
      expect(ratio).toBeCloseTo(1, 0);
    });
  });

  describe('meetsWCAGAA', () => {
    test('black on white meets AA for normal text', () => {
      expect(meetsWCAGAA('#000000', '#ffffff', false)).toBe(true);
    });

    test('light gray on white fails AA for normal text', () => {
      // #cccccc on white has ~1.6:1 ratio
      expect(meetsWCAGAA('#cccccc', '#ffffff', false)).toBe(false);
    });

    test('medium gray on white may pass for large text', () => {
      // #767676 on white has exactly ~4.54:1 ratio
      expect(meetsWCAGAA('#767676', '#ffffff', true)).toBe(true);
    });
  });
});

describe('Project Color WCAG AA Compliance', () => {
  describe.each(COLOR_PAIRS)('$name', ({ fg, bg, isLarge }) => {
    const fgColor = PROJECT_COLORS[fg as keyof typeof PROJECT_COLORS];
    const bgColor = PROJECT_COLORS[bg as keyof typeof PROJECT_COLORS];
    const threshold = isLarge ? 3.0 : 4.5;

    test(`meets WCAG AA (>= ${threshold}:1)`, () => {
      const ratio = getContrastRatio(fgColor, bgColor);
      console.log(`${fg} on ${bg}: ${ratio.toFixed(2)}:1 (threshold: ${threshold}:1)`);
      expect(ratio).toBeGreaterThanOrEqual(threshold);
    });

    test('passes meetsWCAGAA check', () => {
      expect(meetsWCAGAA(fgColor, bgColor, isLarge)).toBe(true);
    });
  });
});

describe('Button Contrast Verification', () => {
  test('primary button: purple text on yellow background', () => {
    const ratio = getContrastRatio(PROJECT_COLORS.purple900, PROJECT_COLORS.yellow400);
    console.log(`Primary button contrast: ${ratio.toFixed(2)}:1`);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('secondary button: white text on purple background', () => {
    const ratio = getContrastRatio(PROJECT_COLORS.white, PROJECT_COLORS.purple600);
    console.log(`Secondary button contrast: ${ratio.toFixed(2)}:1`);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

describe('Text on Background Contrast', () => {
  test('amber text on purple-900 background (title)', () => {
    const ratio = getContrastRatio(PROJECT_COLORS.amber400, PROJECT_COLORS.purple900);
    console.log(`Title text contrast: ${ratio.toFixed(2)}:1`);
    // Large text (titles) only needs 3:1
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });

  test('white text on slate-900 (body text)', () => {
    const ratio = getContrastRatio(PROJECT_COLORS.white, PROJECT_COLORS.slate900);
    console.log(`Body text contrast: ${ratio.toFixed(2)}:1`);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('white text on indigo-900 (card backgrounds)', () => {
    const ratio = getContrastRatio(PROJECT_COLORS.white, PROJECT_COLORS.indigo900);
    console.log(`Card text contrast: ${ratio.toFixed(2)}:1`);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
