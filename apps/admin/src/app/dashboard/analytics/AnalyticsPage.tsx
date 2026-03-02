'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseBrowserClient } from '@media-network/shared';
import type { Brand } from '@media-network/shared';
import { StatCard } from '@/components/StatCard';

// ======================== TYPES ========================

type TimePeriod = 'all' | 'this_week' | 'this_month' | 'last_7' | 'last_30' | 'custom';

interface WriterStats {
  id: string;
  name: string;
  role: string;
  avatar_url: string | null;
  brand_affiliations: Brand[];
  totalArticles: number;
  articlesThisWeek: number;
  articlesThisMonth: number;
  totalViews: number;
  avgViewsPerArticle: number;
  approvalRate: number;
  streak: number;
}

interface TopArticle {
  id: string;
  title: string;
  authorName: string;
  brand: Brand;
  date: string;
  views: number;
}

interface SeoScore {
  id: string;
  title: string;
  titleLength: 'good' | 'ok' | 'bad';
  hasMetaDesc: boolean;
  hasImage: boolean;
  wordCount: number;
  wordCountRating: 'good' | 'ok' | 'bad';
}

interface BrandComparisonData {
  brand: Brand;
  name: string;
  color: string;
  articles: number;
  views: number;
  topArticleTitle: string;
}

interface DailyArticleCount {
  date: string;
  count: number;
}

// ======================== CONSTANTS ========================

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

const MEDAL_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];

const PERIOD_LABELS: Record<TimePeriod, string> = {
  all: 'All Time',
  this_week: 'This Week',
  this_month: 'This Month',
  last_7: 'Last 7 Days',
  last_30: 'Last 30 Days',
  custom: 'Custom Range',
};

// ======================== HELPERS ========================

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

// ======================== AVATAR ========================

function Avatar({
  name,
  avatarUrl,
  size = 'md',
}: {
  name: string;
  avatarUrl: string | null;
  size?: 'sm' | 'md';
}) {
  const initials = getInitials(name);
  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
  };

  if (avatarUrl) {
    return (
      <div className={`${sizeClasses[size]} rounded-xl overflow-hidden flex-shrink-0 border border-white/10`}>
        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-white flex-shrink-0`}>
      {initials}
    </div>
  );
}

// ======================== MAIN COMPONENT ========================

// ======================== PERIOD HELPERS ========================

function getPeriodDateRange(period: TimePeriod, customStart?: string, customEnd?: string): { from: Date | null; to: Date } {
  const now = new Date();
  const to = now;

  switch (period) {
    case 'this_week': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      return { from: start, to };
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: start, to };
    }
    case 'last_7': {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return { from: start, to };
    }
    case 'last_30': {
      const start = new Date(now);
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      return { from: start, to };
    }
    case 'custom': {
      const from = customStart ? new Date(customStart) : null;
      const end = customEnd ? new Date(customEnd + 'T23:59:59') : to;
      return { from, to: end };
    }
    default:
      return { from: null, to };
  }
}

// ======================== RESET MODAL ========================

function ResetViewsModal({ onConfirm, onCancel, resetting }: { onConfirm: (deleteRecords: boolean) => void; onCancel: () => void; resetting: boolean }) {
  const [deleteRecords, setDeleteRecords] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="glass-panel p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Reset All View Counts</h3>
            <p className="text-xs text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          This will set <span className="text-white font-medium">all article view counts to 0</span>.
          Are you sure you want to proceed?
        </p>

        <label className="flex items-center gap-2 mb-6 cursor-pointer group">
          <input
            type="checkbox"
            checked={deleteRecords}
            onChange={(e) => setDeleteRecords(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/5 text-red-500 focus:ring-red-500/30"
          />
          <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            Also delete all page view records from <code className="text-xs bg-white/5 px-1 py-0.5 rounded">page_views</code> table
          </span>
        </label>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={resetting}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(deleteRecords)}
            disabled={resetting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {resetting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Resetting…
              </>
            ) : (
              'Reset Views'
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================== MAIN COMPONENT ========================

export function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<WriterStats[]>([]);
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [seoScores, setSeoScores] = useState<SeoScore[]>([]);
  const [brandComparison, setBrandComparison] = useState<BrandComparisonData[]>([]);
  const [dailyArticles, setDailyArticles] = useState<DailyArticleCount[]>([]);
  const [sortMetric, setSortMetric] = useState<'totalArticles' | 'totalViews' | 'articlesThisWeek' | 'articlesThisMonth' | 'avgViewsPerArticle' | 'approvalRate' | 'streak'>('totalArticles');
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [avgPerWeek, setAvgPerWeek] = useState(0);
  const [topWriterName, setTopWriterName] = useState('—');
  const [bestBrand, setBestBrand] = useState('—');

  // Period controls
  const [period, setPeriod] = useState<TimePeriod>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Reset modal
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Live indicator
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    refreshTimerRef.current = setInterval(() => {
      fetchData();
    }, 60_000);
    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, []);

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (resetFeedback) {
      const t = setTimeout(() => setResetFeedback(null), 4000);
      return () => clearTimeout(t);
    }
  }, [resetFeedback]);

  const handleResetViews = useCallback(async (deleteRecords: boolean) => {
    setResetting(true);
    try {
      const supabase = getSupabaseBrowserClient();

      // Reset all article view counts to 0
      const { error: updateError } = await supabase
        .from('articles')
        .update({ view_count: 0 })
        .gte('view_count', 0);

      if (updateError) throw updateError;

      // Optionally delete page_views records
      if (deleteRecords) {
        const { error: deleteError } = await supabase
          .from('page_views')
          .delete()
          .gte('viewed_at', '1970-01-01');

        if (deleteError) throw deleteError;
      }

      setResetFeedback({ type: 'success', message: deleteRecords ? 'All view counts and page view records have been reset.' : 'All article view counts have been reset to 0.' });
      setShowResetModal(false);
      fetchData(); // Refresh data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setResetFeedback({ type: 'error', message: `Reset failed: ${message}` });
    } finally {
      setResetting(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();

      // Fetch all articles
      const { data: allArticles } = await supabase
        .from('articles')
        .select('id, title, brand, status, author_id, view_count, body, excerpt, cover_image, created_at');

      // Fetch all users
      const { data: allUsers } = await supabase
        .from('users')
        .select('id, name, role, avatar_url, brand_affiliations')
        .in('role', ['writer', 'editor', 'admin']);

      if (!allArticles || !allUsers) {
        setLoading(false);
        return;
      }

      // ========== Period Filtering ==========
      const { from: periodFrom } = getPeriodDateRange(period, customStart, customEnd);
      const filteredArticles = periodFrom
        ? allArticles.filter((a) => new Date(a.created_at) >= periodFrom)
        : allArticles;

      // ========== Quick Stats ==========
      const total = filteredArticles.length;
      setTotalArticles(total);

      const views = filteredArticles.reduce((sum, a) => sum + (a.view_count || 0), 0);
      setTotalViews(views);

      // Average articles per week (over last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentArticles = filteredArticles.filter((a) => new Date(a.created_at) >= thirtyDaysAgo);
      setAvgPerWeek(Math.round((recentArticles.length / 30) * 7 * 10) / 10);

      // Time boundaries
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startOfWeek.setHours(0, 0, 0, 0);

      // ========== Leaderboard ==========
      const writerMap: Record<string, WriterStats> = {};
      // Track publish dates per author for streak calculation
      const authorPublishDates: Record<string, Set<string>> = {};

      for (const u of allUsers) {
        writerMap[u.id] = {
          id: u.id,
          name: u.name || 'Unknown',
          role: u.role,
          avatar_url: u.avatar_url,
          brand_affiliations: u.brand_affiliations || [],
          totalArticles: 0,
          articlesThisWeek: 0,
          articlesThisMonth: 0,
          totalViews: 0,
          avgViewsPerArticle: 0,
          approvalRate: 0,
          streak: 0,
        };
        authorPublishDates[u.id] = new Set();
      }

      const authorPublished: Record<string, number> = {};
      const authorTotal: Record<string, number> = {};

      for (const a of filteredArticles) {
        if (a.author_id && writerMap[a.author_id]) {
          const createdDate = new Date(a.created_at);
          writerMap[a.author_id].totalArticles++;
          writerMap[a.author_id].totalViews += a.view_count || 0;
          if (createdDate >= startOfMonth) {
            writerMap[a.author_id].articlesThisMonth++;
          }
          if (createdDate >= startOfWeek) {
            writerMap[a.author_id].articlesThisWeek++;
          }
          authorTotal[a.author_id] = (authorTotal[a.author_id] || 0) + 1;
          if (a.status === 'published') {
            authorPublished[a.author_id] = (authorPublished[a.author_id] || 0) + 1;
            // Track the date for streak
            authorPublishDates[a.author_id]?.add(createdDate.toISOString().split('T')[0]);
          }
        }
      }

      for (const id of Object.keys(writerMap)) {
        const w = writerMap[id];
        w.avgViewsPerArticle = w.totalArticles > 0 ? Math.round(w.totalViews / w.totalArticles) : 0;
        w.approvalRate = authorTotal[id] ? Math.round(((authorPublished[id] || 0) / authorTotal[id]) * 100) : 0;

        // Calculate streak: consecutive days ending today (or yesterday) with a published article
        const dates = authorPublishDates[id];
        if (dates && dates.size > 0) {
          let streak = 0;
          const check = new Date(now);
          // Start from today and go backwards
          for (let d = 0; d < 365; d++) {
            const key = check.toISOString().split('T')[0];
            if (dates.has(key)) {
              streak++;
            } else if (d === 0) {
              // Today has no article — that's ok, check from yesterday
            } else {
              break;
            }
            check.setDate(check.getDate() - 1);
          }
          w.streak = streak;
        }
      }

      const lb = Object.values(writerMap).filter((w) => w.totalArticles > 0);
      setLeaderboard(lb);

      // Top writer this month
      const topWriter = [...lb].sort((a, b) => b.articlesThisMonth - a.articlesThisMonth)[0];
      setTopWriterName(topWriter?.name || '—');

      // ========== Top Articles ==========
      const userMap: Record<string, string> = {};
      for (const u of allUsers) userMap[u.id] = u.name || 'Unknown';

      const topArts = [...filteredArticles]
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 10)
        .map((a) => ({
          id: a.id,
          title: a.title,
          authorName: a.author_id ? userMap[a.author_id] || 'Unknown' : 'AI Generated',
          brand: a.brand as Brand,
          date: new Date(a.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          views: a.view_count || 0,
        }));
      setTopArticles(topArts);

      // ========== SEO Scorecard ==========
      const publishedArticles = filteredArticles.filter((a) => a.status === 'published').slice(0, 10);
      const seo: SeoScore[] = publishedArticles.map((a) => {
        const titleLen = (a.title || '').length;
        const bodyText = a.body || '';
        const wordCount = bodyText.trim().split(/\s+/).length;

        return {
          id: a.id,
          title: a.title,
          titleLength: titleLen >= 50 && titleLen <= 60 ? 'good' : titleLen >= 40 && titleLen <= 70 ? 'ok' : 'bad',
          hasMetaDesc: !!(a.excerpt && a.excerpt.length > 20),
          hasImage: !!a.cover_image,
          wordCount,
          wordCountRating: wordCount >= 300 ? 'good' : wordCount >= 150 ? 'ok' : 'bad',
        };
      });
      setSeoScores(seo);

      // ========== Brand Comparison ==========
      const brands: Brand[] = ['saucewire', 'saucecaviar', 'trapglow', 'trapfrequency'];
      const brandData: BrandComparisonData[] = brands.map((brand) => {
        const brandArticles = filteredArticles.filter((a) => a.brand === brand);
        const brandViews = brandArticles.reduce((sum, a) => sum + (a.view_count || 0), 0);
        const topArticle = [...brandArticles].sort((a, b) => (b.view_count || 0) - (a.view_count || 0))[0];
        return {
          brand,
          name: BRAND_NAMES[brand],
          color: BRAND_COLORS[brand],
          articles: brandArticles.length,
          views: brandViews,
          topArticleTitle: topArticle?.title || 'No articles yet',
        };
      });
      setBrandComparison(brandData);

      // Best brand
      const best = [...brandData].sort((a, b) => b.views - a.views)[0];
      setBestBrand(best?.name || '—');

      // ========== Daily Articles (last 30 days) ==========
      const dailyCounts: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        dailyCounts[key] = 0;
      }
      for (const a of filteredArticles) {
        const key = new Date(a.created_at).toISOString().split('T')[0];
        if (dailyCounts[key] !== undefined) {
          dailyCounts[key]++;
        }
      }
      const daily = Object.entries(dailyCounts).map(([date, count]) => ({ date, count }));
      setDailyArticles(daily);
    } catch (err) {
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, customStart, customEnd]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedLeaderboard = [...leaderboard].sort((a, b) => b[sortMetric] - a[sortMetric]);
  const maxDailyCount = Math.max(...dailyArticles.map((d) => d.count), 1);

  // SEO health percentage
  const seoHealthPct = seoScores.length > 0
    ? Math.round(
        (seoScores.reduce((sum, s) => {
          let score = 0;
          if (s.titleLength === 'good') score += 25;
          else if (s.titleLength === 'ok') score += 15;
          if (s.hasMetaDesc) score += 25;
          if (s.hasImage) score += 25;
          if (s.wordCountRating === 'good') score += 25;
          else if (s.wordCountRating === 'ok') score += 15;
          return sum + score;
        }, 0) /
          seoScores.length)
      )
    : 0;

  const ratingDot = (rating: 'good' | 'ok' | 'bad') => {
    const colors = { good: 'bg-emerald-400', ok: 'bg-amber-400', bad: 'bg-red-400' };
    return <span className={`inline-block w-2 h-2 rounded-full ${colors[rating]}`} />;
  };

  const boolDot = (val: boolean) => (
    <span className={`inline-block w-2 h-2 rounded-full ${val ? 'bg-emerald-400' : 'bg-red-400'}`} />
  );

  return (
    <div className="space-y-6">
      {/* Reset Modal */}
      <AnimatePresence>
        {showResetModal && (
          <ResetViewsModal
            onConfirm={handleResetViews}
            onCancel={() => setShowResetModal(false)}
            resetting={resetting}
          />
        )}
      </AnimatePresence>

      {/* Reset Feedback Toast */}
      <AnimatePresence>
        {resetFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-6 left-1/2 z-50 px-4 py-3 rounded-lg shadow-xl border text-sm font-medium ${
              resetFeedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {resetFeedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Analytics & Leaderboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Performance metrics across all brands — {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Live indicator + Refresh + Reset */}
          <div className="flex items-center gap-3">
            {/* Live indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {lastUpdated
                  ? `Updated ${lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
                  : 'Live'}
              </span>
            </div>

            {/* Refresh button */}
            <button
              onClick={() => fetchData()}
              disabled={loading}
              className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <svg className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
              </svg>
            </button>

            {/* Reset Views button */}
            <button
              onClick={() => setShowResetModal(true)}
              className="px-3 py-2 text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors"
            >
              Reset Views
            </button>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {(Object.keys(PERIOD_LABELS) as TimePeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                period === p
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/[0.03] text-gray-500 border border-white/[0.06] hover:bg-white/[0.06] hover:text-gray-300'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}

          {/* Custom date range pickers */}
          <AnimatePresence>
            {period === 'custom' && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="admin-input text-xs py-1.5 px-2 w-auto"
                />
                <span className="text-xs text-gray-600">to</span>
                <input
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="admin-input text-xs py-1.5 px-2 w-auto"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Articles"
          value={loading ? '—' : totalArticles.toLocaleString()}
          change="all brands"
          changeType="neutral"
          color="#3B82F6"
          index={0}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
        <StatCard
          label="Total Views"
          value={loading ? '—' : formatViews(totalViews)}
          change="lifetime"
          changeType="up"
          color="#10B981"
          index={1}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
        <StatCard
          label="Avg Articles/Week"
          value={loading ? '—' : avgPerWeek}
          change="last 30 days"
          changeType="neutral"
          color="#F59E0B"
          index={2}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <StatCard
          label="Top Writer"
          value={loading ? '—' : topWriterName}
          change="this month"
          changeType="up"
          color="#8B5CF6"
          index={3}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          }
        />
        <StatCard
          label="Best Brand"
          value={loading ? '—' : bestBrand}
          change="by views"
          changeType="up"
          color="#E63946"
          index={4}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
      </div>

      {/* Two-column: Leaderboard + Articles per Day Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Leaderboard */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <h3 className="text-sm font-semibold text-white">Staff Leaderboard</h3>
              </div>
              <select
                value={sortMetric}
                onChange={(e) => setSortMetric(e.target.value as typeof sortMetric)}
                className="admin-input text-xs py-1.5 px-2 w-auto"
              >
                <option value="totalArticles">Total Articles</option>
                <option value="articlesThisWeek">This Week</option>
                <option value="articlesThisMonth">This Month</option>
                <option value="totalViews">Total Views</option>
                <option value="avgViewsPerArticle">Avg Views/Article</option>
                <option value="approvalRate">Approval Rate</option>
                <option value="streak">🔥 Streak</option>
              </select>
            </div>

            {loading ? (
              <div className="divide-y divide-white/[0.04]">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-6 h-6 bg-white/5 rounded animate-pulse" />
                    <div className="w-10 h-10 bg-white/5 rounded-xl animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                      <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedLeaderboard.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-gray-500">No writer data yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {sortedLeaderboard.map((writer, i) => {
                  const medalColor = i < 3 ? MEDAL_COLORS[i] : undefined;
                  return (
                    <motion.div
                      key={writer.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="px-6 py-3.5 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={
                            medalColor
                              ? { backgroundColor: `${medalColor}20`, color: medalColor, border: `1px solid ${medalColor}40` }
                              : { backgroundColor: 'rgba(255,255,255,0.03)', color: '#6B7280' }
                          }
                        >
                          {i + 1}
                        </div>

                        {/* Avatar */}
                        <Avatar name={writer.name} avatarUrl={writer.avatar_url} size="md" />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-white truncate">{writer.name}</h4>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded text-gray-500 bg-white/[0.04] capitalize">
                              {writer.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {writer.brand_affiliations.map((brand) => (
                              <div
                                key={brand}
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: BRAND_COLORS[brand] }}
                                title={BRAND_NAMES[brand]}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="flex items-center gap-5 text-xs font-mono flex-shrink-0">
                          <div className="text-center w-9">
                            <p className="text-white font-semibold">{writer.totalArticles}</p>
                            <p className="text-gray-600">total</p>
                          </div>
                          <div className="text-center w-9">
                            <p className="text-white font-semibold">{writer.articlesThisWeek}</p>
                            <p className="text-gray-600">week</p>
                          </div>
                          <div className="text-center w-9">
                            <p className="text-white font-semibold">{writer.articlesThisMonth}</p>
                            <p className="text-gray-600">month</p>
                          </div>
                          <div className="text-center w-10">
                            <p className="text-white font-semibold">{formatViews(writer.totalViews)}</p>
                            <p className="text-gray-600">views</p>
                          </div>
                          <div className="text-center w-10">
                            <p className="text-white font-semibold">{formatViews(writer.avgViewsPerArticle)}</p>
                            <p className="text-gray-600">avg</p>
                          </div>
                          <div className="text-center w-9">
                            <p className={`font-semibold ${writer.approvalRate >= 80 ? 'text-emerald-400' : writer.approvalRate >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                              {writer.approvalRate}%
                            </p>
                            <p className="text-gray-600">rate</p>
                          </div>
                          <div className="text-center w-9">
                            <p className={`font-semibold ${writer.streak >= 5 ? 'text-orange-400' : writer.streak >= 2 ? 'text-amber-400' : 'text-gray-400'}`}>
                              {writer.streak > 0 ? `${writer.streak}🔥` : '—'}
                            </p>
                            <p className="text-gray-600">streak</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Articles per Day (CSS Chart) */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <h3 className="text-sm font-semibold text-white">Articles per Day</h3>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Last 30 days</p>
          </div>
          <div className="px-6 py-4 space-y-1.5 max-h-[500px] overflow-y-auto">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-12 h-3 bg-white/5 rounded animate-pulse" />
                  <div className="flex-1 h-4 bg-white/5 rounded animate-pulse" />
                </div>
              ))
            ) : (
              dailyArticles.map((day, i) => {
                const widthPct = maxDailyCount > 0 ? (day.count / maxDailyCount) * 100 : 0;
                const dateLabel = new Date(day.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                return (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.015 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-[10px] font-mono text-gray-600 w-12 text-right flex-shrink-0">
                      {dateLabel}
                    </span>
                    <div className="flex-1 h-5 bg-white/[0.03] rounded-md overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPct}%` }}
                        transition={{ delay: i * 0.015 + 0.2, duration: 0.4, ease: 'easeOut' }}
                        className="h-full rounded-md bg-gradient-to-r from-blue-500/60 to-purple-500/60"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-gray-500 w-5 text-right flex-shrink-0">
                      {day.count}
                    </span>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Top Performing Articles */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <span className="text-lg">🔥</span>
          <h3 className="text-sm font-semibold text-white">Top Performing Articles</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Author</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="text-left px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-right px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Views</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-3"><div className="h-4 w-48 bg-white/5 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 bg-white/5 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 bg-white/5 rounded animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-14 bg-white/5 rounded animate-pulse" /></td>
                    <td className="px-6 py-3"><div className="h-4 w-10 bg-white/5 rounded animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : topArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-500">No articles yet</td>
                </tr>
              ) : (
                topArticles.map((article, i) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3">
                      <p className="text-sm text-white truncate max-w-xs">{article.title}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-400">{article.authorName}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS[article.brand] }} />
                        <span className="text-xs text-gray-400 font-mono">{BRAND_NAMES[article.brand]}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500 font-mono">{article.date}</span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span className="text-sm font-mono text-white">{formatViews(article.views)}</span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Brand Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🏷️</span>
          <h3 className="text-sm font-semibold text-white">Brand Comparison</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="glass-panel p-5">
                  <div className="h-5 w-24 bg-white/5 rounded animate-pulse mb-3" />
                  <div className="h-4 w-16 bg-white/5 rounded animate-pulse mb-2" />
                  <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                </div>
              ))
            : brandComparison.map((brand, i) => (
                <motion.div
                  key={brand.brand}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.05 }}
                  className="glass-panel p-5"
                  style={{ borderTopColor: brand.color, borderTopWidth: '2px' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }} />
                    <h4 className="text-sm font-bold text-white">{brand.name}</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Articles</span>
                      <span className="text-xs font-mono text-white">{brand.articles}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Views</span>
                      <span className="text-xs font-mono text-white">{formatViews(brand.views)}</span>
                    </div>
                    <div className="pt-2 border-t border-white/[0.04]">
                      <p className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-1">Top Article</p>
                      <p className="text-xs text-gray-400 truncate">{brand.topArticleTitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </motion.div>

      {/* SEO Scorecard */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔍</span>
            <h3 className="text-sm font-semibold text-white">SEO Scorecard</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-500">Health:</span>
            <span className={`text-sm font-bold ${seoHealthPct >= 70 ? 'text-emerald-400' : seoHealthPct >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
              {loading ? '—' : `${seoHealthPct}%`}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        ) : seoScores.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">No published articles to analyze</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Article</th>
                    <th className="text-center px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Title Len</th>
                    <th className="text-center px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Meta Desc</th>
                    <th className="text-center px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="text-center px-4 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Word Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {seoScores.map((score) => (
                    <tr key={score.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-3">
                        <p className="text-sm text-white truncate max-w-xs">{score.title}</p>
                      </td>
                      <td className="px-4 py-3 text-center">{ratingDot(score.titleLength)}</td>
                      <td className="px-4 py-3 text-center">{boolDot(score.hasMetaDesc)}</td>
                      <td className="px-4 py-3 text-center">{boolDot(score.hasImage)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {ratingDot(score.wordCountRating)}
                          <span className="text-[10px] font-mono text-gray-600">{score.wordCount}w</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SEO Tips */}
            <div className="px-6 py-4 border-t border-white/[0.06]">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">SEO Tips</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 text-xs mt-0.5">●</span>
                  <p className="text-xs text-gray-400">Keep titles between 50-60 characters for optimal search display</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 text-xs mt-0.5">●</span>
                  <p className="text-xs text-gray-400">Always include a meta description (excerpt) of 150-160 characters</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 text-xs mt-0.5">●</span>
                  <p className="text-xs text-gray-400">Articles should be 300+ words for better search engine ranking</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 text-xs mt-0.5">●</span>
                  <p className="text-xs text-gray-400">Every article should have a cover image for social sharing</p>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
