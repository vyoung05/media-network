'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────

type PageType = 'cover' | 'toc' | 'article' | 'spread' | 'video' | 'ad' | 'artist' | 'full-bleed' | 'back-cover';

interface MagazinePage {
  id: string;
  issue_id: string;
  page_number: number;
  type: PageType;
  title?: string;
  subtitle?: string;
  content?: string;
  pull_quote?: string;
  author?: string;
  author_title?: string;
  image_url?: string;
  image_alt?: string;
  secondary_image_url?: string;
  background_color?: string;
  text_color?: string;
  category?: string;
  tags?: string[];
  video_url?: string;
  music_embed?: string;
  artist_name?: string;
  artist_bio?: string;
  artist_links?: Record<string, string>;
  advertiser_name?: string;
  advertiser_tagline?: string;
  advertiser_cta?: string;
  advertiser_url?: string;
  toc_entries?: { title: string; page: number; category: string }[];
}

interface MagazineIssue {
  id: string;
  slug: string;
  title: string;
  issue_number: number;
  subtitle: string;
  description: string;
  cover_image: string;
  published_at: string | null;
  status: 'draft' | 'published' | 'archived';
  page_count: number;
  featured_color: string;
  season: string;
  pages: MagazinePage[];
}

// ─── Constants ───────────────────────────────────────────

const PAGE_TYPE_ICONS: Record<PageType, string> = {
  'cover': '📰',
  'toc': '📋',
  'article': '📝',
  'spread': '🖼️',
  'video': '🎬',
  'ad': '📢',
  'artist': '🎤',
  'full-bleed': '🌅',
  'back-cover': '📕',
};

const PAGE_TYPE_LABELS: Record<PageType, string> = {
  'cover': 'Cover',
  'toc': 'Table of Contents',
  'article': 'Article',
  'spread': 'Spread',
  'video': 'Video',
  'ad': 'Advertisement',
  'artist': 'Artist Feature',
  'full-bleed': 'Full Bleed',
  'back-cover': 'Back Cover',
};

const ALL_PAGE_TYPES: PageType[] = ['cover', 'toc', 'article', 'spread', 'video', 'ad', 'artist', 'full-bleed', 'back-cover'];

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  published: 'bg-green-500/20 text-green-400 border-green-500/30',
  archived: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

// ─── Page type field definitions ─────────────────────────

type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'color' | 'tags' | 'toc-entries' | 'artist-links';
  placeholder?: string;
};

const PAGE_TYPE_FIELDS: Record<PageType, FieldDef[]> = {
  'cover': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Cover title' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Cover subtitle' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
    { key: 'background_color', label: 'Background Color', type: 'color', placeholder: '#000000' },
  ],
  'toc': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Table of Contents' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
    { key: 'toc_entries', label: 'TOC Entries', type: 'toc-entries' },
  ],
  'article': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Article title' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Article subtitle' },
    { key: 'author', label: 'Author', type: 'text', placeholder: 'Author name' },
    { key: 'author_title', label: 'Author Title', type: 'text', placeholder: 'e.g. Senior Editor' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Culture' },
    { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Article body...' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
    { key: 'pull_quote', label: 'Pull Quote', type: 'text', placeholder: 'A standout quote...' },
    { key: 'tags', label: 'Tags', type: 'tags', placeholder: 'culture, fashion, music' },
  ],
  'spread': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Spread title' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Spread subtitle' },
    { key: 'image_url', label: 'Primary Image URL', type: 'url', placeholder: 'https://...' },
    { key: 'secondary_image_url', label: 'Secondary Image URL', type: 'url', placeholder: 'https://...' },
    { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Spread body...' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Fashion' },
  ],
  'video': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Video title' },
    { key: 'video_url', label: 'Video URL', type: 'url', placeholder: 'https://youtube.com/...' },
    { key: 'content', label: 'Description', type: 'textarea', placeholder: 'Video description...' },
  ],
  'ad': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Ad title' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
    { key: 'advertiser_name', label: 'Advertiser Name', type: 'text', placeholder: 'Brand name' },
    { key: 'advertiser_tagline', label: 'Tagline', type: 'text', placeholder: 'The tagline...' },
    { key: 'advertiser_cta', label: 'CTA Text', type: 'text', placeholder: 'Shop Now' },
    { key: 'advertiser_url', label: 'CTA URL', type: 'url', placeholder: 'https://...' },
    { key: 'background_color', label: 'Background Color', type: 'color', placeholder: '#000000' },
  ],
  'artist': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Feature title' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Subtitle' },
    { key: 'artist_name', label: 'Artist Name', type: 'text', placeholder: 'Artist name' },
    { key: 'artist_bio', label: 'Artist Bio', type: 'textarea', placeholder: 'Artist biography...' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
    { key: 'artist_links', label: 'Artist Links', type: 'artist-links' },
    { key: 'music_embed', label: 'Music Embed', type: 'url', placeholder: 'Spotify/SoundCloud embed URL' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Hip-Hop' },
    { key: 'pull_quote', label: 'Pull Quote', type: 'text', placeholder: 'A standout quote...' },
  ],
  'full-bleed': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Title' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Subtitle' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'Category' },
  ],
  'back-cover': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Title' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Subtitle' },
    { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Back cover content...' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...' },
    { key: 'background_color', label: 'Background Color', type: 'color', placeholder: '#000000' },
  ],
};

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function EditMagazineIssuePage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;

  // ─── State ───
  const [issue, setIssue] = useState<MagazineIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Issue form fields
  const [issueForm, setIssueForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    season: '',
    featured_color: '#C9A84C',
    cover_image: '',
  });

  // Page management
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [editingPage, setEditingPage] = useState<MagazinePage | null>(null);
  const [pageForm, setPageForm] = useState<Record<string, any>>({});
  const [savingPage, setSavingPage] = useState(false);

  // ─── Fetch issue ───
  const fetchIssue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}`);
      if (!res.ok) throw new Error('Failed to fetch issue');
      const data: MagazineIssue = await res.json();
      setIssue(data);
      setIssueForm({
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        season: data.season || '',
        featured_color: data.featured_color || '#C9A84C',
        cover_image: data.cover_image || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => { fetchIssue(); }, [fetchIssue]);

  // ─── Flash success message ───
  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // ─── Save issue details ───
  const handleSaveIssue = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueForm),
      });
      if (!res.ok) throw new Error('Failed to save issue');
      const updated = await res.json();
      setIssue((prev) => prev ? { ...prev, ...updated } : prev);
      flash('Issue details saved!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Publish issue ───
  const handlePublish = async () => {
    if (!confirm('Publish this issue? It will become publicly visible.')) return;
    setPublishing(true);
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}/publish`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to publish');
      const updated = await res.json();
      setIssue((prev) => prev ? { ...prev, ...updated } : prev);
      flash('Issue published! 🎉');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  // ─── Add page ───
  const handleAddPage = async (type: PageType) => {
    setShowAddPageModal(false);
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title: `New ${PAGE_TYPE_LABELS[type]}` }),
      });
      if (!res.ok) throw new Error('Failed to add page');
      flash(`${PAGE_TYPE_LABELS[type]} page added!`);
      fetchIssue();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ─── Delete page ───
  const handleDeletePage = async (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this page?')) return;
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}/pages/${pageId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete page');
      if (editingPage?.id === pageId) {
        setEditingPage(null);
        setPageForm({});
      }
      flash('Page deleted');
      fetchIssue();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ─── Move page ───
  const handleMovePage = async (page: MagazinePage, direction: 'up' | 'down') => {
    if (!issue) return;
    const pages = [...issue.pages].sort((a, b) => a.page_number - b.page_number);
    const idx = pages.findIndex((p) => p.id === page.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= pages.length) return;

    const thisPage = pages[idx];
    const otherPage = pages[swapIdx];

    try {
      await Promise.all([
        fetch(`/api/magazine-issues/${issueId}/pages/${thisPage.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page_number: otherPage.page_number }),
        }),
        fetch(`/api/magazine-issues/${issueId}/pages/${otherPage.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page_number: thisPage.page_number }),
        }),
      ]);
      fetchIssue();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ─── Open page editor ───
  const openPageEditor = (page: MagazinePage) => {
    setEditingPage(page);
    const formData: Record<string, any> = {};
    const fields = PAGE_TYPE_FIELDS[page.type] || [];
    for (const field of fields) {
      if (field.type === 'tags') {
        formData[field.key] = Array.isArray((page as any)[field.key])
          ? (page as any)[field.key].join(', ')
          : (page as any)[field.key] || '';
      } else if (field.type === 'toc-entries') {
        formData[field.key] = (page as any)[field.key] || [];
      } else if (field.type === 'artist-links') {
        formData[field.key] = (page as any)[field.key] || {};
      } else {
        formData[field.key] = (page as any)[field.key] || '';
      }
    }
    setPageForm(formData);
  };

  // ─── Save page ───
  const handleSavePage = async () => {
    if (!editingPage) return;
    setSavingPage(true);
    setError(null);
    try {
      const payload: Record<string, any> = { ...pageForm };
      // Convert tags string to array
      const fields = PAGE_TYPE_FIELDS[editingPage.type] || [];
      for (const field of fields) {
        if (field.type === 'tags' && typeof payload[field.key] === 'string') {
          payload[field.key] = payload[field.key]
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean);
        }
      }

      const res = await fetch(`/api/magazine-issues/${issueId}/pages/${editingPage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save page');
      flash('Page saved!');
      setEditingPage(null);
      setPageForm({});
      fetchIssue();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingPage(false);
    }
  };

  // ─── Loading / Error states ───
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !issue) {
    return (
      <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5 max-w-lg mx-auto mt-12">
        <p className="text-sm text-red-400 mb-3">{error}</p>
        <button onClick={() => router.push('/dashboard/magazine')} className="admin-btn-ghost text-sm">← Back to Issues</button>
      </div>
    );
  }

  if (!issue) return null;

  const sortedPages = [...issue.pages].sort((a, b) => a.page_number - b.page_number);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/magazine')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Issue #{issue.issue_number}: {issue.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${STATUS_COLORS[issue.status]}`}>
                {issue.status}
              </span>
              <span className="text-xs text-gray-500">{issue.pages.length} pages</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {issue.status !== 'published' && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="admin-btn-primary flex items-center gap-2 touch-manipulation disabled:opacity-50 text-sm"
            >
              {publishing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                '🚀'
              )}
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Success / Error banners */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-3 border border-green-500/20 bg-green-500/5"
          >
            <p className="text-sm text-green-400">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <div className="glass-panel p-3 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ═══ Issue Details Section ═══ */}
      <div className="glass-panel p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono text-[#C9A84C] uppercase tracking-wider">Issue Details</h2>
          <button
            onClick={handleSaveIssue}
            disabled={saving}
            className="admin-btn-primary text-sm flex items-center gap-2 touch-manipulation disabled:opacity-50"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            Save Details
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={issueForm.title}
              onChange={(e) => setIssueForm((f) => ({ ...f, title: e.target.value }))}
              className="admin-input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Subtitle</label>
            <input
              type="text"
              value={issueForm.subtitle}
              onChange={(e) => setIssueForm((f) => ({ ...f, subtitle: e.target.value }))}
              className="admin-input w-full text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
          <textarea
            value={issueForm.description}
            onChange={(e) => setIssueForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="admin-input w-full text-sm resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Season</label>
            <input
              type="text"
              value={issueForm.season}
              onChange={(e) => setIssueForm((f) => ({ ...f, season: e.target.value }))}
              placeholder="e.g. Spring 2025"
              className="admin-input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Featured Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={issueForm.featured_color}
                onChange={(e) => setIssueForm((f) => ({ ...f, featured_color: e.target.value }))}
                className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={issueForm.featured_color}
                onChange={(e) => setIssueForm((f) => ({ ...f, featured_color: e.target.value }))}
                className="admin-input w-full text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={issueForm.cover_image}
              onChange={(e) => setIssueForm((f) => ({ ...f, cover_image: e.target.value }))}
              placeholder="https://..."
              className="admin-input w-full text-sm"
            />
          </div>
        </div>
      </div>

      {/* ═══ Pages Section ═══ */}
      <div className="glass-panel p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono text-[#C9A84C] uppercase tracking-wider">
            Pages ({sortedPages.length})
          </h2>
          <button
            onClick={() => setShowAddPageModal(true)}
            className="admin-btn-primary text-sm flex items-center gap-2 touch-manipulation"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Page
          </button>
        </div>

        {sortedPages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm text-gray-500">No pages yet. Add your first page to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedPages.map((page, idx) => (
              <motion.div
                key={page.id}
                layout
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer touch-manipulation ${
                  editingPage?.id === page.id
                    ? 'border-[#C9A84C]/40 bg-[#C9A84C]/5'
                    : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02] active:bg-white/[0.04]'
                }`}
                onClick={() => openPageEditor(page)}
              >
                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMovePage(page, 'up'); }}
                    disabled={idx === 0}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors touch-manipulation"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMovePage(page, 'down'); }}
                    disabled={idx === sortedPages.length - 1}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors touch-manipulation"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Page number */}
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-gray-400 flex-shrink-0">
                  {page.page_number}
                </div>

                {/* Type icon */}
                <span className="text-lg flex-shrink-0">{PAGE_TYPE_ICONS[page.type]}</span>

                {/* Thumbnail */}
                {page.image_url && (
                  <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 hidden sm:block">
                    <img src={page.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {page.title || PAGE_TYPE_LABELS[page.type]}
                  </div>
                  <div className="text-xs text-gray-500">{PAGE_TYPE_LABELS[page.type]}</div>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => handleDeletePage(page.id, e)}
                  className="p-2 text-gray-600 hover:text-red-400 active:text-red-300 transition-colors flex-shrink-0 touch-manipulation"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ Page Edit Panel ═══ */}
      <AnimatePresence>
        {editingPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-panel p-5 sm:p-6 space-y-5 border border-[#C9A84C]/20"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono text-[#C9A84C] uppercase tracking-wider flex items-center gap-2">
                {PAGE_TYPE_ICONS[editingPage.type]} Edit {PAGE_TYPE_LABELS[editingPage.type]} — Page {editingPage.page_number}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingPage(null); setPageForm({}); }}
                  className="admin-btn-ghost text-sm touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePage}
                  disabled={savingPage}
                  className="admin-btn-primary text-sm flex items-center gap-2 touch-manipulation disabled:opacity-50"
                >
                  {savingPage ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Save Page
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {(PAGE_TYPE_FIELDS[editingPage.type] || []).map((field) => (
                <PageFieldEditor
                  key={field.key}
                  field={field}
                  value={pageForm[field.key]}
                  onChange={(val) => setPageForm((f) => ({ ...f, [field.key]: val }))}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Add Page Modal ═══ */}
      <AnimatePresence>
        {showAddPageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowAddPageModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-lg glass-panel rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 max-h-[80vh] overflow-y-auto"
            >
              <h3 className="text-lg font-bold text-white mb-1">Add Page</h3>
              <p className="text-sm text-gray-500 mb-4">Choose a page type to add to this issue.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_PAGE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddPage(type)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.06] hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 active:bg-[#C9A84C]/10 transition-all touch-manipulation"
                  >
                    <span className="text-2xl">{PAGE_TYPE_ICONS[type]}</span>
                    <span className="text-xs font-medium text-gray-300">{PAGE_TYPE_LABELS[type]}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddPageModal(false)}
                className="w-full mt-4 admin-btn-ghost text-sm touch-manipulation"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE FIELD EDITOR COMPONENT
// ═══════════════════════════════════════════════════════════

function PageFieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: any;
  onChange: (val: any) => void;
}) {
  // ─── TOC Entries ───
  if (field.type === 'toc-entries') {
    const entries: { title: string; page: number; category: string }[] = Array.isArray(value) ? value : [];

    const addEntry = () => {
      onChange([...entries, { title: '', page: 1, category: '' }]);
    };

    const updateEntry = (idx: number, key: string, val: any) => {
      const updated = entries.map((e, i) => i === idx ? { ...e, [key]: val } : e);
      onChange(updated);
    };

    const removeEntry = (idx: number) => {
      onChange(entries.filter((_, i) => i !== idx));
    };

    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">{field.label}</label>
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <input
                type="text"
                value={entry.title}
                onChange={(e) => updateEntry(idx, 'title', e.target.value)}
                placeholder="Entry title"
                className="admin-input flex-1 text-sm"
              />
              <input
                type="number"
                value={entry.page}
                onChange={(e) => updateEntry(idx, 'page', parseInt(e.target.value) || 1)}
                placeholder="Pg"
                className="admin-input w-16 text-sm"
              />
              <input
                type="text"
                value={entry.category}
                onChange={(e) => updateEntry(idx, 'category', e.target.value)}
                placeholder="Category"
                className="admin-input w-28 text-sm"
              />
              <button
                onClick={() => removeEntry(idx)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors touch-manipulation flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addEntry}
            className="text-xs text-[#C9A84C] hover:text-[#d4b35a] transition-colors touch-manipulation flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add entry
          </button>
        </div>
      </div>
    );
  }

  // ─── Artist Links ───
  if (field.type === 'artist-links') {
    const links: Record<string, string> = typeof value === 'object' && value ? value : {};
    const platforms = ['spotify', 'instagram', 'twitter', 'youtube', 'soundcloud', 'tiktok'];

    const updateLink = (platform: string, url: string) => {
      const updated = { ...links, [platform]: url };
      if (!url) delete updated[platform];
      onChange(updated);
    };

    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">{field.label}</label>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div key={platform} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-20 capitalize flex-shrink-0">{platform}</span>
              <input
                type="url"
                value={links[platform] || ''}
                onChange={(e) => updateLink(platform, e.target.value)}
                placeholder={`https://${platform}.com/...`}
                className="admin-input flex-1 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Color picker ───
  if (field.type === 'color') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer flex-shrink-0"
          />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="admin-input flex-1 text-sm"
          />
        </div>
      </div>
    );
  }

  // ─── Textarea ───
  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="admin-input w-full text-sm resize-y"
        />
      </div>
    );
  }

  // ─── Default: text or url ───
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
      <input
        type={field.type === 'url' ? 'url' : 'text'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="admin-input w-full text-sm"
      />
      {field.type === 'url' && value && (value as string).match(/\.(jpg|jpeg|png|gif|webp)/i) && (
        <div className="mt-2 max-w-[120px] rounded-lg overflow-hidden bg-gray-800">
          <img src={value} alt="" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
}
