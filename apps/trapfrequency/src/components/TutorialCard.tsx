'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassMorphCard } from './GlassMorphCard';
import type { Tutorial } from '@/lib/mock-data';
import { DAW_INFO, SKILL_COLORS, formatNumber } from '@/lib/mock-data';

interface TutorialCardProps {
  tutorial: Tutorial;
  index?: number;
}

export function TutorialCard({ tutorial, index = 0 }: TutorialCardProps) {
  const dawInfo = DAW_INFO[tutorial.daw];
  const skillColor = SKILL_COLORS[tutorial.skillLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/tutorials/${tutorial.slug}`} data-cursor="READ">
        <GlassMorphCard className="h-full group">
          {/* Cover / placeholder */}
          <div className="relative h-44 bg-gradient-to-br from-surface to-secondary overflow-hidden">
            {/* DAW-themed gradient overlay */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${dawInfo.color}33, transparent 60%)`,
              }}
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-grid opacity-40" />

            {/* DAW badge */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span
                className="text-xs font-mono font-bold px-2.5 py-1 rounded-md border"
                style={{
                  color: dawInfo.color,
                  borderColor: `${dawInfo.color}40`,
                  backgroundColor: `${dawInfo.color}15`,
                }}
              >
                {dawInfo.icon} {tutorial.daw}
              </span>
            </div>

            {/* Skill level badge */}
            <div className="absolute top-3 right-3">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded-md"
                style={{
                  color: skillColor,
                  backgroundColor: `${skillColor}15`,
                  border: `1px solid ${skillColor}30`,
                }}
              >
                {tutorial.skillLevel}
              </span>
            </div>

            {/* Duration */}
            <div className="absolute bottom-3 right-3">
              <span className="text-xs font-mono text-white/80 bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                ⏱ {tutorial.duration}
              </span>
            </div>

            {/* Category icon */}
            <div className="absolute bottom-3 left-3">
              <span className="text-xs font-mono text-primary/80 bg-primary/10 backdrop-blur-sm px-2 py-1 rounded border border-primary/20">
                {tutorial.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug">
              {tutorial.title}
            </h3>
            <p className="text-xs text-neutral/50 line-clamp-2 mb-3 leading-relaxed">
              {tutorial.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between pt-3 border-t border-primary/10">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary">
                    {tutorial.author.name.charAt(0)}
                  </span>
                </div>
                <span className="text-xs text-neutral/60 font-mono">{tutorial.author.name}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral/40">
                <span className="text-[10px] font-mono flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {formatNumber(tutorial.viewCount)}
                </span>
                <span className="text-[10px] font-mono flex items-center gap-1">
                  ♥ {formatNumber(tutorial.likeCount)}
                </span>
              </div>
            </div>
          </div>
        </GlassMorphCard>
      </Link>
    </motion.div>
  );
}
