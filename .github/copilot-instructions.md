# Mad Mathematics - AI Agent Instructions

## 🇫🇷 Langue du Projet : FRANÇAIS OBLIGATOIRE

> **RÈGLE ABSOLUE : Tout le code et toute la documentation de ce projet doivent être en français.**

Cela signifie :

- ✅ **Tous les commentaires** dans le code (JavaScript, HTML, CSS)
- ✅ **Toutes les JSDoc** et docstrings
- ✅ **Tous les noms de variables** et fonctions (ex: `tempsEcoule`, `calculerScore()`)
- ✅ **Tous les messages** console.log et console.error
- ✅ **Toute la documentation** Markdown (README, guides, etc.)
- ✅ **Tous les commits** et messages de commit
- ✅ **Tous les textes UI** visibles par l'utilisateur

**📖 Référence complète :** [`docs/CODE_STYLE.md`](../docs/CODE_STYLE.md) - Conventions obligatoires de code

---

## Project Overview

**Mad Mathematics** is a French-language educational math game suite with multiple interactive arithmetic practice pages. It's a static web app using vanilla HTML/CSS/JS, designed for children to practice multiplication, addition, subtraction, and division with gamification (scores, timers, medals).

## Architecture

### Core Structure

- **Landing page**: `index.html` - links to all game modes
- **Game pages**: `table-de-multiplication.html`, `table-des-additions.html`, `table-des-soustractions.html`, `table-des-divisions.html`
- **Shared code**: `shared.js` contains reusable functions (highscores, timers, player name persistence)
- **Shared styles**: `style.css` provides common UI patterns and theming
- **Deployment**: Static GitHub Pages deployment via `.github/workflows/static.yml`

### Game Page Pattern

Each game page follows this consistent structure:

1. **Difficulty selection screen** with player name input
2. **Game area** with question display, timer, progress bar, answer input
3. **Results screen** with score, detailed correction list, and top 5 highscores per difficulty

## Key Conventions

### Shared Utilities (`shared.js`)

Always use these functions instead of reimplementing:

- `formatTime(seconds)` - formats timer display as "Xm Ys" or "Xs"
- `saveHighscore(name, score, time, level)` - stores scores in localStorage, returns `true` if top 5
- `loadHighscoresToElement(level, element)` - renders top 5 scores with medals (🥇🥈🥉), always shows 5 rows
- `loadPlayerName(inputId)` / `savePlayerName(name)` - persists player name across sessions

### Styling Patterns

- Use `.special-bg` class for dark/magical themed backgrounds (see multiplication page)
- Highscore tables use a 3-column grid layout with rank/name/score headers via `.hs-headers`
- Buttons use gradient backgrounds: yellow (`linear-gradient(135deg,#ffd700,#ffed4e)`) for primary actions
- Responsive layout: `@media (max-width: 768px)` switches highscore grids to single column

### Game Logic Conventions

- **Multiplication page** (reference implementation): 15 questions, 60s time limit, shows progress bar with color states (green → warning → danger)
- **Addition/subtraction/division pages**: 20 questions, variable time limits by difficulty (30s/10s/5s)
- Questions must avoid invalid scenarios:
  - Subtraction: ensure `num1 >= num2` to prevent negative results
  - Division: generate pairs where `num1 = num2 × quotient` to ensure whole number answers
- Store answer history with `{question, userAnswer, correctAnswer, isCorrect, skipped}` for detailed correction display

### LocalStorage Schema

- Highscores: `highscores_${level}` → array of `{name, score, time, date}` objects (max 5, sorted by score desc then time asc)
- Player name: `playerName` → string

## Language & UX

- All UI text is in **French** - maintain this consistently
- Emojis are used extensively for visual appeal (🧙‍♂️ ✨ 🏆 ⭐ etc.)
- Difficulty levels use thematic naming:
  - Multiplication: Apprenti/Sorcier/Archimage (⭐/⭐⭐/⭐⭐⭐)
  - Others: Apprenti/Confirmé/Grand/Super-Multi
- User feedback is immediate and visual (green for correct, red for incorrect, animations)

## Development Workflows

### Testing Locally

Open HTML files directly in browser (no build step required). For live reload during development:

```bash
python3 -m http.server 8000
# or
npx serve .
```

### Deployment

Automatic deployment to GitHub Pages on push to `main` branch via GitHub Actions. No manual steps needed.

## Common Tasks

### Adding a New Game Mode

1. Copy existing game HTML (e.g., `table-de-multiplication.html`)
2. Update title and operation logic (change `× ` to target operator)
3. Ensure question generation logic matches operator constraints
4. Link from `index.html` with consistent button styling
5. Use unique `level` identifier in highscore functions

### Modifying Difficulty Levels

Update both:

- `setDifficulty()` or `startGame()` function parameters (time limits, table ranges)
- UI button text/descriptions in difficulty selection screen

### Debugging Highscores

Check browser DevTools → Application → Local Storage → `file://` or site domain. Keys are `highscores_${level}` and `playerName`.

## 📚 Documentation Technique

Pour des guidelines détaillées, consultez le dossier [`docs/`](../docs/) :

### Conventions et Standards

- **⭐ Style de Code (FRANÇAIS OBLIGATOIRE):** [`docs/CODE_STYLE.md`](../docs/CODE_STYLE.md) - Conventions de nommage, commentaires, JSDoc, style JS/HTML/CSS
- **Documentation:** [`docs/DOCUMENTATION_GUIDELINES.md`](../docs/DOCUMENTATION_GUIDELINES.md) - Comment gérer la documentation (demander autorisation, organisation, workflows)
- **Commits:** [`docs/COMMIT_GUIDELINES.md`](../docs/COMMIT_GUIDELINES.md) - Conventional Commits en français

### Tests et Qualité

- **Tests unitaires:** [`docs/TESTING_GUIDELINES.md`](../docs/TESTING_GUIDELINES.md) - Tests pour shared.js avec Vitest (TDD, coverage 90%+)
- **Gestion des dépendances:** [`docs/YARN_MIGRATION.md`](../docs/YARN_MIGRATION.md) - Migration npm → Yarn v4, commandes et troubleshooting

### Revues et Audits

- **Code Review:** [`CODE_REVIEW.md`](../CODE_REVIEW.md) - Analyse complète du code (11 novembre 2025)

### Index Complet

Voir [`docs/README.md`](../docs/README.md) pour la liste complète et les guidelines à venir.

---

## Build, Test, and Lint Commands

### Package Manager

- **Gestionnaire** : Yarn v4 (Modern/Berry) avec Plug'n'Play
- **Lockfile** : `yarn.lock`
- **Installation** : `yarn install`
- **CI/CD** : `yarn install --immutable`
- **Documentation** : [`docs/YARN_MIGRATION.md`](../docs/YARN_MIGRATION.md)

### Build

No build step required. This is a static website with vanilla HTML/CSS/JS.

### Testing

Tests are implemented using Vitest. See [`docs/TESTING_GUIDELINES.md`](../docs/TESTING_GUIDELINES.md) for details.

- Test framework: Vitest
- To run tests: `yarn test` (watch mode) or `yarn test:run` (once)
- To run with coverage: `yarn test:coverage`
- To run with UI: `yarn test:ui`

**Installation (first time):**

```bash
# Activer Corepack (une seule fois par machine)
corepack enable

# Installer les dépendances
yarn install
```

### Linting

ESLint is configured for code quality checks:

- Check code: `yarn lint`
- Auto-fix issues: `yarn lint:fix`
- Format code: `yarn format`
- Check formatting: `yarn format:check`

**Code style:**

- Use 2-space indentation
- Use `const`/`let` (not `var`)
- Use semicolons
- Use single quotes for strings
- Keep functions small and focused

### Local Development Server

```bash
# Option 1: Python
python3 -m http.server 8000

# Option 2: Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

## Security Guidelines

### Code Security

- **Never commit secrets** or API keys to the repository
- **Validate all user input** before using it (e.g., player names, scores)
- **Sanitize localStorage data** when reading to prevent injection attacks
- **Use `textContent` instead of `innerHTML`** when displaying user-generated content
- **Avoid `eval()` and similar dangerous functions**

### Data Privacy

- All data is stored locally in browser localStorage - no server-side storage
- Player names and scores never leave the user's device
- No tracking, analytics, or third-party scripts

### Dependencies

- Avoid adding new dependencies unless absolutely necessary
- If you must add a dependency, check for known vulnerabilities
- Keep the project lightweight and framework-free

## Troubleshooting

### Common Issues

**Issue: Highscores not saving**

- Check browser DevTools → Application → Local Storage
- Ensure localStorage is enabled in the browser
- Verify the `level` parameter matches the expected format in `shared.js`

**Issue: Timer not working correctly**

- Check if `startTime` is being set correctly in the game logic
- Verify `setInterval` is being cleared properly on game end
- Look for race conditions between timer updates and game completion

**Issue: Questions are invalid (negative results, non-integer division)**

- Review question generation logic
- For subtraction: ensure `num1 >= num2`
- For division: ensure `num1 = num2 × quotient` before presenting question

**Issue: Responsive layout broken**

- Check if changes respect `@media (max-width: 768px)` breakpoints
- Verify grid layouts degrade properly to single column
- Test on mobile viewport in DevTools

**Issue: GitHub Pages deployment not updating**

- Check GitHub Actions workflow status in repository
- Verify changes are pushed to `main` branch
- Check `.github/workflows/static.yml` is valid
- Wait up to 5 minutes for deployment to complete

### Debugging Tools

- **Browser DevTools Console**: Check for JavaScript errors
- **DevTools Network tab**: Verify all resources load correctly
- **DevTools Application tab**: Inspect localStorage data
- **DevTools Device Toolbar**: Test responsive layouts
- **GitHub Actions logs**: Check deployment status

## Tool Preferences and Constraints

### Required Tools

- **Vanilla JavaScript only** - no frameworks (React, Vue, Angular, etc.)
- **No build tools** - no webpack, vite, parcel for production code
- **No preprocessors** - no TypeScript, Sass, Less for production code
- **No package dependencies** for production - keep `package.json` dev-only

### Allowed Tools (Development Only)

- Test frameworks (Vitest) for testing `shared.js`
- Local development servers for live reload
- Linters/formatters if needed (but follow existing style)

### Coding Principles

1. **Simplicity first** - prefer simple, readable code over clever solutions
2. **Avoid premature optimization** - focus on correctness, then performance
3. **Minimal changes** - don't refactor working code unless fixing a bug
4. **Progressive enhancement** - ensure core functionality works without JavaScript
5. **Accessibility** - use semantic HTML, ARIA labels, keyboard navigation

## Notes

- This is a pure vanilla JS project with no build step - keep it simple and avoid adding framework dependencies
- Uses Yarn v4 (Berry) with Plug'n'Play for dependency management - see [`docs/YARN_MIGRATION.md`](../docs/YARN_MIGRATION.md) for details
- All documentation updates require explicit approval (see [`docs/DOCUMENTATION_GUIDELINES.md`](../docs/DOCUMENTATION_GUIDELINES.md))
