import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Award, Briefcase, Gamepad2, GitBranch, Mail, Map, Power, Sparkles, User, Volume2, VolumeX, X } from 'lucide-react';
import { gameAchievements, gameExperience, gameMissions, gameProfile, gameSkills } from './data/gameData';
import type { GameMission, GameScreen } from './gameMode.types';
import './game-mode.css';

type Props = { onExit: (targetId?: string) => void };
type SoundCue = 'navigate' | 'select' | 'back' | 'power';

let gameAudioContext: AudioContext | null = null;
const loadVisitedMissions = () => {
  try { return new Set(JSON.parse(localStorage.getItem('game-visited-missions') || '[]') as string[]); }
  catch { return new Set<string>(); }
};

const bootLines = ['INITIALIZING PLAYER PROFILE...', 'LOADING PROJECT ARCHIVE...', 'CALIBRATING SKILL MATRIX...', 'SYNCING EXPERIENCE DATA...', 'GAME MODE ONLINE'];
const identityCommands = [
  { command: 'whoami', response: 'vedant_shukla // creative technologist' },
  { command: 'stack --active', response: 'react · typescript · flutter · node' },
  { command: 'systems --scan', response: '04 missions indexed // integrity 100%' },
  { command: 'git status --short', response: 'M ideas/next-interface.tsx' },
  { command: 'npm run imagine', response: 'building useful things from complexity...' },
  { command: 'deploy --target future', response: 'channel open // ready for collaboration' },
];
const menu: Array<{ screen: GameScreen | 'exit'; label: string; code: string; description: string }> = [
  { screen: 'missions', label: 'CONTINUE', code: '01', description: 'Resume at the project mission archive.' },
  { screen: 'profile', label: 'PLAYER PROFILE', code: '02', description: 'Identity, specialization, and capability tiers.' },
  { screen: 'skills', label: 'SKILL TREE', code: '03', description: 'Explore the technologies connected across shipped systems.' },
  { screen: 'experience', label: 'EXPERIENCE LOG', code: '04', description: 'Open the chronological professional record.' },
  { screen: 'achievements', label: 'ACHIEVEMENTS', code: '05', description: 'Real engineering milestones validated by portfolio work.' },
  { screen: 'contact', label: 'CONTACT TERMINAL', code: '06', description: 'Open a direct communication channel.' },
  { screen: 'exit', label: 'EXIT GAME MODE', code: '07', description: 'Save preferences and return to the exact portfolio state.' },
];

export default function GameModeRoot({ onExit }: Props) {
  const [booting, setBooting] = useState(true);
  const [bootStep, setBootStep] = useState(0);
  const [screen, setScreen] = useState<GameScreen>(() => (sessionStorage.getItem('game-last-screen') as GameScreen) || 'home');
  const [selected, setSelected] = useState(0);
  const [mission, setMission] = useState<GameMission | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem('game-sound') === 'on');
  const [reducedEffects, setReducedEffects] = useState(() => localStorage.getItem('game-effects') === 'reduced' || matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visitedMissions, setVisitedMissions] = useState<Set<string>>(loadVisitedMissions);
  const [showTutorial, setShowTutorial] = useState(() => localStorage.getItem('game-tutorial-seen') !== 'yes');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gameRootRef = useRef<HTMLDivElement>(null);

  const playSound = useCallback((cue: SoundCue, force = false) => {
    if (!soundEnabled && !force) return;
    try {
      const context = gameAudioContext ?? new AudioContext();
      gameAudioContext = context;
      if (context.state === 'suspended') void context.resume();
      const tones: Record<SoundCue, [number, number, OscillatorType]> = {
        navigate: [330, .045, 'sine'], select: [620, .09, 'triangle'], back: [230, .08, 'sine'], power: [820, .14, 'triangle'],
      };
      const [frequency, duration, type] = tones[cue];
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      if (cue === 'select' || cue === 'power') oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.45, context.currentTime + duration);
      if (cue === 'back') oscillator.frequency.exponentialRampToValueAtTime(frequency * .65, context.currentTime + duration);
      gain.gain.setValueAtTime(.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(cue === 'navigate' ? .022 : .04, context.currentTime + .008);
      gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + duration);
      oscillator.connect(gain); gain.connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + duration + .01);
    } catch { /* Audio remains optional when the browser blocks Web Audio. */ }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    if (soundEnabled) { playSound('back'); setSoundEnabled(false); }
    else { setSoundEnabled(true); playSound('power', true); }
  }, [playSound, soundEnabled]);

  useEffect(() => {
    if (!booting) return;
    const interval = window.setInterval(() => setBootStep((step) => Math.min(step + 1, bootLines.length - 1)), 260);
    const timer = window.setTimeout(() => setBooting(false), reducedEffects ? 450 : 1650);
    return () => { window.clearInterval(interval); window.clearTimeout(timer); };
  }, [booting, reducedEffects]);

  useEffect(() => {
    sessionStorage.setItem('game-last-screen', screen);
    headingRef.current?.focus();
  }, [screen]);

  useEffect(() => {
    localStorage.setItem('game-sound', soundEnabled ? 'on' : 'off');
    localStorage.setItem('game-effects', reducedEffects ? 'reduced' : 'full');
  }, [soundEnabled, reducedEffects]);

  const selectMenuItem = useCallback((index: number) => {
    const item = menu[index];
    playSound(item.screen === 'exit' ? 'back' : 'select');
    if (item.screen === 'exit') onExit(); else setScreen(item.screen);
  }, [onExit, playSound]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (booting) {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setBooting(false); }
        if (event.key === 'Escape') onExit();
        return;
      }
      if (screen === 'home') {
        if (['ArrowDown', 's', 'S'].includes(event.key)) { event.preventDefault(); playSound('navigate'); setSelected((value) => (value + 1) % menu.length); }
        if (['ArrowUp', 'w', 'W'].includes(event.key)) { event.preventDefault(); playSound('navigate'); setSelected((value) => (value - 1 + menu.length) % menu.length); }
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectMenuItem(selected); }
        if (event.key === 'Escape') onExit();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        if (screen === 'mission-detail') { setMission(null); setScreen('missions'); } else setScreen('home');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [booting, screen, selected, onExit, playSound, selectMenuItem]);

  useEffect(() => {
    const root = gameRootRef.current;
    if (!root || booting || reducedEffects || screen === 'achievements' || !matchMedia('(pointer: fine)').matches) return;
    let active: HTMLElement | null = null;
    const reset = (element: HTMLElement | null) => {
      element?.style.setProperty('--gm-rx', '0deg'); element?.style.setProperty('--gm-ry', '0deg');
      element?.style.setProperty('--gm-light-x', '50%'); element?.style.setProperty('--gm-light-y', '50%');
    };
    const move = (event: PointerEvent) => {
      const element = (event.target as HTMLElement).closest<HTMLElement>('.game-panel,.game-context');
      if (element !== active) { reset(active); active = element; }
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5; const y = (event.clientY - rect.top) / rect.height - .5;
      element.style.setProperty('--gm-rx', `${-y * 5}deg`); element.style.setProperty('--gm-ry', `${x * 7}deg`);
      element.style.setProperty('--gm-light-x', `${(x + .5) * 100}%`); element.style.setProperty('--gm-light-y', `${(y + .5) * 100}%`);
    };
    const leave = () => { reset(active); active = null; };
    root.addEventListener('pointermove', move, { passive: true }); root.addEventListener('pointerleave', leave);
    return () => { root.removeEventListener('pointermove', move); root.removeEventListener('pointerleave', leave); reset(active); };
  }, [booting, reducedEffects, screen]);

  const currentArea = useMemo(() => screen.replace('-', ' ').toUpperCase(), [screen]);
  const goBack = () => { playSound('back'); if (screen === 'mission-detail') { setMission(null); setScreen('missions'); } else setScreen('home'); };
  const navigateTo = (target: GameScreen) => { playSound('navigate'); setMission(null); setScreen(target); };
  const openMission = (item: GameMission) => {
    playSound('select'); setMission(item); setScreen('mission-detail');
    setVisitedMissions((current) => { const next = new Set(current).add(item.id); localStorage.setItem('game-visited-missions', JSON.stringify([...next])); return next; });
  };
  const dismissTutorial = () => { localStorage.setItem('game-tutorial-seen', 'yes'); setShowTutorial(false); playSound('select'); };

  if (booting) return <div className={`game-mode game-mode--boot ${reducedEffects ? 'game-mode--reduced' : ''}`} role="dialog" aria-modal="true" aria-label="Game Mode boot sequence">
    <div className="game-scan"/><div className="game-boot__mark"><Gamepad2 size={24}/><span>VS / GAME SYSTEM</span></div><div className="game-boot__terminal">{bootLines.slice(0, bootStep + 1).map((line, index) => <p className={index === bootStep ? 'is-current' : ''} key={line}><span>{String(index + 1).padStart(2, '0')}</span>{line}</p>)}</div><div className="game-boot__progress"><i style={{ transform: `scaleX(${(bootStep + 1) / bootLines.length})` }}/></div><button className="game-boot__skip" onClick={() => setBooting(false)}>SKIP / ENTER</button><button className="game-boot__cancel" onClick={() => onExit()} aria-label="Cancel Game Mode"><X size={18}/></button>
  </div>;

  return <div ref={gameRootRef} className={`game-mode game-mode--${screen} ${reducedEffects ? 'game-mode--reduced' : ''}`} role="dialog" aria-modal="true" aria-label="Vedant Shukla Game Mode" data-lenis-prevent>
    <div className="game-grid" aria-hidden="true"/><div className="game-radar" aria-hidden="true"/><div className="game-scanlines" aria-hidden="true"/>
    <header className="game-hud"><div><Gamepad2 size={14}/><span>PLAYER / VEDANT</span></div><span>AREA / {currentArea}</span><span>DISCOVERED / {visitedMissions.size}/{gameMissions.length}</span><div className="game-hud__controls"><button onClick={toggleSound} aria-pressed={soundEnabled} aria-label={`${soundEnabled ? 'Mute' : 'Enable'} game interface sound`}>{soundEnabled ? <Volume2 size={14}/> : <VolumeX size={14}/>}</button><button className={reducedEffects ? '' : 'is-active'} onClick={() => { playSound('navigate'); setReducedEffects((value) => !value); }} aria-pressed={!reducedEffects} aria-label="Toggle interface visual effects"><Sparkles size={15}/></button><button onClick={() => { playSound('back'); onExit(); }}><Power size={14}/><span>EXIT</span></button></div></header>

    <nav className="game-spatial-nav" aria-label="Game Mode system map">
      <button className={screen === 'home' ? 'is-active' : ''} onClick={() => navigateTo('home')} aria-label="Identity core"><User size={14}/><span>CORE</span></button>
      <button className={screen === 'missions' || screen === 'mission-detail' ? 'is-active' : ''} onClick={() => navigateTo('missions')} aria-label="Mission archive"><Map size={14}/><span>MISSIONS</span></button>
      <button className={screen === 'skills' ? 'is-active' : ''} onClick={() => navigateTo('skills')} aria-label="Skill network"><GitBranch size={14}/><span>SKILLS</span></button>
      <button className={screen === 'experience' ? 'is-active' : ''} onClick={() => navigateTo('experience')} aria-label="Experience logs"><Briefcase size={14}/><span>LOGS</span></button>
      <button className={screen === 'achievements' ? 'is-active' : ''} onClick={() => navigateTo('achievements')} aria-label="Achievements"><Award size={14}/><span>RECORD</span></button>
      <button className={screen === 'contact' ? 'is-active' : ''} onClick={() => navigateTo('contact')} aria-label="Contact channel"><Mail size={14}/><span>CONTACT</span></button>
    </nav>

    <main className="game-stage" data-screen={screen} data-lenis-prevent tabIndex={-1}>
      {screen !== 'home' && <button className="game-back" onClick={goBack}><ArrowLeft size={14}/> BACK / ESC</button>}
      {screen === 'home' && <section className="game-home"><div className="game-player-card"><span>PLAYER PROFILE / LIVE SHELL</span><TerminalIdentity/><h1 ref={headingRef} tabIndex={-1}>{gameProfile.name}</h1><p>{gameProfile.role}<br/>{gameProfile.specialization}</p><b>SYSTEM STATUS / ONLINE <i/></b></div><div className="game-menu" role="menu" aria-label="Game Mode main menu">{menu.map((item, index) => <button role="menuitem" className={selected === index ? 'is-selected' : ''} onMouseEnter={() => { if (selected !== index) playSound('navigate'); setSelected(index); }} onFocus={() => setSelected(index)} onClick={() => selectMenuItem(index)} key={item.code}><span>{item.code}</span><i>{selected === index ? '▶' : '·'}</i><strong>{item.label}</strong></button>)}</div><aside className="game-context"><span>SELECTED COMMAND</span><strong>{menu[selected].label}</strong><p>{menu[selected].description}</p><small>ARROWS / W S — NAVIGATE<br/>ENTER — SELECT<br/>ESC — EXIT</small></aside>{showTutorial && <aside className="game-tutorial"><span>FIRST CONNECTION / CONTROL BRIEF</span><strong>EXPLORE THE SYSTEM</strong><p>Use the system map to move between areas. Scroll inside every archive, select missions to record discovery, and press Escape to return.</p><button onClick={dismissTutorial}>ACKNOWLEDGE / BEGIN</button></aside>}</section>}

      {screen === 'profile' && <section className="game-screen game-profile"><GameTitle ref={headingRef} code="PLAYER / 01" title="Identity Core"/><div className="game-profile__layout"><TerminalIdentity expanded/><div className="game-panel"><DataRow label="PLAYER" value={gameProfile.name}/><DataRow label="CLASS" value={gameProfile.role}/><DataRow label="SPECIALIZATION" value={gameProfile.specialization}/><DataRow label="LOCATION" value={gameProfile.location}/><DataRow label="STATUS" value={gameProfile.status}/></div><div className="game-panel game-tiers"><span>CAPABILITY TIERS</span>{Object.keys(gameSkills).map((category, index) => <div key={category}><b>{category}</b><em>{index === 0 ? 'CORE' : index < 3 ? 'ADVANCED' : 'ACTIVE'}</em></div>)}</div></div></section>}

      {screen === 'missions' && <section className="game-screen game-missions"><GameTitle ref={headingRef} code="ARCHIVE / 02" title="Project Missions"/><div className="mission-map">{gameMissions.map((item, index) => <button className={`mission-node ${visitedMissions.has(item.id) ? 'is-discovered' : ''}`} style={{ '--node': index } as React.CSSProperties} onClick={() => openMission(item)} key={item.id}><span>MISSION {String(index + 1).padStart(2, '0')}</span><strong>{item.title}</strong><em>{visitedMissions.has(item.id) ? 'DISCOVERED' : item.state}</em><i/></button>)}</div><p className="game-screen__hint">SELECT A NODE TO OPEN MISSION INTELLIGENCE / {visitedMissions.size} OF {gameMissions.length} DISCOVERED</p></section>}

      {screen === 'mission-detail' && mission && <section className="game-screen game-mission-detail"><GameTitle ref={headingRef} code={mission.id.toUpperCase()} title={mission.title}/><div className="game-mission-detail__grid"><div className="game-panel"><DataRow label="TYPE" value={mission.type}/><DataRow label="STATUS" value={mission.state}/><DataRow label="TECH" value={mission.tech.join(' / ')}/><p>{mission.objective}</p></div><div className="game-panel game-objectives"><span>MISSION INTELLIGENCE</span>{mission.points.map((point, index) => <p key={point}><b>{String(index + 1).padStart(2, '0')}</b>{point}</p>)}</div></div><div className="game-actions">{mission.live && <a href={mission.live} target="_blank" rel="noreferrer">LAUNCH LIVE SYSTEM <ArrowUpRight size={14}/></a>}{mission.github && <a href={mission.github} target="_blank" rel="noreferrer">OPEN SOURCE ARCHIVE <ArrowUpRight size={14}/></a>}<button onClick={() => onExit('projects')}>ENTER STANDARD PROJECT ARCHIVE <ArrowUpRight size={14}/></button></div></section>}

      {screen === 'skills' && <section className="game-screen game-skills"><GameTitle ref={headingRef} code="MATRIX / 03" title="Skill Tree"/><div className="skill-tree">{Object.entries(gameSkills).map(([category, entries], branch) => <div className="skill-branch game-panel" key={category}><span>BRANCH {String(branch + 1).padStart(2, '0')}</span><h3>{category}</h3><div>{entries.map((skill, index) => <button key={skill}><i/><strong>{skill}</strong><em>{index < 2 ? 'CORE' : 'VALIDATED'}</em></button>)}</div></div>)}</div></section>}

      {screen === 'experience' && <section className="game-screen game-experience"><GameTitle ref={headingRef} code="SAVE LOG / 04" title="Experience Log"/><div className="experience-log">{gameExperience.map((entry, index) => <article className="game-panel" key={`${entry.company}-${entry.role}`}><span>LOG ENTRY {String(index + 1).padStart(2, '0')} / {entry.period}</span><h3>{entry.role}</h3><b>{entry.company}</b>{entry.responsibilities.map((item) => <p key={item}>{item}</p>)}</article>)}</div></section>}

      {screen === 'achievements' && <section className="game-screen game-achievements"><GameTitle ref={headingRef} code="RECORD / 05" title="Achievements"/><div className="achievement-grid">{gameAchievements.map((item, index) => <article className="game-panel" style={{ '--achievement': index } as React.CSSProperties} key={item.title}><span>UNLOCK {String(index + 1).padStart(2, '0')} / VERIFIED</span><i>◇</i><h3>{item.title}</h3><p>{item.detail}</p></article>)}</div></section>}

      {screen === 'contact' && <section className="game-screen game-contact"><GameTitle ref={headingRef} code="CHANNEL / 06" title="Contact Terminal"/><div className="game-contact__terminal game-panel"><span>COMMUNICATION CHANNEL</span><DataRow label="STATUS" value="OPEN"/><DataRow label="DESTINATION" value="VEDANT SHUKLA"/><DataRow label="LOCATION" value="DELHI, INDIA"/><p>No automated submission is simulated. Choose a verified external channel below.</p><div className="game-actions"><a href="mailto:448vedantshukla@gmail.com">EMAIL CHANNEL <ArrowUpRight size={14}/></a><a href="https://github.com/veha2309" target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={14}/></a><a href="https://linkedin.com/in/vedant-shukla-79a6342b1" target="_blank" rel="noreferrer">LINKEDIN <ArrowUpRight size={14}/></a></div></div></section>}
    </main>
    <footer className="game-footer"><span>GAME MODE / OPTIONAL INTERFACE</span><span>{reducedEffects ? 'EFFECTS / REDUCED' : 'EFFECTS / FULL'}</span><span>SOUND / {soundEnabled ? 'ARMED' : 'MUTED'}</span></footer>
  </div>;
}

function GameTitle({ code, title, ref }: { code: string; title: string; ref: React.Ref<HTMLHeadingElement> }) {
  return <header className="game-title"><span>{code}</span><h2 ref={ref} tabIndex={-1}>{title}</h2><i/></header>;
}

function DataRow({ label, value }: { label: string; value: string }) {
  return <div className="game-data-row"><span>{label}</span><strong>{value}</strong><i/></div>;
}

function TerminalIdentity({ expanded = false }: { expanded?: boolean }) {
  return <div className={`game-terminal-identity ${expanded ? 'game-terminal-identity--expanded' : ''}`} role="img" aria-label="Animated developer command terminal">
    <div className="game-terminal-identity__bar"><span><i/><i/><i/></span><b>root@vedant:~/portfolio</b><em>LIVE</em></div>
    <div className="game-terminal-identity__body">
      {identityCommands.map((line, index) => <div className="game-command" style={{ '--line': index } as React.CSSProperties} key={line.command}><p><span>❯</span> {line.command}</p><code>{line.response}</code></div>)}
      <p className="game-terminal-identity__input"><span>❯</span><i/></p>
    </div>
    <div className="game-terminal-identity__telemetry" aria-hidden="true"><span>CPU<br/><b>18%</b></span><span>MEM<br/><b>42%</b></span><span>NET<br/><b>8ms</b></span></div>
  </div>;
}
