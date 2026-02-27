'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassMorphCard } from './GlassMorphCard';
import { WaveformPlayer } from './WaveformPlayer';
import type { Beat } from '@/lib/mock-data';
import { formatNumber } from '@/lib/mock-data';

interface BeatCardProps {
  beat: Beat;
  index?: number;
  compact?: boolean;
}

export function BeatCard({ beat, index = 0, compact = false }: BeatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <GlassMorphCard className="h-full group">
        {!compact && (
          <div className="relative h-36 bg-gradient-to-br from-surface via-mixer-dark to-secondary overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30" />

            {/* Genre tag */}
            <div className="absolute top-3 left-3">
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded">
                {beat.genre}
              </span>
            </div>

            {/* Featured badge */}
            {beat.isFeatured && (
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 border border-accent/30 px-2 py-1 rounded uppercase tracking-wider">
                  ★ Featured
                </span>
              </div>
            )}

            {/* Centered waveform preview */}
            <div className="absolute inset-0 flex items-center justify-center px-8 opacity-40">
              <div className="flex items-end gap-[1px] h-16 w-full">
                {beat.waveformData.slice(0, 60).map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary/60 rounded-full"
                    style={{ height: `${v * 100}%`, minWidth: 1 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-4">
          {/* Title & Producer */}
          <div className="mb-3">
            <Link href={`/beats/${beat.slug}`} data-cursor="LISTEN">
              <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors mb-1">
                {beat.title}
              </h3>
            </Link>
            <Link href={`/producers/${beat.producer.slug}`}>
              <p className="text-xs text-neutral/50 font-mono hover:text-primary/70 transition-colors">
                by {beat.producer.name}
              </p>
            </Link>
          </div>

          {/* Waveform Player */}
          <WaveformPlayer
            waveformData={beat.waveformData}
            title={beat.title}
            producer={beat.producer.name}
            duration={beat.duration}
            bpm={beat.bpm}
            musicKey={beat.key}
            compact
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {beat.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono text-neutral/40 bg-white/5 px-2 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-primary/10">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-neutral/40 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatNumber(beat.plays)}
              </span>
              <span className="text-[10px] font-mono text-neutral/40">
                ♥ {formatNumber(beat.likes)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-accent/70">{beat.bpm} BPM</span>
              <span className="text-[10px] font-mono text-cool/70">{beat.key}</span>
            </div>
          </div>
        </div>
      </GlassMorphCard>
    </motion.div>
  );
}
