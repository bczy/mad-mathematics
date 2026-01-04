/**
 * Visual Regression Tests - Mad Mathematics
 * 
 * Captures screenshots of key UI states to detect visual changes.
 * Uses Playwright's built-in screenshot comparison.
 */

import { test, expect } from '@playwright/test';

// Configure visual comparison options
const VISUAL_COMPARISON_OPTIONS = {
  maxDiffPixels: 100, // Allow small differences for anti-aliasing
  threshold: 0.2, // Tolerance for pixel differences
};

test.describe('Visual Regression - Homepage', () => {
  test('homepage renders correctly', async ({ page }) => {
    await page.goto('/');
    
    // Wait for animations to complete
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage.png', VISUAL_COMPARISON_OPTIONS);
  });
  
  test('homepage on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('homepage-mobile.png', VISUAL_COMPARISON_OPTIONS);
  });
});

test.describe('Visual Regression - Multiplication Page', () => {
  test('difficulty selection screen', async ({ page }) => {
    await page.goto('/multiplication');
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('multiplication-selection.png', VISUAL_COMPARISON_OPTIONS);
  });
  
  // Skip game in progress - contains dynamic content (random questions, timer)
  test.skip('game in progress', async ({ page }) => {
    await page.goto('/multiplication');
    
    // Enter player name
    const playerInput = page.getByRole('textbox', { name: /nom/i });
    await playerInput.fill('TestPlayer');
    
    // Select difficulty
    await page.getByRole('button', { name: /apprenti/i }).click();
    
    // Wait for game to start
    await expect(page.getByText(/question 1/i)).toBeVisible();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('multiplication-game.png', VISUAL_COMPARISON_OPTIONS);
  });
  
  // Skip results screen - contains dynamic content (score, time)
  test.skip('results screen', async ({ page }) => {
    await page.goto('/multiplication');
    
    // Enter player name
    const playerInput = page.getByRole('textbox', { name: /nom/i });
    await playerInput.fill('TestPlayer');
    
    // Select Apprenti difficulty (tables 1-5, easier to complete)
    await page.getByRole('button', { name: /apprenti/i }).click();
    
    // Answer all 15 questions
    for (let i = 0; i < 15; i++) {
      const questionText = await page.getByRole('heading', { level: 2 }).textContent();
      if (questionText) {
        // Extract numbers from question like "7 × 3 = ?"
        const match = questionText.match(/(\d+)\s*×\s*(\d+)/);
        if (match) {
          const answer = parseInt(match[1]) * parseInt(match[2]);
          const input = page.getByRole('textbox');
          await input.fill(answer.toString());
          await page.getByRole('button', { name: /valider/i }).click();
          await page.waitForTimeout(100);
        }
      }
    }
    
    // Wait for results screen
    await expect(page.getByText(/résultats/i)).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('multiplication-results.png', VISUAL_COMPARISON_OPTIONS);
  });
});

test.describe('Visual Regression - Addition Page', () => {
  test('difficulty selection screen', async ({ page }) => {
    await page.goto('/addition');
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('addition-selection.png', VISUAL_COMPARISON_OPTIONS);
  });
  
  // Skip game in progress - contains dynamic content (random questions, timer)
  test.skip('game in progress', async ({ page }) => {
    await page.goto('/addition');
    
    // Enter player name and start game
    const playerInput = page.getByRole('textbox', { name: /nom/i });
    await playerInput.fill('TestPlayer');
    
    await page.getByRole('button', { name: /apprenti/i }).click();
    
    await expect(page.getByText(/question 1/i)).toBeVisible();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('addition-game.png', VISUAL_COMPARISON_OPTIONS);
  });
});

test.describe('Visual Regression - Soustraction Page', () => {
  test('difficulty selection screen', async ({ page }) => {
    await page.goto('/soustraction');
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('soustraction-selection.png', VISUAL_COMPARISON_OPTIONS);
  });
  
  // Skip game in progress - contains dynamic content (random questions, timer)
  test.skip('game in progress', async ({ page }) => {
    await page.goto('/soustraction');
    
    // Enter player name and start game
    const playerInput = page.getByRole('textbox', { name: /nom/i });
    await playerInput.fill('TestPlayer');
    
    await page.getByRole('button', { name: /apprenti/i }).click();
    
    await expect(page.getByText(/question 1/i)).toBeVisible();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('soustraction-game.png', VISUAL_COMPARISON_OPTIONS);
  });
});

test.describe('Visual Regression - Division Page', () => {
  test('difficulty selection screen', async ({ page }) => {
    await page.goto('/division');
    
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('division-selection.png', VISUAL_COMPARISON_OPTIONS);
  });
  
  // Skip game in progress - contains dynamic content (random questions, timer)
  test.skip('game in progress', async ({ page }) => {
    await page.goto('/division');
    
    // Enter player name and start game
    const playerInput = page.getByRole('textbox', { name: /nom/i });
    await playerInput.fill('TestPlayer');
    
    await page.getByRole('button', { name: /apprenti/i }).click();
    
    await expect(page.getByText(/question 1/i)).toBeVisible();
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('division-game.png', VISUAL_COMPARISON_OPTIONS);
  });
});

test.describe('Visual Regression - Components', () => {
  // Skip - highscore table depends on localStorage state
  test.skip('highscore table with medals', async ({ page }) => {
    await page.goto('/multiplication');
    
    // Add some highscores via localStorage
    await page.evaluate(() => {
      const highscores = [
        { name: 'Alice', score: 15, time: 45, date: new Date().toISOString() },
        { name: 'Bob', score: 14, time: 50, date: new Date().toISOString() },
        { name: 'Charlie', score: 13, time: 55, date: new Date().toISOString() },
        { name: 'David', score: 12, time: 60, date: new Date().toISOString() },
        { name: 'Eve', score: 11, time: 65, date: new Date().toISOString() },
      ];
      localStorage.setItem('highscores_multiplication_apprenti', JSON.stringify(highscores));
    });
    
    // Reload to show highscores
    await page.reload();
    await page.waitForTimeout(500);
    
    // Find and screenshot the highscore section
    const highscoreSection = page.locator('.space-y-2').first();
    if (await highscoreSection.isVisible()) {
      await expect(highscoreSection).toHaveScreenshot('highscore-table.png', VISUAL_COMPARISON_OPTIONS);
    }
  });
  
  // Skip - progress bar state is dynamic
  test.skip('progress bar states', async ({ page }) => {
    await page.goto('/multiplication');
    
    // Start game
    const playerInput = page.getByRole('textbox', { name: /nom/i });
    await playerInput.fill('TestPlayer');
    await page.getByRole('button', { name: /apprenti/i }).click();
    
    // Wait for timer to be visible
    await expect(page.getByText(/60/)).toBeVisible();
    
    // Screenshot the progress bar area
    const progressBar = page.locator('[role="progressbar"]');
    if (await progressBar.isVisible()) {
      await expect(progressBar).toHaveScreenshot('progress-bar-full.png', VISUAL_COMPARISON_OPTIONS);
    }
  });
});

test.describe('Visual Regression - Responsive Breakpoints', () => {
  const viewports = [
    { name: 'mobile-sm', width: 320, height: 568 },
    { name: 'mobile-md', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'desktop-lg', width: 1920, height: 1080 },
  ];
  
  for (const viewport of viewports) {
    test(`homepage at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot(`homepage-${viewport.name}.png`, VISUAL_COMPARISON_OPTIONS);
    });
  }
});
