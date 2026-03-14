'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Article } from '@media-network/shared';

interface ArticlesPageClientProps {
  articles: Article[];
}

export function ArticlesPageClient({ articles }: ArticlesPageClientProps) {
  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-caviar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-body mb-3">
              All Stories
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline text-text tracking-wide">
              Stories
            </h1>
            <p className="mt-4 text-lg font-accent italic text-text/40 max-w-2xl">
              Fashion, music, art, culture, and luxury lifestyle — all in one place.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="pb-24">
        <div className="container-caviar">
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text/40 font-body">No stories yet. Check back soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.08, 0.8), duration: 0.6 }}
                >
                  <Link href={`/articles/${article.slug}`} className="group block">
                    <div className="relative overflow-hidden bg-surface/20 border border-surface/30
                                  transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-gold-lg">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {article.cover_image ? (
                          <Image
                            src={article.cover_image}
                            alt={article.title}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-[#1a1510] to-secondary" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
                        <div className="absolute top-4 left-4">
                          <span className="text-[9px] tracking-[0.3em] uppercase text-primary/90 font-body
                                         bg-black/50 backdrop-blur-sm px-3 py-1.5 border border-primary/20">
                            {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h2 className="text-lg font-headline text-text tracking-wide group-hover:text-primary transition-colors line-clamp-2">
                          {article.title}
                        </h2>
                        {article.excerpt && (
                          <p className="mt-2 text-xs text-text/40 font-body leading-relaxed line-clamp-2">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-[9px] tracking-[0.2em] uppercase text-text/25 font-body">
                            {article.author?.name || 'SauceCaviar'}
                          </p>
                          <p className="text-[9px] tracking-[0.2em] uppercase text-text/25 font-body">
                            {article.reading_time_minutes} min
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
