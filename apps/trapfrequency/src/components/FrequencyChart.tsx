'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { FrequencyChartEntry } from '@/lib/mock-data';
import { formatNumber } from '@/lib/mock-data';

interface FrequencyChartProps {
  entries: FrequencyChartEntry[];
  limit?: number;
}

function RankChange({ current, previous }: { current: number; previous: number | null }) {
  if (previous === null) {
    return <span className="text-[10px] font-mono text-accent font-bold">NEW</span>;
  }
  const diff = previous - current;
  if (diff > 0) {
    return (
      <span className="text-[10px] font-mono text-primary flex items-center gap-0.5">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 14l5-5 5 5z" />
        </svg>
        {diff}
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="text-[10px] font-mono text-red-400 flex items-center gap-0.5">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
        {Math.abs(diff)}
      </span>
    );
  }
  return <span className="text-[10px] font-mono text-neutral/30">—</span>;
}

export function FrequencyChart({ entries, limit = 10 }: FrequencyChartProps) {
  const displayEntries = entries.slice(0, limit);

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_60px_60px_50px] gap-2 px-3 py-2 text-[10px] font-mono text-neutral/30 uppercase tracking-wider border-b border-primary/10">
        <span>#</span>
        <span>Track</span>
        <span className="text-right">Plays</span>
        <span className="text-right">Wks</span>
        <span className="text-right">Δ</span>
      </div>

      {displayEntries.map((entry, i) => (
        <motion.div
          key={entry.beat.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
        >
          <Link
            href={`/beats/${entry.beat.slug}`}
            className="grid grid-cols-[40px_1fr_60px_60px_50px] gap-2 px-3 py-2.5 rounded-lg hover:bg-primary/5 transition-all duration-200 group items-center"
            data-cursor="LISTEN"
          >
            {/* Rank */}
            <span className={`text-lg font-headline font-bold ${
              entry.rank <= 3 ? 'text-primary glow-text' : 'text-neutral/40'
            }`}>
              {entry.rank}
            </span>

            {/* Track Info */}
            <div className="min-w-0">
              <p className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                {entry.beat.title}
              </p>
              <p className="text-[10px] font-mono text-neutral/40 truncate">
                {entry.beat.producer.name} · {entry.beat.genre} · {entry.beat.bpm} BPM
              </p>
            </div>

            {/* Plays */}
            <span className="text-xs font-mono text-neutral/50 text-right">
              {formatNumber(entry.beat.plays)}
            </span>

            {/* Weeks on chart */}
            <span className="text-xs font-mono text-neutral/40 text-right">
              {entry.weeksOnChart}
            </span>

            {/* Rank change */}
            <div className="flex justify-end">
              <RankChange current={entry.rank} previous={entry.previousRank} />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
