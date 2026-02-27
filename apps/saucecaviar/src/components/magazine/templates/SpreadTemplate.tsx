'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';

interface SpreadTemplateProps {
  page: MagazinePage;
}

export function SpreadTemplate({ page }: SpreadTemplateProps) {
  const paragraphs = page.content?.split('\n\n').filter(Boolean) || [];

  return (
    <div className="relative w-full h-full magazine-page overflow-hidden">
      {/* Primary image — top half */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[45%]"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${page.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent" />

        {/* Title overlay */}
        <div className="absolute bottom-4 left-8 right-8">
          <motion.h2
            className="text-2xl md:text-3xl font-headline text-white drop-shadow-lg leading-tight"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {page.title}
          </motion.h2>
          {page.subtitle && (
            <p className="mt-1 text-xs font-accent italic text-white/70">
              {page.subtitle}
            </p>
          )}
        </div>
      </motion.div>

      {/* Content — bottom half */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] p-6 md:p-8 flex">
        {/* Text column */}
        <div className="flex-1 pr-4">
          <div className="text-[12px] leading-[1.8] text-caviar-black/75 font-body">
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                className="mb-2.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Secondary image */}
        {page.secondaryImageUrl && (
          <motion.div
            className="w-[35%] hidden md:block"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${page.secondaryImageUrl})`,
              }}
            />
          </motion.div>
        )}
      </div>

      {/* Page number */}
      <div className="absolute bottom-3 right-6">
        <p className="text-[8px] tracking-[0.2em] uppercase text-caviar-charcoal/30 font-body">
          {page.pageNumber}
        </p>
      </div>
    </div>
  );
}
