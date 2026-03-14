'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import type { Article } from '@media-network/shared';

interface TrendingArticlesProps {
  articles: Article[];
}

function ArticleCard({
  article,
  index,
  variant = 'small',
}: {
  article: Article;
  index: number;
  variant?: 'featured' | 'small';
}) {
  const authorName = article.author?.name || 'SauceCaviar';
  const isFeatured = variant === 'featured';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={isFeatured ? 'md:col-span-2 md:row-span-2' : ''}
    >
      <Link href={`/articles/${article.slug}`} className="group block h-full" data-cursor="Read">
        <div
          className={`relative overflow-hidden bg-surface/20 border border-surface/30
                      transition-all duration-700 group-hover:border-primary/30 group-hover:shadow-gold-lg h-full
                      ${isFeatured ? 'flex flex-col' : ''}`}
        >
          {/* Cover image */}
          <div className={`relative overflow-hidden ${isFeatured ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
            {article.cover_image ? (
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                sizes={isFeatured
                  ? '(max-width: 768px) 100vw, 66vw'
                  : '(max-width: 768px) 100vw, 33vw'}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-[#1a1510] to-secondary" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="text-[9px] tracking-[0.3em] uppercase text-primary/90 font-body
                             bg-black/50 backdrop-blur-sm px-3 py-1.5 border border-primary/20">
                {article.category}
              </span>
            </div>

            {/* Featured overlay on hover */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-700" />
          </div>

          {/* Info */}
          <div className={`p-5 flex-1 flex flex-col ${isFeatured ? 'p-6 md:p-8' : ''}`}>
            <h3
              className={`font-headline text-text tracking-wide group-hover:text-primary transition-colors duration-500 line-clamp-2
                         ${isFeatured ? 'text-xl md:text-2xl' : 'text-base'}`}
            >
              {article.title}
            </h3>

            {article.excerpt && (
              <p
                className={`mt-2 text-text/40 font-body leading-relaxed
                           ${isFeatured ? 'text-sm line-clamp-3 md:line-clamp-4' : 'text-xs line-clamp-2'}`}
              >
                {article.excerpt}
              </p>
            )}

            <div className={`mt-auto pt-4 flex items-center justify-between ${isFeatured ? '' : ''}`}>
              <p className="text-[9px] tracking-[0.2em] uppercase text-text/25 font-body">
                {authorName}
              </p>
              <p className="text-[9px] tracking-[0.2em] uppercase text-text/25 font-body">
                {article.reading_time_minutes} min read
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function TrendingArticles({ articles }: TrendingArticlesProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (!articles || articles.length === 0) return null;

  const featured = articles[0];
  const remaining = articles.slice(1, 7);

  return (
    <section ref={ref} className="py-16 md:py-24 bg-secondary">
      <div className="container-caviar">
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-body mb-3">
              Trending Now
            </p>
            <h2 className="text-3xl md:text-4xl font-headline text-text tracking-wide">
              Latest Stories
            </h2>
          </div>
          <Link
            href="/articles"
            className="text-xs tracking-[0.2em] uppercase text-text/40 hover:text-primary transition-colors font-body hidden md:block"
            data-cursor="View All"
          >
            View All →
          </Link>
        </motion.div>

        {/* Grid: Featured large card + smaller cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Featured article — spans 2 cols, 2 rows */}
          <ArticleCard article={featured} index={0} variant="featured" />

          {/* Remaining articles */}
          {remaining.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i + 1} variant="small" />
          ))}
        </div>

        {/* Mobile "View All" link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/articles"
            className="text-xs tracking-[0.2em] uppercase text-text/40 hover:text-primary transition-colors font-body"
          >
            View All Stories →
          </Link>
        </div>
      </div>
    </section>
  );
}
