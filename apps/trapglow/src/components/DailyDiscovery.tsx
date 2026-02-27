'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Artist } from '@/lib/mock-data';
import { formatListeners } from '@/lib/mock-data';

interface DailyDiscoveryProps {
  artists: Artist[];
  onArtistClick?: (artist: Artist) => void;
}

export function DailyDiscovery({ artists, onArtistClick }: DailyDiscoveryProps) {
  return (
    <div className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-lg">✨</span>
          </div>
          <div>
            <h2 className="text-xl font-headline font-bold text-white">Daily Discovery</h2>
            <p className="text-xs text-white/40 font-body">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-body text-accent uppercase tracking-widest bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
          AI Curated
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {artists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            onClick={() => onArtistClick?.(artist)}
            className="group relative overflow-hidden rounded-2xl cursor-pointer border border-white/[0.06] hover:border-primary/20 transition-all duration-500"
          >
            {/* Background image */}
            <div className="relative h-48">
              <Image
                src={artist.cover_image}
                alt={artist.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />

              {/* Play indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* Day pick number */}
              <div className="absolute top-3 left-3">
                <span className="text-[10px] font-headline font-bold text-accent bg-secondary/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  #{index + 1} Pick
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 bg-surface/80">
              <h3 className="text-base font-accent font-bold text-white group-hover:text-accent transition-colors mb-1">
                {artist.name}
              </h3>

              <div className="flex items-center gap-2 mb-2">
                {artist.genre.slice(0, 2).map((g) => (
                  <span key={g} className="text-[10px] text-primary/70 font-body">{g}</span>
                ))}
                <span className="text-[10px] text-white/20">·</span>
                <span className="text-[10px] text-white/30 font-body">{artist.city}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/40 font-body">
                  {formatListeners(artist.monthly_listeners)} listeners
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-0.5 h-2 bg-accent/40 rounded-full" />
                    ))}
                  </div>
                  <span className="text-[11px] text-accent/70 font-body">{artist.featured_track}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
