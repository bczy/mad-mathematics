/**
 * Storage Helper - Fonctions utilitaires pour interagir avec localStorage
 */

/**
 * Nettoie tout le localStorage
 * @param {import('@playwright/test').Page} page
 */
export async function clearLocalStorage(page) {
  await page.evaluate(() => localStorage.clear());
}

/**
 * Récupère une valeur du localStorage
 * @param {import('@playwright/test').Page} page
 * @param {string} key
 * @returns {Promise<any>}
 */
export async function getLocalStorageItem(page, key) {
  return await page.evaluate((key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }, key);
}

/**
 * Définit une valeur dans le localStorage
 * @param {import('@playwright/test').Page} page
 * @param {string} key
 * @param {any} value
 */
export async function setLocalStorageItem(page, key, value) {
  await page.evaluate(
    ({ key, value }) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    { key, value },
  );
}

/**
 * Récupère les highscores pour un niveau donné
 * @param {import('@playwright/test').Page} page
 * @param {string} level
 * @returns {Promise<Array>}
 */
export async function getHighscores(page, level) {
  const key = `highscores_${level}`;
  return (await getLocalStorageItem(page, key)) || [];
}

/**
 * Récupère le nom du joueur stocké
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<string|null>}
 */
export async function getPlayerName(page) {
  return await page.evaluate(() => localStorage.getItem('playerName'));
}

/**
 * Définit le nom du joueur
 * @param {import('@playwright/test').Page} page
 * @param {string} name
 */
export async function setPlayerName(page, name) {
  await page.evaluate((name) => localStorage.setItem('playerName', name), name);
}

/**
 * Vérifie si un highscore existe pour un joueur
 * @param {import('@playwright/test').Page} page
 * @param {string} level
 * @param {string} playerName
 * @returns {Promise<boolean>}
 */
export async function hasHighscoreForPlayer(page, level, playerName) {
  const highscores = await getHighscores(page, level);
  return highscores.some((score) => score.name === playerName);
}
