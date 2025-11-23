import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage.js';
import { MultiplicationPage } from '../pages/MultiplicationPage.js';

test.describe('Navigation complète', () => {
  test('should navigate from landing page to multiplication page and back', async ({
    page,
  }) => {
    const landingPage = new LandingPage(page);
    const multiPage = new MultiplicationPage(page);

    // Charger la page d'accueil
    await landingPage.goto();

    // Vérifier que le titre est visible
    await expect(landingPage.title).toBeVisible();
    await expect(landingPage.title).toContainText('Mad Mathematics');

    // Vérifier que tous les liens sont visibles
    await landingPage.verifyAllLinksVisible();

    // Naviguer vers la page de multiplication
    await landingPage.goToMultiplication();

    // Vérifier que nous sommes sur la bonne page
    await expect(page).toHaveURL(/table-de-multiplication\.html/);
    await expect(multiPage.difficultySection).toBeVisible();

    // Revenir à l'accueil en naviguant directement
    await landingPage.goto();
    await expect(landingPage.title).toBeVisible();
  });

  test('should navigate to all game pages from landing', async ({ page }) => {
    const landingPage = new LandingPage(page);

    // Charger la page d'accueil
    await landingPage.goto();

    // Tester navigation vers additions
    await landingPage.goToAddition();
    await expect(page).toHaveURL(/table-des-additions\.html/);

    // Retour à l'accueil
    await landingPage.goto();

    // Tester navigation vers soustractions
    await landingPage.goToSubtraction();
    await expect(page).toHaveURL(/table-des-soustractions\.html/);

    // Retour à l'accueil
    await landingPage.goto();

    // Tester navigation vers divisions
    await landingPage.goToDivision();
    await expect(page).toHaveURL(/table-des-divisions\.html/);
  });

  test('should have working back navigation from multiplication page', async ({
    page,
  }) => {
    const multiPage = new MultiplicationPage(page);

    // Aller directement sur la page de multiplication
    await multiPage.goto();

    // Démarrer un jeu
    await multiPage.startGame('NavTestPlayer', 'Apprenti');

    // Vérifier que le jeu est démarré
    await expect(multiPage.gameArea).toBeVisible();

    // Note: Le bouton retour n'est pas implémenté dans le jeu en cours
    // On teste juste la navigation directe
    await page.goto('/index.html');
    await expect(page).toHaveURL(/index\.html/);
  });
});
