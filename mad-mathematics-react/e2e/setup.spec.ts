import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Should have the correct title
  await expect(page).toHaveTitle(/mad-mathematics-react/);
  
  // Should have main content
  const main = page.locator('#root');
  await expect(main).toBeVisible();
  
  // Should display Vite + React heading
  await expect(page.locator('h1')).toContainText('Vite + React');
});
