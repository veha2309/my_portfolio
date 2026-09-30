import { useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function usePageMotion(ref: RefObject<HTMLElement | null>, key = '') {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(root.querySelectorAll('[data-intro]'), { y: 18, duration: .7, stagger: .07, clearProps: 'transform', ease: 'power3.out' });
        root.querySelectorAll<HTMLElement>('[data-reveal]:not(.project-card)').forEach(element => {
          gsap.from(element, { y: 30, duration: .7, clearProps: 'transform', ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true } });
        });
      });
      media.add('(min-width: 1024px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)', () => {
        const hero = root.querySelector('.studio-hero');
        if (hero) {
          const sequence = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: () => `+=${innerHeight * .9}`, pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true } });
          sequence.to(root.querySelector('.hero-copy'), { xPercent: -12, y: -60, duration: 1, ease: 'none' }, 0)
            .to(root.querySelector('.scene-plate--front'), { xPercent: -30, y: -100, rotation: 0, scale: 1.15, duration: 1, ease: 'none' }, 0)
            .to(root.querySelector('.scene-plate--middle'), { xPercent: 10, y: -70, rotation: 2, duration: 1, ease: 'none' }, 0)
            .to(root.querySelector('.scene-plate--back'), { xPercent: -10, y: -30, rotation: -3, duration: 1, ease: 'none' }, 0);
        }
        root.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
          gsap.fromTo(card.querySelector('.project-art img'), { scale: 1.07, yPercent: -3 }, { scale: 1, yPercent: 3, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: .8 } });
          gsap.from(card.querySelectorAll('.project-meta, .project-heading, .project-link > p'), { y: 38, stagger: .09, duration: .7, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: card, start: 'top 80%', once: true } });
        });
        root.querySelectorAll<HTMLElement>('[data-editorial]').forEach((line, index) => {
          gsap.fromTo(line, { x: index ? 40 : -40 }, { x: 0, ease: 'none', scrollTrigger: { trigger: line, start: 'top 90%', end: 'top 30%', scrub: .6 } });
        });
        const progress = root.querySelector('.story-progress span');
        if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.design-note', start: 'top 80%', end: 'bottom 50%', scrub: .6 } });
      });
    }, root);
    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); context.revert(); };
  }, [ref, key]);
}
