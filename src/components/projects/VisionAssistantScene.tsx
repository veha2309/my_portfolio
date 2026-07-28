import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { useProjectInteraction } from '../../hooks/useProjectInteraction';

export default function VisionAssistantScene() {
  const containerRef = useRef<HTMLElement>(null);
  const { mousePos, isHovering, isMobile } = useProjectInteraction(containerRef as React.RefObject<HTMLElement>);

  useGSAP(() => {
    if (isMobile || !containerRef.current) return;

    if (isHovering) {
      gsap.to('.va-image', { scale: 1.03, duration: 1, ease: 'power3.out' });
      gsap.to('.va-grid', { opacity: 0.15, duration: 0.8, ease: 'power2.out' });
      gsap.to('.va-bounding-box', { opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(1.2)', delay: 0.2 });
      gsap.to('.va-text-block', { x: 15, duration: 0.8, ease: 'power3.out' });
      gsap.to('.va-theme', { backgroundColor: '#1E1B2E', duration: 1 });
    } else {
      gsap.to('.va-image', { scale: 1, duration: 0.8, ease: 'power3.inOut' });
      gsap.to('.va-grid', { opacity: 0, duration: 0.4, ease: 'power2.in' });
      gsap.to('.va-bounding-box', { opacity: 0, scale: 0.9, duration: 0.4, ease: 'power2.in' });
      gsap.to('.va-text-block', { x: 0, duration: 0.8, ease: 'power3.inOut' });
      gsap.to('.va-theme', { backgroundColor: 'var(--surface)', duration: 0.8 });
    }
  }, [isHovering, isMobile]);

  useGSAP(() => {
    if (isMobile || !isHovering) return;
    gsap.to('.va-grid', {
      backgroundPosition: `${mousePos.x * 20}px ${mousePos.y * 20}px`,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, [mousePos, isHovering, isMobile]);

  return (
    <article 
      ref={containerRef}
      className="relative w-full px-4 md:px-12 lg:px-24 group mb-32"
      data-cursor-region="true"
      data-cursor-label="VIEW CASE STUDY"
      data-cursor-index="04"
    >
      <div className="flex flex-col md:flex-row gap-12 items-start proj-reveal">
        
        <div className="va-theme w-full md:w-1/2 min-h-[60vh] bg-[var(--surface)] text-[var(--text)] p-12 flex flex-col justify-between border-sharp relative overflow-hidden transition-colors">
          
          {/* Perception Grid */}
          <div 
            className="va-grid absolute inset-0 opacity-0 pointer-events-none" 
            style={{ backgroundImage: 'linear-gradient(#5C4D8B 1px, transparent 1px), linear-gradient(90deg, #5C4D8B 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />

          {/* Bounding Boxes overlay */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="va-bounding-box absolute top-[20%] left-[30%] w-[40%] h-[30%] border border-[#8B7CCC] opacity-0 scale-90" />
             <div className="va-bounding-box absolute top-[60%] left-[15%] w-[25%] h-[20%] border border-[#8B7CCC] opacity-0 scale-90" />
             <div className="va-bounding-box absolute top-[50%] right-[20%] w-[15%] h-[35%] border border-[#8B7CCC] opacity-0 scale-90 text-[8px] font-mono p-1 text-[#8B7CCC]">obj: detected</div>
          </div>

          <div className="relative z-10 pointer-events-none">
            <span className="mono-tiny text-[var(--text-muted)] block mb-4">04 // VISION ASSISTANT</span>
          </div>
          
          <div className="va-text-block relative z-10 pointer-events-none">
            <h3 className="text-6xl lg:text-7xl font-black font-display tracking-tighter uppercase leading-[0.85] mb-6 text-[var(--text)]">
              AI Context<br />Engine
            </h3>
            <a href="https://github.com/veha2309/vision_assistant" target="_blank" rel="noreferrer" className="link-hard text-sm text-[var(--text)] inline-flex items-center gap-2 relative z-20 pointer-events-auto">Source Code <ArrowRight size={14} /></a>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 pt-0 md:pt-32 space-y-8 pointer-events-none">
          <p className="text-xl md:text-3xl font-display font-bold leading-tight text-[var(--text)]">
            An intelligent conversational interface processing multi-modal context streams.
          </p>
          <div className="grid grid-cols-2 gap-8 border-t border-[var(--outline)] pt-8">
            <div>
              <span className="mono-tiny block mb-2">STACK</span>
              <p className="font-mono text-sm uppercase text-[var(--text-muted)]">Next.js, OpenAI, TRPC</p>
            </div>
            <div>
              <span className="mono-tiny block mb-2">STATUS</span>
              <p className="font-mono text-sm uppercase text-[var(--primary)]">Production</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
