'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Article } from '@media-network/shared';
import { formatDate, timeAgo, formatNumber } from '@media-network/shared';
import { ArticleCard } from '@media-network/ui';
import { TrendingSidebar } from '@/components/TrendingSidebar';
import { AudioPlayer } from '@/components/AudioPlayer';
import { TextReveal } from '@/components/TextReveal';

interface ArticlePageClientProps {
  article: Article;
  relatedArticles: Article[];
  trendingArticles: Article[];
  audioUrl?: string | null;
}

export function ArticlePageClient({
  article,
  relatedArticles,
  trendingArticles,
  audioUrl,
}: ArticlePageClientProps) {
  const router = useRouter();

  return (
    <div className="container-wire py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Article content */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-neutral mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link
              href={`/category/${article.category.toLowerCase()}`}
              className="hover:text-accent transition-colors"
            >
              {article.category}
            </Link>
          </nav>

          {/* Breaking badge */}
          {article.is_breaking && (
            <div className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-xs font-bold rounded mb-4 animate-pulse">
              <span className="mr-2">⚡</span> BREAKING NEWS
            </div>
          )}

          {/* Title — animated with TextReveal */}
          <TextReveal
            text={article.title}
            as="h1"
            className="text-3xl md:text-4xl lg:text-5xl font-headline text-white leading-tight mb-4"
            speed={20}
            triggerOnView={false}
          />

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutral mb-6 pb-6 border-b border-gray-800">
            {article.author && (
              <span>
                By <span className="text-accent font-semibold">{article.author.name}</span>
              </span>
            )}
            {article.published_at && (
              <>
                <span className="text-gray-700">|</span>
                <span className="font-mono">{formatDate(article.published_at)}</span>
                <span className="text-gray-700">|</span>
                <span className="font-mono">{timeAgo(article.published_at)}</span>
              </>
            )}
            <span className="text-gray-700">|</span>
            <span className="font-mono">{article.reading_time_minutes} min read</span>
            <span className="text-gray-700">|</span>
            <span className="font-mono">{formatNumber(article.view_count)} views</span>
            {article.is_ai_generated && (
              <>
                <span className="text-gray-700">|</span>
                <span className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent px-2 py-0.5 rounded font-mono">
                  🤖 AI-assisted
                </span>
              </>
            )}
          </div>

          {/* Audio Player */}
          <div className="mb-8">
            <AudioPlayer
              src={audioUrl || undefined}
              title={article.title}
              duration={`${article.reading_time_minutes} min listen`}
              brand="saucewire"
            />
          </div>

          {/* Cover image */}
          {article.cover_image && (
            <div className="relative aspect-video rounded-lg overflow-hidden mb-8">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-lg text-neutral font-semibold mb-6 pl-4 border-l-4 border-primary">
              {article.excerpt}
            </p>
          )}

          {/* Body */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-headline
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-l-primary prose-blockquote:text-neutral
              prose-strong:text-white
              prose-p:text-gray-300 prose-p:leading-relaxed
            "
            dangerouslySetInnerHTML={{ __html: article.body }}
          />

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-800">
              <h4 className="text-xs font-mono text-neutral uppercase tracking-wider mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-surface text-neutral text-xs font-mono rounded hover:text-white hover:bg-surface/80 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Source attribution */}
          {article.source_url && (
            <div className="mt-6 p-4 bg-surface rounded-lg border border-gray-800/50">
              <p className="text-xs font-mono text-neutral">
                Source:{' '}
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {new URL(article.source_url).hostname}
                </a>
              </p>
            </div>
          )}

          {/* Share */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <h4 className="text-xs font-mono text-neutral uppercase tracking-wider mb-3">Share</h4>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const url = window.location.href;
                  const text = article.title;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                }}
                className="px-4 py-2 bg-surface text-neutral hover:text-white rounded transition-colors text-sm"
              >
                𝕏 Post
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="px-4 py-2 bg-surface text-neutral hover:text-white rounded transition-colors text-sm"
              >
                📋 Copy Link
              </button>
            </div>
          </div>

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-12 pt-8 border-t border-gray-800">
              <h3 className="text-xl font-headline text-white mb-6">
                More in <span className="text-primary">{article.category}</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.map((related) => (
                  <ArticleCard
                    key={related.id}
                    article={related}
                    variant="default"
                    onClick={() => router.push(`/${related.slug}`)}
                  />
                ))}
              </div>
            </section>
          )}
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <TrendingSidebar articles={trendingArticles} />
        </aside>
      </div>
    </div>
  );
}
