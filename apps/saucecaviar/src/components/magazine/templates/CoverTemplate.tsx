'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';

interface CoverTemplateProps {
  page: MagazinePage;
}

export function CoverTemplate({ page }: CoverTemplateProps) {
  return (
    <div className="relative w-full h-full overflow-hidden magazine-page-dark">
      {/* Cover image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${page.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent h-1/3" />
      </div>

      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-between p-8 md:p-12">
        {/* Top: Logo */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xs tracking-[0.4em] uppercase text-primary/80 font-body">
              SauceCaviar
            </h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/50 font-body">
              {page.category}
            </p>
          </div>
        </div>

        {/* Bottom: Title */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="w-12 h-px bg-primary mb-6" />
            <h1 className="text-4xl md:text-6xl font-headline text-white leading-[1.1] tracking-wide">
              {page.title}
            </h1>
            {page.subtitle && (
              <p className="mt-3 text-lg font-accent italic text-primary/90">
                {page.subtitle}
              </p>
            )}
          </motion.div>
          <div className="mt-8 flex items-center gap-4">
            <div className="w-8 h-px bg-primary/40" />
            <p className="text-[9px] tracking-[0.3em] uppercase text-white/40 font-body">
              Culture Served Premium
            </p>
          </div>
        </div>
      </div>

      {/* Gold border accent */}
      <div className="absolute inset-4 border border-primary/10 pointer-events-none" />
    </div>
  );
}
