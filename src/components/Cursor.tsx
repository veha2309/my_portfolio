import { useEffect, useRef } from 'react';
import { useHasFinePointer, usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function Cursor() {
  const finePointer = useHasFinePointer();
  const reduced = usePrefersReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!finePointer || reduced) return;
    document.documentElement.classList.add('has-custom-cursor');
    let targetX = innerWidth / 2; let targetY = innerHeight / 2;
    let ringX = targetX; let ringY = targetY; let frame = 0;
    const setHover = (element: Element | null) => {
      const target = element?.closest<HTMLElement>('[data-cursor], a, button');
      const text = target?.dataset.cursor || (target?.tagName === 'A' ? 'OPEN' : target?.tagName === 'BUTTON' ? 'SELECT' : '');
      ring.current?.classList.toggle('cursor-ring--active', Boolean(text));
      if (label.current) label.current.textContent = text;
    };
    const move = (event: PointerEvent) => { targetX = event.clientX; targetY = event.clientY; dot.current?.style.setProperty('transform', `translate3d(${targetX}px,${targetY}px,0)`); setHover(event.target as Element); };
    const refreshHover = () => setHover(document.elementFromPoint(targetX, targetY));
    const render = () => { ringX += (targetX - ringX) * .16; ringY += (targetY - ringY) * .16; ring.current?.style.setProperty('transform', `translate3d(${ringX}px,${ringY}px,0)`); frame = requestAnimationFrame(render); };
    addEventListener('pointermove', move, { passive: true }); addEventListener('scroll', refreshHover, { passive: true }); frame = requestAnimationFrame(render);
    return () => { document.documentElement.classList.remove('has-custom-cursor'); removeEventListener('pointermove', move); removeEventListener('scroll', refreshHover); cancelAnimationFrame(frame); };
  }, [finePointer, reduced]);

  if (!finePointer || reduced) return null;
  return <><div ref={dot} className="cursor-dot" /><div ref={ring} className="cursor-ring"><span ref={label} /></div></>;
}
