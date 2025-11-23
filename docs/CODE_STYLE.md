# Guide de Style de Code - Mad Mathematics

**Dernière mise à jour :** 23 novembre 2025  
**Scope :** Conventions de codage pour HTML, CSS et JavaScript  
**Langue obligatoire :** Français

---

## 🎯 Principe Fondamental : Tout en Français

> **Règle d'or : Tout le code, les commentaires et la documentation de ce projet doivent être rédigés en français.**

Cela inclut :

- ✅ **Commentaires inline** dans le code JavaScript, HTML et CSS
- ✅ **Documentation JSDoc** pour toutes les fonctions
- ✅ **Noms de variables** et constantes (sauf conventions établies comme `i`, `x`, `y`)
- ✅ **Noms de fonctions** descriptives
- ✅ **Messages de console** (`console.log`, `console.error`, etc.)
- ✅ **Messages d'erreur** et d'alerte
- ✅ **Textes visibles** par l'utilisateur (UI)
- ✅ **Commits et branches** (voir [COMMIT_GUIDELINES.md](./COMMIT_GUIDELINES.md))
- ✅ **Documentation markdown** (README, guides, etc.)

### Pourquoi le français ?

Mad Mathematics est un projet éducatif **destiné à des enfants francophones**. Utiliser le français dans tout le projet assure :

1. **Cohérence** entre le code et l'interface utilisateur
2. **Accessibilité** pour les contributeurs francophones
3. **Maintenabilité** - pas de mélange de langues qui rend le code difficile à lire
4. **Pédagogie** - le code devient une ressource d'apprentissage lisible

---

## 📋 Table des Matières

- [JavaScript](#javascript)
  - [Conventions de nommage](#conventions-de-nommage)
  - [Commentaires et documentation](#commentaires-et-documentation)
  - [Style de code](#style-de-code)
- [HTML](#html)
- [CSS](#css)
- [Exemples complets](#exemples-complets)
- [Checklist avant commit](#checklist-avant-commit)

---

## JavaScript

### Conventions de nommage

#### Variables et Constantes

**Règle :** Utiliser des noms descriptifs en français avec camelCase.

```javascript
// ✅ BON - Noms en français, descriptifs
const tempsEcoule = 0;
const reponseUtilisateur = document.getElementById('answer-input').value;
const nombreQuestions = 15;
let scoreJoueur = 0;
const niveauDifficulte = 'facile';

// ❌ MAUVAIS - Noms en anglais
const elapsedTime = 0;
const userAnswer = document.getElementById('answer-input').value;
const questionCount = 15;

// ❌ MAUVAIS - Abréviations cryptiques
const tmpEcl = 0;
const repUsr = input.value;
const nbQ = 15;
```

**Exceptions acceptées :**

- Variables de boucle standard : `i`, `j`, `k`
- Coordonnées mathématiques : `x`, `y`, `z`
- Noms très courts dans contexte évident : `a`, `b` pour swap temporaire

```javascript
// ✅ Acceptable dans le contexte
for (let i = 0; i < questions.length; i++) {
  const question = questions[i];
}

// Coordonnées
const x = Math.random() * 100;
const y = Math.random() * 100;
```

#### Fonctions

**Règle :** Verbes d'action en français, camelCase.

```javascript
// ✅ BON - Verbes français descriptifs
function afficherResultats() {}
function calculerScore(reponses) {}
function verifierReponse(reponseUtilisateur, reponseCorrecte) {}
function sauvegarderMeilleurScore(nom, score, temps, niveau) {}
function genererQuestion(difficulte) {}

// ❌ MAUVAIS - Verbes anglais
function showResults() {}
function calculateScore() {}
function checkAnswer() {}
```

**Patterns courants :**

| Action                | Verbe français  | Exemple                    |
| --------------------- | --------------- | -------------------------- |
| Afficher / Montrer    | `afficher`      | `afficherMessage()`        |
| Créer / Initialiser   | `creer`         | `creerTimer()`             |
| Calculer              | `calculer`      | `calculerTempsTotal()`     |
| Vérifier / Valider    | `verifier`      | `verifierFormulaire()`     |
| Sauvegarder / Enreg.  | `sauvegarder`   | `sauvegarderProgression()` |
| Charger / Récupérer   | `charger`       | `chargerMeilleursScores()` |
| Mettre à jour         | `mettreAJour`   | `mettreAJourAffichage()`   |
| Démarrer / Commencer  | `demarrer`      | `demarrerJeu()`            |
| Arrêter / Stopper     | `arreter`       | `arreterTimer()`           |
| Réinitialiser / Reset | `reinitialiser` | `reinitialiserJeu()`       |
| Générer               | `generer`       | `genererNombreAleatoire()` |

#### Classes et Objets (si utilisés)

```javascript
// ✅ BON - Noms en français, PascalCase
class GestionnaireScore {
  constructor() {
    this.scoreActuel = 0;
    this.meilleursScores = [];
  }

  ajouterPoints(points) {
    this.scoreActuel += points;
  }
}

const gestionnaire = new GestionnaireScore();
```

### Commentaires et Documentation

#### Commentaires inline

**Règle :** Tous les commentaires doivent être en français.

```javascript
// ✅ BON - Commentaires en français
// Calculer le score final en pourcentage
const scorePourcentage = (bonnesReponses / totalQuestions) * 100;

// Vérifier que le nombre est positif avant la division
if (diviseur > 0) {
  const quotient = dividende / diviseur;
}

// Empêcher les résultats négatifs dans les soustractions
if (nombre1 >= nombre2) {
  const resultat = nombre1 - nombre2;
}

// ❌ MAUVAIS - Commentaires en anglais
// Calculate final score as percentage
const scorePourcentage = (bonnesReponses / totalQuestions) * 100;
```

**Quand commenter :**

- ✅ Logique métier non évidente
- ✅ Raisons d'une décision technique
- ✅ Workarounds ou limitations connues
- ✅ Sections importantes d'un fichier
- ❌ Code auto-explicatif (éviter la redondance)

```javascript
// ✅ BON - Explique le POURQUOI
// On utilise Math.floor pour éviter les nombres décimaux dans les questions
const nombre = Math.floor(Math.random() * 10);

// On limite à 5 meilleurs scores pour ne pas surcharger localStorage
const meilleursScores = scores.slice(0, 5);

// ❌ MAUVAIS - Redondant avec le code
// Incrémenter i
i++;

// Obtenir la valeur de l'input
const valeur = input.value;
```

#### Documentation JSDoc

**Règle :** Toute fonction publique doit avoir une JSDoc complète **en français**.

**Template standard :**

```javascript
/**
 * Description courte de la fonction en une phrase
 *
 * Description détaillée optionnelle si nécessaire.
 * Peut s'étendre sur plusieurs lignes.
 *
 * @param {type} nomParam - Description du paramètre en français
 * @param {type} [nomParamOptional] - Paramètre optionnel (crochets)
 * @returns {type} Description de la valeur retournée
 *
 * @throws {ErrorType} Description des erreurs possibles
 *
 * @example
 * // Exemple d'utilisation avec résultat attendu
 * formaterTemps(65)  // "1m 5s"
 * formaterTemps(30)  // "30s"
 */
```

**Exemple complet :**

```javascript
/**
 * Formate un nombre de secondes en chaîne lisible "Xm Ys" ou "Xs"
 *
 * Pour les durées inférieures à une minute, affiche uniquement les secondes.
 * Pour les durées d'une minute ou plus, affiche minutes et secondes.
 *
 * @param {number} secondes - Nombre de secondes à formater (doit être >= 0)
 * @returns {string} Temps formaté (ex: "1m 30s" ou "45s")
 *
 * @example
 * formaterTemps(65)   // "1m 5s"
 * formaterTemps(30)   // "30s"
 * formaterTemps(0)    // "0s"
 * formaterTemps(125)  // "2m 5s"
 */
function formaterTemps(secondes) {
  const minutes = Math.floor(secondes / 60);
  const secondesRestantes = Math.floor(secondes % 60);
  return minutes > 0
    ? `${minutes}m ${secondesRestantes}s`
    : `${secondesRestantes}s`;
}

/**
 * Sauvegarde un score dans le classement du niveau spécifié
 *
 * Ajoute le nouveau score, trie par score décroissant puis temps croissant,
 * et conserve uniquement les 5 meilleurs. Le score est sauvegardé dans
 * localStorage avec la clé `highscores_${niveau}`.
 *
 * @param {string} nom - Nom du joueur (max 500 caractères recommandés)
 * @param {number} score - Score obtenu (0-15 pour niveaux normaux)
 * @param {number} temps - Temps en secondes
 * @param {string} niveau - Identifiant du niveau ('facile', 'moyen', 'difficile', 'super-multi')
 * @returns {boolean} true si le score entre dans le top 5, false sinon
 *
 * @throws Ne lance jamais d'erreur - retourne false en cas d'échec localStorage
 *
 * @example
 * // Score parfait rapide - entre dans le top 5
 * sauvegarderMeilleurScore('Alice', 15, 45, 'facile')  // true
 *
 * // Score moyen - peut-être pas dans le top 5
 * sauvegarderMeilleurScore('Bob', 8, 120, 'difficile')  // false
 */
function sauvegarderMeilleurScore(nom, score, temps, niveau) {
  try {
    let meilleursScores =
      JSON.parse(localStorage.getItem(`highscores_${niveau}`)) || [];

    const nouveauScore = {
      nom,
      score,
      temps,
      date: new Date().toISOString()
    };

    meilleursScores.push(nouveauScore);

    // Trier : meilleur score d'abord, puis temps le plus rapide
    meilleursScores.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.temps - b.temps;
    });

    const estDansTop5 = meilleursScores.indexOf(nouveauScore) < 5;

    // Garder seulement les 5 meilleurs
    meilleursScores = meilleursScores.slice(0, 5);

    localStorage.setItem(
      `highscores_${niveau}`,
      JSON.stringify(meilleursScores)
    );

    return estDansTop5;
  } catch (erreur) {
    console.error('Échec de sauvegarde du meilleur score:', erreur);
    return false;
  }
}
```

### Style de code

#### Formatage

**Indentation :** 2 espaces (pas de tabulations)

```javascript
// ✅ BON - 2 espaces
function exemple() {
  if (condition) {
    faireQuelqueChose();
  }
}

// ❌ MAUVAIS - 4 espaces ou tabulations
function exemple() {
  if (condition) {
    faireQuelqueChose();
  }
}
```

#### Points-virgules

**Règle :** Toujours utiliser des points-virgules.

```javascript
// ✅ BON
const valeur = 10;
faireQuelqueChose();

// ❌ MAUVAIS
const valeur = 10;
faireQuelqueChose();
```

#### Guillemets

**Règle :** Utiliser les guillemets simples (`'`) pour les strings, sauf template literals.

```javascript
// ✅ BON
const message = 'Bravo !';
const nom = 'Alice';
const template = `Bonjour ${nom}`;

// ❌ MAUVAIS
const message = "Bravo !";
```

#### Variables

**Règle :** Utiliser `const` par défaut, `let` si réassignation nécessaire. **Jamais `var`**.

```javascript
// ✅ BON
const scoreMaximum = 15;
let scoreActuel = 0;

scoreActuel = 10; // OK avec let

// ❌ MAUVAIS
var scoreMaximum = 15; // Ne jamais utiliser var
```

#### Longueur de ligne

**Règle :** Maximum 80-100 caractères par ligne. Couper si trop long.

```javascript
// ✅ BON - Ligne coupée pour lisibilité
const messageComplet =
  'Félicitations ! Vous avez terminé avec un score parfait. ' +
  'Votre temps sera enregistré dans le classement.';

// Ou avec template literal
const messageComplet = `
  Félicitations ! Vous avez terminé avec un score parfait.
  Votre temps sera enregistré dans le classement.
`;

// ❌ MAUVAIS - Ligne trop longue
const messageComplet =
  'Félicitations ! Vous avez terminé avec un score parfait. Votre temps sera enregistré dans le classement.';
```

#### Console et débogage

**Règle :** Messages de console en français. Retirer avant commit (sauf `console.error`).

```javascript
// ✅ BON - Messages en français
console.log('Démarrage du jeu avec le niveau:', niveau);
console.error('Erreur lors du chargement des scores:', erreur);

// ❌ MAUVAIS - Messages en anglais
console.log('Starting game with level:', level);
console.error('Error loading scores:', error);

// ⚠️ À RETIRER avant commit
console.log('DEBUG: valeur =', valeur); // OK en développement, à enlever
```

---

## HTML

### Commentaires

**Règle :** Commentaires en français pour sections importantes.

```html
<!-- ✅ BON - Commentaires en français -->
<!-- Section de sélection de difficulté -->
<div id="difficulty-selection">
  <!-- Boutons de niveau -->
  <button onclick="demarrerJeu('facile')">🌟 Apprenti</button>
</div>

<!-- Zone de jeu principale -->
<div id="game-area" style="display: none;">
  <!-- Question actuelle -->
  <h2 id="question">5 × 7 = ?</h2>
</div>

<!-- ❌ MAUVAIS - Commentaires en anglais -->
<!-- Difficulty selection section -->
<div id="difficulty-selection"></div>
```

### Attributs et IDs

**Règle :** IDs et classes en anglais (convention web), mais cohérents.

```html
<!-- ✅ BON - IDs en anglais (convention), texte en français -->
<input
  type="text"
  id="player-name"
  placeholder="Entre ton nom"
  aria-label="Nom du joueur"
/>

<button id="start-btn">Démarrer</button>
<div class="results-container">
  <p>Résultats</p>
</div>

<!-- Note : On garde les IDs/classes en anglais car c'est la convention web,
     mais tout le texte visible et les aria-label sont en français -->
```

### Attributs ARIA

**Règle :** Labels ARIA toujours en français.

```html
<!-- ✅ BON - ARIA en français -->
<input
  type="number"
  id="answer-input"
  aria-label="Votre réponse"
  aria-required="true"
  placeholder="?"
/>

<button id="submit-btn" aria-label="Valider la réponse">
  🪄 Lancer le sort !
</button>

<!-- ❌ MAUVAIS - ARIA en anglais -->
<input aria-label="Your answer" />
```

---

## CSS

### Commentaires

**Règle :** Commentaires de sections en français.

```css
/* ✅ BON - Commentaires en français */

/* === Styles globaux === */
:root {
  --couleur-principale: #6b4a8d;
  --couleur-accent: #9b59b6;
}

/* === Boutons === */
.submit-btn {
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  border: none;
  padding: 15px 30px;
}

/* Effet au survol */
.submit-btn:hover {
  transform: scale(1.05);
}

/* === Responsive === */
@media (max-width: 768px) {
  /* Passer en colonne unique sur mobile */
  .highscore-grid {
    grid-template-columns: 1fr;
  }
}

/* ❌ MAUVAIS - Commentaires en anglais */
/* === Global styles === */
/* === Buttons === */
```

### Noms de classes

**Règle :** Classes en anglais (convention BEM), mais cohérentes.

```css
/* ✅ BON - Convention BEM en anglais */
.game-area {
}
.game-area__question {
}
.game-area__timer {
}

.button {
}
.button--primary {
}
.button--disabled {
}

.highscore-list {
}
.highscore-list__item {
}
.highscore-list__item--gold {
}

/* Note : On suit la convention BEM en anglais car c'est le standard,
   mais les commentaires restent en français */
```

---

## Exemples Complets

### Exemple 1 : Fonction de jeu complète

```javascript
/**
 * Génère une nouvelle question de multiplication selon le niveau
 *
 * Pour le niveau facile, utilise les tables de 1 à 5.
 * Pour le niveau moyen, utilise les tables de 1 à 10.
 * Pour le niveau difficile, utilise les tables de 1 à 12.
 *
 * @param {string} niveau - Niveau de difficulté ('facile', 'moyen', 'difficile')
 * @returns {Object} Question avec {num1, num2, reponse, texte}
 *
 * @example
 * genererQuestionMultiplication('facile')
 * // { num1: 3, num2: 4, reponse: 12, texte: "3 × 4 = ?" }
 */
function genererQuestionMultiplication(niveau) {
  // Déterminer la plage de nombres selon le niveau
  let plageMax;
  switch (niveau) {
    case 'facile':
      plageMax = 5;
      break;
    case 'moyen':
      plageMax = 10;
      break;
    case 'difficile':
      plageMax = 12;
      break;
    default:
      plageMax = 10;
  }

  // Générer deux nombres aléatoires dans la plage
  const num1 = Math.floor(Math.random() * plageMax) + 1;
  const num2 = Math.floor(Math.random() * plageMax) + 1;

  // Calculer la réponse correcte
  const reponse = num1 * num2;

  // Construire le texte de la question
  const texte = `${num1} × ${num2} = ?`;

  return { num1, num2, reponse, texte };
}

/**
 * Vérifie la réponse de l'utilisateur et met à jour le score
 *
 * Compare la réponse saisie avec la réponse correcte.
 * Affiche un feedback visuel (vert pour correct, rouge pour incorrect).
 * Met à jour le score si la réponse est correcte.
 *
 * @param {number} reponseUtilisateur - Réponse saisie par l'utilisateur
 * @param {number} reponseCorrecte - Réponse attendue
 * @returns {boolean} true si la réponse est correcte, false sinon
 */
function verifierReponse(reponseUtilisateur, reponseCorrecte) {
  const estCorrect = parseInt(reponseUtilisateur) === reponseCorrecte;

  if (estCorrect) {
    // Feedback positif
    afficherMessage('✅ Bravo ! Bonne réponse !', 'vert');
    incrementerScore();
  } else {
    // Feedback négatif avec la bonne réponse
    afficherMessage(
      `❌ Incorrect. La réponse était ${reponseCorrecte}`,
      'rouge'
    );
  }

  // Enregistrer la réponse dans l'historique
  historiqueReponses.push({
    question: questionActuelle.texte,
    reponseUtilisateur,
    reponseCorrecte,
    estCorrect
  });

  return estCorrect;
}
```

### Exemple 2 : HTML avec commentaires

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Mad Mathematics - Table de Multiplication</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
    <!-- En-tête de la page -->
    <header>
      <h1>🧙‍♂️ Mad Mathematics - Multiplications Magiques ✨</h1>
    </header>

    <!-- Écran de sélection de difficulté -->
    <div id="difficulty-selection">
      <h2>Choisis ton niveau de magie</h2>

      <!-- Saisie du nom du joueur -->
      <div class="player-input">
        <input
          type="text"
          id="player-name"
          placeholder="Entre ton nom de sorcier"
          aria-label="Nom du joueur"
          maxlength="50"
        />
      </div>

      <!-- Boutons de sélection de niveau -->
      <div class="difficulty-buttons">
        <button onclick="demarrerJeu('facile')" class="btn-difficulty">
          ⭐ Apprenti Sorcier
        </button>
        <button onclick="demarrerJeu('moyen')" class="btn-difficulty">
          ⭐⭐ Sorcier Confirmé
        </button>
        <button onclick="demarrerJeu('difficile')" class="btn-difficulty">
          ⭐⭐⭐ Archimage
        </button>
      </div>
    </div>

    <!-- Zone de jeu (cachée au départ) -->
    <div id="game-area" style="display: none;">
      <!-- Timer et progression -->
      <div class="game-header">
        <div class="timer">⏱️ Temps : <span id="timer">60</span>s</div>
        <div class="progress">
          Question <span id="current-q">1</span> / <span id="total-q">15</span>
        </div>
      </div>

      <!-- Question actuelle -->
      <div class="question-container">
        <h2 id="question">5 × 7 = ?</h2>
      </div>

      <!-- Saisie de réponse -->
      <div class="answer-container">
        <input
          type="number"
          id="answer-input"
          placeholder="?"
          aria-label="Votre réponse"
          aria-required="true"
        />
        <button id="submit-btn" onclick="verifierReponse()">
          🪄 Lancer le sort !
        </button>
      </div>

      <!-- Zone de feedback -->
      <div id="feedback" class="feedback"></div>
    </div>

    <!-- Écran de résultats (caché au départ) -->
    <div id="results" style="display: none;">
      <h2>🎉 Résultats</h2>

      <!-- Score final -->
      <div class="final-score">
        <p>Score : <span id="final-score">0</span> / 15</p>
        <p>Temps : <span id="final-time">0s</span></p>
      </div>

      <!-- Classement -->
      <div class="highscores">
        <h3>🏆 Meilleurs Scores</h3>
        <ul id="highscore-list"></ul>
      </div>

      <!-- Bouton rejouer -->
      <button onclick="reinitialiserJeu()">🔄 Rejouer</button>
    </div>

    <script src="shared.js"></script>
    <script>
      // Variables globales du jeu
      let niveauActuel = '';
      let questionActuelle = null;
      let scoreJoueur = 0;
      let tempsRestant = 60;
      let intervalTimer = null;

      // ... reste du code JavaScript
    </script>
  </body>
</html>
```

---

## Checklist avant Commit

Avant de commiter votre code, vérifiez :

### Code

- [ ] **Tous les noms de variables** sont en français et descriptifs
- [ ] **Tous les noms de fonctions** utilisent des verbes français
- [ ] **Tous les commentaires inline** sont en français
- [ ] **Toutes les JSDoc** sont complètes et en français
- [ ] **Tous les messages console** sont en français
- [ ] **Pas de `console.log` de debug** oublié (sauf `console.error`)
- [ ] **Pas de `var`** - seulement `const` et `let`
- [ ] **Points-virgules** présents partout
- [ ] **Guillemets simples** pour les strings (sauf templates)
- [ ] **Indentation à 2 espaces** cohérente

### HTML

- [ ] **Commentaires** en français pour les sections
- [ ] **Attributs ARIA** (`aria-label`, etc.) en français
- [ ] **Textes visibles** en français
- [ ] **`lang="fr"`** sur la balise `<html>`

### CSS

- [ ] **Commentaires de sections** en français
- [ ] **Commentaires explicatifs** en français

### Documentation

- [ ] **README et guides** à jour avec les changements
- [ ] **Exemples de code** dans la doc utilisent les conventions françaises
- [ ] **Messages de commit** en français (voir [COMMIT_GUIDELINES.md](./COMMIT_GUIDELINES.md))

---

## 🚫 Anti-Patterns

### ❌ Mélange de langues

```javascript
// ❌ MAUVAIS - Mélange français/anglais
function calculerScore() {
  const totalQuestions = 15; // OK
  const correctAnswers = 12; // ❌ Anglais
  const pourcentage = (correctAnswers / totalQuestions) * 100;
  console.log('Score calculated:', pourcentage); // ❌ Anglais
  return pourcentage;
}

// ✅ BON - Tout en français
function calculerScore() {
  const totalQuestions = 15;
  const reponsesCorrectes = 12;
  const pourcentage = (reponsesCorrectes / totalQuestions) * 100;
  console.log('Score calculé:', pourcentage);
  return pourcentage;
}
```

### ❌ Commentaires inutiles

```javascript
// ❌ MAUVAIS - Commentaire redondant
// Incrémenter i
i++;

// Obtenir la valeur
const valeur = input.value;

// ✅ BON - Pas de commentaire inutile, code clair
i++;
const valeur = input.value;
```

### ❌ JSDoc incomplète

```javascript
// ❌ MAUVAIS - JSDoc incomplète
/**
 * Formate le temps
 */
function formaterTemps(secondes) {
  // ...
}

// ✅ BON - JSDoc complète
/**
 * Formate un nombre de secondes en chaîne lisible "Xm Ys" ou "Xs"
 *
 * @param {number} secondes - Nombre de secondes à formater
 * @returns {string} Temps formaté
 *
 * @example
 * formaterTemps(65)  // "1m 5s"
 */
function formaterTemps(secondes) {
  // ...
}
```

---

## 🎓 Ressources

### Documentation officielle

- [MDN en français](https://developer.mozilla.org/fr/) - Référence JavaScript/HTML/CSS
- [JavaScript.info en français](https://fr.javascript.info/) - Guide JavaScript moderne
- [Alsacréations](https://www.alsacreations.com/) - Tutoriels et articles en français

### Outils

- **ESLint** - Configuré dans le projet pour vérifier le style
- **Prettier** - Formatage automatique du code
- **Vitest** - Tests unitaires (voir [TESTING_GUIDELINES.md](./TESTING_GUIDELINES.md))

### Autres guides du projet

- [COMMIT_GUIDELINES.md](./COMMIT_GUIDELINES.md) - Commits conventionnels en français
- [TESTING_GUIDELINES.md](./TESTING_GUIDELINES.md) - Tests unitaires
- [DOCUMENTATION_GUIDELINES.md](./DOCUMENTATION_GUIDELINES.md) - Gestion de la documentation

---

## 📞 Questions ?

En cas de doute sur le style ou les conventions :

1. **Consultez ce guide** en premier
2. **Regardez le code existant** dans `shared.js` pour des exemples
3. **Demandez** lors d'une code review si incertain

**Principe de cohérence :** Si plusieurs façons sont possibles, choisissez celle qui est la plus cohérente avec le code existant.

---

**Dernière révision :** Création du guide de style avec obligation du français pour tout le projet
