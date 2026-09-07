import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<'DEFAULT' | 'VIEW' | 'PLAY' | 'EXPLORE' | 'DRAG' | 'ENQUIRE'>('DEFAULT');
  const [visible, setVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if touch device or reduced motion
    const touchMedia = window.matchMedia('(pointer: coarse)');
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (touchMedia.matches || motionMedia.matches) {
      setIsTouch(true);
      return;
    }

    document.documentElement.classList.add('custom-cursor-active');

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);

      // Inspect target element for data-cursor or tags
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorElement = target.closest('[data-cursor]');
      if (cursorElement) {
        const type = cursorElement.getAttribute('data-cursor') as any;
        if (type) {
          setCursorType(type);
          return;
        }
      }

      // Fallbacks based on element type
      if (target.closest('button') || target.closest('a')) {
        setCursorType('VIEW');
      } else {
        setCursorType('DEFAULT');
      }
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      document.documentElement.classList.remove('custom-cursor-active');
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [visible]);

  if (isTouch || !visible) return null;

  const isExpanded = cursorType !== 'DEFAULT';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] transition-transform duration-75 ease-out flex items-center justify-center"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
      }}
    >
      {/* Outer Glow Ring */}
      <div
        className={`rounded-full border transition-all duration-300 flex items-center justify-center ${
          isExpanded
            ? 'w-16 h-16 bg-[#E5C158]/20 border-[#E5C158] backdrop-blur-xs scale-110 shadow-[0_0_25px_rgba(229,193,88,0.4)]'
            : 'w-6 h-6 bg-white/10 border-white/40'
        }`}
      >
        {isExpanded && (
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#E5C158] select-none animate-fade-in">
            {cursorType}
          </span>
        )}
      </div>

      {/* Tiny Center Dot */}
      {!isExpanded && (
        <div className="absolute w-1.5 h-1.5 bg-[#E5C158] rounded-full shadow-[0_0_8px_#E5C158]" />
      )}
    </div>
  );
};
