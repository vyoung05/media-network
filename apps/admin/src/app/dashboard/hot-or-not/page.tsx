'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist_name: string;
  album: string | null;
  cover_image: string | null;
  preview_url: string | null;
  spotify_url: string | null;
  apple_music_url: string | null;
  soundcloud_url: string | null;
  youtube_url: string | null;
  genre: string | null;
  status: 'active' | 'archived' | 'featured';
  hot_count: number;
  not_count: number;
  total_votes: number;
  hot_percentage: number;
  issue_id: string | null;
  issue?: { id: string; title: string; issue_number: number } | null;
  featured_at: string | null;
  created_at: string;
}

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  featured: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  archived: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function HotOrNotPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState('hot_percentage');

  const fetchTracks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ sort: sortBy });
      if (filter !== 'all') params.set('status', filter);
      const res = await fetch(`/api/tracks?${params}`);
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, sortBy]);

  useEffect(() => { fetchTracks(); }, [fetchTracks]);

  const handleStatusChange = async (track: Track, newStatus: string) => {
    try {
      await fetch(`/api/tracks/${track.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTracks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (track: Track) => {
    if (!confirm(`Delete "${track.title}" by ${track.artist_name}?`)) return;
    try {
      await fetch(`/api/tracks/${track.id}`, { method: 'DELETE' });
      fetchTracks();
    } catch (err) {
      console.error(err);
    }
  };

  const totalVotes = tracks.reduce((sum, t) => sum + t.total_votes, 0);
  const avgHot = tracks.length > 0 ? Math.round(tracks.reduce((sum, t) => sum + t.hot_percentage, 0) / tracks.length) : 0;
  const hottestTrack = tracks.length > 0 ? tracks.reduce((a, b) => a.hot_percentage > b.hot_percentage ? a : b) : null;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            🔥 Hot or Not
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track voting results & management — SauceCaviar magazine
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="admin-btn-primary px-3 sm:px-4 py-2 sm:py-2.5 flex items-center gap-2 text-sm flex-shrink-0 touch-manipulation"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add Track</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <div className="glass-panel p-3 sm:p-4">
          <p className="text-xs font-mono text-gray-500 uppercase mb-1">Total Tracks</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{tracks.length}</p>
        </div>
        <div className="glass-panel p-3 sm:p-4">
          <p className="text-xs font-mono text-gray-500 uppercase mb-1">Total Votes</p>
          <p className="text-xl sm:text-2xl font-bold text-white">{totalVotes}</p>
        </div>
        <div className="glass-panel p-3 sm:p-4">
          <p className="text-xs font-mono text-gray-500 uppercase mb-1">Avg Hot %</p>
          <p className="text-xl sm:text-2xl font-bold" style={{ color: '#C9A84C' }}>{avgHot}%</p>
        </div>
        <div className="glass-panel p-3 sm:p-4">
          <p className="text-xs font-mono text-gray-500 uppercase mb-1">🔥 Hottest</p>
          <p className="text-sm font-bold text-white truncate">{hottestTrack?.title || '—'}</p>
          <p className="text-xs text-gray-500 truncate">{hottestTrack?.artist_name || ''}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-0.5 p-1 rounded-lg bg-white/5 overflow-x-auto">
          {['all', 'active', 'featured', 'archived'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap touch-manipulation transition-all ${
                filter === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300 active:text-gray-300'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="admin-input text-xs py-1.5 px-2 w-auto"
        >
          <option value="hot_percentage">Sort: Hottest</option>
          <option value="total_votes">Sort: Most Voted</option>
          <option value="created_at">Sort: Newest</option>
        </select>
      </div>

      {/* Track List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tracks.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <p className="text-4xl mb-4">🎵</p>
          <p className="text-gray-400 mb-2">No tracks yet</p>
          <p className="text-sm text-gray-600">Add tracks for readers to vote on</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tracks.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel p-4"
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Cover */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                  {track.cover_image ? (
                    <img src={track.cover_image} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">🎵</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">{track.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-400 truncate">{track.artist_name}{track.album ? ` · ${track.album}` : ''}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${STATUS_STYLES[track.status]}`}>
                          {track.status}
                        </span>
                        {track.genre && <span className="text-xs text-gray-500">{track.genre}</span>}
                        {track.issue && <span className="text-xs text-gray-600">Issue #{track.issue.issue_number}</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {track.status === 'active' && (
                        <button
                          onClick={() => handleStatusChange(track, 'featured')}
                          className="p-2 text-gray-400 hover:text-yellow-400 active:text-yellow-400 rounded-lg hover:bg-yellow-500/10 touch-manipulation"
                          title="Feature this track"
                        >
                          ⭐
                        </button>
                      )}
                      {track.status === 'featured' && (
                        <button
                          onClick={() => handleStatusChange(track, 'active')}
                          className="p-2 text-yellow-400 hover:text-gray-400 rounded-lg hover:bg-white/5 touch-manipulation"
                          title="Unfeature"
                        >
                          ⭐
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(track, track.status === 'archived' ? 'active' : 'archived')}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 touch-manipulation"
                        title={track.status === 'archived' ? 'Reactivate' : 'Archive'}
                      >
                        {track.status === 'archived' ? '♻️' : '📦'}
                      </button>
                      <button
                        onClick={() => handleDelete(track)}
                        className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 touch-manipulation"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Vote Bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-orange-400 font-bold">🔥 {track.hot_count} hot</span>
                      <span className="text-gray-500">{track.total_votes} total votes</span>
                      <span className="text-blue-400 font-bold">❄️ {track.not_count} not</span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
                      <div
                        className="h-full rounded-l-full transition-all duration-500"
                        style={{
                          width: `${track.hot_percentage}%`,
                          background: 'linear-gradient(90deg, #f97316, #ef4444)',
                        }}
                      />
                      <div
                        className="h-full rounded-r-full transition-all duration-500"
                        style={{
                          width: `${100 - track.hot_percentage}%`,
                          background: 'linear-gradient(90deg, #3b82f6, #6366f1)',
                        }}
                      />
                    </div>
                    <p className="text-center text-xs font-bold mt-1" style={{ color: track.hot_percentage >= 50 ? '#f97316' : '#3b82f6' }}>
                      {track.hot_percentage}% HOT
                    </p>
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {track.spotify_url && (
                      <a href={track.spotify_url} target="_blank" rel="noopener" className="text-xs text-green-400 hover:underline">Spotify</a>
                    )}
                    {track.apple_music_url && (
                      <a href={track.apple_music_url} target="_blank" rel="noopener" className="text-xs text-pink-400 hover:underline">Apple Music</a>
                    )}
                    {track.soundcloud_url && (
                      <a href={track.soundcloud_url} target="_blank" rel="noopener" className="text-xs text-orange-400 hover:underline">SoundCloud</a>
                    )}
                    {track.youtube_url && (
                      <a href={track.youtube_url} target="_blank" rel="noopener" className="text-xs text-red-400 hover:underline">YouTube</a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Track Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddTrackModal
            onClose={() => setShowAddModal(false)}
            onSaved={() => { setShowAddModal(false); fetchTracks(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ======================== ADD TRACK MODAL ========================

function AddTrackModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: '', artist_name: '', album: '', cover_image: '', preview_url: '',
    spotify_url: '', apple_music_url: '', soundcloud_url: '', youtube_url: '', genre: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/tracks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="glass-panel w-full max-w-lg sm:mx-4 p-5 sm:p-6 max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white mb-1">🔥 Add Track</h2>
        <p className="text-xs text-gray-500 mb-4">Add a song for readers to vote hot or not</p>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Song Title *</label>
              <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} className="admin-input text-sm" placeholder="Song name" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Artist *</label>
              <input type="text" value={form.artist_name} onChange={(e) => update('artist_name', e.target.value)} className="admin-input text-sm" placeholder="Artist name" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Album</label>
              <input type="text" value={form.album} onChange={(e) => update('album', e.target.value)} className="admin-input text-sm" placeholder="Album name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Genre</label>
              <input type="text" value={form.genre} onChange={(e) => update('genre', e.target.value)} className="admin-input text-sm" placeholder="Hip-Hop, R&B, etc." />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Cover Image URL</label>
            <input type="url" value={form.cover_image} onChange={(e) => update('cover_image', e.target.value)} className="admin-input text-sm" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Preview Audio URL</label>
            <input type="url" value={form.preview_url} onChange={(e) => update('preview_url', e.target.value)} className="admin-input text-sm" placeholder="Direct MP3/audio URL for in-magazine playback" />
          </div>

          <p className="text-xs font-mono text-gray-600 uppercase pt-2">Streaming Links</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-green-400 mb-1">Spotify</label>
              <input type="url" value={form.spotify_url} onChange={(e) => update('spotify_url', e.target.value)} className="admin-input text-sm" placeholder="https://open.spotify.com/..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-pink-400 mb-1">Apple Music</label>
              <input type="url" value={form.apple_music_url} onChange={(e) => update('apple_music_url', e.target.value)} className="admin-input text-sm" placeholder="https://music.apple.com/..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-orange-400 mb-1">SoundCloud</label>
              <input type="url" value={form.soundcloud_url} onChange={(e) => update('soundcloud_url', e.target.value)} className="admin-input text-sm" placeholder="https://soundcloud.com/..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-red-400 mb-1">YouTube</label>
              <input type="url" value={form.youtube_url} onChange={(e) => update('youtube_url', e.target.value)} className="admin-input text-sm" placeholder="https://youtube.com/..." />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button type="button" onClick={onClose} className="admin-btn-ghost px-4 py-2.5 sm:py-2 touch-manipulation">Cancel</button>
            <button type="submit" disabled={saving} className="admin-btn-primary px-4 py-2.5 sm:py-2 touch-manipulation disabled:opacity-50">
              {saving ? 'Adding...' : '🔥 Add Track'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
