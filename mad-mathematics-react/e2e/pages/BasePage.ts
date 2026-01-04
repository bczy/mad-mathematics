/**
 * Base Page Object - Mad Mathematics
 * Common functionality for all page objects
 */

import { type Page, type Locator } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /**
   * Navigate to a specific path
   */
  async goto(path: string = '/'): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Check if an element is visible
   */
  async isVisible(selector: string): Promise<boolean> {
    return this.page.locator(selector).isVisible();
  }

  /**
   * Take a screenshot
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Get element by test ID
   */
  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  /**
   * Get element by role
   */
  getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
    return this.page.getByRole(role, options);
  }

  /**
   * Get element by text
   */
  getByText(text: string | RegExp): Locator {
    return this.page.getByText(text);
  }
}
