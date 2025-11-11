export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // No custom scopes - keep it open as requested by user
    'scope-enum': [0], // Disabled - allow any scope
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Code style (formatting, semicolons, etc.)
        'refactor', // Code refactoring
        'perf', // Performance improvement
        'test', // Adding or updating tests
        'build', // Build system or dependencies
        'ci', // CI/CD changes
        'chore', // Other changes (maintenance)
        'revert' // Revert a previous commit
      ]
    ]
  }
};
