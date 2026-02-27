'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';

interface CursorState {
  x: number;
  y: number;
  visible: boolean;
  hovering: boolean;
  clicking: boolean;
  text: string | null;
}

export function CustomCursor() {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0, y: 0, visible: false, hovering: false, clicking: false, text: null,
  });

  const trailRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const animate = useCallback(() => {
    const lerp = 0.12;
    currentRef.current.x += (targetRef.current.x - currentRef.current.x) * lerp;
    currentRef.current.y += (targetRef.current.y - currentRef.current.y) * lerp;
    if (trailRef.current) {
      trailRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px)`;
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, isTouchDevice]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setCursor(prev => ({ ...prev, x: e.clientX, y: e.clientY, visible: true }));
    };
    const handleMouseDown = () => setCursor(prev => ({ ...prev, clicking: true }));
    const handleMouseUp = () => setCursor(prev => ({ ...prev, clicking: false }));
    const handleMouseLeave = () => setCursor(prev => ({ ...prev, visible: false }));
    const handleMouseEnter = () => setCursor(prev => ({ ...prev, visible: true }));
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]');
      if (el) {
        const cursorText = el.getAttribute('data-cursor') || null;
        setCursor(prev => ({ ...prev, hovering: true, text: cursorText }));
      } else {
        setCursor(prev => ({ ...prev, hovering: false, text: null }));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);

    document.documentElement.style.cursor = 'none';
    const styleEl = document.createElement('style');
    styleEl.id = 'custom-cursor-styles';
    styleEl.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(styleEl);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.style.cursor = '';
      document.getElementById('custom-cursor-styles')?.remove();
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Gold dot */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: `translate(${cursor.x}px, ${cursor.y}px)`,
          opacity: cursor.visible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-all duration-200 ease-out"
          style={{
            width: cursor.clicking ? '5px' : '7px',
            height: cursor.clicking ? '5px' : '7px',
          }}
        />
      </div>

      {/* Gold ring (trails with lerp) */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          opacity: cursor.visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-out flex items-center justify-center"
          style={{
            width: cursor.hovering ? '60px' : cursor.clicking ? '24px' : '32px',
            height: cursor.hovering ? '60px' : cursor.clicking ? '24px' : '32px',
            borderColor: 'rgba(201, 168, 76, 0.6)',
            borderWidth: cursor.hovering ? '1.5px' : '1px',
            backgroundColor: cursor.hovering ? 'rgba(201, 168, 76, 0.08)' : 'transparent',
          }}
        >
          {cursor.text && cursor.hovering && (
            <span className="text-[8px] font-body text-primary uppercase tracking-[0.2em] whitespace-nowrap opacity-90">
              {cursor.text}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
