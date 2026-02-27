'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';

interface FullBleedTemplateProps {
  page: MagazinePage;
}

export function FullBleedTemplate({ page }: FullBleedTemplateProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Full-bleed image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center ken-burns-zoom"
          style={{ backgroundImage: `url(${page.imageUrl})` }}
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Content — positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {page.category && (
            <p className="text-[9px] tracking-[0.4em] uppercase text-primary/80 font-body mb-3">
              {page.category}
            </p>
          )}
          <h2 className="text-3xl md:text-5xl font-headline text-white leading-tight tracking-wide drop-shadow-lg">
            {page.title}
          </h2>
          {page.subtitle && (
            <p className="mt-3 text-sm font-accent italic text-white/70 drop-shadow-lg">
              {page.subtitle}
            </p>
          )}
        </motion.div>
      </div>

      {/* Page number */}
      <div className="absolute bottom-4 right-6">
        <p className="text-[8px] tracking-[0.2em] uppercase text-white/30 font-body">
          {page.pageNumber}
        </p>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none vignette" />
    </div>
  );
}
