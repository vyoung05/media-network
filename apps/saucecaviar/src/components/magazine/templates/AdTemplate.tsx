'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';

interface AdTemplateProps {
  page: MagazinePage;
}

export function AdTemplate({ page }: AdTemplateProps) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: page.backgroundColor || '#0A0A0A' }}
    >
      {/* Full-bleed ad image */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${page.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
      </motion.div>

      {/* Ad content overlay */}
      <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
        {/* "Advertisement" label */}
        <div className="absolute top-4 right-4">
          <p className="text-[8px] tracking-[0.3em] uppercase text-white/30 font-body">
            Advertisement
          </p>
        </div>

        {/* Brand name */}
        <motion.h2
          className="text-3xl md:text-5xl font-headline text-white tracking-wider"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {page.advertiserName}
        </motion.h2>

        {/* Tagline */}
        {page.advertiserTagline && (
          <motion.p
            className="mt-3 text-lg font-accent italic text-white/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {page.advertiserTagline}
          </motion.p>
        )}

        {/* CTA */}
        {page.advertiserCta && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <span className="inline-block px-6 py-2.5 border border-white/30 text-white text-xs
                           tracking-[0.2em] uppercase font-body hover:bg-white/10 transition-colors cursor-pointer">
              {page.advertiserCta}
            </span>
          </motion.div>
        )}
      </div>

      {/* Subtle gold accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </div>
  );
}
