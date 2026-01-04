import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Should have the correct title
  await expect(page).toHaveTitle(/Mad Mathematics/i);
  
  // Should have main content
  const main = page.locator('#root');
  await expect(main).toBeVisible();
  
  // Should display Mad Mathematics heading
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mad Mathematics');
  
  // Should display 4 game mode cards
  await expect(page.getByRole('link', { name: /multiplication/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /addition/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /soustraction/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /division/i })).toBeVisible();
});
