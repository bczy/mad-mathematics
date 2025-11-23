/**
 * BasePage - Classe de base pour les Page Object Models
 * Fournit des méthodes réutilisables pour toutes les pages
 */
export class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigue vers une URL relative
   * @param {string} path - Chemin relatif (ex: '/index.html')
   */
  async goto(path) {
    await this.page.goto(path);
  }

  /**
   * Attend qu'un élément soit visible
   * @param {import('@playwright/test').Locator} locator
   */
  async waitForVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  /**
   * Récupère le texte d'un élément
   * @param {import('@playwright/test').Locator} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    return await locator.textContent();
  }

  /**
   * Clique sur un élément
   * @param {import('@playwright/test').Locator} locator
   */
  async click(locator) {
    await locator.click();
  }

  /**
   * Remplit un champ de formulaire
   * @param {import('@playwright/test').Locator} locator
   * @param {string} value
   */
  async fill(locator, value) {
    await locator.fill(value);
  }

  /**
   * Vérifie si un élément est visible
   * @param {import('@playwright/test').Locator} locator
   * @returns {Promise<boolean>}
   */
  async isVisible(locator) {
    return await locator.isVisible();
  }
}
