import { test, expect } from '@playwright/test';

test.describe('Setup verification', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Should have the Vite + React title
    await expect(page).toHaveTitle(/Vite \+ React/);
    
    // Should have main content
    const main = page.locator('#root');
    await expect(main).toBeVisible();
  });
});
