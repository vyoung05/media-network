'use client';

import React, { useState, useEffect } from 'react';

const DAWS = ['FL Studio', 'Ableton Live', 'Logic Pro', 'Pro Tools', 'Studio One', 'Reason', 'Cubase', 'Reaper'];
const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced'];
const CATEGORIES = ['Beat Making', 'Mixing', 'Mastering', 'Sound Design', 'Sampling', 'Arrangement', 'Vocal Production', 'Music Theory'];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface TutorialFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  saving: boolean;
}

export function TutorialForm({ initialData, onSubmit, saving }: TutorialFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || '');
  const [daw, setDaw] = useState(initialData?.daw || '');
  const [skillLevel, setSkillLevel] = useState(initialData?.skill_level || 'beginner');
  const [category, setCategory] = useState(initialData?.category || '');
  const [duration, setDuration] = useState(initialData?.duration || '');
  const [producerId, setProducerId] = useState(initialData?.producer_id || '');
  const [tags, setTags] = useState((initialData?.tags || []).join(', '));
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [producers, setProducers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/producers').then((r) => r.json()).then((d) => setProducers(d.data || [])).catch(() => {});
  }, []);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) setSlug(slugify(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      slug: slug || slugify(title),
      excerpt,
      body,
      cover_image: coverImage || null,
      daw,
      skill_level: skillLevel,
      category,
      duration: duration || null,
      producer_id: producerId || null,
      tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Title <span className="text-red-400">*</span></label>
            <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} className="admin-input text-sm" required />
            {title && <p className="text-[10px] text-gray-600 mt-0.5 font-mono">Slug: {slug || slugify(title)}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Cover Image URL</label>
            <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="admin-input text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Excerpt</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="admin-input text-sm resize-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Body <span className="text-red-400">*</span></label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="admin-input text-sm resize-y font-mono" required />
        </div>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">DAW</label>
            <select value={daw} onChange={(e) => setDaw(e.target.value)} className="admin-input text-sm">
              <option value="">Select DAW...</option>
              {DAWS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Skill Level</label>
            <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} className="admin-input text-sm">
              {SKILL_LEVELS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input text-sm">
              <option value="">Select...</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Duration</label>
            <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g. 12:30" className="admin-input text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Producer</label>
            <select value={producerId} onChange={(e) => setProducerId(e.target.value)} className="admin-input text-sm">
              <option value="">Select Producer...</option>
              {producers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="admin-input text-sm">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Tags (comma-separated)</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="mixing, eq, compression" className="admin-input text-sm" />
        </div>
      </div>

      <div className="glass-panel p-4 flex items-center justify-end gap-3">
        <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
          ) : initialData ? '💾 Update Tutorial' : '💾 Create Tutorial'}
        </button>
      </div>
    </form>
  );
}
