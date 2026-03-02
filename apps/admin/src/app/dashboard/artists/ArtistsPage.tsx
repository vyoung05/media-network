'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-yellow-500/20 text-yellow-400',
};

export function ArtistsPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/artists?${params}`);
      if (!res.ok) throw new Error('Failed to fetch artists');
      const result = await res.json();
      setArtists(result.data || []);
      setTotalCount(result.count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchArtists(); }, [fetchArtists]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this artist?')) return;
    try {
      await fetch(`/api/artists/${id}`, { method: 'DELETE' });
      setArtists((prev) => prev.filter((a) => a.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) { console.error('Delete failed:', err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Artists</h1>
          <p className="text-sm text-gray-500 mt-1">{loading ? 'Loading...' : `${totalCount} artists`}</p>
        </div>
        <button onClick={() => router.push('/dashboard/artists/new')} className="admin-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Artist
        </button>
      </div>

      <div className="glass-panel p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-10 w-full text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchArtists} className="admin-btn-ghost text-xs mt-2">Retry</button>
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
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Name</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Region / City</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Genres</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Glow Score</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Listeners</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Badges</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {artists.map((artist, i) => (
                  <motion.tr
                    key={artist.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/artists/${artist.id}/edit`)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {artist.avatar ? (
                          <img src={artist.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-xs font-bold text-white">
                            {artist.name?.[0]?.toUpperCase() || '?'}
                          </div>
                        )}
                        <span className="text-sm font-medium text-white">{artist.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{[artist.region, artist.city].filter(Boolean).join(' / ') || '—'}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {(artist.genres || []).slice(0, 3).map((g: string) => (
                          <span key={g} className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-gray-400">{g}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${artist.glow_score || 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-400 font-mono">{artist.glow_score || 0}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{(artist.monthly_listeners || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        {artist.is_featured && <span className="text-xs px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">⭐</span>}
                        {artist.is_daily_pick && <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">📅</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[artist.status] || STATUS_COLORS.draft}`}>{artist.status || 'draft'}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(artist.id); }} className="text-gray-500 hover:text-red-400 transition-colors text-xs">Delete</button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          </div>

          {artists.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">🎤</div>
              <h3 className="text-lg font-semibold text-white mb-2">No artists yet</h3>
              <p className="text-sm text-gray-500">Add your first artist to the TrapGlow roster.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
