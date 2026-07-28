import { useEffect } from 'react';
import { useSceneStore } from '../../store/useSceneStore';
import { useHasFinePointer, usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

// A deliberately quiet architectural field: broad rails, apertures and contour lines.
// Layers crossfade so mobile never attempts to interpolate a gradient string.
export default function BackgroundCanvas() {
  const { scene, transition, pointer } = useSceneStore();
  const reduced = usePrefersReducedMotion();
  const finePointer = useHasFinePointer();
  useEffect(() => {
    if (!finePointer) return;
    const update = (event: PointerEvent) => { pointer.current.x = event.clientX / innerWidth * 2 - 1; pointer.current.y = event.clientY / innerHeight * 2 - 1; };
    addEventListener('pointermove', update, { passive: true });
    return () => removeEventListener('pointermove', update);
  }, [finePointer, pointer]);
  useEffect(() => {
    if (!finePointer || reduced) return;
    let frame = 0;
    const canvas = document.querySelector<HTMLElement>('.field-canvas');
    const paint = () => {
      if (canvas) {
        canvas.style.setProperty('--pointer-x', `${pointer.current.x * 12}px`);
        canvas.style.setProperty('--pointer-y', `${pointer.current.y * 9}px`);
      }
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(frame);
  }, [finePointer, pointer, reduced]);
  const from = transition.from;
  const to = transition.to === scene ? scene : transition.to;
  const changing = transition.from !== transition.to;
  return <div className={`field-canvas ${reduced ? 'field-canvas--still' : ''} field-canvas--${transition.direction > 0 ? 'forward' : 'backward'} ${changing ? 'field-canvas--changing' : ''}`} aria-hidden="true">
    <div className={`field field--${from} field--current`} />
    <div className={`field field--${to} field--next`} />
    <div className="field-depth field-depth--near" />
    <div className="field-depth field-depth--far" />
    <div className="field-grain" />
  </div>;
}
