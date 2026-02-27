'use client';

import React, { useRef, useState, useCallback } from 'react';

interface GlassMorphCardProps {
  children: React.ReactNode;
  className?: string;
  hoverTilt?: boolean;
  glowColor?: string;
  blurIntensity?: 'light' | 'medium' | 'heavy';
  borderGlow?: boolean;
  onClick?: () => void;
}

export function GlassMorphCard({
  children,
  className = '',
  hoverTilt = true,
  glowColor = 'rgba(230, 57, 70, 0.15)',
  blurIntensity = 'medium',
  borderGlow = true,
  onClick,
}: GlassMorphCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const blurMap = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-xl',
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current || !hoverTilt) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Tilt: ±8 degrees max
      const tiltX = ((y - centerY) / centerY) * -8;
      const tiltY = ((x - centerX) / centerX) * 8;

      setTilt({ x: tiltX, y: tiltY });
      setGlowPos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    },
    [hoverTilt]
  );

  const handleMouseEnter = () => setIsHovering(true);

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden rounded-xl
        bg-white/[0.04]
        ${blurMap[blurIntensity]}
        ${borderGlow ? 'border border-white/[0.08]' : ''}
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        transform: isHovering
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.01)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: isHovering
          ? 'transform 0.1s ease-out'
          : 'transform 0.4s ease-out',
      }}
    >
      {/* Gradient glow that follows mouse */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 60%)`,
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Top-edge highlight (simulates glass reflection) */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,${isHovering ? 0.15 : 0.08}) 50%, transparent 100%)`,
        }}
      />

      {/* Border glow on hover */}
      {borderGlow && isHovering && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300"
          style={{
            boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 30px ${glowColor}`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
