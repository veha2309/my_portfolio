import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Github, ArrowRight } from 'lucide-react';
import { useProjectInteraction } from '../../hooks/useProjectInteraction';

export default function StockPulseScene() {
  const containerRef = useRef<HTMLElement>(null);
  const { mousePos, isHovering, isMobile } = useProjectInteraction(containerRef as React.RefObject<HTMLElement>);

  useGSAP(() => {
    if (isMobile || !containerRef.current) return;

    if (isHovering) {
      gsap.to('.sp-bg-number', { scale: 1.2, opacity: 0.4, duration: 1.2, ease: 'power3.out' });
      gsap.to('.sp-secondary-crop', { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 });
      gsap.to('.sp-meta', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 });
    } else {
      gsap.to('.sp-bg-number', { scale: 1, opacity: 0.1, duration: 0.8, ease: 'power3.inOut' });
      gsap.to('.sp-secondary-crop', { x: 100, opacity: 0, duration: 0.6, ease: 'power3.in' });
      gsap.to('.sp-meta', { opacity: 0, y: 10, duration: 0.4, ease: 'power2.in' });
    }
  }, [isHovering, isMobile]);

  useGSAP(() => {
    if (isMobile || !isHovering) return;
    gsap.to('.sp-chart-layer', {
      x: -mousePos.x * 15,
      duration: 0.4,
      ease: 'power2.out'
    });
  }, [mousePos, isHovering, isMobile]);

  return (
    <article 
      ref={containerRef}
      className="relative w-full px-4 md:px-12 lg:px-24 group"
      data-cursor-region="true"
      data-cursor-label="EXPLORE TERMINAL"
      data-cursor-index="02"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-b border-[var(--outline)] bg-[var(--surface)] transition-colors duration-700 hover:bg-[#1A202C]">
        
        <div className="lg:col-span-8 border-r-0 lg:border-r border-[var(--outline)] p-8 md:p-16 flex flex-col justify-between proj-reveal relative overflow-hidden z-10 pointer-events-none">
          <span className="mono-tiny block mb-12 text-[var(--text)]">02 // STOCKPULSE</span>
          <h3 className="text-5xl md:text-7xl font-black font-display tracking-tighter uppercase leading-[0.85] mb-12 text-[var(--text)]">
            Mobile Trade<br />Architecture
          </h3>
          <p className="font-sans text-base max-w-lg leading-relaxed mb-12 text-[var(--text-muted)] group-hover:text-[#A0AEC0] transition-colors duration-500">
            High-frequency trading interface built in Flutter, executing seamless order flows and real-time market data visualization via local Hive DB caching.
          </p>
          
          <div className="flex gap-8 sp-meta opacity-0 translate-y-2 pointer-events-auto">
            <a href="#" className="link-hard text-sm text-[var(--text)] inline-flex items-center gap-2">Live Demo <ArrowRight size={14} /></a>
            <a href="https://github.com/veha2309/stockpulse" target="_blank" rel="noreferrer" className="link-hard text-sm text-[#A0AEC0] inline-flex items-center gap-2">Repository <Github size={14} /></a>
          </div>
        </div>

        <div className="lg:col-span-4 min-h-[50vh] relative overflow-hidden flex items-center justify-center">
           {/* Primary Visual */}
           <div className="sp-chart-layer absolute inset-0 bg-[#2D3748] opacity-10" />
           
           {/* Huge Project Number growing behind */}
           <div className="sp-bg-number absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#2D3748] opacity-10 font-black text-[20vw] lg:text-[15vw] pointer-events-none origin-center">
             02
           </div>

           {/* Secondary terminal crop sliding in */}
           <div className="sp-secondary-crop absolute right-0 bottom-12 w-3/4 h-48 bg-[#1A202C] border-l border-t border-[#2D3748] p-4 flex flex-col gap-2 translate-x-[100px] opacity-0">
              <div className="h-2 w-1/3 bg-[#4A5568]" />
              <div className="h-2 w-1/2 bg-[#4A5568]" />
              <div className="h-12 w-full mt-auto flex items-end gap-1">
                 <div className="w-1/4 h-1/2 bg-[#3182CE]" />
                 <div className="w-1/4 h-full bg-[#3182CE]" />
                 <div className="w-1/4 h-3/4 bg-[#E53E3E]" />
                 <div className="w-1/4 h-1/4 bg-[#E53E3E]" />
              </div>
           </div>
        </div>

      </div>
    </article>
  );
}
