/**
 * Game Page Object - Mad Mathematics
 * Base page object for all game pages (multiplication, addition, etc.)
 */

import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class GamePage extends BasePage {
  // Difficulty selection
  readonly difficultySelector: Locator;
  readonly playerNameInput: Locator;
  readonly startButton: Locator;

  // Game area
  readonly questionDisplay: Locator;
  readonly answerInput: Locator;
  readonly submitButton: Locator;
  readonly skipButton: Locator;
  readonly timer: Locator;
  readonly progressBar: Locator;

  // Results
  readonly resultsPanel: Locator;
  readonly scoreDisplay: Locator;
  readonly timeDisplay: Locator;
  readonly correctionList: Locator;
  readonly highscoreTable: Locator;
  readonly playAgainButton: Locator;
  readonly homeButton: Locator;

  constructor(page: Page) {
    super(page);

    // Difficulty selection
    this.difficultySelector = page.getByTestId('difficulty-selector');
    this.playerNameInput = page.getByTestId('player-name-input');
    this.startButton = page.getByRole('button', { name: /commencer|jouer/i });

    // Game area
    this.questionDisplay = page.getByTestId('question-display');
    this.answerInput = page.getByTestId('answer-input');
    this.submitButton = page.getByRole('button', { name: /valider|ok/i });
    this.skipButton = page.getByRole('button', { name: /passer|skip/i });
    this.timer = page.getByTestId('timer');
    this.progressBar = page.getByTestId('progress-bar');

    // Results
    this.resultsPanel = page.getByTestId('results-panel');
    this.scoreDisplay = page.getByTestId('score-display');
    this.timeDisplay = page.getByTestId('time-display');
    this.correctionList = page.getByTestId('correction-list');
    this.highscoreTable = page.getByTestId('highscore-table');
    this.playAgainButton = page.getByRole('button', { name: /rejouer/i });
    this.homeButton = page.getByRole('link', { name: /accueil|menu/i });
  }

  // ======== Difficulty Selection Actions ========

  /**
   * Enter player name
   */
  async enterPlayerName(name: string): Promise<void> {
    await this.playerNameInput.fill(name);
  }

  /**
   * Select a difficulty level by clicking the button
   */
  async selectDifficulty(difficulty: 'apprenti' | 'sorcier' | 'archimage' | 'facile' | 'moyen' | 'difficile' | 'super-multi'): Promise<void> {
    const button = this.page.getByRole('button', { name: new RegExp(difficulty, 'i') });
    await button.click();
  }

  /**
   * Start the game
   */
  async startGame(): Promise<void> {
    await this.startButton.click();
  }

  /**
   * Complete difficulty setup and start game
   */
  async setupAndStart(playerName: string, difficulty: Parameters<GamePage['selectDifficulty']>[0]): Promise<void> {
    await this.enterPlayerName(playerName);
    await this.selectDifficulty(difficulty);
    await this.startGame();
  }

  // ======== Game Actions ========

  /**
   * Submit an answer
   */
  async submitAnswer(answer: number): Promise<void> {
    await this.answerInput.fill(String(answer));
    await this.submitButton.click();
  }

  /**
   * Submit answer with Enter key
   */
  async submitAnswerWithEnter(answer: number): Promise<void> {
    await this.answerInput.fill(String(answer));
    await this.answerInput.press('Enter');
  }

  /**
   * Skip the current question
   */
  async skipQuestion(): Promise<void> {
    await this.skipButton.click();
  }

  /**
   * Get the current question text
   */
  async getQuestionText(): Promise<string> {
    return this.questionDisplay.textContent() ?? '';
  }

  /**
   * Get the remaining time from timer
   */
  async getTimerValue(): Promise<string> {
    return this.timer.textContent() ?? '';
  }

  /**
   * Wait for the game to start
   */
  async waitForGameStart(): Promise<void> {
    await expect(this.questionDisplay).toBeVisible();
  }

  /**
   * Check if the game is in playing state
   */
  async expectPlaying(): Promise<void> {
    await expect(this.questionDisplay).toBeVisible();
    await expect(this.answerInput).toBeVisible();
    await expect(this.timer).toBeVisible();
  }

  // ======== Results Actions ========

  /**
   * Wait for results to appear
   */
  async waitForResults(): Promise<void> {
    await expect(this.resultsPanel).toBeVisible({ timeout: 70000 }); // Allow for full game duration
  }

  /**
   * Get the final score
   */
  async getScore(): Promise<string> {
    return this.scoreDisplay.textContent() ?? '';
  }

  /**
   * Get the elapsed time
   */
  async getElapsedTime(): Promise<string> {
    return this.timeDisplay.textContent() ?? '';
  }

  /**
   * Check if results show expected score format
   */
  async expectScoreFormat(pattern: RegExp): Promise<void> {
    await expect(this.scoreDisplay).toHaveText(pattern);
  }

  /**
   * Click play again
   */
  async playAgain(): Promise<void> {
    await this.playAgainButton.click();
  }

  /**
   * Go back to home
   */
  async goHome(): Promise<void> {
    await this.homeButton.click();
  }

  // ======== Game Flow Helpers ========

  /**
   * Answer all questions correctly (requires knowing the answers)
   * This is a helper for testing perfect games
   */
  async answerQuestionsSequentially(answers: number[]): Promise<void> {
    for (const answer of answers) {
      await this.submitAnswer(answer);
      // Small delay between answers
      await this.page.waitForTimeout(100);
    }
  }

  /**
   * Check that highscores table shows a medal for the player
   */
  async expectMedalForPlayer(playerName: string): Promise<void> {
    const playerRow = this.highscoreTable.locator(`text=${playerName}`);
    await expect(playerRow).toBeVisible();
    // Check for medal emoji
    const medalRegex = /🥇|🥈|🥉/;
    const rowText = await playerRow.textContent();
    expect(rowText).toMatch(medalRegex);
  }
}
