/**
 * useKeyboardInput Hook - Mad Mathematics
 * Custom hook for handling keyboard input (Enter key submission)
 */

import { useCallback, useEffect } from 'react';

export interface UseKeyboardInputOptions {
  /** Callback when Enter key is pressed */
  onEnter?: () => void;
  /** Callback when Escape key is pressed */
  onEscape?: () => void;
  /** Whether the hook is active */
  enabled?: boolean;
  /** Target element selector (default: document) */
  targetSelector?: string;
}

/**
 * Hook for handling keyboard shortcuts during gameplay
 */
export function useKeyboardInput({
  onEnter,
  onEscape,
  enabled = true,
  targetSelector,
}: UseKeyboardInputOptions): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger if user is typing in an input field
      // (unless it's specifically the game input)
      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      switch (event.key) {
        case 'Enter':
          // Allow Enter in input fields for form submission
          if (onEnter && (!isInputField || target.closest('form'))) {
            // Only call if not already handled by form
            if (!isInputField) {
              event.preventDefault();
              onEnter();
            }
          }
          break;

        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;

        default:
          break;
      }
    },
    [enabled, onEnter, onEscape]
  );

  useEffect(() => {
    if (!enabled) return;

    const targetElement = targetSelector
      ? document.querySelector(targetSelector)
      : document;

    if (!targetElement) return;

    targetElement.addEventListener('keydown', handleKeyDown as EventListener);

    return () => {
      targetElement.removeEventListener(
        'keydown',
        handleKeyDown as EventListener
      );
    };
  }, [enabled, handleKeyDown, targetSelector]);
}
