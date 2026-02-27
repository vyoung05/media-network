'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Article } from '@media-network/shared';
import { NewsFeed } from '@media-network/ui';
import { TrendingSidebar } from '@/components/TrendingSidebar';

interface CategoryPageClientProps {
  category: string;
  articles: Article[];
  trendingArticles: Article[];
}

export function CategoryPageClient({
  category,
  articles,
  trendingArticles,
}: CategoryPageClientProps) {
  const router = useRouter();

  const handleArticleClick = (article: Article) => {
    router.push(`/${article.slug}`);
  };

  return (
    <div className="container-wire py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-mono text-accent uppercase tracking-wider">Wire</span>
          <span className="text-xs text-neutral">/</span>
          <span className="text-xs font-mono text-neutral uppercase tracking-wider">{category}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-headline text-white">
          {category} <span className="text-primary">Wire</span>
        </h1>
        <p className="text-neutral mt-1">
          Latest {category.toLowerCase()} news and updates.
        </p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed */}
        <div className="lg:col-span-2">
          <div className="bg-surface rounded-lg border border-gray-800/50 overflow-hidden">
            <NewsFeed
              brand="saucewire"
              articles={articles}
              onArticleClick={handleArticleClick}
              autoRefreshInterval={30000}
              emptyMessage={`No ${category.toLowerCase()} stories yet. Check back soon.`}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <TrendingSidebar articles={trendingArticles} />
        </div>
      </div>
    </div>
  );
}
