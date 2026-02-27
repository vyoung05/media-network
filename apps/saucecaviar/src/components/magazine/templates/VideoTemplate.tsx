'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';

interface VideoTemplateProps {
  page: MagazinePage;
}

export function VideoTemplate({ page }: VideoTemplateProps) {
  return (
    <div className="relative w-full h-full magazine-page-dark overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${page.imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-caviar-black via-caviar-black/80 to-caviar-black/60" />

      <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-12">
        {/* Play button */}
        <motion.div
          className="w-24 h-24 rounded-full border-2 border-primary/60 flex items-center justify-center
                     cursor-pointer group"
          whileHover={{ scale: 1.1, borderColor: 'rgba(201, 168, 76, 1)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <svg className="w-10 h-10 text-primary/80 group-hover:text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.h2
          className="mt-8 text-2xl md:text-3xl font-headline text-text text-center leading-tight"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {page.title}
        </motion.h2>

        {page.subtitle && (
          <motion.p
            className="mt-3 text-sm font-accent italic text-primary/70 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {page.subtitle}
          </motion.p>
        )}

        {/* Video placeholder text */}
        <motion.p
          className="mt-6 text-[10px] tracking-[0.3em] uppercase text-text/30 font-body"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Tap to Play
        </motion.p>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none vignette" />
    </div>
  );
}
