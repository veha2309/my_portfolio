import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import HUD from './components/HUD';
import Cursor from './components/Cursor';
import ContextMenu from './components/ContextMenu';
import Preloader from './components/Preloader';

import { useState, useLayoutEffect, lazy, Suspense } from 'react';

// Three.js + @react-three/fiber account for the large majority of bundle
// size (~390KB gzipped). It's purely decorative background chrome, so it's
// split into its own chunk and loaded after the initial paint instead of
// blocking first render / LCP.
const Scene = lazy(() => import('./components/3d/Scene'));

export default function App() {
  const [isBooting, setIsBooting] = useState(true);
  const [isLightMode, setIsLightMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      return saved === 'light';
    }
    return false;
  });

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', isLightMode ? 'light' : 'dark');
    localStorage.setItem('theme-mode', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  const toggleTheme = () => setIsLightMode(!isLightMode);

  return (
    <div className="relative min-h-screen text-celestial-text selection:bg-celestial-primary selection:text-black overflow-x-hidden transition-colors duration-1000">
      {/* Cinematic boot sequence — shown once per session */}
      <Preloader onComplete={() => setIsBooting(false)} />

      {/* Custom HUD Context Menu */}
      <ContextMenu />
      
      {/* Custom HUD Cursor */}
      <Cursor />
      {/* 3D Background Layer - base level */}
      <Suspense fallback={<div className="fixed inset-0 -z-10 bg-[var(--bg)]" />}>
        <Scene isLightMode={isLightMode} />
      </Suspense>
      
      {/* Tactical HUD Overlay - interactive level */}
      <HUD isLightMode={isLightMode} toggleTheme={toggleTheme} />

      <Navbar isLightMode={isLightMode} toggleTheme={toggleTheme} />

      {/* Standard Scrollable Content Layer - top level */}
      <main aria-hidden={isBooting} className="relative z-10 max-w-6xl mx-auto px-4">
        <section id="home">
          <Home />
        </section>
        
        <section id="projects" className="py-48">
          <Projects />
        </section>
        
        <section id="resume" className="py-48">
          <Resume />
        </section>
        
        <Footer />
      </main>
    </div>
  );
}
