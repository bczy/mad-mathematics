import { test, expect } from '@playwright/test';
import { MultiplicationPage } from '../pages/MultiplicationPage.js';
import {
  clearLocalStorage,
  getPlayerName,
  getHighscores,
  hasHighscoreForPlayer,
} from '../helpers/storage-helper.js';

test.describe('LocalStorage Persistence', () => {
  test.beforeEach(async ({ page }) => {
    // Nettoyer le localStorage avant chaque test
    await page.goto('/index.html');
    await clearLocalStorage(page);
  });

  test('should persist player name across page reloads', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();

    // Saisir un nom de joueur
    await multiPage.playerNameInput.fill('PersistentPlayer');

    // Attendre un peu pour la sauvegarde
    await page.waitForTimeout(500);

    // Recharger la page
    await page.reload();

    // Vérifier que le nom est pré-rempli
    await expect(multiPage.playerNameInput).toHaveValue('PersistentPlayer');

    // Vérifier via localStorage directement
    const storedName = await getPlayerName(page);
    expect(storedName).toBe('PersistentPlayer');
  });

  test('should persist highscores across page reloads', async ({
    page,
    context,
  }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('TopPlayer', 'Sorcier');

    // Jouer une partie parfaite rapidement
    for (let i = 0; i < 15; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
      await page.waitForTimeout(100);
    }

    // Attendre les résultats
    await multiPage.waitForResults();

    // Vérifier que le highscore est visible
    const hasHighscore = await multiPage.hasHighscoreForPlayer('TopPlayer');
    expect(hasHighscore).toBe(true);

    // Vérifier dans localStorage
    const hasStoredHighscore = await hasHighscoreForPlayer(
      page,
      'moyen',
      'TopPlayer',
    );
    expect(hasStoredHighscore).toBe(true);

    // Recharger la page
    await page.reload();

    // Démarrer un nouveau jeu avec le même niveau
    await multiPage.startGame('AnotherPlayer', 'Sorcier');

    // Passer rapidement toutes les questions
    for (let i = 0; i < 15; i++) {
      await multiPage.skipQuestion();
      await page.waitForTimeout(100);
    }

    await multiPage.waitForResults();

    // Vérifier que le highscore de TopPlayer est toujours là
    const stillHasHighscore = await multiPage.hasHighscoreForPlayer('TopPlayer');
    expect(stillHasHighscore).toBe(true);
  });

  test('should store multiple highscores up to 5', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    // Créer 6 highscores pour tester la limite de 5
    const players = [
      'Player1',
      'Player2',
      'Player3',
      'Player4',
      'Player5',
      'Player6',
    ];

    for (const playerName of players) {
      await multiPage.goto();
      await multiPage.startGame(playerName, 'Sorcier');

      // Jouer une partie (score variable pour éviter les égalités)
      const questionsToAnswer = 15 - players.indexOf(playerName);
      for (let i = 0; i < questionsToAnswer; i++) {
        const correctAnswer = await multiPage.getCorrectAnswer();
        await multiPage.answerQuestion(correctAnswer);
        await page.waitForTimeout(50);
      }

      // Skip le reste
      for (let i = questionsToAnswer; i < 15; i++) {
        await multiPage.skipQuestion();
        await page.waitForTimeout(50);
      }

      await multiPage.waitForResults();
    }

    // Vérifier que seulement 5 highscores sont stockés
    const highscores = await getHighscores(page, 'moyen');
    expect(highscores.length).toBeLessThanOrEqual(5);

    // Le pire score (Player6) ne devrait pas être dans le top 5
    const hasPlayer6 = await hasHighscoreForPlayer(page, 'moyen', 'Player6');
    expect(hasPlayer6).toBe(false);

    // Les meilleurs scores devraient être là
    const hasPlayer1 = await hasHighscoreForPlayer(page, 'moyen', 'Player1');
    expect(hasPlayer1).toBe(true);
  });

  test('should clear localStorage and show empty highscores', async ({
    page,
  }) => {
    const multiPage = new MultiplicationPage(page);

    // D'abord créer un highscore
    await multiPage.goto();
    await multiPage.startGame('ClearTestPlayer', 'Sorcier');

    for (let i = 0; i < 15; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
      await page.waitForTimeout(100);
    }

    await multiPage.waitForResults();

    // Vérifier que le highscore existe
    let hasHighscore = await hasHighscoreForPlayer(
      page,
      'moyen',
      'ClearTestPlayer',
    );
    expect(hasHighscore).toBe(true);

    // Nettoyer le localStorage
    await clearLocalStorage(page);

    // Recharger et vérifier
    await page.reload();

    // Démarrer un nouveau jeu
    await multiPage.startGame('NewPlayer', 'Sorcier');

    // Skip toutes les questions
    for (let i = 0; i < 15; i++) {
      await multiPage.skipQuestion();
      await page.waitForTimeout(50);
    }

    await multiPage.waitForResults();

    // Vérifier que l'ancien highscore n'est plus là
    hasHighscore = await hasHighscoreForPlayer(
      page,
      'moyen',
      'ClearTestPlayer',
    );
    expect(hasHighscore).toBe(false);

    // Vérifier que les highscores sont vides (sauf le nouveau)
    const highscores = await getHighscores(page, 'moyen');
    expect(highscores.length).toBe(1); // Seulement NewPlayer
  });

  test('should handle different difficulty levels separately', async ({
    page,
  }) => {
    const multiPage = new MultiplicationPage(page);

    // Créer un highscore pour niveau Apprenti
    await multiPage.goto();
    await multiPage.startGame('ApprentiPlayer', 'Apprenti');

    for (let i = 0; i < 15; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
      await page.waitForTimeout(100);
    }

    await multiPage.waitForResults();

    // Créer un highscore pour niveau Archimage
    await multiPage.goto();
    await multiPage.startGame('ArchimagePlayer', 'Archimage');

    for (let i = 0; i < 15; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
      await page.waitForTimeout(100);
    }

    await multiPage.waitForResults();

    // Vérifier que les highscores sont séparés
    const apprentiHasScore = await hasHighscoreForPlayer(
      page,
      'facile',
      'ApprentiPlayer',
    );
    expect(apprentiHasScore).toBe(true);

    const archimageHasScore = await hasHighscoreForPlayer(
      page,
      'difficile',
      'ArchimagePlayer',
    );
    expect(archimageHasScore).toBe(true);

    // Vérifier que ApprentiPlayer n'est pas dans Archimage et vice-versa
    const apprentiInArchimage = await hasHighscoreForPlayer(
      page,
      'difficile',
      'ApprentiPlayer',
    );
    expect(apprentiInArchimage).toBe(false);

    const archimageInApprenti = await hasHighscoreForPlayer(
      page,
      'facile',
      'ArchimagePlayer',
    );
    expect(archimageInApprenti).toBe(false);
  });
});
