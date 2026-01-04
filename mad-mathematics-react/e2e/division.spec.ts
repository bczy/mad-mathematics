import { test, expect } from '@playwright/test';

// T073: Playwright E2E test for DivisionPage

test.describe('Division Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/division');
  });

  test.describe('Selection Screen', () => {
    test('displays selection screen with all difficulty levels', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /école de magie des divisions/i })).toBeVisible();
      await expect(page.getByPlaceholder(/entre ton nom/i)).toBeVisible();
      
      await expect(page.getByRole('button', { name: /apprenti/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /confirmé/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /grand/i })).toBeVisible();
      await expect(page.getByRole('button', { name: /super-multi/i })).toBeVisible();
    });

    test('starts game when difficulty is selected', async ({ page }) => {
      await page.getByPlaceholder(/entre ton nom/i).fill('E2EPlayer');
      await page.getByRole('button', { name: /apprenti/i }).click();
      
      await expect(page.getByRole('timer')).toBeVisible();
    });
  });

  test.describe('Game Screen', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByPlaceholder(/entre ton nom/i).fill('E2EPlayer');
      await page.getByRole('button', { name: /apprenti/i }).click();
    });

    test('displays division question', async ({ page }) => {
      await expect(page.getByRole('timer')).toBeVisible();
      await expect(page.locator('text=÷')).toBeVisible();
    });

    test('allows skipping questions', async ({ page }) => {
      await expect(page.getByRole('timer')).toBeVisible();
      
      const skipButton = page.getByRole('button', { name: /passer/i });
      await skipButton.click();
      
      await expect(page.getByRole('progressbar', { name: /question 2/i })).toBeVisible();
    });
  });

  test.describe('Complete Game Flow', () => {
    test('completes a full game and shows results', async ({ page }) => {
      await page.getByPlaceholder(/entre ton nom/i).fill('E2EPlayer');
      await page.getByRole('button', { name: /apprenti/i }).click();
      
      await expect(page.getByRole('timer')).toBeVisible();
      
      // Skip all 20 questions
      const skipButton = page.getByRole('button', { name: /passer/i });
      for (let i = 0; i < 20; i++) {
        await skipButton.click();
        // Wait for next question (progressbar changes) or results screen appears
        if (i < 19) {
          await expect(page.getByRole('progressbar', { name: new RegExp(`question ${i + 2}`, 'i') })).toBeVisible();
        }
      }
      
      await expect(page.getByRole('button', { name: /rejouer/i })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('heading', { name: /0.*\/.*20/ })).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('can navigate from home page to division', async ({ page }) => {
      await page.goto('/');
      
      await page.getByRole('link', { name: /division/i }).click();
      
      await expect(page).toHaveURL(/\/division/);
      await expect(page.getByRole('heading', { name: /école de magie des divisions/i })).toBeVisible();
    });
  });
});
