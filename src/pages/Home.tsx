import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '../store/useSceneStore';
gsap.registerPlugin(ScrollTrigger);
export default function Home() {
  const ref = useRef<HTMLElement>(null); const { transitionScene } = useSceneStore();
  useGSAP(() => { const context = gsap.context(() => {
    gsap.timeline().from('.hero__line', { yPercent: 105, duration: 1.15, stagger: .1, ease: 'power4.out' }).from('.hero__meta, .hero__anchor', { opacity: 0, y: 18, duration: .6, stagger: .08 }, '-=.45');
    gsap.timeline({ scrollTrigger: { trigger: ref.current, start: '62% top', end: 'bottom top', scrub: .6, onEnter: () => transitionScene('work-intro') } }).to('.hero__meta', { opacity: 0, x: -30 }).to('.hero__line:nth-child(1)', { xPercent: -8 }, 0).to('.hero__line:nth-child(3)', { xPercent: 6 }, 0).to('.hero__anchor', { clipPath: 'inset(0 0 0 100%)' }, 0);
  }, ref); return () => context.revert(); }, { scope: ref });
  return <section ref={ref} className="hero"><div className="hero__meta"><span>VEDANT SHUKLA / CREATIVE TECHNOLOGIST</span><span>DELHI, INDIA</span><span>SELECTED WORK 2026</span></div><h1 className="hero__statement"><span className="hero__mask"><span className="hero__line">I BUILD SYSTEMS</span></span><span className="hero__mask"><span className="hero__line">THAT SEE, THINK</span></span><span className="hero__mask hero__mask--muted"><span className="hero__line">AND MOVE.</span></span></h1><div className="hero__anchor"><span>01 / 05</span><i /><span>COMPUTATIONAL<br/>PRODUCTS</span></div></section>;
}
