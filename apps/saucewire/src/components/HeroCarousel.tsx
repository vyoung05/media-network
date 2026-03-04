'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Article } from '@media-network/shared';
import { timeAgo } from '@media-network/shared';

interface HeroCarouselProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
  onCategoryClick?: (category: string) => void;
  autoPlayInterval?: number;
}

export function HeroCarousel({
  articles,
  onArticleClick,
  onCategoryClick,
  autoPlayInterval = 6000,
}: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % articles.length);
  }, [articles.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
  }, [articles.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play
  useEffect(() => {
    if (isPaused || articles.length <= 1) return;
    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, goToNext, autoPlayInterval, articles.length]);

  if (articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-surface"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main carousel area */}
      <div className="relative aspect-[16/9] md:aspect-[21/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            {/* Background image */}
            <img
              src={currentArticle.cover_image!}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* SauceWire logo watermark */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-10">
          <div className="flex items-center gap-1">
            <span className="text-lg md:text-xl font-headline text-white/90 tracking-tight">
              SAUCE
            </span>
            <span className="text-lg md:text-xl font-headline text-primary/90 tracking-tight">
              WIRE
            </span>
          </div>
          <div className="text-[9px] md:text-[10px] font-mono text-white/50 uppercase tracking-[0.3em] -mt-0.5">
            Culture. Connected. Now.
          </div>
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="max-w-3xl"
            >
              {/* Category + breaking badge */}
              <div className="flex items-center gap-2 mb-2">
                {currentArticle.is_breaking && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded animate-pulse">
                    BREAKING
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCategoryClick?.(currentArticle.category);
                  }}
                  className="text-xs font-mono text-accent uppercase tracking-wider hover:underline"
                >
                  {currentArticle.category}
                </button>
                {currentArticle.published_at && (
                  <span className="text-xs font-mono text-white/50">
                    {timeAgo(currentArticle.published_at)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2
                onClick={() => onArticleClick(currentArticle)}
                className="text-xl md:text-3xl lg:text-4xl font-headline text-white leading-tight mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-3"
              >
                {currentArticle.title}
              </h2>

              {/* Excerpt */}
              {currentArticle.excerpt && (
                <p className="text-sm md:text-base text-gray-300/80 line-clamp-2 max-w-2xl mb-3">
                  {currentArticle.excerpt}
                </p>
              )}

              {/* Author */}
              {currentArticle.author && (
                <p className="text-xs text-gray-400">
                  By <span className="text-accent">{currentArticle.author.name}</span>
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        {articles.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all flex items-center justify-center"
              aria-label="Previous story"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/60 transition-all flex items-center justify-center"
              aria-label="Next story"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Slide indicators + thumbnails */}
      {articles.length > 1 && (
        <div className="bg-surface/95 border-t border-gray-800/50">
          <div className="flex">
            {articles.map((article, idx) => (
              <button
                key={article.id}
                onClick={() => goToSlide(idx)}
                className={`flex-1 flex items-center gap-3 px-3 py-2.5 text-left transition-all border-b-2 ${
                  idx === currentIndex
                    ? 'border-primary bg-primary/5'
                    : 'border-transparent hover:bg-surface/80'
                }`}
              >
                {/* Progress bar for active slide */}
                {idx === currentIndex && !isPaused && (
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
                    key={`progress-${currentIndex}`}
                  />
                )}
                <div className="relative flex-shrink-0 w-10 h-10 rounded overflow-hidden hidden md:block">
                  {article.cover_image && (
                    <img
                      src={article.cover_image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-semibold line-clamp-1 transition-colors ${
                    idx === currentIndex ? 'text-white' : 'text-neutral'
                  }`}>
                    {article.title}
                  </p>
                  <p className="text-[10px] font-mono text-neutral/60 uppercase">
                    {article.category}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
