'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';

interface TOCTemplateProps {
  page: MagazinePage;
  onJumpToPage?: (pageNum: number) => void;
}

export function TOCTemplate({ page, onJumpToPage }: TOCTemplateProps) {
  return (
    <div className="relative w-full h-full magazine-page overflow-hidden">
      {/* Subtle background image */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url(${page.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
        }}
      />

      <div className="relative h-full flex flex-col p-8 md:p-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-caviar-gold-dark/60 font-body mb-3">
            In This Issue
          </p>
          <h2 className="text-3xl md:text-4xl font-headline text-caviar-black tracking-wide">
            {page.title || 'Contents'}
          </h2>
          <div className="mt-4 w-16 h-px bg-gradient-to-r from-primary to-transparent" />
        </div>

        {/* TOC entries */}
        <div className="flex-1 flex flex-col justify-center">
          {page.tocEntries?.map((entry, i) => (
            <motion.button
              key={i}
              onClick={() => onJumpToPage?.(entry.page - 1)}
              className="group flex items-baseline gap-4 py-3 border-b border-caviar-charcoal/10 text-left w-full
                         hover:pl-2 transition-all duration-300"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Page number */}
              <span className="text-xs font-body text-primary/60 w-6 text-right tabular-nums">
                {String(entry.page).padStart(2, '0')}
              </span>

              {/* Title */}
              <span className="flex-1 text-sm md:text-base font-headline text-caviar-black group-hover:text-highlight transition-colors duration-300">
                {entry.title}
              </span>

              {/* Category */}
              <span className="text-[9px] tracking-[0.2em] uppercase text-caviar-charcoal/40 font-body hidden md:block">
                {entry.category}
              </span>

              {/* Arrow */}
              <span className="text-primary/0 group-hover:text-primary/80 transition-all duration-300 text-xs">
                →
              </span>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-6 flex justify-between items-end">
          <p className="text-[9px] tracking-[0.3em] uppercase text-caviar-charcoal/30 font-body">
            SauceCaviar
          </p>
          <p className="text-[9px] tracking-[0.3em] uppercase text-caviar-charcoal/30 font-body">
            Contents
          </p>
        </div>
      </div>
    </div>
  );
}
