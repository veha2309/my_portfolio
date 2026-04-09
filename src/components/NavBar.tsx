import { useState, useEffect, useRef } from 'react';
import { Menu, X, Orbit, Sun, Moon } from 'lucide-react';
import { navigation } from '../data/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ isLightMode = false, toggleTheme = () => {} }: { isLightMode?: boolean, toggleTheme?: () => void }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
     const observer = new IntersectionObserver((entries) => {
       entries.forEach((entry) => {
         if (entry.isIntersecting && !isScrolling.current) {
           setActiveTab(entry.target.id);
         }
       });
     }, { threshold: 0.5 });

     const sections = document.querySelectorAll('section[id]');
     sections.forEach((section) => observer.observe(section));
     return () => observer.disconnect();
  }, []);

  const linkClass = (path: string, isMobile = false) => {
    const id = path === '/' ? 'home' : path.replace('/', '');
    const isActive = activeTab === id;
    const baseClasses = "relative px-4 py-2 rounded-full transition-all duration-300 text-sm font-medium tracking-widest uppercase";
    
    if (isActive) {
      return `${baseClasses} text-celestial-primary text-glow ${isMobile ? 'bg-celestial-primary/10 glow-primary' : ''}`;
    }
    return `${baseClasses} text-celestial-text/40 hover:text-celestial-text hover:bg-celestial-primary/5`;
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    const id = path === '/' ? 'home' : path.replace('/', '');
    
    setActiveTab(id);
    isScrolling.current = true;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isScrolling.current = false;
    }, 1000); // Lock observer during smooth scroll

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-4xl transition-all duration-500">
      <div className="glass rounded-full px-6 py-3 border border-celestial-outline flex justify-between items-center bg-[var(--surface)]/40 shadow-2xl">
        <a href="#home" onClick={(e) => handleLinkClick(e, '/')} className="flex items-center space-x-2 group">
          <div className="p-2 bg-celestial-primary/20 rounded-lg group-hover:bg-celestial-primary/30 transition-colors">
             <Orbit size={20} className="text-celestial-primary animate-pulse" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-celestial-text group-hover:text-celestial-primary transition-colors">
            PORTFOLIO<span className="text-celestial-primary">.</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-2 bg-white/5 p-1 rounded-full border border-white/5">
          {navigation.map((item) => {
            const id = item.path === '/' ? 'home' : item.path.replace('/', '');
            const isActive = activeTab === id;
            return (
              <a 
                key={item.path} 
                href={`#${id}`} 
                onClick={(e) => handleLinkClick(e, item.path)}
                className={linkClass(item.path, false)}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-celestial-primary/10 glow-primary rounded-full border border-celestial-primary/20"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </a>
            );
          })}
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center space-x-2">
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-celestial-primary"
          >
            {isLightMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          <button
            onClick={() => setOpen((p) => !p)}
            className="p-2 text-celestial-text/60 hover:text-celestial-primary transition-colors"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-full left-0 right-0 mt-4 mx-2 rounded-2xl p-4 border border-celestial-primary/20 shadow-2xl"
            style={{ backgroundColor: 'var(--surface)', backdropFilter: 'blur(20px)' }}
          >
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const id = item.path === '/' ? 'home' : item.path.replace('/', '');
                return (
                  <a 
                    key={item.path} 
                    href={`#${id}`}
                    onClick={(e) => handleLinkClick(e, item.path)}
                    className={`${linkClass(item.path, true)} block w-full text-center py-4`}
                  >
                    {item.name}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
