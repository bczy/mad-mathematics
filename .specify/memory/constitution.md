<!--
Sync Impact Report - Constitution v2.0.0
========================================
Version: 1.0.0 → 2.0.0 (MAJOR - BREAKING CHANGE)
Ratification Date: 2026-01-03
Last Amended: 2026-01-03

BREAKING CHANGES:
- 🔥 Principle I completely redefined: Vanilla-First → Modern Framework Development
- 🔥 Technology stack changed: Vanilla JS → React + TypeScript + Tailwind CSS
- 🔥 Build process introduced: Direct HTML → Vite build pipeline
- 🔥 Deployment strategy updated: Static files → Built SPA with GitHub Pages

Rationale for v2.0.0:
- Improved maintainability through component-based architecture
- Reduced code duplication via reusable React components
- Better scalability for future feature additions
- Enhanced developer experience and modern tooling
- Easier state management and data flow
- Type safety with TypeScript

Modified Principles:
1. ✏️  I. Modern Framework Development (REDEFINED) - React + TypeScript + Tailwind required
2. ✅ II. Test-Driven Development - Updated for React Testing Library
3. ✅ III. Documentation as Code - Unchanged
4. ✅ IV. User-Centric French UX - Unchanged (still French, gamification)
5. ✏️  V. Accessibility & Simplicity - Updated for component patterns
6. ✅ VI. Quality Gates & Code Standards - Updated for TypeScript/React linting
7. ✏️  VII. Deployment Simplicity - Updated for Vite build + GitHub Pages

New Sections Added:
- Component Architecture Standards
- Type Safety Requirements
- Build & Bundle Optimization

Templates Status:
- ✅ spec-template.md - Compatible (technology-agnostic)
- ⚠️  plan-template.md - Update needed (Technical Context for React/Vite stack)
- ✅ tasks-template.md - Compatible (task structure unchanged)

Follow-up Actions:
- Update plan-template.md with React/TypeScript/Tailwind defaults
- Create migration guide from vanilla to React (separate doc)
- Update CI/CD for build step
-->

# Mad Mathematics Constitution

## Core Principles

### I. Modern Framework Development

All features MUST be built using React with TypeScript and Tailwind CSS. Component-based architecture is mandatory for maintainability and code reuse.

**Rationale**: Component-based development eliminates code duplication, improves maintainability, and enables faster feature development. TypeScript provides type safety preventing runtime errors. Tailwind CSS ensures consistent styling with utility-first approach. This modernization supports long-term project evolution while maintaining educational quality.

**Non-negotiable rules**:

- React 18+ for all UI components
- TypeScript for type safety (strict mode enabled)
- Tailwind CSS for all styling (no custom CSS except Tailwind config)
- Functional components with hooks (no class components)
- Vite for build tooling and development server
- Component colocation: component file, styles (Tailwind), tests in same directory

### II. Test-Driven Development (TDD)

Code changes MUST follow the TDD cycle: Write failing tests → Get approval → Implement code to pass tests → Refactor.

**Coverage requirements (NON-NEGOTIABLE)**:

- Minimum 90% coverage on all metrics (statements, branches, functions, lines)
- All components MUST have unit tests with Vitest + React Testing Library
- Tests MUST be co-located with components (e.g., `Button.test.tsx` next to `Button.tsx`)
- Integration tests for user flows with Testing Library's user-event
- Tests MUST use proper React testing patterns (render, screen, userEvent)

**React testing specifics**:

- Test component behavior, not implementation details
- Use accessibility queries (getByRole, getByLabelText) over test IDs
- Mock external dependencies (localStorage, APIs) consistently
- Snapshot tests only for stable UI (not for frequently changing layouts)

**Rationale**: Educational software must be reliable. React Testing Library encourages testing from user perspective, ensuring components work as children and educators expect. The 90% threshold ensures comprehensive validation.

### III. Documentation as Code

Documentation MUST be synchronized with code changes in the same commit. AI agents MUST request explicit user approval before modifying documentation.

**Mandatory documentation workflow**:

1. Detect documentation impact when code changes
2. Request user permission: "This change impacts [file.md]. Update documentation?"
3. Wait for approval before proceeding
4. Commit code + docs together (atomic commits)

**Documentation structure**:

- `.github/copilot-instructions.md` - Master index for AI agents and developers
- `docs/*.md` - Specialized guidelines (testing, deployment, architecture)
- `README.md` - Project overview and quick start
- JSDoc comments - Inline function documentation with examples

**Rationale**: Outdated documentation misleads developers and AI agents. The approval workflow respects developer intent (work-in-progress, experimental branches) while ensuring docs stay current in main branch.

### IV. User-Centric French UX

All user-facing text MUST be in French. Features MUST prioritize children's engagement through gamification (scores, timers, medals, emojis).

**UX requirements**:

- UI text in French (no English except technical comments)
- Immediate visual feedback (green ✅ for correct, red ❌ for incorrect)
- Thematic difficulty naming (Apprenti/Sorcier/Archimage, not Easy/Medium/Hard)
- Top 5 highscores with medals (🥇🥈🥉) and time tracking
- Player name persistence across sessions via localStorage

**Rationale**: This is an educational tool for French-speaking children. Consistent language and engaging visual feedback maximize learning effectiveness and motivation. Gamification elements (medals, leaderboards) encourage practice and improvement.

### V. Accessibility & Component Design

Components MUST follow React accessibility best practices and WCAG 2.1 guidelines. Responsive design MUST support mobile devices using Tailwind's responsive utilities.

**Accessibility checklist**:

- Use semantic HTML elements in JSX (`<button>`, `<input type="number">`, `<section>`)
- ARIA attributes via props (aria-label, aria-describedby, role)
- Keyboard navigation support (onKeyDown handlers, focus management)
- Mobile-responsive using Tailwind breakpoints (sm:, md:, lg:, xl:)
- Color contrast compliance (Tailwind's built-in accessible color combinations)
- Focus indicators visible (Tailwind's focus: variants)

**Component design principles**:

- Single Responsibility: Each component does one thing well
- Composition over inheritance: Build complex UIs from simple components
- Props typing: All props must have TypeScript interfaces
- Controlled components: Form inputs managed via React state
- Error boundaries: Wrap game sections to prevent full app crashes

**Simplicity rules**:

- Prefer composition over complex logic
- Extract reusable logic into custom hooks
- Keep components < 200 lines (split if larger)
- Avoid premature optimization - React is fast enough for this app

**Rationale**: Accessible components benefit all users. Component-based design with proper composition eliminates code duplication while keeping individual pieces simple and maintainable.

### VI. Quality Gates & Code Standards

All commits MUST pass automated quality checks: TypeScript compilation, linting (ESLint + React rules), formatting (Prettier), and conventional commit format.

**Commit format (REQUIRED)**:

```
type(scope): description

Examples:
- feat(multiplication): add GameTimer component
- fix(shared): prevent negative subtraction in useGameLogic hook
- refactor(ui): extract Button component
- docs(readme): update React setup instructions
```

**Allowed types**: feat, fix, docs, style, refactor, test, chore

**Branch naming (REQUIRED)**: `type/description` (e.g., `feat/timer-component`, `fix/typescript-errors`)

**TypeScript standards**:

- Strict mode enabled (`strict: true` in tsconfig.json)
- No `any` types (use `unknown` and type guards if needed)
- Explicit return types for functions (except simple arrow functions)
- Interface for props, Type for unions/intersections
- Exhaustive switch statements (ensure all cases covered)

**React/Code style**:

- 2-space indentation
- Single quotes for strings
- Semicolons required
- `const` for all variables (never `let` unless reassignment needed)
- Destructure props in component signatures
- Named exports for components (no default exports except pages)
- Components in PascalCase, hooks in camelCase with 'use' prefix

**ESLint rules (enforced)**:

- `@typescript-eslint/recommended`
- `plugin:react/recommended`
- `plugin:react-hooks/recommended`
- `plugin:jsx-a11y/recommended` (accessibility)

**Rationale**: TypeScript catches errors before runtime. Consistent style and commit messages enable better collaboration. React-specific linting prevents common bugs (hooks dependencies, accessibility issues).

### VII. Build & Deployment

Production deployment uses Vite build process to generate optimized static assets for GitHub Pages. Build output MUST be production-ready and performant.

**Build pipeline (REQUIRED)**:

- Vite for development server (HMR - Hot Module Replacement)
- TypeScript compilation as part of build
- Tailwind CSS purging for minimal CSS bundle
- Code splitting for optimal loading (React.lazy for routes if needed)
- Asset optimization (images, fonts via Vite plugins)
- Environment variables via `.env` files (never commit secrets)

**Deployment process**:

- GitHub Actions workflow builds on push to `main`
- Build output to `dist/` directory
- GitHub Pages serves `dist/` as static SPA
- Client-side routing with React Router (hash or browser history)
- LocalStorage for all data persistence (scores, player names)

**Performance targets (enforced)**:

- Initial load: < 2 seconds on 3G connection
- Time to Interactive: < 1 second
- Lighthouse score: 90+ (Performance, Accessibility, Best Practices)
- Bundle size: < 500KB (gzipped)
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

**Security considerations**:

- Validate all user input (player names, scores) with Zod schemas
- Use React's built-in XSS protection (automatic escaping)
- Never commit secrets or API keys (use env vars)
- Sanitize localStorage reads to prevent injection
- Content Security Policy headers via GitHub Pages config

**Rationale**: Vite provides fast development experience with HMR and optimal production builds. Static deployment maintains free hosting while supporting modern SPA architecture. Performance budgets ensure app stays responsive for children.

## Additional Constraints

### Technology Stack (LOCKED)

**Production (mandatory)**:

- React 18+
- TypeScript 5+ (strict mode)
- Tailwind CSS 3+
- Vite 5+ (build tool)
- React Router 6+ (client-side routing)
- Zod (runtime validation)

**Development Dependencies**:

- Yarn v4 (Plug'n'Play) for dependency management
- Vitest for unit testing
- React Testing Library + @testing-library/user-event
- ESLint with TypeScript and React plugins
- Prettier for formatting
- Commitizen for conventional commits
- Husky for git hooks
- TypeScript language server

### Component Architecture Standards

**Directory structure (REQUIRED)**:

```
src/
├── components/          # Reusable UI components
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Timer/
│   └── HighscoreTable/
├── features/            # Feature-specific components
│   ├── multiplication/
│   ├── addition/
│   ├── subtraction/
│   └── division/
├── hooks/               # Custom React hooks
│   ├── useGameTimer.ts
│   ├── useHighscores.ts
│   └── useLocalStorage.ts
├── types/               # TypeScript type definitions
│   ├── game.ts
│   └── highscore.ts
├── utils/               # Pure utility functions
│   ├── formatTime.ts
│   └── validation.ts
├── App.tsx              # Root component
└── main.tsx             # Entry point
```

**Component patterns**:

- Shared UI components in `components/` (Button, Input, Card, Timer, etc.)
- Game-specific components in `features/<game-name>/`
- Custom hooks for reusable logic (game state, timers, localStorage)
- Type definitions centralized in `types/`
- Pure functions in `utils/` (fully tested, no side effects)

### Type Safety Requirements

**All code MUST be type-safe**:

- No implicit `any` (enforce via `noImplicitAny: true`)
- Props interfaces for all components
- Return types for functions (especially hooks)
- Generic types for reusable components
- Discriminated unions for state machines (e.g., game states)

**Example patterns**:

```typescript
// Component props
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

// Hook return type
interface UseGameTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

// Game state (discriminated union)
type GameState =
  | { status: 'idle' }
  | { status: 'playing'; currentQuestion: number }
  | { status: 'finished'; score: number; timeElapsed: number };
```

### Build & Bundle Optimization

**Vite configuration requirements**:

- CSS code splitting enabled
- Asset inlining threshold: 4KB
- Chunk size warnings at 500KB
- Manual chunk splitting for vendor code
- Tree shaking enabled (remove unused code)
- Compression (gzip + brotli) in production

**Tailwind optimization**:

- Purge unused classes in production
- JIT (Just-In-Time) mode enabled
- Custom theme values minimized (use defaults when possible)
- @apply directive used sparingly (prefer utility classes)

### Performance Standards

- Initial page load: < 2 seconds on 3G connection
- Time to Interactive (TTI): < 1 second
- Game start interaction: < 100ms from button click
- No layout shifts during gameplay (CLS score: 0)
- Smooth animations: 60fps target (use CSS transitions or Framer Motion)
- React DevTools Profiler: No unnecessary re-renders
- Lighthouse Performance score: 90+

### Browser Support

- Chromium-based browsers (Chrome, Edge, Opera) - last 2 versions
- Firefox - last 2 versions
- Safari - last 2 versions
- No IE11 support required
- Mobile browsers: iOS Safari 14+, Chrome Android 90+

## Development Workflow

### Adding New Features

1. Create feature branch: `feat/feature-name`
2. Set up component structure:
   - Create component file with TypeScript
   - Write tests first (TDD)
   - Implement component with Tailwind styling
3. Ensure 90%+ test coverage
4. Update documentation in same commit
5. Run quality checks:
   - `yarn typecheck` (TypeScript compilation)
   - `yarn lint` (ESLint)
   - `yarn format` (Prettier)
   - `yarn test:run` (Vitest)
6. Commit with: `yarn commit` (Commitizen)
7. Push and create PR

### Code Review Requirements

- All tests pass (CI/CD)
- TypeScript compiles with no errors
- Coverage maintained at 90%+
- No linting/formatting errors
- Documentation updated
- Conventional commit format
- Lighthouse score maintained (90+ performance)
- Bundle size within budget (< 500KB gzipped)
- Reviewer approval

### Hotfix Process

For critical bugs in production:

1. Create branch: `fix/critical-bug-name`
2. Implement fix with TypeScript
3. Add regression test
4. Fast-track review (< 2 hours)
5. Deploy immediately after merge (GitHub Actions auto-build)

## Governance

### Constitution Authority

This constitution supersedes all other development practices. In conflicts between this document and other guidelines, the constitution takes precedence.

**Amendment procedure**:

1. Propose amendment via GitHub Discussion or Issue
2. Document rationale and impact analysis
3. Require maintainer approval (consensus)
4. Update version following semantic versioning:
   - MAJOR: Backward-incompatible changes (principle removal/redefinition)
   - MINOR: New principles or expanded guidance
   - PATCH: Clarifications, typos, non-semantic refinements
5. Propagate changes to all dependent templates
6. Commit with message: `docs: amend constitution to vX.Y.Z (summary)`

### Compliance Review

- All PRs MUST verify constitution compliance (checklist in PR template)
- Monthly audit: Scan for drift between principles and actual practices
- Violations MUST be justified in Complexity Tracking section of plan.md

### Complexity Justification

Any violation of principles (e.g., adding a framework, lowering coverage threshold) MUST include:

1. Specific problem being solved
2. Why simpler alternative is insufficient
3. Mitigation plan for added complexity
4. Approval from 2+ maintainers

### Runtime Guidance

For AI agents and developers, runtime guidance during feature development is found in:

- `.github/copilot-instructions.md` - Primary reference (update for React patterns)
- `docs/TESTING_GUIDELINES.md` - Test patterns (update for React Testing Library)
- `docs/DOCUMENTATION_GUIDELINES.md` - Documentation workflows (unchanged)
- `docs/YARN_MIGRATION.md` - Dependency management (unchanged)
- `docs/REACT_MIGRATION.md` - Migration guide from vanilla to React (to be created)
- `docs/COMPONENT_GUIDELINES.md` - React component patterns (to be created)

**Version**: 2.0.0 | **Ratified**: 2026-01-03 | **Last Amended**: 2026-01-03
