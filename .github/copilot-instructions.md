# Mad Mathematics - AI Agent Instructions

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

### Processus et Méthodologie
- **Documentation:** [`docs/DOCUMENTATION_GUIDELINES.md`](../docs/DOCUMENTATION_GUIDELINES.md) - Comment gérer la documentation (demander autorisation, organisation, workflows)
- **Tests unitaires:** [`docs/TESTING_GUIDELINES.md`](../docs/TESTING_GUIDELINES.md) - Tests pour shared.js avec Vitest (TDD, coverage 90%+)

### Revues et Audits
- **Code Review:** [`CODE_REVIEW.md`](../CODE_REVIEW.md) - Analyse complète du code (11 novembre 2025)

### Index Complet
Voir [`docs/README.md`](../docs/README.md) pour la liste complète et les guidelines à venir.

---

## Notes
- This is a pure vanilla JS project with no build step - keep it simple and avoid adding framework dependencies
- `yarn.lock` exists but project has no dependencies - avoid modifications unless absolutely necessary
