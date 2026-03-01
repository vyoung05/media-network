'use client';

import React, { useState } from 'react';

const GENRES = ['Hip-Hop', 'R&B', 'Pop', 'Electronic', 'Alternative', 'Latin', 'Afrobeats', 'Neo-Soul', 'Indie', 'Trap', 'Drill', 'Rage'];
const MOODS = ['Chill', 'Hype', 'Emotional', 'Dark', 'Feel-Good', 'Experimental', 'Melodic', 'Aggressive', 'Dreamy', 'Late Night'];
const REGIONS = ['East Coast', 'West Coast', 'South', 'Midwest', 'UK', 'Toronto', 'Atlanta', 'Lagos', 'Paris', 'International'];
const TRENDS = ['rising', 'steady', 'new'];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface ArtistFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  saving?: boolean;
}

export function ArtistForm({ initialData, onSubmit, saving }: ArtistFormProps) {
  const artist = initialData;
  const [formData, setFormData] = useState({
    name: artist?.name || '',
    slug: artist?.slug || '',
    real_name: artist?.real_name || '',
    avatar: artist?.avatar || '',
    cover_image: artist?.cover_image || '',
    bio: artist?.bio || '',
    genre: artist?.genre || [],
    mood: artist?.mood || [],
    region: artist?.region || '',
    city: artist?.city || '',
    monthly_listeners: artist?.monthly_listeners || 0,
    followers: artist?.followers || 0,
    glow_score: artist?.glow_score || 50,
    glow_trend: artist?.glow_trend || 'new',
    is_featured: artist?.is_featured || false,
    is_daily_pick: artist?.is_daily_pick || false,
    featured_track: artist?.featured_track || '',
    featured_track_url: artist?.featured_track_url || '',
    tags: artist?.tags?.join(', ') || '',
    status: artist?.status || 'draft',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
    }));
    if (name === 'name' && !artist) {
      setFormData(prev => ({ ...prev, slug: slugify(value) }));
    }
  };

  const toggleArrayItem = (field: 'genre' | 'mood', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i: string) => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      tags: formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
    });
  };

  const inputClass = "w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/30 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 outline-none text-sm";
  const labelClass = "block text-sm font-medium text-white/70 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Artist Name *</label>
          <input name="name" value={formData.name} onChange={handleChange} className={inputClass} required />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input name="slug" value={formData.slug} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Real Name</label>
          <input name="real_name" value={formData.real_name} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>City</label>
          <input name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="e.g. Atlanta, GA" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Bio *</label>
        <textarea name="bio" value={formData.bio} onChange={handleChange} className={`${inputClass} min-h-[120px]`} required />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Avatar URL</label>
          <input name="avatar" value={formData.avatar} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Cover Image URL</label>
          <input name="cover_image" value={formData.cover_image} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Genres</label>
        <div className="flex flex-wrap gap-2">
          {GENRES.map(g => (
            <button key={g} type="button" onClick={() => toggleArrayItem('genre', g)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${formData.genre.includes(g) ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'}`}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>Moods</label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map(m => (
            <button key={m} type="button" onClick={() => toggleArrayItem('mood', m)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${formData.mood.includes(m) ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/20'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Region</label>
          <select name="region" value={formData.region} onChange={handleChange} className={inputClass}>
            <option value="">Select region...</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Glow Trend</label>
          <select name="glow_trend" value={formData.glow_trend} onChange={handleChange} className={inputClass}>
            {TRENDS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClass}>Glow Score (0-100)</label>
          <input name="glow_score" type="number" min="0" max="100" value={formData.glow_score} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Monthly Listeners</label>
          <input name="monthly_listeners" type="number" value={formData.monthly_listeners} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Followers</label>
          <input name="followers" type="number" value={formData.followers} onChange={handleChange} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Featured Track</label>
          <input name="featured_track" value={formData.featured_track} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tags (comma-separated)</label>
          <input name="tags" value={formData.tags} onChange={handleChange} className={inputClass} placeholder="e.g. neo-soul, rising, atlanta" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="rounded border-white/20 bg-black/30 text-cyan-500" />
          <span className="text-sm text-white/70">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="is_daily_pick" checked={formData.is_daily_pick} onChange={handleChange} className="rounded border-white/20 bg-black/30 text-cyan-500" />
          <span className="text-sm text-white/70">Daily Pick</span>
        </label>
      </div>

      <button type="submit" disabled={saving}
        className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
        {saving ? 'Saving...' : artist ? 'Update Artist' : 'Create Artist'}
      </button>
    </form>
  );
}
