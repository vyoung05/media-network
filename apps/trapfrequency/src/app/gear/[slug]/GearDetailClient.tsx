'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';
import type { GearReview } from '@/lib/mock-data';

interface GearDetailClientProps {
  review: GearReview;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-6 h-6"
          fill={star <= Math.floor(rating) ? '#FFB800' : star <= rating ? '#FFB80080' : '#FFB80020'}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-lg font-headline font-bold text-accent ml-2">{rating}/5</span>
    </div>
  );
}

export function GearDetailClient({ review }: GearDetailClientProps) {
  return (
    <div className="min-h-screen py-12">
      <div className="container-freq max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral/40">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/gear" className="hover:text-primary transition-colors">Gear</Link>
            <span>/</span>
            <span className="text-accent/60 truncate">{review.product}</span>
          </div>
        </nav>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono text-neutral/50 bg-surface border border-white/10 px-2 py-1 rounded">
              {review.brand}
            </span>
            <span className="text-xs font-mono text-accent bg-accent/10 border border-accent/20 px-2 py-1 rounded">
              {review.category}
            </span>
            <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded">
              {review.price}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-headline font-black text-white leading-tight mb-4">
            {review.title}
          </h1>

          <StarRating rating={review.rating} />

          <p className="text-lg text-neutral/60 leading-relaxed mt-4 mb-6">
            {review.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-3 py-4 border-y border-primary/10">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-sm font-bold text-accent">{review.author.name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-sm font-bold text-white">{review.author.name}</p>
              <p className="text-[10px] font-mono text-neutral/40">{review.author.location}</p>
            </div>
          </div>
        </motion.div>

        {/* Product image placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-8"
        >
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-surface to-secondary">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-3 opacity-30">
                  {review.category === 'Drum Machines' ? '🥁' :
                   review.category === 'Monitors' ? '🔊' :
                   review.category === 'Microphones' ? '🎤' :
                   review.category === 'Audio Interfaces' ? '🎚️' :
                   review.category === 'Headphones' ? '🎧' :
                   review.category === 'Controllers' ? '🎛️' :
                   review.category === 'MIDI Controllers' ? '🎹' : '⚙️'}
                </div>
                <p className="text-lg font-headline font-bold text-neutral/20">{review.product}</p>
                <p className="text-sm font-mono text-neutral/15">{review.brand}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pros & Cons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <GlassMorphCard className="p-6" hoverTilt={false} glowColor="rgba(57, 255, 20, 0.1)">
            <h3 className="text-sm font-headline font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>✓</span> Pros
            </h3>
            <ul className="space-y-3">
              {review.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral/70">
                  <span className="text-primary mt-1 flex-shrink-0">+</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </GlassMorphCard>

          <GlassMorphCard className="p-6" hoverTilt={false} glowColor="rgba(230, 57, 70, 0.1)">
            <h3 className="text-sm font-headline font-bold text-red-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>✗</span> Cons
            </h3>
            <ul className="space-y-3">
              {review.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral/70">
                  <span className="text-red-400 mt-1 flex-shrink-0">−</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </GlassMorphCard>
        </motion.div>

        {/* Verdict */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-8"
        >
          <GlassMorphCard className="p-6 md:p-8" hoverTilt={false} glowColor="rgba(255, 184, 0, 0.1)">
            <h3 className="text-lg font-headline font-bold text-accent uppercase tracking-wider mb-4">
              The Verdict
            </h3>
            <p className="text-lg text-neutral/70 leading-relaxed italic">
              &ldquo;{review.verdict}&rdquo;
            </p>
            <div className="mt-4 flex items-center justify-between">
              <StarRating rating={review.rating} />
              <span className="text-lg font-headline font-bold text-accent">{review.price}</span>
            </div>
          </GlassMorphCard>
        </motion.div>
      </div>
    </div>
  );
}
