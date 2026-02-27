'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Article } from '@media-network/shared';
import { SAUCEWIRE_CATEGORIES, timeAgo, formatDate } from '@media-network/shared';
import { ArticleCard } from '@media-network/ui';

interface ArchivePageClientProps {
  articles: Article[];
}

export function ArchivePageClient({ articles }: ArchivePageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.excerpt && a.excerpt.toLowerCase().includes(q)) ||
          a.tags.some((t) => t.includes(q)) ||
          a.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter(
        (a) => a.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.published_at || b.created_at).getTime() -
            new Date(a.published_at || a.created_at).getTime()
        );
        break;
      case 'oldest':
        result.sort(
          (a, b) =>
            new Date(a.published_at || a.created_at).getTime() -
            new Date(b.published_at || b.created_at).getTime()
        );
        break;
      case 'popular':
        result.sort((a, b) => b.view_count - a.view_count);
        break;
    }

    return result;
  }, [articles, searchQuery, selectedCategory, sortBy]);

  const handleArticleClick = (article: Article) => {
    router.push(`/${article.slug}`);
  };

  const handleCategoryClick = (category: string) => {
    router.push(`/category/${category.toLowerCase()}`);
  };

  return (
    <div className="container-wire py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline text-white mb-2">Archive</h1>
        <p className="text-neutral font-mono text-sm">
          Browse all SauceWire stories — {articles.length} articles
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-surface rounded-lg border border-gray-800/50 p-4 mb-6 space-y-4">
        {/* Search input */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search articles, topics, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-wire pl-10"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
                !selectedCategory
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-neutral hover:text-white'
              }`}
            >
              All
            </button>
            {SAUCEWIRE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat ? null : cat
                  )
                }
                className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-neutral hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-1.5 bg-secondary border border-gray-700 rounded text-sm text-neutral font-mono focus:outline-none focus:border-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center bg-secondary rounded overflow-hidden border border-gray-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-primary text-white' : 'text-neutral hover:text-white'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-primary text-white' : 'text-neutral hover:text-white'
              }`}
              aria-label="List view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-mono text-neutral">
          {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
          {searchQuery && (
            <span>
              {' '}
              for &ldquo;<span className="text-accent">{searchQuery}</span>&rdquo;
            </span>
          )}
          {selectedCategory && (
            <span>
              {' '}
              in <span className="text-primary">{selectedCategory}</span>
            </span>
          )}
        </p>
        {(searchQuery || selectedCategory) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}
            className="text-xs font-mono text-accent hover:text-primary transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Articles grid/list */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-lg border border-gray-800/50">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-bold text-white mb-2">No articles found</h3>
          <p className="text-sm text-neutral mb-4">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory(null);
            }}
            className="btn-primary text-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="default"
              onClick={handleArticleClick}
              onCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-lg border border-gray-800/50 overflow-hidden divide-y divide-gray-800/50">
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="wire"
              onClick={handleArticleClick}
              onCategoryClick={handleCategoryClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
