import { useEffect, useRef } from 'react';

export default function HUD() {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frame = 0;
    const paint = () => {
      frame = 0;
      const range = document.documentElement.scrollHeight - innerHeight;
      const progress = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
      bar.current?.style.setProperty('transform', `scaleY(${progress})`);
    };
    const update = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update, { passive: true });
    return () => { removeEventListener('scroll', update); removeEventListener('resize', update); cancelAnimationFrame(frame); };
  }, []);
  return <div className="chapter-progress" aria-hidden="true"><span ref={bar} /></div>;
}
