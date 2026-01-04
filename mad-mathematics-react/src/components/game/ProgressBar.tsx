/**
 * ProgressBar Component - Mad Mathematics
 * Visual progress indicator with color states
 */

export interface ProgressBarProps {
  /** Current progress value */
  current: number;
  /** Maximum value (e.g., total questions) */
  max: number;
  /** Optional label to display */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get color class based on progress percentage
 */
function getProgressColor(ratio: number): string {
  if (ratio >= 0.66) return 'bg-green-500';
  if (ratio >= 0.33) return 'bg-yellow-500';
  return 'bg-red-500';
}

/**
 * ProgressBar component showing game progress
 */
export function ProgressBar({
  current,
  max,
  label,
  className = '',
}: ProgressBarProps) {
  const ratio = max > 0 ? current / max : 0;
  const percentage = Math.min(100, Math.max(0, ratio * 100));
  const colorClass = getProgressColor(ratio);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1 text-sm text-gray-300">
          <span>{label}</span>
          <span>
            {current}/{max}
          </span>
        </div>
      )}
      <div
        className="w-full h-3 bg-gray-700 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progression: ${current} sur ${max}`}
      >
        <div
          className={`h-full ${colorClass} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
