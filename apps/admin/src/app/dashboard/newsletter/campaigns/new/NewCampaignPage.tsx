'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBrand } from '@/contexts/BrandContext';
import type { Brand, Article } from '@media-network/shared';

const BRAND_COLORS: Record<string, string> = {
  saucewire: '#E63946',
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  trapfrequency: '#39FF14',
};

const BRAND_NAMES: Record<string, string> = {
  saucewire: 'SauceWire',
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  trapfrequency: 'TrapFrequency',
};

export function NewCampaignPage() {
  const router = useRouter();
  const { activeBrand } = useBrand();

  const [brand, setBrand] = useState<string>(activeBrand === 'all' ? 'saucewire' : activeBrand);
  const [subject, setSubject] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    async function fetchArticles() {
      setLoadingArticles(true);
      try {
        const res = await fetch(`/api/articles?brand=${brand}&status=published&per_page=20`);
        const data = await res.json();
        setArticles(data.data || []);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setLoadingArticles(false);
      }
    }
    fetchArticles();
  }, [brand]);

  const toggleArticle = (id: string) => {
    setSelectedArticleIds(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const autoGenerateSubject = () => {
    const selected = articles.filter(a => selectedArticleIds.includes(a.id));
    if (selected.length === 1) {
      setSubject(`New: ${selected[0].title}`);
    } else if (selected.length > 1) {
      setSubject(`${BRAND_NAMES[brand]} Weekly Digest — ${selected.length} stories`);
    }
  };

  const handleSave = async (andSend: boolean) => {
    if (!subject || selectedArticleIds.length === 0) {
      setError('Subject and at least one article are required');
      return;
    }

    setError('');
    andSend ? setSending(true) : setSaving(true);

    try {
      // Create campaign
      const res = await fetch('/api/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand,
          subject,
          article_ids: selectedArticleIds,
          status: 'draft',
        }),
      });

      if (!res.ok) throw new Error('Failed to create campaign');
      const campaign = await res.json();

      if (andSend) {
        // Send immediately
        const sendRes = await fetch(`/api/newsletter/campaigns/${campaign.id}/send`, {
          method: 'POST',
        });
        if (!sendRes.ok) {
          const sendErr = await sendRes.json();
          throw new Error(sendErr.error || 'Failed to send campaign');
        }
      }

      router.push('/dashboard/newsletter');
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSaving(false);
      setSending(false);
    }
  };

  const selectedArticles = articles.filter(a => selectedArticleIds.includes(a.id));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/newsletter" className="text-gray-500 hover:text-white transition-colors text-sm">
            ← Back to Newsletter
          </Link>
          <h1 className="text-2xl font-bold text-white mt-2">New Campaign</h1>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Form */}
        <div className="space-y-5">
          {/* Brand Selection */}
          <div className="glass-panel p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Brand</h3>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(BRAND_NAMES).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => { setBrand(id); setSelectedArticleIds([]); }}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center gap-1.5 ${
                    brand === id ? 'bg-white/15 text-white ring-1' : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                  style={brand === id ? { borderColor: BRAND_COLORS[id], borderWidth: '1px' } : {}}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS[id] }} />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject Line</h3>
              <button
                onClick={autoGenerateSubject}
                className="text-xs text-blue-400 hover:text-blue-300"
                disabled={selectedArticleIds.length === 0}
              >
                ✨ Auto-generate
              </button>
            </div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="admin-input text-sm w-full"
            />
            <p className="text-[10px] text-gray-600 mt-1">{subject.length}/80 characters</p>
          </div>

          {/* Article Selection */}
          <div className="glass-panel p-5">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Select Articles ({selectedArticleIds.length} selected)
            </h3>
            {loadingArticles ? (
              <div className="py-4 text-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : articles.length === 0 ? (
              <p className="text-sm text-gray-500">No published articles for this brand</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {articles.map(article => (
                  <motion.label
                    key={article.id}
                    whileHover={{ scale: 1.01 }}
                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedArticleIds.includes(article.id)
                        ? 'bg-blue-500/10 border border-blue-500/20'
                        : 'hover:bg-white/[0.03] border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedArticleIds.includes(article.id)}
                      onChange={() => toggleArticle(article.id)}
                      className="mt-0.5 rounded border-gray-600"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">{article.title}</p>
                      <p className="text-xs text-gray-500 truncate">{article.excerpt || article.category}</p>
                    </div>
                    {article.cover_image && (
                      <img
                        src={article.cover_image}
                        alt=""
                        className="w-12 h-8 rounded object-cover flex-shrink-0"
                      />
                    )}
                  </motion.label>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="glass-panel p-4 flex items-center justify-end gap-3">
            <button onClick={() => router.back()} className="admin-btn-ghost text-sm">
              Cancel
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !subject || selectedArticleIds.length === 0}
              className="admin-btn-ghost text-sm disabled:opacity-30"
            >
              {saving ? 'Saving...' : '💾 Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={sending || !subject || selectedArticleIds.length === 0}
              className="admin-btn-primary text-sm disabled:opacity-30 flex items-center gap-2"
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : '🚀 Send Now'}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="glass-panel overflow-hidden flex flex-col">
          <div className="px-5 py-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">Email Preview</h3>
          </div>
          <div className="flex-1 p-5 overflow-y-auto">
            {selectedArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">Select articles to preview the email</p>
              </div>
            ) : (
              <div className="rounded-lg overflow-hidden border border-white/[0.06]">
                {/* Mock email header */}
                <div
                  className="p-4 text-center"
                  style={{ backgroundColor: `${BRAND_COLORS[brand]}15` }}
                >
                  <p className="text-2xl mb-2">
                    {brand === 'saucewire' ? '📡' : brand === 'saucecaviar' ? '🥂' : brand === 'trapglow' ? '✨' : '🎛️'}
                  </p>
                  <h2 className="text-lg font-bold" style={{ color: BRAND_COLORS[brand] }}>
                    {BRAND_NAMES[brand]}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {subject || 'Email Subject'}
                  </p>
                </div>

                {/* Articles preview */}
                <div className="p-4 space-y-4 bg-black/30">
                  {selectedArticles.map(article => (
                    <div key={article.id} className="flex gap-3 pb-4 border-b border-white/5 last:border-0">
                      {article.cover_image && (
                        <img
                          src={article.cover_image}
                          alt=""
                          className="w-20 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-xs uppercase tracking-wider mb-1" style={{ color: BRAND_COLORS[brand] }}>
                          {article.category}
                        </p>
                        <p className="text-sm font-semibold text-white">{article.title}</p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{article.excerpt}</p>
                        <p className="text-xs mt-2" style={{ color: BRAND_COLORS[brand] }}>Read more →</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="p-3 text-center bg-black/20">
                  <p className="text-[10px] text-gray-600">
                    You received this because you subscribed to {BRAND_NAMES[brand]}.
                  </p>
                  <p className="text-[10px] text-gray-700 underline mt-1">Unsubscribe</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
