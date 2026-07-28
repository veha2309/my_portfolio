import { lazy, Suspense, useEffect, useState } from 'react';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Resume from './pages/Resume';
import HUD from './components/HUD';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import SmoothScroll from './components/SmoothScroll';
import { SceneProvider } from './store/useSceneStore';
const BackgroundCanvas = lazy(() => import('./components/webgl/BackgroundCanvas'));

function AppContent() {
  const [booting, setBooting] = useState(true);
  useEffect(() => {
    const blockContextMenu = (event: MouseEvent) => { if ((event.target as HTMLElement).closest('button,a,input,textarea,select')) return; event.preventDefault(); };
    document.addEventListener('contextmenu', blockContextMenu);
    return () => document.removeEventListener('contextmenu', blockContextMenu);
  }, []);
  return <SmoothScroll><div className="site-shell">
    <Preloader onComplete={() => setBooting(false)} />
    <Suspense fallback={<div className="field-canvas" />}><BackgroundCanvas /></Suspense>
    <HUD /><Navbar /><Cursor />
    <main aria-hidden={booting}><section id="home"><Home /></section><section id="projects"><Projects /></section><section id="resume"><Resume /></section><Footer /></main>
  </div></SmoothScroll>;
}
export default function App() { return <SceneProvider><AppContent /></SceneProvider>; }
