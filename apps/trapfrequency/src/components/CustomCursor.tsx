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
    x: 0,
    y: 0,
    visible: false,
    hovering: false,
    clicking: false,
    text: null,
  });

  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const animate = useCallback(() => {
    const lerp = 0.15;
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
      setCursor((prev) => ({ ...prev, x: e.clientX, y: e.clientY, visible: true }));
    };

    const handleMouseDown = () => setCursor((prev) => ({ ...prev, clicking: true }));
    const handleMouseUp = () => setCursor((prev) => ({ ...prev, clicking: false }));
    const handleMouseLeave = () => setCursor((prev) => ({ ...prev, visible: false }));
    const handleMouseEnter = () => setCursor((prev) => ({ ...prev, visible: true }));

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor]');
      if (interactiveEl) {
        const cursorText = interactiveEl.getAttribute('data-cursor') || null;
        setCursor((prev) => ({ ...prev, hovering: true, text: cursorText }));
      } else {
        setCursor((prev) => ({ ...prev, hovering: false, text: null }));
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
    styleEl.textContent = `*, *::before, *::after { cursor: none !important; }`;
    document.head.appendChild(styleEl);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.documentElement.style.cursor = '';
      const style = document.getElementById('custom-cursor-styles');
      if (style) style.remove();
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Dot — Frequency Green */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: `translate(${cursor.x}px, ${cursor.y}px)`,
          opacity: cursor.visible ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div
          className="relative -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-all duration-200 ease-out"
          style={{
            width: cursor.clicking ? '6px' : '8px',
            height: cursor.clicking ? '6px' : '8px',
            boxShadow: '0 0 8px rgba(57, 255, 20, 0.6)',
          }}
        />
      </div>

      {/* Ring — green glow trail */}
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
            width: cursor.hovering ? '56px' : cursor.clicking ? '28px' : '36px',
            height: cursor.hovering ? '56px' : cursor.clicking ? '28px' : '36px',
            borderWidth: cursor.hovering ? '1.5px' : '1px',
            borderColor: cursor.hovering ? 'rgba(57, 255, 20, 0.6)' : 'rgba(57, 255, 20, 0.3)',
            boxShadow: cursor.hovering ? '0 0 15px rgba(57, 255, 20, 0.2)' : 'none',
          }}
        >
          {cursor.text && cursor.hovering && (
            <span
              className="text-[9px] font-mono text-primary uppercase tracking-widest whitespace-nowrap opacity-80"
              style={{ animation: 'fadeIn 0.15s ease-out' }}
            >
              {cursor.text}
            </span>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 0.8; transform: scale(1); }
        }
      `}</style>
    </>
  );
}
