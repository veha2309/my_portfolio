import { useEffect, useState } from 'react';

/**
 * Tracks the user's `prefers-reduced-motion` OS/browser setting live,
 * so heavy scroll-linked / parallax / continuously-looping animations
 * (3D scene motion, custom cursor easing, ambient scanlines, etc.) can
 * be scaled back or disabled for users who've asked for reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

/**
 * Tracks whether the primary input device supports fine, hover-capable
 * pointing (i.e. a mouse/trackpad, not a touchscreen). Used to decide
 * whether it's appropriate to hide the native cursor in favor of the
 * custom HUD cursor.
 */
export function useHasFinePointer(): boolean {
  const [hasFinePointer, setHasFinePointer] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return true;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(hover: hover) and (pointer: fine)');
    const handler = (e: MediaQueryListEvent) => setHasFinePointer(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return hasFinePointer;
}
