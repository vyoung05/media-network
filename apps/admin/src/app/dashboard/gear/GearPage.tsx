'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-yellow-500/20 text-yellow-400',
};

const GEAR_CATEGORIES = ['Controllers', 'Monitors', 'Headphones', 'Microphones', 'Audio Interfaces', 'MIDI Controllers', 'Drum Machines', 'Synthesizers', 'Software', 'Accessories'];

export function GearPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filterCategory, setFilterCategory] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterCategory) params.set('category', filterCategory);
      const res = await fetch(`/api/gear-reviews?${params}`);
      if (!res.ok) throw new Error('Failed to fetch gear reviews');
      const result = await res.json();
      setReviews(result.data || []);
      setTotalCount(result.count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await fetch(`/api/gear-reviews/${id}`, { method: 'DELETE' });
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) { console.error('Delete failed:', err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gear Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">{loading ? 'Loading...' : `${totalCount} reviews`}</p>
        </div>
        <button onClick={() => router.push('/dashboard/gear/new')} className="admin-btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Review
        </button>
      </div>

      <div className="glass-panel p-4 flex items-center gap-3">
        <span className="text-xs font-mono text-gray-500">Category:</span>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="admin-input text-xs py-1 w-44">
          <option value="">All</option>
          {GEAR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {error && (
        <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchReviews} className="admin-btn-ghost text-xs mt-2">Retry</button>
        </div>
      )}

      {loading && (
        <div className="glass-panel p-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && !error && (
        <div className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Title</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Product</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Brand</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Price</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Rating</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {reviews.map((r, i) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/gear/${r.id}/edit`)}
                  >
                    <td className="px-5 py-4 text-sm font-medium text-white">{r.title}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{r.product || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{r.brand_name || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{r.category || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{r.price ? `$${r.price}` : '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-xs ${s <= (r.rating || 0) ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[r.status] || STATUS_COLORS.draft}`}>{r.status || 'draft'}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="text-gray-500 hover:text-red-400 transition-colors text-xs">Delete</button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {reviews.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-lg font-semibold text-white mb-2">No gear reviews yet</h3>
              <p className="text-sm text-gray-500">Write your first gear review.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
