/**
 * AdditionPage Integration Tests
 * Tests for the Addition game page using RTL
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AdditionPage } from '../../src/pages/AdditionPage';
import { useStore } from '../../src/store';

// Helper to render with router
function renderWithRouter(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      {ui}
    </MemoryRouter>
  );
}

describe('AdditionPage', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.setState({
      status: 'selection',
      difficulty: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      timeElapsed: 0,
      timerExpired: false,
      playerName: '',
      highscores: {},
    });
  });

  afterEach(() => {
    // Clean up
    useStore.setState({
      status: 'selection',
      difficulty: null,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      score: 0,
      timeElapsed: 0,
      timerExpired: false,
    });
  });

  describe('Selection Screen', () => {
    it('renders the selection screen initially', async () => {
      renderWithRouter(<AdditionPage />);
      
      expect(screen.getByText(/école de magie des additions/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/entre ton nom/i)).toBeInTheDocument();
    });

    it('has all 4 difficulty levels', async () => {
      renderWithRouter(<AdditionPage />);
      
      expect(screen.getByRole('button', { name: /apprenti/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /confirmé/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /grand/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /super-multi/i })).toBeInTheDocument();
    });

    it('starts game when difficulty is selected', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AdditionPage />);
      
      const nameInput = screen.getByPlaceholderText(/entre ton nom/i);
      await user.type(nameInput, 'TestPlayer');
      
      const apprentiButton = screen.getByRole('button', { name: /apprenti/i });
      await user.click(apprentiButton);
      
      // Should show timer
      await waitFor(() => {
        expect(screen.getByRole('timer')).toBeInTheDocument();
      });
    });
  });

  describe('Game Screen - Apprenti Level', () => {
    async function startApprenticeGame() {
      const user = userEvent.setup();
      renderWithRouter(<AdditionPage />);
      
      const nameInput = screen.getByPlaceholderText(/entre ton nom/i);
      await user.type(nameInput, 'TestPlayer');
      
      const apprentiButton = screen.getByRole('button', { name: /apprenti/i });
      await user.click(apprentiButton);
      
      await waitFor(() => {
        expect(screen.getByRole('timer')).toBeInTheDocument();
      });
      
      return user;
    }

    it('displays question counter starting at 1/20', async () => {
      await startApprenticeGame();
      
      const progressbar = screen.getByRole('progressbar');
      expect(progressbar).toHaveAttribute('aria-label', 'Question 1/20');
    });

    it('displays timer', async () => {
      await startApprenticeGame();
      
      expect(screen.getByRole('timer')).toBeInTheDocument();
    });

    it('displays an addition question', async () => {
      await startApprenticeGame();
      
      // Should contain + operator
      expect(screen.getByText(/\+/)).toBeInTheDocument();
    });

    it('allows skipping questions', async () => {
      const user = await startApprenticeGame();
      
      const skipButton = screen.getByRole('button', { name: /passer/i });
      await user.click(skipButton);
      
      await waitFor(() => {
        const progressbar = screen.getByRole('progressbar');
        expect(progressbar).toHaveAttribute('aria-label', 'Question 2/20');
      });
    });

    it('shows results after completing all 20 questions', async () => {
      const user = await startApprenticeGame();
      
      // Skip all 20 questions
      for (let i = 0; i < 20; i++) {
        const skipButton = screen.getByRole('button', { name: /passer/i });
        await user.click(skipButton);
        
        if (i < 19) {
          await waitFor(() => {
            const progressbar = screen.getByRole('progressbar');
            expect(progressbar).toHaveAttribute('aria-label', `Question ${i + 2}/20`);
          });
        }
      }
      
      // Should show results screen
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /rejouer/i })).toBeInTheDocument();
      });
    });
  });

  describe('Results Screen', () => {
    async function completeGame() {
      const user = userEvent.setup();
      renderWithRouter(<AdditionPage />);
      
      const nameInput = screen.getByPlaceholderText(/entre ton nom/i);
      await user.type(nameInput, 'Mathéo');
      
      const apprentiButton = screen.getByRole('button', { name: /apprenti/i });
      await user.click(apprentiButton);
      
      await waitFor(() => {
        expect(screen.getByRole('timer')).toBeInTheDocument();
      });
      
      // Skip all questions
      for (let i = 0; i < 20; i++) {
        const skipButton = screen.getByRole('button', { name: /passer/i });
        await user.click(skipButton);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /rejouer/i })).toBeInTheDocument();
      });
      
      return user;
    }

    it('displays score out of 20', async () => {
      await completeGame();
      
      // Score should be displayed as "0 / 20" in the heading
      expect(screen.getByRole('heading', { name: /0.*\/.*20/ })).toBeInTheDocument();
    });

    it('displays time taken', async () => {
      await completeGame();
      
      // Time should be displayed (shows "⏱️ Temps: Xs")
      expect(screen.getByText(/⏱️ Temps:/)).toBeInTheDocument();
    });

    it('shows encouragement message', async () => {
      await completeGame();
      
      // Should show encouragement message for low score
      expect(screen.getByText(/continue à t'entraîner/i)).toBeInTheDocument();
    });

    it('allows playing again', async () => {
      const user = await completeGame();
      
      const playAgainButton = screen.getByRole('button', { name: /rejouer/i });
      await user.click(playAgainButton);
      
      // Should go back to selection screen
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /apprenti/i })).toBeInTheDocument();
      });
    });
  });

  describe('Confirmé Level', () => {
    it('starts game with Confirmé difficulty', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AdditionPage />);
      
      const nameInput = screen.getByPlaceholderText(/entre ton nom/i);
      await user.type(nameInput, 'TestPlayer');
      
      const confirmeButton = screen.getByRole('button', { name: /confirmé/i });
      await user.click(confirmeButton);
      
      await waitFor(() => {
        expect(screen.getByRole('timer')).toBeInTheDocument();
      });
    });
  });

  describe('Super-Multi Level (Unlimited Time)', () => {
    it('starts game without timer display', async () => {
      const user = userEvent.setup();
      renderWithRouter(<AdditionPage />);
      
      const nameInput = screen.getByPlaceholderText(/entre ton nom/i);
      await user.type(nameInput, 'TestPlayer');
      
      const superMultiButton = screen.getByRole('button', { name: /super-multi/i });
      await user.click(superMultiButton);
      
      // Should be in game mode but no timer (unlimited)
      await waitFor(() => {
        // Should show the addition question
        expect(screen.getByText(/\+/)).toBeInTheDocument();
      });
      
      // Timer should not be visible for unlimited time
      expect(screen.queryByRole('timer')).not.toBeInTheDocument();
    });
  });
});
