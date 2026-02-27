'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassMorphCard } from './GlassMorphCard';
import { WaveformPlayer } from './WaveformPlayer';
import { BeatCard } from './BeatCard';
import type { Producer, Beat } from '@/lib/mock-data';
import { DAW_INFO, formatNumber } from '@/lib/mock-data';

interface ProducerProfileProps {
  producer: Producer;
  beats: Beat[];
}

export function ProducerProfile({ producer, beats }: ProducerProfileProps) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-surface via-mixer-dark to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />

        {/* Animated waveform background */}
        <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-center gap-[3px] opacity-10 px-4">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-primary rounded-t-full max-w-1"
              style={{
                height: `${Math.sin(i * 0.2) * 40 + Math.random() * 60}%`,
                animationDelay: `${i * 0.02}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Profile Info */}
      <div className="container-freq -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 rounded-2xl bg-surface border-2 border-primary/30 flex items-center justify-center shadow-2xl shadow-primary/10"
          >
            <span className="text-5xl font-headline font-bold text-primary glow-text">
              {producer.name.charAt(0)}
            </span>
          </motion.div>

          {/* Name & Info */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-white">
                  {producer.name}
                </h1>
                {producer.featured && (
                  <span className="text-xs font-mono font-bold text-accent bg-accent/10 border border-accent/30 px-2 py-1 rounded uppercase tracking-wider">
                    ★ Featured
                  </span>
                )}
              </div>

              <p className="text-sm text-neutral/50 font-mono mb-1">📍 {producer.location}</p>

              {/* DAW chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {producer.daws.map((daw) => {
                  const info = DAW_INFO[daw];
                  return (
                    <span
                      key={daw}
                      className="text-xs font-mono px-2 py-1 rounded border"
                      style={{
                        color: info.color,
                        borderColor: `${info.color}40`,
                        backgroundColor: `${info.color}15`,
                      }}
                    >
                      {info.icon} {daw}
                    </span>
                  );
                })}
              </div>

              <p className="text-sm text-neutral/70 max-w-2xl leading-relaxed">
                {producer.bio}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <GlassMorphCard className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-headline font-bold text-primary glow-text">{formatNumber(producer.beatCount)}</p>
                <p className="text-xs text-neutral/40 font-mono uppercase tracking-wider mt-1">Beats</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-headline font-bold text-cool">{formatNumber(producer.followerCount)}</p>
                <p className="text-xs text-neutral/40 font-mono uppercase tracking-wider mt-1">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-headline font-bold text-accent">{producer.credits.length}</p>
                <p className="text-xs text-neutral/40 font-mono uppercase tracking-wider mt-1">Credits</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-headline font-bold text-white">{producer.genres.length}</p>
                <p className="text-xs text-neutral/40 font-mono uppercase tracking-wider mt-1">Genres</p>
              </div>
            </div>
          </GlassMorphCard>
        </motion.div>

        {/* Links */}
        {Object.keys(producer.links).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 flex flex-wrap gap-2"
          >
            {Object.entries(producer.links).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-neutral/50 bg-surface border border-primary/10 hover:border-primary/30 hover:text-primary px-3 py-1.5 rounded-lg transition-all duration-300"
              >
                {platform === 'instagram' ? '📸' :
                 platform === 'twitter' ? '𝕏' :
                 platform === 'youtube' ? '▶️' :
                 platform === 'soundcloud' ? '☁️' :
                 platform === 'spotify' ? '🎵' :
                 platform === 'beatstars' ? '🎹' :
                 platform === 'website' ? '🌐' : '🔗'}{' '}
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </a>
            ))}
          </motion.div>
        )}

        {/* Credits */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="mt-8"
        >
          <h2 className="text-xl font-headline font-bold text-white mb-4">
            Production <span className="text-primary">Credits</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {producer.credits.map((credit, i) => (
              <GlassMorphCard key={i} className="p-3" hoverTilt={false}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-primary/40">#{i + 1}</span>
                  <span className="text-sm text-neutral/70">{credit}</span>
                </div>
              </GlassMorphCard>
            ))}
          </div>
        </motion.div>

        {/* Beats */}
        {beats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="text-xl font-headline font-bold text-white mb-4">
              Latest <span className="text-primary">Beats</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {beats.map((beat, i) => (
                <BeatCard key={beat.id} beat={beat} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
