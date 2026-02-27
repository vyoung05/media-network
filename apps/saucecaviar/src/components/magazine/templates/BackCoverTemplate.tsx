'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';

interface BackCoverTemplateProps {
  page: MagazinePage;
}

export function BackCoverTemplate({ page }: BackCoverTemplateProps) {
  const paragraphs = page.content?.split('\n\n').filter(Boolean) || [];

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: page.backgroundColor || '#0A0A0A' }}
    >
      {/* Subtle gradient mesh background */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${page.imageUrl})`,
            filter: 'blur(40px) saturate(0.5)',
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/90 to-secondary" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-16 text-center">
        {/* Ornamental line */}
        <motion.div
          className="w-16 h-px bg-primary/40 mb-8"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />

        {/* Title */}
        <motion.h2
          className="text-2xl md:text-4xl font-headline text-text tracking-wide"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {page.title}
        </motion.h2>

        {page.subtitle && (
          <motion.p
            className="mt-3 text-sm font-accent italic text-primary/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {page.subtitle}
          </motion.p>
        )}

        {/* Body text */}
        <motion.div
          className="mt-8 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {paragraphs.map((para, i) => (
            <p key={i} className="text-sm text-text/50 font-body leading-relaxed mb-4">
              {para}
            </p>
          ))}
        </motion.div>

        {/* Ornamental line */}
        <motion.div
          className="w-16 h-px bg-primary/40 mt-8 mb-8"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 1, duration: 0.8 }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <h3 className="text-xl font-headline tracking-[0.2em] text-text/40">
            SAUCE<span className="text-primary/40">CAVIAR</span>
          </h3>
          <p className="mt-2 text-[8px] tracking-[0.4em] uppercase text-text/20 font-body">
            Culture Served Premium
          </p>
        </motion.div>
      </div>

      {/* Corner ornaments */}
      <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-primary/15" />
      <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-primary/15" />
      <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-primary/15" />
      <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-primary/15" />
    </div>
  );
}
