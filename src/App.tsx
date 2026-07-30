import { lazy, Suspense, useEffect, useRef, useState } from 'react';
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
import GameModeLauncher from './game-mode/GameModeLauncher';
const BackgroundCanvas = lazy(() => import('./components/webgl/BackgroundCanvas'));
const GameModeRoot = lazy(() => import('./game-mode/GameModeRoot'));

function AppContent() {
  const [booting, setBooting] = useState(true);
  const [gameMode, setGameMode] = useState(() => new URLSearchParams(window.location.search).get('mode') === 'game');
  const [modeTransition, setModeTransition] = useState<'entering' | 'exiting' | null>(null);
  const gameScroll = useRef(0);
  useEffect(() => {
    const blockContextMenu = (event: MouseEvent) => { if ((event.target as HTMLElement).closest('button,a,input,textarea,select')) return; event.preventDefault(); };
    document.addEventListener('contextmenu', blockContextMenu);
    return () => document.removeEventListener('contextmenu', blockContextMenu);
  }, []);
  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lite = matchMedia('(pointer: coarse)').matches || navigator.hardwareConcurrency <= 4 || (memory !== undefined && memory <= 4);
    document.documentElement.classList.toggle('performance-lite', lite);
    return () => document.documentElement.classList.remove('performance-lite');
  }, []);
  useEffect(() => {
    const onPopState = () => setGameMode(new URLSearchParams(window.location.search).get('mode') === 'game');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  useEffect(() => {
    if (!gameMode) return;
    gameScroll.current = window.scrollY;
    document.documentElement.classList.add('game-mode-active');
    window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: { locked: true } }));
    return () => {
      document.documentElement.classList.remove('game-mode-active');
      window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: { locked: false } }));
      window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { target: gameScroll.current, immediate: true } }));
    };
  }, [gameMode]);
  useEffect(() => {
    if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    let active: HTMLElement[] = []; let latest: PointerEvent | null = null; let frame = 0;
    const reset = (elements: HTMLElement[]) => elements.forEach((element) => {
      element.style.setProperty('--normal-rx', '0deg'); element.style.setProperty('--normal-ry', '0deg');
      element.style.setProperty('--normal-x', '0px'); element.style.setProperty('--normal-y', '0px');
    });
    const paint = () => {
      frame = 0; if (!latest) return;
      const target = latest.target as HTMLElement;
      const scope = target.closest<HTMLElement>('.hero,.dossier,.contact');
      const next = scope?.classList.contains('dossier')
        ? [target.closest<HTMLElement>('.dossier-row')].filter((item): item is HTMLElement => Boolean(item))
        : scope?.classList.contains('hero')
          ? Array.from(scope.querySelectorAll<HTMLElement>('.hero__statement.normal-tilt,.hero__signal.normal-tilt'))
          : scope?.classList.contains('contact')
            ? Array.from(scope.querySelectorAll<HTMLElement>('.contact__aperture.normal-tilt')) : [];
      if (next.length !== active.length || next.some((element, index) => element !== active[index])) { reset(active); active = next; }
      active.forEach((element, index) => {
        const rect = element.getBoundingClientRect(); const x = (latest!.clientX - rect.left) / rect.width - .5; const y = (latest!.clientY - rect.top) / rect.height - .5;
        const depth = 1 - index * .14;
        element.style.setProperty('--normal-rx', `${-y * 3.5 * depth}deg`); element.style.setProperty('--normal-ry', `${x * 5 * depth}deg`);
        element.style.setProperty('--normal-x', `${x * 10 * depth}px`); element.style.setProperty('--normal-y', `${y * 8 * depth}px`);
      });
    };
    const move = (event: PointerEvent) => { latest = event; if (!frame) frame = requestAnimationFrame(paint); };
    const leave = () => { cancelAnimationFrame(frame); frame = 0; latest = null; reset(active); active = []; };
    document.addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerleave', leave);
    return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); cancelAnimationFrame(frame); reset(active); };
  }, []);
  const enterGameMode = () => {
    if (modeTransition) return;
    const url = new URL(window.location.href); url.searchParams.set('mode', 'game');
    window.history.pushState({ mode: 'game' }, '', `${url.pathname}${url.search}${url.hash}`);
    setModeTransition('entering');
    window.setTimeout(() => setGameMode(true), 280);
    window.setTimeout(() => setModeTransition(null), 880);
  };
  const exitGameMode = (targetId?: string) => {
    if (modeTransition) return;
    setModeTransition('exiting');
    window.setTimeout(() => {
      const url = new URL(window.location.href); url.searchParams.delete('mode');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      setGameMode(false);
      if (targetId) window.setTimeout(() => { const target = document.getElementById(targetId); if (target) window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { target } })); }, 80);
    }, 280);
    window.setTimeout(() => setModeTransition(null), 880);
  };
  return <SmoothScroll><div className="site-shell">
    <Preloader onComplete={() => setBooting(false)} />
    <Suspense fallback={<div className="field-canvas" />}><BackgroundCanvas /></Suspense>
    <HUD /><Navbar /><Cursor /><GameModeLauncher onEnter={enterGameMode} />
    <main aria-hidden={booting || gameMode}><section id="home"><Home /></section><section id="projects"><Projects /></section><section id="resume"><Resume /></section><Footer /></main>
    {gameMode && <Suspense fallback={<div className="game-mode-loading">INITIALIZING GAME MODE...</div>}><GameModeRoot onExit={exitGameMode}/></Suspense>}
    {modeTransition && <div className={`mode-bridge mode-bridge--${modeTransition}`} aria-hidden="true"><div className="mode-bridge__iris"><i/><i/><i/></div><span>{modeTransition === 'entering' ? 'ENTERING INTERACTIVE SYSTEM' : 'RETURNING TO EDITORIAL MODE'}</span><b>VEDANT / DUAL INTERFACE</b></div>}
  </div></SmoothScroll>;
}
export default function App() { return <SceneProvider><AppContent /></SceneProvider>; }
