'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Article } from '@media-network/shared';

interface ArticlePageClientProps {
  article: Article;
  relatedArticles: Article[];
}

export function ArticlePageClient({ article, relatedArticles }: ArticlePageClientProps) {
  const authorName = article.author?.name || 'SauceCaviar Editorial';
  const publishDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        {article.cover_image ? (
          <Image
            src={article.cover_image}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary to-secondary" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-secondary/20" />
        <div className="absolute inset-0 vignette pointer-events-none" />

        <motion.div
          className="relative h-full flex flex-col justify-end pb-16 md:pb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container-narrow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-primary" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-primary font-body">
                {article.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline text-text leading-tight tracking-wide text-balance">
              {article.title}
            </h1>
            {article.excerpt && (
              <p className="mt-4 text-lg font-accent italic text-text/50 max-w-2xl">
                {article.excerpt}
              </p>
            )}
            <div className="mt-6 flex items-center gap-4 text-[10px] tracking-[0.2em] uppercase text-text/30 font-body">
              <span>{authorName}</span>
              <span className="w-1 h-1 rounded-full bg-primary/30" />
              <span>{publishDate}</span>
              <span className="w-1 h-1 rounded-full bg-primary/30" />
              <span>{article.reading_time_minutes} min read</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Article Body */}
      <section className="py-16 md:py-20">
        <div className="container-narrow">
          <motion.div
            className="prose prose-invert prose-lg max-w-none
                       prose-headings:font-headline prose-headings:text-text prose-headings:tracking-wide
                       prose-p:text-text/70 prose-p:font-body prose-p:leading-relaxed
                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                       prose-blockquote:border-primary/40 prose-blockquote:text-primary/80 prose-blockquote:font-accent prose-blockquote:italic
                       prose-strong:text-text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            dangerouslySetInnerHTML={{ __html: article.body }}
          />
        </div>
      </section>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <section className="pb-12">
          <div className="container-narrow">
            <div className="divider-gold mb-8" />
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-body
                           bg-primary/5 border border-primary/10 px-3 py-1.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 md:py-20 border-t border-surface/20">
          <div className="container-caviar">
            <div className="mb-10">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary/60 font-body mb-3">
                Continue Reading
              </p>
              <h2 className="text-2xl md:text-3xl font-headline text-text tracking-wide">
                More Stories
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.id} href={`/articles/${related.slug}`} className="group">
                  <div className="relative aspect-[16/10] overflow-hidden mb-4 bg-surface/20">
                    {related.cover_image ? (
                      <Image
                        src={related.cover_image}
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary to-secondary" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <span className="text-[9px] tracking-[0.3em] uppercase text-primary/60 font-body">
                    {related.category}
                  </span>
                  <h3 className="mt-1 text-lg font-headline text-text tracking-wide group-hover:text-primary transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <section className="pb-16">
        <div className="container-caviar">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-text/40 hover:text-primary transition-colors font-body"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
}
