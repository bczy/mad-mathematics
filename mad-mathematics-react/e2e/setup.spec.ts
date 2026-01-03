import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Should have the Vite + React title
  await expect(page).toHaveTitle(/Vite \+ React/);
  
  // Should have main content
  const main = page.locator('#root');
  await expect(main).toBeVisible();
});
