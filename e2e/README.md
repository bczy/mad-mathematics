# E2E Tests - Mad Mathematics

## Overview

This directory contains end-to-end (E2E) tests for the Mad Mathematics game suite, implemented using [Playwright](https://playwright.dev/).

The tests follow the **Page Object Model (POM)** pattern for better maintainability and reusability.

## Test Coverage

### Multiplication Game Mode

The E2E tests cover the complete user flow for the multiplication game:

#### ✅ Core Functionality

- Difficulty selection (Apprenti, Sorcier, Archimage)
- Player name input and validation
- Question generation (15 questions per game)
- Answer submission and validation
- Skip functionality
- Game completion and results display

#### ⏱️ Timer and Progress

- 60-second time limit enforcement
- Progress bar with color states (green → warning → danger)
- Time tracking and display
- Game end on timeout

#### 💾 Data Persistence

- Player name saved to localStorage
- Player name pre-filled on page reload
- Highscores saved per difficulty level
- Top 5 highscore maintenance

#### 🏆 Highscore System

- Save highscore after game completion
- Display top 5 scores with medals (🥇🥈🥉)
- New highscore badge when achieving top 5
- Proper sorting (score desc, then time asc)
- Separate highscores per difficulty

#### ✏️ Input Validation

- Correct answer acceptance
- Incorrect answer rejection
- Empty input warning
- Numeric-only input enforcement
- Enter key support for submission

#### 📋 Corrections and Review

- Detailed correction list (all 15 questions)
- Visual indicators for correct/incorrect/skipped
- Display user answer vs correct answer

#### 📱 Responsive Design

- Mobile viewport (iPhone, 375×667)
- Tablet viewport (iPad, 768×1024)
- Desktop viewport (1920×1080)

#### 🎨 Visual Regression

- Screenshot comparison for critical screens
- Difficulty selection screen
- Game screen
- Results screen

## Project Structure

```
e2e/
├── README.md                          # This file
├── multiplication-complete.spec.js    # Complete test suite
├── multiplication.spec.ts             # TypeScript tests (legacy)
├── pages/
│   ├── BasePage.ts                    # Base page class (TypeScript)
│   └── MultiplicationPage.js          # POM for multiplication game
└── fixtures/
    ├── index.js                       # Fixture helpers
    └── highscores.json                # Test data for highscores
```

## Setup

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation

### Initial Setup

Install Playwright and the Chromium browser (required):

```bash
npm install -D @playwright/test
npx playwright install chromium
```

### Optional: Install Additional Browsers

To run tests on Firefox and WebKit:

```bash
# Install Firefox
npx playwright install firefox

# Install WebKit (Safari engine)
npx playwright install webkit

# Or install all browsers at once
npx playwright install
```

**Note:** Chromium is sufficient for most development work. Install Firefox and WebKit when you need cross-browser testing.

## Running Tests

### Local Development

#### Run all tests (all browsers)

```bash
npm run test:e2e
```

#### Run tests in headed mode (see browser)

```bash
npm run test:e2e:headed
```

#### Run tests on specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

#### Run specific test file

```bash
npx playwright test e2e/multiplication-complete.spec.js
```

#### Run tests on mobile viewports

```bash
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

#### Debug mode (step through tests)

```bash
npx playwright test --debug
```

#### Run single test by name

```bash
npx playwright test -g "should display difficulty selection screen"
```

### View Test Reports

After running tests, view the HTML report:

```bash
npm run test:e2e:report
# or
npx playwright show-report
```

This opens an interactive HTML report with:

- Test results (pass/fail)
- Screenshots on failure
- Videos on failure
- Trace viewer links

### Trace Viewer

To view traces for failed tests:

```bash
npx playwright show-trace test-results/.../trace.zip
```

The trace viewer shows:

- DOM snapshots at each step
- Network requests
- Console logs
- Source code

## Writing New Tests

### Using Page Object Model

Create a new page class in `pages/`:

```javascript
export class MyGamePage {
  constructor(page) {
    this.page = page;
    this.someButton = page.locator('#some-button');
  }

  async goto() {
    await this.page.goto('/my-game.html');
  }

  async clickButton() {
    await this.someButton.click();
  }
}
```

Use it in tests:

```javascript
import { test, expect } from '@playwright/test';
import { MyGamePage } from './pages/MyGamePage.js';

test('my test', async ({ page }) => {
  const myPage = new MyGamePage(page);
  await myPage.goto();
  await myPage.clickButton();
  await expect(myPage.someButton).toBeVisible();
});
```

### Best Practices

1. **Always clear localStorage before tests:**

   ```javascript
   test.beforeEach(async ({ page }) => {
     await page.goto('/game.html');
     await page.evaluate(() => localStorage.clear());
   });
   ```

2. **Use fixtures for test data:**

   ```javascript
   import fixtures from './fixtures/data.json' assert { type: 'json' };
   ```

3. **Use locators, not direct selectors:**

   ```javascript
   // Good
   this.button = page.locator('#submit-btn');

   // Avoid
   await page.click('#submit-btn');
   ```

4. **Add waits for async operations:**

   ```javascript
   await page.waitForTimeout(600); // After answering question
   await element.waitFor({ state: 'visible' });
   ```

5. **Group related tests:**

   ```javascript
   test.describe('Feature Name', () => {
     test.beforeEach(async ({ page }) => {
       // Setup
     });

     test('test 1', async () => {
       /* ... */
     });
     test('test 2', async () => {
       /* ... */
     });
   });
   ```

## CI/CD Integration

Tests run automatically on GitHub Actions:

- **On push to `main` branch**
- **On pull requests to `main`**
- **Manual trigger via workflow_dispatch**

### CI Configuration

See `.github/workflows/e2e.yml` for the complete workflow.

The CI:

1. Runs tests in parallel on Chromium, Firefox, and WebKit
2. Generates HTML reports
3. Uploads screenshots/videos on failure
4. Uploads test results as artifacts (30-day retention)

### Viewing CI Results

1. Go to GitHub Actions tab
2. Click on the workflow run
3. Download artifacts:
   - `playwright-results-{browser}` - HTML reports
   - `playwright-failures-{browser}` - Screenshots/videos on failure
   - `merged-test-results` - Combined test results

## Troubleshooting

### Tests are flaky

- Add explicit waits: `await page.waitForTimeout(ms)`
- Use `waitFor()` for element visibility
- Increase timeout in `playwright.config.js`

### Screenshots don't match

- Run `npx playwright test --update-snapshots` to update baseline screenshots
- Screenshots are platform-specific (Linux/Mac/Windows)

### Browser not installed

- Run `npx playwright install --with-deps`
- Or install specific browser: `npx playwright install chromium`

### LocalStorage not persisting

- Ensure `clearLocalStorage()` is only in `beforeEach`, not `beforeAll`
- Check browser context isolation

### Test timeout

- Increase timeout per test:
  ```javascript
  test('slow test', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes
    // ...
  });
  ```

### Selectors not found

- Check if element has `hidden` class
- Use `:not(.hidden)` in selectors
- Verify element exists in DOM (may be display:none)

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [CI/CD Integration](https://playwright.dev/docs/ci)

## Future Enhancements

- [ ] Add E2E tests for other game modes (addition, subtraction, division)
- [ ] Implement visual regression testing with Percy or Chromatic
- [ ] Add performance testing (Lighthouse CI)
- [ ] Test accessibility (axe-core integration)
- [ ] Add API mocking for external dependencies
- [ ] Implement custom Playwright fixtures
- [ ] Add parallelization for faster test runs
- [ ] Cross-browser visual testing
