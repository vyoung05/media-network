'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassMorphCard } from '@/components/GlassMorphCard';
import type { BlogPost } from '@/lib/mock-data';
import { timeAgo } from '@media-network/shared';

interface BlogPageClientProps {
  posts: BlogPost[];
}

const CATEGORIES = ['All', 'Feature', 'Interview', 'Analysis', 'List'];

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filtered = activeCategory === 'All'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featuredPost = filtered[0];
  const remainingPosts = filtered.slice(1);

  return (
    <div className="container-glow py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-white mb-2">
          The <span className="text-gradient">Blog</span>
        </h1>
        <p className="text-white/50 font-body">
          Features, interviews, and analysis on the artists shaping music&apos;s future.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 text-xs font-body font-medium rounded-full whitespace-nowrap transition-all duration-300 border ${
              activeCategory === cat
                ? 'bg-primary text-white border-primary'
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Featured post */}
          {featuredPost && (
            <Link href={`/blog/${featuredPost.slug}`} className="block mb-8">
              <GlassMorphCard className="group overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-80 overflow-hidden">
                    <Image
                      src={featuredPost.cover_image}
                      alt={featuredPost.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface/80 hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent lg:hidden" />
                    <div className="absolute top-4 left-4">
                      <span className="px-2.5 py-1 text-[10px] font-bold bg-primary/80 text-white rounded-full backdrop-blur-sm">
                        {featuredPost.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <span className="text-xs text-accent font-body uppercase tracking-widest mb-2">Latest Feature</span>
                    <h2 className="text-xl lg:text-2xl font-headline font-bold text-white group-hover:text-accent transition-colors mb-3">
                      {featuredPost.title}
                    </h2>
                    <p className="text-sm text-white/50 font-body line-clamp-3 mb-4">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/60 font-body">{featuredPost.author.name}</span>
                      <span className="text-white/10">·</span>
                      <span className="text-xs text-white/40 font-body">{featuredPost.reading_time_minutes} min read</span>
                      <span className="text-white/10">·</span>
                      <span className="text-xs text-white/40 font-body">{timeAgo(featuredPost.published_at)}</span>
                    </div>
                  </div>
                </div>
              </GlassMorphCard>
            </Link>
          )}

          {/* Posts grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.3 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <GlassMorphCard className="group h-full">
                    <div className="relative h-44 overflow-hidden">
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/80 text-white rounded-full backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-headline font-bold text-white group-hover:text-accent transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-white/40 font-body line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-white/30 font-body">
                        <span>{post.author.name}</span>
                        <span>{post.reading_time_minutes} min · {timeAgo(post.published_at)}</span>
                      </div>
                    </div>
                  </GlassMorphCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-lg font-headline text-white/50">No posts in this category yet</p>
        </div>
      )}
    </div>
  );
}
