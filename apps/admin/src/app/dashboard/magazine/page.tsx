'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-yellow-500/20 text-yellow-400',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  published: 'Published',
  archived: 'Archived',
};

interface MagazineIssue {
  id: string;
  slug: string;
  title: string;
  issue_number: number;
  subtitle: string;
  description: string;
  cover_image: string;
  published_at: string | null;
  status: 'draft' | 'published' | 'archived';
  page_count: number;
  featured_color: string;
  season: string;
  created_at: string;
}

export default function MagazineIssuesPage() {
  const router = useRouter();
  const [issues, setIssues] = useState<MagazineIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/magazine-issues?${params}`);
      if (!res.ok) throw new Error('Failed to fetch magazine issues');
      const result = await res.json();
      setIssues(result.data || []);
      setTotalCount(result.count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchIssues(); }, [fetchIssues]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this magazine issue? All pages will also be deleted.')) return;
    try {
      const res = await fetch(`/api/magazine-issues/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setIssues((prev) => prev.filter((i) => i.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-[#C9A84C]">📖</span> Magazine Issues
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `${totalCount} issue${totalCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/magazine/new')}
          className="admin-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto touch-manipulation"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Issue
        </button>
      </div>

      {/* Search */}
      <div className="glass-panel p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10 w-full text-sm"
          />
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchIssues} className="admin-btn-ghost text-xs mt-2">Retry</button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="glass-panel p-12 text-center">
          <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {/* Issues grid */}
      {!loading && !error && (
        <>
          {issues.length === 0 ? (
            <div className="glass-panel p-12 text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-lg font-semibold text-white mb-2">No magazine issues yet</h3>
              <p className="text-sm text-gray-500 mb-4">Create your first SauceCaviar magazine issue.</p>
              <button
                onClick={() => router.push('/dashboard/magazine/new')}
                className="admin-btn-primary inline-flex items-center gap-2 touch-manipulation"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create First Issue
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {issues.map((issue, i) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => router.push(`/dashboard/magazine/${issue.id}/edit`)}
                    className="glass-panel overflow-hidden cursor-pointer hover:bg-white/[0.04] active:bg-white/[0.06] transition-all duration-200 group touch-manipulation"
                  >
                    {/* Cover image */}
                    <div className="relative aspect-[3/2] bg-gray-900 overflow-hidden">
                      {issue.cover_image ? (
                        <img
                          src={issue.cover_image}
                          alt={issue.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: issue.featured_color || '#C9A84C' }}
                        >
                          <span className="text-4xl opacity-50">📖</span>
                        </div>
                      )}
                      {/* Issue number badge */}
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold text-white backdrop-blur-sm"
                        style={{ backgroundColor: `${issue.featured_color || '#C9A84C'}CC` }}
                      >
                        Issue #{issue.issue_number}
                      </div>
                      {/* Status badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm ${STATUS_COLORS[issue.status]}`}>
                          {STATUS_LABELS[issue.status]}
                        </span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-4">
                      <h3 className="text-base font-semibold text-white truncate">{issue.title}</h3>
                      {issue.subtitle && (
                        <p className="text-sm text-gray-400 mt-0.5 truncate">{issue.subtitle}</p>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            📄 {issue.page_count} page{issue.page_count !== 1 ? 's' : ''}
                          </span>
                          {issue.season && (
                            <span className="flex items-center gap-1">
                              🗓 {issue.season}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleDelete(issue.id, e)}
                          className="text-gray-600 hover:text-red-400 active:text-red-300 transition-colors p-1 -mr-1 touch-manipulation"
                          title="Delete issue"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  );
}
