/**
 * Button Component - Mad Mathematics
 * Reusable button with variants for primary, secondary, danger actions
 */

import { type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Content of the button */
  children: ReactNode;
  /** Whether the button takes full width */
  fullWidth?: boolean;
}

/**
 * Base styles for all buttons
 */
const baseStyles =
  'inline-flex items-center justify-center font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

/**
 * Variant-specific styles
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-br from-yellow-400 to-yellow-500 text-purple-900 hover:from-yellow-300 hover:to-yellow-400 focus:ring-yellow-400 shadow-lg hover:shadow-xl',
  secondary:
    'bg-gradient-to-br from-purple-600 to-purple-700 text-white hover:from-purple-500 hover:to-purple-600 focus:ring-purple-500 shadow-lg hover:shadow-xl',
  danger:
    'bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-400 hover:to-red-500 focus:ring-red-500 shadow-lg hover:shadow-xl',
  ghost:
    'bg-transparent text-white hover:bg-white/10 focus:ring-white/50',
};

/**
 * Size-specific styles
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-4 text-xl',
};

/**
 * Button component with theme-consistent styling
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
