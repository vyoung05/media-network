'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PageNavigatorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function PageNavigator({ currentPage, totalPages, onPageChange, onPrev, onNext }: PageNavigatorProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      {/* Prev button */}
      <motion.button
        onClick={onPrev}
        disabled={currentPage <= 0}
        className="p-2 text-text/40 hover:text-primary disabled:text-text/10 disabled:cursor-not-allowed transition-colors"
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.9 }}
        data-cursor="Prev"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </motion.button>

      {/* Page dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }).map((_, i) => (
          <motion.button
            key={i}
            onClick={() => onPageChange(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentPage
                ? 'bg-primary w-6 h-1.5'
                : 'bg-text/15 hover:bg-text/30 w-1.5 h-1.5'
            }`}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
            title={`Page ${i + 1}`}
          />
        ))}
      </div>

      {/* Next button */}
      <motion.button
        onClick={onNext}
        disabled={currentPage >= totalPages - 1}
        className="p-2 text-text/40 hover:text-primary disabled:text-text/10 disabled:cursor-not-allowed transition-colors"
        whileHover={{ x: 3 }}
        whileTap={{ scale: 0.9 }}
        data-cursor="Next"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </motion.button>

      {/* Page counter */}
      <span className="text-[10px] tracking-[0.2em] text-text/30 font-body uppercase ml-4">
        {currentPage + 1} / {totalPages}
      </span>
    </div>
  );
}
