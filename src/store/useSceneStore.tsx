import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export type CanvasScene = 'hero' | 'work-intro' | 'finance' | 'stock' | 'stock-mobile' | 'microplastics' | 'vision' | 'resume' | 'contact';
export type ForegroundMode = 'light-text' | 'dark-text';
export type NavigationMode = 'light' | 'dark' | 'transparent';

type Transition = { from: CanvasScene; to: CanvasScene; direction: 1 | -1; progress: number };
type SceneContextValue = {
  scene: CanvasScene;
  transition: Transition;
  transitionScene: (next: CanvasScene, direction?: 1 | -1) => void;
  foregroundFor: (scene: CanvasScene) => ForegroundMode;
  navigationMode: NavigationMode;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
};
const SceneContext = createContext<SceneContextValue | null>(null);

const foreground: Record<CanvasScene, ForegroundMode> = {
  hero: 'light-text', 'work-intro': 'light-text', finance: 'light-text', stock: 'light-text', 'stock-mobile': 'light-text',
  microplastics: 'dark-text', vision: 'light-text', resume: 'dark-text', contact: 'light-text',
};

export function SceneProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState<CanvasScene>('hero');
  const [transition, setTransition] = useState<Transition>({ from: 'hero', to: 'hero', direction: 1, progress: 1 });
  const pointer = useRef({ x: 0, y: 0 });
  const lock = useRef(false);
  const transitionScene = useCallback((to: CanvasScene, direction: 1 | -1 = 1) => {
    if (to === scene || lock.current) return;
    lock.current = true;
    setTransition({ from: scene, to, direction, progress: 0 });
    const duration = document.documentElement.classList.contains('performance-lite') ? 0 : 1250;
    window.setTimeout(() => { setScene(to); setTransition({ from: to, to, direction, progress: 1 }); lock.current = false; }, duration);
  }, [scene]);
  return <SceneContext.Provider value={{ scene, transition, transitionScene, foregroundFor: (key) => foreground[key], navigationMode: foreground[scene] === 'dark-text' ? 'dark' : 'light', pointer }}>{children}</SceneContext.Provider>;
}
// The provider and its consumer hook intentionally share this context module.
// eslint-disable-next-line react-refresh/only-export-components
export function useSceneStore() { const value = useContext(SceneContext); if (!value) throw new Error('SceneProvider required'); return value; }
