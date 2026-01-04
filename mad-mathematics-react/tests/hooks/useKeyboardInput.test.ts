/**
 * useKeyboardInput Hook Tests - Mad Mathematics
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardInput } from '../../src/hooks/useKeyboardInput';

describe('useKeyboardInput', () => {
  let addEventListener: ReturnType<typeof vi.spyOn>;
  let removeEventListener: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListener = vi.spyOn(document, 'addEventListener');
    removeEventListener = vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('event listener management', () => {
    it('adds keydown listener on mount', () => {
      renderHook(() =>
        useKeyboardInput({ onEnter: vi.fn() })
      );

      expect(addEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
    });

    it('removes keydown listener on unmount', () => {
      const { unmount } = renderHook(() =>
        useKeyboardInput({ onEnter: vi.fn() })
      );

      unmount();

      expect(removeEventListener).toHaveBeenCalledWith(
        'keydown',
        expect.any(Function)
      );
    });

    it('does not add listener when disabled', () => {
      renderHook(() =>
        useKeyboardInput({ onEnter: vi.fn(), enabled: false })
      );

      expect(addEventListener).not.toHaveBeenCalled();
    });
  });

  describe('Enter key handling', () => {
    it('calls onEnter when Enter key is pressed', () => {
      const onEnter = vi.fn();
      renderHook(() => useKeyboardInput({ onEnter }));

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('does not call onEnter when disabled', () => {
      const onEnter = vi.fn();
      renderHook(() =>
        useKeyboardInput({ onEnter, enabled: false })
      );

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event);

      expect(onEnter).not.toHaveBeenCalled();
    });

    it('does not call onEnter for other keys', () => {
      const onEnter = vi.fn();
      renderHook(() => useKeyboardInput({ onEnter }));

      const event = new KeyboardEvent('keydown', { key: 'Space' });
      document.dispatchEvent(event);

      expect(onEnter).not.toHaveBeenCalled();
    });
  });

  describe('Escape key handling', () => {
    it('calls onEscape when Escape key is pressed', () => {
      const onEscape = vi.fn();
      renderHook(() => useKeyboardInput({ onEscape }));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledTimes(1);
    });

    it('does not call onEscape when disabled', () => {
      const onEscape = vi.fn();
      renderHook(() =>
        useKeyboardInput({ onEscape, enabled: false })
      );

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(event);

      expect(onEscape).not.toHaveBeenCalled();
    });

    it('prevents default on Escape', () => {
      const onEscape = vi.fn();
      renderHook(() => useKeyboardInput({ onEscape }));

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      
      document.dispatchEvent(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('enabled toggle', () => {
    it('starts listening when enabled changes to true', () => {
      const onEnter = vi.fn();
      const { rerender } = renderHook(
        ({ enabled }) => useKeyboardInput({ onEnter, enabled }),
        { initialProps: { enabled: false } }
      );

      // Initially disabled
      const event1 = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event1);
      expect(onEnter).not.toHaveBeenCalled();

      // Enable
      rerender({ enabled: true });

      const event2 = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event2);
      expect(onEnter).toHaveBeenCalledTimes(1);
    });

    it('stops listening when enabled changes to false', () => {
      const onEnter = vi.fn();
      const { rerender } = renderHook(
        ({ enabled }) => useKeyboardInput({ onEnter, enabled }),
        { initialProps: { enabled: true } }
      );

      // Initially enabled
      const event1 = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event1);
      expect(onEnter).toHaveBeenCalledTimes(1);

      // Disable
      rerender({ enabled: false });

      const event2 = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(event2);
      expect(onEnter).toHaveBeenCalledTimes(1); // Still 1, not called again
    });
  });

  describe('multiple callbacks', () => {
    it('can have both onEnter and onEscape', () => {
      const onEnter = vi.fn();
      const onEscape = vi.fn();
      renderHook(() => useKeyboardInput({ onEnter, onEscape }));

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(onEnter).toHaveBeenCalledTimes(1);
      expect(onEscape).toHaveBeenCalledTimes(1);
    });
  });

  describe('input field handling', () => {
    it('does not trigger onEnter when typing in input field (default behavior)', () => {
      const onEnter = vi.fn();
      renderHook(() => useKeyboardInput({ onEnter }));

      // Create an input element and simulate Enter
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      const event = new KeyboardEvent('keydown', { 
        key: 'Enter',
        bubbles: true 
      });
      Object.defineProperty(event, 'target', { value: input });
      
      document.dispatchEvent(event);

      // onEnter should not be called for input fields
      // (unless it's part of a form submission flow)
      expect(onEnter).not.toHaveBeenCalled();

      document.body.removeChild(input);
    });

    it('triggers onEscape even in input field', () => {
      const onEscape = vi.fn();
      renderHook(() => useKeyboardInput({ onEscape }));

      const input = document.createElement('input');
      document.body.appendChild(input);
      input.focus();

      const event = new KeyboardEvent('keydown', { 
        key: 'Escape',
        bubbles: true 
      });
      
      document.dispatchEvent(event);

      expect(onEscape).toHaveBeenCalledTimes(1);

      document.body.removeChild(input);
    });
  });
});
