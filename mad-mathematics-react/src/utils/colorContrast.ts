/**
 * Color contrast utility for WCAG compliance verification
 * WCAG AA requires:
 * - 4.5:1 contrast ratio for normal text
 * - 3:1 contrast ratio for large text (18pt+ or 14pt+ bold)
 */

/**
 * Calculate relative luminance of a color
 * @see https://www.w3.org/TR/WCAG20/\#relativeluminancedef
 */
export function getRelativeLuminance(hex: string): number {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  
  // Apply gamma correction
  const rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * @see https://www.w3.org/TR/WCAG20/\#contrast-ratiodef
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA requirements
 */
export function meetsWCAGAA(foreground: string, background: string, isLargeText: boolean = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  const threshold = isLargeText ? 3.0 : 4.5;
  return ratio >= threshold;
}

/**
 * Project color palette for verification
 */
export const PROJECT_COLORS = {
  // Tailwind colors used in the project
  amber400: '#fbbf24',
  amber500: '#f59e0b',
  yellow400: '#facc15',
  yellow500: '#eab308',
  purple600: '#9333ea',
  purple700: '#7e22ce',
  purple900: '#581c87',
  indigo900: '#312e81',
  slate900: '#0f172a',
  white: '#ffffff',
  gold: '#ffd700',
} as const;

/**
 * All color pairs used in the project that need verification
 */
export const COLOR_PAIRS = [
  { name: 'Title on dark bg', fg: 'amber400', bg: 'purple900', isLarge: true },
  { name: 'Primary btn text', fg: 'purple900', bg: 'yellow400', isLarge: true },
  { name: 'Secondary btn text', fg: 'white', bg: 'purple600', isLarge: false },
  { name: 'White on indigo', fg: 'white', bg: 'indigo900', isLarge: false },
  { name: 'White on slate', fg: 'white', bg: 'slate900', isLarge: false },
  { name: 'Gold on purple', fg: 'gold', bg: 'purple900', isLarge: true },
] as const;
