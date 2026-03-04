'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseBrowserClient } from '@media-network/shared';
import type { Brand } from '@media-network/shared';
import { useRouter } from 'next/navigation';

// ======================== TYPES ========================

interface DashboardStats {
  totalArticles: number;
  pendingReview: number;
  activeWriters: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  totalViews: number;
}

interface RecentActivityItem {
  action: string;
  detail: string;
  time: string;
  type: 'publish' | 'submission' | 'writer' | 'pending' | 'rejected';
  brand: Brand;
}

interface BrandStat {
  brand: Brand;
  name: string;
  color: string;
  articles: number;
  views: number;
}

// ======================== STAT CARD ========================

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

function StatCard({ label, value, change, changeType, icon, color, loading }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            changeType === 'up'
              ? 'bg-emerald-500/10 text-emerald-400'
              : changeType === 'down'
              ? 'bg-red-500/10 text-red-400'
              : 'bg-gray-500/10 text-gray-400'
          }`}
        >
          {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '–'} {change}
        </span>
      </div>
      {loading ? (
        <div className="h-8 w-16 bg-white/5 rounded animate-pulse mb-1" />
      ) : (
        <p className="text-2xl font-bold text-white mb-1">{value}</p>
      )}
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

// ======================== HELPERS ========================

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

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatViewCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ======================== RECENT ACTIVITY ========================

function RecentActivity({ activities, loading }: { activities: RecentActivityItem[]; loading: boolean }) {
  const typeColors: Record<string, string> = {
    publish: 'bg-emerald-500',
    submission: 'bg-blue-500',
    writer: 'bg-purple-500',
    pending: 'bg-amber-500',
    rejected: 'bg-red-500',
  };

  if (loading) {
    return (
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="px-6 py-3.5">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-1.5 bg-white/10 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">No recent activity yet. Start adding content!</p>
          </div>
        ) : (
          activities.map((activity, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="px-6 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColors[activity.type] || 'bg-gray-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-300">{activity.action}</p>
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: BRAND_COLORS[activity.brand] }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
                </div>
                <span className="text-xs font-mono text-gray-600 whitespace-nowrap">{activity.time}</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ======================== QUICK ACTIONS ========================

function QuickActions() {
  const actions = [
    { label: 'New Article', icon: '✏️', href: '/dashboard/content' },
    { label: 'Review Queue', icon: '📋', href: '/dashboard/content' },
    { label: 'View Submissions', icon: '📥', href: '/dashboard/submissions' },
    { label: 'Manage Writers', icon: '👥', href: '/dashboard/writers' },
  ];

  return (
    <div className="glass-panel p-6">
      <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] transition-all duration-200 group"
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
              {action.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ======================== BRAND OVERVIEW ========================

function BrandOverview({ brandStats, loading }: { brandStats: BrandStat[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Brand Overview</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4">
              <div className="w-3 h-3 rounded-full bg-white/10 animate-pulse" />
              <div className="flex-1 h-4 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white">Brand Overview</h3>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {brandStats.map((brand) => (
          <div key={brand.brand} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: brand.color }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{brand.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-gray-300">{brand.articles} articles</p>
              <p className="text-xs font-mono text-gray-500">{formatViewCount(brand.views)} views</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              brand.articles > 0
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-amber-500/10 text-amber-400'
            }`}>
              {brand.articles > 0 ? 'Active' : 'Setup'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================== ANNOUNCEMENTS ========================

interface Announcement {
  id: string;
  title: string;
  description: string;
  from: string;
  date: string;
  videoUrl?: string;
  thumbnailGradient: string;
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to the Team! 🎉',
    description:
      'Hey everyone! Quick walkthrough of the admin dashboard and what we\'re building together.',
    from: 'Vincent',
    date: '2025-07-10',
    thumbnailGradient: 'from-blue-600 via-purple-600 to-indigo-700',
  },
  {
    id: '2',
    title: 'AI Pipeline Updates',
    description: 'New confidence scoring and per-brand voice settings are live.',
    from: 'Vincent',
    date: '2025-07-08',
    thumbnailGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
  },
  {
    id: '3',
    title: 'Submission Portal Launch',
    description: 'Artists can now submit directly through all brand sites.',
    from: 'Vincent',
    date: '2025-07-05',
    thumbnailGradient: 'from-amber-600 via-orange-600 to-red-700',
  },
];

function Announcements() {
  const [activeAnnouncement, setActiveAnnouncement] = useState(MOCK_ANNOUNCEMENTS[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0 }}
      className="glass-panel overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📢</span>
          <h3 className="text-sm font-semibold text-white">Announcements</h3>
        </div>
        <span className="text-xs text-gray-500 font-mono">
          {MOCK_ANNOUNCEMENTS.length} updates
        </span>
      </div>
      <div className="flex flex-col sm:flex-row">
        {/* Video / Thumbnail area */}
        <div className="sm:w-64 lg:w-80 flex-shrink-0 p-4">
          <div
            className={`relative aspect-video max-h-40 sm:max-h-none rounded-xl bg-gradient-to-br ${activeAnnouncement.thumbnailGradient} overflow-hidden group cursor-pointer`}
          >
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </motion.div>
            </div>
            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-[10px] font-mono text-white/70">VIDEO COMING SOON</p>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 sm:pl-0 flex flex-col">
          {/* Active announcement details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-blue-400">From: {activeAnnouncement.from}</span>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs font-mono text-gray-500">
                {new Date(activeAnnouncement.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
            <h4 className="text-base font-bold text-white mb-1">{activeAnnouncement.title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed">{activeAnnouncement.description}</p>
          </div>

          {/* Older announcements list */}
          {MOCK_ANNOUNCEMENTS.length > 1 && (
            <div className="mt-4 pt-3 border-t border-white/[0.06]">
              <p className="text-xs font-mono text-gray-600 uppercase tracking-wider mb-2">Previous</p>
              <div className="space-y-1.5">
                {MOCK_ANNOUNCEMENTS.filter((a) => a.id !== activeAnnouncement.id).map((ann) => (
                  <button
                    key={ann.id}
                    onClick={() => setActiveAnnouncement(ann)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-white/[0.04] transition-colors group"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-br ${ann.thumbnailGradient}`} />
                    <span className="text-xs text-gray-400 group-hover:text-white transition-colors truncate flex-1">
                      {ann.title}
                    </span>
                    <span className="text-[10px] font-mono text-gray-600 flex-shrink-0">
                      {new Date(ann.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ======================== NEWS SCANNER ========================

interface NewsFeedItem {
  id: string;
  source: string;
  title: string;
  link: string;
  pubDate: string;
  category: 'Music' | 'Sports' | 'Entertainment' | 'Celebrity' | 'Other';
}

const CATEGORY_TABS = ['All', 'Music', 'Sports', 'Entertainment', 'Celebrity'] as const;

// Map granular API categories → dashboard tab categories
const CATEGORY_MAP: Record<string, typeof CATEGORY_TABS[number]> = {
  Music: 'Music',
  'Hip-Hop': 'Music',
  'R&B': 'Music',
  Pop: 'Music',
  Electronic: 'Music',
  Latin: 'Music',
  Alternative: 'Music',
  Production: 'Music',
  Tutorials: 'Music',
  Beats: 'Music',
  Gear: 'Music',
  'DAW Tips': 'Music',
  Samples: 'Music',
  Interviews: 'Music',
  Sports: 'Sports',
  Entertainment: 'Entertainment',
  Fashion: 'Entertainment',
  Art: 'Entertainment',
  Culture: 'Entertainment',
  Lifestyle: 'Entertainment',
  Tech: 'Entertainment',
  Celebrity: 'Celebrity',
  Other: 'Entertainment',
};

function normalizeCategory(rawCategory: string): typeof CATEGORY_TABS[number] {
  return CATEGORY_MAP[rawCategory] || 'Entertainment';
}

const CATEGORY_COLORS: Record<string, string> = {
  Music: 'bg-purple-500/10 text-purple-400',
  Sports: 'bg-emerald-500/10 text-emerald-400',
  Entertainment: 'bg-amber-500/10 text-amber-400',
  Celebrity: 'bg-pink-500/10 text-pink-400',
  Other: 'bg-gray-500/10 text-gray-400',
};

function NewsScanner() {
  const router = useRouter();
  const [items, setItems] = useState<NewsFeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORY_TABS[number]>('All');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<Record<string, Brand>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/news-feed');
      if (!res.ok) throw new Error('Failed to fetch news');
      const data = await res.json();
      setItems(data.items || []);
      setLastUpdated(data.fetchedAt || new Date().toISOString());
    } catch (err) {
      console.error('News fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load news');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter((item) => normalizeCategory(item.category) === activeCategory);

  const handleDraftArticle = (item: NewsFeedItem) => {
    const params = new URLSearchParams({
      draft_title: item.title,
      draft_source: item.link,
    });
    router.push(`/dashboard/content?${params.toString()}`);
  };

  const getDefaultBrand = (category: string): Brand => {
    switch (category) {
      case 'Music': return 'trapglow';
      case 'Sports': return 'saucewire';
      case 'Celebrity': return 'saucecaviar';
      case 'Entertainment': return 'saucewire';
      default: return 'saucewire';
    }
  };

  const getBrandForItem = (item: NewsFeedItem): Brand => {
    return selectedBrands[item.id] || getDefaultBrand(item.category);
  };

  const handleAIGenerate = async (item: NewsFeedItem) => {
    const brand = getBrandForItem(item);
    setGeneratingId(item.id);
    setToast(null);

    try {
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsUrl: item.link,
          newsTitle: item.title,
          newsSource: item.source,
          brand,
          category: item.category,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const mediaInfo = data.media
          ? ` with ${data.media.imagesFound} image${data.media.imagesFound !== 1 ? 's' : ''} and ${data.media.videosFound} video${data.media.videosFound !== 1 ? 's' : ''} found`
          : '';
        setToast({ message: `✅ Generated: "${data.article.title}" for ${BRAND_NAMES[brand]}${mediaInfo}`, type: 'success' });
      } else {
        setToast({ message: `❌ ${data.error || 'Generation failed'}`, type: 'error' });
      }
    } catch (err) {
      setToast({ message: `❌ ${err instanceof Error ? err.message : 'Network error'}`, type: 'error' });
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-panel overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📡</span>
          <h3 className="text-sm font-semibold text-white">News Scanner</h3>
          {items.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
              {items.length} stories
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[10px] font-mono text-gray-600">
              Updated {timeAgo(lastUpdated)}
            </span>
          )}
          <button
            onClick={fetchNews}
            disabled={loading}
            className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            title="Refresh"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <motion.svg
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            {/* Ticker */}
            {items.length > 0 && (
              <div className="px-6 py-2 border-b border-white/[0.04] overflow-hidden relative">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider flex-shrink-0 bg-red-500/10 px-1.5 py-0.5 rounded">
                    LIVE
                  </span>
                  <div className="overflow-hidden flex-1">
                    <motion.div
                      animate={{ x: [0, -2000] }}
                      transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                      className="flex gap-8 whitespace-nowrap"
                    >
                      {[...items, ...items].slice(0, 20).map((item, i) => (
                        <span key={`ticker-${i}`} className="text-xs text-gray-400">
                          <span className="text-gray-600">{item.source}:</span>{' '}
                          {item.title}
                        </span>
                      ))}
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Tabs */}
            <div className="px-6 py-3 border-b border-white/[0.04] flex items-center gap-2">
              {CATEGORY_TABS.map((tab) => {
                const count = tab === 'All' ? items.length : items.filter((i) => normalizeCategory(i.category) === tab).length;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveCategory(tab)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      activeCategory === tab
                        ? 'bg-white/10 text-white'
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {tab}
                    {count > 0 && (
                      <span className={`ml-1 text-[10px] font-mono ${activeCategory === tab ? 'text-blue-400' : 'text-gray-600'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">⚠️</span>
                    <p className="text-sm text-red-400">{error}</p>
                    <button onClick={fetchNews} className="ml-auto text-xs text-red-300 hover:text-white underline">Retry</button>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-4 bg-admin-bg/40 rounded-lg border border-admin-border">
                      <div className="h-3 w-16 bg-white/5 rounded animate-pulse mb-2" />
                      <div className="h-4 w-full bg-white/5 rounded animate-pulse mb-2" />
                      <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse mb-3" />
                      <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No stories found{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {filteredItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-4 bg-admin-bg/40 rounded-lg border border-admin-border hover:border-white/10 transition-colors group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">{item.source}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${CATEGORY_COLORS[normalizeCategory(item.category)] || CATEGORY_COLORS.Other}`}>
                          {normalizeCategory(item.category)}
                        </span>
                      </div>
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm font-medium text-white hover:text-blue-400 transition-colors line-clamp-2 mb-3"
                      >
                        {item.title}
                      </a>
                      {/* Brand selector */}
                      <div className="flex items-center gap-1.5 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(['saucecaviar', 'trapglow', 'saucewire', 'trapfrequency'] as Brand[]).map((b) => (
                          <button
                            key={b}
                            onClick={() => setSelectedBrands(prev => ({ ...prev, [item.id]: b }))}
                            className={`w-4 h-4 rounded-full border-2 transition-all ${
                              getBrandForItem(item) === b
                                ? 'border-white scale-110'
                                : 'border-transparent opacity-50 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: BRAND_COLORS[b] }}
                            title={BRAND_NAMES[b]}
                          />
                        ))}
                        <span className="text-[9px] font-mono text-gray-600 ml-1">
                          {BRAND_NAMES[getBrandForItem(item)]}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] font-mono text-gray-600">
                          {timeAgo(item.pubDate)}
                        </span>
                        <button
                          onClick={() => handleDraftArticle(item)}
                          className="text-[10px] font-medium text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                        >
                          📝 Manual
                        </button>
                      </div>
                      {/* Always-visible AI Generate button */}
                      <button
                        onClick={() => handleAIGenerate(item)}
                        disabled={generatingId === item.id}
                        className="mt-2 w-full py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {generatingId === item.id ? (
                          <>
                            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Generating Story...
                          </>
                        ) : (
                          <>🤖 Auto Generate Story</>
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Toast notification */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mx-6 mb-4 px-4 py-3 rounded-lg text-sm flex items-center justify-between ${
                    toast.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}
                >
                  <span>{toast.message}</span>
                  <div className="flex items-center gap-2 ml-3">
                    {toast.type === 'success' && (
                      <a
                        href="/dashboard/content"
                        className="text-xs underline opacity-80 hover:opacity-100"
                      >
                        View in Queue
                      </a>
                    )}
                    <button
                      onClick={() => setToast(null)}
                      className="text-current opacity-60 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ======================== MAIN COMPONENT ========================

export function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats>({
    totalArticles: 0,
    pendingReview: 0,
    activeWriters: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    totalViews: 0,
  });
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [brandStats, setBrandStats] = useState<BrandStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const supabase = getSupabaseBrowserClient();

        // Fetch all stats in parallel
        const [
          articlesRes,
          pendingRes,
          writersRes,
          submissionsRes,
          pendingSubsRes,
          viewsRes,
          // Brand-level article counts
          scArticlesRes,
          tgArticlesRes,
          swArticlesRes,
          tfArticlesRes,
          // Recent articles for activity feed
          recentArticlesRes,
          recentSubmissionsRes,
          recentUsersRes,
        ] = await Promise.all([
          // Total articles
          supabase.from('articles').select('*', { count: 'exact', head: true }),
          // Pending review articles
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'pending_review'),
          // Active writers (role in writer, editor, admin)
          supabase.from('users').select('*', { count: 'exact', head: true }).in('role', ['writer', 'editor', 'admin']),
          // Total submissions
          supabase.from('submissions').select('*', { count: 'exact', head: true }),
          // Pending submissions
          supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          // Total views (sum view_count from articles)
          supabase.from('articles').select('view_count'),
          // Per-brand article counts
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('brand', 'saucecaviar'),
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('brand', 'trapglow'),
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('brand', 'saucewire'),
          supabase.from('articles').select('*', { count: 'exact', head: true }).eq('brand', 'trapfrequency'),
          // Recent articles for activity feed
          supabase.from('articles').select('id, title, status, brand, created_at, is_ai_generated').order('created_at', { ascending: false }).limit(5),
          // Recent submissions
          supabase.from('submissions').select('id, title, brand, status, contact_name, submitted_at, is_anonymous').order('submitted_at', { ascending: false }).limit(5),
          // Recent users
          supabase.from('users').select('id, name, role, created_at').order('created_at', { ascending: false }).limit(3),
        ]);

        // Calculate total views from articles' view_count
        const totalViews = viewsRes.data
          ? viewsRes.data.reduce((sum: number, a: { view_count: number }) => sum + (a.view_count || 0), 0)
          : 0;

        // Also try to get page_views count
        const pageViewsRes = await supabase.from('page_views').select('*', { count: 'exact', head: true });
        const pageViewsCount = pageViewsRes.count || 0;

        setStats({
          totalArticles: articlesRes.count || 0,
          pendingReview: pendingRes.count || 0,
          activeWriters: writersRes.count || 0,
          totalSubmissions: submissionsRes.count || 0,
          pendingSubmissions: pendingSubsRes.count || 0,
          totalViews: totalViews + pageViewsCount,
        });

        // Build brand stats
        const brands: Brand[] = ['saucewire', 'saucecaviar', 'trapglow', 'trapfrequency'];
        const brandCounts = [swArticlesRes.count || 0, scArticlesRes.count || 0, tgArticlesRes.count || 0, tfArticlesRes.count || 0];
        
        // Get per-brand view counts
        const brandViewData: BrandStat[] = [];
        for (let i = 0; i < brands.length; i++) {
          const brand = brands[i];
          const viewRes = await supabase.from('articles').select('view_count').eq('brand', brand);
          const views = viewRes.data
            ? viewRes.data.reduce((sum: number, a: { view_count: number }) => sum + (a.view_count || 0), 0)
            : 0;
          brandViewData.push({
            brand,
            name: BRAND_NAMES[brand],
            color: BRAND_COLORS[brand],
            articles: brandCounts[i],
            views,
          });
        }
        setBrandStats(brandViewData);

        // Build recent activity from real data
        const activityItems: RecentActivityItem[] = [];

        // Recent articles
        if (recentArticlesRes.data) {
          for (const article of recentArticlesRes.data) {
            const statusMap: Record<string, { action: string; type: RecentActivityItem['type'] }> = {
              published: { action: 'Article published', type: 'publish' },
              pending_review: { action: 'Article pending review', type: 'pending' },
              draft: { action: 'Draft created', type: 'pending' },
              archived: { action: 'Article archived', type: 'rejected' },
            };
            const info = statusMap[article.status] || { action: `Article ${article.status}`, type: 'pending' as const };
            activityItems.push({
              action: info.action,
              detail: `${article.title}${article.is_ai_generated ? ' — AI Generated' : ''}`,
              time: timeAgo(article.created_at),
              type: info.type,
              brand: article.brand as Brand,
            });
          }
        }

        // Recent submissions
        if (recentSubmissionsRes.data) {
          for (const sub of recentSubmissionsRes.data) {
            activityItems.push({
              action: sub.status === 'pending' ? 'Submission received' : `Submission ${sub.status}`,
              detail: `${sub.title}${sub.is_anonymous ? ' (anonymous)' : sub.contact_name ? ` from ${sub.contact_name}` : ''}`,
              time: timeAgo(sub.submitted_at),
              type: 'submission',
              brand: sub.brand as Brand,
            });
          }
        }

        // Recent users
        if (recentUsersRes.data) {
          for (const user of recentUsersRes.data) {
            activityItems.push({
              action: `Writer joined`,
              detail: `${user.name} — ${user.role}`,
              time: timeAgo(user.created_at),
              type: 'writer',
              brand: 'saucewire' as Brand, // default
            });
          }
        }

        // Sort by most recent (rough — based on the time string isn't ideal, but items came sorted from DB)
        setActivities(activityItems.slice(0, 10));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your media network — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="glass-panel p-4 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => window.location.reload()} className="ml-auto text-xs text-red-300 hover:text-white underline">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Announcements */}
      <Announcements />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard
            label="Total Articles"
            value={loading ? '—' : stats.totalArticles.toLocaleString()}
            change={loading ? '...' : `${stats.pendingReview} pending`}
            changeType="neutral"
            color="#3B82F6"
            loading={loading}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatCard
            label="Pending Review"
            value={loading ? '—' : stats.pendingReview}
            change={loading ? '...' : stats.pendingReview > 0 ? 'needs attention' : 'all clear'}
            changeType={stats.pendingReview > 0 ? 'neutral' : 'up'}
            color="#F59E0B"
            loading={loading}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard
            label="Active Writers"
            value={loading ? '—' : stats.activeWriters}
            change={loading ? '...' : 'writers & editors'}
            changeType="up"
            color="#10B981"
            loading={loading}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard
            label="Submissions"
            value={loading ? '—' : stats.totalSubmissions}
            change={loading ? '...' : `${stats.pendingSubmissions} pending`}
            changeType={stats.pendingSubmissions > 0 ? 'up' : 'neutral'}
            color="#8B5CF6"
            loading={loading}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            }
          />
        </motion.div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} loading={loading} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <BrandOverview brandStats={brandStats} loading={loading} />
        </div>
      </div>

      {/* News Scanner */}
      <NewsScanner />
    </div>
  );
}
