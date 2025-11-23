# Guide des Tests E2E avec Playwright

## 📖 Table des matières

- [Introduction](#introduction)
- [Installation](#installation)
- [Structure des tests](#structure-des-tests)
- [Exécution des tests](#exécution-des-tests)
- [Page Object Model](#page-object-model)
- [Écrire de nouveaux tests](#écrire-de-nouveaux-tests)
- [Débogage](#débogage)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

---

## Introduction

Les tests E2E (End-to-End) avec Playwright valident les parcours utilisateur complets de Mad Mathematics. Ils simulent des interactions réelles dans un navigateur pour s'assurer que toutes les fonctionnalités fonctionnent correctement ensemble.

### Couverture actuelle

- ✅ **Navigation** : Navigation entre toutes les pages du jeu
- ✅ **Jeu de multiplication** : Parcours complets (15 questions, timer, scores)
- ✅ **LocalStorage** : Persistance des noms et highscores
- ✅ **Responsive** : Tests sur mobile (360px), tablet (768px) et desktop (1280px)

### Pyramide de tests

```
        /\
       /  \      10% Tests visuels/accessibilité (futur)
      /____\
     /      \    20% Tests E2E ← Vous êtes ici
    /________\
   /          \  70% Tests unitaires (Vitest)
  /____________\
```

---

## Installation

### Prérequis

- Node.js (LTS version)
- Yarn v4 (géré via Corepack)

### Installation initiale

```bash
# Activer Corepack (une seule fois par machine)
corepack enable

# Installer les dépendances
yarn install

# Installer les navigateurs Playwright
yarn playwright install chromium firefox
```

---

## Structure des tests

```
tests/e2e/
├── pages/                      # Page Object Model
│   ├── BasePage.js            # Classe de base réutilisable
│   ├── LandingPage.js         # Page d'accueil (index.html)
│   └── MultiplicationPage.js  # Page de multiplication
├── helpers/                    # Utilitaires
│   └── storage-helper.js      # Fonctions pour localStorage
└── specs/                      # Scénarios de test
    ├── navigation.spec.js     # Tests de navigation (3 tests)
    ├── multiplication-game.spec.js  # Tests du jeu (8 tests)
    ├── localStorage.spec.js   # Tests de persistance (5 tests)
    └── responsive.spec.js     # Tests responsive (9 tests)
```

**Total : 25 tests E2E**

---

## Exécution des tests

### Commandes de base

```bash
# Exécuter tous les tests E2E (headless)
yarn test:e2e

# Exécuter sur un navigateur spécifique
yarn test:e2e --project=chromium
yarn test:e2e --project=firefox
yarn test:e2e --project=mobile-chrome

# Exécuter un fichier de test spécifique
yarn test:e2e tests/e2e/specs/navigation.spec.js

# Exécuter un test spécifique par nom
yarn test:e2e --grep "should complete a perfect game"
```

### Modes de débogage

```bash
# UI Mode - Interface graphique interactive (RECOMMANDÉ)
yarn test:e2e:ui

# Headed mode - Voir le navigateur pendant l'exécution
yarn test:e2e:headed

# Debug mode - Avec breakpoints
yarn test:e2e:debug

# Afficher le dernier rapport HTML
yarn test:e2e:report
```

### Options utiles

```bash
# Désactiver les retries (plus rapide pour le développement)
yarn test:e2e --retries=0

# Exécuter en mode trace (génère des traces détaillées)
yarn test:e2e --trace on

# Capturer des screenshots à chaque étape
yarn test:e2e --screenshot on
```

---

## Page Object Model

Le **Page Object Model (POM)** encapsule la logique d'interaction avec les pages dans des classes réutilisables.

### Exemple : MultiplicationPage

```javascript
import { MultiplicationPage } from '../pages/MultiplicationPage.js';

test('example test', async ({ page }) => {
  const multiPage = new MultiplicationPage(page);
  
  // Navigation
  await multiPage.goto();
  
  // Démarrer un jeu
  await multiPage.startGame('TestPlayer', 'Sorcier');
  
  // Répondre à une question
  const correctAnswer = await multiPage.getCorrectAnswer();
  await multiPage.answerQuestion(correctAnswer);
  
  // Vérifier le score
  const score = await multiPage.getScore();
  expect(score).toContain('15/15');
});
```

### Avantages du POM

- **Maintenabilité** : Les changements dans l'UI nécessitent des modifications uniquement dans les pages
- **Réutilisabilité** : Les méthodes peuvent être utilisées dans plusieurs tests
- **Lisibilité** : Les tests ressemblent à des instructions en langage naturel

---

## Écrire de nouveaux tests

### Template de base

```javascript
import { test, expect } from '@playwright/test';
import { MultiplicationPage } from '../pages/MultiplicationPage.js';

test.describe('Ma fonctionnalité', () => {
  test('devrait faire quelque chose', async ({ page }) => {
    const multiPage = new MultiplicationPage(page);
    
    // Arrange (préparer)
    await multiPage.goto();
    
    // Act (agir)
    await multiPage.startGame('TestPlayer', 'Sorcier');
    
    // Assert (vérifier)
    await expect(multiPage.gameArea).toBeVisible();
  });
});
```

### Bonnes pratiques pour les sélecteurs

```javascript
// ✅ BON : Utiliser des IDs ou data-testid
page.locator('#player-name')
page.locator('[data-testid="submit-btn"]')

// ⚠️ ACCEPTABLE : Classes CSS stables
page.locator('.difficulty-btn')

// ❌ ÉVITER : Texte qui peut changer ou sélecteurs fragiles
page.locator('button:has-text("Valider")')  // Peut casser si le texte change
page.locator('div > div > button')  // Fragile, structure peut changer
```

### Gestion des timeouts

```javascript
// Les méthodes du POM gèrent déjà les attentes
await multiPage.answerQuestion(42);  // Attend automatiquement la transition

// Pour des cas spéciaux, utiliser waitForFunction
await page.waitForFunction(() => {
  return document.querySelector('#score').textContent.includes('15');
});

// Éviter waitForTimeout sauf si absolument nécessaire
await page.waitForTimeout(2000);  // ❌ Fragile et lent
```

---

## Débogage

### 1. UI Mode (le plus simple)

```bash
yarn test:e2e:ui
```

- Interface graphique interactive
- Pas-à-pas dans les tests
- Voir les DOM snapshots
- Time travel debugging

### 2. Headed Mode

```bash
yarn test:e2e:headed
```

- Voir le navigateur en action
- Ralentir l'exécution avec `page.pause()`

### 3. Analyse des échecs

Quand un test échoue :

1. **Screenshot** : `test-results/[test-name]/test-failed-1.png`
2. **Video** : `test-results/[test-name]/video.webm`
3. **Trace** : `test-results/[test-name]/trace.zip`
4. **Error Context** : `test-results/[test-name]/error-context.md`

### 4. Déboguer avec console.log

```javascript
test('debug test', async ({ page }) => {
  const multiPage = new MultiplicationPage(page);
  await multiPage.goto();
  
  // Afficher le contenu d'un élément
  const text = await multiPage.questionText.textContent();
  console.log('Question:', text);
  
  // Afficher l'état du DOM
  const html = await page.content();
  console.log(html);
});
```

---

## Best Practices

### 1. Isolation des tests

```javascript
test.beforeEach(async ({ page }) => {
  // Nettoyer localStorage avant chaque test
  await page.goto('/index.html');
  await page.evaluate(() => localStorage.clear());
});
```

### 2. Tests indépendants

❌ **MAUVAIS** : Tests qui dépendent les uns des autres
```javascript
test('step 1', async () => { /* créer données */ });
test('step 2', async () => { /* utiliser données de step 1 */ });  // ❌
```

✅ **BON** : Chaque test configure son propre état
```javascript
test('test complet', async () => {
  // Setup
  // Execute
  // Verify
});
```

### 3. Assertions explicites

```javascript
// ✅ BON : Assertions spécifiques
await expect(multiPage.scoreDisplay).toContainText('15/15');
await expect(multiPage.correctCount).toBe(15);

// ❌ ÉVITER : Assertions trop générales
await expect(multiPage.scoreDisplay).toBeVisible();  // Ne vérifie pas le contenu
```

### 4. Gestion des états asynchrones

```javascript
// ✅ BON : Attendre les changements d'état
await multiPage.answerQuestion(42);  // Attend automatiquement
await multiPage.waitForResults();

// ❌ ÉVITER : Timeouts fixes
await page.waitForTimeout(1000);  // Fragile
```

---

## CI/CD Integration

### Workflow GitHub Actions

Le workflow `.github/workflows/e2e.yml` exécute automatiquement les tests E2E sur :

- **Triggers** :
  - Push sur `main`
  - Pull requests vers `main`

- **Matrix strategy** :
  - Chromium
  - Firefox

- **Artifacts** :
  - Rapports HTML
  - Screenshots sur échec
  - Videos sur échec

### Configuration locale vs CI

```javascript
// playwright.config.js
export default defineConfig({
  // Sur CI, utilise 1 worker pour la stabilité
  workers: process.env.CI ? 1 : undefined,
  
  // Retry seulement sur CI
  retries: process.env.CI ? 2 : 0,
  
  // Serveur web réutilisé en local, nouveau sur CI
  webServer: {
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## Troubleshooting

### Tests flaky (instables)

**Symptôme** : Le test passe parfois, échoue parfois

**Solutions** :
1. Augmenter les timeouts : `test.setTimeout(60000)`
2. Utiliser `waitForFunction` au lieu de `waitForTimeout`
3. Vérifier les conditions de course (race conditions)
4. Activer `retries: 2` dans la config

### Timeouts

**Symptôme** : `Test timeout of 30000ms exceeded`

**Solutions** :
```javascript
// Augmenter le timeout pour un test spécifique
test('slow test', async ({ page }) => {
  test.setTimeout(90000);  // 90 secondes
  // ...
});

// Ou globalement dans playwright.config.js
export default defineConfig({
  timeout: 60000,  // 60 secondes
});
```

### Sélecteurs qui ne fonctionnent pas

**Symptôme** : `Locator not found`

**Solutions** :
1. Vérifier que l'élément existe : `await page.locator('#id').count()`
2. Attendre que l'élément apparaisse : `await page.waitForSelector('#id')`
3. Vérifier les typos dans les IDs/classes
4. Utiliser UI Mode pour inspecter le DOM

### LocalStorage non persistant

**Symptôme** : Les données ne persistent pas entre les pages

**Solutions** :
1. Vérifier que vous êtes sur le même domaine/port
2. Utiliser `page.context()` pour partager le storage
3. Ne pas utiliser `context.clearCookies()` accidentellement

---

## Ressources

- **Documentation Playwright** : https://playwright.dev/
- **Best Practices** : https://playwright.dev/docs/best-practices
- **Sélecteurs** : https://playwright.dev/docs/selectors
- **API Reference** : https://playwright.dev/docs/api/class-test

---

## Support

Pour toute question ou problème :

1. Consulter cette documentation
2. Utiliser UI Mode pour déboguer : `yarn test:e2e:ui`
3. Vérifier les screenshots/videos dans `test-results/`
4. Examiner les traces avec `yarn playwright show-trace trace.zip`

---

**Dernière mise à jour** : 23 novembre 2025
