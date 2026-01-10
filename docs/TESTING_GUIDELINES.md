# Testing Guidelines - Mad Mathematics

**Dernière mise à jour:** 10 janvier 2026  
**Scope:** Tests React avec Vitest + React Testing Library  
**Framework:** Vitest + React Testing Library + Playwright  
**Coverage cible:** 90%+

---

## 🎯 Philosophie de Test

Ce projet suit une approche **TDD (Test-Driven Development)** :

1. ✍️ **Écrire le test** qui échoue (Red)
2. ✅ **Écrire le code minimal** pour passer le test (Green)
3. ♻️ **Refactoriser** en gardant les tests verts (Refactor)

**Principe clé:** Les tests sont la **documentation vivante** du code. Un test React doit tester le **comportement utilisateur**, pas l'implémentation.

### Testing Library Guiding Principles

> "The more your tests resemble the way your software is used, the more confidence they can give you."

- ✅ **Test from user perspective** - Query par rôle ARIA, label, text
- ✅ **Avoid implementation details** - Ne pas tester state interne
- ✅ **Accessibility-first queries** - Utiliser getByRole, getByLabelText
- ❌ **Avoid test IDs** - Seulement en dernier recours

---

## 🛠️ Stack Technique

### Dépendances de Test

```json
{
  "devDependencies": {
    "vitest": "^4.0.16",
    "@vitest/ui": "^4.0.16",
    "@vitest/coverage-v8": "^4.0.16",
    "@testing-library/react": "^16.3.1",
    "@testing-library/user-event": "^14.6.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@playwright/test": "^1.57.0",
    "jsdom": "^27.4.0"
  }
}
```

### Configuration (`vitest.config.ts`)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/**/*.test.{ts,tsx}'],
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
});
```

### Setup global (`tests/setup.ts`)

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

---

## 📁 Structure des Fichiers

### Organisation Co-located

```
mad-mathematics-react/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   └── Card.tsx
│   │   └── game/
│   │       ├── GameArea.tsx
│   │       └── Timer.tsx
│   ├── hooks/
│   │   ├── useGameLogic.ts
│   │   └── useGameTimer.ts
│   └── utils/
│       ├── formatTime.ts
│       └── validation.ts
├── tests/
│   ├── setup.ts
│   ├── components/
│   │   ├── Button.test.tsx
│   │   ├── Timer.test.tsx
│   │   └── HighscoreTable.test.tsx
│   ├── hooks/
│   │   ├── useGameLogic.test.ts
│   │   └── useGameTimer.test.ts
│   └── utils/
│       ├── formatTime.test.ts
│       └── validation.test.ts
└── e2e/
    ├── multiplication.spec.ts
    └── addition.spec.ts
```

### Naming Convention

- **Component tests:** `ComponentName.test.tsx`
- **Hook tests:** `useHookName.test.ts`
- **Utility tests:** `functionName.test.ts`
- **E2E tests:** `feature.spec.ts`

---

## ✍️ Style de Tests

### Pattern de base (Component)

```typescript
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/common/Button';

describe('Button', () => {
  test('renders children correctly', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    await user.click(screen.getByRole('button', { name: /click me/i }));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  describe('variants', () => {
    test('applies primary styles', () => {
      render(<Button variant="primary">Primary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('from-yellow-400');
    });

    test('applies secondary styles', () => {
      render(<Button variant="secondary">Secondary</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('from-purple-600');
    });
  });
});
```

### Pattern de base (Hook)

```typescript
import { describe, test, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGameTimer } from '@/hooks/useGameTimer';

describe('useGameTimer', () => {
  test('initializes with correct time', () => {
    const { result } = renderHook(() => 
      useGameTimer({ initialTime: 60 })
    );
    
    expect(result.current.timeLeft).toBe(60);
    expect(result.current.isRunning).toBe(false);
  });

  test('starts timer correctly', () => {
    const { result } = renderHook(() => 
      useGameTimer({ initialTime: 60 })
    );
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.isRunning).toBe(true);
  });

  test('calls onTimeout when time reaches 0', async () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => 
      useGameTimer({ initialTime: 1, onTimeout })
    );
    
    act(() => {
      result.current.start();
    });
    
    await vi.waitFor(() => {
      expect(onTimeout).toHaveBeenCalled();
    });
  });
});
```

### Pattern de base (Utility)

```typescript
import { describe, test, expect } from 'vitest';
import { formatTime } from '@/utils/formatTime';

describe('formatTime', () => {
  test('formats seconds under 60', () => {
    expect(formatTime(30)).toBe('30s');
    expect(formatTime(59)).toBe('59s');
  });

  test('formats minutes and seconds', () => {
    expect(formatTime(60)).toBe('1m 0s');
    expect(formatTime(65)).toBe('1m 5s');
    expect(formatTime(125)).toBe('2m 5s');
  });

  describe('edge cases', () => {
    test('handles zero', () => {
      expect(formatTime(0)).toBe('0s');
    });

    test('handles negative values', () => {
      expect(formatTime(-10)).toBe('0s');
    });
  });
});
```

---

## 🧪 Patterns de Test React

### 1. Test de Composant avec Props

```typescript
describe('Card', () => {
  test('renders title and content', () => {
    render(
      <Card title="Test Title">
        <p>Test Content</p>
      </Card>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<Card className="custom-class">Content</Card>);
    
    const card = screen.getByText('Content').closest('div');
    expect(card).toHaveClass('custom-class');
  });
});
```

### 2. Test avec User Events

```typescript
describe('DifficultySelector', () => {
  test('calls onSelect when difficulty is chosen', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    
    render(<DifficultySelector onSelect={onSelect} />);
    
    await user.click(
      screen.getByRole('button', { name: /apprenti/i })
    );
    
    expect(onSelect).toHaveBeenCalledWith({
      key: 'apprenti',
      label: 'Apprenti ⭐',
      // ... autres props
    });
  });
});
```

### 3. Test avec Formulaires

```typescript
describe('PlayerNameInput', () => {
  test('updates value on user input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    
    render(<PlayerNameInput value="" onChange={onChange} />);
    
    const input = screen.getByRole('textbox', { name: /nom/i });
    await user.type(input, 'Mathéo');
    
    expect(onChange).toHaveBeenLastCalledWith('Mathéo');
  });

  test('shows error for invalid input', async () => {
    const user = userEvent.setup();
    
    render(<PlayerNameInput value="" onChange={vi.fn()} />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'AB'); // Trop court
    await user.tab(); // Trigger blur
    
    expect(screen.getByText(/au moins 3 caractères/i)).toBeInTheDocument();
  });
});
```

### 4. Test avec Zustand Store

```typescript
import { renderHook, act } from '@testing-library/react';
import { useGameStore } from '@/store';

describe('gameStore', () => {
  test('starts game with player name', () => {
    const { result } = renderHook(() => useGameStore());
    
    act(() => {
      result.current.setPlayerName('Alice');
      result.current.startGame('apprenti');
    });
    
    expect(result.current.gameStatus).toBe('playing');
    expect(result.current.playerName).toBe('Alice');
  });

  test('saves highscore correctly', () => {
    const { result } = renderHook(() => useGameStore());
    
    act(() => {
      result.current.setPlayerName('Alice');
      result.current.saveHighscore('apprenti', 15, 45);
    });
    
    const highscores = result.current.highscores['apprenti'];
    expect(highscores).toHaveLength(1);
    expect(highscores[0]).toMatchObject({
      name: 'Alice',
      score: 15,
      time: 45,
    });
  });
});
```

### 5. Test avec React Router

```typescript
import { BrowserRouter } from 'react-router-dom';

describe('HomePage', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('navigates to multiplication page', async () => {
    const user = userEvent.setup();
    renderWithRouter(<HomePage />);
    
    await user.click(
      screen.getByRole('link', { name: /multiplication/i })
    );
    
    expect(window.location.pathname).toBe('/multiplication');
  });
});
```

### 6. Test avec LocalStorage Mock

```typescript
describe('HighscoreTable', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('loads highscores from localStorage', () => {
    const mockScores = [
      { name: 'Alice', score: 15, time: 45, date: '2026-01-01' },
    ];
    localStorage.setItem('highscores_apprenti', JSON.stringify(mockScores));
    
    render(<HighscoreTable level="apprenti" />);
    
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('15/15')).toBeInTheDocument();
  });

  test('renders empty state when no scores', () => {
    render(<HighscoreTable level="apprenti" />);
    
    expect(screen.getAllByText(/aucun score/i)).toHaveLength(5);
  });
});
```

---

## 🎭 Testing Library Queries

### Ordre de Priorité (TOUJOURS SUIVRE)

1. **getByRole** - Accessibilité first
2. **getByLabelText** - Formulaires
3. **getByPlaceholderText** - Inputs
4. **getByText** - Contenu visible
5. **getByDisplayValue** - Valeurs de formulaires
6. **getByAltText** - Images
7. **getByTitle** - Titre SVG/elements
8. **getByTestId** - Dernier recours (éviter)

### Exemples de Queries

```typescript
// ✅ BON: getByRole
const button = screen.getByRole('button', { name: /commencer/i });
const input = screen.getByRole('textbox', { name: /nom du joueur/i });
const heading = screen.getByRole('heading', { level: 1 });

// ✅ BON: getByLabelText
const nameInput = screen.getByLabelText(/nom/i);

// ✅ BON: getByText
const errorMessage = screen.getByText(/erreur/i);

// ❌ MAUVAIS: getByTestId
const button = screen.getByTestId('submit-button'); // Éviter !
```

### Assertions Communes

```typescript
// Présence dans le DOM
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibilité
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Contenu
expect(element).toHaveTextContent('Hello');
expect(element).toHaveAttribute('aria-label', 'Close');

// Classes CSS (Tailwind)
expect(element).toHaveClass('bg-yellow-400');

// Formulaires
expect(input).toHaveValue('Alice');
expect(input).toBeDisabled();
expect(checkbox).toBeChecked();
```

---

## 🚀 Commandes

### package.json scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "e2e": "playwright test",
    "e2e:ui": "playwright test --ui"
  }
}
```

### Utilisation

```bash
# Mode watch (développement)
yarn test

# Interface graphique
yarn test:ui

# Run une fois (CI)
yarn test:run

# Avec coverage
yarn test:coverage

# E2E tests
yarn e2e
yarn e2e:ui
```

---

## 📊 Coverage Reports

### Seuils critiques

| Métrique   | Minimum | Objectif |
| ---------- | ------- | -------- |
| Statements | 90%     | 95%+     |
| Branches   | 90%     | 95%+     |
| Functions  | 90%     | 100%     |
| Lines      | 90%     | 95%+     |

**Note:** Les tests **échouent** si coverage < 90% sur n'importe quelle métrique.

---

## 🎓 Best Practices

### 1. Test du Comportement, pas l'Implémentation

```typescript
// ❌ MAUVAIS: Tester l'implémentation
test('increments count state', () => {
  const { result } = renderHook(() => useState(0));
  act(() => result.current[1](1));
  expect(result.current[0]).toBe(1);
});

// ✅ BON: Tester le comportement utilisateur
test('increments counter when button clicked', async () => {
  const user = userEvent.setup();
  render(<Counter />);
  
  await user.click(screen.getByRole('button', { name: /increment/i }));
  
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### 2. Arrange-Act-Assert (AAA)

```typescript
test('saves highscore correctly', async () => {
  // ARRANGE - Préparer les données
  const user = userEvent.setup();
  render(<GameResults score={15} time={45} level="apprenti" />);
  
  // ACT - Exécuter l'action
  await user.click(screen.getByRole('button', { name: /sauvegarder/i }));
  
  // ASSERT - Vérifier le résultat
  expect(screen.getByText(/score enregistré/i)).toBeInTheDocument();
});
```

### 3. Utiliser userEvent au lieu de fireEvent

```typescript
// ❌ MAUVAIS: fireEvent (bas niveau)
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'test' } });

// ✅ BON: userEvent (simule vraiment l'utilisateur)
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'test');
```

### 4. Tests Accessibles = App Accessible

```typescript
// ✅ BON: Force l'accessibilité
test('button is accessible', () => {
  render(<Button>Click me</Button>);
  
  // Si getByRole échoue, le bouton n'est pas accessible !
  const button = screen.getByRole('button', { name: /click me/i });
  expect(button).toBeInTheDocument();
});

// ❌ MAUVAIS: Ignore l'accessibilité
test('button exists', () => {
  render(<button>Click me</button>);
  expect(screen.getByTestId('my-button')).toBeInTheDocument();
});
```

### 5. Tests Isolés et Indépendants

```typescript
// ✅ BON: Reset avant chaque test
describe('GameStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('test 1', () => { /* ... */ });
  test('test 2', () => { /* ... */ }); // Indépendant de test 1
});

// ❌ MAUVAIS: Tests dépendants
test('saves score', () => {
  saveHighscore('Alice', 15, 45, 'apprenti');
});
test('loads score', () => {
  // Dépend du test précédent !
  const scores = loadHighscores('apprenti');
  expect(scores[0].name).toBe('Alice');
});
```

---

## 🐛 Debugging Tests

### Debug avec screen.debug()

```typescript
test('debugging example', () => {
  render(<MyComponent />);
  
  // Afficher le DOM complet
  screen.debug();
  
  // Afficher un élément spécifique
  screen.debug(screen.getByRole('button'));
});
```

### Debug avec Vitest UI

```bash
yarn test:ui
```

Interface graphique interactive pour:
- Voir l'arbre de tests
- Filtrer par fichier/describe/test
- Voir les assertions en détail
- Rejouer des tests spécifiques

---

## 📚 Ressources

### Documentation officielle

- [Vitest](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [user-event](https://testing-library.com/docs/user-event/intro)
- [Playwright](https://playwright.dev/)

### Articles recommandés

- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) - Kent C. Dodds
- [Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)
- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html)

---

## ✅ Checklist avant commit

- [ ] Tous les tests passent (`yarn test:run`)
- [ ] Coverage >= 90% sur toutes les métriques
- [ ] Pas de `test.only` ou `test.skip` committé
- [ ] Pas de `console.log` de debug
- [ ] Queries accessibles (getByRole > getByTestId)
- [ ] userEvent utilisé au lieu de fireEvent
- [ ] Tests indépendants (beforeEach cleanup)
- [ ] AAA pattern respecté

---

**Dernière révision:** Migration vers React + TypeScript + Tailwind CSS (10 janvier 2026)
