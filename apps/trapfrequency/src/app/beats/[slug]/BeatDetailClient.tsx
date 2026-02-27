'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';
import { WaveformPlayer } from '@/components/WaveformPlayer';
import type { Beat } from '@/lib/mock-data';
import { formatNumber, DAW_INFO } from '@/lib/mock-data';

interface BeatDetailClientProps {
  beat: Beat;
}

export function BeatDetailClient({ beat }: BeatDetailClientProps) {
  return (
    <div className="min-h-screen py-12">
      <div className="container-freq max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral/40">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/beats" className="hover:text-primary transition-colors">Beats</Link>
            <span>/</span>
            <span className="text-primary/60 truncate">{beat.title}</span>
          </div>
        </nav>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-surface via-mixer-dark to-secondary p-8 md:p-12 mb-8">
            <div className="absolute inset-0 bg-grid opacity-20" />

            {/* Background waveform */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
              <div className="flex items-end gap-[2px] h-full w-full px-4">
                {beat.waveformData.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-primary rounded-t-full"
                    style={{ height: `${v * 100}%`, minWidth: 2 }}
                  />
                ))}
              </div>
            </div>

            <div className="relative z-10">
              {/* Genre & Featured badges */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded">
                  {beat.genre}
                </span>
                {beat.isFeatured && (
                  <span className="text-[10px] font-mono font-bold text-accent bg-accent/10 border border-accent/30 px-2 py-1 rounded uppercase tracking-wider">
                    ★ Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-headline font-black text-white mb-2">
                {beat.title}
              </h1>

              <Link href={`/producers/${beat.producer.slug}`} className="inline-flex items-center gap-2 group mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">{beat.producer.name.charAt(0)}</span>
                </div>
                <span className="text-sm text-neutral/60 font-mono group-hover:text-primary transition-colors">
                  {beat.producer.name}
                </span>
              </Link>

              {/* Key details */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="text-sm font-mono text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg">
                  {beat.bpm} BPM
                </span>
                <span className="text-sm font-mono text-cool bg-cool/10 border border-cool/20 px-3 py-1.5 rounded-lg">
                  {beat.key}
                </span>
                <span className="text-sm font-mono text-neutral/50 bg-white/5 px-3 py-1.5 rounded-lg">
                  {beat.duration}
                </span>
              </div>

              {/* Full waveform player */}
              <WaveformPlayer
                waveformData={beat.waveformData}
                title={beat.title}
                producer={beat.producer.name}
                duration={beat.duration}
                bpm={beat.bpm}
                musicKey={beat.key}
              />
            </div>
          </div>
        </motion.div>

        {/* Stats & Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <GlassMorphCard className="p-6" hoverTilt={false}>
              <h3 className="text-sm font-headline font-bold text-primary uppercase tracking-wider mb-4">Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-headline font-bold text-white">{formatNumber(beat.plays)}</p>
                  <p className="text-xs font-mono text-neutral/40">Plays</p>
                </div>
                <div>
                  <p className="text-2xl font-headline font-bold text-white">{formatNumber(beat.likes)}</p>
                  <p className="text-xs font-mono text-neutral/40">Likes</p>
                </div>
              </div>
            </GlassMorphCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <GlassMorphCard className="p-6" hoverTilt={false}>
              <h3 className="text-sm font-headline font-bold text-primary uppercase tracking-wider mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {beat.tags.map((tag) => (
                  <span key={tag} className="text-xs font-mono text-neutral/50 bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                    #{tag}
                  </span>
                ))}
              </div>
            </GlassMorphCard>
          </motion.div>
        </div>

        {/* Producer Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <GlassMorphCard className="p-6" hoverTilt={false} glowColor="rgba(67, 97, 238, 0.1)">
            <h3 className="text-sm font-headline font-bold text-cool uppercase tracking-wider mb-4">About the Producer</h3>
            <Link href={`/producers/${beat.producer.slug}`} className="flex items-start gap-4 group">
              <div className="w-14 h-14 rounded-xl bg-surface border border-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-headline font-bold text-primary">{beat.producer.name.charAt(0)}</span>
              </div>
              <div>
                <p className="text-lg font-bold text-white group-hover:text-primary transition-colors">
                  {beat.producer.name}
                </p>
                <p className="text-xs font-mono text-neutral/40 mb-2">📍 {beat.producer.location}</p>
                <p className="text-sm text-neutral/50 line-clamp-2">{beat.producer.bio}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {beat.producer.daws.map((daw) => {
                    const info = DAW_INFO[daw];
                    return (
                      <span key={daw} className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                        style={{ color: info.color, borderColor: `${info.color}30`, backgroundColor: `${info.color}10` }}>
                        {info.shortName}
                      </span>
                    );
                  })}
                </div>
              </div>
            </Link>
          </GlassMorphCard>
        </motion.div>
      </div>
    </div>
  );
}
