# Migration npm → Yarn v4 - Mad Mathematics

**Dernière mise à jour:** 11 novembre 2024  
**Scope:** Migration du gestionnaire de dépendances de npm vers Yarn v4 (Modern/Berry)

## 🎯 Pourquoi Yarn v4 ?

- **Performance supérieure avec Plug'n'Play (PnP)** : Installation plus rapide sans créer de dossier `node_modules`
- **Meilleure gestion des dépendances** : `yarn resolutions` pour résoudre les conflits de versions
- **Cache global** : Réduire les téléchargements en réutilisant les packages entre projets
- **Support natif des workspaces** : Prêt pour une architecture monorepo si besoin futur
- **Sécurité renforcée** : Vérifications de hachage et verrouillage strict des versions

## 📋 Prérequis

- **Node.js LTS** (20.x ou 22.x recommandé)
- **Corepack activé** (inclus avec Node.js 16.10+)

## 🚀 Installation pour Développeurs

### Setup Initial

```bash
# Activer Corepack (une seule fois par machine)
corepack enable

# Installer les dépendances
yarn install
```

C'est tout ! Yarn détectera automatiquement la version configurée (v4) et installera les dépendances avec Plug'n'Play.

## 📚 Commandes Courantes

| npm                     | Yarn v4                    | Description                             |
| ----------------------- | -------------------------- | --------------------------------------- |
| `npm install`           | `yarn install`             | Installer les dépendances               |
| `npm ci`                | `yarn install --immutable` | Installation en CI/CD (lockfile strict) |
| `npm run test`          | `yarn test`                | Lancer les tests en mode watch          |
| `npm run test:run`      | `yarn test:run`            | Lancer les tests une fois               |
| `npm run test:coverage` | `yarn test:coverage`       | Générer le rapport de couverture        |
| `npm run lint`          | `yarn lint`                | Vérifier le code avec ESLint            |
| `npm run format`        | `yarn format`              | Formater le code avec Prettier          |
| `npm run commit`        | `yarn commit`              | Créer un commit avec Commitizen         |

**Note:** Avec Yarn v4, vous pouvez omettre `run` : `yarn test` au lieu de `yarn run test`

## 🔧 Yarn Resolutions

Pour forcer une version spécifique d'une dépendance (utile pour résoudre des conflits) :

```json
{
  "resolutions": {
    "package-name": "1.2.3",
    "nested-package": "^2.0.0"
  }
}
```

Ajouter cette section dans `package.json` puis relancer `yarn install`.

## 📁 Structure des Fichiers Yarn

```
mad-mathematics/
├── .yarn/
│   ├── install-state.gz    # État de l'installation (ignoré par git)
│   └── unplugged/          # Packages nécessitant un accès filesystem (ignoré)
├── .yarnrc.yml             # Configuration Yarn (commité)
├── .pnp.cjs                # Runtime Plug'n'Play (commité)
├── .pnp.loader.mjs         # Loader ESM pour PnP (commité)
└── yarn.lock               # Lockfile des dépendances (commité)
```

### Fichiers Committé vs Ignorés

**Committé dans Git :**

- `.yarnrc.yml` - Configuration du projet
- `yarn.lock` - Versions exactes des dépendances
- `.pnp.cjs` et `.pnp.loader.mjs` - Runtime Plug'n'Play

**Ignoré par Git :**

- `.yarn/install-state.gz` - État local de l'installation
- `.yarn/unplugged/` - Packages décompressés (générés automatiquement)

## 🐛 Troubleshooting

### Erreur : "This project is configured to use Yarn"

**Solution :**

```bash
corepack enable
yarn install
```

### Erreur : "PnP resolution failed"

Si une dépendance n'est pas compatible avec Plug'n'Play, vous pouvez revenir au mode `node_modules` classique :

```bash
# Configurer Yarn pour utiliser node_modules
yarn config set nodeLinker node-modules

# Nettoyer les fichiers PnP
rm -rf .yarn .pnp.cjs .pnp.loader.mjs

# Réinstaller
yarn install
```

**Note:** Cette approche perd les avantages de PnP. Préférer d'abord chercher une solution compatible.

### Cache corrompu

Si vous rencontrez des erreurs étranges lors de l'installation :

```bash
# Nettoyer le cache global
yarn cache clean

# Supprimer les fichiers locaux
rm -rf .yarn/install-state.gz .pnp.cjs .pnp.loader.mjs

# Réinstaller
yarn install
```

### Conflits de versions de dépendances

Utiliser `yarn resolutions` dans `package.json` :

```json
{
  "resolutions": {
    "problematic-package": "1.2.3"
  }
}
```

### Tests échouent après migration

Vérifier que tous les scripts dans `package.json` utilisent bien Yarn :

```bash
# Tester localement
yarn test:run
yarn test:coverage
yarn lint
```

## 🔄 Différences avec npm

### Installation

**npm :**

- Crée un dossier `node_modules/` avec tous les packages
- Utilise `package-lock.json`

**Yarn v4 (PnP) :**

- Ne crée pas de `node_modules/` (mode PnP par défaut)
- Utilise `yarn.lock` et `.pnp.cjs`
- Résolution instantanée des dépendances

### Commandes

La plupart des commandes npm ont un équivalent direct dans Yarn. La principale différence est que `npm run <script>` devient simplement `yarn <script>`.

### Cache

Yarn v4 utilise un **cache global** partagé entre tous les projets, économisant de l'espace disque et du temps de téléchargement.

## 🔗 Ressources

- [Yarn v4 Documentation officielle](https://yarnpkg.com/)
- [Plug'n'Play - Explication](https://yarnpkg.com/features/pnp)
- [Resolutions - Guide](https://yarnpkg.com/configuration/manifest#resolutions)
- [Corepack - Node.js](https://nodejs.org/api/corepack.html)
- [Migration depuis npm](https://yarnpkg.com/getting-started/migration)

## 📝 Notes de Migration

### Changements Effectués

- ✅ Installation de Yarn v4.11.0 via Corepack
- ✅ Configuration Plug'n'Play activée
- ✅ Suppression de `package-lock.json`
- ✅ Création de `yarn.lock` et fichiers PnP
- ✅ Mise à jour des workflows GitHub Actions (`.github/workflows/test.yml`)
- ✅ Mise à jour de `.gitignore` pour Yarn
- ✅ Mise à jour de `eslint.config.js` pour ignorer les fichiers PnP
- ✅ Tous les tests passent avec Yarn

### Tests de Validation

Tous les scripts ont été testés et fonctionnent correctement :

```bash
yarn test:run        # ✅ 38 tests passent
yarn test:coverage   # ✅ Génération de coverage
yarn lint            # ✅ Pas d'erreurs
yarn format:check    # ✅ Formatage OK
```

### Compatibilité

- **Node.js:** Compatible avec LTS (20.x, 22.x)
- **CI/CD:** GitHub Actions configuré avec `yarn install --immutable`
- **Développeurs:** Requiert seulement `corepack enable` (une fois)
