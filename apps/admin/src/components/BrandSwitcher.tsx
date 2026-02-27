'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand } from '@media-network/shared';

const BRANDS: { id: Brand; name: string; tagline: string; color: string; icon: string }[] = [
  { id: 'saucewire', name: 'SauceWire', tagline: 'Culture. Connected. Now.', color: '#E63946', icon: '⚡' },
  { id: 'saucecaviar', name: 'SauceCaviar', tagline: 'Culture Served Premium', color: '#C9A84C', icon: '🥂' },
  { id: 'trapglow', name: 'TrapGlow', tagline: 'Shining Light on What\'s Next', color: '#8B5CF6', icon: '✨' },
  { id: 'trapfrequency', name: 'TrapFrequency', tagline: 'Tune Into The Craft', color: '#39FF14', icon: '🎵' },
];

interface BrandSwitcherProps {
  activeBrand: Brand;
  onBrandChange: (brand: Brand) => void;
  variant?: 'dropdown' | 'pills';
}

export function BrandSwitcher({ activeBrand, onBrandChange, variant = 'dropdown' }: BrandSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = BRANDS.find((b) => b.id === activeBrand)!;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ======================== PILLS VARIANT ========================
  if (variant === 'pills') {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {BRANDS.map((brand) => {
          const isActive = brand.id === activeBrand;
          return (
            <motion.button
              key={brand.id}
              onClick={() => onBrandChange(brand.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: `${brand.color}20`,
                      boxShadow: `0 0 20px ${brand.color}15`,
                      border: `1px solid ${brand.color}40`,
                    }
                  : { border: '1px solid rgba(255,255,255,0.04)' }
              }
            >
              <span className="text-base">{brand.icon}</span>
              <span>{brand.name}</span>
              {isActive && (
                <motion.div
                  layoutId="brand-pill-indicator"
                  className="absolute -bottom-px left-4 right-4 h-0.5 rounded-full"
                  style={{ backgroundColor: brand.color }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    );
  }

  // ======================== DROPDOWN VARIANT ========================
  return (
    <div ref={ref} className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.06] transition-all w-full"
      >
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: active.color,
            boxShadow: `0 0 8px ${active.color}60`,
          }}
        />
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-white">{active.name}</p>
          <p className="text-xs text-gray-500">{active.tagline}</p>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-500"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full left-0 right-0 mt-2 z-50 glass-panel-solid shadow-2xl shadow-black/40 overflow-hidden"
          >
            {BRANDS.map((brand, i) => {
              const isActive = brand.id === activeBrand;
              return (
                <motion.button
                  key={brand.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => { onBrandChange(brand.id); setIsOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                    isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-shadow"
                    style={{
                      backgroundColor: brand.color,
                      boxShadow: isActive ? `0 0 10px ${brand.color}80` : 'none',
                    }}
                  />
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                      {brand.icon} {brand.name}
                    </p>
                    <p className="text-xs text-gray-600">{brand.tagline}</p>
                  </div>
                  {isActive && (
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
