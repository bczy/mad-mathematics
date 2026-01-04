# 🧙‍♂️ Mad Mathematics - React Edition

**École de Magie des Mathématiques** - Un jeu éducatif interactif pour pratiquer les tables de multiplication, addition, soustraction et division.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)
![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?logo=playwright)

## ✨ Fonctionnalités

- 🎮 **4 modes de jeu**: Multiplication, Addition, Soustraction, Division
- ⭐ **Niveaux de difficulté**: Apprenti, Confirmé, Grand, Super-Multi
- ⏱️ **Timer configurable**: Mode chronométré ou illimité
- 🏆 **Highscores**: Top 5 par niveau avec médailles 🥇🥈🥉
- 📱 **Responsive**: Fonctionne sur desktop, tablette et mobile
- ♿ **Accessible**: Navigation clavier, ARIA labels, contrastes WCAG AA

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+ (LTS recommandé)
- Yarn 4+ (via Corepack)

### Installation

```bash
# Activer Corepack (une fois par machine)
corepack enable

# Installer les dépendances
yarn install

# Lancer le serveur de développement
yarn dev
```

Ouvrir [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## 📜 Scripts Disponibles

| Commande             | Description                               |
| -------------------- | ----------------------------------------- |
| `yarn dev`           | Démarre le serveur de développement (HMR) |
| `yarn build`         | Build de production optimisé              |
| `yarn preview`       | Prévisualise le build de production       |
| `yarn test`          | Lance les tests unitaires en mode watch   |
| `yarn test:run`      | Lance les tests unitaires une fois        |
| `yarn test:coverage` | Génère le rapport de couverture           |
| `yarn e2e`           | Lance les tests E2E Playwright            |
| `yarn e2e:ui`        | Lance Playwright en mode interactif       |
| `yarn lint`          | Vérifie le code avec ESLint               |
| `yarn tsc -b`        | Vérifie les types TypeScript              |

## 🏗️ Architecture

```
src/
├── components/           # Composants réutilisables
│   ├── common/          # Button, Card, etc.
│   └── game/            # Timer, ProgressBar, QuestionDisplay, etc.
├── hooks/               # Custom hooks React
│   ├── useGameTimer.ts  # Logique du timer
│   ├── useGameLogic.ts  # Génération de questions, validation
│   └── useKeyboardInput.ts
├── pages/               # Pages/Routes
│   ├── HomePage.tsx
│   ├── MultiplicationPage.tsx
│   ├── AdditionPage.tsx
│   ├── SoustractionPage.tsx
│   └── DivisionPage.tsx
├── store/               # Zustand state management
│   ├── slices/          # playerSlice, highscoresSlice, gameSlice
│   └── middleware/      # localStorage persistence
├── types/               # Types TypeScript
└── utils/               # Utilitaires (formatTime, validation Zod)
```

### Stack Technique

| Technologie        | Usage                         |
| ------------------ | ----------------------------- |
| **React 19**       | UI Library avec hooks         |
| **TypeScript 5.9** | Type safety strict            |
| **Vite 7**         | Build tool & dev server       |
| **Tailwind CSS 3** | Styling utility-first         |
| **Zustand 5**      | État global léger             |
| **React Router 7** | Routing client-side           |
| **Zod 4**          | Validation runtime            |
| **Vitest**         | Tests unitaires               |
| **Playwright**     | Tests E2E & visual regression |

## 🧪 Tests

### Tests Unitaires (Vitest + React Testing Library)

```bash
# Mode watch
yarn test

# Une seule exécution avec couverture
yarn test:coverage
```

**Couverture cible**: 90%+

### Tests E2E (Playwright)

```bash
# Tous les navigateurs
yarn e2e

# Navigateur spécifique
yarn e2e --project=chromium
yarn e2e --project=firefox
yarn e2e --project=webkit

# Mode interactif
yarn e2e:ui
```

## 📦 Build & Déploiement

### Build de Production

```bash
yarn build
```

Le build optimisé est généré dans `dist/`:

- Bundle gzippé: ~93KB
- Code splitting avec lazy loading
- Modulepreload pour les chunks critiques

### Déploiement GitHub Pages

Le déploiement est automatique via GitHub Actions:

1. Push sur `main` déclenche le workflow CI/CD
2. Tests (lint, typecheck, unit, E2E) s'exécutent
3. Build de production
4. Déploiement sur GitHub Pages

## 🎨 Design System

### Couleurs

- **Primary (Gold)**: Boutons d'action principaux
- **Secondary (Gray)**: Actions secondaires
- **Danger (Red)**: Actions destructives
- **Background**: Gradient violet foncé (#1a0033 → #2d1b4e)

### Composants

Tous les composants sont dans `src/components/` et utilisent Tailwind CSS avec des variantes configurées.

## 📱 Responsive Design

- **Mobile**: < 640px - Layout vertical, touch-friendly
- **Tablet**: 640px - 1024px - Layout adaptatif
- **Desktop**: > 1024px - Layout complet avec grilles

## ♿ Accessibilité

- Navigation clavier complète (Tab, Enter, Escape)
- ARIA labels sur tous les éléments interactifs
- `aria-live` regions pour les annonces de score
- Contraste WCAG AA (≥ 4.5:1)

## 🔧 Configuration

### Variables d'Environnement

Aucune variable d'environnement requise - l'app est entièrement client-side.

### Base Path

Configuré pour GitHub Pages: `/mad-mathematics/`

Voir `vite.config.ts` pour modifier.

## 📄 Licence

Ce projet est à usage éducatif.

## 🙏 Crédits

- Design original: Mad Mathematics vanilla JS
- Migration React: GitHub Copilot + équipe de développement
