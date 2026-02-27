'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';

interface ArticleTemplateProps {
  page: MagazinePage;
}

export function ArticleTemplate({ page }: ArticleTemplateProps) {
  const paragraphs = page.content?.split('\n\n').filter(Boolean) || [];
  const isFirstPage = !page.subtitle?.includes('Continued');

  return (
    <div className="relative w-full h-full magazine-page overflow-hidden page-texture">
      <div className="relative h-full flex flex-col p-6 md:p-10">
        {/* Header */}
        {isFirstPage && (
          <div className="mb-6">
            {/* Category tag */}
            <motion.p
              className="text-[9px] tracking-[0.4em] uppercase text-highlight font-body mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {page.category}
            </motion.p>

            {/* Hero image */}
            {page.imageUrl && (
              <motion.div
                className="relative w-full h-32 md:h-40 mb-5 overflow-hidden"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${page.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-accent/80 to-transparent" />
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              className="text-2xl md:text-3xl font-headline text-caviar-black leading-tight tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {page.title}
            </motion.h1>

            {/* Subtitle */}
            {page.subtitle && !page.subtitle.includes('Continued') && (
              <p className="mt-2 text-sm font-accent italic text-caviar-charcoal/70 leading-relaxed">
                {page.subtitle}
              </p>
            )}

            {/* Author */}
            {page.author && (
              <div className="mt-3 flex items-center gap-2">
                <div className="w-6 h-px bg-primary/40" />
                <p className="text-[10px] tracking-[0.2em] uppercase text-primary/70 font-body">
                  By {page.author}
                  {page.authorTitle && <span className="text-caviar-charcoal/40"> — {page.authorTitle}</span>}
                </p>
              </div>
            )}

            <div className="mt-4 w-full h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
          </div>
        )}

        {/* Article body */}
        <div className="flex-1 overflow-hidden">
          <div className={`text-sm leading-relaxed text-caviar-black/80 font-body ${isFirstPage ? 'drop-cap' : ''}`}>
            {paragraphs.map((para, i) => (
              <motion.p
                key={i}
                className="mb-3 text-[13px] leading-[1.8]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
          </div>
        </div>

        {/* Pull quote (if present) */}
        {page.pullQuote && (
          <motion.div
            className="my-4 py-4 border-t border-b border-primary/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-base md:text-lg font-accent italic text-highlight/80 leading-relaxed">
              {page.pullQuote}
            </p>
          </motion.div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3 flex justify-between items-end">
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
