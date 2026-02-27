'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtistCard } from './ArtistCard';
import { GenreFilter } from './GenreFilter';
import type { Artist } from '@/lib/mock-data';
import { GENRES, MOODS, REGIONS } from '@/lib/mock-data';

interface DiscoverGridProps {
  artists: Artist[];
  onArtistClick?: (artist: Artist) => void;
}

export function DiscoverGrid({ artists, onArtistClick }: DiscoverGridProps) {
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'glow_score' | 'monthly_listeners' | 'name'>('glow_score');

  const filtered = useMemo(() => {
    let result = [...artists];

    if (activeGenre) {
      result = result.filter(a => a.genre.some(g => g.toLowerCase() === activeGenre.toLowerCase()));
    }
    if (activeMood) {
      result = result.filter(a => a.mood.some(m => m.toLowerCase() === activeMood.toLowerCase()));
    }
    if (activeRegion) {
      result = result.filter(a => a.region.toLowerCase() === activeRegion.toLowerCase());
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        a =>
          a.name.toLowerCase().includes(q) ||
          a.genre.some(g => g.toLowerCase().includes(q)) ||
          a.city.toLowerCase().includes(q) ||
          a.tags.some(t => t.includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'glow_score') return b.glow_score - a.glow_score;
      if (sortBy === 'monthly_listeners') return b.monthly_listeners - a.monthly_listeners;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [artists, activeGenre, activeMood, activeRegion, searchQuery, sortBy]);

  const activeFilterCount = [activeGenre, activeMood, activeRegion].filter(Boolean).length;

  return (
    <div>
      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search artists, genres, cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-glow pl-12"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-8">
        <GenreFilter genres={GENRES} activeGenre={activeGenre} onGenreChange={setActiveGenre} label="Genre" />
        <GenreFilter genres={MOODS} activeGenre={activeMood} onGenreChange={setActiveMood} label="Mood" />
        <GenreFilter genres={REGIONS} activeGenre={activeRegion} onGenreChange={setActiveRegion} label="Region" />
      </div>

      {/* Sort + results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-white/40 font-body">
          {filtered.length} artist{filtered.length !== 1 ? 's' : ''}
          {activeFilterCount > 0 && (
            <button
              onClick={() => { setActiveGenre(null); setActiveMood(null); setActiveRegion(null); }}
              className="ml-2 text-accent hover:text-accent/80 transition-colors"
            >
              Clear filters
            </button>
          )}
        </p>
        <div className="flex gap-2">
          {(['glow_score', 'monthly_listeners', 'name'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`px-3 py-1 text-xs font-body rounded-lg transition-all duration-300 ${
                sortBy === sort
                  ? 'bg-primary/15 text-primary'
                  : 'text-white/30 hover:text-white/50'
              }`}
            >
              {sort === 'glow_score' ? 'Glow Score' : sort === 'monthly_listeners' ? 'Popularity' : 'A-Z'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeGenre}-${activeMood}-${activeRegion}-${sortBy}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((artist, index) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              variant="default"
              onClick={onArtistClick}
              showEmbed={false}
              index={index}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg font-headline text-white/50">No artists found</p>
          <p className="text-sm text-white/30 font-body mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
