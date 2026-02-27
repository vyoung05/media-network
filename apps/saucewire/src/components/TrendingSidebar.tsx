'use client';

import React from 'react';
import Link from 'next/link';
import type { Article } from '@media-network/shared';
import { timeAgo, formatNumber } from '@media-network/shared';

interface TrendingSidebarProps {
  articles: Article[];
}

export function TrendingSidebar({ articles }: TrendingSidebarProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <aside className="bg-surface rounded-lg border border-gray-800/50 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2">
        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.56 21a1 1 0 01-.46-.11L12 18.22l-5.1 2.67a1 1 0 01-1.45-1.06l1-5.63-4.12-4a1 1 0 01.56-1.71l5.7-.83 2.51-5.13a1 1 0 011.8 0l2.54 5.12 5.7.83a1 1 0 01.56 1.71l-4.12 4 1 5.63a1 1 0 01-1 1.18z" />
        </svg>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trending</h3>
      </div>

      {/* Articles list */}
      <div className="divide-y divide-gray-800/30">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/${article.slug}`}
            className="group flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
          >
            <span className="flex-shrink-0 text-lg font-headline text-primary/30 mt-0.5 w-6 text-right">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs text-neutral">
                <span className="font-mono">{article.category}</span>
                <span>·</span>
                <span className="font-mono">{formatNumber(article.view_count)} views</span>
                {article.published_at && (
                  <>
                    <span>·</span>
                    <span className="font-mono">{timeAgo(article.published_at)}</span>
                  </>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
