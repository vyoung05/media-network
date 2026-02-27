'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { Article, Brand } from '@media-network/shared';
import { ArticleCard } from './ArticleCard';

interface NewsFeedProps {
  brand: Brand;
  articles: Article[];
  category?: string | null;
  autoRefreshInterval?: number; // ms, 0 to disable
  onLoadMore?: () => Promise<Article[]>;
  onArticleClick?: (article: Article) => void;
  onCategoryClick?: (category: string) => void;
  loading?: boolean;
  hasMore?: boolean;
  emptyMessage?: string;
}

export function NewsFeed({
  articles: initialArticles,
  category,
  autoRefreshInterval = 30000,
  onLoadMore,
  onArticleClick,
  onCategoryClick,
  loading = false,
  hasMore = true,
  emptyMessage = 'No articles found.',
}: NewsFeedProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const feedTopRef = useRef<HTMLDivElement>(null);
  const lastRefreshRef = useRef<Date>(new Date());

  // Update articles when initialArticles changes
  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  // Auto-refresh indicator (simulated — real implementation would poll the API)
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;

    const interval = setInterval(() => {
      // In production, this would fetch new articles from the API
      // For now, we just update the last refresh time
      lastRefreshRef.current = new Date();
      // Simulate occasional new articles notification
      if (Math.random() > 0.7) {
        setNewCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      }
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshInterval]);

  const handleShowNew = useCallback(() => {
    setNewCount(0);
    feedTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const moreArticles = await onLoadMore();
      setArticles(prev => [...prev, ...moreArticles]);
    } catch (err) {
      console.error('Failed to load more articles:', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [onLoadMore, isLoadingMore]);

  // Filter by category if provided
  const filteredArticles = category
    ? articles.filter(a => a.category === category)
    : articles;

  return (
    <div className="relative">
      <div ref={feedTopRef} />

      {/* New articles notification */}
      {newCount > 0 && (
        <button
          onClick={handleShowNew}
          className="sticky top-0 z-20 w-full py-2 bg-accent text-white text-sm font-semibold text-center hover:bg-accent/90 transition-colors"
        >
          {newCount} new {newCount === 1 ? 'article' : 'articles'} — Click to refresh
        </button>
      )}

      {/* Live indicator */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-mono text-neutral uppercase tracking-wider">
            Live Feed
          </span>
        </div>
        <span className="text-xs font-mono text-neutral">
          {filteredArticles.length} stories
        </span>
      </div>

      {/* Loading state */}
      {loading && filteredArticles.length === 0 && (
        <div className="py-16 text-center">
          <div className="inline-flex items-center gap-3 text-neutral">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-mono">Loading feed...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredArticles.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-neutral text-sm">{emptyMessage}</p>
        </div>
      )}

      {/* Articles */}
      <div className="divide-y divide-gray-800/50">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="wire"
            onClick={onArticleClick}
            onCategoryClick={onCategoryClick}
            href={`/${article.slug}`}
          />
        ))}
      </div>

      {/* Load more */}
      {hasMore && filteredArticles.length > 0 && (
        <div className="py-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-8 py-3 bg-surface text-white font-semibold rounded-lg hover:bg-surface/80 transition-colors disabled:opacity-50"
          >
            {isLoadingMore ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
