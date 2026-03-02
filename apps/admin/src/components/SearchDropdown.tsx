'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@media-network/shared';
import type { Brand } from '@media-network/shared';

// ======================== TYPES ========================

interface SearchResult {
  id: string;
  type: 'article' | 'submission' | 'user';
  title: string;
  subtitle: string;
  href: string;
  brand?: Brand;
}

// ======================== CONSTANTS ========================

const BRAND_COLORS: Record<Brand, string> = {
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  saucewire: '#E63946',
  trapfrequency: '#39FF14',
};

const TYPE_ICONS: Record<SearchResult['type'], { icon: React.ReactNode; label: string }> = {
  article: {
    label: 'Articles',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  submission: {
    label: 'Submissions',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  },
  user: {
    label: 'Users',
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
};

// ======================== COMPONENT ========================

export function SearchDropdown() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const items: SearchResult[] = [];

      // Search articles
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, brand, status')
        .ilike('title', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (articles) {
        for (const a of articles) {
          items.push({
            id: `article-${a.id}`,
            type: 'article',
            title: a.title,
            subtitle: `${a.status.replace('_', ' ')} · ${(a.brand as string).replace(/([a-z])([A-Z])/g, '$1 $2')}`,
            href: '/dashboard/content',
            brand: a.brand as Brand,
          });
        }
      }

      // Search submissions
      const { data: submissions } = await supabase
        .from('submissions')
        .select('id, title, brand, status')
        .ilike('title', `%${searchQuery}%`)
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (submissions) {
        for (const s of submissions) {
          items.push({
            id: `submission-${s.id}`,
            type: 'submission',
            title: s.title,
            subtitle: `${s.status} submission`,
            href: '/dashboard/submissions',
            brand: s.brand as Brand,
          });
        }
      }

      // Search users by name
      const { data: users } = await supabase
        .from('users')
        .select('id, name, role, email')
        .ilike('name', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (users) {
        for (const u of users) {
          items.push({
            id: `user-${u.id}`,
            type: 'user',
            title: u.name || 'Unknown',
            subtitle: `${u.role} · ${u.email}`,
            href: '/dashboard/writers',
          });
        }
      }

      setResults(items);
      setIsOpen(items.length > 0);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Debounce 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleResultClick = (result: SearchResult) => {
    router.push(result.href);
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search articles, submissions..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="admin-input pl-10 w-80 text-sm"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-4 h-4 animate-spin text-gray-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {/* Results dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute left-0 top-full mt-2 w-full glass-panel-solid shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            <div className="max-h-80 overflow-y-auto">
              {(Object.keys(grouped) as SearchResult['type'][]).map((type) => {
                const typeInfo = TYPE_ICONS[type];
                return (
                  <div key={type}>
                    <div className="px-4 py-2 flex items-center gap-2 border-b border-white/[0.04]">
                      <span className="text-gray-500">{typeInfo.icon}</span>
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                        {typeInfo.label}
                      </span>
                      <span className="text-[10px] font-mono text-gray-600 ml-auto">
                        {grouped[type].length}
                      </span>
                    </div>
                    <div className="divide-y divide-white/[0.03]">
                      {grouped[type].map((result, i) => (
                        <motion.button
                          key={result.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => handleResultClick(result)}
                          className="w-full text-left px-4 py-2.5 hover:bg-white/[0.03] transition-colors flex items-center gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{result.title}</p>
                            <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                          </div>
                          {result.brand && (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: BRAND_COLORS[result.brand] }}
                            />
                          )}
                          <svg className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-white/[0.06]">
              <p className="text-[10px] font-mono text-gray-600 text-center">
                {results.length} result{results.length !== 1 ? 's' : ''} · Press Esc to close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No results state */}
      <AnimatePresence>
        {isOpen && query.trim() && results.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute left-0 top-full mt-2 w-full glass-panel-solid shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-400">No results for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
