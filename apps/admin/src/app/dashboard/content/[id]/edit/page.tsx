'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { LivePreview } from '@/components/LivePreview';
import { ImageUpload } from '@/components/ImageUpload';
import {
  BRAND_FORM_CONFIGS,
  getBrandFormConfig,
  getFieldGroups,
  GROUP_LABELS,
  type BrandField,
} from '@/config/brand-fields';
import { getArticleById } from '@media-network/shared';
import { slugify, estimateReadingTime } from '@media-network/shared';
import type { Brand, ArticleStatus } from '@media-network/shared';

const ALL_BRANDS = Object.values(BRAND_FORM_CONFIGS);

// ======================== STATUS CONFIG ========================

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  draft:          { label: 'Draft',          color: 'text-gray-400',    bg: 'bg-gray-400/10 border-gray-400/20',    icon: '📝' },
  pending_review: { label: 'Pending Review', color: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-400/20',  icon: '⏳' },
  saved:          { label: 'Saved for Later',color: 'text-amber-300',   bg: 'bg-amber-300/10 border-amber-300/20',  icon: '🔖' },
  published:      { label: 'Published',      color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', icon: '✅' },
  archived:       { label: 'Archived',       color: 'text-red-400',     bg: 'bg-red-400/10 border-red-400/20',      icon: '📦' },
};

// ======================== DELETE CONFIRMATION MODAL ========================

function DeleteConfirmModal({
  title,
  onConfirm,
  onCancel,
  deleting,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        className="relative w-full max-w-md glass-panel-solid shadow-2xl shadow-black/50"
      >
        <div className="p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Delete Article?</h3>
          <p className="text-sm text-gray-400 mb-1">Are you sure you want to delete:</p>
          <p className="text-sm text-white font-medium mb-4 line-clamp-2">&ldquo;{title}&rdquo;</p>
          <p className="text-xs text-red-400/80 mb-6">This action cannot be undone.</p>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onCancel}
              disabled={deleting}
              className="admin-btn-ghost px-5 py-2"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="px-5 py-2 text-sm font-medium rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Permanently
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================== SUCCESS TOAST ========================

function SuccessToast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-6 right-6 z-[70] px-4 py-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm shadow-lg"
    >
      <p className="text-sm text-emerald-300 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </p>
    </motion.div>
  );
}

// ======================== MEDIA OPTIONS PANEL ========================

interface MediaOptionsProps {
  mediaOptions?: {
    sourceImages?: Array<{ url: string; alt: string; source: string }>;
    stockImages?: Array<{ url: string; credit: string }>;
    aiImages?: Array<{ url: string; prompt: string }>;
    videos?: Array<{ title: string; url: string; embedUrl: string; thumbnailUrl: string; source: string }>;
  };
  onUseCover: (url: string) => void;
  onEmbedVideo: (embedUrl: string, title: string) => void;
}

function MediaOptionsPanel({ mediaOptions, onUseCover, onEmbedVideo }: MediaOptionsProps) {
  const [expanded, setExpanded] = useState(false);

  if (!mediaOptions) return null;

  const { sourceImages = [], stockImages = [], aiImages = [], videos = [] } = mediaOptions;
  const totalImages = sourceImages.length + stockImages.length + aiImages.length;
  const totalVideos = videos.length;

  if (totalImages === 0 && totalVideos === 0) return null;

  return (
    <div className="glass-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-3 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🖼️</span>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Media Options
          </h3>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400">
            {totalImages} image{totalImages !== 1 ? 's' : ''} · {totalVideos} video{totalVideos !== 1 ? 's' : ''}
          </span>
        </div>
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-4">
              {/* Source Images */}
              {sourceImages.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Source Article Images ({sourceImages.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {sourceImages.map((img, i) => (
                      <div key={`src-${i}`} className="relative group rounded-lg overflow-hidden border border-white/[0.06] bg-black/20">
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full h-20 object-cover"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => onUseCover(img.url)}
                            className="px-2 py-1 text-[10px] font-medium rounded bg-white/20 text-white hover:bg-white/30 transition-colors"
                          >
                            Use as Cover
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-1.5 py-0.5 bg-black/50">
                          <p className="text-[9px] text-gray-300 truncate">
                            {img.source === 'og:image' ? '📌 Featured' : '📷 Article'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Images */}
              {stockImages.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Stock Images ({stockImages.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {stockImages.map((img, i) => (
                      <div key={`stock-${i}`} className="relative group rounded-lg overflow-hidden border border-white/[0.06] bg-black/20">
                        <img
                          src={img.url}
                          alt={img.credit}
                          className="w-full h-20 object-cover"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => onUseCover(img.url)}
                            className="px-2 py-1 text-[10px] font-medium rounded bg-white/20 text-white hover:bg-white/30 transition-colors"
                          >
                            Use as Cover
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-1.5 py-0.5 bg-black/50">
                          <p className="text-[9px] text-gray-300 truncate">📸 {img.credit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Generated Images */}
              {aiImages.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    AI Generated ({aiImages.length})
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {aiImages.map((img, i) => (
                      <div key={`ai-${i}`} className="relative group rounded-lg overflow-hidden border border-white/[0.06] bg-black/20">
                        <img
                          src={img.url}
                          alt="AI generated"
                          className="w-full h-28 object-cover"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-2">
                          <button
                            type="button"
                            onClick={() => onUseCover(img.url)}
                            className="px-2 py-1 text-[10px] font-medium rounded bg-white/20 text-white hover:bg-white/30 transition-colors"
                          >
                            Use as Cover
                          </button>
                          <p className="text-[8px] text-gray-300 text-center line-clamp-2 mt-1">{img.prompt}</p>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 px-1.5 py-0.5 bg-black/50">
                          <p className="text-[9px] text-gray-300 truncate">🤖 AI Generated</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {videos.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    Videos ({videos.length})
                  </p>
                  <div className="space-y-2">
                    {videos.map((video, i) => (
                      <div
                        key={`vid-${i}`}
                        className="flex items-center gap-3 p-2 rounded-lg border border-white/[0.06] bg-black/10 hover:bg-white/[0.02] transition-colors group"
                      >
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-24 h-14 object-cover rounded flex-shrink-0"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-24 h-14 bg-white/5 rounded flex-shrink-0 flex items-center justify-center">
                            <span className="text-gray-600 text-lg">🎬</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white truncate">{video.title}</p>
                          <p className="text-[10px] text-gray-500 font-mono truncate">
                            {video.source === 'source_article' ? '📎 From source article' : '🔍 YouTube'}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {video.url && (
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 text-[10px] font-medium rounded bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
                            >
                              Open
                            </a>
                          )}
                          {video.embedUrl && (
                            <button
                              type="button"
                              onClick={() => onEmbedVideo(video.embedUrl, video.title)}
                              className="px-2 py-1 text-[10px] font-medium rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            >
                              Embed
                            </button>
                          )}
                          {video.thumbnailUrl && (
                            <button
                              type="button"
                              onClick={() => onUseCover(video.thumbnailUrl)}
                              className="px-2 py-1 text-[10px] font-medium rounded bg-white/10 text-gray-300 hover:bg-white/20 transition-colors"
                            >
                              Cover
                            </button>
                          )}
                        </div>
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
  );
}

// ======================== MAIN PAGE ========================

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { supabase } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Track whether user has edited a published article
  const [hasEdits, setHasEdits] = useState(false);
  const [initialStatus, setInitialStatus] = useState<ArticleStatus>('draft');
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  // Core fields
  const [brand, setBrand] = useState<Brand>('saucewire');
  const [contentTypeId, setContentTypeId] = useState('article');
  const [status, setStatus] = useState<ArticleStatus>('draft');

  // Form data (common + metadata)
  const [formData, setFormData] = useState<Record<string, any>>({
    title: '',
    body: '',
    excerpt: '',
    cover_image: '',
    tags: '',
    is_breaking: false,
  });

  // Snapshot of initial form data for dirty detection
  const [initialFormSnapshot, setInitialFormSnapshot] = useState('');

  const articleId = params.id as string;

  // Derived
  const brandConfig = getBrandFormConfig(brand);
  const contentType = brandConfig.contentTypes.find(ct => ct.id === contentTypeId) || brandConfig.contentTypes[0];
  const fieldGroups = useMemo(() => getFieldGroups(contentType.fields), [contentType]);
  const slug = slugify(formData.title || '');

  const statusInfo = STATUS_BADGE[status] || STATUS_BADGE.draft;

  // Fetch article on mount
  useEffect(() => {
    async function fetchArticle() {
      try {
        const article = await getArticleById(supabase, articleId);
        if (!article) {
          setError('Article not found');
          setLoading(false);
          return;
        }

        setBrand(article.brand);
        setStatus(article.status);
        setInitialStatus(article.status);
        setPublishedAt(article.published_at || null);

        const metadata = (article.metadata || {}) as Record<string, any>;
        if (metadata.content_type) {
          setContentTypeId(metadata.content_type as string);
        }

        const data = {
          title: article.title || '',
          body: article.body || '',
          excerpt: article.excerpt || '',
          cover_image: article.cover_image || '',
          tags: (article.tags || []).join(', '),
          is_breaking: article.is_breaking || false,
          category: article.category || '',
          source_url: article.source_url || '',
          ...metadata,
        };
        setFormData(data);
        setInitialFormSnapshot(JSON.stringify(data));
      } catch (err: any) {
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [supabase, articleId]);

  // Dirty detection: mark hasEdits when form changes from initial snapshot
  useEffect(() => {
    if (!initialFormSnapshot) return;
    const currentSnapshot = JSON.stringify(formData);
    setHasEdits(currentSnapshot !== initialFormSnapshot);
  }, [formData, initialFormSnapshot]);

  const handleBrandChange = (newBrand: Brand) => {
    setBrand(newBrand);
    const newConfig = getBrandFormConfig(newBrand);
    setContentTypeId(newConfig.contentTypes[0].id);
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const COMMON_KEYS = ['title', 'body', 'excerpt', 'cover_image', 'tags', 'is_breaking', 'source_url'];

  // ======================== BUILD PATCH PAYLOAD ========================

  const buildPayload = useCallback(() => {
    const category = formData.category || contentType.label;

    const metadata: Record<string, any> = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!COMMON_KEYS.includes(key) && key !== 'category' && value !== '' && value !== undefined && value !== false) {
        metadata[key] = value;
      }
    }
    metadata.content_type = contentTypeId;

    const tags = (formData.tags || '')
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);

    return {
      title: formData.title,
      slug,
      body: formData.body,
      excerpt: formData.excerpt || null,
      cover_image: formData.cover_image || null,
      brand,
      category: category || brandConfig.contentTypes[0].label,
      tags,
      is_breaking: formData.is_breaking || false,
      source_url: formData.source_url || null,
      reading_time_minutes: estimateReadingTime(formData.body),
      metadata,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, brand, contentTypeId, slug]);

  // ======================== ACTION: SAVE ========================

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!formData.title || !formData.body) {
        throw new Error('Title and body are required');
      }

      const payload = { ...buildPayload(), status };

      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save article');
      }

      // Reset dirty tracking
      setInitialFormSnapshot(JSON.stringify(formData));
      setHasEdits(false);
      setSuccessMsg('Changes saved');
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  // ======================== ACTION: PUBLISH ========================

  const handlePublish = async () => {
    setError('');
    setSaving(true);

    try {
      // Save current edits first, then publish
      const payload = {
        ...buildPayload(),
        status: 'published' as ArticleStatus,
        published_at: new Date().toISOString(),
      };

      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to publish');
      }

      // Also trigger the publish pipeline (TTS, newsletter, social, etc.)
      fetch(`/api/articles/${articleId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }).catch(() => {});

      setStatus('published');
      setInitialStatus('published');
      setPublishedAt(new Date().toISOString());
      setInitialFormSnapshot(JSON.stringify(formData));
      setHasEdits(false);
      setSuccessMsg('Article published! 🚀');
    } catch (err: any) {
      setError(err.message || 'Failed to publish');
    } finally {
      setSaving(false);
    }
  };

  // ======================== ACTION: UNPUBLISH ========================

  const handleUnpublish = async () => {
    setError('');
    setSaving(true);

    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'draft',
          published_at: null,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to unpublish');
      }

      setStatus('draft');
      setInitialStatus('draft');
      setPublishedAt(null);
      setSuccessMsg('Article unpublished — moved to Draft');
    } catch (err: any) {
      setError(err.message || 'Failed to unpublish');
    } finally {
      setSaving(false);
    }
  };

  // ======================== ACTION: REPUBLISH ========================

  const handleRepublish = async () => {
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...buildPayload(),
        status: 'published' as ArticleStatus,
        published_at: new Date().toISOString(),
      };

      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to republish');
      }

      setPublishedAt(new Date().toISOString());
      setInitialFormSnapshot(JSON.stringify(formData));
      setHasEdits(false);
      setSuccessMsg('Article republished with updates! 🔄');
    } catch (err: any) {
      setError(err.message || 'Failed to republish');
    } finally {
      setSaving(false);
    }
  };

  // ======================== ACTION: DELETE ========================

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete article');
      }

      router.push('/dashboard/content');
    } catch (err: any) {
      setError(err.message || 'Failed to delete article');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  // ======================== FIELD RENDERER ========================

  const renderField = (field: BrandField) => {
    if (field.key === 'title' || field.key === 'body' || field.key === 'excerpt' || field.key === 'cover_image' || field.key === 'tags') return null;

    const value = formData[field.key] ?? '';

    switch (field.type) {
      case 'text':
      case 'url':
        return (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <input
              type={field.type === 'url' ? 'url' : 'text'}
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="admin-input text-sm"
              required={field.required}
            />
            {field.helpText && <p className="text-[10px] text-gray-600 mt-0.5">{field.helpText}</p>}
          </div>
        );

      case 'textarea':
        return null;

      case 'number':
        return (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => updateField(field.key, e.target.value ? Number(e.target.value) : '')}
              placeholder={field.placeholder}
              className="admin-input text-sm"
              min={field.min}
              max={field.max}
              required={field.required}
            />
            {field.helpText && <p className="text-[10px] text-gray-600 mt-0.5">{field.helpText}</p>}
          </div>
        );

      case 'select':
        return (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              {field.label} {field.required && <span className="text-red-400">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              className="admin-input text-sm"
              required={field.required}
            >
              <option value="">Select...</option>
              {field.options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {field.helpText && <p className="text-[10px] text-gray-600 mt-0.5">{field.helpText}</p>}
          </div>
        );

      case 'toggle':
        return (
          <div key={field.key} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => updateField(field.key, !value)}
              className={`relative w-10 h-5 rounded-full transition-colors ${value ? 'bg-blue-500' : 'bg-gray-700'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <div>
              <span className="text-xs font-medium text-gray-300">{field.label}</span>
              {field.helpText && <p className="text-[10px] text-gray-600">{field.helpText}</p>}
            </div>
          </div>
        );

      case 'tags':
        if (field.key === 'tags') return null;
        return (
          <div key={field.key}>
            <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="admin-input text-sm"
            />
            {field.helpText && <p className="text-[10px] text-gray-600 mt-0.5">{field.helpText}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const parsedTags = (formData.tags || '').split(',').map((t: string) => t.trim()).filter(Boolean);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ======================== DETERMINE VISIBLE ACTIONS ========================

  const isPublished = status === 'published';
  const showRepublish = isPublished && hasEdits;

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)]">
      {/* Left: Form */}
      <div className={`${showPreview ? 'w-1/2' : 'w-full'} overflow-y-auto pr-2 space-y-5`}>

        {/* ========== HEADER ========== */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Edit Article</h1>
              {/* Status badge */}
              <span className={`inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md border ${statusInfo.bg} ${statusInfo.color}`}>
                <span>{statusInfo.icon}</span>
                {statusInfo.label}
              </span>
              {hasEdits && (
                <span className="text-xs text-amber-400 font-mono px-2 py-0.5 bg-amber-400/10 rounded border border-amber-400/20">
                  • unsaved changes
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className={`admin-btn-ghost text-xs flex items-center gap-1.5 ${showPreview ? 'text-blue-400' : ''}`}
              >
                {showPreview ? '👁️ Hide Preview' : '👁️ Show Preview'}
              </button>
              <button onClick={() => router.back()} className="admin-btn-ghost text-xs">← Back</button>
            </div>
          </div>

          {/* Subtitle with published date */}
          <p className="text-sm text-gray-500">
            {brandConfig.icon} {brandConfig.name} — {formData.title || 'Untitled'}
            {publishedAt && (
              <span className="ml-2 text-gray-600">
                · Published {new Date(publishedAt).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: 'numeric', minute: '2-digit',
                })}
              </span>
            )}
          </p>
        </motion.div>

        {/* ========== ACTION BAR ========== */}
        <div className="glass-panel p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Save — always available */}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={saving}
              className="admin-btn-primary text-xs flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              Save Changes
            </button>

            {/* Publish — only when NOT published */}
            {!isPublished && (
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Publish
              </button>
            )}

            {/* Republish — published + has edits */}
            {showRepublish && (
              <button
                type="button"
                onClick={handleRepublish}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Republish
              </button>
            )}

            {/* Unpublish — only when published */}
            {isPublished && (
              <button
                type="button"
                onClick={handleUnpublish}
                disabled={saving}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                Unpublish
              </button>
            )}
          </div>

          {/* Delete — always available */}
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            disabled={saving}
            className="admin-btn-ghost text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1.5 disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>

        {/* ========== FORM ========== */}
        <form onSubmit={handleSave} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Brand + Content Type */}
          <div className="glass-panel p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Brand</label>
                <div className="flex gap-1.5 flex-wrap">
                  {ALL_BRANDS.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => handleBrandChange(b.id)}
                      className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center gap-1.5 ${
                        brand === b.id ? 'bg-white/15 text-white ring-1' : 'text-gray-500 hover:text-white hover:bg-white/5'
                      }`}
                      style={brand === b.id ? { borderColor: b.color, borderWidth: '1px' } : {}}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {brandConfig.contentTypes.length > 1 && (
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Content Type</label>
                  <div className="flex gap-1.5 flex-wrap">
                    {brandConfig.contentTypes.map(ct => (
                      <button
                        key={ct.id}
                        type="button"
                        onClick={() => setContentTypeId(ct.id)}
                        className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                          contentTypeId === ct.id ? 'bg-white/15 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {ct.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1">{contentType.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Title + Body */}
          <div className="glass-panel p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Enter article title..."
                className="admin-input text-lg font-semibold"
                required
              />
              {formData.title && (
                <p className="text-[10px] text-gray-600 mt-1 font-mono">Slug: {slug}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => updateField('excerpt', e.target.value)}
                placeholder="Brief summary of the article..."
                rows={2}
                className="admin-input text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Body <span className="text-red-400">*</span>
                {formData.body && (
                  <span className="text-gray-600 font-normal ml-2">~{estimateReadingTime(formData.body)} min read</span>
                )}
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => updateField('body', e.target.value)}
                placeholder="Write your article content... (supports HTML)"
                rows={12}
                className="admin-input text-sm resize-y font-mono"
                required
              />
            </div>
          </div>

          {/* Brand-specific fields */}
          {Array.from(fieldGroups.entries()).map(([groupKey, fields]) => {
            if (groupKey === 'content') return null;
            const renderedFields = fields.map(renderField).filter(Boolean);
            if (renderedFields.length === 0) return null;

            return (
              <div key={groupKey} className="glass-panel p-5 space-y-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {GROUP_LABELS[groupKey] || groupKey}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {renderedFields}
                </div>
              </div>
            );
          })}

          {/* Cover Image + Tags */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Media & Tags</h3>
            <ImageUpload
              label="Cover Image"
              value={formData.cover_image}
              onChange={(url) => updateField('cover_image', url)}
              folder={`content/${brand}`}
            />
            {formData.cover_image && (
              <button
                type="button"
                onClick={() => updateField('cover_image', '')}
                className="mt-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                No Cover Image
              </button>
            )}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                placeholder="hip-hop, music, breaking-news"
                className="admin-input text-sm"
              />
            </div>
          </div>

          {/* Media Options Panel — shows enrichment results from AI generation */}
          <MediaOptionsPanel
            mediaOptions={formData.media_options}
            onUseCover={(url) => updateField('cover_image', url)}
            onEmbedVideo={(embedUrl, title) => {
              const iframe = `\n\n<div class="video-embed"><iframe src="${embedUrl}" title="${title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:8px;"></iframe></div>\n\n`;
              updateField('body', (formData.body || '') + iframe);
              setSuccessMsg('Video embedded in article body');
            }}
          />

          {/* Category */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Publishing</h3>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
              <select
                value={formData.category || ''}
                onChange={(e) => updateField('category', e.target.value)}
                className="admin-input text-sm"
              >
                <option value="">Auto ({contentType.label})</option>
                {brandConfig.contentTypes[0].fields
                  .find(f => f.key === 'category')
                  ?.options?.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  )) || (
                  <>
                    {['Music', 'Fashion', 'Entertainment', 'Sports', 'Tech', 'Culture', 'Art', 'Lifestyle'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Bottom action bar (duplicate for long forms) */}
          <div className="glass-panel p-4 flex items-center justify-between">
            <button type="button" onClick={() => router.back()} className="admin-btn-ghost text-xs">← Back to Queue</button>
            <div className="flex items-center gap-2">
              {!isPublished && (
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={saving}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  🚀 Publish
                </button>
              )}
              {showRepublish && (
                <button
                  type="button"
                  onClick={handleRepublish}
                  disabled={saving}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  🔄 Republish
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="admin-btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* ========== RIGHT: LIVE PREVIEW ========== */}
      {showPreview && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-1/2 glass-panel overflow-hidden flex flex-col sticky top-0"
        >
          <LivePreview
            brand={brand}
            title={formData.title}
            excerpt={formData.excerpt}
            body={formData.body}
            coverImage={formData.cover_image}
            category={formData.category || contentType.label}
            tags={parsedTags}
            metadata={formData}
            contentType={contentTypeId}
          />
        </motion.div>
      )}

      {/* ========== MODALS & TOASTS ========== */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmModal
            title={formData.title || 'Untitled'}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteModal(false)}
            deleting={deleting}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {successMsg && (
          <SuccessToast message={successMsg} onDone={() => setSuccessMsg('')} />
        )}
      </AnimatePresence>
    </div>
  );
}
