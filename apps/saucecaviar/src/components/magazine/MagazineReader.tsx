'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MagazineIssue, MagazinePage } from '@/lib/mock-data';
import { CoverReveal } from './CoverReveal';
import { PageNavigator } from './PageNavigator';
import { FullscreenToggle } from './FullscreenToggle';
import { usePageTurnSound } from './PageTurnSound';
import { CoverTemplate } from './templates/CoverTemplate';
import { TOCTemplate } from './templates/TOCTemplate';
import { ArticleTemplate } from './templates/ArticleTemplate';
import { SpreadTemplate } from './templates/SpreadTemplate';
import { VideoTemplate } from './templates/VideoTemplate';
import { AdTemplate } from './templates/AdTemplate';
import { ArtistTemplate } from './templates/ArtistTemplate';
import { FullBleedTemplate } from './templates/FullBleedTemplate';
import { BackCoverTemplate } from './templates/BackCoverTemplate';

interface MagazineReaderProps {
  issue: MagazineIssue;
}

function PageContent({ page, onJumpToPage }: { page: MagazinePage; onJumpToPage?: (n: number) => void }) {
  switch (page.type) {
    case 'cover': return <CoverTemplate page={page} />;
    case 'toc': return <TOCTemplate page={page} onJumpToPage={onJumpToPage} />;
    case 'article': return <ArticleTemplate page={page} />;
    case 'spread': return <SpreadTemplate page={page} />;
    case 'video': return <VideoTemplate page={page} />;
    case 'ad': return <AdTemplate page={page} />;
    case 'artist': return <ArtistTemplate page={page} />;
    case 'full-bleed': return <FullBleedTemplate page={page} />;
    case 'back-cover': return <BackCoverTemplate page={page} />;
    default: return <ArticleTemplate page={page} />;
  }
}

export function MagazineReader({ issue }: MagazineReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [showCoverReveal, setShowCoverReveal] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next
  const containerRef = useRef<HTMLDivElement>(null);
  const { play: playPageTurn } = usePageTurnSound();

  const totalPages = issue.pages.length;

  // Save reading position
  useEffect(() => {
    const key = `caviar-reading-${issue.slug}`;
    const saved = localStorage.getItem(key);
    if (saved && !showCoverReveal) {
      const savedPage = parseInt(saved, 10);
      if (!isNaN(savedPage) && savedPage > 0 && savedPage < totalPages) {
        setCurrentPage(savedPage);
      }
    }
  }, [issue.slug, totalPages, showCoverReveal]);

  useEffect(() => {
    if (!showCoverReveal) {
      localStorage.setItem(`caviar-reading-${issue.slug}`, String(currentPage));
    }
  }, [currentPage, issue.slug, showCoverReveal]);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setDirection(page > currentPage ? 1 : -1);
      setCurrentPage(page);
      playPageTurn();
    }
  }, [totalPages, currentPage, playPageTurn]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
      playPageTurn();
    }
  }, [currentPage, totalPages, playPageTurn]);

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
      playPageTurn();
    }
  }, [currentPage, playPageTurn]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage, isFullscreen]);

  // Touch/swipe support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = Math.abs(startY - endY);

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(diffX) > 50 && diffY < 100) {
        if (diffX > 0) nextPage();
        else prevPage();
      }
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('touchstart', handleTouchStart);
      el.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextPage, prevPage]);

  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setIsFullscreen(prev => !prev);
  }, [isFullscreen]);

  // Track fullscreen changes
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const currentPageData = issue.pages[currentPage];

  // Page flip animation variants
  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '30%' : '-30%',
      opacity: 0,
      rotateY: dir > 0 ? -15 : 15,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-30%' : '30%',
      opacity: 0,
      rotateY: dir > 0 ? 15 : -15,
      scale: 0.95,
    }),
  };

  return (
    <>
      {/* Cover reveal animation */}
      {showCoverReveal && (
        <CoverReveal
          coverImage={issue.coverImage}
          title={issue.title}
          subtitle={issue.subtitle}
          issueNumber={issue.issueNumber}
          onRevealComplete={() => setShowCoverReveal(false)}
        />
      )}

      {/* Magazine container */}
      <div
        ref={containerRef}
        className={`magazine-reader ${
          isFullscreen ? 'magazine-fullscreen' : 'min-h-screen bg-secondary flex flex-col items-center justify-center pt-24 pb-8'
        }`}
      >
        {/* Top controls */}
        <div className={`flex items-center justify-between w-full max-w-4xl mx-auto px-4 mb-4 ${isFullscreen ? 'absolute top-4 left-4 right-4 z-10 max-w-none' : ''}`}>
          <div className="flex items-center gap-2">
            <p className="text-[10px] tracking-[0.3em] uppercase text-text/30 font-body">
              {issue.title}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Share button */}
            <motion.button
              className="p-3 text-text/50 hover:text-primary transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              data-cursor="Share"
              onClick={() => {
                navigator.share?.({
                  title: `SauceCaviar — ${issue.title}`,
                  url: window.location.href,
                }).catch(() => {
                  navigator.clipboard.writeText(window.location.href);
                });
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </motion.button>
            <FullscreenToggle isFullscreen={isFullscreen} onToggle={toggleFullscreen} />
          </div>
        </div>

        {/* Page display area */}
        <div
          className={`relative overflow-hidden bg-secondary ${
            isFullscreen
              ? 'w-full h-full max-w-5xl max-h-[90vh]'
              : 'w-full max-w-3xl aspect-[3/4] md:aspect-[4/5]'
          }`}
          style={{
            perspective: '2000px',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(201, 168, 76, 0.08)',
          }}
        >
          {/* Page fold shadow overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none page-fold-shadow opacity-30" />

          {/* Animated page content */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <PageContent
                page={currentPageData}
                onJumpToPage={goToPage}
              />
            </motion.div>
          </AnimatePresence>

          {/* Click zones for page navigation */}
          <div className="absolute inset-0 z-20 flex">
            <button
              onClick={prevPage}
              className="w-1/4 h-full cursor-w-resize opacity-0 hover:opacity-100 transition-opacity"
              aria-label="Previous page"
              data-cursor="Prev"
            >
              <div className="h-full w-full bg-gradient-to-r from-black/10 to-transparent" />
            </button>
            <div className="flex-1" />
            <button
              onClick={nextPage}
              className="w-1/4 h-full cursor-e-resize opacity-0 hover:opacity-100 transition-opacity"
              aria-label="Next page"
              data-cursor="Next"
            >
              <div className="h-full w-full bg-gradient-to-l from-black/10 to-transparent" />
            </button>
          </div>
        </div>

        {/* Bottom navigation */}
        <div className={`w-full max-w-3xl mx-auto mt-4 ${isFullscreen ? 'absolute bottom-4 left-0 right-0 max-w-none z-10' : ''}`}>
          <PageNavigator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrev={prevPage}
            onNext={nextPage}
          />
        </div>

        {/* Keyboard hint */}
        {!isFullscreen && (
          <motion.p
            className="mt-4 text-[9px] tracking-[0.3em] uppercase text-text/15 font-body hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Use arrow keys to navigate · F for fullscreen · Swipe on mobile
          </motion.p>
        )}
      </div>
    </>
  );
}
