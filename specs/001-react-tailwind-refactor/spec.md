# Feature Specification: Refonte React + TypeScript + Tailwind CSS

**Feature Branch**: `001-react-tailwind-refactor`  
**Created**: 2026-01-03  
**Status**: Draft  
**Input**: User description: "Refonte complète du projet en React + TypeScript + Tailwind CSS pour améliorer la maintenabilité, éliminer la duplication de code et faciliter l'évolution future. Migration de toutes les pages de jeu (multiplication, addition, soustraction, division) vers une architecture basée sur des composants réutilisables."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Architecture de Composants Réutilisables (Priority: P1)

En tant que développeur, je veux une architecture basée sur des composants React réutilisables pour éliminer la duplication de code entre les 4 pages de jeu (multiplication, addition, soustraction, division).

**Why this priority**: C'est la fondation de toute la refonte. Sans composants partagés, nous reproduirions les mêmes problèmes de duplication. Cette architecture permet de factoriser la logique commune (timer, questions, scoring, highscores) utilisée par toutes les pages.

**Independent Test**: Peut être testé indépendamment en créant les composants de base (Button, Timer, QuestionDisplay, HighscoreTable) et en vérifiant qu'ils peuvent être réutilisés dans au moins 2 contextes différents sans modification.

**Acceptance Scenarios**:

1. **Given** un composant Timer créé, **When** il est utilisé dans la page multiplication ET addition, **Then** il fonctionne identiquement dans les deux contextes sans duplication de code
2. **Given** un composant HighscoreTable créé, **When** les données de highscores sont passées en props, **Then** il affiche correctement les 5 meilleurs scores avec médailles (🥇🥈🥉) quel que soit le niveau
3. **Given** un composant Button avec variants (primary, secondary), **When** il est utilisé avec différentes props, **Then** il applique les bons styles Tailwind et gère les événements correctement
4. **Given** les 4 types de questions (×, +, −, ÷), **When** la logique de génération est extraite dans un hook useGameLogic, **Then** chaque page peut l'utiliser avec son opérateur spécifique

---

### User Story 2 - Migration Page Multiplication (Priority: P2)

En tant qu'enfant utilisateur, je veux que la page de multiplication fonctionne exactement comme avant mais en React, pour continuer à pratiquer mes tables sans interruption.

**Why this priority**: La multiplication est la page de référence actuelle avec la logique la plus complète (15 questions, 60s, progress bar). Migrer celle-ci en premier établit le pattern pour les 3 autres pages et valide l'architecture des composants.

**Independent Test**: Peut être testé indépendamment en accédant à `/multiplication`, sélectionnant une difficulté, jouant une partie complète, et vérifiant que tous les comportements actuels sont préservés (timer, score, corrections détaillées, highscores).

**Acceptance Scenarios**:

1. **Given** je suis sur la page multiplication, **When** je sélectionne le niveau "Apprenti" (⭐), **Then** je vois 15 questions de tables 1-5 avec un timer de 60 secondes
2. **Given** je joue une partie, **When** je réponds correctement à 12/15 questions en 45 secondes, **Then** mon score est enregistré dans le top 5 et affiché avec ma position
3. **Given** une partie terminée, **When** je consulte les corrections, **Then** je vois chaque question avec ma réponse, la bonne réponse, et un indicateur ✅/❌
4. **Given** la barre de progression visible, **When** le temps diminue, **Then** elle change de couleur (vert → warning → danger) comme dans la version actuelle
5. **Given** mon nom saisi "Mathéo", **When** je termine une partie, **Then** mon nom est persisté via localStorage pour les prochaines parties

---

### User Story 3 - Migration Pages Addition, Soustraction, Division (Priority: P3)

En tant qu'enfant utilisateur, je veux que toutes mes pages d'entraînement (addition, soustraction, division) fonctionnent en React avec la même qualité que la multiplication.

**Why this priority**: Une fois la page multiplication migrée (P2), ces 3 pages peuvent être implémentées en parallèle car elles réutilisent les mêmes composants avec des variantes de logique. C'est la priorité la plus basse car elles ne bloquent pas la validation de l'architecture.

**Independent Test**: Chaque page peut être testée indépendamment en accédant à son URL, jouant une partie, et vérifiant les comportements spécifiques (20 questions, time limits variables, validation des opérations).

**Acceptance Scenarios**:

1. **Given** je suis sur la page addition, **When** je sélectionne "Confirmé", **Then** j'ai 20 questions avec 10 secondes de limite
2. **Given** je suis sur la page soustraction, **When** les questions sont générées, **Then** aucune ne produit de résultat négatif (num1 ≥ num2)
3. **Given** je suis sur la page division, **When** les questions sont générées, **Then** toutes produisent des résultats entiers (num1 = num2 × quotient)
4. **Given** j'ai terminé une partie sur n'importe quelle page, **When** je consulte les highscores, **Then** le format est cohérent avec les autres pages (top 5, médailles, temps)

---

### User Story 4 - TypeScript Type Safety (Priority: P2)

En tant que développeur, je veux que tout le code soit type-safe avec TypeScript pour prévenir les bugs runtime et améliorer la maintenabilité.

**Why this priority**: TypeScript est un multiplicateur de productivité une fois l'architecture en place. Cette priorité P2 signifie que le typage doit être fait en parallèle de la migration des composants (P1-P2), pas après.

**Independent Test**: Peut être testé via `yarn typecheck` qui doit compiler sans erreurs, et en vérifiant qu'il n'y a pas de types `any` implicites dans le code.

**Acceptance Scenarios**:

1. **Given** tous les composants créés, **When** TypeScript compile, **Then** aucune erreur de type n'est émise
2. **Given** les props d'un composant, **When** je passe des props invalides, **Then** TypeScript détecte l'erreur au moment de la compilation
3. **Given** les hooks personnalisés (useGameTimer, useHighscores, useLocalStorage), **When** ils sont utilisés, **Then** leurs types de retour sont correctement inférés
4. **Given** le code de génération de questions, **When** une opération invalide est tentée, **Then** TypeScript empêche la compilation

---

### User Story 5 - Styles Tailwind Cohérents (Priority: P3)

En tant qu'enfant utilisateur, je veux que toutes les pages aient un design cohérent et attrayant avec les mêmes couleurs, animations et effets visuels.

**Why this priority**: Le styling avec Tailwind peut être fait progressivement une fois les composants fonctionnels créés. C'est une priorité P3 car l'expérience utilisateur doit d'abord fonctionner correctement, le polish visuel vient ensuite.

**Independent Test**: Peut être testé visuellement en comparant toutes les pages et en vérifiant que les boutons, cartes, timers utilisent les mêmes classes Tailwind et animations.

**Acceptance Scenarios**:

1. **Given** tous les boutons de l'application, **When** je les compare, **Then** ils utilisent les mêmes classes Tailwind pour les variants (primary = gradient jaune, secondary = gris)
2. **Given** les cartes de questions et résultats, **When** je les observe, **Then** elles ont le même padding, border-radius, et shadow
3. **Given** les highscores sur toutes les pages, **When** je les consulte, **Then** la grille 3-colonnes (rang/nom/score) est identique partout avec responsive mobile
4. **Given** les animations de feedback, **When** je réponds correctement/incorrectement, **Then** les transitions sont fluides (60fps) et cohérentes

---

### User Story 6 - Performance et Optimisation (Priority: P3)

En tant qu'utilisateur, je veux que l'application se charge rapidement et reste réactive même sur des connexions lentes.

**Why this priority**: L'optimisation est une priorité P3 car elle vient après que l'application fonctionne. Vite fournit déjà de bonnes performances par défaut, cette story concerne les ajustements finaux.

**Independent Test**: Peut être testé via Lighthouse en production et en vérifiant les Core Web Vitals (LCP, FID, CLS).

**Acceptance Scenarios**:

1. **Given** l'application déployée, **When** je mesure avec Lighthouse, **Then** le score Performance est ≥ 90
2. **Given** une connexion 3G simulée, **When** je charge la page d'accueil, **Then** le chargement initial prend < 2 secondes
3. **Given** le bundle JavaScript produit, **When** je vérifie sa taille, **Then** il est < 500KB gzippé
4. **Given** la navigation entre pages, **When** je clique sur un lien, **Then** la transition est instantanée (< 100ms)

---

### Edge Cases

- **Que se passe-t-il quand** localStorage est plein ou désactivé ?
  - Afficher un message d'erreur convivial et permettre de jouer sans sauvegarde de scores
  
- **Que se passe-t-il quand** un joueur entre un nom très long (> 100 caractères) ?
  - Tronquer le nom avec ellipsis (`...`) dans l'affichage mais stocker le nom complet
  
- **Que se passe-t-il quand** un joueur entre des caractères Unicode/emojis dans son nom ?
  - Accepter et afficher correctement (validation Zod pour les strings)
  
- **Que se passe-t-il quand** la connexion Internet est perdue pendant une partie ?
  - L'application continue de fonctionner (100% client-side, pas d'API)
  
- **Que se passe-t-il quand** un joueur rafraîchit la page pendant une partie ?
  - La partie en cours est perdue (comportement acceptable, comme actuellement)
  
- **Que se passe-t-il quand** les données localStorage sont corrompues (JSON invalide) ?
  - Parser avec try/catch, réinitialiser aux valeurs par défaut, logger l'erreur en console
  
- **Que se passe-t-il quand** le navigateur ne supporte pas les features modernes (très vieux Safari) ?
  - Afficher une bannière "Navigateur non supporté, veuillez mettre à jour" (config browserslist)


## Functional Requirements *(mandatory)*

### Architecture & Setup

**FR-001**: Setup Vite project with React 18+, TypeScript 5+ (strict mode), Tailwind CSS 3+  
**FR-002**: Configure React Router 6+ for client-side routing (`/`, `/multiplication`, `/addition`, `/soustraction`, `/division`) with clean URLs (no .html extensions). Implement client-side redirections from legacy URLs (`/table-de-multiplication.html` → `/multiplication`) via GitHub Pages 404.html mechanism for bookmark compatibility  
**FR-003**: Setup Zustand for global state management (player name, highscores across all game types, shared UI state)  
**FR-004**: Setup ESLint with React rules, Prettier, and TypeScript strict checks  
**FR-005**: Configure Vitest + React Testing Library for component testing (90%+ coverage)  
**FR-006**: Setup Tailwind config with custom colors matching current theme (gold buttons, dark backgrounds)  
**FR-007**: Configure GitHub Actions workflow for build, test, lint, and deployment to GitHub Pages

### Core Components (Reusable)

**FR-008**: Create `<Button>` component with variants (primary, secondary, danger) using Tailwind classes  
**FR-009**: Create `<Card>` component for consistent layout (questions, results, highscores)  
**FR-010**: Create `<Timer>` component accepting `initialTime`, `onTick`, `onTimeout` callbacks  
**FR-011**: Create `<ProgressBar>` component with color states (green → yellow → red based on percentage)  
**FR-012**: Create `<HighscoreTable>` component connected to Zustand store for reading highscores by level  
**FR-013**: Create `<QuestionDisplay>` component showing current question number, operation, and input field  
**FR-014**: Create `<DifficultySelector>` component with 3-4 difficulty buttons (⭐/⭐⭐/⭐⭐⭐)  
**FR-015**: Create `<PlayerNameInput>` component connected to Zustand store for player name state  
**FR-016**: Create `<ResultsPanel>` component showing score, time, detailed corrections, and highscores from Zustand store

### Zustand Store & Hooks

**FR-017**: Create Zustand store with slices for: `playerName`, `highscores` (keyed by level), `currentGameState` (active game session)  
**FR-018**: Implement Zustand middleware for localStorage persistence (sync player name and highscores automatically)  
**FR-019**: Create typed selectors and actions for store access (usePlayerName, useHighscores, useSaveHighscore, etc.)  

### Custom Hooks (Game Logic)

**FR-020**: Create `useGameTimer({ initialTime, onTimeout })` hook managing countdown logic  
**FR-021**: Create `useGameLogic({ operation, questionCount, difficulty })` hook generating questions and validating answers  
**FR-022**: Create `useKeyboardInput(onSubmit)` hook for handling Enter key submission

### Game Pages

**FR-023**: Create `/` home page with 4 game mode buttons linking to each page  
**FR-024**: Create `/multiplication` page with 3 difficulty levels (Apprenti/Sorcier/Archimage), connected to Zustand for game state and highscores  
**FR-025**: Multiplication page: 15 questions, 60s timer, tables range varies by difficulty (1-5 / 1-10 / 1-12)  
**FR-026**: Create `/addition` page with 4 difficulty levels (Apprenti/Confirmé/Grand/Super-Multi)  
**FR-027**: Addition page: 20 questions, time limits vary (30s/10s/5s/unlimited)  
**FR-028**: Create `/soustraction` page with same structure as addition  
**FR-029**: Soustraction page: Ensure `num1 >= num2` to prevent negative results  
**FR-030**: Create `/division` page with same structure as addition  
**FR-031**: Division page: Ensure `num1 = num2 × quotient` to guarantee integer results  
**FR-032**: Each game page follows state flow: Difficulty Selection → Game In Progress → Results Display, with state persisted in Zustand store

### Game State Management

**FR-033**: Track current question index, score, answers history `{ question, userAnswer, correctAnswer, isCorrect, skipped }` in Zustand store  
**FR-034**: Validate user input (numbers only, no empty strings)  
**FR-035**: Handle "Skip" action (mark question as skipped, decrement score if applicable) via Zustand actions  
**FR-036**: Calculate final score and time when game ends (timeout or last question answered), dispatch to store  
**FR-037**: Game state resets on page refresh (stored in memory only, not persisted to localStorage)

### Question Generation Logic

**FR-038**: Multiplication: Generate random pairs `(num1, num2)` within table range for selected difficulty  
**FR-039**: Addition: Generate random pairs with configurable max values per difficulty  
**FR-040**: Soustraction: Generate `num1` first, then `num2 <= num1` to ensure positive results  
**FR-041**: Division: Generate quotient and divisor, calculate `num1 = num2 × quotient` for integer division  
**FR-042**: Ensure no duplicate questions within the same game session (tracked in Zustand store)

### Highscores System (Zustand Store)

**FR-043**: Load top 5 highscores from Zustand store (automatically synced with localStorage via middleware) on results screen  
**FR-044**: Save new score via Zustand action only if it ranks in top 5 (sorted by score desc, then time asc)  
**FR-045**: Display highscores with medals (🥇 #1, 🥈 #2, 🥉 #3) and rank numbers (#4, #5)  
**FR-046**: Show empty slots "Aucun score" for positions without data  
**FR-047**: Format scores as "X/15" for multiplication, "X/20" for others, "X pts" for super-multi  
**FR-048**: Format time as `formatTime(seconds)`: "Xm Ys" if >= 60s, else "Xs"

### UI/UX Requirements

**FR-049**: Maintain current visual identity (dark backgrounds with gradients, gold buttons, emojis 🧙‍♂️✨🏆)  
**FR-050**: Responsive design: mobile-first, grid layouts collapse to single column on < 768px  
**FR-051**: Smooth transitions between game states (150-300ms fade/slide animations)  
**FR-052**: Show visual feedback on answer submission (green flash for correct, red shake for incorrect)  
**FR-053**: Display progress indicator "Question X / Total" during game  
**FR-054**: Disable answer input and show loading state during transitions

### Accessibility

**FR-055**: Ensure all interactive elements are keyboard-accessible (Tab navigation, Enter to submit)  
**FR-056**: Add ARIA labels to form inputs, buttons, and timers  
**FR-057**: Maintain color contrast ratios >= 4.5:1 for WCAG AA compliance  
**FR-058**: Announce score changes to screen readers via `aria-live` regions

### Testing Requirements

**FR-059**: Write unit tests for Zustand store slices (actions, selectors, middleware)  
**FR-060**: Write unit tests for game logic hooks (useGameTimer, useGameLogic)  
**FR-061**: Write component tests for Button, Timer, HighscoreTable, QuestionDisplay (RTL) with Zustand store mocked  
**FR-062**: Write integration tests for each game page (difficulty selection → gameplay → results) using React Testing Library with real Zustand store  
**FR-063**: Write E2E tests with Playwright for critical user flows (complete game session from home page to results on each game type)  
**FR-064**: Implement Playwright visual regression tests using expect.toHaveScreenshot() for key UI states (home page, difficulty selection, game in progress, results screen) on each game type  
**FR-065**: Mock localStorage in tests using `vitest-localstorage-mock` (unit/integration) and Playwright's `page.addInitScript()` (E2E)  
**FR-066**: Achieve minimum 90% code coverage (statements, branches, functions, lines) for unit and integration tests

### Build & Deployment

**FR-063**: Configure Vite build to output to `dist/` with asset hashing  
**FR-064**: Setup base path for GitHub Pages deployment (`base: '/mad-mathematics/'` in vite.config.ts)  
**FR-065**: Generate source maps for production debugging  
**FR-066**: Optimize bundle size: code splitting, tree shaking, minification  
**FR-067**: Update GitHub Actions workflow to build React app before deployment  
**FR-072**: Configure Playwright in CI/CD pipeline (install browsers, run E2E tests + visual regression before deployment)

### Performance

**FR-069**: Ensure First Contentful Paint (FCP) < 1.5s on 3G connection  
**FR-070**: Lazy load game pages with React Router's `lazy()` and `Suspense`  
**FR-071**: Memoize expensive computations (question generation, score calculations) with `useMemo`  
**FR-076**: Debounce localStorage writes to avoid excessive I/O (300ms debounce on highscore saves via Zustand middleware)

### Security & Data Privacy

**FR-073**: Sanitize user input for player names (prevent XSS via React's automatic escaping)  
**FR-078**: Validate all localStorage data with Zod schemas before parsing in Zustand middleware  
**FR-075**: Handle localStorage quota exceeded errors gracefully (show error message, allow gameplay without saves)  
**FR-076**: No external API calls or data transmission (100% client-side application)

---

## Success Criteria *(mandatory)*

These are measurable, technology-agnostic outcomes to verify feature success:

1. **Component Reusability**: All 4 game pages share at least 80% of their component code (Button, Timer, HighscoreTable, QuestionDisplay reused without modification)

2. **Functional Parity**: Every behavior in the current vanilla JS version works identically in the React version (15/20 questions, time limits, scoring, highscores, corrections)

3. **Type Safety**: Zero TypeScript compilation errors in production build (`yarn typecheck` succeeds)

4. **Test Coverage**: Minimum 90% coverage across statements, branches, functions, and lines (verified via `yarn test:coverage`)

5. **Performance**: Lighthouse Performance score >= 90 in production deployment

6. **Bundle Size**: Total JavaScript bundle size < 500KB gzipped (measured in production build)

7. **Load Time**: Initial page load completes in < 2 seconds on simulated 3G connection

8. **Accessibility**: All interactive elements accessible via keyboard navigation (Tab, Enter, Escape)

9. **Visual Consistency**: All pages use the same Tailwind design tokens (colors, spacing, typography) - verified via Playwright visual regression tests (expect.toHaveScreenshot()) in CI/CD

10. **Responsive Design**: Application is fully functional and visually correct on viewport widths from 320px to 1920px

11. **No Console Errors**: Zero errors or warnings in browser console during normal gameplay

12. **localStorage Resilience**: Application continues to function when localStorage is disabled, full, or contains corrupted data

13. **Migration Success**: All 4 existing HTML pages (index.html, table-de-multiplication.html, table-des-additions.html, table-des-soustractions.html, table-des-divisions.html) are replaced by React equivalents

14. **User Retention**: Existing players can continue using the app without retraining (UI/UX changes are minimal, focused on maintainability)

15. **Developer Experience**: New contributors can add a new game mode (e.g., "table-des-pourcentages") in < 4 hours by reusing existing components

16. **Build Pipeline**: CI/CD pipeline completes in < 5 minutes (lint, test, build, deploy)

17. **Documentation**: README.md updated with new tech stack, setup instructions (`yarn install`, `yarn dev`, `yarn build`), and architecture overview

18. **No Regressions**: All current highscores are preserved during migration (localStorage schema remains compatible or migrated automatically)

19. **Code Quality**: ESLint reports zero errors, Prettier formatting is consistent across all files

20. **GitHub Pages Deploy**: Production build successfully deploys to GitHub Pages and is accessible at the current URL

21. **Offline Capability**: Application functions 100% offline after initial load (no external dependencies or API calls)

22. **User Feedback**: Visual feedback (green/red, animations) appears within 100ms of user interaction (answer submission, button clicks)

23. **Cross-Browser Support**: Application works correctly in latest versions of Chrome, Firefox, Safari, Edge (defined in browserslist config)

---

## Key Entities *(if relevant)*

### Highscore

- `name`: string (player name, max ~500 chars, supports Unicode/emojis)
- `score`: number (0-15 for multiplication, 0-20 for others, unbounded for super-multi)
- `time`: number (seconds elapsed)
- `date`: string (ISO 8601 timestamp)

### Question

- `num1`: number (first operand)
- `num2`: number (second operand)
- `operation`: enum ('×', '+', '−', '÷')
- `correctAnswer`: number (pre-calculated result)

### Answer (user response)

- `question`: string (e.g., "7 × 8 = ?")
- `userAnswer`: number | null (null if skipped)
- `correctAnswer`: number
- `isCorrect`: boolean
- `skipped`: boolean

### GameState

- `difficulty`: string ('apprenti' | 'sorcier' | 'archimage' | 'confirmé' | 'grand' | 'super-multi')
- `currentQuestionIndex`: number (0-based index)
- `questions`: Question[]
- `answers`: Answer[]
- `score`: number
- `timeRemaining`: number (seconds)
- `status`: enum ('selecting' | 'playing' | 'finished')

---

## Clarifications

### Session 2026-01-03

- Q: Stratégie de migration progressive vs big-bang - L'ancienne version vanilla JS doit-elle rester déployée pendant la migration ? → A: **Migration big-bang** - Développer React dans la branche `001-react-tailwind-refactor` isolée, déployer une fois Phase 6 terminée en remplaçant complètement vanilla JS (pas de déploiement parallèle ni feature flags)

- Q: Gestion du routage et chemins d'URL - Les anciennes URLs (`/table-de-multiplication.html`) doivent-elles être préservées pour compatibilité avec signets et liens externes existants ? → A: **Clean URLs avec redirections** - Utiliser routes modernes (`/multiplication`) mais ajouter redirections client-side depuis anciennes URLs via mécanisme 404.html de GitHub Pages pour préserver compatibilité signets utilisateurs

- Q: Stratégie de tests - E2E vs intégration seulement - Des tests end-to-end avec vrai navigateur sont-ils nécessaires en plus des tests d'intégration React Testing Library ? → A: **E2E tests obligatoires** - Ajouter Playwright pour tests end-to-end complets (vrai navigateur, user flows) en plus de RTL integration tests pour garantir qualité production

- Q: Gestion d'état global - Context API vs bibliothèque externe - Quelle solution pour gérer l'état partagé (highscores, player name, game state) entre composants et pages ? → A: **Zustand pour état global** - Utiliser Zustand pour un store global léger (~1KB) partagé entre toutes les pages, permettant accès facile aux highscores et player name sans prop drilling, avec meilleure testabilité

- Q: Stratégie de validation visuelle - Snapshots vs tests manuels - Success Criteria #9 mentionne "visual regression tests" - faut-il utiliser des snapshots automatisés ou validation manuelle ? → A: **Playwright screenshots en CI seulement** - Générer et comparer screenshots automatiquement avec Playwright expect.toHaveScreenshot() (gratuit, intégré avec infrastructure E2E existante, détecte régressions visuelles majeures)

---

## Assumptions *(if any)*

1. **Deployment**: GitHub Pages hosting continues to be the deployment target (Vite build outputs static files compatible with GH Pages)

2. **Browser Support**: Targeting evergreen browsers (Chrome, Firefox, Safari, Edge) with ES2020+ support - no IE11 support required

3. **Data Migration**: Current localStorage schema for highscores (`highscores_${level}`) will be preserved for backward compatibility

4. **No Backend**: Application remains 100% client-side with no server-side logic or database (localStorage is the only persistence layer)

5. **French Language Only**: UI text remains exclusively in French (no i18n/localization required at this stage)

6. **No Authentication**: No user accounts, login, or authentication system (player names are stored locally only)

7. **Single Player**: No multiplayer, leaderboards sync, or social features (each player's data is isolated to their device)

8. **Static Content**: Game content (questions, difficulty levels, time limits) is hardcoded in the application logic, not loaded from external sources

---

## Migration Strategy *(optional but recommended)*

**Deployment Approach**: Big-bang migration - All development happens in the `001-react-tailwind-refactor` feature branch. The vanilla JS version remains on production (main branch) until Phase 6 is complete, tested, and validated. At that point, the React version replaces the vanilla JS version entirely via a single merge and deployment.

### Phase 1: Project Setup (1-2 days)

- Initialize Vite + React + TypeScript project
- Install and configure Zustand with TypeScript types and localStorage middleware
- Configure Tailwind CSS with custom theme matching current design
- Setup ESLint, Prettier, Vitest, React Testing Library
- Setup Playwright for E2E testing (install browsers, configure test runners)
- Configure GitHub Actions workflow (build, test unit/integration/E2E, deploy)
- Create base folder structure (`src/components/`, `src/hooks/`, `src/pages/`, `src/types/`, `src/store/`, `e2e/`)

### Phase 2: Core Components & Hooks (2-3 days)

- Create Zustand store structure with slices (playerName, highscores, gameState)
- Implement localStorage persistence middleware for Zustand
- Implement reusable components: Button, Card, Timer, ProgressBar, HighscoreTable, QuestionDisplay, DifficultySelector (connected to Zustand where needed)
- Implement custom hooks: useGameTimer, useGameLogic
- Write unit tests for Zustand store and all hooks (90%+ coverage)
- Write component tests for all reusable components (RTL with mocked store)
- Write initial E2E test scaffolding and page object models

### Phase 3: Multiplication Page (2 days)

- Migrate `table-de-multiplication.html` logic to React
- Implement 3-state flow: Difficulty Selection → Gameplay → Results
- Write RTL integration tests for all 3 difficulty levels
- Write Playwright E2E test for complete multiplication game flow (home → difficulty → play → results → highscores)
- Verify localStorage highscores integration
- Visual QA to match current design

### Phase 4: Addition, Soustraction, Division Pages (2-3 days)

- Migrate remaining 3 pages in parallel (reuse components from Phase 2)
- Implement operation-specific logic (soustraction: num1 >= num2, division: integer results)
- Write RTL integration tests for all difficulty levels on each page
- Write Playwright E2E tests for each game type (addition, soustraction, division)
- Verify highscores work correctly for all levels

### Phase 5: Home Page & Routing (1 day)

- Migrate `index.html` to React landing page
- Setup React Router with 5 routes
- Implement navigation between pages
- Test deep linking and browser back/forward buttons

### Phase 6: Polish & Deployment (1-2 days)

- Performance optimization (code splitting, lazy loading)
- Accessibility audit and fixes
- Cross-browser testing
- Setup Playwright visual regression tests (generate baseline screenshots for all key UI states)
- Run full test suite (unit, integration, E2E, visual regression)
- Lighthouse performance audit (target: 90+ score)
- Update README.md with new stack and setup instructions
- Deploy to GitHub Pages and verify production build

**Total Estimated Duration**: 10-15 days (depending on team size and availability)

---

**Specification complete. Ready for `/speckit.plan` phase to break down into tasks.**
