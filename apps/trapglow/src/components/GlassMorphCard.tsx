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
  glowColor = 'rgba(139, 92, 246, 0.15)',
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

      setTilt({
        x: ((y - centerY) / centerY) * -6,
        y: ((x - centerX) / centerX) * 6,
      });
      setGlowPos({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      });
    },
    [hoverTilt]
  );

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setTilt({ x: 0, y: 0 });
      }}
      className={`
        relative overflow-hidden rounded-2xl
        bg-white/[0.03]
        ${blurMap[blurIntensity]}
        ${borderGlow ? 'border border-white/[0.06]' : ''}
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        transform: isHovering
          ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(1.01)`
          : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
        transition: isHovering ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
    >
      {/* Glow follow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${glowColor}, transparent 60%)`,
          opacity: isHovering ? 1 : 0,
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }}
      />

      {/* Top highlight */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(139,92,246,${isHovering ? 0.2 : 0.08}) 50%, transparent 100%)`,
        }}
      />

      {/* Hover border glow */}
      {borderGlow && isHovering && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
          style={{
            boxShadow: `inset 0 0 0 1px rgba(139,92,246,0.15), 0 0 40px ${glowColor}`,
            opacity: 0.5,
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
