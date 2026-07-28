import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useProjectInteraction } from '../../hooks/useProjectInteraction';

export default function MicroplasticsScene() {
  const containerRef = useRef<HTMLElement>(null);
  const { mousePos, isHovering, isMobile } = useProjectInteraction(containerRef as React.RefObject<HTMLElement>);

  useGSAP(() => {
    if (isMobile || !containerRef.current) return;

    if (isHovering) {
      gsap.to('.mp-bg', { backgroundColor: '#1C2B36', duration: 1, ease: 'power3.out' });
      gsap.to('.mp-mask', { clipPath: 'circle(40% at 50% 50%)', duration: 1.2, ease: 'power3.inOut' });
      gsap.to('.mp-sci-label', { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 });
      gsap.to('.mp-hardware-layer', { y: -20, scale: 1.05, duration: 1, ease: 'power3.out' });
      gsap.to('.mp-meta', { opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.2 });
    } else {
      gsap.to('.mp-bg', { backgroundColor: 'var(--surface)', duration: 0.8, ease: 'power3.inOut' });
      gsap.to('.mp-mask', { clipPath: 'circle(100% at 50% 50%)', duration: 0.8, ease: 'power3.inOut' });
      gsap.to('.mp-sci-label', { opacity: 0, x: -20, duration: 0.4, ease: 'power2.in' });
      gsap.to('.mp-hardware-layer', { y: 0, scale: 1, duration: 0.8, ease: 'power3.inOut' });
      gsap.to('.mp-meta', { opacity: 0, duration: 0.4, ease: 'power2.in' });
    }
  }, [isHovering, isMobile]);

  useGSAP(() => {
    if (isMobile || !isHovering) return;
    gsap.to('.mp-hardware-layer', {
      x: mousePos.x * 10,
      y: mousePos.y * 10 - 20,
      duration: 0.6,
      ease: 'power2.out'
    });
    gsap.to('.mp-mask-inner', {
      x: -mousePos.x * 15,
      y: -mousePos.y * 15,
      duration: 0.8,
      ease: 'power2.out'
    });
  }, [mousePos, isHovering, isMobile]);

  return (
    <article 
      ref={containerRef}
      className="mp-bg relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden transition-colors duration-700"
      data-cursor-region="true"
      data-cursor-label="VIEW RESEARCH"
      data-cursor-index="03"
    >
      <div className="absolute inset-0 w-full h-full z-0 mp-mask" style={{ clipPath: 'circle(100% at 50% 50%)' }}>
         <div className="mp-mask-inner absolute inset-[-10%] w-[120%] h-[120%] bg-gradient-to-b from-[#253949] to-transparent opacity-40" />
      </div>

      <div className="absolute top-24 left-12 md:left-24 mp-sci-label opacity-0 -translate-x-5 pointer-events-none z-20">
        <span className="font-mono text-xs text-[#8BA5B8] uppercase tracking-widest border border-[#3E5C76] px-3 py-1 bg-[#1C2B36]">
          Sample Analysed: MP-204
        </span>
      </div>

      <div className="relative z-10 w-full px-4 md:px-12 text-center pointer-events-none">
        <span className="mono-tiny block mb-8 text-[var(--text-muted)] mix-blend-difference">03 // SIH HACKATHON WINNER</span>
        <h3 className="mp-hardware-layer text-[12vw] font-black font-display tracking-tighter uppercase leading-[0.8] mx-auto break-words text-[var(--text)] mix-blend-difference">
          Microplastic<br />Detection
        </h3>
      </div>

      <div className="mp-meta opacity-0 absolute bottom-0 left-0 w-full border-t border-[var(--outline)] bg-[var(--bg)] p-8 grid grid-cols-1 md:grid-cols-3 gap-8 z-20 pointer-events-auto">
        <div>
          <span className="mono-tiny block mb-2">DOMAIN</span>
          <p className="font-bold text-sm uppercase text-[var(--text)]">IoT / ML Systems</p>
        </div>
        <div className="md:col-span-2">
          <span className="mono-tiny block mb-2">OUTCOME</span>
          <p className="text-sm md:text-base text-[var(--text-muted)]">Hardware-software integration pipeline deploying machine learning models for real-time microplastic concentration analysis in water supplies.</p>
        </div>
      </div>
    </article>
  );
}
