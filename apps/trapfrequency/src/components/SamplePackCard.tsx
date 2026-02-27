'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { GlassMorphCard } from './GlassMorphCard';
import type { SamplePack } from '@/lib/mock-data';
import { formatNumber } from '@/lib/mock-data';

interface SamplePackCardProps {
  pack: SamplePack;
  index?: number;
}

export function SamplePackCard({ pack, index = 0 }: SamplePackCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <GlassMorphCard
        className="h-full group"
        glowColor={pack.isFree ? 'rgba(57, 255, 20, 0.12)' : 'rgba(255, 184, 0, 0.12)'}
      >
        {/* Cover */}
        <div className="relative h-36 bg-gradient-to-br from-surface to-secondary overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-30" />

          {/* Waveform decoration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="flex items-end gap-[2px] h-20">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[2px] rounded-full"
                  style={{
                    height: `${Math.random() * 80 + 20}%`,
                    backgroundColor: pack.isFree ? '#39FF14' : '#FFB800',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <span className={`text-xs font-mono font-bold px-2 py-1 rounded border ${
              pack.isFree
                ? 'text-primary bg-primary/10 border-primary/30'
                : 'text-accent bg-accent/10 border-accent/30'
            }`}>
              {pack.price}
            </span>
          </div>

          {/* Sample count */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xs font-mono text-white/60 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
              {pack.sampleCount} samples
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors mb-1">
            {pack.title}
          </h3>
          <p className="text-xs text-neutral/50 font-mono mb-2">
            by {pack.creator}
          </p>
          <p className="text-xs text-neutral/40 line-clamp-2 mb-3 leading-relaxed">
            {pack.description}
          </p>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {pack.genres.map((genre) => (
              <span key={genre} className="text-[9px] font-mono text-neutral/40 bg-white/5 px-1.5 py-0.5 rounded">
                {genre}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between pt-3 border-t border-primary/10">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-3 h-3"
                  fill={star <= Math.floor(pack.rating) ? '#FFB800' : '#FFB80020'}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-[10px] font-mono text-neutral/40">
              {formatNumber(pack.downloadCount)} downloads
            </span>
          </div>
        </div>
      </GlassMorphCard>
    </motion.div>
  );
}
