---
name: Bug responsive
about: Problème d'affichage sur basses résolutions
title: "🐛 Fix responsive layout on low resolution screens"
labels: bug, ui/ux, responsive
---

## 🐛 Description du problème

L'affichage du jeu n'est pas optimal sur les écrans de basse résolution (mobile, petits écrans). Des éléments UI sont coupés ou mal positionnés.

## 📱 Environnement

- **Taille d'écran affectée:** Basses résolutions / mobile
- **Pages concernées:** Au moins `table-de-multiplication.html`
- **Navigateur:** Tous

## 📸 Capture d'écran

Voir screenshot fourni montrant :
- La barre de progression verte (timer) qui déborde
- Le layout qui ne s'adapte pas correctement en largeur réduite
- Éléments UI potentiellement coupés ou mal alignés

## 🎯 Comportement attendu

- L'interface doit s'adapter gracieusement aux petites résolutions
- Tous les éléments doivent rester visibles et utilisables
- La barre de progression doit rester dans les limites du conteneur
- Les boutons et zones de saisie doivent être accessibles

## 🔧 Solutions potentielles

1. **Revoir les media queries** dans `style.css`
   - Vérifier le breakpoint `@media (max-width: 768px)`
   - Ajouter des breakpoints supplémentaires si nécessaire (480px, 360px)

2. **Ajuster les largeurs fixes**
   - Remplacer `width` fixes par `max-width` avec `width: 100%`
   - Utiliser `padding` responsive (%, vw au lieu de px fixes)

3. **Tester la barre de progression**
   - Vérifier le conteneur de la progress bar
   - S'assurer que `overflow: hidden` est appliqué si nécessaire

4. **Zone de jeu**
   - Vérifier `.game-area` et `.question-box`
   - Ajuster font-size pour petits écrans
   - Réduire padding/margin sur mobile

## ✅ Définition de "Done"

- [ ] Layout correct sur écrans 360px de large (petits mobiles)
- [ ] Layout correct sur écrans 480px de large (mobiles standards)
- [ ] Layout correct sur écrans 768px de large (tablettes portrait)
- [ ] Barre de progression reste dans son conteneur
- [ ] Tous les boutons sont cliquables sans zoom
- [ ] Input de réponse visible et utilisable
- [ ] Texte lisible sans défilement horizontal
- [ ] Testé sur Chrome/Firefox/Safari mobile

## 📋 Fichiers à modifier

- `style.css` - Media queries et responsive styles
- Potentiellement `table-de-multiplication.html` - Structure si nécessaire
- Autres pages de jeu si le problème est généralisé

## 🔗 Ressources

- [MDN - Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [CSS Tricks - Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)
