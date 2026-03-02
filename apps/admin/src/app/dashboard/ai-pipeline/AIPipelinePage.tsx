'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseBrowserClient } from '@media-network/shared';
import type { Brand } from '@media-network/shared';

// ======================== ERROR LOG UTILS ========================

interface ErrorLogEntry {
  id: string;
  timestamp: string;
  type: 'manual' | 'batch';
  brand: string;
  sourceTitle: string;
  error: string;
  newsUrl?: string;
}

const ERROR_LOG_KEY = 'ai-pipeline-error-log';
const MAX_LOG_ENTRIES = 200;

function getErrorLog(): ErrorLogEntry[] {
  try {
    const stored = localStorage.getItem(ERROR_LOG_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function addErrorLogEntries(entries: ErrorLogEntry[]) {
  const current = getErrorLog();
  const updated = [...entries, ...current].slice(0, MAX_LOG_ENTRIES);
  localStorage.setItem(ERROR_LOG_KEY, JSON.stringify(updated));
}

function clearErrorLog() {
  localStorage.removeItem(ERROR_LOG_KEY);
}

// ======================== TYPES ========================

interface FeedHealthEntry {
  name: string;
  url: string;
  status: 'active' | 'failed' | 'slow';
  lastFetchedAt: string;
  itemCount: number;
  responseTimeMs: number;
  error?: string;
}

interface AIArticle {
  id: string;
  title: string;
  brand: Brand;
  category: string;
  status: string;
  source_url: string | null;
  created_at: string;
  tags: string[];
  excerpt: string | null;
  cover_image: string | null;
  body: string | null;
}

interface GenerationResult {
  brand: string;
  title: string;
  sourceTitle: string;
  status: 'success' | 'skipped' | 'error';
  articleId?: string;
  reason?: string;
}

interface BatchResult {
  success: boolean;
  results: GenerationResult[];
  summary: { total: number; success: number; skipped: number; errors: number };
}

type AIProvider = 'gemini' | 'openai' | 'anthropic';

interface PipelineSettings {
  articlesPerBrandPerDay: number;
  autoPublish: boolean;
  autoPilot: boolean;
  preferredCategories: Record<Brand, string[]>;
  // BYOK settings
  aiProvider: AIProvider;
  apiKey: string;
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

const ALL_BRANDS: Brand[] = ['saucecaviar', 'trapglow', 'saucewire', 'trapfrequency'];

const DEFAULT_SETTINGS: PipelineSettings = {
  articlesPerBrandPerDay: 3,
  autoPublish: false,
  autoPilot: false,
  preferredCategories: {
    saucecaviar: ['Fashion', 'Music', 'Art', 'Culture', 'Lifestyle'],
    trapglow: ['Hip-Hop', 'R&B', 'Pop', 'Electronic', 'Alternative', 'Latin'],
    saucewire: ['Music', 'Fashion', 'Entertainment', 'Sports', 'Tech'],
    trapfrequency: ['Tutorials', 'Beats', 'Gear', 'DAW Tips', 'Samples', 'Interviews'],
  },
  aiProvider: 'gemini',
  apiKey: '',
};

const AI_PROVIDERS: { id: AIProvider; name: string; description: string; icon: string }[] = [
  { id: 'gemini', name: 'Gemini', description: 'Google Gemini 2.0 Flash — fast & free tier available', icon: '💎' },
  { id: 'openai', name: 'OpenAI', description: 'GPT-4o Mini — great quality, affordable', icon: '🧠' },
  { id: 'anthropic', name: 'Claude', description: 'Claude Sonnet — excellent writing quality', icon: '🤖' },
];

function getStoredBYOK(): { apiKey: string; aiProvider: AIProvider } {
  try {
    const stored = localStorage.getItem('ai-pipeline-settings');
    if (stored) {
      const s = JSON.parse(stored) as PipelineSettings;
      return { apiKey: s.apiKey || '', aiProvider: s.aiProvider || 'gemini' };
    }
  } catch {}
  return { apiKey: '', aiProvider: 'gemini' };
}

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

// ======================== TOAST ========================

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`px-4 py-3 rounded-lg shadow-xl border backdrop-blur-sm flex items-center gap-3 min-w-[300px] ${
              toast.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : toast.type === 'error'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
            }`}
          >
            <span className="text-sm flex-1">{toast.message}</span>
            <button onClick={() => onDismiss(toast.id)} className="text-current opacity-60 hover:opacity-100">
              ✕
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ======================== MANUAL GENERATE SECTION ========================

function ManualGenerate({ onGenerated, onError }: { onGenerated: () => void; onError: (entries: ErrorLogEntry[]) => void }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [brand, setBrand] = useState<Brand>('saucewire');
  const [category, setCategory] = useState('Entertainment');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; articleId?: string } | null>(null);

  const handleGenerate = async () => {
    if (!title.trim()) return;
    setGenerating(true);
    setResult(null);

    try {
      const byok = getStoredBYOK();
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsUrl: url.trim(),
          newsTitle: title.trim(),
          newsSource: source.trim() || 'Manual',
          brand,
          category,
          ...(byok.apiKey ? { apiKey: byok.apiKey, aiProvider: byok.aiProvider } : {}),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult({
          success: true,
          message: `✅ Generated: "${data.article.title}" (${data.article.wordCount} words)`,
          articleId: data.article.id,
        });
        setUrl('');
        setTitle('');
        setSource('');
        onGenerated();
      } else {
        const errMsg = data.error || 'Generation failed';
        setResult({ success: false, message: `❌ ${errMsg}` });
        onError([{
          id: Math.random().toString(36).slice(2),
          timestamp: new Date().toISOString(),
          type: 'manual',
          brand,
          sourceTitle: title.trim(),
          error: errMsg,
          newsUrl: url.trim() || undefined,
        }]);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Network error';
      setResult({ success: false, message: `❌ ${errMsg}` });
      onError([{
        id: Math.random().toString(36).slice(2),
        timestamp: new Date().toISOString(),
        type: 'manual',
        brand,
        sourceTitle: title.trim(),
        error: errMsg,
        newsUrl: url.trim() || undefined,
      }]);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
        <span className="text-lg">✏️</span>
        <h3 className="text-sm font-semibold text-white">Manual Generate</h3>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">News Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the news headline..."
            className="admin-input text-sm w-full"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Source URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="admin-input text-sm w-full"
            />
          </div>
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Source Name</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="TMZ, ESPN, etc."
              className="admin-input text-sm w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value as Brand)}
              className="admin-input text-sm w-full"
            >
              {ALL_BRANDS.map((b) => (
                <option key={b} value={b}>{BRAND_NAMES[b]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="admin-input text-sm w-full"
            >
              {['Music', 'Sports', 'Entertainment', 'Celebrity', 'Fashion', 'Culture', 'Tech'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-lg text-sm ${
              result.success
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            <p>{result.message}</p>
            {result.articleId && (
              <a href="/dashboard/content" className="text-xs underline opacity-80 hover:opacity-100 mt-1 inline-block">
                View in Content Queue →
              </a>
            )}
          </motion.div>
        )}

        <button
          onClick={handleGenerate}
          disabled={generating || !title.trim()}
          className="admin-btn-primary flex items-center gap-2 disabled:opacity-40"
        >
          {generating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <span>🤖</span>
              Generate Article
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ======================== BATCH GENERATE SECTION ========================

function BatchGenerate({ onGenerated, onError }: { onGenerated: () => void; onError: (entries: ErrorLogEntry[]) => void }) {
  const [brand, setBrand] = useState<Brand | 'all'>('all');
  const [count, setCount] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);

  const handleBatchGenerate = async () => {
    setGenerating(true);
    setResult(null);

    try {
      const byok = getStoredBYOK();
      const body: Record<string, unknown> = { count };
      if (brand !== 'all') body.brand = brand;
      if (byok.apiKey) {
        body.apiKey = byok.apiKey;
        body.aiProvider = byok.aiProvider;
      }

      const res = await fetch('/api/auto-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data);
        onGenerated();
        // Log any errors from the batch
        const errorEntries: ErrorLogEntry[] = (data.results || [])
          .filter((r: GenerationResult) => r.status === 'error')
          .map((r: GenerationResult) => ({
            id: Math.random().toString(36).slice(2),
            timestamp: new Date().toISOString(),
            type: 'batch' as const,
            brand: r.brand,
            sourceTitle: r.sourceTitle || '',
            error: r.reason || 'Unknown error',
          }));
        if (errorEntries.length > 0) onError(errorEntries);
      } else {
        const errMsg = data.error || 'Batch generation failed';
        setResult({ success: false, results: [], summary: { total: 0, success: 0, skipped: 0, errors: 1 } });
        onError([{
          id: Math.random().toString(36).slice(2),
          timestamp: new Date().toISOString(),
          type: 'batch',
          brand: brand === 'all' ? 'unknown' : brand,
          sourceTitle: '',
          error: errMsg,
        }]);
      }
    } catch (err) {
      setResult({ success: false, results: [], summary: { total: 0, success: 0, skipped: 0, errors: 1 } });
      onError([{
        id: Math.random().toString(36).slice(2),
        timestamp: new Date().toISOString(),
        type: 'batch',
        brand: brand === 'all' ? 'unknown' : brand,
        sourceTitle: '',
        error: err instanceof Error ? err.message : 'Network error',
      }]);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
        <span className="text-lg">⚡</span>
        <h3 className="text-sm font-semibold text-white">Batch Generate</h3>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-sm text-gray-400">
          Auto-scan the news feed and generate articles for the selected brand. Duplicates are automatically detected and skipped.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Brand</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value as Brand | 'all')}
              className="admin-input text-sm w-full"
            >
              <option value="all">All Brands</option>
              {ALL_BRANDS.map((b) => (
                <option key={b} value={b}>{BRAND_NAMES[b]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Articles per Brand</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="admin-input text-sm w-full"
            >
              {[1, 2, 3, 5, 8, 10].map((n) => (
                <option key={n} value={n}>{n} articles</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleBatchGenerate}
          disabled={generating}
          className="admin-btn-primary flex items-center gap-2 w-full justify-center disabled:opacity-40"
        >
          {generating ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating batch... (this may take a minute)
            </>
          ) : (
            <>
              <span>⚡</span>
              Generate {count} articles {brand !== 'all' ? `for ${BRAND_NAMES[brand as Brand]}` : 'per brand'}
            </>
          )}
        </button>

        {/* Results */}
        {result && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 rounded-lg bg-white/[0.03] text-center">
                <p className="text-lg font-bold text-white">{result.summary.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/5 text-center">
                <p className="text-lg font-bold text-emerald-400">{result.summary.success}</p>
                <p className="text-xs text-gray-500">Generated</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/5 text-center">
                <p className="text-lg font-bold text-amber-400">{result.summary.skipped}</p>
                <p className="text-xs text-gray-500">Skipped</p>
              </div>
              <div className="p-3 rounded-lg bg-red-500/5 text-center">
                <p className="text-lg font-bold text-red-400">{result.summary.errors}</p>
                <p className="text-xs text-gray-500">Errors</p>
              </div>
            </div>

            {result.results.length > 0 && (
              <div className="space-y-1.5 max-h-60 overflow-y-auto">
                {result.results.map((r, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
                      r.status === 'success'
                        ? 'bg-emerald-500/5 text-emerald-400'
                        : r.status === 'skipped'
                        ? 'bg-amber-500/5 text-amber-400'
                        : 'bg-red-500/5 text-red-400'
                    }`}
                  >
                    <span>{r.status === 'success' ? '✅' : r.status === 'skipped' ? '⏭️' : '❌'}</span>
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: BRAND_COLORS[r.brand as Brand] || '#666' }}
                    />
                    <span className="flex-1 truncate">
                      {r.status === 'success' ? r.title : r.sourceTitle || r.reason}
                    </span>
                    {r.reason && r.status !== 'success' && (
                      <span className="text-gray-600 truncate max-w-32">{r.reason}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ======================== SETTINGS SECTION ========================

function PipelineSettingsPanel() {
  const [settings, setSettings] = useState<PipelineSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ai-pipeline-settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {}
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem('ai-pipeline-settings', JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
        <span className="text-lg">⚙️</span>
        <h3 className="text-sm font-semibold text-white">Pipeline Settings</h3>
      </div>
      <div className="p-6 space-y-5">

        {/* ========== BYOK: AI Provider & API Key ========== */}
        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔑</span>
            <p className="text-sm font-semibold text-white">AI API Key (BYOK)</p>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Bring your own API key to generate articles. Your key is stored locally in your browser — never sent to our servers.
          </p>

          {/* Provider selector */}
          <div className="mb-4">
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 block">AI Provider</label>
            <div className="grid grid-cols-3 gap-2">
              {AI_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSettings(s => ({ ...s, aiProvider: p.id }))}
                  className={`p-3 rounded-lg text-left transition-all border ${
                    settings.aiProvider === p.id
                      ? 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20'
                      : 'bg-white/[0.02] border-white/[0.06] hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{p.icon}</span>
                    <span className={`text-xs font-bold ${settings.aiProvider === p.id ? 'text-blue-400' : 'text-gray-300'}`}>
                      {p.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-snug">{p.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key input */}
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">
              {settings.aiProvider === 'gemini' ? 'Gemini' : settings.aiProvider === 'openai' ? 'OpenAI' : 'Anthropic'} API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={(e) => setSettings(s => ({ ...s, apiKey: e.target.value }))}
                placeholder={
                  settings.aiProvider === 'gemini' ? 'AIza...' :
                  settings.aiProvider === 'openai' ? 'sk-...' :
                  'sk-ant-...'
                }
                className="admin-input text-sm w-full pr-20 font-mono"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="text-xs text-gray-500 hover:text-gray-300 px-2 py-1 rounded transition-colors"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
                {settings.apiKey && (
                  <button
                    type="button"
                    onClick={() => setSettings(s => ({ ...s, apiKey: '' }))}
                    className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            {settings.apiKey ? (
              <p className="text-xs text-emerald-400 mt-1.5 flex items-center gap-1">
                <span>✓</span> Key configured — will use your {AI_PROVIDERS.find(p => p.id === settings.aiProvider)?.name} key for generation
              </p>
            ) : (
              <p className="text-xs text-gray-600 mt-1.5">
                No key set — will use the server&apos;s default key (if configured by admin)
              </p>
            )}
          </div>
        </div>

        {/* ========== Auto-Pilot Toggle ========== */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Auto-Pilot Mode</p>
            <p className="text-xs text-gray-500 mt-0.5">Automatically generate and queue articles on schedule</p>
          </div>
          <button
            onClick={() => setSettings(s => ({ ...s, autoPilot: !s.autoPilot }))}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              settings.autoPilot ? 'bg-emerald-500' : 'bg-white/10'
            }`}
          >
            <motion.div
              animate={{ x: settings.autoPilot ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>

        {settings.autoPilot && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20"
          >
            <p className="text-xs text-emerald-400">
              🟢 Auto-Pilot is enabled. Articles will be generated based on your schedule settings.
              Set up a cron job calling <code className="bg-black/20 px-1 rounded">POST /api/auto-generate</code> to activate.
            </p>
          </motion.div>
        )}

        {/* Articles per brand per day */}
        <div>
          <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">
            Articles Per Brand Per Day
          </label>
          <select
            value={settings.articlesPerBrandPerDay}
            onChange={(e) => setSettings(s => ({ ...s, articlesPerBrandPerDay: Number(e.target.value) }))}
            className="admin-input text-sm w-full"
          >
            {[1, 2, 3, 5, 8, 10].map((n) => (
              <option key={n} value={n}>{n} articles</option>
            ))}
          </select>
        </div>

        {/* Auto-publish toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Auto-Publish</p>
            <p className="text-xs text-gray-500 mt-0.5">Publish generated articles immediately instead of drafting</p>
          </div>
          <button
            onClick={() => setSettings(s => ({ ...s, autoPublish: !s.autoPublish }))}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              settings.autoPublish ? 'bg-blue-500' : 'bg-white/10'
            }`}
          >
            <motion.div
              animate={{ x: settings.autoPublish ? 24 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>

        {settings.autoPublish && (
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <p className="text-xs text-amber-400">
              ⚠️ Auto-publish is on. Generated articles will be published without review.
            </p>
          </div>
        )}

        {/* Schedule display */}
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06]">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Generation Schedule</p>
          <div className="space-y-1.5">
            {ALL_BRANDS.map((b) => (
              <div key={b} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS[b] }} />
                <span className="text-xs text-gray-400 w-28">{BRAND_NAMES[b]}</span>
                <span className="text-xs font-mono text-gray-300">
                  {settings.articlesPerBrandPerDay}/day
                </span>
                <span className="text-xs text-gray-600 ml-auto">
                  {settings.preferredCategories[b]?.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="admin-btn-primary text-sm flex items-center gap-2">
            {saved ? '✅ Saved!' : 'Save Settings'}
          </button>
          {settings.apiKey && (
            <span className="text-xs text-gray-500">
              Using: {AI_PROVIDERS.find(p => p.id === settings.aiProvider)?.icon} {AI_PROVIDERS.find(p => p.id === settings.aiProvider)?.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ======================== FEED HEALTH HELPERS ========================

const FEED_HEALTH_KEY = 'ai-pipeline-feed-health';

function getStoredFeedHealth(): FeedHealthEntry[] {
  try {
    const stored = localStorage.getItem(FEED_HEALTH_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

function storeFeedHealth(entries: FeedHealthEntry[]) {
  try {
    localStorage.setItem(FEED_HEALTH_KEY, JSON.stringify(entries));
  } catch {}
}

// ======================== QUALITY SCORE HELPERS ========================

function parseQualityScore(body: string | null): number | null {
  if (!body) return null;
  const metaMatch = body.match(/<!-- AI_META:(.*?) -->/);
  if (!metaMatch) return null;
  try {
    const meta = JSON.parse(metaMatch[1]);
    return typeof meta.quality_score === 'number' ? meta.quality_score : null;
  } catch { return null; }
}

function parseSourceName(body: string | null): string | null {
  if (!body) return null;
  const metaMatch = body.match(/<!-- AI_META:(.*?) -->/);
  if (!metaMatch) return null;
  try {
    const meta = JSON.parse(metaMatch[1]);
    return meta.source_name || null;
  } catch { return null; }
}

function QualityBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  const color = score > 70 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
    : score >= 40 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    : 'text-red-400 bg-red-400/10 border-red-400/20';
  return (
    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${color}`}>
      Q:{score}
    </span>
  );
}

// ======================== FEED HEALTH DASHBOARD ========================

function FeedHealthDashboard() {
  const [feedHealth, setFeedHealth] = useState<FeedHealthEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [testingFeed, setTestingFeed] = useState<string | null>(null);

  useEffect(() => {
    setFeedHealth(getStoredFeedHealth());
  }, []);

  const refreshAllFeeds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news-feed');
      const data = await res.json();
      if (data.feedHealth && Array.isArray(data.feedHealth)) {
        setFeedHealth(data.feedHealth);
        storeFeedHealth(data.feedHealth);
      }
    } catch (err) {
      console.error('Failed to refresh feed health:', err);
    } finally {
      setLoading(false);
    }
  };

  const testSingleFeed = async (feedUrl: string, feedName: string) => {
    setTestingFeed(feedName);
    try {
      const res = await fetch(`/api/rss-feeds?test=${encodeURIComponent(feedUrl)}`);
      const data = await res.json();
      // Update this feed's health in state
      setFeedHealth(prev => {
        const updated = prev.filter(f => f.name !== feedName);
        updated.push({
          name: feedName,
          url: feedUrl,
          status: data.ok ? 'active' : 'failed',
          lastFetchedAt: new Date().toISOString(),
          itemCount: data.itemCount || 0,
          responseTimeMs: 0,
          error: data.error,
        });
        storeFeedHealth(updated);
        return updated;
      });
    } catch (err) {
      console.error(`Failed to test feed ${feedName}:`, err);
    } finally {
      setTestingFeed(null);
    }
  };

  const activeCount = feedHealth.filter(f => f.status === 'active').length;
  const failedCount = feedHealth.filter(f => f.status === 'failed').length;
  const slowCount = feedHealth.filter(f => f.status === 'slow').length;

  const statusIcon = (status: FeedHealthEntry['status']) => {
    switch (status) {
      case 'active': return '✅';
      case 'failed': return '❌';
      case 'slow': return '⚠️';
    }
  };

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 border-b border-white/[0.06] flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📡</span>
          <h3 className="text-sm font-semibold text-white">RSS Feed Health</h3>
          {feedHealth.length > 0 && (
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">{activeCount} ✅</span>
              {failedCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono">{failedCount} ❌</span>}
              {slowCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono">{slowCount} ⚠️</span>}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {!expanded && feedHealth.length > 0 && (
            <span className="text-xs text-gray-500">
              {feedHealth.length} sources tracked
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div>
          <div className="px-6 py-3 border-b border-white/[0.04] flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {feedHealth.length > 0
                ? `Last checked: ${timeAgo(feedHealth[0]?.lastFetchedAt || '')}`
                : 'No health data yet — click refresh to scan all feeds'
              }
            </p>
            <button
              onClick={refreshAllFeeds}
              disabled={loading}
              className="admin-btn-primary text-xs flex items-center gap-1.5 px-3 py-1.5"
            >
              {loading ? (
                <>
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Scanning...
                </>
              ) : (
                <>🔄 Refresh All Feeds</>
              )}
            </button>
          </div>

          {feedHealth.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-3xl mb-2">📡</div>
              <p className="text-sm text-gray-500">No feed health data yet. Click &quot;Refresh All Feeds&quot; to scan.</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-white/[0.03]">
              {feedHealth
                .sort((a, b) => {
                  // Sort failed first, then slow, then active
                  const order: Record<string, number> = { failed: 0, slow: 1, active: 2 };
                  return (order[a.status] || 2) - (order[b.status] || 2);
                })
                .map((feed) => (
                  <div key={feed.name} className="px-6 py-2.5 hover:bg-white/[0.02] transition-colors flex items-center gap-3">
                    <span className="text-sm flex-shrink-0">{statusIcon(feed.status)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{feed.name}</p>
                      <p className="text-[10px] text-gray-600 truncate font-mono">{feed.url}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 font-mono">{feed.itemCount} items</p>
                        <p className="text-[10px] text-gray-600">{feed.responseTimeMs}ms</p>
                      </div>
                      {feed.error && (
                        <span className="text-[10px] text-red-400 max-w-32 truncate" title={feed.error}>
                          {feed.error}
                        </span>
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); testSingleFeed(feed.url, feed.name); }}
                        disabled={testingFeed === feed.name}
                        className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                      >
                        {testingFeed === feed.name ? '...' : 'Test'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ======================== SOCIAL PREVIEW CARDS ========================

function ArticlePreviewCard({
  article,
  onApprove,
  onDelete,
}: {
  article: AIArticle;
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const qualityScore = parseQualityScore(article.body);
  const sourceName = parseSourceName(article.body);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel overflow-hidden group hover:border-white/10 transition-all"
    >
      {/* Cover image */}
      {article.cover_image && (
        <div className="relative h-32 bg-white/[0.03] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          {/* Brand badge overlay */}
          <div className="absolute top-2 left-2">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm"
              style={{
                backgroundColor: `${BRAND_COLORS[article.brand]}20`,
                color: BRAND_COLORS[article.brand],
                border: `1px solid ${BRAND_COLORS[article.brand]}40`,
              }}
            >
              {BRAND_NAMES[article.brand]}
            </span>
          </div>
          {/* Quality score overlay */}
          {qualityScore !== null && (
            <div className="absolute top-2 right-2">
              <QualityBadge score={qualityScore} />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          {!article.cover_image && (
            <div
              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
              style={{ backgroundColor: BRAND_COLORS[article.brand] }}
            />
          )}
          <h4 className="text-sm font-medium text-white leading-snug line-clamp-2 flex-1">
            {article.title}
          </h4>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {!article.cover_image && (
            <span
              className="text-[10px] font-mono"
              style={{ color: BRAND_COLORS[article.brand] }}
            >
              {BRAND_NAMES[article.brand]}
            </span>
          )}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400">
            {article.category}
          </span>
          {!article.cover_image && qualityScore !== null && (
            <QualityBadge score={qualityScore} />
          )}
          {sourceName && (
            <span className="text-[10px] text-gray-500 italic">
              via {sourceName}
            </span>
          )}
          <span className="text-[10px] text-gray-600 ml-auto">
            {timeAgo(article.created_at)}
          </span>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap mb-3">
            {article.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-gray-500">
                #{tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-[10px] text-gray-600">+{article.tags.length - 3}</span>
            )}
          </div>
        )}

        {/* Quick actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {article.status !== 'published' && (
            <button
              onClick={() => onApprove(article.id)}
              className="text-[10px] px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors border border-emerald-500/20"
            >
              ✅ Approve
            </button>
          )}
          <a
            href={`/dashboard/content`}
            className="text-[10px] px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors border border-blue-500/20"
          >
            ✏️ Edit
          </a>
          <button
            onClick={() => onDelete(article.id)}
            className="text-[10px] px-2.5 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors border border-red-500/20 ml-auto"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ======================== RECENT GENERATIONS TABLE ========================

function RecentGenerations({ articles, loading, onRefresh }: { articles: AIArticle[]; loading: boolean; onRefresh: () => void }) {
  const STATUS_STYLES: Record<string, string> = {
    draft: 'text-gray-400 bg-gray-400/10',
    pending_review: 'text-amber-400 bg-amber-400/10',
    published: 'text-emerald-400 bg-emerald-400/10',
    archived: 'text-red-400 bg-red-400/10',
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h3 className="text-sm font-semibold text-white">Recent AI Generations</h3>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
            {articles.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <a
            href="/dashboard/content"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All →
          </a>
        </div>
      </div>

      {loading ? (
        <div className="p-6 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse" />
              <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
              <div className="h-4 w-20 bg-white/5 rounded animate-pulse ml-auto" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="p-8 text-center">
          <div className="text-3xl mb-2">🤖</div>
          <p className="text-sm text-gray-500">No AI-generated articles yet. Use the tools above to get started!</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
              className="px-6 py-3 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: BRAND_COLORS[article.brand] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{article.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-mono" style={{ color: BRAND_COLORS[article.brand] }}>
                      {BRAND_NAMES[article.brand]}
                    </span>
                    <span className="text-[10px] text-gray-600">•</span>
                    <span className="text-[10px] text-gray-500">{article.category}</span>
                    <span className="text-[10px] text-gray-600">•</span>
                    <span className="text-[10px] text-gray-500">by AI (Gemini)</span>
                    {article.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] px-1 py-0.5 rounded bg-white/5 text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${STATUS_STYLES[article.status] || 'text-gray-400 bg-gray-400/10'}`}>
                  {article.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap">
                  {timeAgo(article.created_at)}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// ======================== ERROR BACKLOG ========================

function ErrorBacklog({ refreshKey }: { refreshKey: number }) {
  const [errors, setErrors] = useState<ErrorLogEntry[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | Brand>('all');

  useEffect(() => {
    setErrors(getErrorLog());
  }, [refreshKey]);

  const filtered = filter === 'all' ? errors : errors.filter(e => e.brand === filter);
  const uniqueErrors = new Map<string, number>();
  errors.forEach(e => {
    const key = e.error.slice(0, 80);
    uniqueErrors.set(key, (uniqueErrors.get(key) || 0) + 1);
  });

  if (errors.length === 0) return null;

  return (
    <div className="glass-panel overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 border-b border-white/[0.06] flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🔴</span>
          <h3 className="text-sm font-semibold text-white">Error Backlog</h3>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono">
            {errors.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!expanded && (
            <span className="text-xs text-gray-500">
              {uniqueErrors.size} unique error{uniqueErrors.size !== 1 ? 's' : ''}
            </span>
          )}
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div>
          {/* Summary + filters */}
          <div className="px-6 py-3 border-b border-white/[0.04] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Filter:</span>
              <button
                onClick={() => setFilter('all')}
                className={`text-xs px-2 py-1 rounded transition-colors ${
                  filter === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                All ({errors.length})
              </button>
              {ALL_BRANDS.map((brand) => {
                const count = errors.filter(e => e.brand === brand).length;
                if (count === 0) return null;
                return (
                  <button
                    key={brand}
                    onClick={() => setFilter(brand)}
                    className={`text-xs px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                      filter === brand ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                    }`}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[brand] }} />
                    {BRAND_NAMES[brand]} ({count})
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { clearErrorLog(); setErrors([]); }}
              className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>

          {/* Error summary cards */}
          <div className="px-6 py-3 border-b border-white/[0.04]">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Common Errors</p>
            <div className="space-y-1.5">
              {Array.from(uniqueErrors.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([err, count]) => (
                <div key={err} className="flex items-center gap-2 text-xs">
                  <span className="text-red-400 font-mono font-bold min-w-[24px]">{count}×</span>
                  <span className="text-gray-400 truncate">{err}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full error log */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.03]">
            {filtered.map((entry) => (
              <div key={entry.id} className="px-6 py-2.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BRAND_COLORS[entry.brand as Brand] || '#666' }}
                  />
                  <span className="text-xs font-medium text-gray-300 truncate flex-1">
                    {entry.sourceTitle || '(no title)'}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                    {entry.type}
                  </span>
                  <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap">
                    {new Date(entry.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-red-400/80 font-mono break-all pl-3.5">
                  {entry.error}
                </p>
                {entry.newsUrl && (
                  <a href={entry.newsUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400/60 hover:text-blue-400 pl-3.5 block mt-0.5 truncate">
                    {entry.newsUrl}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ======================== MAIN COMPONENT ========================

export function AIPipelinePage() {
  const [articles, setArticles] = useState<AIArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [errorLogKey, setErrorLogKey] = useState(0);
  const [stats, setStats] = useState({
    totalAI: 0,
    todayAI: 0,
    draftAI: 0,
    publishedAI: 0,
  });

  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const fetchAIArticles = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();

      const { data, error } = await supabase
        .from('articles')
        .select('id, title, brand, category, status, source_url, created_at, tags, excerpt, cover_image, body')
        .eq('is_ai_generated', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      const mapped: AIArticle[] = (data || []).map((a) => ({
        id: a.id,
        title: a.title,
        brand: a.brand as Brand,
        category: a.category,
        status: a.status,
        source_url: a.source_url,
        created_at: a.created_at,
        tags: a.tags || [],
        excerpt: a.excerpt,
        cover_image: a.cover_image || null,
        body: a.body || null,
      }));

      setArticles(mapped);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const { count: totalAI } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('is_ai_generated', true);

      const { count: todayAI } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('is_ai_generated', true)
        .gte('created_at', `${today}T00:00:00`);

      const { count: draftAI } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('is_ai_generated', true)
        .eq('status', 'draft');

      const { count: publishedAI } = await supabase
        .from('articles')
        .select('*', { count: 'exact', head: true })
        .eq('is_ai_generated', true)
        .eq('status', 'published');

      setStats({
        totalAI: totalAI || 0,
        todayAI: todayAI || 0,
        draftAI: draftAI || 0,
        publishedAI: publishedAI || 0,
      });
    } catch (err) {
      console.error('Failed to fetch AI articles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAIArticles();
  }, [fetchAIArticles]);

  const handleGenerated = () => {
    addToast('Article generated successfully!', 'success');
    fetchAIArticles();
  };

  const handleErrors = (entries: ErrorLogEntry[]) => {
    addErrorLogEntries(entries);
    setErrorLogKey(k => k + 1);
  };

  const handleApprove = async (articleId: string) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from('articles')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', articleId);
      if (error) throw error;
      addToast('Article approved and published!', 'success');
      fetchAIArticles();
    } catch (err) {
      addToast(`Failed to approve: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);
      if (error) throw error;
      addToast('Article deleted.', 'info');
      fetchAIArticles();
    } catch (err) {
      addToast(`Failed to delete: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <span>🤖</span> AI Pipeline
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Automated content generation powered by Gemini AI
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total AI Articles', value: stats.totalAI, color: '#3B82F6', icon: '📝' },
          { label: 'Generated Today', value: stats.todayAI, color: '#10B981', icon: '📊' },
          { label: 'AI Drafts', value: stats.draftAI, color: '#F59E0B', icon: '📋' },
          { label: 'AI Published', value: stats.publishedAI, color: '#8B5CF6', icon: '🚀' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-xl">{stat.icon}</span>
            </div>
            {loading ? (
              <div className="h-8 w-12 bg-white/5 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            )}
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ManualGenerate onGenerated={handleGenerated} onError={handleErrors} />
        <BatchGenerate onGenerated={handleGenerated} onError={handleErrors} />
      </div>

      {/* Error Backlog */}
      <ErrorBacklog refreshKey={errorLogKey} />

      {/* Feed Health Dashboard */}
      <FeedHealthDashboard />

      {/* Settings */}
      <PipelineSettingsPanel />

      {/* Social Preview Cards — Recently Generated */}
      {articles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🃏</span>
              <h3 className="text-sm font-semibold text-white">Social Preview Cards</h3>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-mono">
                {articles.length}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.slice(0, 9).map(article => (
              <ArticlePreviewCard
                key={article.id}
                article={article}
                onApprove={handleApprove}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent generations table */}
      <RecentGenerations articles={articles} loading={loading} onRefresh={fetchAIArticles} />

      {/* Toast container */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />
    </div>
  );
}
