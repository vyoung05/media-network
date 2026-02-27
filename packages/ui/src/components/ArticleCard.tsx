'use client';

import React from 'react';
import type { Article } from '@media-network/shared';
import { timeAgo, truncate } from '@media-network/shared';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'compact' | 'featured' | 'wire';
  showCategory?: boolean;
  showAuthor?: boolean;
  showTimestamp?: boolean;
  onCategoryClick?: (category: string) => void;
  onClick?: (article: Article) => void;
  href?: string;
}

export function ArticleCard({
  article,
  variant = 'default',
  showCategory = true,
  showAuthor = true,
  showTimestamp = true,
  onCategoryClick,
  onClick,
  href,
}: ArticleCardProps) {
  const handleClick = () => {
    if (onClick) onClick(article);
  };

  const Wrapper = href ? 'a' : 'div';
  const wrapperProps = href
    ? { href, className: 'block' }
    : { onClick: handleClick, className: 'cursor-pointer block' };

  if (variant === 'wire') {
    return (
      <Wrapper {...wrapperProps}>
        <div className="group border-b border-gray-800 py-4 px-4 hover:bg-surface/50 transition-all duration-200">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {article.is_breaking && (
                  <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded animate-pulse">
                    BREAKING
                  </span>
                )}
                {showCategory && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCategoryClick?.(article.category);
                    }}
                    className="text-xs font-mono text-accent uppercase tracking-wider hover:underline"
                  >
                    {article.category}
                  </button>
                )}
                {showTimestamp && article.published_at && (
                  <span className="text-xs font-mono text-neutral">
                    {timeAgo(article.published_at)}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors line-clamp-2">
                {article.title}
              </h3>
              {article.excerpt && (
                <p className="text-sm text-neutral mt-1 line-clamp-2">
                  {truncate(article.excerpt, 160)}
                </p>
              )}
              {showAuthor && article.author && (
                <p className="text-xs text-neutral mt-1">
                  By <span className="text-accent">{article.author.name}</span>
                  {article.reading_time_minutes && (
                    <> · {article.reading_time_minutes} min read</>
                  )}
                </p>
              )}
            </div>
            {article.cover_image && (
              <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden">
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
          </div>
        </div>
      </Wrapper>
    );
  }

  if (variant === 'compact') {
    return (
      <Wrapper {...wrapperProps}>
        <div className="group flex items-center gap-3 py-2 px-3 hover:bg-surface/50 transition-colors rounded">
          <span className="text-2xl font-bold text-neutral/30 font-mono select-none">
            {/* Rank number if needed */}
          </span>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">
              {article.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-neutral">
              {showCategory && <span>{article.category}</span>}
              {showTimestamp && article.published_at && (
                <span className="font-mono">{timeAgo(article.published_at)}</span>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (variant === 'featured') {
    return (
      <Wrapper {...wrapperProps}>
        <div className="group relative overflow-hidden rounded-lg bg-surface transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
          {article.cover_image && (
            <div className="relative aspect-[16/9] overflow-hidden">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  {article.is_breaking && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded animate-pulse">
                      BREAKING
                    </span>
                  )}
                  {showCategory && (
                    <span className="text-xs font-mono text-accent uppercase tracking-wider">
                      {article.category}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 line-clamp-3">
                  {article.title}
                </h2>
                {article.excerpt && (
                  <p className="text-sm text-gray-300 line-clamp-2">{article.excerpt}</p>
                )}
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  {showAuthor && article.author && (
                    <span>By {article.author.name}</span>
                  )}
                  {showTimestamp && article.published_at && (
                    <span className="font-mono">{timeAgo(article.published_at)}</span>
                  )}
                </div>
              </div>
            </div>
          )}
          {!article.cover_image && (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                {showCategory && (
                  <span className="text-xs font-mono text-accent uppercase tracking-wider">
                    {article.category}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-black text-white mb-2">{article.title}</h2>
              {article.excerpt && (
                <p className="text-sm text-neutral">{article.excerpt}</p>
              )}
            </div>
          )}
        </div>
      </Wrapper>
    );
  }

  // Default variant with hover lift + shadow depth
  return (
    <Wrapper {...wrapperProps}>
      <div className="group bg-surface rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 hover:ring-1 hover:ring-primary/20">
        {article.cover_image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={article.cover_image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            {article.is_breaking && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-bold bg-red-600 text-white rounded animate-pulse">
                BREAKING
              </span>
            )}
            {showCategory && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCategoryClick?.(article.category);
                }}
                className="text-xs font-mono text-accent uppercase tracking-wider hover:underline"
              >
                {article.category}
              </button>
            )}
            {showTimestamp && article.published_at && (
              <span className="text-xs font-mono text-neutral ml-auto">
                {timeAgo(article.published_at)}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors mb-1 line-clamp-2">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-sm text-neutral line-clamp-2">{article.excerpt}</p>
          )}
          {showAuthor && article.author && (
            <p className="text-xs text-neutral mt-3">
              By <span className="text-accent">{article.author.name}</span>
              {article.reading_time_minutes && (
                <> · {article.reading_time_minutes} min read</>
              )}
            </p>
          )}
        </div>
      </div>
    </Wrapper>
  );
}
