import { useEffect, useRef } from 'react';

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);
  
  const mouse = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 }); // Actually this is for interpolation, but I'm not using it yet. Let's remove if unused. Or no, I'll use it for even smoother ring. Wait, I'll just remove to fix lint.
  const infoPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const target = e.target as HTMLElement;
      const isHovering = !!target.closest('a, button, [role="button"], .glass, article');
      
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`;
        ringRef.current.style.borderColor = isHovering ? 'rgba(0, 229, 255, 0.8)' : 'rgba(0, 229, 255, 0.2)';
      }
    };

    const animate = () => {
      // Smooth interpolation for the info HUD
      infoPos.current.x += (mouse.current.x - infoPos.current.x) * 0.15;
      infoPos.current.y += (mouse.current.y - infoPos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      if (infoRef.current) {
        infoRef.current.style.transform = `translate3d(${infoPos.current.x}px, ${infoPos.current.y}px, 0)`;
      }

      if (coordRef.current) {
        coordRef.current.textContent = `${Math.floor(mouse.current.x)},${Math.floor(mouse.current.y)}`;
      }

      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    window.addEventListener('mousemove', moveMouse);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', moveMouse);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Outer Tech Ring - Direct DOM Injection */}
      <div
        ref={ringRef}
        className="absolute w-10 h-10 border rounded-full flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ willChange: 'transform' }}
      >
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-celestial-primary" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-celestial-primary" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-celestial-primary" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-celestial-primary" />
      </div>

      {/* Crosshair Dot */}
      <div
        ref={dotRef}
        className="absolute w-1.5 h-1.5 bg-celestial-primary rounded-full shadow-[0_0_10px_var(--primary)]"
        style={{ willChange: 'transform' }}
      />

      {/* Tracking Info HUD - Smooth Lag Effect */}
      <div
        ref={infoRef}
        className="absolute ml-8 mt-6 pointer-events-none hidden lg:block"
        style={{ willChange: 'transform' }}
      >
        <div className="flex flex-col space-y-0.5 hud-text font-mono text-[8px] tracking-[0.2em] text-celestial-primary opacity-60">
          <div className="flex space-x-2">
            <span className="opacity-50">ST_TRK:</span>
            <span>READY</span>
          </div>
          <div className="flex space-x-2">
            <span className="opacity-50">CO_ORD:</span>
            <span ref={coordRef}>0,0</span>
          </div>
        </div>
      </div>

      {/* Full-screen Scan Lines */}
      <div className="absolute inset-0 scanline opacity-5" />
    </div>
  );
}
