import { test, expect } from '@playwright/test';
import { MultiplicationPage } from '../pages/MultiplicationPage.js';

test.describe('Multiplication Game - Happy Path', () => {
  test('should complete a perfect game (15/15)', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('PerfectPlayer', 'Sorcier');

    // Répondre correctement aux 15 questions
    for (let i = 0; i < 15; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
    }

    // Attendre les résultats
    await multiPage.waitForResults();

    // Vérifier le score
    const scoreText = await multiPage.getScore();
    expect(scoreText).toContain('15');
    expect(scoreText).toContain('15');

    // Vérifier que toutes les corrections sont marquées comme correctes
    const correctCount = await multiPage.countCorrectAnswers();
    expect(correctCount).toBe(15);

    // Vérifier qu'aucune réponse incorrecte
    const incorrectCount = await multiPage.countIncorrectAnswers();
    expect(incorrectCount).toBe(0);
  });

  test('should handle wrong answers correctly (12/15)', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('ErrorPlayer', 'Sorcier');

    // Répondre avec 3 erreurs volontaires aux 3 premières questions
    for (let i = 0; i < 15; i++) {
      if (i < 3) {
        // Mauvaise réponse
        await multiPage.answerQuestion(999);
      } else {
        // Bonne réponse
        const correctAnswer = await multiPage.getCorrectAnswer();
        await multiPage.answerQuestion(correctAnswer);
      }
    }

    // Attendre les résultats
    await multiPage.waitForResults();

    // Vérifier le score
    const scoreText = await multiPage.getScore();
    expect(scoreText).toContain('12');

    // Vérifier les corrections
    const correctCount = await multiPage.countCorrectAnswers();
    expect(correctCount).toBe(12);

    const incorrectCount = await multiPage.countIncorrectAnswers();
    expect(incorrectCount).toBe(3);

    // Vérifier que les corrections sont affichées
    const corrections = await multiPage.getCorrectionItems();
    expect(corrections.length).toBe(15);
  });
});

test.describe('Multiplication Game - Edge Cases', () => {
  test('should allow skipping questions', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('SkipPlayer', 'Sorcier');

    // Skip les 3 premières questions
    for (let i = 0; i < 3; i++) {
      await multiPage.skipQuestion();
    }

    // Répondre correctement aux 12 autres
    for (let i = 0; i < 12; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
    }

    // Attendre les résultats
    await multiPage.waitForResults();

    // Vérifier le score (12 bonnes réponses)
    const scoreText = await multiPage.getScore();
    expect(scoreText).toContain('12');

    // Vérifier les corrections
    const correctCount = await multiPage.countCorrectAnswers();
    expect(correctCount).toBe(12);

    const skippedCount = await multiPage.countSkippedQuestions();
    expect(skippedCount).toBe(3);
  });

  test('should handle timeout correctly', async ({ page }) => {
    // Ce test prend ~65 secondes, donc on augmente le timeout
    test.setTimeout(90000);

    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('TimeoutPlayer', 'Sorcier');

    // Répondre à seulement 5 questions
    for (let i = 0; i < 5; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
    }

    // Attendre l'expiration du timer (60 secondes + marge)
    // Le timer est configuré pour 60 secondes sur niveau Sorcier
    await multiPage.waitForResults();

    // Vérifier que le jeu est terminé
    await expect(multiPage.resultsSection).toBeVisible();

    // Vérifier le score (5 bonnes réponses)
    const scoreText = await multiPage.getScore();
    expect(scoreText).toContain('5');

    // Vérifier qu'il y a des questions skippées (non répondues)
    const skippedCount = await multiPage.countSkippedQuestions();
    expect(skippedCount).toBe(10); // 15 - 5 = 10 questions non répondues
  });

  test('should update progress counter correctly', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('ProgressPlayer', 'Sorcier');

    // Vérifier la progression initiale
    let progress = await multiPage.getProgress();
    expect(progress).toContain('1');
    expect(progress).toContain('15');

    // Répondre à quelques questions et vérifier la progression
    for (let i = 1; i <= 5; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);

      if (i < 5) {
        // Pas après la dernière réponse car on passe aux résultats
        progress = await multiPage.getProgress();
        expect(progress).toContain((i + 1).toString());
      }
    }

    // Finir le jeu
    for (let i = 5; i < 15; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
    }

    await multiPage.waitForResults();
  });

  test('should display timer correctly', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('TimerPlayer', 'Sorcier');

    // Vérifier que le timer est visible
    await expect(multiPage.timerDisplay).toBeVisible();

    // Attendre un peu et vérifier que le timer a changé
    const initialTime = await multiPage.getTimer();

    await page.waitForTimeout(2000);

    const updatedTime = await multiPage.getTimer();

    // Le timer devrait avoir changé (décompte)
    expect(updatedTime).not.toBe(initialTime);

    // Finir le jeu rapidement
    for (let i = 0; i < 15; i++) {
      const correctAnswer = await multiPage.getCorrectAnswer();
      await multiPage.answerQuestion(correctAnswer);
      await page.waitForTimeout(100);
    }

    await multiPage.waitForResults();
  });
});

test.describe('Multiplication Game - Difficulty Levels', () => {
  test('should start game with Apprenti difficulty', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('ApprentiPlayer', 'Apprenti');

    // Vérifier que le jeu démarre
    await expect(multiPage.gameArea).toBeVisible();
    await expect(multiPage.questionText).toBeVisible();

    // Le niveau Apprenti utilise les tables de 1 à 5
    // Vérifier une question
    const { num1, num2 } = await multiPage.parseCurrentQuestion();
    expect(num1).toBeGreaterThanOrEqual(1);
    expect(num1).toBeLessThanOrEqual(5);
    expect(num2).toBeGreaterThanOrEqual(1);
    expect(num2).toBeLessThanOrEqual(5);
  });

  test('should start game with Archimage difficulty', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);

    await multiPage.goto();
    await multiPage.startGame('ArchimagePlayer', 'Archimage');

    // Vérifier que le jeu démarre
    await expect(multiPage.gameArea).toBeVisible();
    await expect(multiPage.questionText).toBeVisible();

    // Le niveau Archimage utilise les tables de 1 à 12
    const { num1, num2 } = await multiPage.parseCurrentQuestion();
    expect(num1).toBeGreaterThanOrEqual(1);
    expect(num1).toBeLessThanOrEqual(12);
    expect(num2).toBeGreaterThanOrEqual(1);
    expect(num2).toBeLessThanOrEqual(12);
  });
});
