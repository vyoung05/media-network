'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GearReviewCard } from '@/components/GearReviewCard';
import { TextReveal } from '@/components/TextReveal';
import type { GearReview, GearCategory } from '@/lib/mock-data';

interface GearPageClientProps {
  reviews: GearReview[];
}

const GEAR_CATEGORIES: GearCategory[] = [
  'Controllers', 'Monitors', 'Headphones', 'Microphones',
  'Audio Interfaces', 'MIDI Controllers', 'Drum Machines',
  'Synthesizers', 'Software', 'Accessories',
];

export function GearPageClient({ reviews }: GearPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<GearCategory | 'All'>('All');

  const filteredReviews = useMemo(() => {
    if (selectedCategory === 'All') return reviews;
    return reviews.filter(r => r.category === selectedCategory);
  }, [reviews, selectedCategory]);

  // Only show categories that have reviews
  const availableCategories = useMemo(() => {
    const cats = new Set(reviews.map(r => r.category));
    return GEAR_CATEGORIES.filter(c => cats.has(c));
  }, [reviews]);

  return (
    <div className="min-h-screen py-12">
      <div className="container-freq">
        {/* Header */}
        <div className="mb-10">
          <TextReveal
            text="GEAR REVIEWS"
            as="h1"
            className="text-4xl md:text-5xl font-headline font-black text-white tracking-tight mb-3"
            speed={30}
          />
          <p className="text-lg text-neutral/50 font-body max-w-xl">
            Honest, in-depth equipment reviews from producers who actually use this gear.
            Find the right tools for your studio.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <label className="text-xs font-mono text-neutral/40 uppercase tracking-wider mb-2 block">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 border ${
                selectedCategory === 'All'
                  ? 'text-accent border-accent/50 bg-accent/10'
                  : 'text-neutral/50 border-white/10 hover:border-accent/30'
              }`}
            >
              All Gear
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-300 border ${
                  selectedCategory === cat
                    ? 'text-accent border-accent/50 bg-accent/10'
                    : 'text-neutral/50 border-white/10 hover:border-accent/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <span className="text-sm font-mono text-neutral/40">
            {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Reviews Grid */}
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredReviews.map((review, i) => (
              <GearReviewCard key={review.id} review={review} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl font-headline text-neutral/30 mb-2">No reviews yet</p>
            <p className="text-sm font-mono text-neutral/20">Check back soon for more gear reviews</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
