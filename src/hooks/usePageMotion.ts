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
        const opening = gsap.timeline({ defaults: { ease: 'power4.out' } });
        opening.from(root.querySelectorAll('[data-hero-word]'), { yPercent: 110, rotation: 4, duration: 1.25, stagger: .14, clearProps: 'transform' }, 0)
          .from(root.querySelectorAll('[data-intro]'), { y: 28, opacity: 0, duration: .85, stagger: .09, clearProps: 'transform,opacity' }, .25);
        const depth = root.querySelector('.reel-entrance');
        if (depth) opening.from(depth, { scale: .78, rotation: -6, opacity: 0, duration: 1.4, clearProps: 'transform,opacity' }, .15);
        root.querySelectorAll<HTMLElement>('[data-reveal]:not(.project-card)').forEach(element => {
          gsap.from(element, { y: 42, duration: .95, clearProps: 'transform', ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 94%', once: true } });
        });
        root.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
          gsap.from(card.querySelector('.project-art'), { clipPath: 'inset(12% 0% 12% 0%)', duration: 1.1, ease: 'power3.out', clearProps: 'clipPath', scrollTrigger: { trigger: card, start: 'top 92%', once: true } });
          gsap.from(card.querySelectorAll('.project-meta, .project-heading, .project-link > p, .project-stack'), { y: 30, stagger: .07, duration: .8, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: card, start: 'top 75%', once: true } });
        });
        const ribbon = root.querySelector('.discipline-track');
        if (ribbon) gsap.fromTo(ribbon, { xPercent: 0 }, { xPercent: -24, ease: 'none', scrollTrigger: { trigger: '.studio-disciplines', start: 'top bottom', end: 'bottom top', scrub: 1.2 } });
      });
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const hero = root.querySelector('.studio-hero');
        const idle: gsap.core.Tween[] = [];
        let heroVisible = false;
        const updateIdle = () => {
          const active = heroVisible && !document.hidden;
          hero?.setAttribute('data-motion-active', String(active));
          idle.forEach(tween => tween.paused(!active));
        };
        if (hero) {
          const sequence = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 } });
          sequence.to(root.querySelector('.scene-plate--front'), { xPercent: -9, y: -90, rotation: -10, duration: 1, ease: 'none' }, 0)
            .to(root.querySelector('.scene-plate--middle'), { xPercent: 14, y: -135, rotation: 13, duration: 1, ease: 'none' }, 0)
            .to(root.querySelector('.scene-plate--back'), { xPercent: -6, y: -175, rotation: -15, duration: 1, ease: 'none' }, 0)
            .to(root.querySelector('.hero-copy'), { y: 70, duration: 1, ease: 'none' }, 0)
            .to(root.querySelector('.reel-sculpture'), { rotation: 45, scale: 1.16, duration: 1, ease: 'none' }, 0);
          idle.push(gsap.to(root.querySelector('.sculpture-core'), { rotation: 360, duration: 48, repeat: -1, ease: 'none', paused: true }));
          idle.push(gsap.to(root.querySelector('.craft-seal b'), { rotation: 360, duration: 30, repeat: -1, ease: 'none', paused: true }));
          const visibility = ScrollTrigger.create({ trigger: hero, start: 'top bottom', end: 'bottom top', onToggle: trigger => { heroVisible = trigger.isActive; updateIdle(); } });
          heroVisible = visibility.isActive;
          updateIdle();
        }
        root.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
          gsap.fromTo(card.querySelector('.project-art img'), { scale: 1.08, yPercent: -2 }, { scale: 1, yPercent: 2, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 } });
        });
        root.querySelectorAll<HTMLElement>('[data-editorial]').forEach((line, index) => {
          gsap.fromTo(line, { x: index ? 110 : -110 }, { x: 0, ease: 'none', scrollTrigger: { trigger: line, start: 'top 95%', end: 'top 35%', scrub: 1 } });
        });
        const masthead = root.querySelector('.work-masthead');
        if (masthead) gsap.fromTo(masthead, { x: -45 }, { x: 0, ease: 'none', scrollTrigger: { trigger: masthead, start: 'top bottom', end: 'top 30%', scrub: .8 } });
        const progress = root.querySelector('.story-progress span');
        if (progress) gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.design-note', start: 'top 80%', end: 'bottom 50%', scrub: .6 } });
        const stage = root.querySelector('.website-stage');
        if (stage) gsap.from(stage, { clipPath: 'inset(8% 4% 8% 4% round 20px)', ease: 'none', scrollTrigger: { trigger: stage, start: 'top 95%', end: 'top 25%', scrub: .8 } });
        document.addEventListener('visibilitychange', updateIdle);
        return () => { document.removeEventListener('visibilitychange', updateIdle); hero?.removeAttribute('data-motion-active'); };
      });
      media.add('(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const cleanups: (() => void)[] = [];
        root.querySelectorAll<HTMLElement>('[data-depth]').forEach(element => {
          const isHero = element.classList.contains('reel-depth');
          // Measure and listen on a surface that does not tilt under the pointer.
          const surface = isHero ? element.closest<HTMLElement>('.hero-reel') ?? element : element;
          const rotateX = gsap.quickTo(element, 'rotationX', { duration: .7, ease: 'power3.out' });
          const rotateY = gsap.quickTo(element, 'rotationY', { duration: .7, ease: 'power3.out' });
          gsap.set(element, { transformPerspective: 1100 });
          let bounds: DOMRect | null = null;
          const enter = () => { bounds = surface.getBoundingClientRect(); };
          const move = (event: PointerEvent) => {
            if (!bounds) return;
            const x = Math.max(-.5, Math.min(.5, (event.clientX - bounds.left) / bounds.width - .5));
            const y = Math.max(-.5, Math.min(.5, (event.clientY - bounds.top) / bounds.height - .5));
            rotateX(-y * (isHero ? 14 : 7));
            rotateY(x * (isHero ? 18 : 9));
          };
          const reset = () => { bounds = null; rotateX(0); rotateY(0); };
          surface.addEventListener('pointerenter', enter);
          surface.addEventListener('pointermove', move);
          surface.addEventListener('pointerleave', reset);
          element.addEventListener('focusout', reset);
          cleanups.push(() => {
            surface.removeEventListener('pointerenter', enter);
            surface.removeEventListener('pointermove', move);
            surface.removeEventListener('pointerleave', reset);
            element.removeEventListener('focusout', reset);
          });
        });
        root.querySelectorAll<HTMLElement>('.hero-actions .button').forEach(button => {
          const xTo = gsap.quickTo(button, 'x', { duration: .4, ease: 'power3.out' });
          const yTo = gsap.quickTo(button, 'y', { duration: .4, ease: 'power3.out' });
          const move = (event: PointerEvent) => {
            const bounds = button.getBoundingClientRect();
            xTo((event.clientX - bounds.left - bounds.width / 2) * .12);
            yTo((event.clientY - bounds.top - bounds.height / 2) * .2);
          };
          const reset = () => { xTo(0); yTo(0); };
          button.addEventListener('pointermove', move);
          button.addEventListener('pointerleave', reset);
          cleanups.push(() => { button.removeEventListener('pointermove', move); button.removeEventListener('pointerleave', reset); });
        });
        return () => cleanups.forEach(cleanup => cleanup());
      });
    }, root);
    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed) ScrollTrigger.refresh(); });
    return () => { disposed = true; media.revert(); context.revert(); };
  }, [ref, key]);
}
