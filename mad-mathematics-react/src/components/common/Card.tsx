/**
 * Card Component - Mad Mathematics
 * Reusable card for consistent layout across the app
 */

import { type ReactNode } from 'react';

export interface CardProps {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether to add padding */
  padding?: boolean;
  /** Whether to center content */
  centered?: boolean;
}

/**
 * Card component with magical theme styling
 */
export function Card({
  children,
  className = '',
  padding = true,
  centered = false,
}: CardProps) {
  const classes = [
    'bg-purple-900/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 shadow-xl',
    padding ? 'p-6 md:p-8' : '',
    centered ? 'flex flex-col items-center text-center' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
