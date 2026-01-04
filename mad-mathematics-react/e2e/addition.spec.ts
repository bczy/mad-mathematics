import { test, expect } from '@playwright/test';

// T065: Playwright E2E test for AdditionPage

test.describe('Addition Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/addition');
  });

  test.describe('Selection Screen', () => {
    test('displays selection screen with all difficulty levels', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /école de magie des additions/i })).toBeVisible();
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

    test('displays addition question', async ({ page }) => {
      await expect(page.getByRole('timer')).toBeVisible();
      await expect(page.locator('text=+')).toBeVisible();
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
      for (let i = 0; i < 20; i++) {
        await page.getByRole('button', { name: /passer/i }).click();
        await page.waitForTimeout(100);
      }
      
      await expect(page.getByRole('button', { name: /rejouer/i })).toBeVisible({ timeout: 10000 });
      await expect(page.getByRole('heading', { name: /0.*\/.*20/ })).toBeVisible();
    });
  });

  test.describe('Unlimited Time Mode', () => {
    test('Super-Multi mode has no timer', async ({ page }) => {
      await page.getByPlaceholder(/entre ton nom/i).fill('E2EPlayer');
      await page.getByRole('button', { name: /super-multi/i }).click();
      
      // Should show the addition question
      await expect(page.locator('text=+')).toBeVisible();
      
      // Timer should not be visible for unlimited time
      await expect(page.getByRole('timer')).not.toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('can navigate from home page to addition', async ({ page }) => {
      await page.goto('/');
      
      await page.getByRole('link', { name: /addition/i }).click();
      
      await expect(page).toHaveURL(/\/addition/);
      await expect(page.getByRole('heading', { name: /école de magie des additions/i })).toBeVisible();
    });
  });
});
