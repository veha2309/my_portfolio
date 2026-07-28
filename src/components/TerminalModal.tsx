import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, CornerDownLeft, Sparkles } from 'lucide-react';
import { projects } from '../data/project';
import { skills } from '../data/skills';

interface TerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme?: () => void;
  isLightMode?: boolean;
}

interface CommandLog {
  id: string;
  command: string;
  output: React.ReactNode;
  isError?: boolean;
}

const COMMANDS = ['help', 'about', 'skills', 'projects', 'contact', 'theme', 'matrix', 'clear', 'sudo'];

export default function TerminalModal({ isOpen, onClose, toggleTheme, isLightMode }: TerminalModalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 'init-1',
      command: 'sys.init',
      output: (
        <div className="space-y-1 text-xs font-mono">
          <p className="text-celestial-primary font-bold">AETHEL-OS CLI v2.0.4 [Spatial Command Shell]</p>
          <p className="text-celestial-text/60">Type <span className="text-celestial-primary font-bold">help</span> to view available system commands or click suggested commands below.</p>
        </div>
      ),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    let outputNode: React.ReactNode = null;
    let isErr = false;

    switch (trimmed) {
      case 'help':
        outputNode = (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono py-1">
            <div className="flex space-x-2"><span className="text-celestial-primary font-bold w-20">help</span><span className="text-celestial-text/60">Show this command registry</span></div>
            <div className="flex space-x-2"><span className="text-celestial-primary font-bold w-20">about</span><span className="text-celestial-text/60">View Vedant's engineering profile</span></div>
            <div className="flex space-x-2"><span className="text-celestial-primary font-bold w-20">skills</span><span className="text-celestial-text/60">List tech stack breakdown</span></div>
            <div className="flex space-x-2"><span className="text-celestial-primary font-bold w-20">projects</span><span className="text-celestial-text/60">Inspect featured portfolio projects</span></div>
            <div className="flex space-x-2"><span className="text-celestial-primary font-bold w-20">contact</span><span className="text-celestial-text/60">Display email & social links</span></div>
            <div className="flex space-x-2"><span className="text-celestial-primary font-bold w-20">theme</span><span className="text-celestial-text/60">Toggle Light / Dark mode</span></div>
            <div className="flex space-x-2"><span className="text-celestial-primary font-bold w-20">matrix</span><span className="text-celestial-text/60">Initialize digital stream preview</span></div>
            <div className="flex space-x-2"><span className="text-celestial-primary font-bold w-20">clear</span><span className="text-celestial-text/60">Flush terminal buffer</span></div>
            <div className="flex space-x-2"><span className="text-celestial-primary font-bold w-20">sudo</span><span className="text-celestial-text/60">Execute root privileges</span></div>
          </div>
        );
        break;

      case 'about':
        outputNode = (
          <div className="space-y-2 text-xs font-mono text-celestial-text/80 py-1">
            <p className="text-celestial-primary font-bold">NAME: Vedant Shukla</p>
            <p>ROLE: CSE Student & Full-Stack Architect (MERN, Next.js, Flutter)</p>
            <p>DEGREE: BTech Computer Science Engineering (Dr. Akhilesh Das Gupta ITM, 2023 - 2027)</p>
            <p>CGPA: 7.8 / 10.0 (up to 5th semester)</p>
            <p className="text-celestial-text/60 leading-relaxed">
              Engineers high-performance web applications, mobile apps, and real-time backend systems using modern AI-accelerated workflows.
            </p>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="space-y-3 text-xs font-mono py-1">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="space-y-1">
                <span className="text-celestial-primary font-bold uppercase tracking-wider text-[10px] block">
                  [{category}]
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <span key={item} className="px-2 py-0.5 bg-celestial-primary/10 border border-celestial-primary/20 rounded text-[11px] text-celestial-text">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        outputNode = (
          <div className="space-y-3 text-xs font-mono py-1">
            {projects.map((p, idx) => (
              <div key={p.title} className="p-2 border border-celestial-primary/20 rounded bg-celestial-primary/5 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-celestial-primary">#{idx + 1} {p.title}</span>
                  {p.live && p.live !== '#' && (
                    <a href={p.live} target="_blank" rel="noreferrer" className="text-[10px] text-celestial-primary hover:underline">
                      [LIVE DEMO]
                    </a>
                  )}
                </div>
                <p className="text-celestial-text/70">{p.description}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {p.tech.map((t) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.2 bg-celestial-outline/30 text-celestial-text/60 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="space-y-1.5 text-xs font-mono py-1">
            <p><span className="text-celestial-primary font-bold">EMAIL:</span> <a href="mailto:448vedantshukla@gmail.com" className="hover:underline text-celestial-text">448vedantshukla@gmail.com</a></p>
            <p><span className="text-celestial-primary font-bold">GITHUB:</span> <a href="https://github.com/veha2309" target="_blank" rel="noreferrer" className="hover:underline text-celestial-text">github.com/veha2309</a></p>
            <p><span className="text-celestial-primary font-bold">LINKEDIN:</span> <a href="https://linkedin.com/in/vedant-shukla-79a6342b1" target="_blank" rel="noreferrer" className="hover:underline text-celestial-text">linkedin.com/in/vedant-shukla-79a6342b1</a></p>
          </div>
        );
        break;

      case 'theme':
        toggleTheme?.();
        outputNode = (
          <div className="text-xs font-mono text-celestial-primary py-1">
            System theme toggled to: <span className="font-bold">{isLightMode ? 'Stellar Dark Mode' : 'Solar Light Mode'}</span>
          </div>
        );
        break;

      case 'matrix':
        outputNode = (
          <div className="text-xs font-mono text-emerald-400 animate-pulse py-1 space-y-1">
            <p>01000001 01000101 01010100 01001000 01000101 01001100 00101101 01001111 01010011</p>
            <p>INITIALIZING HIGH-PRECISION SPATIAL QUANTUM MATRIX NODE...</p>
            <p className="text-emerald-300 font-bold">[ACCESS GRANTED] All visual telemetry operational at 60 FPS.</p>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      case 'sudo':
        isErr = true;
        outputNode = (
          <div className="text-xs font-mono text-rose-400 py-1 font-bold">
            [ACCESS DENIED] User is not in the sudoers file. Incident reported to Vedant Shukla.
          </div>
        );
        break;

      default:
        isErr = true;
        outputNode = (
          <div className="text-xs font-mono text-rose-400 py-1">
            Command not recognized: <span className="font-bold">"{trimmed}"</span>. Type <span className="text-celestial-primary underline cursor-pointer" onClick={() => handleCommand('help')}>help</span> for command list.
          </div>
        );
        break;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        command: trimmed,
        output: outputNode,
        isError: isErr,
      },
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMANDS.find((c) => c.startsWith(input.toLowerCase()));
      if (match) setInput(match);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl bg-[var(--surface)]/95 border border-celestial-primary/40 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden flex flex-col h-[520px] z-10"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-celestial-primary/10 border-b border-celestial-primary/20 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal size={16} className="text-celestial-primary animate-pulse" />
                <span className="hud-text text-xs font-bold text-celestial-primary tracking-widest">
                  AETHEL-OS // INTERACTIVE SHELL
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded text-celestial-text/60 hover:text-celestial-primary hover:bg-celestial-primary/10 transition-colors"
                aria-label="Close terminal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quick Command Suggestions */}
            <div className="px-4 py-2 bg-black/40 border-b border-celestial-outline/30 flex items-center space-x-2 overflow-x-auto">
              <span className="text-[10px] font-mono text-celestial-text/40 shrink-0 uppercase tracking-widest flex items-center">
                <Sparkles size={10} className="mr-1 text-celestial-primary" /> Suggestions:
              </span>
              {COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleCommand(cmd)}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-celestial-primary/10 text-celestial-primary border border-celestial-primary/20 hover:bg-celestial-primary/20 transition-all shrink-0"
                >
                  {cmd}
                </button>
              ))}
            </div>

            {/* Terminal Screen Output */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono select-text scanline">
              {history.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-celestial-primary font-bold">visitor@vedant-os:~$</span>
                    <span className="text-celestial-text">{item.command}</span>
                  </div>
                  <div className="pl-4">{item.output}</div>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Command Prompt Input */}
            <div className="p-3 bg-black/60 border-t border-celestial-primary/20 flex items-center space-x-2">
              <span className="text-xs font-mono font-bold text-celestial-primary shrink-0">visitor@vedant-os:~$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command (e.g. help, projects, skills)..."
                className="flex-1 bg-transparent text-xs font-mono text-celestial-text focus:outline-none placeholder:text-celestial-text/30"
              />
              <button
                onClick={() => handleCommand(input)}
                className="p-1.5 rounded bg-celestial-primary/20 text-celestial-primary hover:bg-celestial-primary/30 transition-colors"
                aria-label="Execute command"
              >
                <CornerDownLeft size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
