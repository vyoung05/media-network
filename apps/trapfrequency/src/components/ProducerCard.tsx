'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassMorphCard } from './GlassMorphCard';
import type { Producer } from '@/lib/mock-data';
import { DAW_INFO, formatNumber } from '@/lib/mock-data';

interface ProducerCardProps {
  producer: Producer;
  index?: number;
}

export function ProducerCard({ producer, index = 0 }: ProducerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/producers/${producer.slug}`} data-cursor="VIEW">
        <GlassMorphCard className="h-full group" glowColor="rgba(67, 97, 238, 0.12)">
          {/* Cover */}
          <div className="relative h-32 bg-gradient-to-br from-surface via-mixer-dark to-secondary overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-30" />

            {/* Featured badge */}
            {producer.featured && (
              <div className="absolute top-3 right-3">
                <span className="text-[10px] font-headline font-bold text-accent uppercase tracking-wider bg-accent/10 border border-accent/30 px-2 py-1 rounded">
                  ★ Featured
                </span>
              </div>
            )}

            {/* Location */}
            <div className="absolute bottom-3 left-3">
              <span className="text-[10px] font-mono text-neutral/60 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                📍 {producer.location}
              </span>
            </div>
          </div>

          {/* Avatar overlay */}
          <div className="relative px-4 -mt-8">
            <div className="w-16 h-16 rounded-full bg-surface border-2 border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
              <span className="text-2xl font-headline font-bold text-primary">
                {producer.name.charAt(0)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 pt-2">
            <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors mb-1">
              {producer.name}
            </h3>

            {/* DAW chips */}
            <div className="flex flex-wrap gap-1 mb-2">
              {producer.daws.map((daw) => {
                const info = DAW_INFO[daw];
                return (
                  <span
                    key={daw}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                    style={{
                      color: info.color,
                      borderColor: `${info.color}30`,
                      backgroundColor: `${info.color}10`,
                    }}
                  >
                    {info.shortName}
                  </span>
                );
              })}
            </div>

            <p className="text-xs text-neutral/50 line-clamp-2 mb-3 leading-relaxed">
              {producer.bio}
            </p>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {producer.genres.map((genre) => (
                <span key={genre} className="text-[9px] font-mono text-neutral/40 bg-white/5 px-1.5 py-0.5 rounded">
                  {genre}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 pt-3 border-t border-primary/10">
              <div className="text-center">
                <p className="text-sm font-bold text-primary font-mono">{formatNumber(producer.beatCount)}</p>
                <p className="text-[9px] text-neutral/40 font-mono uppercase">Beats</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-cool font-mono">{formatNumber(producer.followerCount)}</p>
                <p className="text-[9px] text-neutral/40 font-mono uppercase">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-accent font-mono">{producer.credits.length}</p>
                <p className="text-[9px] text-neutral/40 font-mono uppercase">Credits</p>
              </div>
            </div>
          </div>
        </GlassMorphCard>
      </Link>
    </motion.div>
  );
}
