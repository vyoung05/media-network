'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-yellow-500/20 text-yellow-400',
};

const DAWS = ['FL Studio', 'Ableton Live', 'Logic Pro', 'Pro Tools', 'Studio One', 'Reason', 'Cubase', 'Reaper'];
const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'];
const CATEGORIES = ['Beat Making', 'Mixing', 'Mastering', 'Sound Design', 'Sampling', 'Arrangement', 'Vocal Production', 'Music Theory'];

export function TutorialsPage() {
  const router = useRouter();
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [filterDaw, setFilterDaw] = useState('');
  const [filterSkill, setFilterSkill] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const fetchTutorials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterDaw) params.set('daw', filterDaw);
      if (filterSkill) params.set('skill_level', filterSkill);
      if (filterCategory) params.set('category', filterCategory);
      const res = await fetch(`/api/tutorials?${params}`);
      if (!res.ok) throw new Error('Failed to fetch tutorials');
      const result = await res.json();
      setTutorials(result.data || []);
      setTotalCount(result.count || 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterDaw, filterSkill, filterCategory]);

  useEffect(() => { fetchTutorials(); }, [fetchTutorials]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tutorial?')) return;
    try {
      await fetch(`/api/tutorials/${id}`, { method: 'DELETE' });
      setTutorials((prev) => prev.filter((t) => t.id !== id));
      setTotalCount((prev) => prev - 1);
    } catch (err) { console.error('Delete failed:', err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Tutorials</h1>
          <p className="text-sm text-gray-500 mt-1">{loading ? 'Loading...' : `${totalCount} tutorials`}</p>
        </div>
        <button onClick={() => router.push('/dashboard/tutorials/new')} className="admin-btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Tutorial
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">DAW:</span>
          <select value={filterDaw} onChange={(e) => setFilterDaw(e.target.value)} className="admin-input text-xs py-1 w-36">
            <option value="">All</option>
            {DAWS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Skill:</span>
          <select value={filterSkill} onChange={(e) => setFilterSkill(e.target.value)} className="admin-input text-xs py-1 w-32">
            <option value="">All</option>
            {SKILL_LEVELS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Category:</span>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="admin-input text-xs py-1 w-40">
            <option value="">All</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchTutorials} className="admin-btn-ghost text-xs mt-2">Retry</button>
        </div>
      )}

      {loading && (
        <div className="glass-panel p-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Loading tutorials...</p>
        </div>
      )}

      {!loading && !error && (
        <div className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Title</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">DAW</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Skill</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Category</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Views</th>
                <th className="text-left text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-mono text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {tutorials.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => router.push(`/dashboard/tutorials/${t.id}/edit`)}
                  >
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-white">{t.title}</span>
                      {t.producer && <span className="block text-xs text-gray-500">by {t.producer.name}</span>}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{t.daw || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded capitalize ${
                        t.skill_level === 'beginner' ? 'bg-green-500/10 text-green-400' :
                        t.skill_level === 'intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{t.skill_level || '—'}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">{t.category || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-400 font-mono">{(t.views || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[t.status] || STATUS_COLORS.draft}`}>
                        {t.status || 'draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }} className="text-gray-500 hover:text-red-400 transition-colors text-xs">Delete</button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {tutorials.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-white mb-2">No tutorials yet</h3>
              <p className="text-sm text-gray-500">Create your first tutorial to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
