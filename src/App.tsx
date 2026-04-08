import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import Scene from './components/3d/Scene';
import HUD from './components/HUD';
import Cursor from './components/Cursor';
import ContextMenu from './components/ContextMenu';

import { useState, useLayoutEffect } from 'react';

export default function App() {
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
      {/* Custom HUD Context Menu */}
      <ContextMenu />
      
      {/* Custom HUD Cursor */}
      <Cursor />
      {/* 3D Background Layer - base level */}
      <Scene isLightMode={isLightMode} />
      
      {/* Tactical HUD Overlay - interactive level */}
      <HUD isLightMode={isLightMode} toggleTheme={toggleTheme} />

      <Navbar isLightMode={isLightMode} toggleTheme={toggleTheme} />

      {/* Standard Scrollable Content Layer - top level */}
      <main className="relative z-10 max-w-6xl mx-auto px-4">
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
