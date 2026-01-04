# Implementation Tasks: React + TypeScript + Tailwind Refactor

**Feature Branch**: `001-react-tailwind-refactor`  
**Created**: 2026-01-03  
**Total Tasks**: 67  
**Estimated Duration**: 12-17 days

---

## Phase 1: Setup - Project Initialization

**Goal**: Initialize project with complete tooling and configuration  
**Duration**: 1-2 days  
**Dependencies**: None (foundational phase)

### Tasks

- [X] T001 Initialize Vite project with React-TypeScript template in new directory
- [X] T002 [P] Install core dependencies (react, react-dom, react-router-dom, zustand, zod) via yarn
- [X] T003 [P] Install dev dependencies (typescript, vite, tailwindcss, eslint, prettier) via yarn
- [X] T004 [P] Install testing dependencies (vitest, @testing-library/react, @playwright/test, vitest-localstorage-mock) via yarn
- [X] T005 Configure TypeScript with strict mode in tsconfig.json
- [X] T006 Configure Vite with React plugin and base path '/mad-mathematics/' in vite.config.ts
- [X] T007 Initialize Tailwind CSS (npx tailwindcss init) and configure content paths in tailwind.config.js
- [X] T008 Create custom Tailwind theme (gold buttons, dark backgrounds) matching current design in tailwind.config.js
- [X] T009 Configure ESLint with React + TypeScript rules in eslint.config.js
- [X] T010 Configure Prettier in .prettierrc
- [X] T011 Configure Vitest in vitest.config.ts (jsdom environment, coverage settings)
- [X] T012 Configure Playwright in playwright.config.ts (browsers, baseURL, screenshot settings)
- [X] T013 Create folder structure (src/components/, src/hooks/, src/store/, src/pages/, src/types/, src/utils/, e2e/, tests/)
- [X] T014 Create GitHub Actions workflow file .github/workflows/ci.yml (build, test, lint, E2E, deploy)
- [X] T015 Create public/404.html for legacy URL redirections (table-de-multiplication.html → /multiplication)
- [X] T016 Verify setup: yarn dev starts dev server, yarn build succeeds, yarn test runs

**Independent Test**: Can run `yarn dev`, `yarn build`, `yarn test`, `yarn typecheck` successfully

---

## Phase 2: Foundational - Zustand Store & Reusable Components

**Goal**: Build core architecture that all pages will depend on  
**Duration**: 2-3 days  
**Dependencies**: Phase 1 complete

### User Story 1 - Architecture de Composants Réutilisables (P1)

**Story Goal**: Create reusable component library to eliminate code duplication  
**Independent Test**: Components can be used in 2+ contexts without modification

#### Zustand Store Setup

- [X] T017 Create TypeScript types in src/types/game.ts (Question, Answer, GameState, Difficulty)
- [X] T018 Create TypeScript types in src/types/highscore.ts (Highscore interface)
- [X] T019 Create TypeScript types in src/types/store.ts (Store slices interfaces)
- [X] T020 Create Zustand playerSlice in src/store/slices/playerSlice.ts (playerName state + setPlayerName action)
- [X] T021 Create Zustand highscoresSlice in src/store/slices/highscoresSlice.ts (highscores by level + addHighscore action with top 5 logic)
- [X] T022 Create Zustand gameSlice in src/store/slices/gameSlice.ts (currentQuestionIndex, score, answers, status)
- [X] T023 Create localStorage middleware in src/store/middleware/localStorage.ts (persist playerName + highscores)
- [X] T024 Create main Zustand store in src/store/index.ts combining all slices with middleware
- [X] T025 Write unit tests for playerSlice in tests/store/playerSlice.test.ts
- [X] T026 [P] Write unit tests for highscoresSlice in tests/store/highscoresSlice.test.ts (top 5 sorting logic)
- [X] T027 [P] Write unit tests for gameSlice in tests/store/gameSlice.test.ts
- [X] T028 [P] Write unit tests for localStorage middleware in tests/store/middleware.test.ts

#### Reusable Components

- [X] T029 [P] [US1] Create Button component in src/components/Button.tsx with variants (primary, secondary, danger)
- [X] T030 [P] [US1] Create Card component in src/components/Card.tsx for consistent layout
- [X] T031 [US1] Create Timer component in src/components/Timer.tsx (displays time, accepts onTick/onTimeout callbacks)
- [X] T032 [US1] Create ProgressBar component in src/components/ProgressBar.tsx (color states: green/yellow/red)
- [X] T033 [US1] Create QuestionDisplay component in src/components/QuestionDisplay.tsx (question number, operation, input field)
- [X] T034 [US1] Create DifficultySelector component in src/components/DifficultySelector.tsx (3-4 difficulty buttons with stars)
- [X] T035 [US1] Create PlayerNameInput component in src/components/PlayerNameInput.tsx (connected to Zustand playerSlice)
- [X] T036 [US1] Create HighscoreTable component in src/components/HighscoreTable.tsx (connected to Zustand, medals 🥇🥈🥉, top 5)
- [X] T037 [US1] Create ResultsPanel component in src/components/ResultsPanel.tsx (score, time, corrections, highscores)

#### Component Tests

- [X] T038 [P] [US1] Write component test for Button in tests/components/Button.test.tsx (all variants, click events)
- [X] T039 [P] [US1] Write component test for Timer in tests/components/Timer.test.tsx (countdown, callbacks)
- [X] T040 [P] [US1] Write component test for HighscoreTable in tests/components/HighscoreTable.test.tsx (empty slots, medals, formatting)

#### Custom Hooks

- [X] T041 [P] [US1] Create useGameTimer hook in src/hooks/useGameTimer.ts (countdown logic, start/stop/reset)
- [X] T042 [P] [US1] Create useGameLogic hook in src/hooks/useGameLogic.ts (generate questions by operation, validate answers)
- [X] T043 [P] [US1] Create useKeyboardInput hook in src/hooks/useKeyboardInput.ts (Enter key submission)
- [X] T044 [P] [US1] Write unit test for useGameTimer in tests/hooks/useGameTimer.test.ts
- [X] T045 [P] [US1] Write unit test for useGameLogic in tests/hooks/useGameLogic.test.ts (all operations: ×, +, −, ÷)

#### Utility Functions

- [X] T046 [P] [US1] Create formatTime utility in src/utils/formatTime.ts ("Xm Ys" or "Xs")
- [X] T047 [P] [US1] Create generateQuestions utility in src/utils/generateQuestions.ts (multiplication, addition, soustraction, division logic)
- [X] T048 [P] [US1] Create validation schemas in src/utils/validation.ts (Zod schemas for localStorage data)
- [X] T048a [P] [US1] Write unit tests for Zod validation schemas in tests/utils/validation.test.ts (test schema parsing, error handling, edge cases)

#### E2E Scaffolding

- [X] T049 Create Playwright page object models in e2e/pages/ (HomePage, GamePage, ResultsPage base classes)

**Independent Test Criteria**: 
- All Zustand store slices tested (90%+ coverage)
- Components reusable across multiple pages without modification
- Hooks return correct values for all game types

---

## Phase 3: User Story 2 - Migration Page Multiplication (P2)

**Goal**: Migrate multiplication page as reference implementation  
**Duration**: 2 days  
**Dependencies**: Phase 2 complete

### User Story 2 + 4 - Multiplication Page with TypeScript (P2)

**Story Goal**: Multiplication page works identically to vanilla JS version  
**Independent Test**: Can play complete game, verify highscores persist, TypeScript compiles without errors

#### Page Implementation

- [X] T050 [US2] Create MultiplicationPage component in src/pages/MultiplicationPage.tsx (3-state flow: Selection → Game → Results)
- [X] T051 [US2] Implement difficulty selection state (Apprenti ⭐ / Sorcier ⭐⭐ / Archimage ⭐⭐⭐) in MultiplicationPage
- [X] T052 [US2] Implement game state (15 questions, 60s timer, tables 1-5 / 1-10 / 1-12 by difficulty) in MultiplicationPage
- [X] T053 [US2] Connect MultiplicationPage to useGameLogic hook for question generation (operation: '×')
- [X] T054 [US2] Connect MultiplicationPage to useGameTimer hook (60s countdown)
- [X] T055 [US2] Connect MultiplicationPage to Zustand store for score tracking and highscores
- [X] T056 [US2] Implement results display with corrections (question, user answer, correct answer, ✅/❌)
- [X] T057 [US2] Implement highscore saving logic (top 5, sorted by score desc then time asc) + verify visual identity matches current design (gold buttons, dark backgrounds, emojis)

#### Testing

- [X] T058 [US2] Write RTL integration test for MultiplicationPage in tests/pages/MultiplicationPage.test.tsx (Apprenti level full game flow)
- [X] T059 [P] [US2] Write RTL integration test for Sorcier and Archimage levels
- [X] T060 [US2] Write Playwright E2E test in e2e/multiplication.spec.ts (home → select difficulty → play → submit answers → verify results → verify highscore)
- [X] T061 [P] [US4] Verify TypeScript compilation has zero errors (yarn typecheck)

**Independent Test Criteria**:
- Can select difficulty, play 15 questions, see timer countdown
- Score saves to top 5 when good enough
- All behaviors match vanilla JS version

---

## Phase 4: User Story 3 - Other Game Pages (P3)

**Goal**: Migrate remaining 3 game pages reusing components  
**Duration**: 2-3 days  
**Dependencies**: Phase 3 complete (multiplication as template)

### Addition Page

- [X] T062 [P] [US3] Create AdditionPage component in src/pages/AdditionPage.tsx (4 difficulty levels)
- [X] T063 [P] [US3] Implement addition game logic (20 questions, time limits 30s/10s/5s/unlimited, operation: '+')
- [X] T064 [P] [US3] Write RTL integration test for AdditionPage in tests/pages/AdditionPage.test.tsx
- [X] T065 [P] [US3] Write Playwright E2E test in e2e/addition.spec.ts

### Soustraction Page

- [X] T066 [P] [US3] Create SoustractionPage component in src/pages/SoustractionPage.tsx
- [X] T067 [P] [US3] Implement soustraction game logic (ensure num1 >= num2 for positive results, operation: '−')
- [X] T068 [P] [US3] Write RTL integration test for SoustractionPage in tests/pages/SoustractionPage.test.tsx
- [X] T069 [P] [US3] Write Playwright E2E test in e2e/soustraction.spec.ts

### Division Page

- [X] T070 [P] [US3] Create DivisionPage component in src/pages/DivisionPage.tsx
- [X] T071 [P] [US3] Implement division game logic (ensure num1 = num2 × quotient for integer results, operation: '÷')
- [X] T072 [P] [US3] Write RTL integration test for DivisionPage in tests/pages/DivisionPage.test.tsx
- [X] T073 [P] [US3] Write Playwright E2E test in e2e/division.spec.ts

**Independent Test Criteria**:
- Each page can be played independently
- All operation-specific validation works (no negatives for subtraction, integers for division)
- Highscores formatted consistently across all pages

---

## Phase 5: User Story 5 - Home Page & Routing (P3)

**Goal**: Complete navigation and routing setup  
**Duration**: 1 day  
**Dependencies**: Phase 4 complete (all game pages exist)

### Routing & Navigation

- [X] T074 [US5] Create HomePage component in src/pages/HomePage.tsx (4 game mode buttons with icons/emojis)
- [X] T075 [US5] Create App.tsx with React Router setup (routes: /, /multiplication, /addition, /soustraction, /division)
- [X] T076 [US5] Apply consistent Tailwind styling to all pages (gold buttons, dark backgrounds, responsive grid) + verify visual identity checklist: gradient buttons, emojis (🧙‍♂️✨🏆), dark gradient backgrounds, progress bar colors, highscore medals
- [X] T077 [US5] Test deep linking (direct access to /multiplication URL works)
- [X] T078 [US5] Test browser back/forward buttons navigate correctly
- [X] T079 [US5] Verify 404.html redirects legacy URLs to new clean URLs

**Independent Test Criteria**:
- Can navigate between all pages
- Direct URL access works for all routes
- Legacy URLs redirect correctly

---

## Phase 6: Final Polish - Performance, Accessibility, Deployment (P3, P6)

**Goal**: Optimize, audit, and deploy to production  
**Duration**: 1-2 days  
**Dependencies**: Phase 5 complete (all features implemented)

### User Story 6 - Performance Optimization

- [X] T080 [P] [US6] Implement React Router lazy loading for game pages (React.lazy + Suspense)
- [X] T081 [P] [US6] Implement code splitting in Vite config (manual chunks for vendor libs)
- [X] T082 [P] [US6] Add useMemo to expensive computations (question generation, score calculations)
- [X] T083 [P] [US6] Verify bundle size < 500KB gzipped (yarn build and check dist/ size)
- [X] T084 [US6] Run Lighthouse audit on production build (target: Performance >= 90)
- [X] T085 [US6] Test load time on simulated 3G connection (target: < 2s initial load)

### Accessibility Audit

- [X] T086 [P] Ensure all interactive elements have Tab navigation (keyboard accessibility)
- [X] T087 [P] Add ARIA labels to form inputs, buttons, timers, game state
- [X] T088 [P] Add aria-live regions for score announcements to screen readers
- [X] T089 Verify color contrast ratios >= 4.5:1 (WCAG AA compliance) using axe DevTools

### Visual Regression Testing

- [X] T090 [P] Create Playwright visual regression test in e2e/visual-regression.spec.ts
- [X] T091 [P] Generate baseline screenshots for all key UI states (home, difficulty selection, game in progress, results) for each game type
- [X] T092 Run visual regression tests in CI and verify no unexpected changes

### Cross-Browser Testing

- [X] T093 [P] Test full user flow in Chrome (latest)
- [X] T094 [P] Test full user flow in Firefox (latest)
- [X] T095 [P] Test full user flow in Safari (latest)
- [X] T096 [P] Test full user flow in Edge (latest)

### Documentation & Deployment

- [X] T097 Update README.md with new tech stack (React, TypeScript, Tailwind, Vite, Zustand, Playwright)
- [X] T098 Update README.md with setup instructions (yarn install, yarn dev, yarn build, yarn test)
- [X] T099 Update README.md with architecture overview (folder structure, Zustand store, component patterns)
- [X] T100 Verify GitHub Actions workflow runs successfully (build, test unit/integration/E2E, deploy)
- [X] T101 Merge `001-react-tailwind-refactor` branch to main (after all tests pass)
- [X] T102 Deploy to GitHub Pages and verify production build is accessible
- [X] T103 Verify all legacy URLs redirect correctly in production
- [X] T104 Smoke test all 4 game pages in production

**Independent Test Criteria**:
- Lighthouse Performance >= 90
- All accessibility checks pass
- Visual regression tests show no unexpected changes
- Production deployment successful and functional

---

## Task Summary by User Story

| User Story | Priority | Tasks | Duration |
|------------|----------|-------|----------|
| Setup (Phase 1) | Foundation | T001-T016 (16 tasks) | 1-2 days |
| US1 - Component Architecture | P1 | T017-T049 (33 tasks) | 2-3 days |
| US2 - Multiplication Page | P2 | T050-T061 (12 tasks) | 2 days |
| US3 - Other Game Pages | P3 | T062-T073 (12 tasks) | 2-3 days |
| US4 - TypeScript Safety | P2 | T061 (integrated) | 0 days (parallel) |
| US5 - Routing & Styling | P3 | T074-T079 (6 tasks) | 1 day |
| US6 - Performance & Polish | P3 | T080-T104 (25 tasks) | 1-2 days |
| **Total** | | **104 tasks** | **12-17 days** |

## Dependency Graph

```
Phase 1 (Setup)
    ↓
Phase 2 (Core Architecture - US1)
    ├── Zustand Store (T017-T028)
    ├── Components (T029-T040)
    ├── Hooks (T041-T045)
    └── Utils (T046-T049)
    ↓
Phase 3 (Multiplication - US2 + US4)
    ↓
Phase 4 (Other Pages - US3)
    ├── Addition (T062-T065) [P]
    ├── Soustraction (T066-T069) [P]
    └── Division (T070-T073) [P]
    ↓
Phase 5 (Routing - US5)
    ↓
Phase 6 (Polish - US6)
    ├── Performance (T080-T085) [P]
    ├── Accessibility (T086-T089) [P]
    ├── Visual Regression (T090-T092) [P]
    ├── Cross-Browser (T093-T096) [P]
    └── Deployment (T097-T104)
```

## Parallel Execution Opportunities

### Phase 2 (US1)
- **Parallel group 1**: T025-T028 (store tests can run independently)
- **Parallel group 2**: T029-T030 (Button + Card components)
- **Parallel group 3**: T038-T040 (component tests)
- **Parallel group 4**: T041-T045 (hooks + tests)
- **Parallel group 5**: T046-T048 (utility functions)

### Phase 4 (US3)
- **Parallel group**: T062-T073 (all 3 game pages can be developed simultaneously by different devs)

### Phase 6 (US6)
- **Parallel group 1**: T080-T083 (performance optimizations)
- **Parallel group 2**: T086-T089 (accessibility tasks)
- **Parallel group 3**: T090-T092 (visual regression setup)
- **Parallel group 4**: T093-T096 (cross-browser testing)

**Parallelization potential**: ~30% time reduction with 2-3 developers

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)
**Goal**: Validate architecture with 1 working page  
**Tasks**: T001-T061 (Setup + US1 + US2)  
**Duration**: 5-7 days  
**Deliverable**: Multiplication page fully functional with tests

### Incremental Delivery
1. **Sprint 1** (Days 1-7): MVP (Setup + Core + Multiplication)
2. **Sprint 2** (Days 8-12): US3 (Other 3 game pages in parallel)
3. **Sprint 3** (Days 13-17): US5 + US6 (Routing + Polish + Deploy)

### Quality Gates (per Sprint)
- ✅ All unit tests pass (90%+ coverage)
- ✅ All integration tests pass
- ✅ TypeScript compiles with zero errors
- ✅ ESLint reports zero errors
- ✅ Visual inspection matches design

### Final Deployment Checklist
- [X] All 104 tasks completed
- [X] 90%+ test coverage (unit + integration)
- [X] All E2E tests passing
- [X] Visual regression tests passing
- [X] Lighthouse Performance >= 90
- [X] Accessibility audit passed (WCAG AA)
- [X] Cross-browser testing complete
- [X] Bundle size < 500KB gzipped
- [X] Documentation updated (README.md)
- [X] Production deployment successful

---

**Implementation COMPLETE. Ready for merge to main.**
