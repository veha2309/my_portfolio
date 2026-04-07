import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export default function HUD({ isLightMode = false, toggleTheme = () => {} }: { isLightMode?: boolean, toggleTheme?: () => void }) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const depth = (scrollY / 100).toFixed(1);

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {/* Scanline Overlay */}
      <div className={`absolute inset-0 scanline transition-opacity duration-1000 ${isLightMode ? 'opacity-5' : 'opacity-20'}`} />

      {/* Top Right: Theme Toggle (Phase Switcher) */}
      <div className="absolute top-10 right-10 pointer-events-auto">
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative group p-4 glass rounded-2xl border border-celestial-primary/20 hover:border-celestial-primary/50 transition-all overflow-hidden"
        >
          <div className="absolute inset-0 bg-celestial-primary/5 group-hover:bg-celestial-primary/10 transition-colors" />
          
          <AnimatePresence mode="wait">
            {isLightMode ? (
              <motion.div
                key="sun"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <Sun size={20} className="text-celestial-primary" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <Moon size={20} className="text-celestial-primary" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Decorative Corner Dots */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-celestial-primary/40 rounded-full" />
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-celestial-primary/40 rounded-full" />
        </motion.button>
      </div>

      {/* Top Left: System Identification */}
      <div className="absolute top-10 left-10 hidden lg:block">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-celestial-primary animate-pulse" />
            <span className="hud-text text-[10px] text-celestial-primary/80">System: {isLightMode ? 'Solar' : 'Stellar'} Mode</span>
          </div>
          <span className="hud-text text-[10px] text-celestial-text/40">ID: VS-PHASE-{isLightMode ? '02' : '01'}</span>
        </div>
      </div>

      {/* Bottom Right: Coordinates & Depth */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="flex flex-col items-end space-y-1">
          <span className="hud-text text-[10px] text-celestial-text/40 uppercase tracking-widest">Warp Factor</span>
          <div className="flex items-baseline space-x-1">
            <span className="hud-text text-xl text-celestial-primary">{depth}</span>
            <span className="hud-text text-[10px] text-celestial-primary/60">LY</span>
          </div>
        </div>
      </div>

      {/* Left Vertical Bar: Progress */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 w-[1px] h-32 bg-celestial-outline hidden xl:block">
        <motion.div 
          className="w-full bg-celestial-primary shadow-[0_0_10px_var(--primary)]"
          initial={{ height: 0 }}
          animate={{ height: `${Math.min((scrollY / 2000) * 100, 100)}%` }}
        />
        <div className="absolute top-0 -left-1 w-2 h-[1px] bg-celestial-outline" />
        <div className="absolute bottom-0 -left-1 w-2 h-[1px] bg-celestial-outline" />
      </div>

      {/* Decorative HUD Corners */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-celestial-outline/20 m-4 rounded-tl-3xl lg:block hidden transition-colors duration-1000" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-celestial-outline/20 m-4 rounded-br-3xl lg:block hidden transition-colors duration-1000" />
    </div>
  );
}
