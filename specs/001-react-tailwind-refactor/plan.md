# Implementation Plan: React + TypeScript + Tailwind Refactor

**Feature Branch**: `001-react-tailwind-refactor`  
**Created**: 2026-01-03  
**Status**: Ready for Implementation

## Tech Stack

### Core Framework

- **React 18+** - UI library with hooks, concurrent features
- **TypeScript 5+** - Strict mode, complete type safety
- **Vite 5+** - Build tool and dev server (fast HMR)

### Styling & UI

- **Tailwind CSS 3+** - Utility-first CSS framework
- Custom theme matching current design (gold buttons, dark backgrounds)

### State Management

- **Zustand 4+** - Lightweight global state (~1KB)
- localStorage middleware for persistence

### Routing

- **React Router 6+** - Client-side routing with clean URLs
- 404.html mechanism for legacy URL redirections

### Testing

- **Vitest** - Unit and integration testing (90%+ coverage target)
- **React Testing Library** - Component testing
- **Playwright 1.40+** - E2E testing and visual regression
- **vitest-localstorage-mock** - localStorage mocking

### Validation & Quality

- **Zod** - Runtime schema validation for localStorage data
- **ESLint** - React + TypeScript rules
- **Prettier** - Code formatting

### Build & Deployment

- **GitHub Actions** - CI/CD pipeline
- **GitHub Pages** - Static hosting (base path: `/mad-mathematics/`)

## Project Structure

```
mad-mathematics/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Timer.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── HighscoreTable.tsx
│   │   ├── QuestionDisplay.tsx
│   │   ├── DifficultySelector.tsx
│   │   ├── PlayerNameInput.tsx
│   │   └── ResultsPanel.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useGameTimer.ts
│   │   ├── useGameLogic.ts
│   │   └── useKeyboardInput.ts
│   ├── store/              # Zustand state management
│   │   ├── index.ts        # Main store
│   │   ├── slices/
│   │   │   ├── playerSlice.ts
│   │   │   ├── highscoresSlice.ts
│   │   │   └── gameSlice.ts
│   │   └── middleware/
│   │       └── localStorage.ts
│   ├── pages/              # Route components
│   │   ├── HomePage.tsx
│   │   ├── MultiplicationPage.tsx
│   │   ├── AdditionPage.tsx
│   │   ├── SoustractionPage.tsx
│   │   └── DivisionPage.tsx
│   ├── types/              # TypeScript definitions
│   │   ├── game.ts
│   │   ├── highscore.ts
│   │   └── store.ts
│   ├── utils/              # Utility functions
│   │   ├── formatTime.ts
│   │   ├── generateQuestions.ts
│   │   └── validation.ts
│   ├── App.tsx             # Root component with Router
│   ├── main.tsx            # Entry point
│   └── index.css           # Tailwind imports
├── e2e/                    # Playwright E2E tests
│   ├── multiplication.spec.ts
│   ├── addition.spec.ts
│   ├── soustraction.spec.ts
│   ├── division.spec.ts
│   └── visual-regression.spec.ts
├── public/                 # Static assets
│   └── 404.html            # Legacy URL redirections
├── tests/                  # Unit/integration tests
│   ├── components/
│   ├── hooks/
│   └── store/
├── dist/                   # Build output (not committed)
├── playwright.config.ts
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── eslint.config.js
├── vitest.config.ts
└── package.json
```

## Implementation Phases

### Phase 1: Project Setup (1-2 days)

- Initialize Vite + React + TypeScript project
- Install dependencies (Zustand, Tailwind, Playwright, etc.)
- Configure build tools (Vite, TypeScript, ESLint, Prettier)
- Configure testing frameworks (Vitest, RTL, Playwright)
- Setup Tailwind with custom theme
- Setup GitHub Actions workflow
- Create folder structure

### Phase 2: Core Components & State (2-3 days)

- Create Zustand store architecture (slices + middleware)
- Implement reusable components (Button, Card, Timer, etc.)
- Implement custom hooks (useGameTimer, useGameLogic)
- Write unit tests for store and hooks (90%+ coverage)
- Write component tests (RTL)
- Setup E2E test scaffolding

### Phase 3: Multiplication Page (2 days)

- Migrate multiplication page to React
- Implement 3-state flow (Selection → Game → Results)
- Connect to Zustand store for highscores
- Write RTL integration tests
- Write Playwright E2E test
- Visual QA

### Phase 4: Other Game Pages (2-3 days)

- Migrate addition page
- Migrate soustraction page (ensure num1 >= num2)
- Migrate division page (ensure integer results)
- Reuse components from Phase 2
- Write integration tests for each
- Write E2E tests for each

### Phase 5: Home Page & Routing (1 day)

- Migrate landing page
- Setup React Router with 5 routes
- Implement 404.html for legacy redirections
- Test deep linking and navigation

### Phase 6: Polish & Deployment (1-2 days)

- Performance optimization (lazy loading, code splitting)
- Accessibility audit (WCAG AA compliance)
- Cross-browser testing
- Playwright visual regression baseline
- Lighthouse audit (target: 90+)
- Update README.md
- Deploy to GitHub Pages

**Total Estimated Duration**: 12-17 days

## Key Libraries & Versions

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.40.0",
    "vitest-localstorage-mock": "^0.1.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

## Migration Strategy

**Deployment Approach**: Big-bang migration

- Development in `001-react-tailwind-refactor` branch
- Vanilla JS remains on production (main branch) until Phase 6 complete
- Single merge and deployment when all tests pass

**Data Compatibility**:

- Preserve localStorage schema for highscores (`highscores_${level}`)
- Automatic migration via Zustand middleware if needed
- Player names persist across migration

**URL Compatibility**:

- Clean URLs: `/multiplication` (modern)
- Redirections: `/table-de-multiplication.html` → `/multiplication` (legacy)
- Implemented via 404.html GitHub Pages mechanism

## Quality Gates

Before each phase completion:

- ✅ All unit tests pass (90%+ coverage)
- ✅ All integration tests pass
- ✅ TypeScript compiles with zero errors
- ✅ ESLint reports zero errors
- ✅ No console errors during manual testing

Before final deployment (Phase 6):

- ✅ All E2E tests pass
- ✅ Visual regression tests pass (no unexpected changes)
- ✅ Lighthouse Performance >= 90
- ✅ Accessibility audit passes (WCAG AA)
- ✅ Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
- ✅ Bundle size < 500KB gzipped
- ✅ Load time < 2s on 3G

## Risk Mitigation

**High Priority Risks**:

1. **localStorage schema incompatibility** → Zustand middleware handles migration
2. **Performance regression** → Code splitting, lazy loading, monitoring in Phase 6
3. **Visual inconsistencies** → Visual regression tests catch changes
4. **Accessibility regressions** → Audit in Phase 6 before deployment
5. **E2E test flakiness** → Playwright auto-wait, stable selectors

**Medium Priority Risks**:

1. **TypeScript complexity** → Start strict mode from Day 1
2. **Zustand learning curve** → Simple API, well documented
3. **Tailwind class conflicts** → Use design tokens consistently

## Success Metrics

Post-deployment validation:

- [ ] All 4 game pages functional and identical to vanilla JS version
- [ ] All highscores preserved from vanilla version
- [ ] No increase in bug reports from users
- [ ] Lighthouse Performance score >= 90
- [ ] Zero TypeScript errors in production build
- [ ] CI/CD pipeline < 5 minutes
- [ ] Developer can add new game mode in < 4 hours (reusing components)

---

**Ready for task breakdown via `/speckit.tasks`**
