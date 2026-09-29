import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '../store/useSceneStore';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const ref = useRef<HTMLElement>(null);
  const { transitionScene } = useSceneStore();

  useGSAP(() => {
    const context = gsap.context(() => {
      if (document.documentElement.classList.contains('performance-lite')) return;
      gsap.timeline()
        .from('.hero__line', { yPercent: 108, duration: .95, stagger: .09, ease: 'power4.out' })
        .from('.hero__meta span', { opacity: 0, y: 10, duration: .42, stagger: .055, ease: 'power2.out' }, '-=.42')
        .from('.hero__anchor span', { opacity: 0, y: 10, duration: .42, stagger: .08, ease: 'power2.out' }, '-=.28')
        .fromTo('.hero__anchor i', { scaleX: 0, transformOrigin: 'left' }, { scaleX: 1, duration: .72, ease: 'power3.inOut' }, '-=.44');
      gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: '62% top', end: 'bottom top', scrub: .6, onEnter: () => transitionScene('work-intro') },
      }).to('.hero__meta', { opacity: 0, x: -20 }).to('.hero__line--first', { xPercent: -4 }, 0).to('.hero__line--last', { xPercent: 3 }, 0);
    }, ref);
    return () => context.revert();
  }, { scope: ref });

  return <section ref={ref} className="hero">
    <div className="hero__meta"><span>VEDANT SHUKLA / SOFTWARE ENGINEER</span><span>NEW DELHI, INDIA</span><span>WEB + MOBILE / 2026</span></div>
    <h1 className="hero__statement normal-tilt">
      <span className="hero__mask"><span className="hero__line hero__line--first">I BUILD PRODUCTS</span></span>
      <span className="hero__mask"><span className="hero__line">FOR MONEY, MARKETS</span></span>
      <span className="hero__mask hero__mask--muted"><span className="hero__line hero__line--last">AND ACCESS.</span></span>
    </h1>
    <div className="hero__anchor"><span>4 CASE STUDIES</span><i /><span>REACT, NEXT.JS, FLUTTER<br />PRODUCT ENGINEERING</span></div>
  </section>;
}
