/**
 * formatTime Utility - Mad Mathematics
 * Format seconds into readable time strings
 */

/**
 * Format seconds into a human-readable string
 * @param seconds - Number of seconds to format
 * @returns Formatted string like "1m 30s" or "45s"
 */
export function formatTime(seconds: number): string {
  // Handle edge cases
  if (Number.isNaN(seconds)) return '0s';
  if (seconds === Infinity || seconds === -Infinity) return '∞';
  if (seconds < 0) return '0s';

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  return `${remainingSeconds}s`;
}

/**
 * Format time elapsed for display in game
 * Shows minutes:seconds format with leading zeros
 * @param seconds - Number of seconds
 * @returns Formatted string like "01:30"
 */
export function formatTimeDigital(seconds: number): string {
  if (seconds < 0) return '00:00';
  if (!Number.isFinite(seconds)) return '∞';

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
