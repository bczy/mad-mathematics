# Mad Mathematics 🎓✨

Educational math game suite for practicing arithmetic operations in French.

## 🇫🇷 Langue du Projet / Project Language

**Français uniquement / French only**

Ce projet est entièrement en français - documentation, code, commentaires, commits, tout. C'est un projet éducatif destiné à des enfants francophones.

This project is entirely in French - documentation, code, comments, commits, everything. It's an educational project for French-speaking children.

📖 **Convention de code :** Voir [docs/CODE_STYLE.md](docs/CODE_STYLE.md) pour toutes les conventions (noms de variables, commentaires, JSDoc, etc.)

---

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
# Activer Corepack (une seule fois par machine)
corepack enable

# Installer les dépendances
yarn install
```

### Available Commands

```bash
# Commit with Commitizen (recommended)
yarn commit

# Code quality
yarn lint              # Check JavaScript
yarn lint:fix          # Auto-fix JavaScript issues
yarn format            # Format all files
yarn format:check      # Check formatting

# Testing
yarn test              # Run tests in watch mode
yarn test:run          # Run tests once
yarn test:coverage     # Run with coverage report
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
- [Yarn Migration](docs/YARN_MIGRATION.md) - Yarn v4 setup and usage guide

## 🏗️ Tech Stack

- **Vanilla JavaScript** - No frameworks, pure ES6+
- **HTML5 & CSS3** - Semantic markup with modern styling
- **LocalStorage** - Client-side data persistence
- **Vitest** - Unit testing framework

## 📝 License

MIT
