/**
 * App - Mad Mathematics
 * Main application component with routing and lazy loading
 */

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy-loaded game pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const MultiplicationPage = lazy(() => import('./pages/MultiplicationPage'));
const AdditionPage = lazy(() => import('./pages/AdditionPage'));
const SoustractionPage = lazy(() => import('./pages/SoustractionPage'));
const DivisionPage = lazy(() => import('./pages/DivisionPage'));

/**
 * Loading fallback component
 */
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-purple-200 text-lg">Chargement en cours...</p>
      </div>
    </div>
  );
}

/**
 * Main App component with React Router and lazy loading
 */
function App() {
  // Only use basename in production (GitHub Pages deployment)
  const basename = import.meta.env.PROD ? '/mad-mathematics' : '/';
  
  return (
    <BrowserRouter basename={basename}>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/multiplication" element={<MultiplicationPage />} />
          <Route path="/addition" element={<AdditionPage />} />
          <Route path="/soustraction" element={<SoustractionPage />} />
          <Route path="/division" element={<DivisionPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
