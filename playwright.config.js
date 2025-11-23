import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',

  // Timeout par test
  timeout: 30000,

  // Expect timeout
  expect: {
    timeout: 5000,
  },

  // Parallel tests
  fullyParallel: true,

  // Retry on CI
  retries: process.env.CI ? 2 : 0,

  // Workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],

  // Global config
  use: {
    // Base URL for navigation
    baseURL: 'http://localhost:8000',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on retry
    video: 'retain-on-failure',

    // Trace on retry
    trace: 'on-first-retry',
  },

  // Projects (browsers)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 360, height: 640 },
      },
    },
  ],

  // Web server auto-start
  webServer: {
    command: 'python3 -m http.server 8000',
    port: 8000,
    reuseExistingServer: !process.env.CI,
  },
});
