'use client';

import React, { useState, useEffect } from 'react';

const GENRES = ['Trap', 'Hip-Hop', 'R&B', 'Pop', 'Drill', 'Afrobeats', 'Lo-Fi', 'Boom Bap', 'EDM', 'House', 'Dancehall', 'Reggaeton'];
const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface BeatFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  saving: boolean;
}

export function BeatForm({ initialData, onSubmit, saving }: BeatFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [coverImage, setCoverImage] = useState(initialData?.cover_image_url || '');
  const [audioUrl, setAudioUrl] = useState(initialData?.audio_url || '');
  const [producerId, setProducerId] = useState(initialData?.producer_id || '');
  const [bpm, setBpm] = useState(initialData?.bpm || '');
  const [key, setKey] = useState(initialData?.key || '');
  const [genre, setGenre] = useState(initialData?.genre || '');
  const [tags, setTags] = useState((initialData?.tags || []).join(', '));
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [isFeatured, setIsFeatured] = useState(initialData?.is_featured || false);
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [producers, setProducers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/producers').then((r) => r.json()).then((d) => setProducers(d.data || [])).catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      slug: slug || slugify(title),
      cover_image_url: coverImage || null,
      audio_url: audioUrl || null,
      producer_id: producerId || null,
      bpm: bpm ? parseInt(bpm) : null,
      key: key || null,
      genre,
      tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      duration: duration || null,
      is_featured: isFeatured,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Beat Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Title <span className="text-red-400">*</span></label>
            <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); if (!initialData) setSlug(slugify(e.target.value)); }} className="admin-input text-sm" required />
            {title && <p className="text-[10px] text-gray-600 mt-0.5 font-mono">Slug: {slug || slugify(title)}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Producer</label>
            <select value={producerId} onChange={(e) => setProducerId(e.target.value)} className="admin-input text-sm">
              <option value="">Select Producer...</option>
              {producers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Cover Image URL</label>
            <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="admin-input text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Audio URL</label>
            <input type="url" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} className="admin-input text-sm" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">BPM</label>
            <input type="number" value={bpm} onChange={(e) => setBpm(e.target.value)} min={60} max={300} className="admin-input text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Key</label>
            <select value={key} onChange={(e) => setKey(e.target.value)} className="admin-input text-sm">
              <option value="">Select...</option>
              {KEYS.map((k) => (
                <React.Fragment key={k}>
                  <option value={`${k} Major`}>{k} Major</option>
                  <option value={`${k} Minor`}>{k} Minor</option>
                </React.Fragment>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Genre</label>
            <select value={genre} onChange={(e) => setGenre(e.target.value)} className="admin-input text-sm">
              <option value="">Select...</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Duration</label>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="3:30" className="admin-input text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Tags (comma-separated)</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="dark, hard, aggressive" className="admin-input text-sm" />
        </div>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-3 pt-5">
            <button type="button" onClick={() => setIsFeatured(!isFeatured)} className={`relative w-10 h-5 rounded-full transition-colors ${isFeatured ? 'bg-yellow-500' : 'bg-gray-700'}`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isFeatured ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs font-medium text-gray-300">⭐ Featured Beat</span>
          </div>
        </div>
      </div>

      <div className="glass-panel p-4 flex items-center justify-end gap-3">
        <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : initialData ? '💾 Update Beat' : '💾 Create Beat'}
        </button>
      </div>
    </form>
  );
}
