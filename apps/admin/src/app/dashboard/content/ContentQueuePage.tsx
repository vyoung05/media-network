'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useBrand } from '@/contexts/BrandContext';
import type { Article, Brand } from '@media-network/shared';
import { timeAgo } from '@media-network/shared';

const BRAND_COLORS: Record<Brand, string> = {
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  saucewire: '#E63946',
  trapfrequency: '#39FF14',
};

const BRAND_NAMES: Record<Brand, string> = {
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  saucewire: 'SauceWire',
  trapfrequency: 'TrapFrequency',
};

export function ContentQueuePage() {
  const { activeBrand } = useBrand();
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'ai' | 'human'>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('status', 'pending_review');
      if (activeBrand !== 'all') params.set('brand', activeBrand);
      params.set('per_page', '50');

      const res = await fetch(`/api/content?${params}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const result = await res.json();
      let data: Article[] = result.data || [];

      // Client-side filter for AI/human
      if (filterType === 'ai') {
        data = data.filter((a) => a.is_ai_generated);
      } else if (filterType === 'human') {
        data = data.filter((a) => !a.is_ai_generated);
      }

      setArticles(data);
      setTotalCount(result.count || 0);
    } catch (err: any) {
      console.error('Error fetching content queue:', err);
      setError(err.message || 'Failed to load content queue');
    } finally {
      setLoading(false);
    }
  }, [activeBrand, filterType]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleStatusChange = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/content/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) {
      console.error('Error updating article status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Queue</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `${totalCount} articles pending review${activeBrand !== 'all' ? ` for ${BRAND_NAMES[activeBrand]}` : ''}`}
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/content/new')}
          className="admin-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Type:</span>
          <div className="flex gap-1">
            {(['all', 'ai', 'human'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterType === type ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {type === 'ai' ? '🤖 AI' : type === 'human' ? '✍️ Human' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm text-red-400 font-medium">Failed to load content queue</p>
              <p className="text-xs text-gray-500 mt-0.5">{error}</p>
            </div>
            <button onClick={fetchArticles} className="ml-auto admin-btn-ghost text-xs">Retry</button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="glass-panel p-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Loading content queue...</p>
        </div>
      )}

      {/* Queue list */}
      {!loading && !error && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {articles.map((article, i) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.03 }}
                className="glass-panel p-5 hover:bg-admin-hover/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: BRAND_COLORS[article.brand] }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-700">•</span>
                        <span className="text-xs font-mono" style={{ color: BRAND_COLORS[article.brand] }}>
                          {BRAND_NAMES[article.brand]}
                        </span>
                        {article.is_ai_generated && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                            🤖 AI
                          </span>
                        )}
                        {(article as any).scheduled_publish_at && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono flex items-center gap-1">
                            🕐 Scheduled {new Date((article as any).scheduled_publish_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1">{article.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 sm:line-clamp-1">{article.excerpt}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                        <span>By {article.author?.name || 'Unknown'}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {article.created_at ? timeAgo(article.created_at) : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 sm:ml-0 ml-7">
                    <button
                      onClick={() => handleStatusChange(article.id, 'published')}
                      disabled={actionLoading === article.id}
                      className="admin-btn-success px-4 py-2 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 flex-1 sm:flex-initial min-h-[44px] sm:min-h-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(article.id, 'archived')}
                      disabled={actionLoading === article.id}
                      className="admin-btn-danger px-4 py-2 text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 flex-1 sm:flex-initial min-h-[44px] sm:min-h-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Reject
                    </button>
                    <button
                      onClick={() => router.push(`/dashboard/content/${article.id}/edit`)}
                      className="admin-btn-ghost px-3 py-2 text-xs min-h-[44px] sm:min-h-0"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {articles.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-12 text-center"
            >
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-white mb-2">Queue is clear!</h3>
              <p className="text-sm text-gray-500">
                No articles pending review. Create a new article or wait for the AI pipeline.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
