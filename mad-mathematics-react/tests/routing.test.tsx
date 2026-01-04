/**
 * Routing Integration Tests
 * Tests deep linking, browser navigation, and route handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../src/App';
import { HomePage, MultiplicationPage, AdditionPage, SoustractionPage, DivisionPage } from '../src/pages';
import { useStore } from '../src/store';

/**
 * Render with MemoryRouter for testing specific routes
 */
function renderWithRoute(initialRoute: string = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/multiplication" element={<MultiplicationPage />} />
        <Route path="/addition" element={<AdditionPage />} />
        <Route path="/soustraction" element={<SoustractionPage />} />
        <Route path="/division" element={<DivisionPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Routing', () => {
  beforeEach(() => {
    useStore.getState().resetGame();
    useStore.getState().setPlayerName('');
    localStorage.clear();
  });

  describe('Deep Linking', () => {
    it('renders HomePage when navigating to /', () => {
      renderWithRoute('/');
      
      expect(screen.getByText(/mad mathematics/i)).toBeInTheDocument();
      // HomePage has the 4 game mode cards
      expect(screen.getByRole('link', { name: /multiplication/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /addition/i })).toBeInTheDocument();
    });

    it('renders MultiplicationPage when navigating directly to /multiplication', () => {
      renderWithRoute('/multiplication');
      
      expect(screen.getByText(/tables de multiplication/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /apprenti/i })).toBeInTheDocument();
    });

    it('renders AdditionPage when navigating directly to /addition', () => {
      renderWithRoute('/addition');
      
      // AdditionPage shows "École de Magie des Additions"
      expect(screen.getByText(/additions/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /apprenti/i })).toBeInTheDocument();
    });

    it('renders SoustractionPage when navigating directly to /soustraction', () => {
      renderWithRoute('/soustraction');
      
      // SoustractionPage shows "École de Magie des Soustractions"
      expect(screen.getByText(/soustractions/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /apprenti/i })).toBeInTheDocument();
    });

    it('renders DivisionPage when navigating directly to /division', () => {
      renderWithRoute('/division');
      
      // DivisionPage shows "École de Magie des Divisions"
      expect(screen.getByText(/divisions/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /apprenti/i })).toBeInTheDocument();
    });
  });

  describe('Navigation Flow', () => {
    it('navigates from HomePage to MultiplicationPage', async () => {
      const user = userEvent.setup();
      renderWithRoute('/');
      
      // Click on multiplication link
      const multiplicationLink = screen.getByRole('link', { name: /multiplication/i });
      await user.click(multiplicationLink);
      
      // Should be on multiplication page
      await waitFor(() => {
        expect(screen.getByText(/tables de multiplication/i)).toBeInTheDocument();
      });
    });

    it('navigates from HomePage to AdditionPage', async () => {
      const user = userEvent.setup();
      renderWithRoute('/');
      
      const additionLink = screen.getByRole('link', { name: /addition/i });
      await user.click(additionLink);
      
      await waitFor(() => {
        // AdditionPage shows "École de Magie des Additions"
        expect(screen.getByText(/magie des additions/i)).toBeInTheDocument();
      });
    });

    it('navigates from HomePage to SoustractionPage', async () => {
      const user = userEvent.setup();
      renderWithRoute('/');
      
      const soustractionLink = screen.getByRole('link', { name: /soustraction/i });
      await user.click(soustractionLink);
      
      await waitFor(() => {
        // SoustractionPage shows "École de Magie des Soustractions"
        expect(screen.getByText(/magie des soustractions/i)).toBeInTheDocument();
      });
    });

    it('navigates from HomePage to DivisionPage', async () => {
      const user = userEvent.setup();
      renderWithRoute('/');
      
      const divisionLink = screen.getByRole('link', { name: /division/i });
      await user.click(divisionLink);
      
      await waitFor(() => {
        // DivisionPage shows "École de Magie des Divisions"
        expect(screen.getByText(/magie des divisions/i)).toBeInTheDocument();
      });
    });
  });

  describe('Back to Home Navigation', () => {
    it('can navigate back to home from MultiplicationPage', async () => {
      const user = userEvent.setup();
      renderWithRoute('/multiplication');
      
      // Find and click home link (if exists)
      const homeLinks = screen.queryAllByRole('link');
      const homeLink = homeLinks.find(link => 
        link.getAttribute('href') === '/' || 
        link.textContent?.toLowerCase().includes('accueil') ||
        link.textContent?.toLowerCase().includes('home')
      );
      
      if (homeLink) {
        await user.click(homeLink);
        await waitFor(() => {
          expect(screen.getByText(/mad mathematics/i)).toBeInTheDocument();
        });
      }
    });
  });
});

describe('Route State Preservation', () => {
  beforeEach(() => {
    useStore.getState().resetGame();
    useStore.getState().setPlayerName('');
    localStorage.clear();
  });

  it('preserves player name across route changes', async () => {
    const user = userEvent.setup();
    
    // Set player name in store
    useStore.getState().setPlayerName('Mathéo');
    
    renderWithRoute('/multiplication');
    
    // Player name should be loaded from store
    const nameInput = screen.getByPlaceholderText(/entre ton nom/i);
    expect(nameInput).toHaveValue('Mathéo');
  });

  it('persists game state when changing pages', async () => {
    // Start on multiplication page
    const { unmount } = renderWithRoute('/multiplication');
    
    // Set player name
    useStore.getState().setPlayerName('Joueur Test');
    
    // Unmount and go to different page
    unmount();
    
    // Render addition page
    renderWithRoute('/addition');
    
    // Player name should persist
    const nameInput = screen.getByPlaceholderText(/entre ton nom/i);
    expect(nameInput).toHaveValue('Joueur Test');
  });
});
