import { useEffect, useRef } from 'react';

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLSpanElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const ringScale = useRef(1);
  const infoPos = useRef({ x: 0, y: 0 });
  const isHovering = useRef(false);
  const isPressed = useRef(false);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const target = e.target as HTMLElement;
      isHovering.current = !!target.closest('a, button, [role="button"], .glass, article');
    };

    const handleDown = () => isPressed.current = true;
    const handleUp = () => isPressed.current = false;

    const animate = () => {
      // Smoother interpolation for position (0.15 for more liquid feel)
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.15;

      // Smoother interpolation for scale
      const targetScale = isHovering.current ? (isPressed.current ? 1.2 : 1.5) : (isPressed.current ? 0.8 : 1);
      ringScale.current += (targetScale - ringScale.current) * 0.15;

      // Even smoother interpolation for the info HUD
      infoPos.current.x += (mouse.current.x - infoPos.current.x) * 0.1;
      infoPos.current.y += (mouse.current.y - infoPos.current.y) * 0.1;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%) scale(${ringScale.current})`;
        ringRef.current.style.borderColor = isHovering.current ? 'rgba(0, 229, 255, 0.8)' : 'rgba(0, 229, 255, 0.2)';
        ringRef.current.style.backgroundColor = isPressed.current ? 'rgba(0, 229, 255, 0.25)' : 'transparent';
        ringRef.current.style.boxShadow = isPressed.current ? '0 0 40px rgba(0, 229, 255, 0.4), inset 0 0 20px rgba(0, 229, 255, 0.2)' : 'none';
      }

      if (dotRef.current) {
        const dotScale = isPressed.current ? 1.8 : 1;
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
        
        // Multi-layered bloom effect for the dot
        const dotGlow = isPressed.current 
          ? '0 0 30px 5px rgba(0, 229, 255, 0.8), 0 0 10px rgba(0, 229, 255, 1)' 
          : '0 0 10px rgba(0, 229, 255, 0.4)';
        dotRef.current.style.boxShadow = dotGlow;
      }
      
      if (infoRef.current) {
        infoRef.current.style.transform = `translate3d(${infoPos.current.x}px, ${infoPos.current.y}px, 0)`;
        infoRef.current.style.opacity = isPressed.current ? '1' : '0.6';
      }

      if (coordRef.current) {
        coordRef.current.textContent = `${Math.floor(mouse.current.x)},${Math.floor(mouse.current.y)}`;
      }

      requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    window.addEventListener('mousemove', moveMouse);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Outer Tech Ring - Direct DOM Injection */}
      <div
        ref={ringRef}
        className="absolute w-10 h-10 border rounded-full flex items-center justify-center transition-[border-color,background-color] duration-500 ease-out"
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
        className="absolute w-1.5 h-1.5 bg-celestial-primary rounded-full transition-[box-shadow,transform] duration-300 ease-out"
        style={{ willChange: 'transform' }}
      />

      {/* Tracking Info HUD - Smooth Lag Effect */}
      <div
        ref={infoRef}
        className="absolute ml-8 mt-6 pointer-events-none hidden lg:block transition-opacity duration-500 ease-out"
        style={{ willChange: 'transform' }}
      >
        <div className="flex flex-col space-y-0.5 hud-text font-mono text-[8px] tracking-[0.2em] text-celestial-primary">
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
