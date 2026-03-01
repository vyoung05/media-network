'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND_CONFIG: Record<string, { name: string; color: string; icon: string; description: string }> = {
  saucewire: {
    name: 'SauceWire',
    color: '#E63946',
    icon: '⚡',
    description: 'Breaking music, entertainment, fashion, sports & tech news',
  },
  trapglow: {
    name: 'TrapGlow',
    color: '#8B5CF6',
    icon: '✨',
    description: 'New artist discoveries, music releases, streaming updates',
  },
  trapfrequency: {
    name: 'TrapFrequency',
    color: '#39FF14',
    icon: '🎛️',
    description: 'Production gear, DAW updates, tutorials, sample packs',
  },
};

type AIEngine = 'openai' | 'gemini';
type SourceMode = 'both' | 'rss_only' | 'brave_only';

interface PipelineStatus {
  enabled: boolean;
  hasOpenAI: boolean;
  hasGemini: boolean;
  hasBraveSearch: boolean;
  hasRssFeeds: boolean;
  rssFeedCount: number;
  activeEngine: string;
  brands: Record<string, {
    totalGenerated: number;
    recent: { id: string; title: string; status: string; created_at: string; metadata?: any }[];
  }>;
}

interface RunResult {
  brand: string;
  status: string;
  article?: { id: string; title: string; slug: string };
  source?: string;
  error?: string;
  query?: string;
  engine?: string;
  via?: string;
  sourceMode?: string;
}

const SOURCE_OPTIONS: { value: SourceMode; label: string; icon: string; description: string }[] = [
  { value: 'both', label: 'RSS + Search', icon: '📡', description: 'RSS feeds first, Brave Search fallback' },
  { value: 'rss_only', label: 'RSS Only', icon: '📰', description: 'Only use RSS feeds' },
  { value: 'brave_only', label: 'Search Only', icon: '🔍', description: 'Only use Brave Search' },
];

export default function AIPipelinePage() {
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [runningBrand, setRunningBrand] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<RunResult[] | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<AIEngine>('gemini');
  const [selectedSource, setSelectedSource] = useState<SourceMode>('both');

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/ai-pipeline');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
        // Sync engine selector with server default
        if (data.activeEngine === 'openai' || data.activeEngine === 'gemini') {
          setSelectedEngine(data.activeEngine);
        }
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const runPipeline = async (brand?: string) => {
    setRunning(true);
    setRunningBrand(brand || 'all');
    setLastRun(null);
    try {
      const res = await fetch('/api/ai-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(brand ? { brand } : {}),
          engine: selectedEngine,
          source: selectedSource === 'both' ? 'both' : selectedSource === 'rss_only' ? 'rss' : 'brave',
        }),
      });
      const data = await res.json();
      setLastRun(data.results || []);
      fetchStatus(); // refresh stats
    } catch (err: any) {
      setLastRun([{ brand: brand || 'all', status: 'error', error: err.message }]);
    } finally {
      setRunning(false);
      setRunningBrand(null);
    }
  };

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
            🤖 AI Content Pipeline
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Auto-generate articles from RSS feeds & trending news for each brand
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => runPipeline()}
          disabled={running}
          className="admin-btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {running && !runningBrand ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate All Brands
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Engine Toggle + Source Toggle + API Status */}
      {status && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel overflow-hidden"
        >
          {/* Engine Selector */}
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">AI Engine</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">Choose which AI writes your articles</p>
              </div>
              <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1">
                <button
                  onClick={() => setSelectedEngine('gemini')}
                  disabled={!status.hasGemini}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedEngine === 'gemini'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.04]'
                  } ${!status.hasGemini ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">✨</span> Gemini
                    {selectedEngine === 'gemini' && <span className="text-[9px] bg-blue-500/30 px-1.5 py-0.5 rounded-full">Active</span>}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedEngine('openai')}
                  disabled={!status.hasOpenAI}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedEngine === 'openai'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.04]'
                  } ${!status.hasOpenAI ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">🧠</span> OpenAI
                    {selectedEngine === 'openai' && <span className="text-[9px] bg-green-500/30 px-1.5 py-0.5 rounded-full">Active</span>}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Source Mode Selector */}
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Content Source</h3>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Where to find news articles
                  {status.hasRssFeeds && (
                    <span className="text-cyan-400 ml-1">• {status.rssFeedCount} RSS feeds active</span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-white/[0.04] rounded-xl p-1">
                {SOURCE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedSource(option.value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedSource === option.value
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-400 hover:text-gray-300 hover:bg-white/[0.04]'
                    }`}
                    title={option.description}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="text-sm">{option.icon}</span>
                      <span className="hidden sm:inline">{option.label}</span>
                      {selectedSource === option.value && (
                        <span className="hidden sm:inline text-[9px] bg-cyan-500/30 px-1.5 py-0.5 rounded-full">Active</span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* API Keys Status */}
          <div className="px-5 py-3 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.hasGemini ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400">Gemini API {status.hasGemini ? '✓' : '✗ Not set'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.hasOpenAI ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400">OpenAI API {status.hasOpenAI ? '✓' : '✗ Not set'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.hasBraveSearch ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-400">Brave Search {status.hasBraveSearch ? '✓' : '✗ Not set'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${status.hasRssFeeds ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className="text-xs text-gray-400">
                RSS Feeds {status.hasRssFeeds ? `✓ ${status.rssFeedCount} active` : '⚠ None configured'}
              </span>
            </div>
            {!status.enabled && (
              <p className="text-xs text-amber-400 ml-auto">
                ⚠️ Set at least one AI key + a content source (RSS feeds or Brave Search)
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Brand Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(BRAND_CONFIG).map(([brand, config], i) => {
          const brandStats = status?.brands?.[brand];
          const isRunningThis = running && (runningBrand === brand || runningBrand === 'all');

          return (
            <motion.div
              key={brand}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-panel overflow-hidden"
            >
              {/* Header */}
              <div
                className="px-5 py-4 border-b border-white/[0.06]"
                style={{ borderBottomColor: `${config.color}20` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{config.icon}</span>
                    <h3 className="text-sm font-semibold text-white">{config.name}</h3>
                  </div>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{config.description}</p>
              </div>

              {/* Stats */}
              <div className="px-5 py-3 border-b border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Articles generated</span>
                  <span className="text-sm font-mono text-white">{brandStats?.totalGenerated || 0}</span>
                </div>
              </div>

              {/* Recent articles */}
              <div className="px-5 py-3 max-h-[200px] overflow-y-auto">
                {brandStats?.recent && brandStats.recent.length > 0 ? (
                  <div className="space-y-2">
                    {brandStats.recent.map((article) => (
                      <div key={article.id} className="flex items-start gap-2">
                        <span className={`text-[10px] mt-0.5 ${article.status === 'published' ? 'text-green-400' : 'text-gray-500'}`}>
                          {article.status === 'published' ? '🟢' : '⏳'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-300 truncate">{article.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <p className="text-[10px] text-gray-600">
                              {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </p>
                            {article.metadata?.source_via && (
                              <span className="text-[9px] text-cyan-500/60 bg-cyan-500/10 px-1.5 py-0.5 rounded-full">
                                via {article.metadata.source_via}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-600 text-center py-3">No articles generated yet</p>
                )}
              </div>

              {/* Generate button */}
              <div className="px-5 py-3 border-t border-white/[0.04]">
                <button
                  onClick={() => runPipeline(brand)}
                  disabled={running}
                  className="w-full py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 hover:brightness-110 active:brightness-90 touch-manipulation"
                  style={{
                    backgroundColor: `${config.color}15`,
                    color: config.color,
                    border: `1px solid ${config.color}30`,
                  }}
                >
                  {isRunningThis ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: config.color, borderTopColor: 'transparent' }} />
                      Generating...
                    </span>
                  ) : (
                    `⚡ Generate ${config.name} Article`
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Last Run Results */}
      <AnimatePresence>
        {lastRun && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-panel overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">📋 Last Run Results</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {lastRun.map((result, i) => {
                const config = BRAND_CONFIG[result.brand];
                return (
                  <div key={i} className="px-5 py-3 flex items-center gap-3">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: config?.color || '#888' }}
                    />
                    <span className="text-xs font-medium text-gray-300 w-28">{config?.name || result.brand}</span>
                    <span className={`text-xs flex-1 ${
                      result.status === 'created' ? 'text-green-400' :
                      result.status === 'no_results' ? 'text-yellow-400' :
                      result.status === 'all_duplicates' ? 'text-blue-400' :
                      'text-red-400'
                    }`}>
                      {result.status === 'created' && (
                        <span>
                          ✅ Created: &ldquo;{result.article?.title}&rdquo;
                          {result.engine && (
                            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                              result.engine === 'gemini' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                            }`}>
                              via {result.engine === 'gemini' ? '✨ Gemini' : '🧠 OpenAI'}
                            </span>
                          )}
                          {result.via && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                              📡 {result.via}
                            </span>
                          )}
                        </span>
                      )}
                      {result.status === 'no_results' && `⚠️ No results found (${result.sourceMode || 'unknown'} mode)`}
                      {result.status === 'all_duplicates' && '🔄 All results already in database'}
                      {result.status === 'rewrite_failed' && (
                        <span>
                          ❌ Failed to rewrite: &ldquo;{result.source}&rdquo;
                          {result.via && <span className="text-gray-500 ml-1">({result.via})</span>}
                        </span>
                      )}
                      {result.status === 'insert_failed' && `❌ DB error: ${result.error}`}
                      {result.status === 'error' && `❌ ${result.error}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-3">How it works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '1', icon: '📡', title: 'Source', desc: 'RSS feeds fetch latest news; Brave Search fills gaps' },
            { step: '2', icon: '🤖', title: 'Rewrite', desc: 'Gemini or OpenAI rewrites in each brand\'s voice — you choose' },
            { step: '3', icon: '📋', title: 'Queue', desc: 'Articles queued as drafts for admin review' },
            { step: '4', icon: '🚀', title: 'Publish', desc: 'Admin approves & publishes — or enable auto-publish' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-xs font-medium text-white mt-2">{item.title}</p>
              <p className="text-[10px] text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
