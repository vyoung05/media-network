'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BeatCard } from '@/components/BeatCard';
import { TextReveal } from '@/components/TextReveal';
import type { Beat } from '@/lib/mock-data';

interface BeatsPageClientProps {
  beats: Beat[];
}

const GENRES = ['All', 'Dark Trap', 'R&B', 'Drill', 'Melodic Trap', 'Phonk', 'Future Bass', 'Boom Bap', 'Gospel Trap', 'Lo-Fi'] as const;
const SORT_OPTIONS = ['Latest', 'Most Played', 'Most Liked', 'BPM ↑', 'BPM ↓'] as const;

export function BeatsPageClient({ beats }: BeatsPageClientProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('Latest');

  const filteredBeats = useMemo(() => {
    let result = [...beats];

    if (selectedGenre !== 'All') {
      result = result.filter(b => b.genre === selectedGenre);
    }

    switch (sortBy) {
      case 'Most Played':
        result.sort((a, b) => b.plays - a.plays);
        break;
      case 'Most Liked':
        result.sort((a, b) => b.likes - a.likes);
        break;
      case 'BPM ↑':
        result.sort((a, b) => a.bpm - b.bpm);
        break;
      case 'BPM ↓':
        result.sort((a, b) => b.bpm - a.bpm);
        break;
      default:
        result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return result;
  }, [beats, selectedGenre, sortBy]);

  return (
    <div className="min-h-screen py-12">
      <div className="container-freq">
        {/* Header */}
        <div className="mb-10">
          <TextReveal
            text="BEAT SHOWCASE"
            as="h1"
            className="text-4xl md:text-5xl font-headline font-black text-white tracking-tight mb-3"
            speed={30}
          />
          <p className="text-lg text-neutral/50 font-body max-w-xl">
            Fresh instrumentals from top producers. Every beat features a waveform player,
            BPM, key, and genre tags.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Genre pills */}
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 border ${
                  selectedGenre === genre
                    ? 'text-primary border-primary/50 bg-primary/10 shadow-[0_0_10px_rgba(57,255,20,0.1)]'
                    : 'text-neutral/50 border-white/10 hover:border-primary/30 hover:text-primary/70'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-neutral/30">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-freq py-1.5 px-3 text-xs w-auto"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <span className="text-sm font-mono text-neutral/40">
            {filteredBeats.length} beat{filteredBeats.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Beats Grid */}
        {filteredBeats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBeats.map((beat, i) => (
              <BeatCard key={beat.id} beat={beat} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl font-headline text-neutral/30 mb-2">No beats found</p>
            <p className="text-sm font-mono text-neutral/20">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
