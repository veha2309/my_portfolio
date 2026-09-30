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
          .querySelectorAll<HTMLElement>("[data-reveal]:not(.website-showcase):not(.about-portrait)")
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
        "(min-width: 1024px) and (min-height: 650px) and (prefers-reduced-motion: no-preference)",
        () => {
          const hero = root.querySelector(".hero");
          if (!hero) return;
          gsap
            .timeline({
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: () => `+=${window.innerHeight * 0.7}`,
                scrub: 0.5,
                invalidateOnRefresh: true,
              },
            })
            .to(".hero-line--first", { x: -35, ease: "none" }, 0)
            .to(".hero-line--serif", { x: 42, ease: "none" }, 0)
            .to(".hero-foot", { y: -12, ease: "none" }, 0);
          root.querySelectorAll<HTMLElement>('.hero-reel-card').forEach((card, index) => {
            gsap.fromTo(card, { y: index === 1 ? 22 : 0 }, { y: index === 1 ? -24 : -10, ease: 'none', scrollTrigger: { trigger: '.hero-reel', start: 'top 75%', end: 'bottom top', scrub: 0.8 } });
          });
          root.querySelectorAll<HTMLElement>('.project-link').forEach((card, index) => {
            gsap.from(card.querySelectorAll('.project-heading, .project-link > p'), { x: index % 2 ? -24 : 24, duration: 0.65, stagger: 0.08, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: card, start: 'top 85%', once: true } });
          });
          root.querySelectorAll<HTMLElement>('.website-showcase, .about-portrait').forEach(element => {
            gsap.fromTo(element, { y: 25 }, { y: -15, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
          });
          root
            .querySelectorAll<HTMLElement>(".project-art img")
            .forEach((image) => {
              gsap.fromTo(
                image,
                { yPercent: -1.5 },
                {
                  yPercent: 1.5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: image.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 0.5,
                  },
                },
              );
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
