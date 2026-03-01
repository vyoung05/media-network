'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RssFeed {
  id: string;
  brand: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
  last_fetched_at: string | null;
  fetch_error: string | null;
  created_at: string;
  updated_at: string;
}

interface TestResult {
  feedId: string;
  articles: { title: string; url: string; description: string }[];
  error?: string;
}

const BRAND_CONFIG: Record<string, { name: string; color: string; icon: string }> = {
  saucewire: { name: 'SauceWire', color: '#E63946', icon: '⚡' },
  trapglow: { name: 'TrapGlow', color: '#8B5CF6', icon: '✨' },
  trapfrequency: { name: 'TrapFrequency', color: '#39FF14', icon: '🎛️' },
};

const BRAND_OPTIONS = [
  { value: 'saucewire', label: 'SauceWire' },
  { value: 'trapglow', label: 'TrapGlow' },
  { value: 'trapfrequency', label: 'TrapFrequency' },
];

export default function RssFeedsPage() {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [testingFeed, setTestingFeed] = useState<string | null>(null);
  const [togglingFeed, setTogglingFeed] = useState<string | null>(null);
  const [deletingFeed, setDeletingFeed] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Add feed form state
  const [newFeed, setNewFeed] = useState({
    brand: 'saucewire',
    name: '',
    url: '',
    category: '',
  });

  const fetchFeeds = useCallback(async () => {
    try {
      const res = await fetch('/api/rss-feeds');
      if (res.ok) {
        const data = await res.json();
        setFeeds(data.feeds || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeeds(); }, [fetchFeeds]);

  const addFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeed.name || !newFeed.url) return;

    setSaving(true);
    try {
      const res = await fetch('/api/rss-feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeed),
      });

      if (res.ok) {
        setNewFeed({ brand: 'saucewire', name: '', url: '', category: '' });
        setShowAddForm(false);
        fetchFeeds();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to add feed');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleFeed = async (feed: RssFeed) => {
    setTogglingFeed(feed.id);
    try {
      const res = await fetch(`/api/rss-feeds/${feed.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !feed.enabled }),
      });

      if (res.ok) {
        setFeeds(prev =>
          prev.map(f => f.id === feed.id ? { ...f, enabled: !f.enabled } : f)
        );
      }
    } catch {} finally {
      setTogglingFeed(null);
    }
  };

  const deleteFeed = async (feed: RssFeed) => {
    if (!confirm(`Delete "${feed.name}"? This cannot be undone.`)) return;

    setDeletingFeed(feed.id);
    try {
      const res = await fetch(`/api/rss-feeds/${feed.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setFeeds(prev => prev.filter(f => f.id !== feed.id));
      }
    } catch {} finally {
      setDeletingFeed(null);
    }
  };

  const testFeed = async (feed: RssFeed) => {
    setTestingFeed(feed.id);
    setTestResults(prev => {
      const next = { ...prev };
      delete next[feed.id];
      return next;
    });

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(feed.url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/rss+xml, application/xml, text/xml, application/atom+xml',
        },
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const xml = await res.text();
      const articles: { title: string; url: string; description: string }[] = [];

      // Simple XML parsing (same as backend)
      const itemRegex = /<item[\s>]([\s\S]*?)<\/item>/gi;
      const entryRegex = /<entry[\s>]([\s\S]*?)<\/entry>/gi;
      const allMatches: string[] = [];
      let match: RegExpExecArray | null;

      while ((match = itemRegex.exec(xml)) !== null) allMatches.push(match[1]);
      while ((match = entryRegex.exec(xml)) !== null) allMatches.push(match[1]);

      for (const itemXml of allMatches.slice(0, 5)) {
        const titleMatch = itemXml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = titleMatch
          ? titleMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim()
          : '';

        let url = '';
        const linkHrefMatch = itemXml.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i);
        const linkTextMatch = itemXml.match(/<link[^>]*>([\s\S]*?)<\/link>/i);
        if (linkHrefMatch) url = linkHrefMatch[1].trim();
        else if (linkTextMatch) url = linkTextMatch[1].replace(/<[^>]+>/g, '').trim();

        const descMatch =
          itemXml.match(/<description[^>]*>([\s\S]*?)<\/description>/i) ||
          itemXml.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
        const description = descMatch
          ? descMatch[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').trim().substring(0, 200)
          : '';

        if (title) articles.push({ title, url, description });
      }

      setTestResults(prev => ({ ...prev, [feed.id]: { feedId: feed.id, articles } }));
    } catch (err: any) {
      const errorMsg = err.name === 'AbortError' ? 'Timeout (8s)' : err.message;
      setTestResults(prev => ({
        ...prev,
        [feed.id]: { feedId: feed.id, articles: [], error: errorMsg },
      }));
    } finally {
      setTestingFeed(null);
    }
  };

  // Group feeds by brand
  const feedsByBrand = feeds.reduce<Record<string, RssFeed[]>>((acc, feed) => {
    if (!acc[feed.brand]) acc[feed.brand] = [];
    acc[feed.brand].push(feed);
    return acc;
  }, {});

  const enabledCount = feeds.filter(f => f.enabled).length;
  const errorCount = feeds.filter(f => f.fetch_error).length;

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
            📡 RSS Feeds
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage RSS feed sources for the AI Content Pipeline
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className="admin-btn-primary flex items-center gap-2"
        >
          {showAddForm ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Feed
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'Total Feeds', value: feeds.length, color: 'text-white' },
          { label: 'Enabled', value: enabledCount, color: 'text-green-400' },
          { label: 'Disabled', value: feeds.length - enabledCount, color: 'text-gray-400' },
          { label: 'Errors', value: errorCount, color: errorCount > 0 ? 'text-red-400' : 'text-gray-400' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel px-4 py-3">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-xl font-mono font-bold mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Add Feed Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={addFeed} className="glass-panel p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Add New RSS Feed</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Brand *</label>
                  <select
                    value={newFeed.brand}
                    onChange={e => setNewFeed({ ...newFeed, brand: e.target.value })}
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                  >
                    {BRAND_OPTIONS.map(b => (
                      <option key={b.value} value={b.value} className="bg-gray-900">{b.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Feed Name *</label>
                  <input
                    type="text"
                    value={newFeed.name}
                    onChange={e => setNewFeed({ ...newFeed, name: e.target.value })}
                    placeholder="e.g. TMZ Music"
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-400 mb-1">Feed URL *</label>
                  <input
                    type="url"
                    value={newFeed.url}
                    onChange={e => setNewFeed({ ...newFeed, url: e.target.value })}
                    placeholder="https://example.com/rss/feed.xml"
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Category</label>
                  <input
                    type="text"
                    value={newFeed.category}
                    onChange={e => setNewFeed({ ...newFeed, category: e.target.value })}
                    placeholder="e.g. Music, Entertainment, Tech"
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={saving || !newFeed.name || !newFeed.url}
                    className="admin-btn-primary w-full py-2.5 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Feed
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feeds by Brand */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : feeds.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-12 text-center"
        >
          <span className="text-4xl mb-3 block">📡</span>
          <p className="text-gray-400">No RSS feeds configured yet.</p>
          <p className="text-sm text-gray-600 mt-1">Click &ldquo;Add Feed&rdquo; to get started.</p>
        </motion.div>
      ) : (
        Object.entries(BRAND_CONFIG).map(([brand, config]) => {
          const brandFeeds = feedsByBrand[brand] || [];
          if (brandFeeds.length === 0) return null;

          return (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel overflow-hidden"
            >
              {/* Brand Header */}
              <div
                className="px-5 py-3 border-b border-white/[0.06] flex items-center gap-3"
                style={{ borderBottomColor: `${config.color}20` }}
              >
                <span className="text-lg">{config.icon}</span>
                <h2 className="text-sm font-semibold text-white">{config.name}</h2>
                <span className="text-xs text-gray-500 ml-auto">
                  {brandFeeds.filter(f => f.enabled).length}/{brandFeeds.length} enabled
                </span>
              </div>

              {/* Feed List */}
              <div className="divide-y divide-white/[0.04]">
                {brandFeeds.map((feed) => (
                  <div key={feed.id}>
                    <div className="px-5 py-3">
                      <div className="flex items-start gap-3">
                        {/* Enable/Disable Toggle */}
                        <button
                          onClick={() => toggleFeed(feed)}
                          disabled={togglingFeed === feed.id}
                          className={`mt-1 relative w-9 h-5 rounded-full transition-all flex-shrink-0 ${
                            feed.enabled ? 'bg-cyan-500/30' : 'bg-white/[0.08]'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                              feed.enabled
                                ? 'left-[18px] bg-cyan-400'
                                : 'left-0.5 bg-gray-500'
                            }`}
                          />
                        </button>

                        {/* Feed Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={`text-sm font-medium ${feed.enabled ? 'text-white' : 'text-gray-500'}`}>
                              {feed.name}
                            </h3>
                            {feed.category && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400">
                                {feed.category}
                              </span>
                            )}
                            {feed.fetch_error && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                                ⚠ Error
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-600 truncate mt-0.5">{feed.url}</p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            {feed.last_fetched_at && (
                              <span className="text-[10px] text-gray-500">
                                Last fetched: {new Date(feed.last_fetched_at).toLocaleString('en-US', {
                                  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
                                })}
                              </span>
                            )}
                            {feed.fetch_error && (
                              <span className="text-[10px] text-red-400/70 truncate max-w-[200px]" title={feed.fetch_error}>
                                {feed.fetch_error}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => testFeed(feed)}
                            disabled={testingFeed === feed.id}
                            className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all disabled:opacity-50"
                            title="Test this feed"
                          >
                            {testingFeed === feed.id ? (
                              <div className="w-3 h-3 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              '🧪 Test'
                            )}
                          </button>
                          <button
                            onClick={() => deleteFeed(feed)}
                            disabled={deletingFeed === feed.id}
                            className="px-2 py-1.5 rounded-lg text-[11px] text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                            title="Delete feed"
                          >
                            {deletingFeed === feed.id ? (
                              <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Test Results */}
                    <AnimatePresence>
                      {testResults[feed.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-3 ml-12">
                            {testResults[feed.id].error ? (
                              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                                <p className="text-xs text-red-400">❌ {testResults[feed.id].error}</p>
                              </div>
                            ) : testResults[feed.id].articles.length === 0 ? (
                              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                                <p className="text-xs text-yellow-400">⚠ Feed returned no articles</p>
                              </div>
                            ) : (
                              <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg overflow-hidden">
                                <div className="px-3 py-1.5 border-b border-white/[0.06]">
                                  <p className="text-[10px] text-green-400 font-medium">
                                    ✅ {testResults[feed.id].articles.length} articles found
                                  </p>
                                </div>
                                <div className="divide-y divide-white/[0.04]">
                                  {testResults[feed.id].articles.map((article, j) => (
                                    <div key={j} className="px-3 py-2">
                                      <p className="text-xs text-gray-300 font-medium">{article.title}</p>
                                      {article.description && (
                                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{article.description}</p>
                                      )}
                                      {article.url && (
                                        <a
                                          href={article.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[10px] text-cyan-500/60 hover:text-cyan-400 truncate block mt-0.5"
                                        >
                                          {article.url}
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })
      )}

      {/* Info Panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-3">💡 Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
          <div>
            <p className="text-white font-medium mb-1">Finding RSS Feeds</p>
            <p>Most news sites have RSS feeds. Try appending <code className="text-cyan-400 bg-white/[0.06] px-1 py-0.5 rounded">/rss</code> or <code className="text-cyan-400 bg-white/[0.06] px-1 py-0.5 rounded">/feed</code> to the site URL.</p>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Source Mode</p>
            <p>In the AI Pipeline, set source to &ldquo;RSS + Search&rdquo; to use RSS as primary with Brave Search filling gaps when fewer than 3 articles are found.</p>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Testing Feeds</p>
            <p>Use the &ldquo;Test&rdquo; button to verify a feed works before relying on it. Broken feeds are automatically skipped during pipeline runs.</p>
          </div>
          <div>
            <p className="text-white font-medium mb-1">Error Handling</p>
            <p>Feeds that fail show an error badge. The pipeline continues with other working feeds — one broken feed won&apos;t stop everything.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
