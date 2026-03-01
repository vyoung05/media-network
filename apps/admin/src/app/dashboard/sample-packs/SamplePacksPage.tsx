'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-yellow-500/20 text-yellow-400',
};

export function SamplePacksPage() {
  const router = useRouter();
  const [packs, setPacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPacks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sample-packs');
      if (!res.ok) throw new Error('Failed to fetch sample packs');
      const result = await res.json();
      setPacks(result.data || []);
      setTotalCount(result.count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPacks(); }, [fetchPacks]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this sample pack?')) return;
    try {
      await fetch(`/api/sample-packs/${id}`, { method: 'DELETE' });
      setPacks((prev) => prev.filter((p) => p.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) { console.error('Delete failed:', err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Sample Packs</h1>
          <p className="text-sm text-gray-500 mt-1">{loading ? 'Loading...' : `${totalCount} packs`}</p>
        </div>
        <button onClick={() => router.push('/dashboard/sample-packs/new')} className="admin-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Pack
        </button>
      </div>

      {error && (
        <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchPacks} className="admin-btn-ghost text-xs mt-2">Retry</button>
        </div>
      )}

      {loading && (
        <div className="glass-panel p-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}

      {!loading && !error && (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Title</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Creator</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Price</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Samples</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Rating</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Downloads</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {packs.map((pack, i) => (
                  <motion.tr
                    key={pack.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/sample-packs/${pack.id}/edit`)}
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-white">{pack.title}</span>
                      {pack.is_free && <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">FREE</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{pack.creator || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{pack.is_free ? 'Free' : pack.price ? `$${pack.price}` : '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{pack.sample_count || 0}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`text-xs ${s <= (pack.rating || 0) ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{(pack.downloads || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[pack.status] || STATUS_COLORS.draft}`}>{pack.status || 'draft'}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(pack.id); }} className="text-gray-500 hover:text-red-400 transition-colors text-xs">Delete</button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          </div>

          {packs.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-white mb-2">No sample packs yet</h3>
              <p className="text-sm text-gray-500">Add your first sample pack.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
