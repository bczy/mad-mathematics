import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['shared.test.js', 'tests/**/*.test.js'],
    exclude: ['mad-mathematics-react/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['shared.js'],
      exclude: [
        'tests/**',
        '*.config.js',
        '*.html',
        'mad-mathematics-react/**'
      ],
      // Coverage thresholds - FAIL if below 90%
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
      perFile: true
    },
    // Strict isolation between tests
    isolate: true,
    // Default timeout
    testTimeout: 5000
  }
});
