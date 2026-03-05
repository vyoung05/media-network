'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

// ======================== TYPES ========================

interface WikimediaImage {
  url: string;
  thumbUrl: string;
  credit: string;
  license: string;
  title: string;
  width: number;
  height: number;
}

interface PhotoResult {
  url: string;
  thumbUrl: string;
  credit: string;
  source: 'wikipedia' | 'wikimedia' | 'stock' | 'ai';
  title: string;
}

type TabKey = 'all' | 'wikipedia' | 'wikimedia' | 'stock' | 'ai';

interface PhotoSearchProps {
  onSelect: (url: string, credit: string) => void;
  initialQuery?: string;
  compact?: boolean;
}

// ======================== SOURCE BADGE ========================

function SourceBadge({ source }: { source: PhotoResult['source'] }) {
  const config = {
    wikipedia: { label: 'Wikipedia', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    wikimedia: { label: 'Wikimedia', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    stock: { label: 'Unsplash', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    ai: { label: 'AI Generated', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  };

  const { label, color } = config[source];

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 text-[9px] font-medium rounded border ${color}`}>
      {label}
    </span>
  );
}

// ======================== SKELETON LOADER ========================

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.02]">
          <div className="aspect-[4/3] bg-white/[0.04] animate-pulse" />
          <div className="p-2 space-y-1.5">
            <div className="h-3 bg-white/[0.04] rounded animate-pulse w-2/3" />
            <div className="h-2.5 bg-white/[0.04] rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ======================== MAIN COMPONENT ========================

export function PhotoSearch({ onSelect, initialQuery = '', compact = false }: PhotoSearchProps) {
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<PhotoResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-search when initialQuery changes
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = useCallback(async (searchQuery?: string) => {
    const q = (searchQuery || query).trim();
    if (!q) return;

    setLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const res = await fetch('/api/photo-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, type: 'images' }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Search failed');
      }

      const data = await res.json();
      const allResults: PhotoResult[] = [];

      // Wikipedia main image (highest quality, show first)
      if (data.wikipediaImage?.url) {
        allResults.push({
          url: data.wikipediaImage.url,
          thumbUrl: data.wikipediaImage.url,
          credit: `Wikipedia — ${data.wikipediaImage.title} (CC BY-SA)`,
          source: 'wikipedia',
          title: data.wikipediaImage.title,
        });
      }

      // Wikimedia Commons images
      if (data.wikimediaImages?.length) {
        for (const img of data.wikimediaImages as WikimediaImage[]) {
          allResults.push({
            url: img.thumbUrl || img.url,
            thumbUrl: img.thumbUrl || img.url,
            credit: `${img.credit} (${img.license})`,
            source: 'wikimedia',
            title: img.title,
          });
        }
      }

      // Stock images
      if (data.stockImages?.length) {
        for (const img of data.stockImages) {
          allResults.push({
            url: img.url,
            thumbUrl: img.url,
            credit: img.credit,
            source: 'stock',
            title: img.credit,
          });
        }
      }

      // AI Generated images
      if (data.aiImages?.length) {
        for (const img of data.aiImages) {
          allResults.push({
            url: img.url,
            thumbUrl: img.url,
            credit: 'AI Generated — FLUX',
            source: 'ai',
            title: img.prompt || 'AI Generated',
          });
        }
      }

      setResults(allResults);
    } catch (err: any) {
      setError(err.message || 'Failed to search photos');
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch();
    }
  };

  // Filter results by active tab
  const filteredResults = activeTab === 'all'
    ? results
    : results.filter(r => r.source === activeTab);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: results.length },
    { key: 'wikipedia', label: 'Wikipedia', count: results.filter(r => r.source === 'wikipedia').length },
    { key: 'wikimedia', label: 'Wikimedia', count: results.filter(r => r.source === 'wikimedia').length },
    { key: 'stock', label: 'Stock', count: results.filter(r => r.source === 'stock').length },
    { key: 'ai', label: 'AI Generated', count: results.filter(r => r.source === 'ai').length },
  ];

  return (
    <div className={`space-y-3 ${compact ? '' : 'min-h-[300px]'}`}>
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for celebrity, topic, or event..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={() => performSearch()}
          disabled={loading || !query.trim()}
          className="px-4 py-2.5 text-sm font-medium rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          Search
        </button>
      </div>

      {/* Tabs — only show after search */}
      {hasSearched && results.length > 0 && (
        <div className="flex gap-1 overflow-x-auto pb-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.key
                  ? 'bg-cyan-500/15 text-cyan-400 ring-1 ring-cyan-500/30'
                  : 'text-gray-500 hover:text-gray-300 bg-white/[0.03] hover:bg-white/[0.06]'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-[9px] font-mono px-1 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-cyan-500/20' : 'bg-white/[0.06]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-400 flex items-center gap-1.5">
            <span>⚠</span> {error}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && <SkeletonGrid />}

      {/* Results Grid */}
      {!loading && filteredResults.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredResults.map((result, i) => (
            <button
              key={`${result.source}-${i}`}
              type="button"
              onClick={() => onSelect(result.url, result.credit)}
              className="group text-left rounded-lg overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/[0.03] transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] bg-black/30 overflow-hidden">
                <img
                  src={result.thumbUrl}
                  alt={result.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-600 text-2xl">🖼️</div>';
                  }}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 text-xs font-medium rounded-md bg-cyan-500 text-white shadow-lg">
                    Use Photo
                  </span>
                </div>
                {/* Source badge */}
                <div className="absolute top-1.5 left-1.5">
                  <SourceBadge source={result.source} />
                </div>
              </div>

              {/* Info */}
              <div className="p-2">
                <p className="text-[11px] text-gray-300 truncate leading-snug">
                  {result.title}
                </p>
                <p className="text-[9px] text-gray-500 truncate mt-0.5">
                  {result.credit}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && hasSearched && filteredResults.length === 0 && (
        <div className="text-center py-10">
          <span className="text-3xl mb-3 block">🔍</span>
          <p className="text-sm text-gray-400">
            {results.length > 0 ? 'No results in this category' : 'No photos found'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Try different keywords or check the spelling
          </p>
        </div>
      )}

      {/* Initial State */}
      {!loading && !hasSearched && (
        <div className="text-center py-8">
          <span className="text-3xl mb-3 block">📸</span>
          <p className="text-sm text-gray-400">Search for celebrity photos, editorial images, and more</p>
          <p className="text-xs text-gray-600 mt-1">
            Sources: Wikipedia · Wikimedia Commons · Unsplash · AI Generated
          </p>
        </div>
      )}
    </div>
  );
}
