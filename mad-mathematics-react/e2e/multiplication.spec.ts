import { test, expect } from '@playwright/test';

// T060: Playwright E2E test for MultiplicationPage

test.describe('Multiplication Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to multiplication page
    await page.goto('/multiplication');
  });

  test.describe('Selection Screen', () => {
    test('displays selection screen with all difficulty levels', async ({ page }) => {
      // Check title
      await expect(page.getByRole('heading', { name: /tables de multiplication/i })).toBeVisible();
      
      // Check name input
      await expect(page.getByPlaceholder(/entre ton nom/i)).toBeVisible();
      
      // Check difficulty buttons
      await expect(page.getByRole('button', { name: /apprenti/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /sorcier/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /archimage/i })).toBeVisible();
    });

    test('starts game when difficulty is selected', async ({ page }) => {
      // Enter player name
      await page.getByPlaceholder(/entre ton nom/i).fill('E2EPlayer');
      
      // Select Apprenti difficulty
      await page.getByRole('button', { name: /apprenti/i }).click();
      
      // Should show game screen with timer
      await expect(page.getByRole('timer')).toBeVisible();
    });
  });

  test.describe('Game Screen', () => {
    test.beforeEach(async ({ page }) => {
      // Start a game
      await page.getByPlaceholder(/entre ton nom/i).fill('E2EPlayer');
      await page.getByRole('button', { name: /apprenti/i }).click();
    });

    test('displays multiplication question', async ({ page }) => {
      // Wait for game screen
      await expect(page.getByRole('timer')).toBeVisible();
      
      // Should display a question with multiplication sign
      await expect(page.locator('text=×')).toBeVisible();
    });

    test('allows answering questions with keyboard input', async ({ page }) => {
      // Wait for game screen
      await expect(page.getByRole('timer')).toBeVisible();
      
      // Type answer in spinbutton (number input)
      const input = page.getByRole('spinbutton');
      await input.fill('10');
      
      // Wait for button to be enabled and submit answer
      const submitButton = page.getByRole('button', { name: /valider/i });
      await expect(submitButton).toBeEnabled();
      await submitButton.click();
    });

    test('allows skipping questions', async ({ page }) => {
      // Wait for game screen
      await expect(page.getByRole('timer')).toBeVisible();
      
      // Skip button should be visible
      const skipButton = page.getByRole('button', { name: /passer/i });
      await expect(skipButton).toBeVisible();
      
      // Click skip
      await skipButton.click();
      
      // Progress should update (now on question 2)
      await expect(page.getByRole('progressbar', { name: /question 2/i })).toBeVisible();
    });
  });

  test.describe('Complete Game Flow', () => {
    test('completes a full game and shows results', async ({ page }) => {
      // Start a game
      await page.getByPlaceholder(/entre ton nom/i).fill('E2EPlayer');
      await page.getByRole('button', { name: /apprenti/i }).click();
      
      // Wait for game screen
      await expect(page.getByRole('timer')).toBeVisible();
      
      // Skip all 15 questions quickly
      for (let i = 0; i < 15; i++) {
        await page.getByRole('button', { name: /passer/i }).click();
        // Wait for next question or results screen
        await page.waitForTimeout(100);
      }
      
      // Should show results screen with "Rejouer" button
      await expect(page.getByRole('button', { name: /rejouer/i })).toBeVisible({ timeout: 10000 });
      
      // Should show score
      await expect(page.getByRole('heading', { name: /0.*\/.*15/ })).toBeVisible();
      
      // Should show highscores
      await expect(page.getByText(/meilleurs scores/i)).toBeVisible();
    });

    test('allows playing again after completing game', async ({ page }) => {
      // Start and complete a game
      await page.getByPlaceholder(/entre ton nom/i).fill('E2EPlayer');
      await page.getByRole('button', { name: /apprenti/i }).click();
      
      // Skip all questions
      for (let i = 0; i < 15; i++) {
        await page.getByRole('button', { name: /passer/i }).click();
        await page.waitForTimeout(50);
      }
      
      // Wait for results
      await expect(page.getByRole('button', { name: /rejouer/i })).toBeVisible({ timeout: 10000 });
      
      // Click play again
      await page.getByRole('button', { name: /rejouer/i }).click();
      
      // Should be back at selection screen
      await expect(page.getByRole('button', { name: /apprenti/i })).toBeVisible();
    });

    test('allows changing difficulty after completing game', async ({ page }) => {
      // Start and complete a game
      await page.getByPlaceholder(/entre ton nom/i).fill('E2EPlayer');
      await page.getByRole('button', { name: /apprenti/i }).click();
      
      // Skip all questions
      for (let i = 0; i < 15; i++) {
        await page.getByRole('button', { name: /passer/i }).click();
        await page.waitForTimeout(50);
      }
      
      // Wait for results
      await expect(page.getByRole('button', { name: /changer de niveau/i })).toBeVisible({ timeout: 10000 });
      
      // Click change difficulty
      await page.getByRole('button', { name: /changer de niveau/i }).click();
      
      // Should be back at selection screen with all difficulty options
      await expect(page.getByRole('button', { name: /sorcier/i })).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('can navigate from home page to multiplication', async ({ page }) => {
      // Go to home page
      await page.goto('/');
      
      // Click multiplication card
      await page.getByRole('link', { name: /multiplication/i }).click();
      
      // Should be on multiplication page
      await expect(page).toHaveURL(/\/multiplication/);
      await expect(page.getByRole('heading', { name: /tables de multiplication/i })).toBeVisible();
    });
  });
});
