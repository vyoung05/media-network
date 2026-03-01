'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

interface MagazinePage {
  id: string;
  page_number: number;
  type: string;
  title?: string;
  subtitle?: string;
  content?: string;
  image_url?: string;
  image_alt?: string;
  background_color?: string;
  text_color?: string;
  category?: string;
  pull_quote?: string;
  author?: string;
  author_title?: string;
  artist_name?: string;
  artist_bio?: string;
  artist_links?: Record<string, string>;
  video_url?: string;
  music_embed?: string;
  advertiser_name?: string;
  advertiser_tagline?: string;
  advertiser_cta?: string;
  advertiser_url?: string;
  toc_entries?: { title: string; page: number; category: string }[];
  secondary_image_url?: string;
  tags?: string[];
}

interface MagazineIssue {
  id: string;
  title: string;
  subtitle: string;
  issue_number: number;
  cover_image: string;
  status: string;
  featured_color: string;
  pages: MagazinePage[];
}

const TYPE_LABELS: Record<string, string> = {
  cover: '📰 Cover',
  toc: '📋 Table of Contents',
  article: '📝 Article',
  spread: '🖼️ Spread',
  video: '🎬 Video',
  ad: '📢 Ad',
  artist: '🎤 Artist',
  'full-bleed': '🌅 Full Bleed',
  'back-cover': '📄 Back Cover',
  audio: '🎵 Audio',
  gallery: '🖼️ Gallery',
  'video-ad': '📺 Video Ad',
  interactive: '🎮 Interactive',
  quote: '💬 Quote',
  credits: '📜 Credits',
  letter: '✉️ Letter',
};

function PagePreview({ page, color }: { page: MagazinePage; color: string }) {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ backgroundColor: page.background_color || '#0A0A0A', color: page.text_color || '#FFFFFF' }}
    >
      {/* Background image */}
      {page.image_url && (
        <div className="absolute inset-0">
          <img src={page.image_url} alt={page.image_alt || ''} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      )}

      {/* Content overlay */}
      <div className="relative h-full flex flex-col justify-end p-6">
        {/* Page type badge */}
        <div
          className="absolute top-3 left-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm"
          style={{ backgroundColor: `${color}CC`, color: '#000' }}
        >
          {TYPE_LABELS[page.type] || page.type}
        </div>

        {/* Page number */}
        <div className="absolute top-3 right-3 text-xs font-mono text-white/40">
          Page {page.page_number}
        </div>

        {/* Title */}
        {page.title && (
          <h3 className="text-xl font-bold text-white drop-shadow-lg mb-1">
            {page.title}
          </h3>
        )}

        {/* Subtitle */}
        {(page.subtitle || page.artist_name) && (
          <p className="text-sm text-white/70 drop-shadow mb-1">
            {page.subtitle || page.artist_name}
          </p>
        )}

        {/* Content preview */}
        {page.content && (
          <p className="text-xs text-white/50 line-clamp-3 leading-relaxed">
            {page.content.substring(0, 200)}...
          </p>
        )}

        {/* Pull quote */}
        {page.pull_quote && (
          <blockquote className="mt-2 text-xs italic text-white/60 border-l-2 pl-2" style={{ borderColor: color }}>
            &ldquo;{page.pull_quote.substring(0, 100)}&rdquo;
          </blockquote>
        )}

        {/* Author */}
        {page.author && (
          <p className="mt-2 text-[10px] uppercase tracking-wider text-white/40">
            By {page.author}
          </p>
        )}

        {/* Advertiser */}
        {page.advertiser_name && (
          <div className="mt-2 text-xs text-white/50">
            <span className="uppercase tracking-wider text-[9px]">Sponsored by</span> {page.advertiser_name}
          </div>
        )}

        {/* Music indicator */}
        {page.music_embed && (
          <div className="mt-2 flex items-center gap-1 text-[10px] text-white/40">
            🎵 Has music embed
          </div>
        )}

        {/* Video indicator */}
        {page.video_url && (
          <div className="mt-1 flex items-center gap-1 text-[10px] text-white/40">
            🎬 Has video
          </div>
        )}
      </div>
    </div>
  );
}

export default function MagazinePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<MagazineIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'flip' | 'grid' | 'list'>('flip');
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [issueRes, pagesRes] = await Promise.all([
          fetch(`/api/magazine-issues/${issueId}`),
          fetch(`/api/magazine-issues/${issueId}/pages`),
        ]);
        if (!issueRes.ok) throw new Error('Failed to load issue');
        const issueData = await issueRes.json();
        const pagesData = pagesRes.ok ? await pagesRes.json() : { pages: [] };
        setIssue({
          ...issueData,
          pages: (pagesData.pages || []).sort((a: MagazinePage, b: MagazinePage) => a.page_number - b.page_number),
        });
      } catch (err) {
        console.error('Failed to load preview:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [issueId]);

  const totalPages = issue?.pages.length || 0;

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setDirection(page > currentPage ? 1 : -1);
      setCurrentPage(page);
    }
  }, [totalPages, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPage(currentPage - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToPage, currentPage]);

  const color = issue?.featured_color || '#C9A84C';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: color }} />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="glass-panel p-12 text-center">
        <p className="text-red-400">Issue not found</p>
        <button onClick={() => router.back()} className="admin-btn-ghost text-sm mt-3">Go Back</button>
      </div>
    );
  }

  const pageVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? '40%' : '-40%', opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-40%' : '40%', opacity: 0, scale: 0.95 }),
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/dashboard/magazine/${issueId}/edit`)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              👁️ Preview: {issue.title}
            </h1>
            <p className="text-xs text-gray-500">
              Issue #{issue.issue_number} · {totalPages} pages · {issue.status}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="flex gap-1 bg-white/[0.03] rounded-lg p-1">
            {(['flip', 'grid', 'list'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  viewMode === mode ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {mode === 'flip' ? '📖 Flip' : mode === 'grid' ? '⊞ Grid' : '☰ List'}
              </button>
            ))}
          </div>
          {/* Publish button */}
          {issue.status === 'draft' && (
            <button
              onClick={async () => {
                if (!confirm('Publish this issue? It will be visible on saucecaviar.com.')) return;
                try {
                  await fetch(`/api/magazine-issues/${issueId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'published', published_at: new Date().toISOString() }),
                  });
                  setIssue(prev => prev ? { ...prev, status: 'published' } : prev);
                } catch {}
              }}
              className="admin-btn-primary text-sm flex items-center gap-1.5"
            >
              🚀 Publish
            </button>
          )}
        </div>
      </div>

      {/* Flip View */}
      {viewMode === 'flip' && (
        <div ref={containerRef} className="flex flex-col items-center">
          {/* Page display */}
          <div
            className="relative w-full max-w-2xl aspect-[3/4] rounded-xl overflow-hidden shadow-2xl shadow-black/40 border border-white/[0.06]"
            style={{ perspective: '2000px' }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              {issue.pages[currentPage] && (
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={pageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute inset-0"
                >
                  <PagePreview page={issue.pages[currentPage]} color={color} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav click zones */}
            <div className="absolute inset-0 z-10 flex">
              <button onClick={() => goToPage(currentPage - 1)} className="w-1/4 h-full opacity-0 hover:opacity-100 transition-opacity" disabled={currentPage === 0}>
                <div className="h-full w-full bg-gradient-to-r from-black/20 to-transparent" />
              </button>
              <div className="flex-1" />
              <button onClick={() => goToPage(currentPage + 1)} className="w-1/4 h-full opacity-0 hover:opacity-100 transition-opacity" disabled={currentPage >= totalPages - 1}>
                <div className="h-full w-full bg-gradient-to-l from-black/20 to-transparent" />
              </button>
            </div>
          </div>

          {/* Page navigator */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="flex items-center gap-1">
              {issue.pages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentPage ? 'w-6' : ''
                  }`}
                  style={{ backgroundColor: i === currentPage ? color : 'rgba(255,255,255,0.15)' }}
                />
              ))}
            </div>
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="p-2 text-gray-400 hover:text-white disabled:opacity-30 transition-colors touch-manipulation"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Page {currentPage + 1} of {totalPages} · Arrow keys to navigate
          </p>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {issue.pages.map((page, i) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => { setViewMode('flip'); setCurrentPage(i); }}
              className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer hover:ring-2 transition-all shadow-lg"
              style={{ '--tw-ring-color': color } as any}
            >
              <PagePreview page={page} color={color} />
            </motion.div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {issue.pages.map((page, i) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => { setViewMode('flip'); setCurrentPage(i); }}
              className="glass-panel p-3 flex items-center gap-4 cursor-pointer hover:bg-white/[0.04] transition-colors"
            >
              {/* Thumbnail */}
              <div className="w-16 h-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-900">
                {page.image_url ? (
                  <img src={page.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl" style={{ backgroundColor: `${color}20` }}>
                    {TYPE_LABELS[page.type]?.split(' ')[0] || '📄'}
                  </div>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-gray-600">P{page.page_number}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {TYPE_LABELS[page.type] || page.type}
                  </span>
                </div>
                <p className="text-sm text-white font-medium truncate mt-0.5">{page.title || '(Untitled)'}</p>
                {page.content && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">{page.content.substring(0, 80)}...</p>
                )}
              </div>
              <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
