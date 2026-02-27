'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassMorphCard } from './GlassMorphCard';
import type { GearReview } from '@/lib/mock-data';

interface GearReviewCardProps {
  review: GearReview;
  index?: number;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.floor(rating);
        const partial = !filled && star <= rating;
        return (
          <svg
            key={star}
            className="w-4 h-4"
            fill={filled ? '#FFB800' : partial ? '#FFB80080' : '#FFB80020'}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
      <span className="text-xs font-mono text-accent ml-1">{rating}</span>
    </div>
  );
}

export function GearReviewCard({ review, index = 0 }: GearReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/gear/${review.slug}`} data-cursor="REVIEW">
        <GlassMorphCard className="h-full group" glowColor="rgba(255, 184, 0, 0.12)">
          {/* Product image placeholder */}
          <div className="relative h-48 bg-gradient-to-br from-surface to-secondary overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20" />

            {/* Product silhouette area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2 opacity-30">
                  {review.category === 'Drum Machines' ? '🥁' :
                   review.category === 'Monitors' ? '🔊' :
                   review.category === 'Microphones' ? '🎤' :
                   review.category === 'Audio Interfaces' ? '🎚️' :
                   review.category === 'Headphones' ? '🎧' :
                   review.category === 'Controllers' ? '🎛️' :
                   review.category === 'MIDI Controllers' ? '🎹' : '⚙️'}
                </div>
                <span className="text-xs font-mono text-neutral/30 uppercase tracking-wider">
                  {review.category}
                </span>
              </div>
            </div>

            {/* Brand badge */}
            <div className="absolute top-3 left-3">
              <span className="text-xs font-mono font-bold text-white/80 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                {review.brand}
              </span>
            </div>

            {/* Price tag */}
            <div className="absolute top-3 right-3">
              <span className="text-xs font-mono font-bold text-accent bg-accent/10 border border-accent/30 px-2 py-1 rounded">
                {review.price}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="text-sm font-bold text-white group-hover:text-accent transition-colors line-clamp-2 mb-2 leading-snug">
              {review.title}
            </h3>

            <StarRating rating={review.rating} />

            <p className="text-xs text-neutral/50 line-clamp-2 mt-2 mb-3 leading-relaxed">
              {review.excerpt}
            </p>

            {/* Quick pros/cons */}
            <div className="space-y-1.5 mb-3">
              <div className="flex items-start gap-1.5">
                <span className="text-primary text-xs mt-0.5">✓</span>
                <span className="text-[11px] text-neutral/50 line-clamp-1">{review.pros[0]}</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-red-400 text-xs mt-0.5">✗</span>
                <span className="text-[11px] text-neutral/50 line-clamp-1">{review.cons[0]}</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center justify-between pt-3 border-t border-primary/10">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-accent">
                    {review.author.name.charAt(0)}
                  </span>
                </div>
                <span className="text-[10px] text-neutral/50 font-mono">{review.author.name}</span>
              </div>
              <span className="text-[10px] text-neutral/30 font-mono">
                {review.product}
              </span>
            </div>
          </div>
        </GlassMorphCard>
      </Link>
    </motion.div>
  );
}
