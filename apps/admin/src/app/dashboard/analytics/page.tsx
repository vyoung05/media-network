'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useBrand } from '@/contexts/BrandContext';

interface AnalyticsData {
  overview: {
    totalArticles: number;
    publishedArticles: number;
    totalViews: number;
    avgReadingTime: number;
    totalVotes: number;
    totalSubscribers: number;
  };
  topArticles: {
    id: string;
    title: string;
    brand: string;
    view_count: number;
    category: string;
    published_at: string;
  }[];
  brandBreakdown: {
    brand: string;
    articles: number;
    views: number;
    published: number;
  }[];
  recentActivity: {
    type: string;
    title: string;
    brand: string;
    time: string;
  }[];
  voteTrends: {
    trackTitle: string;
    artist: string;
    hotPct: number;
    totalVotes: number;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
    brand: string;
  }[];
}

const BRAND_COLORS: Record<string, string> = {
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  saucewire: '#E63946',
  trapfrequency: '#39FF14',
};

const BRAND_NAMES: Record<string, string> = {
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  saucewire: 'SauceWire',
  trapfrequency: 'TrapFrequency',
};

function StatCard({ label, value, icon, color, delay }: { label: string; value: string | number; icon: string; color?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay || 0 }}
      className="glass-panel p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{icon}</span>
        {color && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />}
      </div>
      <p className="text-2xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </motion.div>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
    </div>
  );
}

export default function AnalyticsPage() {
  const { activeBrand } = useBrand();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ range: timeRange });
      if (activeBrand) params.set('brand', activeBrand);
      const res = await fetch(`/api/analytics?${params}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [activeBrand, timeRange]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            📊 Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeBrand ? BRAND_NAMES[activeBrand] : 'All Brands'} · Performance overview
          </p>
        </div>
        <div className="flex gap-1 bg-white/[0.03] rounded-lg p-1">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                timeRange === range
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {range === 'all' ? 'All Time' : range.replace('d', ' Days')}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="glass-panel p-12 text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500 mt-3">Loading analytics...</p>
        </div>
      ) : data ? (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <StatCard label="Total Articles" value={data.overview.totalArticles} icon="📝" delay={0} />
            <StatCard label="Published" value={data.overview.publishedArticles} icon="🚀" delay={0.05} />
            <StatCard label="Total Views" value={data.overview.totalViews} icon="👁️" delay={0.1} />
            <StatCard label="Avg Read Time" value={`${data.overview.avgReadingTime}m`} icon="⏱️" delay={0.15} />
            <StatCard label="Hot or Not Votes" value={data.overview.totalVotes} icon="🔥" delay={0.2} />
            <StatCard label="Subscribers" value={data.overview.totalSubscribers} icon="📬" delay={0.25} />
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Articles */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">🏆 Top Articles</h3>
                <p className="text-xs text-gray-500 mt-0.5">By view count</p>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {data.topArticles.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">No articles yet</div>
                ) : (
                  data.topArticles.slice(0, 8).map((article, i) => (
                    <div key={article.id} className="px-5 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors">
                      <span className="text-xs font-mono text-gray-600 w-6">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{article.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: BRAND_COLORS[article.brand] }}
                          />
                          <span className="text-[10px] text-gray-500">{article.category}</span>
                        </div>
                      </div>
                      <span className="text-sm font-mono text-gray-400">{article.view_count.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Brand Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass-panel overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">🏷️ Brand Breakdown</h3>
                <p className="text-xs text-gray-500 mt-0.5">Content distribution across brands</p>
              </div>
              <div className="p-5 space-y-4">
                {data.brandBreakdown.map((brand) => {
                  const maxViews = Math.max(...data.brandBreakdown.map((b) => b.views), 1);
                  return (
                    <div key={brand.brand}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: BRAND_COLORS[brand.brand] }}
                          />
                          <span className="text-sm text-white font-medium">
                            {BRAND_NAMES[brand.brand] || brand.brand}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{brand.articles} articles</span>
                          <span>{brand.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      <MiniBar value={brand.views} max={maxViews} color={BRAND_COLORS[brand.brand] || '#888'} />
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Hot or Not Trends */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">🔥 Hot or Not Trends</h3>
                <p className="text-xs text-gray-500 mt-0.5">Track voting results</p>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {data.voteTrends.length === 0 ? (
                  <div className="p-6 text-center text-sm text-gray-500">No votes yet</div>
                ) : (
                  data.voteTrends.slice(0, 8).map((track, i) => (
                    <div key={i} className="px-5 py-3 flex items-center gap-3">
                      <span className={`text-base ${track.hotPct >= 70 ? '' : track.hotPct >= 40 ? '' : ''}`}>
                        {track.hotPct >= 70 ? '🔥' : track.hotPct >= 40 ? '🤷' : '❄️'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{track.trackTitle}</p>
                        <p className="text-[10px] text-gray-500">{track.artist}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${track.hotPct >= 60 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {track.hotPct}%
                        </p>
                        <p className="text-[10px] text-gray-600">{track.totalVotes} votes</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="glass-panel overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h3 className="text-sm font-semibold text-white">📂 Categories</h3>
                <p className="text-xs text-gray-500 mt-0.5">Content by category</p>
              </div>
              <div className="p-5 space-y-2">
                {data.categoryBreakdown.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No data</p>
                ) : (
                  data.categoryBreakdown.slice(0, 10).map((cat, i) => {
                    const max = Math.max(...data.categoryBreakdown.map((c) => c.count), 1);
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 w-24 truncate">{cat.category}</span>
                        <div className="flex-1">
                          <MiniBar value={cat.count} max={max} color={BRAND_COLORS[cat.brand] || '#3B82F6'} />
                        </div>
                        <span className="text-xs font-mono text-gray-500 w-8 text-right">{cat.count}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">🕐 Recent Activity</h3>
            </div>
            <div className="divide-y divide-white/[0.04] max-h-[300px] overflow-y-auto">
              {data.recentActivity.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-500">No recent activity</div>
              ) : (
                data.recentActivity.map((item, i) => (
                  <div key={i} className="px-5 py-2.5 flex items-center gap-3">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: BRAND_COLORS[item.brand] || '#888' }}
                    />
                    <span className="text-xs text-gray-400 flex-1 truncate">{item.title}</span>
                    <span className="text-[10px] text-gray-600 whitespace-nowrap">{item.time}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </>
      ) : (
        <div className="glass-panel p-12 text-center">
          <p className="text-sm text-gray-500">Failed to load analytics data</p>
          <button onClick={fetchAnalytics} className="admin-btn-ghost text-xs mt-2">Retry</button>
        </div>
      )}
    </div>
  );
}
