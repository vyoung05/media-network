'use client';

import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';

const GENRES = ['Trap', 'Hip-Hop', 'R&B', 'Pop', 'Drill', 'Afrobeats', 'Lo-Fi', 'Boom Bap', 'EDM', 'House', 'Dancehall', 'Reggaeton', 'Soul', 'Jazz'];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface SamplePackFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  saving: boolean;
}

export function SamplePackForm({ initialData, onSubmit, saving }: SamplePackFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [creator, setCreator] = useState(initialData?.creator || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [isFree, setIsFree] = useState(initialData?.is_free || false);
  const [sampleCount, setSampleCount] = useState(initialData?.sample_count || 0);
  const [genres, setGenres] = useState<string[]>(initialData?.genres || []);
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || '');
  const [rating, setRating] = useState(initialData?.rating || 0);
  const [status, setStatus] = useState(initialData?.status || 'draft');

  const toggleGenre = (g: string) => {
    setGenres(genres.includes(g) ? genres.filter((v) => v !== g) : [...genres, g]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      slug: slug || slugify(title),
      creator,
      price: isFree ? 0 : price ? parseFloat(price) : null,
      is_free: isFree,
      sample_count: sampleCount,
      genres,
      description,
      cover_image: coverImage || null,
      rating,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pack Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Title <span className="text-red-400">*</span></label>
            <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); if (!initialData) setSlug(slugify(e.target.value)); }} className="admin-input text-sm" required />
            {title && <p className="text-[10px] text-gray-600 mt-0.5 font-mono">Slug: {slug || slugify(title)}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Creator</label>
            <input type="text" value={creator} onChange={(e) => setCreator(e.target.value)} className="admin-input text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Price ($)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min={0} step="0.01" disabled={isFree} className="admin-input text-sm disabled:opacity-50" />
          </div>
          <div className="flex items-center gap-3 pt-5">
            <button type="button" onClick={() => setIsFree(!isFree)} className={`relative w-10 h-5 rounded-full transition-colors ${isFree ? 'bg-green-500' : 'bg-gray-700'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isFree ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs font-medium text-gray-300">Free Pack</span>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Sample Count</label>
            <input type="number" value={sampleCount} onChange={(e) => setSampleCount(parseInt(e.target.value) || 0)} min={0} className="admin-input text-sm" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</h3>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button key={g} type="button" onClick={() => toggleGenre(g)} className={`px-3 py-1.5 text-xs rounded-md transition-all ${genres.includes(g) ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="admin-input text-sm resize-y" />
        </div>
        <ImageUpload
          label="Cover Image"
          value={coverImage}
          onChange={(url) => setCoverImage(url)}
          folder="sample-packs/covers"
        />
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Rating (0-5)</label>
          <div className="flex items-center gap-2">
            <input type="range" min={0} max={5} value={rating} onChange={(e) => setRating(parseInt(e.target.value))} className="flex-1 accent-yellow-500" />
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-lg ${s <= rating ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input text-sm w-48">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="glass-panel p-4 flex items-center justify-end gap-3">
        <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : initialData ? '💾 Update Pack' : '💾 Create Pack'}
        </button>
      </div>
    </form>
  );
}
