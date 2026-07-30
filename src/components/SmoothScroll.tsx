import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollProps {
  children: React.ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Disable smooth scroll on mobile for native feel
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const nativeNavigate = (event: Event) => {
      const { target } = (event as CustomEvent<{ target: HTMLElement | number }>).detail;
      if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'auto' });
      else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (isMobile) {
      window.addEventListener('portfolio:navigate', nativeNavigate);
      return () => window.removeEventListener('portfolio:navigate', nativeNavigate);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      prevent: (node: Element) => Boolean(node.closest('.project-focus__scroll,.game-mode,.game-stage')),
    });

    const navigate = (event: Event) => {
      const { target, immediate } = (event as CustomEvent<{ target: HTMLElement | number; immediate?: boolean }>).detail;
      lenis.scrollTo(target, { duration: immediate ? 0 : 1.15, force: true });
    };
    const lock = (event: Event) => {
      const { locked } = (event as CustomEvent<{ locked: boolean }>).detail;
      if (locked) lenis.stop(); else lenis.start();
    };
    window.addEventListener('portfolio:navigate', navigate);
    window.addEventListener('portfolio:scroll-lock', lock);

    lenis.on('scroll', ScrollTrigger.update);

    // Synchronize Lenis with GSAP's internal ticker
    const raf = (time: number) => {
      if (!document.hidden) lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      gsap.ticker.remove(raf);
      window.removeEventListener('portfolio:navigate', navigate);
      window.removeEventListener('portfolio:scroll-lock', lock);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
