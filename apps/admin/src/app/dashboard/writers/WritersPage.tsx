'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '@/contexts/BrandContext';
import type { Brand, User, UserRole } from '@media-network/shared';
import { StatCard } from '@/components/StatCard';

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

const ROLE_LABELS: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'text-red-400 bg-red-400/10' },
  editor: { label: 'Editor', color: 'text-purple-400 bg-purple-400/10' },
  writer: { label: 'Writer', color: 'text-blue-400 bg-blue-400/10' },
  artist: { label: 'Artist', color: 'text-pink-400 bg-pink-400/10' },
  producer: { label: 'Producer', color: 'text-emerald-400 bg-emerald-400/10' },
  reader: { label: 'Reader', color: 'text-gray-400 bg-gray-400/10' },
};

export function WritersPage() {
  const { activeBrand } = useBrand();
  const [writers, setWriters] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [totalCount, setTotalCount] = useState(0);

  const fetchWriters = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (activeBrand !== 'all') params.set('brand', activeBrand);
      params.set('per_page', '100');

      const res = await fetch(`/api/writers?${params}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setWriters(data.data || []);
      setTotalCount(data.count || 0);
    } catch (err: any) {
      console.error('Error fetching writers:', err);
      setError(err.message || 'Failed to load writers');
    } finally {
      setLoading(false);
    }
  }, [activeBrand]);

  useEffect(() => {
    fetchWriters();
  }, [fetchWriters]);

  const filtered = searchQuery.trim()
    ? writers.filter((w) => {
        const q = searchQuery.toLowerCase();
        return (
          w.name.toLowerCase().includes(q) ||
          w.email.toLowerCase().includes(q) ||
          (w.bio || '').toLowerCase().includes(q)
        );
      })
    : writers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Writers</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `${totalCount} contributors${activeBrand !== 'all' ? ` for ${BRAND_NAMES[activeBrand]}` : ' across all brands'}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search writers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input pl-10 w-56 text-sm"
            />
          </div>
          <div className="flex rounded-lg border border-admin-border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-xs transition-colors ${
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Writers"
          value={loading ? '...' : totalCount}
          change="contributors"
          changeType="neutral"
          color="#3B82F6"
          index={0}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm text-red-400 font-medium">Failed to load writers</p>
              <p className="text-xs text-gray-500 mt-0.5">{error}</p>
            </div>
            <button onClick={fetchWriters} className="ml-auto admin-btn-ghost text-xs">Retry</button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="glass-panel p-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-4">Loading writers...</p>
        </div>
      )}

      {/* Writers grid */}
      {!loading && !error && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((writer, i) => {
              const roleInfo = ROLE_LABELS[writer.role];
              const initials = writer.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <motion.div
                  key={writer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  className="glass-panel p-5 hover:bg-admin-hover/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 group-hover:border-white/20 transition-colors">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-white truncate">{writer.name}</h3>
                        {writer.is_verified && (
                          <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{writer.bio || 'No bio'}</p>

                  {/* Brand pills */}
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {writer.brand_affiliations.map((brand) => (
                      <span
                        key={brand}
                        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04]"
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[brand] }} />
                        <span className="text-gray-400">{BRAND_NAMES[brand]}</span>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500 pt-3 border-t border-white/[0.04]">
                    <span>{writer.email}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Writers list */}
      {!loading && !error && viewMode === 'list' && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((writer, i) => {
              const roleInfo = ROLE_LABELS[writer.role];
              const initials = writer.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <motion.div
                  key={writer.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-panel p-4 hover:bg-admin-hover/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{writer.name}</h3>
                        {writer.is_verified && (
                          <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{writer.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {writer.brand_affiliations.map((brand) => (
                        <div
                          key={brand}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: BRAND_COLORS[brand] }}
                          title={BRAND_NAMES[brand]}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-16 text-center"
        >
          <div className="text-5xl mb-4">✍️</div>
          <h3 className="text-lg font-semibold text-white mb-2">No writers found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? `No results for "${searchQuery}".` : 'No writers match the current filters.'}
          </p>
        </motion.div>
      )}
    </div>
  );
}
