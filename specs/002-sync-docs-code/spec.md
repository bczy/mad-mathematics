# Feature Specification: Synchronisation Documentation-Code

**Feature Branch**: `002-sync-docs-code`  
**Created**: 2026-01-10  
**Status**: Draft  
**Input**: User description: "Synchroniser la documentation avec le code - corriger les incohérences détectées: fichier COMPONENT_GUIDELINES.md manquant, composant GameArea documenté mais inexistant, exemple Button obsolète, structure des tests incorrecte"

## Contexte

Suite à un audit de cohérence documentation/code, les incohérences suivantes ont été identifiées :

1. **Fichier `COMPONENT_GUIDELINES.md` manquant** - Référencé dans 4 fichiers mais n'existe pas
2. **Composant `GameArea` documenté mais inexistant** - Mentionné dans la doc, mais la logique est intégrée dans les pages
3. **Exemple `Button` obsolète** - La documentation montre une API différente de l'implémentation réelle
4. **`formatTimeDigital` non documenté** - Fonction existante sans documentation
5. **Structure des tests incohérente** - La doc suggère des tests co-localisés, mais ils sont séparés
6. **`ResultsScreen` dupliqué** - Documenté comme composant partagé mais défini 4 fois dans les pages

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Développeur cherche les guidelines de composants (Priority: P1)

Un développeur ou AI agent consulte la documentation pour comprendre les patterns de composants React du projet. Il clique sur le lien `COMPONENT_GUIDELINES.md` et obtient une page 404 ou une erreur.

**Why this priority**: Les liens cassés bloquent l'onboarding des nouveaux contributeurs et réduisent la confiance dans la documentation.

**Independent Test**: Vérifier que tous les liens markdown vers des fichiers `.md` dans `docs/` pointent vers des fichiers existants.

**Acceptance Scenarios**:

1. **Given** un développeur consulte `.github/copilot-instructions.md`, **When** il clique sur le lien vers `COMPONENT_GUIDELINES.md`, **Then** soit le fichier existe et s'ouvre, soit le lien a été supprimé.
2. **Given** un AI agent lit `docs/README.md`, **When** il cherche à suivre les liens de la section "Documentation Disponible", **Then** tous les liens résolvent vers des fichiers existants.
3. **Given** le fichier `docs/DOCUMENTATION_GUIDELINES.md`, **When** un utilisateur clique sur les références dans la section "Références et Liens", **Then** aucun lien n'est cassé.

---

### User Story 2 - Développeur recherche le composant GameArea (Priority: P1)

Un développeur lit la documentation qui mentionne un composant `GameArea` dans `components/game/`. Il cherche ce fichier pour comprendre son fonctionnement ou le modifier.

**Why this priority**: Mentionner des composants inexistants crée de la confusion et fait perdre du temps.

**Independent Test**: Vérifier que chaque composant mentionné dans la documentation existe réellement dans le code.

**Acceptance Scenarios**:

1. **Given** la documentation mentionne `GameArea` dans la structure du projet, **When** un développeur cherche ce fichier, **Then** soit le fichier existe, soit la documentation a été corrigée pour refléter la réalité.
2. **Given** `copilot-instructions.md` liste les composants de `game/`, **When** on compare avec le contenu réel du dossier, **Then** la liste correspond exactement aux fichiers présents.

---

### User Story 3 - Développeur utilise l'exemple Button de la doc (Priority: P2)

Un développeur copie l'exemple de code `Button` de la documentation pour créer un nouveau bouton. Le code ne fonctionne pas car l'API réelle est différente.

**Why this priority**: Des exemples incorrects conduisent à du code bugué et une perte de productivité.

**Independent Test**: Compiler les exemples de code de la documentation et vérifier qu'ils fonctionnent.

**Acceptance Scenarios**:

1. **Given** l'exemple `Button` dans `copilot-instructions.md`, **When** un développeur copie ce code, **Then** le code compile sans erreur TypeScript.
2. **Given** l'exemple de `Button` montre les props disponibles, **When** on les compare avec `ButtonProps` dans le code, **Then** toutes les props documentées existent avec les bons types.
3. **Given** la liste des variants dans la doc, **When** on vérifie le type `ButtonVariant`, **Then** tous les variants sont listés (y compris `ghost` et `size`).

---

### User Story 4 - Développeur cherche où placer ses tests (Priority: P2)

Un développeur crée un nouveau composant et consulte `TESTING_GUIDELINES.md` pour savoir où mettre les tests. La doc dit de co-localiser les tests, mais les tests existants sont dans un dossier séparé.

**Why this priority**: Les incohérences sur la structure des tests créent un projet désorganisé.

**Independent Test**: Vérifier que la structure documentée correspond à la structure réelle.

**Acceptance Scenarios**:

1. **Given** `TESTING_GUIDELINES.md` décrit une structure de tests, **When** on compare avec la structure réelle dans `tests/`, **Then** les deux correspondent.
2. **Given** un nouveau développeur lit la doc, **When** il crée un test pour un composant, **Then** il sait exactement où le placer sans confusion.

---

### User Story 5 - AI Agent génère de la documentation pour formatTime (Priority: P3)

Un AI agent doit documenter la fonction `formatTime`. Il lit l'exemple dans `DOCUMENTATION_GUIDELINES.md` mais l'exemple ne couvre pas tous les cas gérés par le code réel (`NaN`, `Infinity`, `formatTimeDigital`).

**Why this priority**: Les exemples incomplets peuvent mener à une documentation partielle.

**Independent Test**: Comparer les exemples TSDoc dans la doc avec les edge cases gérés par le code.

**Acceptance Scenarios**:

1. **Given** l'exemple `formatTime` dans la doc, **When** on liste les edge cases, **Then** tous les cas du code réel sont couverts (`NaN`, `Infinity`, `-Infinity`, négatifs).
2. **Given** la fonction `formatTimeDigital` existe, **When** on cherche sa documentation, **Then** elle est mentionnée quelque part dans les guidelines.

---

### Edge Cases

- Que se passe-t-il si un nouveau fichier est créé mais non référencé dans l'index ?
- Comment gérer un composant qui n'existe plus mais qui est toujours référencé ?
- Que faire si la structure de tests change après la mise à jour de la doc ?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Tous les liens vers des fichiers `.md` dans la documentation DOIVENT pointer vers des fichiers existants
- **FR-002**: La liste des composants dans `copilot-instructions.md` DOIT correspondre exactement aux fichiers présents dans `src/components/`
- **FR-003**: Les exemples de code dans la documentation DOIVENT compiler sans erreur TypeScript
- **FR-004**: La structure des dossiers de tests documentée DOIT correspondre à la structure réelle
- **FR-005**: Chaque fonction utilitaire publique dans `src/utils/` DOIT avoir un exemple dans la documentation qui couvre ses edge cases principaux
- **FR-006**: Les props/options documentées pour les composants et hooks DOIVENT correspondre aux interfaces TypeScript réelles

### Corrections Spécifiques

| ID | Incohérence | Action Requise |
|----|-------------|----------------|
| **FIX-001** | `COMPONENT_GUIDELINES.md` manquant | ✅ Supprimer toutes les références dans 4 fichiers |
| **FIX-002** | `GameArea` n'existe pas | Supprimer les mentions dans la doc et lister les vrais composants |
| **FIX-003** | Exemple `Button` obsolète | Mettre à jour avec les vraies props (`variant`, `size`, `fullWidth`, `ghost`) |
| **FIX-004** | `formatTimeDigital` non documenté | Ajouter dans les exemples de la doc |
| **FIX-005** | Structure tests incohérente | Documenter la vraie structure (`tests/` séparé de `src/`) |
| **FIX-006** | `ResultsScreen` dupliqué dans pages | ✅ Documenter comme pattern inline (défini dans chaque page, pas partagé) |

### Key Entities

- **Fichier de documentation**: Un fichier `.md` dans `docs/` ou `.github/` qui documente le projet
- **Référence/Lien**: Un lien markdown `[texte](chemin)` pointant vers un autre fichier
- **Exemple de code**: Un bloc de code dans la documentation illustrant l'utilisation d'une API

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% des liens vers des fichiers `.md` dans la documentation pointent vers des fichiers existants (0 lien cassé)
- **SC-002**: 100% des composants/hooks mentionnés dans la structure de projet existent dans le code
- **SC-003**: Tous les exemples de code TypeScript/React de la documentation compilent sans erreur
- **SC-004**: La différence entre structure documentée et structure réelle est de 0 fichier/dossier
- **SC-005**: Chaque fonction utilitaire publique a au moins 1 exemple documenté couvrant le cas nominal et 1 edge case

## Assumptions

- Le code actuel est considéré comme la source de vérité (la doc s'adapte au code, pas l'inverse)
- **FIX-001 : Supprimer les références** à `COMPONENT_GUIDELINES.md` (le contenu est déjà couvert dans `copilot-instructions.md` section "Component Patterns")
- La structure actuelle des tests (`tests/` séparé) est intentionnelle et doit être documentée comme telle
- `ResultsScreen` reste un pattern inline dans les pages (pas d'extraction en composant partagé pour cette feature)

## Clarifications

### Session 2026-01-10

- Q: Que faire pour `COMPONENT_GUIDELINES.md` manquant ? → A: Supprimer toutes les références (doc existe déjà dans copilot-instructions.md)
- Q: Comment documenter `ResultsScreen` (dupliqué 4 fois) ? → A: Documenter comme pattern inline (défini dans chaque page, pas partagé)

## Out of Scope

- Refactoring du code pour correspondre à la documentation (ex: créer `GameArea`, extraire `ResultsScreen`)
- Création de nouvelles guidelines (ex: `ACCESSIBILITY.md`, `DEPLOYMENT.md`)
- Mise à jour des tests unitaires existants
- Ajout de validation automatique de cohérence doc/code (CI/CD)
