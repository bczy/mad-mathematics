# Documentation Coherence Checklist - Mad Mathematics

**Version:** 1.0.0  
**Dernière mise à jour:** 10 janvier 2026  
**Objectif:** Garantir la cohérence entre le code et la documentation

---

## 🎯 Vue d'ensemble

Cette checklist aide à vérifier que la documentation reste synchronisée avec le code. À utiliser avant chaque commit, lors des code reviews, et pendant les audits mensuels.

**Principe fondamental:** Documentation et code doivent toujours être en phase.

---

## ✅ Checklist Pré-Commit

### 1. Analyse d'Impact Documentation

Avant de commiter du code, vérifier :

- [ ] **Identifier les fichiers de documentation impactés**
  - [ ] Modifications de composants React → `docs/COMPONENT_GUIDELINES.md` (si existe)
  - [ ] Modifications de tests → `docs/TESTING_GUIDELINES.md`
  - [ ] Modifications de hooks → `.github/copilot-instructions.md` (section Custom Hooks)
  - [ ] Modifications d'utils → TSDoc inline + exemples
  - [ ] Modifications de workflow → `docs/README.md` ou `.github/copilot-instructions.md`
  - [ ] Nouvelles dépendances → `docs/YARN_MIGRATION.md`
  - [ ] Changements de build → `.github/copilot-instructions.md` (section Build)

### 2. Demande d'Autorisation (OBLIGATOIRE)

- [ ] **Lister tous les fichiers de documentation à mettre à jour**
- [ ] **Demander autorisation explicite à l'utilisateur** :
  ```
  🔔 Cette modification impacte la documentation suivante :
  - [fichier1.md] : [raison]
  - [fichier2.md] : [raison]
  
  Dois-je mettre à jour la documentation maintenant ?
  ```
- [ ] **Attendre confirmation avant de procéder**
- [ ] **Si refusé : commiter uniquement le code**
- [ ] **Si accepté : procéder aux mises à jour**

### 3. Mise à Jour de la Documentation

Si autorisation accordée :

- [ ] **Mettre à jour les dates "Dernière mise à jour"**
- [ ] **Vérifier cohérence avec le code actuel**
- [ ] **Mettre à jour exemples de code si obsolètes**
- [ ] **Tester tous les exemples de code documentés**
- [ ] **Vérifier que les liens internes fonctionnent**
- [ ] **Mettre à jour les références TypeScript (props, types)**

### 4. Synchronisation Index Principal

- [ ] **Vérifier `.github/copilot-instructions.md` à jour**
  - [ ] Tous les nouveaux composants/hooks sont documentés
  - [ ] Section "Available Scripts" reflète package.json
  - [ ] Architecture correspond à src/
  - [ ] Références vers docs/ sont exactes
  
- [ ] **Vérifier `docs/README.md` à jour**
  - [ ] Tous les fichiers docs/*.md sont listés
  - [ ] Descriptions sont précises
  - [ ] Liens fonctionnent

### 5. Validation TSDoc/JSDoc

Pour tout fichier de code modifié :

- [ ] **Composants React**
  ```typescript
  /**
   * [Description du composant]
   *
   * @param props - [Description des props]
   * @param props.propName - [Description de chaque prop]
   *
   * @example
   * ```tsx
   * <Component prop="value" />
   * ```
   */
  ```

- [ ] **Hooks personnalisés**
  ```typescript
  /**
   * [Description du hook]
   *
   * @param options - [Description des options]
   * @returns [Description du retour avec interface]
   *
   * @example
   * ```tsx
   * const { value } = useHook({ option: true });
   * ```
   */
  ```

- [ ] **Fonctions utilitaires**
  ```typescript
  /**
   * [Description de la fonction]
   *
   * @param param - [Description du paramètre]
   * @returns [Description du retour]
   *
   * @example
   * ```ts
   * functionName(input)  // output
   * ```
   */
  ```

### 6. Commit Atomique

- [ ] **Code + docs commitées ensemble**
- [ ] **Message de commit mentionne les docs si modifiées**
  - Format : `type(scope): description + update docs`
  - Exemple : `feat(hooks): add useLocalStorage + update docs`
- [ ] **Suivre Conventional Commits** (voir `docs/COMMIT_GUIDELINES.md`)

---

## 🔍 Checklist Code Review

### Vérification Documentation

Lors de la revue d'une PR :

- [ ] **Documentation mise à jour**
  - [ ] Tous les fichiers impactés sont modifiés
  - [ ] Dates de mise à jour actualisées
  - [ ] Exemples de code testés et fonctionnels
  
- [ ] **Cohérence code ↔ docs**
  - [ ] Noms de composants/fonctions correspondent
  - [ ] Signatures TypeScript correspondent
  - [ ] Comportements décrits correspondent au code
  - [ ] Exemples utilisent les bonnes props/paramètres

- [ ] **TSDoc/JSDoc présent**
  - [ ] Tous les exports publics documentés
  - [ ] Paramètres et retours typés et décrits
  - [ ] Exemples d'utilisation présents
  - [ ] Edge cases documentés

- [ ] **Tests reflétés dans TESTING_GUIDELINES.md**
  - [ ] Nouveaux patterns de test documentés
  - [ ] Exemples de mocks mis à jour
  - [ ] Coverage maintenu à 90%+

### Vérification Références Croisées

- [ ] **Index principal à jour**
  - [ ] `.github/copilot-instructions.md` référence tous les docs
  - [ ] Nouveaux fichiers docs listés dans `docs/README.md`
  - [ ] Liens relatifs fonctionnent

- [ ] **Liens internes validés**
  - [ ] Tous les `[text](path)` pointent vers fichiers existants
  - [ ] Ancres markdown (#section) sont correctes
  - [ ] Chemins relatifs corrects (../ pour remonter)

---

## 🏗️ Checklist Cohérence Architecture

### Structure du Projet

Vérifier que la documentation reflète la vraie structure :

- [ ] **`.github/copilot-instructions.md` → Section "Project Structure"**
  ```
  mad-mathematics-react/
  ├── src/
  │   ├── components/
  │   │   ├── common/      # ← Vérifier que ces dossiers existent
  │   │   └── game/        # ← Vérifier que ces dossiers existent
  │   ├── hooks/           # ← Vérifier fichiers listés
  │   ├── pages/           # ← Vérifier fichiers listés
  │   ├── store/
  │   ├── types/
  │   └── utils/
  ```

- [ ] **Comparer avec structure réelle**
  ```bash
  tree mad-mathematics-react/src -L 2
  ```

- [ ] **Lister divergences**
  - Dossiers dans docs mais absents du code
  - Dossiers dans code mais absents de docs
  - Fichiers mentionnés mais non créés

### Technology Stack

- [ ] **Versions dans docs correspondent à package.json**
  - [ ] React version
  - [ ] TypeScript version
  - [ ] Vite version
  - [ ] Vitest version
  - [ ] Tailwind CSS version
  - [ ] Yarn version (.yarnrc.yml)

- [ ] **Dépendances documentées existent réellement**
  ```bash
  cd mad-mathematics-react && yarn info [package]
  ```

### Scripts Disponibles

- [ ] **Section "Available Scripts" correspond à package.json**
  ```bash
  cd mad-mathematics-react
  cat package.json | grep -A 10 "scripts"
  ```

- [ ] **Vérifier chaque script documenté**
  - [ ] `yarn dev` existe
  - [ ] `yarn build` existe
  - [ ] `yarn test` existe
  - [ ] `yarn test:run` existe
  - [ ] `yarn test:coverage` existe
  - [ ] `yarn lint` existe
  - [ ] `yarn e2e` existe

---

## 🧪 Checklist Cohérence Tests

### Documentation vs. Tests Réels

- [ ] **TESTING_GUIDELINES.md reflète les vrais tests**
  - [ ] Framework utilisé est correct (Vitest + React Testing Library)
  - [ ] Structure des tests correspond aux exemples
  - [ ] Patterns de mocking sont utilisés dans le code
  - [ ] Coverage targets sont configurés dans vitest.config.ts

- [ ] **Exemples de tests sont exécutables**
  - [ ] Copier/coller un exemple de la doc
  - [ ] Créer un fichier test temporaire
  - [ ] Vérifier qu'il passe sans erreur

- [ ] **Setup global documenté existe**
  - [ ] Fichier `tests/setup.ts` existe
  - [ ] Contenu correspond à la documentation
  - [ ] Imports @testing-library/jest-dom présents

### Configuration de Test

- [ ] **vitest.config.ts correspond à la doc**
  - [ ] Coverage thresholds : 90% sur tous les metrics
  - [ ] Environment : jsdom
  - [ ] Setup file configuré
  - [ ] Include patterns corrects

---

## 📦 Checklist Cohérence Dépendances

### Yarn v4 Configuration

- [ ] **YARN_MIGRATION.md reflète configuration actuelle**
  - [ ] Vérifier `.yarnrc.yml` existe et contient les bonnes options
  - [ ] Vérifier `yarn.lock` présent
  - [ ] Vérifier `.yarn/` ou PnP configuré
  - [ ] Commandes documentées fonctionnent

- [ ] **Package manager cohérent**
  ```bash
  yarn --version  # Doit être 4.x.x
  ```

- [ ] **Aucune référence npm dans les docs si Yarn obligatoire**
  - Rechercher "npm install" dans tous les .md
  - Remplacer par "yarn install" si trouvé

---

## 🎨 Checklist Cohérence Styling

### Tailwind CSS

- [ ] **Configuration documentée existe**
  - [ ] `tailwind.config.js` ou `tailwind.config.ts` présent
  - [ ] Content paths corrects
  - [ ] Plugins documentés sont installés

- [ ] **Exemples de classes Tailwind sont valides**
  - [ ] Pas de classes inventées
  - [ ] Breakpoints corrects (sm:, md:, lg:, xl:)
  - [ ] Variantes existent (hover:, focus:, etc.)

---

## 🔐 Checklist Cohérence Sécurité

### Guidelines de Sécurité

- [ ] **Pratiques documentées sont appliquées**
  - [ ] Pas de secrets dans le code (grep pour API_KEY, PASSWORD, SECRET)
  - [ ] Validation Zod utilisée pour inputs utilisateur
  - [ ] LocalStorage reads sont sanitizés
  - [ ] React auto-escaping documenté et vérifié

- [ ] **Constitution v2.0.0 → Section Security respectée**

---

## 📊 Audit Mensuel Complet

À faire une fois par mois :

### 1. Audit Global Documentation

- [ ] **Lire chaque fichier .md du projet**
- [ ] **Vérifier dates de mise à jour (< 30 jours)**
- [ ] **Identifier sections obsolètes**
- [ ] **Mettre à jour exemples si nécessaire**

### 2. Audit Références Croisées

- [ ] **Tester TOUS les liens markdown**
  ```bash
  # Script pour vérifier les liens
  grep -r "\[.*\](.*\.md)" --include="*.md" .
  ```

- [ ] **Vérifier cohérence des titres**
  - Titre dans fichier = titre dans index
  - Descriptions dans README.md = contenu réel

### 3. Audit Code → Docs

- [ ] **Lister tous les composants React**
  ```bash
  find mad-mathematics-react/src/components -name "*.tsx" | grep -v test
  ```

- [ ] **Vérifier que chacun a :**
  - [ ] TSDoc dans le fichier
  - [ ] Mention dans copilot-instructions.md (si partagé)
  - [ ] Exemple dans docs si pattern réutilisable

- [ ] **Lister tous les hooks personnalisés**
  ```bash
  find mad-mathematics-react/src/hooks -name "*.ts" | grep -v test
  ```

- [ ] **Vérifier que chacun a :**
  - [ ] TSDoc complet
  - [ ] Listé dans copilot-instructions.md section "Custom Hooks"
  - [ ] Exemples d'utilisation

- [ ] **Lister toutes les pages**
  ```bash
  find mad-mathematics-react/src/pages -name "*.tsx"
  ```

- [ ] **Vérifier routes documentées**
  - [ ] Chaque page listée dans copilot-instructions.md

### 4. Audit Tests

- [ ] **Vérifier coverage actuel**
  ```bash
  cd mad-mathematics-react && yarn test:coverage
  ```

- [ ] **Si < 90% : identifier pourquoi**
- [ ] **Vérifier que TESTING_GUIDELINES.md est à jour**

### 5. Audit TypeScript

- [ ] **Compiler TypeScript**
  ```bash
  cd mad-mathematics-react && yarn tsc --noEmit
  ```

- [ ] **Si erreurs : documenter les types manquants**
- [ ] **Vérifier strict mode activé dans tsconfig.json**

### 6. Métriques de Qualité Documentation

Calculer et documenter :

- [ ] **Fraîcheur**
  - Nombre de docs modifiés < 7 jours
  - Nombre de docs modifiés < 30 jours
  - Nombre de docs modifiés > 90 jours ⚠️

- [ ] **Couverture**
  - % de fonctions publiques avec TSDoc
  - % de composants avec exemples
  - % de hooks documentés

- [ ] **Exactitude**
  - Nombre de liens cassés
  - Nombre de contradictions code/doc trouvées
  - Nombre d'exemples de code non fonctionnels

---

## 🚨 Détection Automatique d'Incohérences

### Scripts d'Audit Automatique

#### 1. Vérifier structure documentée vs. réelle

```bash
#!/bin/bash
# check-structure.sh

echo "Vérification structure src/"
documented_dirs=$(grep -A 20 "mad-mathematics-react/" .github/copilot-instructions.md | grep "├──\|└──" | sed 's/.*─ //' | sed 's/\/.*//')
actual_dirs=$(ls -1 mad-mathematics-react/src/)

echo "Documentés mais absents :"
comm -23 <(echo "$documented_dirs" | sort) <(echo "$actual_dirs" | sort)

echo "Présents mais non documentés :"
comm -13 <(echo "$documented_dirs" | sort) <(echo "$actual_dirs" | sort)
```

#### 2. Vérifier scripts package.json vs. docs

```bash
#!/bin/bash
# check-scripts.sh

cd mad-mathematics-react
scripts=$(cat package.json | jq -r '.scripts | keys[]')

echo "Scripts disponibles :"
echo "$scripts"

echo ""
echo "Scripts documentés dans copilot-instructions.md :"
grep "yarn " ../.github/copilot-instructions.md | grep -v "install" | sed 's/.*yarn //' | sed 's/`.*//' | sort | uniq
```

#### 3. Vérifier liens markdown cassés

```bash
#!/bin/bash
# check-links.sh

echo "Recherche de liens markdown cassés..."

for file in $(find . -name "*.md"); do
  echo "Vérification de $file..."
  
  # Extraire les liens locaux (pas http://)
  links=$(grep -o '\[.*\]([^h][^)]*\.md[^)]*)' "$file" | sed 's/.*(\(.*\))/\1/')
  
  for link in $links; do
    # Résoudre le chemin relatif
    dir=$(dirname "$file")
    target="$dir/$link"
    
    if [ ! -f "$target" ]; then
      echo "  ❌ LIEN CASSÉ: $link (depuis $file)"
    fi
  done
done
```

#### 4. Vérifier TSDoc manquant

```bash
#!/bin/bash
# check-tsdoc.sh

echo "Recherche de exports sans TSDoc..."

cd mad-mathematics-react/src

# Chercher exports sans /** au-dessus
grep -B 1 "^export " **/*.{ts,tsx} | grep -v "test" | grep -v "/\*\*" | grep "export"
```

---

## 📋 Templates de Rapport d'Incohérence

### Template 1 : Incohérence détectée

```markdown
## 🔴 Incohérence Documentation/Code

**Fichier de code:** `[chemin/fichier.tsx]`
**Fichier de doc:** `[docs/FILE.md]`

**Type d'incohérence:** [Structure / Comportement / API / Configuration]

**Description:**
- Documentation dit : [description]
- Code fait : [comportement réel]

**Impact:**
- [ ] Critique (bloque développement)
- [ ] Majeur (confusion possible)
- [ ] Mineur (cosmétique)

**Action requise:**
- [ ] Mettre à jour documentation
- [ ] Corriger le code
- [ ] Les deux

**Fichiers à modifier:**
- [ ] `[fichier1.md]`
- [ ] `[fichier2.tsx]`
```

### Template 2 : Audit mensuel

```markdown
## 📊 Rapport d'Audit Documentation - [Mois YYYY]

**Date:** [JJ/MM/YYYY]
**Auditeur:** [Nom/AI Agent]

### Métriques

| Métrique | Valeur | Cible | Statut |
|----------|--------|-------|--------|
| Docs < 7 jours | X/Y | - | ✅ |
| Docs < 30 jours | X/Y | 100% | ⚠️ |
| TSDoc coverage | XX% | 100% | ❌ |
| Liens cassés | X | 0 | ⚠️ |
| Tests coverage | XX% | 90% | ✅ |

### Problèmes Détectés

1. **[Titre problème 1]**
   - Fichiers : `[...]`
   - Sévérité : [Critique/Majeur/Mineur]
   - Action : [...]

2. **[Titre problème 2]**
   - ...

### Actions Prioritaires

- [ ] Action 1 (Critique)
- [ ] Action 2 (Majeure)
- [ ] Action 3 (Mineure)

### Tendances

- ✅ Améliorations depuis dernier audit : [...]
- ⚠️ Dégradations depuis dernier audit : [...]

**Prochaine révision:** [Date]
```

---

## 🎯 Checklist Rapide (Quotidienne)

Pour les commits quotidiens :

- [ ] Impact documentation identifié ?
- [ ] Autorisation demandée si impact ?
- [ ] Docs mises à jour si autorisé ?
- [ ] TSDoc ajouté pour nouveaux exports ?
- [ ] Commit atomique (code + docs) ?
- [ ] Message commit suit Conventional Commits ?

**Temps estimé:** 2-5 minutes par commit

---

## 🛠️ Outils d'Aide

### Extensions VS Code Recommandées

- **Markdown All in One** - Vérification liens markdown
- **TypeScript TSDoc** - Validation TSDoc
- **Conventional Commits** - Aide à formater commits
- **TODO Highlight** - Identifier TODOs dans docs

### Scripts package.json Utiles

```json
{
  "scripts": {
    "docs:check-links": "bash scripts/check-links.sh",
    "docs:check-structure": "bash scripts/check-structure.sh",
    "docs:check-tsdoc": "bash scripts/check-tsdoc.sh",
    "docs:audit": "bash scripts/full-audit.sh"
  }
}
```

---

## ✅ Validation Finale

Avant de marquer la documentation comme "cohérente" :

- [ ] **Tous les tests passent**
  ```bash
  cd mad-mathematics-react && yarn test:run
  ```

- [ ] **TypeScript compile sans erreur**
  ```bash
  cd mad-mathematics-react && yarn tsc --noEmit
  ```

- [ ] **Build réussit**
  ```bash
  cd mad-mathematics-react && yarn build
  ```

- [ ] **Aucun lien markdown cassé**
- [ ] **Tous les exports ont TSDoc**
- [ ] **Coverage ≥ 90%**
- [ ] **Constitution v2.0.0 respectée**

---

## 📚 Références

- [DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md) - Processus de mise à jour
- [TESTING_GUIDELINES.md](./TESTING_GUIDELINES.md) - Standards de tests
- [COMMIT_GUIDELINES.md](./COMMIT_GUIDELINES.md) - Format des commits
- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - Index principal
- [.specify/memory/constitution.md](../.specify/memory/constitution.md) - Constitution v2.0.0

---

**Dernière révision:** Création suite à analyse de cohérence documentation/code  
**Version Constitution:** 2.0.0  
**Maintenu par:** AI Agents + Développeurs
