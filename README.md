# Mad Mathematics 🎓✨

Educational math game suite for practicing arithmetic operations in French.

## 🎮 Features

- **Multiplication Tables** - Practice times tables with different difficulty levels
- **Addition Practice** - Master addition with timed challenges
- **Subtraction Practice** - Improve subtraction skills
- **Division Practice** - Learn division with whole numbers

## 🚀 Quick Start

This is a static website - just open `index.html` in your browser!

For development with live reload:

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .
```

Then open `http://localhost:8000`

## 🛠️ Development

### Install Dependencies

```bash
npm install
```

### Available Commands

```bash
# Commit with Commitizen (recommended)
npm run commit

# Code quality
npm run lint              # Check JavaScript
npm run lint:fix          # Auto-fix JavaScript issues
npm run format            # Format all files
npm run format:check      # Check formatting

# Testing
npm test                  # Run tests in watch mode
npm run test:run          # Run tests once
npm run test:coverage     # Run with coverage report
```

### Commit Guidelines

This project uses **Conventional Commits**. Use `npm run commit` for an interactive commit experience.

**Format**: `type(scope): description`

**Examples**:

```bash
feat(multiplication): add progress bar animation
fix(shared): prevent negative results
docs(readme): update installation steps
```

📖 See [COMMIT_GUIDELINES.md](docs/COMMIT_GUIDELINES.md) for detailed documentation.

### Branch Naming

Branches must follow the pattern: `type/description`

**Examples**:

```bash
feat/add-timer-animation
fix/division-validation
docs/update-readme
```

## 📚 Documentation

- [Commit Guidelines](docs/COMMIT_GUIDELINES.md) - How to create conventional commits
- [Testing Guidelines](docs/TESTING_GUIDELINES.md) - Writing and running tests
- [Documentation Guidelines](docs/DOCUMENTATION_GUIDELINES.md) - Managing documentation

## 🏗️ Tech Stack

- **Vanilla JavaScript** - No frameworks, pure ES6+
- **HTML5 & CSS3** - Semantic markup with modern styling
- **LocalStorage** - Client-side data persistence
- **Vitest** - Unit testing framework

## 📝 License

MIT
