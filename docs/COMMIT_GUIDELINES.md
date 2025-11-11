# Guide des Commits Conventionnels / Conventional Commits Guide

## 🇫🇷 Guide en Français

### Qu'est-ce qu'un commit conventionnel ?

Un commit conventionnel suit un format standardisé qui rend l'historique des commits clair et facile à comprendre. Cela facilite la collaboration et l'automatisation.

### Format

```
type(scope): description courte

[corps optionnel]

[pied de page optionnel]
```

### Types de commits

- **feat**: Nouvelle fonctionnalité (✨)
- **fix**: Correction de bug (🐛)
- **docs**: Documentation uniquement (📚)
- **style**: Formatage du code (pas de changement de logique) (💄)
- **refactor**: Refactorisation du code (♻️)
- **perf**: Amélioration des performances (⚡)
- **test**: Ajout ou modification de tests (🧪)
- **build**: Système de build ou dépendances (📦)
- **ci**: Configuration CI/CD (👷)
- **chore**: Maintenance et tâches diverses (🔧)
- **revert**: Annulation d'un commit précédent (⏪)

### Exemples

```bash
feat(multiplication): ajout de la barre de progression animée
fix(shared): empêcher les résultats négatifs dans les soustractions
docs(readme): mise à jour des instructions d'installation
style(css): ajustement de l'espacement des boutons
refactor(additions): simplifier la génération de questions
perf(timer): optimiser les mises à jour du chronomètre
test(shared): ajouter des tests pour saveHighscore
build(deps): mise à jour de vitest vers v2.0
ci(actions): ajouter la vérification des commits
chore(gitignore): ignorer les fichiers de log
```

### Comment créer un commit conventionnel

#### Méthode 1 : Utiliser Commitizen (Recommandé)

```bash
# Au lieu de "git commit"
npm run commit
```

Commitizen vous guidera interactivement :

1. Sélectionner le type de commit
2. Entrer la portée (optionnel)
3. Écrire une description courte
4. Ajouter une description détaillée (optionnel)
5. Indiquer si c'est un breaking change (optionnel)

#### Méthode 2 : Manuellement

```bash
git commit -m "feat(multiplication): ajouter animation de victoire"
```

### Portée (Scope)

La portée est optionnelle et peut être :

- Nom d'une page de jeu : `multiplication`, `addition`, `subtraction`, `division`
- Composant : `shared`, `ui`, `timer`, `highscores`
- Type de fichier : `docs`, `tests`, `ci`
- Ou n'importe quel autre identifiant pertinent

**Note** : Vous n'êtes pas limité à une liste prédéfinie - utilisez ce qui a du sens !

---

## 🇬🇧 English Guide

### What is a Conventional Commit?

A conventional commit follows a standardized format that makes commit history clear and easy to understand. It facilitates collaboration and automation.

### Format

```
type(scope): short description

[optional body]

[optional footer]
```

### Commit Types

- **feat**: New feature (✨)
- **fix**: Bug fix (🐛)
- **docs**: Documentation only (📚)
- **style**: Code formatting (no logic change) (💄)
- **refactor**: Code refactoring (♻️)
- **perf**: Performance improvement (⚡)
- **test**: Adding or updating tests (🧪)
- **build**: Build system or dependencies (📦)
- **ci**: CI/CD configuration (👷)
- **chore**: Maintenance and miscellaneous tasks (🔧)
- **revert**: Revert a previous commit (⏪)

### Examples

```bash
feat(multiplication): add animated progress bar
fix(shared): prevent negative results in subtraction
docs(readme): update installation instructions
style(css): adjust button spacing
refactor(additions): simplify question generation
perf(timer): optimize timer updates
test(shared): add tests for saveHighscore
build(deps): update vitest to v2.0
ci(actions): add commit verification
chore(gitignore): ignore log files
```

### How to Create a Conventional Commit

#### Method 1: Using Commitizen (Recommended)

```bash
# Instead of "git commit"
npm run commit
```

Commitizen will guide you interactively:

1. Select commit type
2. Enter scope (optional)
3. Write a short description
4. Add detailed description (optional)
5. Indicate if it's a breaking change (optional)

#### Method 2: Manually

```bash
git commit -m "feat(multiplication): add victory animation"
```

### Scope

The scope is optional and can be:

- Game page name: `multiplication`, `addition`, `subtraction`, `division`
- Component: `shared`, `ui`, `timer`, `highscores`
- File type: `docs`, `tests`, `ci`
- Or any other relevant identifier

**Note**: You're not limited to a predefined list - use what makes sense!

---

## 🌿 Branch Naming Convention

### Format

```
type/description-with-hyphens
```

### Examples

```bash
feat/add-timer-animation
fix/division-validation
docs/update-readme
refactor/simplify-scoring
test/add-highscore-tests
```

### Valid Types

Same as commit types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Creating a New Branch

```bash
# Good ✅
git checkout -b feat/add-sound-effects
git checkout -b fix/timer-reset-bug
git checkout -b docs/add-contributing-guide

# Bad ❌
git checkout -b new-feature
git checkout -b my-branch
git checkout -b updateDocs
```

### Branch Name Validation

Branch names are automatically validated when you push. If your branch name doesn't follow the convention, the push will be rejected with a helpful error message.

---

## 🔧 Available Commands

### Commitizen

```bash
npm run commit          # Interactive commit creation
```

### Linting

```bash
npm run lint           # Check JavaScript code
npm run lint:fix       # Fix JavaScript issues automatically
```

### Formatting

```bash
npm run format         # Format all files with Prettier
npm run format:check   # Check formatting without making changes
```

### Testing

```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage report
```

---

## 🚀 Workflow Recommendations

### Before Committing

1. **Format your code**

   ```bash
   npm run format
   ```

2. **Run linters**

   ```bash
   npm run lint:fix
   ```

3. **Run tests**

   ```bash
   npm run test:run
   ```

4. **Create conventional commit**
   ```bash
   npm run commit
   ```

### Pre-commit Hooks

The following checks run automatically before each commit:

- ✅ ESLint (code quality)
- ✅ Prettier (code formatting)
- ✅ Vitest (unit tests)

If any check fails, the commit is rejected. Fix the issues and try again.

### Pre-push Hooks

The following checks run automatically before pushing:

- ✅ Branch name validation

---

## 📚 Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitizen Documentation](https://commitizen-tools.github.io/commitizen/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)

---

## 🆘 Troubleshooting

### Commit rejected: "Branch name must follow pattern"

Your branch name doesn't follow the convention. Create a new branch with a valid name:

```bash
git checkout -b feat/your-feature-description
```

### Pre-commit hook fails

1. Check which step failed in the error message
2. Fix the issues manually or use `npm run lint:fix` / `npm run format`
3. Stage the fixes: `git add .`
4. Try committing again

### "npm run commit" not working

Make sure dependencies are installed:

```bash
npm install
```

---

**Happy coding! 🎓✨**
