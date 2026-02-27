'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Artist } from '@/lib/mock-data';
import { formatListeners } from '@/lib/mock-data';

interface GlowUpLeaderboardProps {
  artists: Artist[];
  limit?: number;
  onArtistClick?: (artist: Artist) => void;
}

export function GlowUpLeaderboard({ artists, limit = 8, onArtistClick }: GlowUpLeaderboardProps) {
  const sorted = [...artists].sort((a, b) => b.glow_score - a.glow_score).slice(0, limit);

  return (
    <div className="card-glow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            Glow Up
          </h3>
          <p className="text-xs text-white/40 font-body mt-0.5">Rising artists ranked by glow score</p>
        </div>
        <div className="px-2 py-1 bg-primary/10 rounded-lg border border-primary/20">
          <span className="text-[10px] font-body font-bold text-primary uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-1">
        {sorted.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.3 }}
            onClick={() => onArtistClick?.(artist)}
            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer group"
          >
            {/* Rank */}
            <div className="w-6 text-center flex-shrink-0">
              {index < 3 ? (
                <span className="text-lg">{index === 0 ? '👑' : index === 1 ? '🥈' : '🥉'}</span>
              ) : (
                <span className="text-sm font-headline font-bold text-white/30">
                  {index + 1}
                </span>
              )}
            </div>

            {/* Avatar */}
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/30 transition-all">
              <Image src={artist.avatar} alt={artist.name} fill className="object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-accent font-bold text-white truncate group-hover:text-accent transition-colors">
                {artist.name}
              </h4>
              <p className="text-[11px] text-white/30 font-body truncate">
                {artist.genre[0]} · {formatListeners(artist.monthly_listeners)} listeners
              </p>
            </div>

            {/* Score + Trend */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {artist.glow_trend === 'rising' && (
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                </svg>
              )}
              {artist.glow_trend === 'new' && (
                <span className="text-[10px] text-warm font-bold">NEW</span>
              )}
              <div className="text-right">
                <span className="text-sm font-headline font-bold text-white">{artist.glow_score}</span>
              </div>
            </div>

            {/* Score bar */}
            <div className="hidden sm:block w-20 h-1.5 bg-white/5 rounded-full overflow-hidden flex-shrink-0">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${artist.glow_score}%` }}
                transition={{ delay: index * 0.06 + 0.3, duration: 0.6, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, #8B5CF6, ${artist.glow_score > 90 ? '#06F5D6' : '#8B5CF6'})`,
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
