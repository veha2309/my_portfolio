import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function usePageMotion(ref: RefObject<HTMLElement | null>, key = "") {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        // Animate from a small offset; content stays visible even if animation initialization fails.
        if (matchMedia("(min-width: 761px)").matches) gsap.from(root.querySelectorAll("[data-intro]"), {
          y: 22,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform",
        });
        gsap.from(root.querySelectorAll('.hero-reel-card > div'), { y: 16, duration: 0.65, stagger: 0.09, ease: 'power3.out', clearProps: 'transform' });
        root
          .querySelectorAll<HTMLElement>("[data-reveal]:not(.website-showcase):not(.about-portrait):not(.project-card)")
          .forEach((element) => {
            gsap.from(element, {
              y: 28,
              duration: 0.65,
              ease: "power3.out",
              clearProps: "transform",
              scrollTrigger: { trigger: element, start: "top 94%", once: true },
            });
          });
        root.querySelectorAll<HTMLElement>('[data-editorial]').forEach((line, index) => {

          gsap.from(line, { y: 40, rotation: index % 2 ? 1 : -1, duration: 0.7, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: line, start: 'top 92%', once: true } });
        });
      });
      media.add(
        "(min-width: 1024px) and (min-height: 740px) and (prefers-reduced-motion: no-preference)",
        () => {
          const hero = root.querySelector(".hero");
          if (!hero) return;
          const opening = gsap.timeline({ scrollTrigger: {
            trigger: hero, start: 'top top', end: () => `+=${window.innerHeight * 0.9}`,
            pin: true, scrub: 0.65, anticipatePin: 1, invalidateOnRefresh: true,
          } });
          const cards = root.querySelectorAll<HTMLElement>('.hero-reel-card');
          cards.forEach((card, index) => {
            const left = [0, 3, 4].includes(index);
            const upper = index < 4;
            opening.to(card, { xPercent: left ? -35 : 35, yPercent: upper ? -65 : 55,
              rotationX: upper ? 18 : -18, rotationY: left ? -14 : 14,
              scale: 1.35, duration: 1, ease: 'none' }, 0);
          });
          opening.to(root.querySelector('#hero-title'), { scale: 0.9, y: -22, duration: 1, ease: 'none' }, 0)
            .to(root.querySelector('.hero-foot'), { y: 24, duration: 1, ease: 'none' }, 0);
          root.querySelectorAll<HTMLElement>('.project-card').forEach(card => {
            const scene = gsap.timeline({ scrollTrigger: { trigger: card,
              start: 'top bottom', end: 'bottom top', scrub: 0.7, invalidateOnRefresh: true } });
            scene.fromTo(card.querySelector('.project-art img'), { scale: 1.12, yPercent: -4 }, { scale: 1, yPercent: 4, duration: 1, ease: 'none' }, 0);
            gsap.fromTo(card.querySelectorAll('.project-meta, .project-heading, .project-link > p'),
              { y: 40 }, { y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', clearProps: 'transform',
                scrollTrigger: { trigger: card, start: 'top 55%', once: true } });
          });
          root.querySelectorAll<HTMLElement>('.website-showcase, .about-portrait').forEach(element => {
            gsap.fromTo(element, { y: 25 }, { y: -15, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
          });

        },
      );
    }, root);
    const refresh = () => ScrollTrigger.refresh();
    let disposed = false;
    void document.fonts.ready.then(() => {
      if (!disposed) refresh();
    });
    return () => {
      disposed = true;
      media.revert();
      context.revert();
    };
  }, [ref, key]);
}
