import { Fragment, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSceneStore } from '../store/useSceneStore';
import type { CanvasScene } from '../store/useSceneStore';

gsap.registerPlugin(ScrollTrigger);

type Item = {
  key: CanvasScene; number: string; title: string; chapter: string; eyebrow: string;
  description: string; stack: string; outcome: string; link: string; asset: string; detail: string;
};

const works: Item[] = [
  { key: 'finance', number: '01', title: 'FinanceFlow', chapter: 'OBSERVE', eyebrow: 'OPERATIONAL CLARITY', description: 'A personal finance dashboard built around secure accounts, transaction analysis, and readable financial history.', stack: 'React · TypeScript · Supabase · Zustand · Recharts', outcome: '30 DAY / VIEW', link: 'https://github.com/veha2309/FinanceFlow', asset: 'FinanceFlow dashboard capture required', detail: 'Analytics / transaction detail' },
  { key: 'stock', number: '02', title: 'StockPulse', chapter: 'INTERPRET', eyebrow: 'CONTROLLED DENSITY', description: 'A web-based market monitoring and portfolio interface with a deliberate, information-first terminal architecture.', stack: 'Next.js · TypeScript · Tailwind · Supabase · PostgreSQL', outcome: 'MARKET / FOCUS', link: 'https://github.com/veha2309/StockPulse', asset: 'StockPulse terminal capture required', detail: 'Price / portfolio detail' },
  { key: 'stock-mobile', number: '03', title: 'StockPulse\nMobile', chapter: 'ACT', eyebrow: 'MOBILE TRADING SYSTEM', description: 'A Flutter trading companion focused on interactive market charts, portfolio positions, and per-holding risk controls in a compact mobile interface.', stack: 'Flutter · Provider · Supabase · Hive · Yahoo Finance API', outcome: 'TRADE / MOBILE', link: 'https://github.com/veha2309/StockPulseMobile-', asset: 'StockPulse Mobile interface capture required', detail: 'Chart / risk controls detail' },
  { key: 'vision', number: '04', title: 'Vision\nAssistant', chapter: 'ENABLE', eyebrow: 'SPATIAL ACCESSIBILITY', description: 'An assistive camera experience designed to surface environmental context and navigation cues for people with visual impairments.', stack: 'Flutter · TensorFlow Lite · Camera', outcome: 'SEE / SAFER', link: 'https://github.com/veha2309/vision_assistant', asset: 'Camera + detection capture required', detail: 'Navigation / interface detail' },
];

function MediaSlot({ label, detail }: { label: string; detail: string }) {
  return <div className="project-media" role="img" aria-label={label} data-cursor="EXPLORE">
    <div className="project-media__surface interactive-3d">
      <div className="project-media__grid" />
      <span className="project-media__label">{label}</span>
      <span className="project-media__detail">{detail}</span>
      <b>ASSET SLOT</b>
    </div>
  </div>;
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { transitionScene } = useSceneStore();

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = root.querySelector<HTMLElement>('.work-intro');
      if (intro) {
        const introParts = intro.querySelectorAll('.work-intro__index, .work-intro__copy, .work-intro__track, .work-intro__rule');
        gsap.timeline({ scrollTrigger: { trigger: intro, start: 'top 88%', end: 'bottom 12%', scrub: .65 } })
          .fromTo(introParts, { autoAlpha: 0, xPercent: 7 }, { autoAlpha: 1, xPercent: 0, stagger: .015, duration: .2 }, 0)
          .to(introParts, { autoAlpha: 0, xPercent: -7, stagger: .015, duration: .2 }, .8);
      }
    });

    mm.add('(min-width: 701px) and (prefers-reduced-motion: no-preference)', () => {
      const shell = root.querySelector<HTMLElement>('.projects-horizontal');
      const track = root.querySelector<HTMLElement>('.projects-horizontal__track');
      if (!shell || !track) return;

      const panels = gsap.utils.toArray<HTMLElement>(track.children);
      const horizontalTween = gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: shell,
          start: 'top top',
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          scrub: .72,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          snap: panels.length > 1 ? {
            snapTo: 1 / (panels.length - 1),
            duration: { min: .32, max: .58 },
            delay: .04,
            ease: 'power3.out',
            inertia: false,
          } : undefined,
        },
      });

      root.querySelectorAll<HTMLElement>('.project').forEach((project, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const meta = project.querySelectorAll('.project__head, .project__title, .project__rail, .research-context');
        const media = project.querySelectorAll<HTMLElement>('.project-media');
        const primary = media[0];
        const secondary = media[1];
        const timeline = gsap.timeline({ scrollTrigger: { trigger: project, containerAnimation: horizontalTween, start: 'left 86%', end: 'right 14%', scrub: .65 } });
        timeline
          .fromTo(meta, { autoAlpha: 0, x: 70 * direction }, { autoAlpha: 1, x: 0, stagger: .025, duration: .18 }, 0)
          .fromTo(primary, { autoAlpha: 0, x: 120 * direction, scale: 1.04 }, { autoAlpha: 1, x: 0, scale: 1, duration: .22 }, .04)
          .fromTo(secondary, { autoAlpha: 0, x: -95 * direction, scale: .98 }, { autoAlpha: 1, x: 0, scale: 1, duration: .22 }, .08)
          .to({}, { duration: .38 })
          .to(primary, { autoAlpha: 0, x: -110 * direction, scale: .98, duration: .2 }, .78)
          .to(secondary, { autoAlpha: 0, x: 90 * direction, duration: .2 }, .8)
          .to(meta, { autoAlpha: 0, x: -65 * direction, stagger: .02, duration: .18 }, .8);
      });

      root.querySelectorAll<HTMLElement>('.project-switch').forEach((sceneSwitch) => {
        const outgoing = sceneSwitch.querySelector('.project-switch__out');
        const incoming = sceneSwitch.querySelector('.project-switch__in');
        const plane = sceneSwitch.querySelector('.project-switch__plane');
        const rule = sceneSwitch.querySelector('.project-switch__rule');
        gsap.timeline({ scrollTrigger: { trigger: sceneSwitch, containerAnimation: horizontalTween, start: 'left 82%', end: 'right 18%', scrub: .7 } })
          .fromTo(sceneSwitch, { autoAlpha: .15 }, { autoAlpha: 1, duration: .15 }, 0)
          .fromTo(plane, { scaleX: 0, rotateY: -58 }, { scaleX: 1, rotateY: 0, duration: .42, ease: 'power2.inOut' }, .08)
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: .35 }, .15)
          .to(outgoing, { yPercent: -135, scale: .82, autoAlpha: 0, duration: .2 }, .18)
          .fromTo(incoming, { yPercent: 110, scale: 1.1, autoAlpha: 0 }, { yPercent: 0, scale: 1, autoAlpha: 1, duration: .2 }, .3)
          .to(plane, { scaleX: .12, rotateY: 62, xPercent: 240, autoAlpha: 0, duration: .32 }, .68)
          .to(sceneSwitch, { autoAlpha: .12, duration: .18 }, .82);
      });

      root.querySelectorAll<HTMLElement>('.project').forEach((section) => {
        const scene = section.dataset.scene as CanvasScene;
        ScrollTrigger.create({ trigger: section, containerAnimation: horizontalTween, start: 'left center', end: 'right center', onEnter: () => transitionScene(scene, 1), onEnterBack: () => transitionScene(scene, -1) });
      });
      root.querySelectorAll<HTMLElement>('.project-switch').forEach((sceneSwitch) => {
        const next = sceneSwitch.dataset.next as CanvasScene;
        const previous = sceneSwitch.dataset.previous as CanvasScene;
        ScrollTrigger.create({ trigger: sceneSwitch, containerAnimation: horizontalTween, start: 'left center', end: 'right center', onEnter: () => transitionScene(next, 1), onEnterBack: () => transitionScene(previous, -1) });
      });
    });

    mm.add('(max-width: 700px) and (prefers-reduced-motion: no-preference)', () => {
      root.querySelectorAll<HTMLElement>('.project').forEach((project, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        const meta = project.querySelectorAll('.project__head, .project__title, .project__rail, .research-context');
        const media = project.querySelectorAll<HTMLElement>('.project-media');
        gsap.timeline({ scrollTrigger: { trigger: project, start: 'top 92%', end: 'bottom 8%', scrub: .7 } })
          .fromTo(meta, { autoAlpha: 0, x: 48 * direction }, { autoAlpha: 1, x: 0, stagger: .025, duration: .2 }, 0)
          .fromTo(media, { autoAlpha: 0, x: 70 * direction, scale: 1.03 }, { autoAlpha: 1, x: 0, scale: 1, stagger: .06, duration: .25 }, .05)
          .to({}, { duration: .4 })
          .to([...media, ...Array.from(meta)], { autoAlpha: 0, x: -45 * direction, stagger: .015, duration: .2 }, .8);
      });

      root.querySelectorAll<HTMLElement>('.project-switch').forEach((sceneSwitch) => {
        const outgoing = sceneSwitch.querySelector('.project-switch__out');
        const incoming = sceneSwitch.querySelector('.project-switch__in');
        const plane = sceneSwitch.querySelector('.project-switch__plane');
        const rule = sceneSwitch.querySelector('.project-switch__rule');
        gsap.timeline({ scrollTrigger: { trigger: sceneSwitch, start: 'top 86%', end: 'bottom 14%', scrub: .7 } })
          .fromTo(plane, { scaleX: .08, rotateY: -48 }, { scaleX: 1, rotateY: 0, duration: .36 }, 0)
          .fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: .3 }, .12)
          .to(outgoing, { yPercent: -130, autoAlpha: 0, duration: .2 }, .18)
          .fromTo(incoming, { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: .2 }, .3)
          .to({}, { duration: .24 });
      });

      root.querySelectorAll<HTMLElement>('[data-scene]').forEach((section) => {
        const scene = section.dataset.scene as CanvasScene;
        ScrollTrigger.create({ trigger: section, start: 'top 58%', end: 'bottom 42%', onEnter: () => transitionScene(scene, 1), onEnterBack: () => transitionScene(scene, -1) });
      });
      root.querySelectorAll<HTMLElement>('.project-switch').forEach((sceneSwitch) => {
        const next = sceneSwitch.dataset.next as CanvasScene;
        const previous = sceneSwitch.dataset.previous as CanvasScene;
        ScrollTrigger.create({ trigger: sceneSwitch, start: 'top 56%', end: 'bottom 44%', onEnter: () => transitionScene(next, 1), onEnterBack: () => transitionScene(previous, -1) });
      });
    });

    mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const interactionCleanups: Array<() => void> = [];

      root.querySelectorAll<HTMLElement>('.interactive-3d').forEach((surface) => {
        const move = (event: PointerEvent) => {
          const rect = surface.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - .5;
          const y = (event.clientY - rect.top) / rect.height - .5;
          surface.style.setProperty('--tilt-x', `${-y * 7}deg`);
          surface.style.setProperty('--tilt-y', `${x * 9}deg`);
          surface.style.setProperty('--light-x', `${(x + .5) * 100}%`);
          surface.style.setProperty('--light-y', `${(y + .5) * 100}%`);
        };
        const leave = () => { surface.style.setProperty('--tilt-x', '0deg'); surface.style.setProperty('--tilt-y', '0deg'); };
        surface.addEventListener('pointermove', move, { passive: true }); surface.addEventListener('pointerleave', leave);
        interactionCleanups.push(() => { surface.removeEventListener('pointermove', move); surface.removeEventListener('pointerleave', leave); });
      });
      return () => interactionCleanups.forEach((cleanup) => cleanup());
    });
    return () => mm.revert();
  }, { scope: ref });

  return <div ref={ref} className="work">
    <section className="work-intro" data-scene="work-intro">
      <div className="work-intro__stage">
        <div className="work-intro__index"><span className="eyebrow">SELECTED SYSTEMS</span><h2>01—04</h2></div>
        <p className="work-intro__copy">Product systems for money, observation, science, and more independent movement.</p>
        <div className="work-intro__track"><span>OBSERVE</span><span>INTERPRET</span><span>ACT</span><span>ENABLE</span></div>
        <div className="work-intro__rule"><span /></div>
      </div>
    </section>
    <section className="projects-horizontal" aria-label="Selected projects">
      <div className="projects-horizontal__viewport">
        <div className="projects-horizontal__track">
    {works.map((item, index) => {
      const next = works[index + 1];
      return <Fragment key={item.key}><section className={`project project--${item.key}`} data-scene={item.key} data-index={item.number}>
      <div className="project__head"><span className="project__number">{item.number}</span><span className="eyebrow">{item.chapter} / {item.eyebrow}</span></div>
      <h2 className="project__title">{item.title.split('\n').map(line => <span className="title-mask" key={line}><span className="reveal-title">{line}</span></span>)}</h2>
      <div className="project__composition"><MediaSlot label={item.asset} detail={item.detail} /><MediaSlot label={item.detail} detail="secondary crop" /></div>
      <div className="project__rail"><p className="reveal-copy">{item.description}</p><span className="reveal-copy">STACK / {item.stack}</span><strong className="reveal-copy">{item.outcome}</strong><a className="reveal-copy" href={item.link} target="_blank" rel="noreferrer">OPEN REPOSITORY <ArrowUpRight size={15}/></a></div>
      <div className="project__orbit" aria-hidden="true"><i /><i /><i /></div>
      {item.key === 'stock-mobile' && <aside className="research-context"><span>PARALLEL CONTEXT / PLASTISENSE</span><p>Alongside the trading work, PlastiSense explored a hardware–software workflow for observing microplastics in water samples during Smart India Hackathon.</p><a href="https://github.com/veha2309/PlastiSense-Flutter/tree/master" target="_blank" rel="noreferrer">VIEW RESEARCH CONTEXT <ArrowUpRight size={14}/></a></aside>}
    </section>
    {next && <div className={`project-switch project-switch--${next.key}`} data-previous={item.key} data-next={next.key} data-cursor="NEXT" aria-hidden="true">
      <div className="project-switch__plane"><div className="project-switch__plane-core interactive-3d"><i /><i /><i /><div className="project-switch__caption"><small>SCENE TRANSITION / {item.number}—{next.number}</small><span className="project-switch__out">{item.title.replace('\n', ' ')}</span><b className="project-switch__rule" /><strong className="project-switch__in">{next.title.replace('\n', ' ')}</strong></div></div></div>
    </div>}
    </Fragment>})}
        </div>
      </div>
    </section>
  </div>;
}
