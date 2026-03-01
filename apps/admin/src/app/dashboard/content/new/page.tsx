'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { createArticle } from '@media-network/shared';
import { slugify, estimateReadingTime, BRAND_CONFIGS } from '@media-network/shared';
import type { Brand, ArticleStatus } from '@media-network/shared';

const BRANDS = Object.entries(BRAND_CONFIGS).map(([id, config]) => ({
  id: id as Brand,
  name: config.name,
  categories: config.categories,
  color: config.colors.primary,
}));

export default function NewArticlePage() {
  const router = useRouter();
  const { supabase, user } = useAuth();
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

  const selectedBrand = BRANDS.find((b) => b.id === brand);
  const slug = slugify(title);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!title || !body || !category) {
        throw new Error('Title, body, and category are required');
      }

      const article = await createArticle(supabase, {
        title,
        slug,
        body,
        excerpt: excerpt || null,
        cover_image: coverImage || null,
        brand,
        category,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        author_id: user?.id || null,
        status,
        is_breaking: isBreaking,
        is_ai_generated: false,
        source_url: null,
        reading_time_minutes: estimateReadingTime(body),
        published_at: status === 'published' ? new Date().toISOString() : null,
      });

      router.push('/dashboard/content');
    } catch (err: any) {
      setError(err.message || 'Failed to create article');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">New Article</h1>
          <p className="text-sm text-gray-500 mt-1">Create a new article for any brand</p>
        </div>
        <button
          onClick={() => router.back()}
          className="admin-btn-ghost text-sm"
        >
          ← Back
        </button>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Title */}
        <div className="glass-panel p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter article title..."
              className="admin-input text-lg font-semibold"
              required
            />
            {title && (
              <p className="text-xs text-gray-600 mt-1 font-mono">
                Slug: {slug}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the article..."
              rows={2}
              className="admin-input text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Body
              {body && (
                <span className="text-gray-600 font-normal ml-2">
                  ~{estimateReadingTime(body)} min read
                </span>
              )}
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your article content here... (supports HTML)"
              rows={16}
              className="admin-input text-sm resize-y font-mono"
              required
            />
          </div>
        </div>

        {/* Metadata */}
        <div className="glass-panel p-6 space-y-5">
          <h3 className="text-sm font-semibold text-white">Metadata</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Brand</label>
              <select
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value as Brand);
                  setCategory('');
                }}
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
                <option value="">Select category...</option>
                {selectedBrand?.categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Tags <span className="text-gray-600 font-normal">(comma-separated)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="hip-hop, music, breaking-news"
              className="admin-input text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Cover Image URL</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="admin-input text-sm"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-300">🔴 Breaking News</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="glass-panel p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Save as:</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ArticleStatus)}
              className="admin-input text-sm w-auto"
            >
              <option value="draft">Draft</option>
              <option value="pending_review">Pending Review</option>
              <option value="published">Published (immediate)</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="admin-btn-ghost"
            >
              Cancel
            </button>
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
              ) : status === 'published' ? (
                '🚀 Publish'
              ) : (
                '💾 Save Article'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
