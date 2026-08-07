import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
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
  { key: 'finance', number: '01', title: 'FinanceFlow', chapter: 'WEB APP', eyebrow: '2026', description: 'A personal finance dashboard for reviewing accounts, transactions, and spending patterns without losing the thread.', stack: 'React · TypeScript · Supabase · Zustand · Recharts', outcome: 'PERSONAL FINANCE', link: 'https://github.com/veha2309/FinanceFlow', asset: 'Financial overview', detail: 'Accounts and transaction analysis' },
  { key: 'stock', number: '02', title: 'StockPulse', chapter: 'WEB APP', eyebrow: '2026', description: 'A market dashboard that brings watchlists, holdings, and price movement into one information-dense workspace.', stack: 'Next.js · TypeScript · Tailwind · Supabase · PostgreSQL', outcome: 'MARKET DATA', link: 'https://github.com/veha2309/StockPulse', asset: 'Market dashboard', detail: 'Prices and portfolio positions' },
  { key: 'stock-mobile', number: '03', title: 'StockPulse\nMobile', chapter: 'MOBILE APP', eyebrow: '2025', description: 'A Flutter trading companion with interactive charts, portfolio positions, and risk controls designed for a small screen.', stack: 'Flutter · Provider · Supabase · Hive · Yahoo Finance API', outcome: 'FLUTTER MOBILE', link: 'https://github.com/veha2309/StockPulseMobile-', asset: 'Mobile trading app', detail: 'Charts and risk controls' },
  { key: 'vision', number: '04', title: 'Vision\nAssistant', chapter: 'ACCESSIBILITY', eyebrow: '2025', description: 'An on-device camera assistant that turns object detection into clear environmental and navigation cues.', stack: 'Flutter · TensorFlow Lite · Camera', outcome: 'ON-DEVICE ML', link: 'https://github.com/veha2309/vision_assistant', asset: 'Camera assistant', detail: 'Detection and navigation cues' },
];

const projectEvidence: Partial<Record<CanvasScene, string[]>> = {
  finance: ['OFFLINE-FIRST STATE', 'ANOMALY DETECTION', 'SECURE PERSISTENCE'],
  stock: ['REALTIME PORTFOLIO', 'TYPE-SAFE SYSTEM', 'P/L CALCULATION'],
  'stock-mobile': ['CUSTOM CANDLE CHART', 'FIFO SELLING', 'REALTIME SYNC'],
  vision: ['ON-DEVICE INFERENCE', 'CAMERA PIPELINE', 'ACCESSIBLE CUES'],
};

const liveLinks: Partial<Record<CanvasScene, string>> = {
  finance: 'https://finance-flow-pi-eight.vercel.app/',
  stock: 'https://stockpulse-nine-taupe.vercel.app/',
};

function ProjectVisual({ kind, secondary, label, detail }: { kind: CanvasScene; secondary?: boolean; label: string; detail: string }) {
  const candles = [34, 58, 45, 74, 52, 86, 62, 78, 48, 68, 82, 57];
  const bars = [36, 52, 43, 66, 58, 78, 64, 88, 73, 92];
  return <div className={`project-media project-media--${kind}${secondary ? ' project-media--secondary' : ''}`} role="img" aria-label={label} data-cursor="EXPLORE">
    <div className="project-media__surface interactive-3d">
      <div className="project-media__grid" />
      <div className={`system-visual system-visual--${kind}`} aria-hidden="true">
        {kind === 'finance' && <><div className="finance-ui__top"><span>NET POSITION</span><strong>₹ 2,48,610</strong><em>+12.8%</em></div><div className="finance-ui__bars">{bars.map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div><div className="finance-ui__ledger"><span>FOOD <b>18%</b></span><span>INVESTMENTS <b>34%</b></span><span>UTILITIES <b>12%</b></span></div></>}
        {kind === 'stock' && <><div className="stock-ui__ticker"><span>NIFTY 50 <b>+0.84%</b></span><span>22,419.95</span></div><div className="stock-ui__candles">{candles.map((height, index) => <i className={index % 3 === 0 ? 'is-down' : ''} style={{ height: `${height}%` }} key={index} />)}</div><div className="stock-ui__book"><span>BUY 48.2K</span><span>SPREAD 0.04</span><span>SELL 31.7K</span></div></>}
        {kind === 'stock-mobile' && <div className="mobile-ui__device"><div className="mobile-ui__island"/><div className="mobile-ui__quote"><span>NVDA</span><strong>$ 138.85</strong><em>+2.14%</em></div><div className="mobile-ui__chart">{candles.slice(2).map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div><div className="mobile-ui__risk"><span>STOP LOSS <b>132.40</b></span><span>TAKE PROFIT <b>146.00</b></span></div></div>}
        {kind === 'vision' && <><div className="vision-ui__scan"/><div className="vision-ui__target vision-ui__target--one"><b>PERSON</b><span>94%</span></div><div className="vision-ui__target vision-ui__target--two"><b>DOOR</b><span>87%</span></div><div className="vision-ui__cue">PATH CLEAR / 2.4 M</div></>}
      </div>
      <span className="project-media__label">{label}</span><span className="project-media__detail">{detail}</span><b>{secondary ? 'DETAIL' : 'PROJECT VIEW'}</b>
    </div>
  </div>;
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const lockedScroll = useRef(0);
  const [activeProject, setActiveProject] = useState<Item | null>(null);
  const { transitionScene } = useSceneStore();

  const openProject = useCallback((item: Item) => {
    setActiveProject(item);
    transitionScene(item.key, 1);
  }, [transitionScene]);

  const closeProject = useCallback(() => {
    setActiveProject(null);
    transitionScene('work-intro', -1);
  }, [transitionScene]);

  useEffect(() => {
    if (!activeProject) return;
    lockedScroll.current = window.scrollY;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeProject(); };
    document.documentElement.classList.add('project-modal-open');
    window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: { locked: true } }));
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.documentElement.classList.remove('project-modal-open');
      window.removeEventListener('keydown', onKeyDown);
      window.dispatchEvent(new CustomEvent('portfolio:scroll-lock', { detail: { locked: false } }));
      window.dispatchEvent(new CustomEvent('portfolio:navigate', { detail: { target: lockedScroll.current, immediate: true } }));
    };
  }, [activeProject, closeProject]);

  useGSAP(() => {
    const root = ref.current;
    if (!root) return;
    const lite = document.documentElement.classList.contains('performance-lite');
    if (lite) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = root.querySelector<HTMLElement>('.work-intro');
      if (intro) gsap.timeline({ scrollTrigger: { trigger: intro, start: 'top 88%', end: 'bottom 12%', scrub: .65 } })
        .fromTo(intro.querySelectorAll('.work-intro__index, .work-intro__copy, .work-intro__track, .work-intro__rule'), { autoAlpha: 0, xPercent: 4 }, { autoAlpha: 1, xPercent: 0, stagger: .018, duration: .28 }, 0);
    });

    mm.add('(min-width: 701px) and (prefers-reduced-motion: no-preference)', () => {
      const deck = root.querySelector<HTMLElement>('.project-deck');
      const cards = gsap.utils.toArray<HTMLElement>('.project-card', root);
      if (!deck || !cards.length) return;
      const destinations = [
        { x: '-27vw', y: '-17vh', rotation: -5 },
        { x: '27vw', y: '-16vh', rotation: 4 },
        { x: '-26vw', y: '18vh', rotation: 4 },
        { x: '27vw', y: '18vh', rotation: -4 },
      ];
      gsap.set(cards, {
        x: 0,
        y: (index) => index * 5,
        rotation: (index) => (index - 1.5) * 1.2,
        scale: (index) => .92 - index * .018,
        zIndex: (index) => cards.length - index,
        force3D: true,
      });
      gsap.timeline({
        scrollTrigger: {
          trigger: deck,
          start: 'top top',
          end: '+=125%',
          pin: true,
          scrub: .72,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => transitionScene('work-intro', 1),
          onEnterBack: () => transitionScene('work-intro', -1),
          onToggle: (self) => document.documentElement.classList.toggle('project-motion-active', self.isActive),
        },
      })
        .fromTo('.project-deck__header span, .project-deck__header strong', { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, stagger: .08, duration: .2, ease: 'power2.out' }, 0)
        .to(cards, {
          x: (index) => destinations[index].x,
          y: (index) => destinations[index].y,
          rotation: (index) => destinations[index].rotation,
          scale: 1,
          stagger: .045,
          duration: .72,
          ease: 'power3.inOut',
          force3D: true,
        }, .08);
      return () => document.documentElement.classList.remove('project-motion-active');
    });

    mm.add('(pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const cleanups: Array<() => void> = [];
      root.querySelectorAll<HTMLElement>('.interactive-3d').forEach((surface) => {
        let frame = 0; let latest: PointerEvent | null = null;
        const move = (event: PointerEvent) => {
          latest = event;
          if (frame) return;
          frame = requestAnimationFrame(() => {
            frame = 0; if (!latest) return;
            const rect = surface.getBoundingClientRect(); const x = (latest.clientX - rect.left) / rect.width - .5; const y = (latest.clientY - rect.top) / rect.height - .5;
            surface.style.setProperty('--tilt-x', `${-y * 7}deg`); surface.style.setProperty('--tilt-y', `${x * 9}deg`); surface.style.setProperty('--light-x', `${(x + .5) * 100}%`); surface.style.setProperty('--light-y', `${(y + .5) * 100}%`);
          });
        };
        const leave = () => { cancelAnimationFrame(frame); frame = 0; latest = null; surface.style.setProperty('--tilt-x', '0deg'); surface.style.setProperty('--tilt-y', '0deg'); };
        surface.addEventListener('pointermove', move, { passive: true }); surface.addEventListener('pointerleave', leave);
        cleanups.push(() => { cancelAnimationFrame(frame); surface.removeEventListener('pointermove', move); surface.removeEventListener('pointerleave', leave); });
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    });
    return () => mm.revert();
  }, { scope: ref });

  return <div ref={ref} className="work">
    <section className="work-intro" data-scene="work-intro"><div className="work-intro__stage"><div className="work-intro__index"><span className="eyebrow">SELECTED WORK</span><h2>01—04</h2></div><p className="work-intro__copy">Four products across personal finance, market tools, mobile engineering, and accessible computing.</p><div className="work-intro__track"><span>WEB</span><span>MOBILE</span><span>PRODUCT</span><span>ACCESSIBILITY</span></div><div className="work-intro__rule"><span /></div></div></section>

    <section className="project-deck" aria-label="Interactive project archive">
      <header className="project-deck__header"><span>PROJECTS / 04</span><strong>SELECTED CASE STUDIES</strong></header>
      <div className="project-deck__cards">
        {works.map((item) => <button className={`project-card project-card--${item.key}`} key={item.key} onClick={() => openProject(item)} data-cursor="OPEN" aria-label={`Open ${item.title.replace('\n', ' ')} project`}>
          <span className="project-card__surface interactive-3d"><span className="project-card__index">{item.number}</span><span className="project-card__chapter">{item.chapter} / {item.eyebrow}</span><strong>{item.title.replace('\n', ' ')}</strong><span className="project-card__description">{item.description}</span><span className="project-card__action">VIEW PROJECT <ArrowUpRight size={13}/></span></span>
        </button>)}
      </div>
    </section>

    {activeProject && <div className={`project-focus project-focus--${activeProject.key}`} role="dialog" aria-modal="true" aria-label={`${activeProject.title.replace('\n', ' ')} project details`}>
      <button className="project-focus__close" onClick={closeProject} data-cursor="CLOSE" aria-label="Back to projects"><X size={18}/><span>BACK TO PROJECTS / ESC</span></button>
      <div className="project-focus__scroll">
        <header className="project-focus__header"><span>{activeProject.number} / {activeProject.chapter}</span><span>{activeProject.eyebrow}</span></header>
        <h2>{activeProject.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
        <div className="project-focus__layout">
          <aside><p>{activeProject.description}</p><div className="project__evidence">{projectEvidence[activeProject.key]?.map((point) => <span key={point}>{point}</span>)}</div><span>STACK / {activeProject.stack}</span><strong>{activeProject.outcome}</strong><div className="project-focus__links">{liveLinks[activeProject.key] && <a href={liveLinks[activeProject.key]} target="_blank" rel="noreferrer">LIVE SYSTEM <ArrowUpRight size={14}/></a>}<a href={activeProject.link} target="_blank" rel="noreferrer">REPOSITORY <ArrowUpRight size={14}/></a></div></aside>
          <div className="project-focus__media"><ProjectVisual kind={activeProject.key} label={activeProject.asset} detail={activeProject.detail}/><ProjectVisual kind={activeProject.key} secondary label={activeProject.detail} detail="secondary system feed"/></div>
        </div>
        {activeProject.key === 'stock-mobile' && <div className="project-focus__context"><span>PARALLEL CONTEXT / PLASTISENSE</span><p>Alongside the trading work, PlastiSense explored a hardware–software workflow for observing microplastics in water samples during Smart India Hackathon.</p><a href="https://github.com/veha2309/PlastiSense-Flutter/tree/master" target="_blank" rel="noreferrer">VIEW RESEARCH CONTEXT <ArrowUpRight size={14}/></a></div>}
        <button className="project-focus__back" onClick={closeProject}><span>RETURN TO ALL PROJECTS</span><ArrowUpRight size={18}/></button>
      </div>
    </div>}
  </div>;
}
