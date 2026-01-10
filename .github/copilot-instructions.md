# Mad Mathematics - AI Agent Instructions

## Project Overview

**Mad Mathematics** is a French-language educational math game suite with multiple interactive arithmetic practice pages. It's a **React + TypeScript + Tailwind CSS** single-page application (SPA) designed for children to practice multiplication, addition, subtraction, and division with gamification (scores, timers, medals).

> ⚠️ **Constitution v2.0.0**: This project has migrated from vanilla HTML/CSS/JS to a modern React stack. See [Constitution](../.specify/memory/constitution.md) for the authoritative technical decisions.

## Architecture

### Technology Stack (REQUIRED)

| Layer | Technology | Version |
|-------|------------|---------|
| **UI Framework** | React | 19+ |
| **Language** | TypeScript | 5.9+ (strict mode) |
| **Styling** | Tailwind CSS | 4+ |
| **Build Tool** | Vite | 7+ |
| **Routing** | React Router | 7+ |
| **State Management** | Zustand | 5+ |
| **Validation** | Zod | 4+ |
| **Testing** | Vitest + React Testing Library | - |
| **E2E Testing** | Playwright | 1.57+ |
| **Package Manager** | Yarn v4 (PnP) | 4.12+ |

### Project Structure

```
mad-mathematics/
├── .github/
│   └── copilot-instructions.md      # This file (AI agent instructions)
├── .specify/
│   └── memory/
│       └── constitution.md          # Authoritative project rules
├── docs/                             # Technical documentation
├── mad-mathematics-react/            # Main React application
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   │   ├── common/               # Button, Card, etc.
│   │   │   └── game/                 # GameArea, Timer, HighscoreTable, etc.
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useGameLogic.ts       # Game state management
│   │   │   ├── useGameTimer.ts       # Timer logic
│   │   │   └── useKeyboardInput.ts   # Keyboard handling
│   │   ├── pages/                    # Route components
│   │   │   ├── HomePage.tsx
│   │   │   ├── MultiplicationPage.tsx
│   │   │   ├── AdditionPage.tsx
│   │   │   ├── SoustractionPage.tsx
│   │   │   └── DivisionPage.tsx
│   │   ├── store/                    # Zustand state stores
│   │   │   ├── slices/               # State slices
│   │   │   └── middleware/           # Store middleware
│   │   ├── types/                    # TypeScript type definitions
│   │   │   ├── game.ts
│   │   │   ├── highscore.ts
│   │   │   └── store.ts
│   │   ├── utils/                    # Pure utility functions
│   │   │   ├── formatTime.ts
│   │   │   ├── generateQuestions.ts
│   │   │   ├── validation.ts
│   │   │   └── colorContrast.ts
│   │   ├── App.tsx                   # Root component with routing
│   │   └── main.tsx                  # Entry point
│   ├── tests/                        # Test files
│   ├── e2e/                          # Playwright E2E tests
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tailwind.config.js
│   └── package.json
└── specs/                            # Feature specifications
```

### Game Page Pattern

Each game page follows this consistent structure (as React components):

1. **Difficulty selection screen** (`DifficultySelector` component) with player name input
2. **Game area** (`GameArea` component) with question display, timer, progress bar, answer input
3. **Results screen** (`ResultsScreen` component) with score, detailed correction list, and top 5 highscores per difficulty

## Key Conventions

### Component Patterns

#### Reusable Components (`src/components/`)

```typescript
// Button.tsx - Example pattern
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary',
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'px-4 py-2 rounded-lg font-semibold transition-all',
        variant === 'primary' && 'bg-gradient-to-r from-yellow-400 to-yellow-300',
        variant === 'secondary' && 'bg-gray-200 text-gray-800',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );
};
```

#### Custom Hooks (`src/hooks/`)

- `useGameLogic` - Game state machine (questions, answers, score)
- `useGameTimer` - Countdown timer with callbacks
- `useKeyboardInput` - Keyboard event handling for answer input

#### Utility Functions (`src/utils/`)

- `formatTime(seconds)` - Formats timer display as "Xm Ys" or "Xs"
- `generateQuestions(operation, difficulty)` - Creates question sets
- `validatePlayerName(name)` - Validates player name with Zod

### State Management (Zustand)

```typescript
// Store structure
interface GameStore {
  // Player state
  playerName: string;
  setPlayerName: (name: string) => void;
  
  // Game state
  gameStatus: 'idle' | 'playing' | 'finished';
  currentQuestion: Question | null;
  score: number;
  
  // Highscores
  highscores: Record<string, Highscore[]>;
  saveHighscore: (level: string, score: number, time: number) => boolean;
}
```

### LocalStorage Schema (unchanged)

- Highscores: `highscores_${level}` → array of `{name, score, time, date}` objects (max 5)
- Player name: `playerName` → string

### Styling with Tailwind CSS

```typescript
// Use Tailwind utility classes directly in JSX
<div className="bg-gradient-to-br from-purple-900 to-indigo-900 min-h-screen">
  <h1 className="text-4xl font-bold text-white text-center py-8">
    🧙‍♂️ Mad Mathematics ✨
  </h1>
</div>

// Responsive design with breakpoints
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

### TypeScript Conventions

```typescript
// Props interfaces (always named *Props)
interface TimerProps {
  initialTime: number;
  onTimeout: () => void;
  onTick?: (remaining: number) => void;
}

// Game state types (discriminated unions)
type GameState =
  | { status: 'idle' }
  | { status: 'playing'; question: Question; timeLeft: number }
  | { status: 'finished'; score: number; timeElapsed: number };

// Strict typing - NO any
// Use unknown + type guards if needed
```

## Language & UX

- All UI text is in **French** - maintain this consistently
- Emojis are used extensively for visual appeal (🧙‍♂️ ✨ 🏆 ⭐ etc.)
- Difficulty levels use thematic naming:
  - Multiplication: Apprenti/Sorcier/Archimage (⭐/⭐⭐/⭐⭐⭐)
  - Others: Apprenti/Confirmé/Grand/Super-Multi
- User feedback is immediate and visual (green for correct, red for incorrect, animations)

## Development Workflows

### Getting Started

```bash
# Navigate to React app
cd mad-mathematics-react

# Enable Corepack (once per machine)
corepack enable

# Install dependencies
yarn install

# Start development server (with HMR)
yarn dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start Vite dev server with HMR |
| `yarn build` | TypeScript check + production build |
| `yarn preview` | Preview production build locally |
| `yarn test` | Run Vitest in watch mode |
| `yarn test:run` | Run tests once |
| `yarn test:coverage` | Generate coverage report |
| `yarn test:ui` | Open Vitest UI |
| `yarn lint` | Run ESLint |
| `yarn e2e` | Run Playwright E2E tests |
| `yarn e2e:ui` | Open Playwright UI |

### Testing

**Unit Tests (Vitest + React Testing Library)**

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  test('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button', { name: /click me/i }));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
```

**E2E Tests (Playwright)**

```typescript
// e2e/multiplication.spec.ts
import { test, expect } from '@playwright/test';

test('completes a multiplication game', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Multiplication');
  await page.fill('[data-testid="player-name"]', 'Testeur');
  await page.click('text=Apprenti');
  
  // Play game...
  await expect(page.locator('.results-screen')).toBeVisible();
});
```

### Code Quality

- **ESLint**: TypeScript + React + Accessibility rules
- **TypeScript**: Strict mode enabled
- **Coverage**: 90%+ required on all metrics
- **Conventional Commits**: `type(scope): description`

## 📚 Documentation Technique

Pour des guidelines détaillées, consultez le dossier [`docs/`](../docs/) :

### Processus et Méthodologie

- **Documentation:** [`docs/DOCUMENTATION_GUIDELINES.md`](../docs/DOCUMENTATION_GUIDELINES.md) - Comment gérer la documentation
- **Tests:** [`docs/TESTING_GUIDELINES.md`](../docs/TESTING_GUIDELINES.md) - Tests React avec Vitest + Testing Library
- **Composants:** [`docs/COMPONENT_GUIDELINES.md`](../docs/COMPONENT_GUIDELINES.md) - Patterns React et architecture
- **Commits:** [`docs/COMMIT_GUIDELINES.md`](../docs/COMMIT_GUIDELINES.md) - Conventional Commits
- **Yarn:** [`docs/YARN_MIGRATION.md`](../docs/YARN_MIGRATION.md) - Yarn v4 avec Plug'n'Play

### Index Complet

Voir [`docs/README.md`](../docs/README.md) pour la liste complète.

---

## Build, Test, and Lint Commands

### Package Manager

- **Gestionnaire**: Yarn v4 (Modern/Berry) avec Plug'n'Play
- **REQUIRED**: **Always use Yarn 4 - NEVER use npm**
- **Working directory**: `mad-mathematics-react/`
- **Installation**: `yarn install`
- **CI/CD**: `yarn install --immutable`

### Build

```bash
cd mad-mathematics-react
yarn build
```

Output goes to `dist/` directory for deployment.

### Testing

```bash
# Unit tests (Vitest + React Testing Library)
yarn test          # Watch mode
yarn test:run      # Single run
yarn test:coverage # With coverage

# E2E tests (Playwright)
yarn e2e           # Headless
yarn e2e:ui        # Interactive UI
```

### Linting

```bash
yarn lint          # Check for issues
```

**Code style:**

- 2-space indentation
- Single quotes for strings
- Semicolons required
- `const` by default (never `var`)
- Named exports for components
- PascalCase for components, camelCase for hooks/utils

## Security Guidelines

### Code Security

- **Never commit secrets** or API keys to the repository
- **Validate all user input** with Zod schemas before using
- **React auto-escapes** JSX output (XSS protection built-in)
- **Sanitize localStorage data** when reading to prevent injection

### Data Privacy

- All data is stored locally in browser localStorage - no server-side storage
- Player names and scores never leave the user's device
- No tracking, analytics, or third-party scripts

## Troubleshooting

### Common Issues

**Issue: TypeScript errors on build**

- Run `yarn tsc --noEmit` to see all type errors
- Check for missing type definitions
- Ensure strict mode rules are followed

**Issue: Tests failing**

- Run `yarn test:run` to see full error output
- Check that mocks are properly reset between tests
- Verify React Testing Library queries match rendered output

**Issue: Vite HMR not working**

- Check console for errors
- Restart dev server: `yarn dev`
- Clear browser cache

**Issue: Tailwind classes not applying**

- Check `tailwind.config.js` content paths
- Ensure class names are complete (no dynamic string concatenation)
- Restart Vite dev server

**Issue: E2E tests failing**

- Run `yarn e2e:ui` for interactive debugging
- Check that dev server is running
- Verify selectors match current DOM structure

### Debugging Tools

- **React DevTools**: Inspect component tree and state
- **Vite**: Fast HMR and clear error messages
- **Vitest UI**: Visual test runner (`yarn test:ui`)
- **Playwright Trace Viewer**: Debug E2E test failures

## Tool Preferences and Constraints

### Required Stack

- **React 19+** with functional components and hooks
- **TypeScript 5.9+** in strict mode (no `any`)
- **Tailwind CSS 4+** for all styling
- **Vite 7+** for development and build
- **Vitest + React Testing Library** for unit tests
- **Playwright** for E2E tests

### Coding Principles

1. **Component-based architecture** - Small, reusable, composable components
2. **Type safety first** - TypeScript strict mode, no `any`
3. **Test behavior, not implementation** - Use accessibility queries
4. **Accessibility** - WCAG 2.1 compliance, keyboard navigation
5. **French UX** - All user-facing text in French

## Notes

- This is a **React + TypeScript** project built with Vite
- Uses Yarn v4 (Berry) with Plug'n'Play for dependency management
- All documentation updates require explicit approval (see [`docs/DOCUMENTATION_GUIDELINES.md`](../docs/DOCUMENTATION_GUIDELINES.md))
- Constitution v2.0.0 is the authoritative source for technical decisions
