/**
 * Button Component Tests - Mad Mathematics
 * Tests for Button component variants and behavior
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../src/components/common/Button';

describe('Button', () => {
  describe('rendering', () => {
    test('renders children correctly', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    test('renders with default variant (primary)', () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('from-yellow-400');
    });

    test('renders with emoji content', () => {
      render(<Button>🚀 Launch</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('🚀 Launch');
    });
  });

  describe('variants', () => {
    test('renders primary variant correctly', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('from-yellow-400');
      expect(button).toHaveClass('text-purple-900');
    });

    test('renders secondary variant correctly', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('from-purple-600');
      expect(button).toHaveClass('text-white');
    });

    test('renders danger variant correctly', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('from-red-500');
      expect(button).toHaveClass('text-white');
    });

    test('renders ghost variant correctly', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-transparent');
    });
  });

  describe('sizes', () => {
    test('renders small size correctly', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    test('renders medium size correctly (default)', () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-5', 'py-2.5', 'text-base');
    });

    test('renders large size correctly', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-8', 'py-4', 'text-xl');
    });
  });

  describe('fullWidth', () => {
    test('applies full width class when true', () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    test('does not apply full width class when false', () => {
      render(<Button fullWidth={false}>Normal Width</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveClass('w-full');
    });
  });

  describe('interactions', () => {
    test('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    test('shows disabled styling when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });
  });

  describe('custom className', () => {
    test('applies additional className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('HTML attributes', () => {
    test('passes through type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    test('passes through aria-label', () => {
      render(<Button aria-label="Submit form">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Submit form'
      );
    });
  });
});
