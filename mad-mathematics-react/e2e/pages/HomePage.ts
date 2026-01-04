/**
 * Home Page Object - Mad Mathematics
 * Page object for the main landing page
 */

import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // Locators
  readonly heading: Locator;
  readonly multiplicationLink: Locator;
  readonly additionLink: Locator;
  readonly subtractionLink: Locator;
  readonly divisionLink: Locator;

  constructor(page: Page) {
    super(page);

    this.heading = page.getByRole('heading', { level: 1 });
    this.multiplicationLink = page.getByRole('link', { name: /multiplication/i });
    this.additionLink = page.getByRole('link', { name: /addition/i });
    this.subtractionLink = page.getByRole('link', { name: /soustraction/i });
    this.divisionLink = page.getByRole('link', { name: /division/i });
  }

  /**
   * Navigate to home page
   */
  async goto(): Promise<void> {
    await super.goto('/');
  }

  /**
   * Check if all game links are visible
   */
  async expectAllGameLinksVisible(): Promise<void> {
    await expect(this.multiplicationLink).toBeVisible();
    await expect(this.additionLink).toBeVisible();
    await expect(this.subtractionLink).toBeVisible();
    await expect(this.divisionLink).toBeVisible();
  }

  /**
   * Navigate to multiplication game
   */
  async goToMultiplication(): Promise<void> {
    await this.multiplicationLink.click();
  }

  /**
   * Navigate to addition game
   */
  async goToAddition(): Promise<void> {
    await this.additionLink.click();
  }

  /**
   * Navigate to subtraction game
   */
  async goToSubtraction(): Promise<void> {
    await this.subtractionLink.click();
  }

  /**
   * Navigate to division game
   */
  async goToDivision(): Promise<void> {
    await this.divisionLink.click();
  }
}
