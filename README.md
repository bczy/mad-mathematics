# Mad Mathematics 🎓✨

Educational math game suite for practicing arithmetic operations in French. Built with **React + TypeScript + Tailwind CSS**.

> 🎨 **Modern Stack**: This project has migrated from vanilla HTML/CSS/JS to React 19 with TypeScript and Tailwind CSS. See [Constitution v2.0.0](.specify/memory/constitution.md) for technical decisions.

## 🎮 Features

- **Multiplication Tables** - Practice times tables with different difficulty levels (Apprenti ⭐ / Sorcier ⭐⭐ / Archimage ⭐⭐⭐)
- **Addition Practice** - Master addition with timed challenges
- **Subtraction Practice** - Improve subtraction skills
- **Division Practice** - Learn division with whole numbers
- **Gamification** - Scores, timers, medals (🥇🥈🥉), and highscore leaderboards
- **Accessibility** - WCAG 2.1 compliant with keyboard navigation

## 🚀 Quick Start

### Prerequisites

- **Node.js** LTS (20.x or 22.x recommended)
- **Corepack** enabled (included with Node.js 16.10+)

### Installation

```bash
# Navigate to React app directory
cd mad-mathematics-react

# Enable Corepack (once per machine)
corepack enable

# Install dependencies with Yarn v4
yarn install

# Start development server
yarn dev
```

Then open `http://localhost:5173` (Vite dev server with HMR)

## 🛠️ Development

### Project Structure

```
mad-mathematics/
├── mad-mathematics-react/       # React application (main codebase)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── pages/               # Route components
│   │   ├── store/               # Zustand state management
│   │   ├── types/               # TypeScript definitions
│   │   └── utils/               # Pure utility functions
│   ├── tests/                   # Vitest unit tests
│   └── e2e/                     # Playwright E2E tests
├── docs/                        # Technical documentation
└── specs/                       # Feature specifications
```

### Available Commands

**From `mad-mathematics-react/` directory:**

```bash
# Development
yarn dev               # Start Vite dev server with HMR (http://localhost:5173)
yarn build             # Build for production (outputs to dist/)
yarn preview           # Preview production build locally

# Testing
yarn test              # Run Vitest in watch mode
yarn test:run          # Run tests once
yarn test:coverage     # Generate coverage report (90%+ required)
yarn test:ui           # Open Vitest UI
yarn e2e               # Run Playwright E2E tests
yarn e2e:ui            # Open Playwright UI

# Code quality
yarn lint              # Check TypeScript/React with ESLint
yarn typecheck         # TypeScript type checking

# Commits (from root directory)
cd ..
yarn commit            # Interactive commit with Commitizen
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

**Production:**
- **React 19** - UI framework with functional components and hooks
- **TypeScript 5.9+** - Type-safe development (strict mode)
- **Tailwind CSS 4** - Utility-first styling
- **Vite 7** - Fast build tool with HMR
- **React Router 7** - Client-side routing
- **Zustand 5** - Lightweight state management
- **Zod 4** - Runtime validation

**Development:**
- **Yarn v4 (Plug'n'Play)** - Fast, reliable dependency management
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Test components from user perspective
- **Playwright** - End-to-end testing
- **ESLint + Prettier** - Code quality and formatting
- **Commitizen** - Conventional commits
- **LocalStorage** - Client-side data persistence
- **Vitest** - Unit testing framework

## 📝 License

MIT
