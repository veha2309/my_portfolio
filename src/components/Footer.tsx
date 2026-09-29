import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '../store/useSceneStore';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { transitionScene } = useSceneStore();

  useGSAP(() => {
    if (document.documentElement.classList.contains('performance-lite')) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 55%',
      onEnter: () => transitionScene('contact'),
      onEnterBack: () => transitionScene('contact', -1),
    });
    gsap.from('.contact__word', {
      yPercent: 105,
      stagger: .12,
      duration: 1,
      ease: 'power4.out',
      scrollTrigger: { trigger: ref.current, start: 'top 72%' },
    });
  }, { scope: ref });

  return <footer ref={ref} id="contact" className="contact">
    <div className="contact__aperture normal-tilt" aria-hidden="true"><i /><i /><i /></div>
    <span className="eyebrow">CONTACT / AVAILABLE FOR PRODUCT WORK</span>
    <h2><span><span className="contact__word">LET'S</span></span><span><span className="contact__word">TALK.</span></span></h2>
    <p className="contact__intro">I’m interested in thoughtful web and mobile products, especially where engineering, product decisions, and interface craft overlap.</p>
    <div className="contact__bottom"><a href="mailto:448vedantshukla@gmail.com">448vedantshukla@gmail.com</a><div><a href="https://github.com/veha2309" target="_blank" rel="noreferrer">GITHUB</a><a href="https://linkedin.com/in/vedant-shukla-79a6342b1" target="_blank" rel="noreferrer">LINKEDIN</a></div></div>
  </footer>;
}
