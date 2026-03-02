'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { ImageUpload } from '@/components/ImageUpload';
import { getArticleById, updateArticle, updateArticleStatus } from '@media-network/shared';
import { slugify, estimateReadingTime, BRAND_CONFIGS } from '@media-network/shared';
import type { Article, Brand, ArticleStatus } from '@media-network/shared';

const BRANDS = Object.entries(BRAND_CONFIGS).map(([id, config]) => ({
  id: id as Brand,
  name: config.name,
  categories: config.categories,
  color: config.colors.primary,
}));

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const { supabase } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [brand, setBrand] = useState<Brand>('saucewire');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<ArticleStatus>('draft');
  const [isBreaking, setIsBreaking] = useState(false);

  const articleId = params.id as string;
  const selectedBrand = BRANDS.find((b) => b.id === brand);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const article = await getArticleById(supabase, articleId);
        if (!article) {
          setError('Article not found');
          return;
        }

        setTitle(article.title);
        setBody(article.body);
        setExcerpt(article.excerpt || '');
        setBrand(article.brand);
        setCategory(article.category);
        setTags(article.tags.join(', '));
        setCoverImage(article.cover_image || '');
        setStatus(article.status);
        setIsBreaking(article.is_breaking);
      } catch (err: any) {
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [supabase, articleId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await updateArticle(supabase, articleId, {
        title,
        slug: slugify(title),
        body,
        excerpt: excerpt || null,
        cover_image: coverImage || null,
        brand,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        status,
        is_breaking: isBreaking,
        reading_time_minutes: estimateReadingTime(body),
      });

      router.push('/dashboard/content');
    } catch (err: any) {
      setError(err.message || 'Failed to update article');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      await updateArticleStatus(supabase, articleId, 'published');
      router.push('/dashboard/content');
    } catch (err: any) {
      setError(err.message || 'Failed to publish');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Article</h1>
          <p className="text-sm text-gray-500 mt-1">Editing: {title || 'Untitled'}</p>
        </div>
        <div className="flex items-center gap-2">
          {status !== 'published' && (
            <button
              onClick={handlePublish}
              disabled={saving}
              className="admin-btn-success flex items-center gap-1.5 disabled:opacity-50"
            >
              🚀 Publish Now
            </button>
          )}
          <button onClick={() => router.back()} className="admin-btn-ghost text-sm">
            ← Back
          </button>
        </div>
      </motion.div>

      <form onSubmit={handleSave} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="glass-panel p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="admin-input text-lg font-semibold"
              required
            />
            {title && (
              <p className="text-xs text-gray-600 mt-1 font-mono">Slug: {slugify(title)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="admin-input text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Body
              {body && (
                <span className="text-gray-600 font-normal ml-2">~{estimateReadingTime(body)} min read</span>
              )}
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={16}
              className="admin-input text-sm resize-y font-mono"
              required
            />
          </div>
        </div>

        <div className="glass-panel p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white">Metadata</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Brand</label>
              <select
                value={brand}
                onChange={(e) => { setBrand(e.target.value as Brand); setCategory(''); }}
                className="admin-input text-sm"
              >
                {BRANDS.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="admin-input text-sm"
                required
              >
                <option value="">Select...</option>
                {selectedBrand?.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Tags (comma-separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="admin-input text-sm"
            />
          </div>

          <ImageUpload
            label="Cover Image"
            value={coverImage}
            onChange={(url) => setCoverImage(url)}
            folder={`content/${brand}`}
          />

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500"
            />
            <span className="text-sm text-gray-300">🔴 Breaking News</span>
          </label>
        </div>

        <div className="glass-panel p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Status:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ArticleStatus)}
              className="admin-input text-sm w-auto"
            >
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => router.back()} className="admin-btn-ghost">Cancel</button>
            <button type="submit" disabled={saving} className="admin-btn-primary disabled:opacity-50">
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
