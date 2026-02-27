'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';

interface ArtistTemplateProps {
  page: MagazinePage;
}

export function ArtistTemplate({ page }: ArtistTemplateProps) {
  const bioParagraphs = page.artistBio?.split('\n\n').filter(Boolean) || [];

  return (
    <div className="relative w-full h-full magazine-page overflow-hidden page-texture">
      {/* Artist portrait — top portion */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[38%]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${page.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent" />

        {/* Category label */}
        <div className="absolute top-4 left-6">
          <p className="text-[9px] tracking-[0.4em] uppercase text-white/60 font-body bg-black/30 backdrop-blur-sm px-3 py-1">
            {page.title || 'Artist Spotlight'}
          </p>
        </div>
      </motion.div>

      {/* Content area */}
      <div className="absolute bottom-0 left-0 right-0 h-[62%] p-6 md:p-8 flex flex-col">
        {/* Artist name */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-headline text-caviar-black tracking-wide">
            {page.artistName}
          </h2>
          <div className="mt-2 w-12 h-px bg-primary" />
        </motion.div>

        {/* Pull quote */}
        {page.pullQuote && (
          <motion.p
            className="mt-4 text-base font-accent italic text-highlight/80 leading-relaxed"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            {page.pullQuote}
          </motion.p>
        )}

        {/* Bio text */}
        <div className="mt-4 flex-1 overflow-hidden">
          <div className="text-[11px] leading-[1.8] text-caviar-black/70 font-body">
            {bioParagraphs.slice(0, 3).map((para, i) => (
              <motion.p
                key={i}
                className="mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Social links */}
        {page.artistLinks && (
          <motion.div
            className="mt-3 flex items-center gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            {Object.entries(page.artistLinks).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.15em] uppercase text-primary/70 hover:text-highlight
                         transition-colors font-body"
              >
                {platform}
              </a>
            ))}
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-3 pt-2 flex justify-between items-end border-t border-caviar-charcoal/10">
          <p className="text-[8px] tracking-[0.2em] uppercase text-caviar-charcoal/30 font-body">
            SauceCaviar
          </p>
          <p className="text-[8px] tracking-[0.2em] uppercase text-caviar-charcoal/30 font-body">
            {page.pageNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
