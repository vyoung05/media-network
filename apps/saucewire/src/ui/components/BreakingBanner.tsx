'use client';

import React from 'react';
import type { Article } from '@media-network/shared';

interface BreakingBannerProps {
  articles: Article[];
  onArticleClick?: (article: Article) => void;
}

export function BreakingBanner({ articles, onArticleClick }: BreakingBannerProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="relative bg-red-600 text-white overflow-hidden">
      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-[pulse_2s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" />

      <div className="relative flex items-center">
        {/* Static label with glow */}
        <div className="flex-shrink-0 bg-red-800 px-4 py-2 font-black text-sm uppercase tracking-wider flex items-center gap-2 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.3)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"></span>
          </span>
          BREAKING
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden flex-1">
          <div className="animate-ticker flex whitespace-nowrap">
            {/* Duplicate for seamless loop */}
            {[...articles, ...articles].map((article, idx) => (
              <button
                key={`${article.id}-${idx}`}
                onClick={() => onArticleClick?.(article)}
                className="inline-flex items-center px-6 py-2 text-sm font-semibold hover:underline whitespace-nowrap group"
              >
                <span className="mr-3 text-red-200 group-hover:text-white transition-colors">●</span>
                <span className="group-hover:text-red-100 transition-colors">{article.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
