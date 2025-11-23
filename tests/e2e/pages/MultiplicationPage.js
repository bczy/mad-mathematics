import { BasePage } from './BasePage.js';

/**
 * MultiplicationPage - Page Object Model pour table-de-multiplication.html
 */
export class MultiplicationPage extends BasePage {
  constructor(page) {
    super(page);

    // Difficulty selection selectors
    this.difficultySection = page.locator('#difficulty-selection');
    this.playerNameInput = page.locator('#player-name');
    this.difficultyButtons = page.locator('.difficulty-btn');

    // Game area selectors
    this.gameArea = page.locator('#game-area');
    this.progressText = page.locator('#progress');
    this.timerDisplay = page.locator('#timer');
    this.timeProgressFill = page.locator('#time-progress-fill');
    this.timeProgressLabel = page.locator('#time-progress-label');
    this.questionText = page.locator('#question');
    this.feedbackText = page.locator('#feedback');
    this.answerInput = page.locator('#answer-input');
    this.submitButton = page.locator('#submit-btn');
    this.skipButton = page.locator('#skip-btn');

    // Results selectors
    this.resultsSection = page.locator('#results');
    this.resultEmoji = page.locator('#result-emoji');
    this.resultMessage = page.locator('#result-message');
    this.scoreDisplay = page.locator('#score');
    this.resultDetails = page.locator('#result-details');
    this.newHighscoreMessage = page.locator('#new-highscore-message');
    this.correctionList = page.locator('#correction-list');
    this.highscoreList = page.locator('#highscore-list');
    this.homeButton = page.locator('button:has-text("Retour à l\'accueil")');
  }

  /**
   * Navigue vers la page de multiplication
   */
  async goto() {
    await super.goto('/table-de-multiplication.html');
  }

  /**
   * Démarre le jeu avec un nom de joueur et une difficulté
   * @param {string} playerName - Nom du joueur
   * @param {string} difficulty - Difficulté ('Apprenti', 'Sorcier', 'Archimage')
   */
  async startGame(playerName, difficulty = 'Sorcier') {
    await this.playerNameInput.fill(playerName);

    // Trouver et cliquer sur le bouton de difficulté approprié
    const difficultyButton = this.page.locator(
      `button.difficulty-btn:has-text("${difficulty}")`,
    );
    await difficultyButton.click();

    // Attendre que la zone de jeu soit visible
    await this.waitForVisible(this.gameArea);
  }

  /**
   * Répond à une question
   * @param {number} answer - Réponse à donner
   */
  async answerQuestion(answer) {
    await this.answerInput.fill(answer.toString());
    await this.submitButton.click();
  }

  /**
   * Passe une question
   */
  async skipQuestion() {
    await this.skipButton.click();
  }

  /**
   * Récupère le texte de la question actuelle
   * @returns {Promise<string>}
   */
  async getCurrentQuestion() {
    return await this.questionText.textContent();
  }

  /**
   * Parse la question pour extraire les nombres
   * @returns {Promise<{num1: number, num2: number}>}
   */
  async parseCurrentQuestion() {
    const questionText = await this.getCurrentQuestion();
    const match = questionText.match(/(\d+)\s*×\s*(\d+)/);
    if (!match) {
      throw new Error(`Could not parse question: ${questionText}`);
    }
    return {
      num1: parseInt(match[1]),
      num2: parseInt(match[2]),
    };
  }

  /**
   * Calcule la réponse correcte pour la question actuelle
   * @returns {Promise<number>}
   */
  async getCorrectAnswer() {
    const { num1, num2 } = await this.parseCurrentQuestion();
    return num1 * num2;
  }

  /**
   * Récupère le score affiché
   * @returns {Promise<string>}
   */
  async getScore() {
    return await this.scoreDisplay.textContent();
  }

  /**
   * Récupère le temps affiché
   * @returns {Promise<string>}
   */
  async getTimer() {
    return await this.timerDisplay.textContent();
  }

  /**
   * Récupère le texte de progression (ex: "Question 1 / 15")
   * @returns {Promise<string>}
   */
  async getProgress() {
    return await this.progressText.textContent();
  }

  /**
   * Récupère tous les highscores affichés
   * @returns {Promise<string[]>}
   */
  async getHighscores() {
    const items = await this.highscoreList.locator('.hs-row').all();
    const scores = [];
    for (const item of items) {
      const text = await item.textContent();
      scores.push(text.trim());
    }
    return scores;
  }

  /**
   * Vérifie si un highscore contient le nom du joueur
   * @param {string} playerName
   * @returns {Promise<boolean>}
   */
  async hasHighscoreForPlayer(playerName) {
    const highscores = await this.getHighscores();
    return highscores.some((score) => score.includes(playerName));
  }

  /**
   * Récupère les éléments de correction
   * @returns {Promise<Array<{icon: string, question: string, isCorrect: boolean, isSkipped: boolean}>>}
   */
  async getCorrectionItems() {
    const items = await this.correctionList.locator('.correction-item').all();
    const corrections = [];

    for (const item of items) {
      const classes = await item.getAttribute('class');
      const icon = await item.locator('.correction-icon').textContent();
      const question = await item
        .locator('.correction-question')
        .textContent();

      corrections.push({
        icon: icon.trim(),
        question: question.trim(),
        isCorrect: classes.includes('correct'),
        isSkipped: classes.includes('skipped'),
      });
    }

    return corrections;
  }

  /**
   * Compte le nombre de réponses correctes dans la correction
   * @returns {Promise<number>}
   */
  async countCorrectAnswers() {
    const corrections = await this.getCorrectionItems();
    return corrections.filter((c) => c.isCorrect).length;
  }

  /**
   * Compte le nombre de réponses incorrectes dans la correction
   * @returns {Promise<number>}
   */
  async countIncorrectAnswers() {
    const corrections = await this.getCorrectionItems();
    return corrections.filter((c) => !c.isCorrect && !c.isSkipped).length;
  }

  /**
   * Compte le nombre de questions skippées dans la correction
   * @returns {Promise<number>}
   */
  async countSkippedQuestions() {
    const corrections = await this.getCorrectionItems();
    return corrections.filter((c) => c.isSkipped).length;
  }

  /**
   * Vérifie si la section des résultats est visible
   * @returns {Promise<boolean>}
   */
  async isResultsVisible() {
    return await this.resultsSection.isVisible();
  }

  /**
   * Attend que le jeu se termine (résultats visibles)
   */
  async waitForResults() {
    await this.resultsSection.waitFor({ state: 'visible', timeout: 90000 });
  }

  /**
   * Retourne à l'accueil
   */
  async goBackHome() {
    await this.homeButton.click();
    await this.page.waitForURL('**/index.html');
  }
}
