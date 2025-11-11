export class MultiplicationPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // Locators
    this.playerNameInput = page.locator('#player-name');
    this.apprentiButton = page.locator('.difficulty-btn.easy');
    this.sorcierButton = page.locator('.difficulty-btn.medium');
    this.archimageButton = page.locator('.difficulty-btn.hard');
    this.questionText = page.locator('#question');
    this.answerInput = page.locator('#answer-input');
    this.submitButton = page.locator('#submit-btn');
    this.skipButton = page.locator('#skip-btn');
    this.timer = page.locator('#timer');
    this.progressBar = page.locator('.time-progress-bar');
    this.resultsScreen = page.locator('#results:not(.hidden)');
    this.correctionList = page.locator('#correction-list');
    this.highscoreList = page.locator('#highscore-list');
    this.retryButton = page.locator('button:has-text("🔄 Rejouer")');
    this.newHighscoreBadge = page.locator(
      '#new-highscore-message:not(.hidden)'
    );
  }

  async goto() {
    await this.page.goto('/table-de-multiplication.html');
  }

  async clearLocalStorage() {
    await this.page.goto('/table-de-multiplication.html');
    await this.page.evaluate(() => localStorage.clear());
  }

  async enterPlayerName(name) {
    await this.playerNameInput.fill(name);
  }

  async selectDifficulty(level) {
    // level: 'easy' | 'medium' | 'hard' (matching HTML onclick handlers)
    const buttonMap = {
      easy: this.apprentiButton,
      medium: this.sorcierButton,
      hard: this.archimageButton
    };
    await buttonMap[level].click();
  }

  async startGame(name, difficulty) {
    await this.enterPlayerName(name);
    await this.selectDifficulty(difficulty);
  }

  async getQuestionText() {
    return (await this.questionText.textContent())?.trim();
  }

  async getCorrectAnswer() {
    const question = await this.getQuestionText();
    const match = question.match(/(\d+)\s*×\s*(\d+)/);
    if (match) {
      return parseInt(match[1]) * parseInt(match[2]);
    }
    return 0;
  }

  async answerQuestion(answer) {
    await this.answerInput.fill(String(answer));
    await this.submitButton.click();
  }

  async answerQuestionWithEnter(answer) {
    await this.answerInput.fill(String(answer));
    await this.answerInput.press('Enter');
  }

  async skipQuestion() {
    await this.skipButton.click();
  }

  async waitForResults() {
    await this.resultsScreen.waitFor({ state: 'visible' });
  }

  async getFinalScore() {
    const scoreText = await this.page.locator('#score').textContent();
    const match = scoreText?.match(/(\d+)\s*\/\s*\d+/);
    return match ? parseInt(match[1]) : 0;
  }

  async getCurrentScore() {
    // Wait a bit for the game state to update
    await this.page.waitForTimeout(300);

    // Get score from the global state exposed by the game
    const score = await this.page.evaluate(() => {
      // Try to access the correctAnswers variable
      if (typeof window.correctAnswers !== 'undefined') {
        return window.correctAnswers;
      }
      // Fallback: try to count correct answers from history
      if (
        typeof window.answersHistory !== 'undefined' &&
        Array.isArray(window.answersHistory)
      ) {
        return window.answersHistory.filter((a) => a.isCorrect).length;
      }
      return 0;
    });
    return score;
  }

  async getFinalTime() {
    const detailsText = await this.page
      .locator('#result-details')
      .textContent();
    return detailsText?.trim();
  }

  async getTimerValue() {
    const timerText = await this.timer.textContent();
    // Parse "1:23" or "45s" format to seconds
    const match = timerText?.match(/(\d+)m\s*(\d+)s|(\d+)s/);
    if (match) {
      if (match[1] && match[2]) {
        return parseInt(match[1]) * 60 + parseInt(match[2]);
      }
      return parseInt(match[3] || '0');
    }
    return 0;
  }

  async getPersistedPlayerName() {
    return await this.page.evaluate(() => localStorage.getItem('playerName'));
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async retryGame() {
    await this.retryButton.click();
    await this.page.waitForSelector('#difficulty-selection:not(.hidden)');
  }

  async getLocalStorageHighscores(difficulty) {
    return await this.page.evaluate((diff) => {
      const data = localStorage.getItem(`highscores_${diff}`);
      return data ? JSON.parse(data) : null;
    }, difficulty);
  }

  async setHighscores(difficulty, scores) {
    await this.page.evaluate(
      ({ diff, data }) => {
        localStorage.setItem(`highscores_${diff}`, JSON.stringify(data));
      },
      { diff: difficulty, data: scores }
    );
  }

  async getHighscores() {
    return await this.page.$$eval('#highscore-list li', (els) =>
      els.map((e) => e.textContent?.trim() || '')
    );
  }

  async isNewHighscore() {
    return await this.newHighscoreBadge.isVisible();
  }

  async getCorrectionItems() {
    const items = await this.page.$$eval('.correction-item', (els) => {
      return els.map((el) => {
        const isCorrect = el.classList.contains('correct');
        const isSkipped = el.classList.contains('skipped');
        const question = el
          .querySelector('.correction-question')
          ?.textContent?.trim();
        const answer = el
          .querySelector('.correction-answer')
          ?.textContent?.trim();
        return { isCorrect, isSkipped, question, answer };
      });
    });
    return items;
  }

  async playCompleteGame(name, difficulty, mode) {
    // mode: 'correct' | 'incorrect' | 'mixed'
    await this.startGame(name, difficulty);

    for (let i = 0; i < 15; i++) {
      const correctAnswer = await this.getCorrectAnswer();

      let answerToUse = correctAnswer;
      if (mode === 'incorrect') {
        answerToUse = correctAnswer + 1; // Always wrong
      } else if (mode === 'mixed') {
        answerToUse = i % 2 === 0 ? correctAnswer : correctAnswer + 1; // Alternate
      }

      await this.answerQuestion(answerToUse);
      await this.page.waitForTimeout(600); // Wait for next question
    }

    await this.waitForResults();
  }

  async setStartTimeOffset(secondsBack) {
    // Move startTime back by secondsBack seconds so timer expires
    await this.page.evaluate((s) => {
      if (window.startTime) {
        window.startTime = Date.now() - s * 1000;
      }
    }, secondsBack);
  }
}
