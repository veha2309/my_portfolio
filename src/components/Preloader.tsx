import { useEffect, useState } from 'react';

interface PreloaderProps { onComplete?: () => void; }

export default function Preloader({ onComplete }: PreloaderProps) {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    const updateProgress = (now: number) => {
      const next = Math.min(100, Math.round(((now - startedAt) / 1750) * 100));
      setProgress(next);
      if (next < 100) frame = window.requestAnimationFrame(updateProgress);
    };
    frame = window.requestAnimationFrame(updateProgress);
    const timer = window.setTimeout(() => {
      setDone(true);
      onComplete?.();
    }, 2450);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [onComplete]);

  if (done) return null;

  return <div className="opening" aria-label="Loading Vedant Shukla's portfolio">
    <div className="opening__count">01—04 / SELECTED SYSTEMS</div>
    <p className="opening__statement">DESIGNING DIGITAL SYSTEMS<br />WITH CLARITY, MOTION, AND PURPOSE.</p>
    <div className="opening__title" aria-label="Vedant Shukla">
      {['VEDANT', 'SHUKLA'].map((word, row) => <span className="opening__word" aria-hidden="true" key={word}>
        <span className="opening__letters">
          {word.split('').map((letter, index) => <span className="opening__letter" style={{ animationDelay: `${.08 + row * .13 + index * .045}s` }} key={`${letter}-${index}`}>{letter}</span>)}
        </span>
      </span>)}
    </div>
    <div className="opening__loader" aria-live="polite">
      <span>{progress < 28 ? 'CALIBRATING INTERFACE' : progress < 62 ? 'ASSEMBLING PROJECTS' : progress < 100 ? 'COMPOSING MOTION' : 'PORTFOLIO READY'}</span>
      <strong>{String(progress).padStart(3, '0')}%</strong>
      <div className="opening__loader-track"><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
    </div>
    <div className="opening__note">VEDANT SHUKLA / CREATIVE DEVELOPER &amp; PRODUCT ENGINEER</div>
  </div>;
}
