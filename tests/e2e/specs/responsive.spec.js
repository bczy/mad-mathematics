import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage.js';
import { MultiplicationPage } from '../pages/MultiplicationPage.js';

test.describe('Responsive - Mobile 360px', () => {
  test.use({ viewport: { width: 360, height: 640 } });

  test('should display landing page correctly on mobile', async ({ page }) => {
    const landingPage = new LandingPage(page);

    await landingPage.goto();

    // Vérifier que le titre est visible
    await expect(landingPage.title).toBeVisible();

    // Vérifier pas de défilement horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(360);

    // Vérifier que les boutons sont visibles
    await expect(landingPage.multiplicationLink).toBeVisible();
    await expect(landingPage.additionLink).toBeVisible();
  });

  test('should display multiplication game correctly on mobile', async ({
    page,
  }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();

    // Vérifier pas de défilement horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(360);

    // Vérifier que les éléments sont visibles et cliquables
    await expect(multiPage.playerNameInput).toBeVisible();
    await expect(multiPage.difficultyButtons.first()).toBeVisible();

    // Démarrer le jeu
    await multiPage.startGame('MobilePlayer', 'Sorcier');

    // Vérifier que la zone de jeu est visible
    await expect(multiPage.gameArea).toBeVisible();

    // Vérifier que la barre de progression reste dans le conteneur
    const progressBarBox =
      await multiPage.timeProgressFill.boundingBox();
    if (progressBarBox) {
      expect(progressBarBox.x).toBeGreaterThanOrEqual(0);
      expect(progressBarBox.x + progressBarBox.width).toBeLessThanOrEqual(360);
    }

    // Vérifier que le champ de réponse est visible et accessible
    await expect(multiPage.answerInput).toBeVisible();
    const answerInputBox = await multiPage.answerInput.boundingBox();
    if (answerInputBox) {
      expect(answerInputBox.width).toBeLessThanOrEqual(360);
    }

    // Vérifier que les boutons sont visibles
    await expect(multiPage.submitButton).toBeVisible();
    await expect(multiPage.skipButton).toBeVisible();
  });

  test('should complete a game on mobile viewport', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('MobileGamePlayer', 'Sorcier');

    // Jouer une partie complète
    for (let i = 0; i < 15; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
      await page.waitForTimeout(100);
    }

    // Attendre les résultats
    await multiPage.waitForResults();

    // Vérifier que les résultats sont affichés correctement
    await expect(multiPage.resultsSection).toBeVisible();
    await expect(multiPage.scoreDisplay).toBeVisible();

    // Vérifier pas de défilement horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(360);

    // Vérifier que la liste des highscores est visible
    await expect(multiPage.highscoreList).toBeVisible();
  });

  test('should display results and corrections correctly on mobile', async ({
    page,
  }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('MobileResultsPlayer', 'Sorcier');

    // Jouer avec quelques erreurs
    for (let i = 0; i < 15; i++) {
      if (i < 3) {
        await multiPage.answerQuestion(999);
      } else {
        const correctAnswer = await multiPage.getCorrectAnswer();
        await multiPage.answerQuestion(correctAnswer);
      }
      await page.waitForTimeout(100);
    }

    await multiPage.waitForResults();

    // Vérifier que la liste de correction est visible
    await expect(multiPage.correctionList).toBeVisible();

    // Vérifier que les éléments de correction ne débordent pas
    const correctionItems =
      await multiPage.correctionList.locator('.correction-item').all();
    expect(correctionItems.length).toBeGreaterThan(0);

    for (const item of correctionItems.slice(0, 3)) {
      const box = await item.boundingBox();
      if (box) {
        expect(box.x + box.width).toBeLessThanOrEqual(360);
      }
    }
  });
});

test.describe('Responsive - Desktop 1280px', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('should display landing page correctly on desktop', async ({ page }) => {
    const landingPage = new LandingPage(page);

    await landingPage.goto();

    // Vérifier que le titre est visible
    await expect(landingPage.title).toBeVisible();

    // Vérifier que tous les liens sont visibles
    await landingPage.verifyAllLinksVisible();

    // Vérifier le centrage du contenu
    const card = page.locator('.card');
    await expect(card).toBeVisible();

    const cardBox = await card.boundingBox();
    if (cardBox) {
      // Le contenu devrait être centré avec des marges
      expect(cardBox.x).toBeGreaterThan(100);
      expect(cardBox.width).toBeLessThan(1280);
    }
  });

  test('should display multiplication game correctly on desktop', async ({
    page,
  }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();

    // Vérifier que les éléments sont visibles
    await expect(multiPage.playerNameInput).toBeVisible();
    await expect(multiPage.difficultyButtons.first()).toBeVisible();

    // Démarrer le jeu
    await multiPage.startGame('DesktopPlayer', 'Sorcier');

    // Vérifier que la zone de jeu est visible
    await expect(multiPage.gameArea).toBeVisible();

    // Vérifier le centrage du champ de réponse
    const answerInputBox = await multiPage.answerInput.boundingBox();
    if (answerInputBox) {
      // Le champ devrait être centré avec des marges
      expect(answerInputBox.x).toBeGreaterThan(200);
    }

    // Vérifier que la barre de progression est bien visible
    await expect(multiPage.timeProgressFill).toBeVisible();
  });

  test('should complete a game on desktop viewport', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('DesktopGamePlayer', 'Sorcier');

    // Jouer une partie complète
    for (let i = 0; i < 15; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
      await page.waitForTimeout(100);
    }

    // Attendre les résultats
    await multiPage.waitForResults();

    // Vérifier que les résultats sont affichés correctement
    await expect(multiPage.resultsSection).toBeVisible();
    await expect(multiPage.scoreDisplay).toBeVisible();

    // Vérifier que la liste des highscores est visible
    await expect(multiPage.highscoreList).toBeVisible();

    // Vérifier que les corrections sont affichées
    await expect(multiPage.correctionList).toBeVisible();
  });

  test('should display multiple difficulty buttons in a row on desktop', async ({
    page,
  }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();

    // Sur desktop, les boutons de difficulté devraient être côte à côte
    const buttons = await multiPage.difficultyButtons.all();
    expect(buttons.length).toBe(3); // Apprenti, Sorcier, Archimage

    // Vérifier qu'ils sont tous visibles
    for (const button of buttons) {
      await expect(button).toBeVisible();
    }

    // Vérifier leur position (devraient avoir des X différents si en ligne)
    const positions = [];
    for (const button of buttons) {
      const box = await button.boundingBox();
      if (box) {
        positions.push(box.x);
      }
    }

    // Si en ligne, les positions X devraient être différentes et croissantes
    // (ou au moins pas toutes identiques)
    const uniquePositions = new Set(positions);
    expect(uniquePositions.size).toBeGreaterThan(1);
  });
});

test.describe('Responsive - Tablet 768px', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('should display correctly on tablet', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();

    // Vérifier pas de défilement horizontal
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768);

    // Vérifier que les éléments sont visibles
    await expect(multiPage.playerNameInput).toBeVisible();
    await expect(multiPage.difficultyButtons.first()).toBeVisible();

    // Démarrer et jouer une partie
    await multiPage.startGame('TabletPlayer', 'Sorcier');

    await expect(multiPage.gameArea).toBeVisible();

    // Jouer rapidement
    for (let i = 0; i < 15; i++) {
      await multiPage.skipQuestion();
      await page.waitForTimeout(50);
    }

    await multiPage.waitForResults();
    await expect(multiPage.resultsSection).toBeVisible();
  });
});
