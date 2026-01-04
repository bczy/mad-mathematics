/**
 * HomePage - Mad Mathematics
 * Landing page with links to all game modes
 */

import { Link } from 'react-router-dom';
import { Card } from '../components';

const GAME_MODES = [
  {
    path: '/multiplication',
    name: 'Table de Multiplication',
    emoji: '✖️',
    description: 'Maîtrise tes tables de multiplication !',
    color: 'from-amber-500 to-yellow-600',
  },
  {
    path: '/addition',
    name: 'Table des Additions',
    emoji: '➕',
    description: 'Deviens un as de l\'addition !',
    color: 'from-green-500 to-emerald-600',
  },
  {
    path: '/soustraction',
    name: 'Table des Soustractions',
    emoji: '➖',
    description: 'Les soustractions n\'auront plus de secret !',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    path: '/division',
    name: 'Table des Divisions',
    emoji: '➗',
    description: 'Conquiers les divisions !',
    color: 'from-purple-500 to-fuchsia-600',
  },
];

/**
 * Home page component with game mode selection
 */
export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-400 mb-2">
            🧙‍♂️ Mad Mathematics 🧙‍♂️
          </h1>
          <p className="text-purple-200 text-lg">
            Choisis ton aventure mathématique !
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {GAME_MODES.map((mode) => (
            <Link
              key={mode.path}
              to={mode.path}
              className="group block"
            >
              <div
                className={`
                  p-4 rounded-xl bg-gradient-to-br ${mode.color}
                  transform transition-all duration-200
                  hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20
                  group-focus:ring-2 group-focus:ring-amber-400
                `}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{mode.emoji}</span>
                  <h2 className="text-xl font-bold text-white">
                    {mode.name}
                  </h2>
                </div>
                <p className="text-white/80 text-sm">
                  {mode.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center text-purple-300/60 text-sm">
          <p>✨ Entraîne-toi, améliore ton score et deviens le meilleur ! ✨</p>
        </div>
      </Card>
    </div>
  );
}

export default HomePage;
