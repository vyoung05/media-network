'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-yellow-500/20 text-yellow-400',
};

export function BeatsPage() {
  const router = useRouter();
  const [beats, setBeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchBeats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/beats');
      if (!res.ok) throw new Error('Failed to fetch beats');
      const result = await res.json();
      setBeats(result.data || []);
      setTotalCount(result.count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBeats(); }, [fetchBeats]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this beat?')) return;
    try {
      await fetch(`/api/beats/${id}`, { method: 'DELETE' });
      setBeats((prev) => prev.filter((b) => b.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) { console.error('Delete failed:', err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Beats</h1>
          <p className="text-sm text-gray-500 mt-1">{loading ? 'Loading...' : `${totalCount} beats`}</p>
        </div>
        <button onClick={() => router.push('/dashboard/beats/new')} className="admin-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Beat
        </button>
      </div>

      {error && (
        <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchBeats} className="admin-btn-ghost text-xs mt-2">Retry</button>
        </div>
      )}

      {loading && (
        <div className="glass-panel p-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Loading beats...</p>
        </div>
      )}

      {!loading && !error && (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Title</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Producer</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">BPM</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Key</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Genre</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Plays</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {beats.map((beat, i) => (
                  <motion.tr
                    key={beat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/beats/${beat.id}/edit`)}
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-white">{beat.title}</span>
                      {beat.is_featured && <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">⭐</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{beat.producer?.name || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{beat.bpm || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{beat.key || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">{beat.genre || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{(beat.plays || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[beat.status] || STATUS_COLORS.draft}`}>
                        {beat.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(beat.id); }} className="text-gray-500 hover:text-red-400 transition-colors text-xs">Delete</button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          </div>

          {beats.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🎧</div>
              <h3 className="text-lg font-semibold text-white mb-2">No beats yet</h3>
              <p className="text-sm text-gray-500">Upload your first beat to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
