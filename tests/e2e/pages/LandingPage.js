import { BasePage } from './BasePage.js';

/**
 * LandingPage - Page Object Model pour index.html
 */
export class LandingPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.title = page.locator('h1');
    this.multiplicationLink = page.locator('a[href="table-de-multiplication.html"]');
    this.additionLink = page.locator('a[href="table-des-additions.html"]');
    this.subtractionLink = page.locator('a[href="table-des-soustractions.html"]');
    this.divisionLink = page.locator('a[href="table-des-divisions.html"]');
  }

  /**
   * Navigue vers la page d'accueil
   */
  async goto() {
    await super.goto('/index.html');
  }

  /**
   * Navigue vers la page de multiplication
   */
  async goToMultiplication() {
    await this.multiplicationLink.click();
    await this.page.waitForURL('**/table-de-multiplication.html');
  }

  /**
   * Navigue vers la page d'addition
   */
  async goToAddition() {
    await this.additionLink.click();
    await this.page.waitForURL('**/table-des-additions.html');
  }

  /**
   * Navigue vers la page de soustraction
   */
  async goToSubtraction() {
    await this.subtractionLink.click();
    await this.page.waitForURL('**/table-des-soustractions.html');
  }

  /**
   * Navigue vers la page de division
   */
  async goToDivision() {
    await this.divisionLink.click();
    await this.page.waitForURL('**/table-des-divisions.html');
  }

  /**
   * Vérifie que tous les liens sont visibles
   */
  async verifyAllLinksVisible() {
    await this.waitForVisible(this.multiplicationLink);
    await this.waitForVisible(this.additionLink);
    await this.waitForVisible(this.subtractionLink);
    await this.waitForVisible(this.divisionLink);
  }
}
