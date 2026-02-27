'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand, ArticleStatus } from '@media-network/shared';

interface QueueArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  brand: Brand;
  status: ArticleStatus;
  author: string;
  is_ai_generated: boolean;
  submitted_at: string;
}

const MOCK_QUEUE: QueueArticle[] = [
  {
    id: '1',
    title: 'Travis Scott Announces Utopia Tour — 60 Cities Worldwide',
    excerpt: 'Travis Scott reveals massive global tour supporting his Utopia album, with stops across North America, Europe, and Asia.',
    category: 'Music',
    brand: 'saucewire',
    status: 'pending_review',
    author: 'AI Pipeline',
    is_ai_generated: true,
    submitted_at: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Balenciaga x Fortnite Collaboration Breaks Sales Records',
    excerpt: 'The luxury-gaming crossover sees unprecedented demand as digital fashion meets virtual worlds.',
    category: 'Fashion',
    brand: 'saucewire',
    status: 'pending_review',
    author: 'AI Pipeline',
    is_ai_generated: true,
    submitted_at: '2024-03-15T09:15:00Z',
  },
  {
    id: '3',
    title: 'How Amapiano Became the Sound of Global Youth Culture',
    excerpt: 'From Johannesburg to London to New York — tracing the rise of South Africa\'s biggest musical export.',
    category: 'Music',
    brand: 'trapglow',
    status: 'pending_review',
    author: 'DJ Source',
    is_ai_generated: false,
    submitted_at: '2024-03-15T08:00:00Z',
  },
  {
    id: '4',
    title: 'The Best Free VST Plugins for Trap Production in 2025',
    excerpt: 'A curated guide to must-have free plugins for aspiring trap producers.',
    category: 'Tutorials',
    brand: 'trapfrequency',
    status: 'pending_review',
    author: 'ProducerMike',
    is_ai_generated: false,
    submitted_at: '2024-03-14T22:00:00Z',
  },
  {
    id: '5',
    title: 'Zendaya\'s Met Gala Look Sparks Fashion Debate',
    excerpt: 'The actress turned heads with an avant-garde piece that divided fashion critics.',
    category: 'Fashion',
    brand: 'saucecaviar',
    status: 'pending_review',
    author: 'Maya Chen',
    is_ai_generated: false,
    submitted_at: '2024-03-14T20:00:00Z',
  },
  {
    id: '6',
    title: 'Spotify Wrapped 2025 — Early Predictions Based on Streaming Data',
    excerpt: 'Analyzing mid-year streaming trends to predict this year\'s biggest movers.',
    category: 'Tech',
    brand: 'saucewire',
    status: 'pending_review',
    author: 'AI Pipeline',
    is_ai_generated: true,
    submitted_at: '2024-03-14T18:00:00Z',
  },
  {
    id: '7',
    title: 'The Untold Story of Cash Money Records\' Early Days',
    excerpt: 'A deep dive into how Birdman and Slim built a hip-hop dynasty in New Orleans.',
    category: 'Music',
    brand: 'saucecaviar',
    status: 'pending_review',
    author: 'Historian Rick',
    is_ai_generated: false,
    submitted_at: '2024-03-14T16:00:00Z',
  },
  {
    id: '8',
    title: 'How to Mix 808s That Hit Hard on Any Speaker System',
    excerpt: 'Professional mixing techniques for getting your 808s to translate across all playback systems.',
    category: 'Tutorials',
    brand: 'trapfrequency',
    status: 'pending_review',
    author: 'EngineerAlex',
    is_ai_generated: false,
    submitted_at: '2024-03-14T14:00:00Z',
  },
];

const BRAND_COLORS: Record<Brand, string> = {
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  saucewire: '#E63946',
  trapfrequency: '#39FF14',
};

const BRAND_NAMES: Record<Brand, string> = {
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  saucewire: 'SauceWire',
  trapfrequency: 'TrapFrequency',
};

export function ContentQueuePage() {
  const [articles, setArticles] = useState(MOCK_QUEUE);
  const [filterBrand, setFilterBrand] = useState<Brand | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'ai' | 'human'>('all');

  const filtered = articles.filter((a) => {
    if (filterBrand !== 'all' && a.brand !== filterBrand) return false;
    if (filterType === 'ai' && !a.is_ai_generated) return false;
    if (filterType === 'human' && a.is_ai_generated) return false;
    return true;
  });

  const handleApprove = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleReject = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Queue</h1>
          <p className="text-sm text-gray-500 mt-1">
            {articles.length} articles pending review
          </p>
        </div>
        <button className="admin-btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </button>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-3">
        {/* Brand filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Brand:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterBrand('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterBrand === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              All
            </button>
            {(Object.keys(BRAND_NAMES) as Brand[]).map((brand) => (
              <button
                key={brand}
                onClick={() => setFilterBrand(brand)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  filterBrand === brand ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[brand] }} />
                {BRAND_NAMES[brand]}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-5 bg-white/10" />

        {/* Type filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Type:</span>
          <div className="flex gap-1">
            {(['all', 'ai', 'human'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterType === type ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {type === 'ai' ? '🤖 AI' : type === 'human' ? '✍️ Human' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Queue list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((article, i) => (
            <motion.div
              key={article.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.03 }}
              className="glass-panel p-5 hover:bg-admin-hover/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div className="flex-shrink-0 mt-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: BRAND_COLORS[article.brand] }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-700">•</span>
                    <span className="text-xs font-mono" style={{ color: BRAND_COLORS[article.brand] }}>
                      {BRAND_NAMES[article.brand]}
                    </span>
                    {article.is_ai_generated && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                        🤖 AI
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-1">{article.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span className="font-mono">
                      {new Date(article.submitted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(article.id)}
                    className="admin-btn-success px-4 py-2 text-xs flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(article.id)}
                    className="admin-btn-danger px-4 py-2 text-xs flex items-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject
                  </button>
                  <button className="admin-btn-ghost px-3 py-2 text-xs">
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-12 text-center"
          >
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-white mb-2">Queue is clear!</h3>
            <p className="text-sm text-gray-500">
              No articles pending review. The AI pipeline will generate new content soon.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
