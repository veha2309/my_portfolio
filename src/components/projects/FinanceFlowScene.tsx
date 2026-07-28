import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { useProjectInteraction } from '../../hooks/useProjectInteraction';

export default function FinanceFlowScene() {
  const containerRef = useRef<HTMLElement>(null);
  const { mousePos, isHovering, isMobile } = useProjectInteraction(containerRef as React.RefObject<HTMLElement>);

  useGSAP(() => {
    if (isMobile || !containerRef.current) return;

    // Outer GSAP timeline for scroll reveal is handled by Projects.tsx on the wrapper.
    // Inner GSAP timeline for pointer interaction:
    if (isHovering) {
      // Enter
      gsap.to('.finance-frame', { scale: 1.02, duration: 0.8, ease: 'power3.out' });
      gsap.to('.finance-meta', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.1 });
      gsap.to('.finance-accent', { scaleX: 1, duration: 0.6, ease: 'power3.out' });
      gsap.to('.finance-secondary-view', { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', duration: 0.8, ease: 'power3.inOut' });
    } else {
      // Exit
      gsap.to('.finance-frame', { scale: 1, duration: 0.8, ease: 'power3.out' });
      gsap.to('.finance-meta', { opacity: 0, y: 10, duration: 0.4, ease: 'power2.in' });
      gsap.to('.finance-accent', { scaleX: 0, duration: 0.4, ease: 'power3.in' });
      gsap.to('.finance-secondary-view', { clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)', duration: 0.6, ease: 'power3.inOut' });
    }
  }, [isHovering, isMobile]);

  useGSAP(() => {
    if (isMobile || !isHovering) return;
    // Hold phase (continuous mapping)
    gsap.to('.finance-dash', {
      x: -mousePos.x * 20,
      y: -mousePos.y * 10,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, [mousePos, isHovering, isMobile]);

  return (
    <article 
      ref={containerRef}
      className="relative w-full min-h-[90vh] flex items-center"
      data-cursor-region="true"
      data-cursor-label="VIEW SYSTEM"
      data-cursor-index="01"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden finance-frame bg-[var(--surface)]">
        <div className="finance-dash absolute inset-[-5%] w-[110%] h-[110%] opacity-50 bg-gradient-to-tr from-[var(--primary)]/10 to-transparent" />
        
        {/* Secondary View Masked */}
        <div 
          className="finance-secondary-view absolute right-0 top-0 w-1/3 h-full bg-[var(--bg)] border-l border-[var(--outline)]"
          style={{ clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)' }}
        >
          <div className="p-8 text-[var(--text-muted)] font-mono text-xs h-full flex flex-col justify-end">
            <p>LATENCY: 12ms</p>
            <p>NODES: ACTIVE</p>
            <p>SYNC: 100%</p>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 px-4 md:px-12 lg:px-24 w-full flex flex-col md:flex-row justify-between items-end gap-12 pointer-events-none">
        <div className="flex-1 proj-reveal">
          <div className="flex items-center gap-4 mb-4">
            <span className="mono-tiny text-[var(--text)]">01 // FINANCEFLOW</span>
            <div className="finance-accent h-[1px] w-12 bg-[var(--primary)] origin-left" style={{ transform: 'scaleX(0)' }} />
          </div>
          <h3 className="text-6xl md:text-8xl lg:text-9xl font-black font-display tracking-tighter uppercase leading-[0.85] text-[var(--text)] mix-blend-difference">
            Real-Time<br />Ledger
          </h3>
        </div>
        
        <div className="w-full md:w-1/3 space-y-8 p-8 proj-reveal pointer-events-auto mix-blend-difference">
          <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--text)]">
            Full-stack financial dashboard utilizing React 19, Node.js, and Socket.io for millisecond-latency trade synchronization.
          </p>
          
          <div className="finance-meta opacity-0 translate-y-2">
            <div className="flex flex-col gap-1 border-t border-[var(--text)] pt-4">
              <span className="mono-tiny text-[var(--text)]">STACK</span>
              <span className="font-bold text-sm uppercase text-[var(--text)]">MERN, Socket.io, Tailwind</span>
            </div>
            <a href="https://github.com/veha2309/financeflow" target="_blank" rel="noreferrer" className="link-hard text-sm inline-flex items-center gap-2 mt-4 text-[var(--text)]">
              Repository <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
