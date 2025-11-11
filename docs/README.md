# Documentation Technique - Mad Mathematics

Index de toute la documentation technique du projet.

---

## 📚 Vue d'ensemble

Ce dossier contient l'ensemble des guidelines et procédures techniques pour le développement du projet Mad Mathematics.

**Point d'entrée principal:** [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)

---

## 📖 Documentation Disponible

### 🧪 Tests

- **[TESTING_GUIDELINES.md](./TESTING_GUIDELINES.md)** - Guidelines complètes pour les tests unitaires
  - Framework: Vitest
  - Scope: Tests de `shared.js`
  - Coverage cible: 90%+
  - Approche: TDD (Test-Driven Development)

### 📝 Processus et Méthodologie

- **[DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md)** - Comment gérer la documentation
  - Règle d'or: Demander autorisation avant mise à jour
  - Organisation des fichiers dans `docs/`
  - Synchronisation avec `.github/copilot-instructions.md`
  - Templates de demande et workflows

---

## 🔜 Documentation à Venir

Les guidelines suivantes seront ajoutées au fur et à mesure :

### Tests (futur)

- `INTEGRATION_TESTING.md` - Tests d'intégration pour les pages HTML complètes
- `E2E_TESTING.md` - Tests end-to-end avec Playwright
- `VISUAL_REGRESSION.md` - Tests de régression visuelle

### Développement (futur)

- `ARCHITECTURE.md` - Décisions d'architecture (ADR)
- `ACCESSIBILITY.md` - Standards d'accessibilité WCAG 2.1
- `DEPLOYMENT.md` - Procédures de déploiement GitHub Pages
- `PERFORMANCE.md` - Guidelines de performance

---

## 🎯 Comment Utiliser Cette Documentation

### Pour les AI Agents

1. **Toujours commencer** par lire [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)
2. **Consulter** la guideline spécifique au domaine concerné
3. **Demander autorisation** avant toute modification de documentation (voir DOCUMENTATION_GUIDELINES.md)
4. **Mettre à jour** ce README si vous ajoutez un nouveau fichier

### Pour les Développeurs

1. Lire les guidelines pertinentes avant de commencer à coder
2. Suivre les conventions et patterns documentés
3. Mettre à jour la documentation en même temps que le code
4. Référencer les décisions importantes dans les fichiers concernés

---

## 📂 Structure des Fichiers

```
docs/
├── README.md                        # Ce fichier (index)
├── DOCUMENTATION_GUIDELINES.md      # Gestion de la documentation
├── TESTING_GUIDELINES.md            # Tests unitaires
└── [futurs fichiers...]             # Guidelines à venir
```

---

## ✅ Standards de Documentation

Tous les fichiers de ce dossier suivent les standards définis dans [DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md) :

- ✅ En-tête avec date de mise à jour
- ✅ Table des matières pour fichiers >100 lignes
- ✅ Exemples concrets du projet
- ✅ Références vers autres docs pertinentes
- ✅ Checklists et templates réutilisables

---

## 🔗 Liens Rapides

- **Projet principal:** [README.md](../README.md)
- **Instructions AI:** [.github/copilot-instructions.md](../.github/copilot-instructions.md)
- **Code Review:** [CODE_REVIEW.md](../CODE_REVIEW.md)

---

**Dernière mise à jour:** 11 novembre 2025  
**Maintenu par:** AI Agent + développeurs
