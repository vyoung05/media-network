'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@media-network/shared';
import type { Brand, ArticleStatus } from '@media-network/shared';

// ======================== TYPES ========================

interface MediaEmbed {
  id: string;
  type: 'image' | 'audio' | 'spotify' | 'apple_music' | 'youtube';
  url: string;
  caption?: string;
}

interface QueueArticle {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  slug: string;
  category: string;
  brand: Brand;
  status: ArticleStatus;
  author_id: string | null;
  author_name: string;
  is_ai_generated: boolean;
  is_breaking: boolean;
  source_url: string | null;
  cover_image: string | null;
  tags: string[];
  reading_time_minutes: number;
  view_count: number;
  created_at: string;
  published_at: string | null;
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

const STATUS_LABELS: Record<ArticleStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'text-gray-400 bg-gray-400/10' },
  pending_review: { label: 'Pending Review', color: 'text-amber-400 bg-amber-400/10' },
  published: { label: 'Published', color: 'text-emerald-400 bg-emerald-400/10' },
  archived: { label: 'Archived', color: 'text-red-400 bg-red-400/10' },
};

const MEDIA_TYPE_LABELS: Record<MediaEmbed['type'], { label: string; icon: string; color: string }> = {
  image: { label: 'Image', icon: '🖼️', color: 'text-blue-400 bg-blue-400/10' },
  audio: { label: 'Audio', icon: '🎵', color: 'text-emerald-400 bg-emerald-400/10' },
  spotify: { label: 'Spotify', icon: '🟢', color: 'text-green-400 bg-green-400/10' },
  apple_music: { label: 'Apple Music', icon: '🍎', color: 'text-pink-400 bg-pink-400/10' },
  youtube: { label: 'YouTube', icon: '▶️', color: 'text-red-400 bg-red-400/10' },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 128);
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// ======================== EMBED HELPERS ========================

function extractSpotifyId(url: string): string | null {
  const match = url.match(/spotify\.com\/(track|album|playlist|episode)\/([a-zA-Z0-9]+)/);
  return match ? `${match[1]}/${match[2]}` : null;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function convertAppleMusicToEmbed(url: string): string | null {
  // Convert https://music.apple.com/... to https://embed.music.apple.com/...
  if (url.includes('music.apple.com')) {
    return url.replace('music.apple.com', 'embed.music.apple.com');
  }
  return null;
}

function serializeBodyWithEmbeds(text: string, embeds: MediaEmbed[]): string {
  if (embeds.length === 0) return text;
  const embedsJson = JSON.stringify(embeds);
  return `${text}\n\n<!-- MEDIA_EMBEDS:${embedsJson} -->`;
}

function parseBodyWithEmbeds(body: string): { text: string; embeds: MediaEmbed[] } {
  const marker = '<!-- MEDIA_EMBEDS:';
  const idx = body.indexOf(marker);
  if (idx === -1) return { text: body, embeds: [] };

  const text = body.substring(0, idx).trimEnd();
  const jsonStart = idx + marker.length;
  const jsonEnd = body.indexOf(' -->', jsonStart);
  if (jsonEnd === -1) return { text: body, embeds: [] };

  try {
    const embeds = JSON.parse(body.substring(jsonStart, jsonEnd)) as MediaEmbed[];
    return { text, embeds };
  } catch {
    return { text: body, embeds: [] };
  }
}

// ======================== MEDIA EMBED RENDERER ========================

function MediaEmbedPreview({ embed }: { embed: MediaEmbed }) {
  switch (embed.type) {
    case 'image':
      return (
        <div className="rounded-lg overflow-hidden border border-admin-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={embed.url} alt={embed.caption || 'Embedded image'} className="w-full max-h-64 object-cover" />
          {embed.caption && <p className="text-xs text-gray-400 p-2 bg-admin-bg/60">{embed.caption}</p>}
        </div>
      );
    case 'audio':
      return (
        <div className="p-3 rounded-lg border border-admin-border bg-admin-bg/40">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm">🎵</span>
            <span className="text-xs text-gray-400 font-mono truncate">{embed.url}</span>
          </div>
          <audio controls className="w-full h-8" preload="none">
            <source src={embed.url} />
          </audio>
          {embed.caption && <p className="text-xs text-gray-400 mt-2">{embed.caption}</p>}
        </div>
      );
    case 'spotify': {
      const spotifyPath = extractSpotifyId(embed.url);
      if (!spotifyPath) return <p className="text-xs text-red-400">Invalid Spotify URL</p>;
      return (
        <div className="rounded-lg overflow-hidden">
          <iframe
            src={`https://open.spotify.com/embed/${spotifyPath}?theme=0`}
            width="100%"
            height="152"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-lg"
            title="Spotify embed"
          />
          {embed.caption && <p className="text-xs text-gray-400 mt-2">{embed.caption}</p>}
        </div>
      );
    }
    case 'apple_music': {
      const embedUrl = convertAppleMusicToEmbed(embed.url);
      if (!embedUrl) return <p className="text-xs text-red-400">Invalid Apple Music URL</p>;
      return (
        <div className="rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            width="100%"
            height="175"
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            loading="lazy"
            className="rounded-lg"
            title="Apple Music embed"
          />
          {embed.caption && <p className="text-xs text-gray-400 mt-2">{embed.caption}</p>}
        </div>
      );
    }
    case 'youtube': {
      const ytId = extractYouTubeId(embed.url);
      if (!ytId) return <p className="text-xs text-red-400">Invalid YouTube URL</p>;
      return (
        <div className="rounded-lg overflow-hidden">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              className="absolute inset-0 w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title="YouTube embed"
            />
          </div>
          {embed.caption && <p className="text-xs text-gray-400 mt-2">{embed.caption}</p>}
        </div>
      );
    }
    default:
      return null;
  }
}

// ======================== ADD MEDIA MODAL ========================

function AddMediaModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (embed: MediaEmbed) => void;
}) {
  const [type, setType] = useState<MediaEmbed['type']>('image');
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');

  const handleAdd = () => {
    if (!url.trim()) return;
    onAdd({ id: generateId(), type, url: url.trim(), caption: caption.trim() || undefined });
    onClose();
  };

  const placeholders: Record<MediaEmbed['type'], string> = {
    image: 'https://example.com/image.jpg',
    audio: 'https://example.com/track.mp3',
    spotify: 'https://open.spotify.com/track/...',
    apple_music: 'https://music.apple.com/us/album/...',
    youtube: 'https://youtube.com/watch?v=...',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative w-full max-w-md glass-panel-solid shadow-2xl shadow-black/50"
      >
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Add Media Embed</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Type selector */}
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 block">Type</label>
            <div className="flex gap-1.5 flex-wrap">
              {(Object.keys(MEDIA_TYPE_LABELS) as MediaEmbed['type'][]).map((t) => {
                const info = MEDIA_TYPE_LABELS[t];
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                      type === t
                        ? `${info.color} ring-1 ring-current/20`
                        : 'text-gray-500 bg-admin-bg/40 hover:text-gray-300'
                    }`}
                  >
                    <span>{info.icon}</span>
                    {info.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">URL *</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholders[type]}
              className="admin-input text-sm"
            />
          </div>

          {/* Caption */}
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Caption (optional)</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Brief description..."
              className="admin-input text-sm"
            />
          </div>
        </div>

        <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
          <button onClick={onClose} className="admin-btn-ghost text-xs">Cancel</button>
          <button
            onClick={handleAdd}
            disabled={!url.trim()}
            className="admin-btn-primary text-xs flex items-center gap-1.5 disabled:opacity-40"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Media
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================== ARTICLE PREVIEW MODAL ========================

function ArticlePreviewModal({
  title,
  body,
  coverImage,
  brand,
  category,
  embeds,
  onClose,
}: {
  title: string;
  body: string;
  coverImage: string;
  brand: Brand;
  category: string;
  embeds: MediaEmbed[];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel-solid shadow-2xl shadow-black/50"
      >
        <div className="sticky top-0 z-10 px-6 py-3 border-b border-white/[0.06] bg-admin-card flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <h3 className="text-sm font-bold text-white">Article Preview</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Cover image */}
          {coverImage && (
            <div className="rounded-xl overflow-hidden mb-6 border border-admin-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover" className="w-full max-h-72 object-cover" />
            </div>
          )}

          {/* Meta */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs font-mono px-2 py-0.5 rounded"
              style={{ color: BRAND_COLORS[brand], backgroundColor: `${BRAND_COLORS[brand]}15` }}
            >
              {BRAND_NAMES[brand]}
            </span>
            <span className="text-xs text-gray-500 font-mono">{category}</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white mb-6 leading-tight">
            {title || 'Untitled Article'}
          </h1>

          {/* Body paragraphs */}
          <div className="space-y-4 mb-8">
            {body.split('\n\n').map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="text-sm text-gray-300 leading-relaxed">
                  {paragraph}
                </p>
              ) : null
            )}
          </div>

          {/* Media embeds */}
          {embeds.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-white/[0.06]">
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Media</p>
              {embeds.map((embed) => (
                <MediaEmbedPreview key={embed.id} embed={embed} />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================== CREATE ARTICLE MODAL ========================

function CreateArticleModal({
  onClose,
  onCreated,
  initialTitle = '',
  initialSourceUrl = '',
}: {
  onClose: () => void;
  onCreated: () => void;
  initialTitle?: string;
  initialSourceUrl?: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [brand, setBrand] = useState<Brand>('saucewire');
  const [category, setCategory] = useState('Music');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [sourceUrl, setSourceUrl] = useState(initialSourceUrl);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaEmbeds, setMediaEmbeds] = useState<MediaEmbed[]>([]);
  const [showAddMedia, setShowAddMedia] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [coverPreviewError, setCoverPreviewError] = useState(false);

  const BRAND_CATEGORIES: Record<Brand, string[]> = {
    saucewire: ['Music', 'Fashion', 'Entertainment', 'Sports', 'Tech'],
    saucecaviar: ['Fashion', 'Music', 'Art', 'Culture', 'Lifestyle'],
    trapglow: ['Hip-Hop', 'R&B', 'Pop', 'Electronic', 'Alternative', 'Latin'],
    trapfrequency: ['Tutorials', 'Beats', 'Gear', 'DAW Tips', 'Samples', 'Interviews'],
  };

  const addMediaEmbed = (embed: MediaEmbed) => {
    setMediaEmbeds((prev) => [...prev, embed]);
  };

  const removeMediaEmbed = (id: string) => {
    setMediaEmbeds((prev) => prev.filter((e) => e.id !== id));
  };

  const moveMediaEmbed = (id: string, direction: 'up' | 'down') => {
    setMediaEmbeds((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      if (idx === -1) return prev;
      const newArr = [...prev];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= newArr.length) return prev;
      [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];
      return newArr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('Title and body are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const supabase = getSupabaseBrowserClient();
      const slug = slugify(title);
      const wordCount = body.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200));

      const serializedBody = serializeBodyWithEmbeds(body.trim(), mediaEmbeds);

      const { error: insertError } = await supabase.from('articles').insert({
        title: title.trim(),
        slug,
        body: serializedBody,
        excerpt: excerpt.trim() || null,
        cover_image: coverImage.trim() || null,
        brand,
        category,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        status,
        is_breaking: isBreaking,
        is_ai_generated: isAiGenerated,
        source_url: sourceUrl.trim() || null,
        reading_time_minutes: readingTime,
        view_count: 0,
        published_at: status === 'published' ? new Date().toISOString() : null,
      });

      if (insertError) throw insertError;
      onCreated();
      onClose();
    } catch (err) {
      console.error('Create article error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel-solid shadow-2xl shadow-black/50"
        >
          <form onSubmit={handleSubmit}>
            <div className="sticky top-0 z-10 px-6 py-4 border-b border-white/[0.06] bg-admin-card flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Create Article</h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  disabled={!title.trim()}
                  className="admin-btn-ghost text-xs flex items-center gap-1.5 disabled:opacity-30"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </button>
                <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">{error}</div>
              )}

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Article title..."
                  className="admin-input text-sm w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => {
                      const b = e.target.value as Brand;
                      setBrand(b);
                      setCategory(BRAND_CATEGORIES[b][0]);
                    }}
                    className="admin-input text-sm w-full"
                  >
                    {(Object.keys(BRAND_NAMES) as Brand[]).map((b) => (
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
                    {BRAND_CATEGORIES[brand].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Excerpt</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short description..."
                  className="admin-input text-sm w-full"
                />
              </div>

              {/* Cover Image with preview */}
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Cover Image URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => {
                    setCoverImage(e.target.value);
                    setCoverPreviewError(false);
                  }}
                  placeholder="https://example.com/cover.jpg"
                  className="admin-input text-sm w-full"
                />
                {coverImage && !coverPreviewError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 rounded-lg overflow-hidden border border-admin-border"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverImage}
                      alt="Cover preview"
                      className="w-full max-h-40 object-cover"
                      onError={() => setCoverPreviewError(true)}
                    />
                  </motion.div>
                )}
                {coverImage && coverPreviewError && (
                  <p className="text-xs text-amber-400 mt-1.5">⚠️ Image could not be loaded — URL may be invalid or require authentication</p>
                )}
              </div>

              {/* Body editor */}
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Body *</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Article body (supports markdown)...&#10;&#10;Use double line breaks for paragraphs."
                  rows={8}
                  className="admin-input text-sm w-full resize-none"
                  required
                />
                <p className="text-xs text-gray-600 mt-1">
                  {body.trim().split(/\s+/).filter(Boolean).length} words · ~{Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 200))} min read
                </p>
              </div>

              {/* Media Embeds Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Media Embeds</label>
                  <button
                    type="button"
                    onClick={() => setShowAddMedia(true)}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Media
                  </button>
                </div>

                {mediaEmbeds.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setShowAddMedia(true)}
                    className="w-full p-4 rounded-lg border border-dashed border-admin-border hover:border-white/20 text-center transition-colors group"
                  >
                    <div className="text-2xl mb-1 opacity-40 group-hover:opacity-60 transition-opacity">🎬</div>
                    <p className="text-xs text-gray-500 group-hover:text-gray-400">
                      Add images, audio, Spotify, Apple Music, or YouTube embeds
                    </p>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {mediaEmbeds.map((embed, idx) => {
                        const typeInfo = MEDIA_TYPE_LABELS[embed.type];
                        return (
                          <motion.div
                            key={embed.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="flex items-center gap-3 p-3 rounded-lg bg-admin-bg/40 border border-admin-border group"
                          >
                            <span className="text-sm">{typeInfo.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-300 truncate">{embed.url}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${typeInfo.color}`}>
                                  {typeInfo.label}
                                </span>
                                {embed.caption && (
                                  <span className="text-[10px] text-gray-600 truncate">{embed.caption}</span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                onClick={() => moveMediaEmbed(embed.id, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                                title="Move up"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => moveMediaEmbed(embed.id, 'down')}
                                disabled={idx === mediaEmbeds.length - 1}
                                className="p-1 text-gray-500 hover:text-white disabled:opacity-20 transition-colors"
                                title="Move down"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeMediaEmbed(embed.id)}
                                className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                                title="Remove"
                              >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <button
                      type="button"
                      onClick={() => setShowAddMedia(true)}
                      className="w-full p-2 rounded-lg border border-dashed border-admin-border hover:border-white/20 text-xs text-gray-500 hover:text-gray-400 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Another
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Source URL</label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="admin-input text-sm w-full"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="hip-hop, culture, news"
                  className="admin-input text-sm w-full"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                    className="admin-input text-sm w-full"
                  >
                    <option value="draft">Draft</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBreaking}
                      onChange={(e) => setIsBreaking(e.target.checked)}
                      className="w-4 h-4 rounded bg-white/10 border-white/20"
                    />
                    <span className="text-sm text-gray-300">Breaking</span>
                  </label>
                </div>
                <div className="flex items-end gap-3 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAiGenerated}
                      onChange={(e) => setIsAiGenerated(e.target.checked)}
                      className="w-4 h-4 rounded bg-white/10 border-white/20"
                    />
                    <span className="text-sm text-gray-300">AI Generated</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 px-6 py-4 border-t border-white/[0.06] bg-admin-card flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {mediaEmbeds.length > 0 && (
                  <span className="px-2 py-0.5 bg-white/5 rounded font-mono">
                    {mediaEmbeds.length} media embed{mediaEmbeds.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={onClose} className="admin-btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2">
                  {saving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Article
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>

      {/* Add Media sub-modal */}
      <AnimatePresence>
        {showAddMedia && (
          <AddMediaModal
            onClose={() => setShowAddMedia(false)}
            onAdd={addMediaEmbed}
          />
        )}
      </AnimatePresence>

      {/* Preview sub-modal */}
      <AnimatePresence>
        {showPreview && (
          <ArticlePreviewModal
            title={title}
            body={body}
            coverImage={coverImage}
            brand={brand}
            category={category}
            embeds={mediaEmbeds}
            onClose={() => setShowPreview(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ======================== MAIN COMPONENT ========================

export function ContentQueuePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [articles, setArticles] = useState<QueueArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterBrand, setFilterBrand] = useState<Brand | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'ai' | 'human'>('all');
  const [filterStatus, setFilterStatus] = useState<ArticleStatus | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [previewArticle, setPreviewArticle] = useState<QueueArticle | null>(null);

  // Pre-fill values from query params (from News Scanner "Draft Article" button)
  const [draftTitle] = useState(searchParams.get('draft_title') || '');
  const [draftSource] = useState(searchParams.get('draft_source') || '');

  // Auto-open create modal if arriving with draft params
  useEffect(() => {
    if (draftTitle || draftSource) {
      setShowCreateModal(true);
      // Clean up the URL without navigating
      router.replace('/dashboard/content', { scroll: false });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();

      const query = supabase
        .from('articles')
        .select('id, title, slug, body, excerpt, category, brand, status, author_id, is_ai_generated, is_breaking, source_url, cover_image, tags, reading_time_minutes, view_count, created_at, published_at')
        .order('created_at', { ascending: false })
        .limit(50);

      const { data, error: fetchError } = await query;
      if (fetchError) throw fetchError;

      const authorIds = [...new Set((data || []).filter(a => a.author_id).map(a => a.author_id))];
      let authorMap: Record<string, string> = {};

      if (authorIds.length > 0) {
        const { data: authors } = await supabase
          .from('users')
          .select('id, name')
          .in('id', authorIds);
        if (authors) {
          authorMap = Object.fromEntries(authors.map(a => [a.id, a.name]));
        }
      }

      const mapped: QueueArticle[] = (data || []).map((a) => ({
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        body: a.body,
        slug: a.slug,
        category: a.category,
        brand: a.brand as Brand,
        status: a.status as ArticleStatus,
        author_id: a.author_id,
        author_name: a.author_id ? (authorMap[a.author_id] || 'Unknown') : (a.is_ai_generated ? 'AI Pipeline' : 'Unknown'),
        is_ai_generated: a.is_ai_generated,
        is_breaking: a.is_breaking,
        source_url: a.source_url,
        cover_image: a.cover_image,
        tags: a.tags || [],
        reading_time_minutes: a.reading_time_minutes,
        view_count: a.view_count || 0,
        created_at: a.created_at,
        published_at: a.published_at,
      }));

      setArticles(mapped);
      setError(null);
    } catch (err) {
      console.error('Fetch articles error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleStatusChange = async (id: string, newStatus: ArticleStatus) => {
    setActionLoading(id);
    try {
      const supabase = getSupabaseBrowserClient();
      const updates: Record<string, unknown> = { status: newStatus };
      if (newStatus === 'published') {
        updates.published_at = new Date().toISOString();
      }

      const { error: updateError } = await supabase
        .from('articles')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      setArticles((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : a.published_at }
            : a
        )
      );
    } catch (err) {
      console.error('Status change error:', err);
      alert(`Failed to update article: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setActionLoading(id);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: deleteError } = await supabase.from('articles').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert(`Failed to delete article: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRegenerate = async (article: QueueArticle) => {
    if (!confirm('This will delete the current draft and generate a new one with AI. Continue?')) return;
    setActionLoading(article.id);

    try {
      // Extract source info from AI meta in body
      let sourceUrl = article.source_url || '';
      let sourceTitle = article.title;
      let sourceName = 'Unknown';

      const metaMatch = article.body.match(/<!-- AI_META:([\s\S]*?) -->/);
      if (metaMatch) {
        try {
          const meta = JSON.parse(metaMatch[1]);
          sourceUrl = meta.source_url || sourceUrl;
          sourceTitle = meta.source_title || sourceTitle;
          sourceName = meta.source_name || sourceName;
        } catch {}
      }

      // Delete old article
      const supabase = getSupabaseBrowserClient();
      await supabase.from('articles').delete().eq('id', article.id);

      // Generate new one
      const res = await fetch('/api/generate-article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newsUrl: sourceUrl,
          newsTitle: sourceTitle,
          newsSource: sourceName,
          brand: article.brand,
          category: article.category,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert(`✅ Regenerated: "${data.article.title}"`);
        fetchArticles();
      } else {
        alert(`❌ Regeneration failed: ${data.error || 'Unknown error'}`);
        fetchArticles(); // Refresh to reflect deletion
      }
    } catch (err) {
      console.error('Regenerate error:', err);
      alert(`Failed to regenerate: ${err instanceof Error ? err.message : 'Unknown error'}`);
      fetchArticles();
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = articles.filter((a) => {
    if (filterBrand !== 'all' && a.brand !== filterBrand) return false;
    if (filterType === 'ai' && !a.is_ai_generated) return false;
    if (filterType === 'human' && a.is_ai_generated) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const statusCounts = {
    all: articles.length,
    draft: articles.filter(a => a.status === 'draft').length,
    pending_review: articles.filter(a => a.status === 'pending_review').length,
    published: articles.filter(a => a.status === 'published').length,
    archived: articles.filter(a => a.status === 'archived').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Queue</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `${articles.length} articles total • ${statusCounts.pending_review} pending review`}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="admin-btn-primary flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Article
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="glass-panel p-4 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={fetchArticles} className="ml-auto text-xs text-red-300 hover:text-white underline">Retry</button>
          </div>
        </div>
      )}

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] pb-px">
        {([
          { key: 'all' as const, label: 'All' },
          { key: 'pending_review' as const, label: 'Pending Review' },
          { key: 'draft' as const, label: 'Drafts' },
          { key: 'published' as const, label: 'Published' },
          { key: 'archived' as const, label: 'Archived' },
        ]).map((tab) => {
          const isActive = filterStatus === tab.key;
          const count = statusCounts[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-600'
                }`}>
                  {count}
                </span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="content-tab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Brand:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterBrand('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                filterBrand === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              All
            </button>
            {(Object.keys(BRAND_NAMES) as Brand[]).map((brand) => (
              <button
                key={brand}
                onClick={() => setFilterBrand(brand)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  filterBrand === brand ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[brand] }} />
                {BRAND_NAMES[brand]}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-5 bg-white/10" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Type:</span>
          <div className="flex gap-1">
            {(['all', 'ai', 'human'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterType === type ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {type === 'ai' ? '🤖 AI' : type === 'human' ? '✍️ Human' : 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-panel p-5">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-white/10 animate-pulse mt-1" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                  <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Queue list */}
      {!loading && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((article, i) => {
              const statusInfo = STATUS_LABELS[article.status];
              const isActioning = actionLoading === article.id;
              const { embeds } = parseBodyWithEmbeds(article.body);
              return (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.03 }}
                  className={`glass-panel p-5 hover:bg-admin-hover/30 transition-colors ${isActioning ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Status indicator */}
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: BRAND_COLORS[article.brand] }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                          {article.category}
                        </span>
                        <span className="text-xs text-gray-700">•</span>
                        <span className="text-xs font-mono" style={{ color: BRAND_COLORS[article.brand] }}>
                          {BRAND_NAMES[article.brand]}
                        </span>
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                        {article.is_ai_generated && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                            🤖 AI
                          </span>
                        )}
                        {article.is_breaking && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">
                            🔴 Breaking
                          </span>
                        )}
                        {embeds.length > 0 && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono">
                            🎬 {embeds.length} media
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1">{article.title}</h3>
                      {article.excerpt && (
                        <p className="text-sm text-gray-500 line-clamp-1">{article.excerpt}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                        <span>By {article.author_name}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>•</span>
                        <span>{article.reading_time_minutes} min read</span>
                        {article.view_count > 0 && (
                          <>
                            <span>•</span>
                            <span>{article.view_count.toLocaleString()} views</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => setPreviewArticle(article)}
                        className="admin-btn-ghost px-3 py-2 text-xs flex items-center gap-1"
                        title="Preview article"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      {article.status === 'pending_review' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(article.id, 'published')}
                            disabled={isActioning}
                            className="admin-btn-success px-4 py-2 text-xs flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Publish
                          </button>
                          <button
                            onClick={() => handleStatusChange(article.id, 'archived')}
                            disabled={isActioning}
                            className="admin-btn-danger px-4 py-2 text-xs flex items-center gap-1.5"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                        </>
                      )}
                      {article.status === 'draft' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(article.id, 'pending_review')}
                            disabled={isActioning}
                            className="admin-btn-primary px-4 py-2 text-xs flex items-center gap-1.5"
                          >
                            Submit for Review
                          </button>
                          {article.is_ai_generated && (
                            <button
                              onClick={() => handleRegenerate(article)}
                              disabled={isActioning}
                              className="admin-btn-ghost px-3 py-2 text-xs flex items-center gap-1.5 text-blue-400 hover:text-blue-300"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Regenerate
                            </button>
                          )}
                        </>
                      )}
                      {article.status === 'published' && (
                        <button
                          onClick={() => handleStatusChange(article.id, 'archived')}
                          disabled={isActioning}
                          className="admin-btn-ghost px-3 py-2 text-xs"
                        >
                          Archive
                        </button>
                      )}
                      {article.status === 'archived' && (
                        <button
                          onClick={() => handleStatusChange(article.id, 'draft')}
                          disabled={isActioning}
                          className="admin-btn-ghost px-3 py-2 text-xs"
                        >
                          Restore
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={isActioning}
                        className="admin-btn-ghost px-3 py-2 text-xs text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-12 text-center"
            >
              <div className="text-4xl mb-4">{articles.length === 0 ? '📝' : '✅'}</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {articles.length === 0 ? 'No articles yet' : 'Queue is clear!'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {articles.length === 0
                  ? 'Create your first article to get started.'
                  : 'No articles match the current filters.'}
              </p>
              {articles.length === 0 && (
                <button onClick={() => setShowCreateModal(true)} className="admin-btn-primary">
                  Create First Article
                </button>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Create Article Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateArticleModal
            onClose={() => setShowCreateModal(false)}
            onCreated={fetchArticles}
            initialTitle={draftTitle}
            initialSourceUrl={draftSource}
          />
        )}
      </AnimatePresence>

      {/* Article Preview Modal (from queue list) */}
      <AnimatePresence>
        {previewArticle && (() => {
          const { text, embeds } = parseBodyWithEmbeds(previewArticle.body);
          return (
            <ArticlePreviewModal
              title={previewArticle.title}
              body={text}
              coverImage={previewArticle.cover_image || ''}
              brand={previewArticle.brand}
              category={previewArticle.category}
              embeds={embeds}
              onClose={() => setPreviewArticle(null)}
            />
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
