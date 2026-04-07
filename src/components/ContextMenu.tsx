import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContextMenu() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // Auto-hide after 3 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsVisible(false), 3000);
    };

    const handleClick = () => setIsVisible(false);

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          style={{ 
            left: position.x, 
            top: position.y,
            position: 'fixed',
            zIndex: 10000 
          }}
          className="pointer-events-none"
        >
          <div className="bg-[#0c0e12]/95 border border-celestial-primary/40 p-4 rounded-xl shadow-[0_0_30px_rgba(0,229,255,0.2)] backdrop-blur-md relative overflow-hidden">
            {/* HUD Scanline */}
            <div className="absolute inset-0 scanline opacity-30" />
            
            {/* Message */}
            <p className="text-white text-sm whitespace-nowrap relative z-10">
              <span className="italic font-bold text-celestial-primary">"Kyu Krna h Right Click"</span>
            </p>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-celestial-primary/60" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-celestial-primary/60" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
