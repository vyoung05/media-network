'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { GlassMorphCard } from './GlassMorphCard';
import { MusicEmbed } from './MusicEmbed';
import type { Artist } from '@/lib/mock-data';
import { formatListeners } from '@/lib/mock-data';

interface ArtistCardProps {
  artist: Artist;
  variant?: 'default' | 'featured' | 'compact';
  onClick?: (artist: Artist) => void;
  showEmbed?: boolean;
  index?: number;
}

export function ArtistCard({
  artist,
  variant = 'default',
  onClick,
  showEmbed = true,
  index = 0,
}: ArtistCardProps) {
  if (variant === 'featured') {
    return (
      <GlassMorphCard
        className="group"
        glowColor="rgba(139, 92, 246, 0.12)"
        onClick={() => onClick?.(artist)}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative h-64 lg:h-[420px] overflow-hidden">
            <Image
              src={artist.cover_image}
              alt={artist.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-secondary/80 hidden lg:block" />

            {/* Glow trend badge */}
            {artist.glow_trend === 'rising' && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30">
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-xs font-bold text-accent">RISING</span>
              </div>
            )}

            {/* Name overlay on mobile */}
            <div className="absolute bottom-4 left-4 lg:hidden">
              <h2 className="text-2xl font-accent font-bold text-white">{artist.name}</h2>
              <p className="text-sm text-white/60 font-body">{artist.city}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8 flex flex-col justify-center">
            <div className="hidden lg:block mb-4">
              <p className="text-xs text-accent font-body uppercase tracking-widest mb-2">Featured Artist</p>
              <h2 className="text-3xl xl:text-4xl font-accent font-bold text-white mb-1">{artist.name}</h2>
              <p className="text-sm text-white/50 font-body">{artist.city}</p>
            </div>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {artist.genre.map((g) => (
                <span key={g} className="px-2.5 py-1 text-[11px] font-body font-medium bg-primary/15 text-primary rounded-full border border-primary/20">
                  {g}
                </span>
              ))}
              {artist.mood.slice(0, 2).map((m) => (
                <span key={m} className="px-2.5 py-1 text-[11px] font-body font-medium bg-white/5 text-white/50 rounded-full">
                  {m}
                </span>
              ))}
            </div>

            {/* Bio excerpt */}
            <p className="text-sm text-white/60 font-body leading-relaxed line-clamp-3 mb-4">
              {artist.bio}
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-5">
              <div>
                <p className="text-lg font-headline font-bold text-white">{formatListeners(artist.monthly_listeners)}</p>
                <p className="text-[11px] text-white/40 font-body uppercase tracking-wide">Monthly Listeners</p>
              </div>
              <div>
                <p className="text-lg font-headline font-bold text-accent">{artist.glow_score}</p>
                <p className="text-[11px] text-white/40 font-body uppercase tracking-wide">Glow Score</p>
              </div>
              <div>
                <p className="text-lg font-headline font-bold text-white">{formatListeners(artist.followers)}</p>
                <p className="text-[11px] text-white/40 font-body uppercase tracking-wide">Followers</p>
              </div>
            </div>

            {/* Music embed */}
            {showEmbed && (
              <MusicEmbed
                spotifyUrl={artist.spotify_embed}
                soundcloudUrl={artist.soundcloud_embed}
                appleMusicUrl={artist.apple_music_embed}
                compact
              />
            )}

            {/* Featured track label */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 bg-accent rounded-full waveform-bar"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
              <span className="text-xs text-white/50 font-body">
                Now playing: <span className="text-accent font-medium">{artist.featured_track}</span>
              </span>
            </div>
          </div>
        </div>
      </GlassMorphCard>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        onClick={() => onClick?.(artist)}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 cursor-pointer group"
      >
        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={artist.avatar} alt={artist.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-accent font-bold text-white truncate group-hover:text-accent transition-colors">
            {artist.name}
          </h4>
          <p className="text-xs text-white/40 font-body truncate">{artist.genre.join(' · ')}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-headline font-bold text-accent">{artist.glow_score}</p>
          <p className="text-[10px] text-white/30">score</p>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <GlassMorphCard
        className="group h-full"
        glowColor="rgba(139, 92, 246, 0.1)"
        onClick={() => onClick?.(artist)}
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={artist.cover_image}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {artist.glow_trend === 'rising' && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-accent/20 text-accent rounded-full backdrop-blur-sm border border-accent/20">
                🔥 RISING
              </span>
            )}
            {artist.glow_trend === 'new' && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-warm/20 text-warm rounded-full backdrop-blur-sm border border-warm/20">
                ✨ NEW
              </span>
            )}
          </div>

          {/* Glow score */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-secondary/60 backdrop-blur-sm rounded-lg border border-white/10">
            <div className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span className="text-xs font-headline font-bold text-white">{artist.glow_score}</span>
          </div>

          {/* Name overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-xl font-accent font-bold text-white mb-0.5 group-hover:text-accent transition-colors duration-300">
              {artist.name}
            </h3>
            <p className="text-xs text-white/50 font-body">{artist.city}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Genre tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {artist.genre.slice(0, 3).map((g) => (
              <span key={g} className="px-2 py-0.5 text-[10px] font-body font-medium bg-primary/10 text-primary/80 rounded-full">
                {g}
              </span>
            ))}
          </div>

          {/* Bio */}
          <p className="text-xs text-white/50 font-body leading-relaxed line-clamp-2 mb-3">
            {artist.bio}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-[11px] text-white/40 font-body">
            <span>{formatListeners(artist.monthly_listeners)} listeners</span>
            <span className="flex items-center gap-1">
              <div className="flex gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-0.5 h-2 bg-accent/50 rounded-full" />
                ))}
              </div>
              {artist.featured_track}
            </span>
          </div>

          {/* Embed */}
          {showEmbed && artist.spotify_embed && (
            <div className="mt-3">
              <MusicEmbed spotifyUrl={artist.spotify_embed} compact />
            </div>
          )}
        </div>
      </GlassMorphCard>
    </motion.div>
  );
}
