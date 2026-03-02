'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Producer {
  id: string;
  name: string;
  slug: string;
  location: string;
  genres: string[];
  beat_count: number;
  follower_count: number;
  featured: boolean;
  status: string;
  avatar: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-yellow-500/20 text-yellow-400',
};

export function ProducersPage() {
  const router = useRouter();
  const [producers, setProducers] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  const fetchProducers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/producers?${params}`);
      if (!res.ok) throw new Error('Failed to fetch producers');
      const result = await res.json();
      setProducers(result.data || []);
      setTotalCount(result.count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchProducers();
  }, [fetchProducers]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this producer?')) return;
    try {
      await fetch(`/api/producers/${id}`, { method: 'DELETE' });
      setProducers((prev) => prev.filter((p) => p.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Producers</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `${totalCount} producers`}
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard/producers/new')}
          className="admin-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Producer
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
            placeholder="Search producers by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10 w-full text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchProducers} className="admin-btn-ghost text-xs mt-2">Retry</button>
        </div>
      )}

      {loading && (
        <div className="glass-panel p-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Loading producers...</p>
        </div>
      )}

      {!loading && !error && (
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Name</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Location</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Genres</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Beats</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Followers</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {producers.map((producer, i) => (
                  <motion.tr
                    key={producer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/producers/${producer.id}/edit`)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {producer.avatar ? (
                          <img src={producer.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-xs font-bold text-white">
                            {producer.name?.[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-white">{producer.name}</span>
                          {producer.featured && (
                            <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">⭐ Featured</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{producer.location || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {(producer.genres || []).slice(0, 3).map((g) => (
                          <span key={g} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{g}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{producer.beat_count || 0}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{(producer.follower_count || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[producer.status] || STATUS_COLORS.draft}`}>
                        {producer.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(producer.id); }}
                        className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          </div>

          {producers.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-lg font-semibold text-white mb-2">No producers yet</h3>
              <p className="text-sm text-gray-500">Add your first producer to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
