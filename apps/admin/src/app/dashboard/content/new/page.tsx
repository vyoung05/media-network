'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useBrand } from '@/contexts/BrandContext';
import { LivePreview } from '@/components/LivePreview';
import {
  BRAND_FORM_CONFIGS,
  getBrandFormConfig,
  getFieldGroups,
  GROUP_LABELS,
  type BrandField,
} from '@/config/brand-fields';
import { slugify, estimateReadingTime } from '@media-network/shared';
import type { Brand, ArticleStatus } from '@media-network/shared';

const ALL_BRANDS = Object.values(BRAND_FORM_CONFIGS);

export default function NewArticlePage() {
  const router = useRouter();
  const { activeBrand } = useBrand();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(true);

  // Core fields
  const [brand, setBrand] = useState<Brand>(activeBrand === 'all' ? 'saucewire' : activeBrand);
  const [contentTypeId, setContentTypeId] = useState(BRAND_FORM_CONFIGS[brand].contentTypes[0].id);
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

  // Derived
  const brandConfig = getBrandFormConfig(brand);
  const contentType = brandConfig.contentTypes.find(ct => ct.id === contentTypeId) || brandConfig.contentTypes[0];
  const fieldGroups = useMemo(() => getFieldGroups(contentType.fields), [contentType]);
  const slug = slugify(formData.title || '');

  // When brand changes, reset content type and clear brand-specific fields
  const handleBrandChange = (newBrand: Brand) => {
    setBrand(newBrand);
    const newConfig = getBrandFormConfig(newBrand);
    setContentTypeId(newConfig.contentTypes[0].id);
    // Keep common fields, clear brand-specific
    setFormData(prev => ({
      title: prev.title,
      body: prev.body,
      excerpt: prev.excerpt,
      cover_image: prev.cover_image,
      tags: prev.tags,
      is_breaking: false,
    }));
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // Extract common fields vs metadata
  const COMMON_KEYS = ['title', 'body', 'excerpt', 'cover_image', 'tags', 'is_breaking', 'source_url'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (!formData.title || !formData.body) {
        throw new Error('Title and body are required');
      }

      const category = contentType.fields.find(f => f.key === 'category')
        ? formData.category
        : contentType.label;

      // Separate metadata from core fields
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

      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          slug,
          body: formData.body,
          excerpt: formData.excerpt || null,
          cover_image: formData.cover_image || null,
          brand,
          category: category || brandConfig.contentTypes[0].label,
          tags,
          status,
          is_breaking: formData.is_breaking || false,
          is_ai_generated: false,
          source_url: formData.source_url || null,
          reading_time_minutes: estimateReadingTime(formData.body),
          published_at: status === 'published' ? new Date().toISOString() : null,
          metadata,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to create article');
      }

      router.push('/dashboard/content');
    } catch (err: any) {
      setError(err.message || 'Failed to create article');
    } finally {
      setSaving(false);
    }
  };

  // Render a single field
  const renderField = (field: BrandField) => {
    // Skip common fields that are rendered separately
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
        return null; // Handled separately for body/excerpt

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
        if (field.key === 'tags') return null; // Handled in common fields
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

  return (
    <div className="flex gap-6 h-[calc(100vh-6rem)]">
      {/* Left: Form */}
      <div className={`${showPreview ? 'w-1/2' : 'w-full'} overflow-y-auto pr-2 space-y-5`}>
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">New Article</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {brandConfig.icon} {brandConfig.name} — {contentType.label}
            </p>
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
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {/* Brand + Content Type Selector */}
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

          {/* Title + Slug */}
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

          {/* Brand-specific fields by group */}
          {Array.from(fieldGroups.entries()).map(([groupKey, fields]) => {
            // Skip content group (already rendered above)
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

          {/* Common: Cover Image + Tags */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Media & Tags</h3>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={formData.cover_image}
                onChange={(e) => updateField('cover_image', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="admin-input text-sm"
              />
            </div>
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

          {/* Category (use first brand category or content type label) */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Publishing</h3>
            <div className="grid grid-cols-2 gap-3">
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
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">Save as</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                  className="admin-input text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="published">Published (immediate)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="glass-panel p-4 flex items-center justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="admin-btn-ghost">Cancel</button>
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
              ) : status === 'published' ? '🚀 Publish' : '💾 Save Article'}
            </button>
          </div>
        </form>
      </div>

      {/* Right: Live Preview */}
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
    </div>
  );
}
