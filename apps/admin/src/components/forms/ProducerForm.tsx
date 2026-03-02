'use client';

import React, { useState } from 'react';

const DAWS = ['FL Studio', 'Ableton Live', 'Logic Pro', 'Pro Tools', 'Studio One', 'Reason', 'Cubase', 'Reaper', 'GarageBand', 'Bitwig'];
const GENRES = ['Trap', 'Hip-Hop', 'R&B', 'Pop', 'Drill', 'Afrobeats', 'Lo-Fi', 'Boom Bap', 'EDM', 'House', 'Dancehall', 'Reggaeton', 'Soul', 'Jazz', 'Rock', 'Alternative'];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface ProducerFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  saving: boolean;
}

export function ProducerForm({ initialData, onSubmit, saving }: ProducerFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [avatarUrl, setAvatarUrl] = useState(initialData?.avatar || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image || '');
  const [daws, setDaws] = useState<string[]>(initialData?.daws || []);
  const [genres, setGenres] = useState<string[]>(initialData?.genres || []);
  const [credits, setCredits] = useState<string[]>(initialData?.credits || []);
  const [newCredit, setNewCredit] = useState('');
  const [links, setLinks] = useState<Record<string, string>>(initialData?.links || {});
  const [beatCount, setBeatCount] = useState(initialData?.beat_count || 0);
  const [followerCount, setFollowerCount] = useState(initialData?.follower_count || 0);
  const [isFeatured, setIsFeatured] = useState(initialData?.featured || false);
  const [status, setStatus] = useState(initialData?.status || 'draft');

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) setSlug(slugify(val));
  };

  const toggleMulti = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const addCredit = () => {
    if (newCredit.trim() && !credits.includes(newCredit.trim())) {
      setCredits([...credits, newCredit.trim()]);
      setNewCredit('');
    }
  };

  const updateLink = (key: string, val: string) => {
    setLinks({ ...links, [key]: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      slug: slug || slugify(name),
      bio,
      location,
      avatar: avatarUrl || null,
      cover_image: coverImageUrl || null,
      daws,
      genres,
      credits,
      links,
      beat_count: beatCount,
      follower_count: followerCount,
      featured: isFeatured,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Basic Info */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Basic Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Name <span className="text-red-400">*</span></label>
            <input type="text" value={name} onChange={(e) => handleNameChange(e.target.value)} className="admin-input text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="admin-input text-sm font-mono" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Bio</label>
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="admin-input text-sm resize-y" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Atlanta, GA" className="admin-input text-sm" />
        </div>
      </div>

      {/* Images */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Images</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Avatar URL</label>
            <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="admin-input text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Cover Image URL</label>
            <input type="url" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className="admin-input text-sm" />
          </div>
        </div>
      </div>

      {/* DAWs & Genres */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">DAWs & Genres</h3>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">DAWs</label>
          <div className="flex flex-wrap gap-2">
            {DAWS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => toggleMulti(daws, setDaws, d)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  daws.includes(d) ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30' : 'bg-white/5 text-gray-500 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleMulti(genres, setGenres, g)}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  genres.includes(g) ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/30' : 'bg-white/5 text-gray-500 hover:text-white'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Credits */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Credits</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCredit}
            onChange={(e) => setNewCredit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCredit())}
            placeholder="Add a credit..."
            className="admin-input text-sm flex-1"
          />
          <button type="button" onClick={addCredit} className="admin-btn-primary text-xs px-4">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {credits.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-white/5 text-gray-300 rounded-full">
              {c}
              <button type="button" onClick={() => setCredits(credits.filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Links</h3>
        <div className="grid grid-cols-2 gap-3">
          {['website', 'instagram', 'twitter', 'youtube', 'soundcloud', 'spotify', 'beatstars'].map((key) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-400 mb-1 capitalize">{key}</label>
              <input type="url" value={links[key] || ''} onChange={(e) => updateLink(key, e.target.value)} className="admin-input text-sm" placeholder={`https://...`} />
            </div>
          ))}
        </div>
      </div>

      {/* Stats & Status */}
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Stats & Status</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Beat Count</label>
            <input type="number" value={beatCount} onChange={(e) => setBeatCount(parseInt(e.target.value) || 0)} className="admin-input text-sm" min={0} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Follower Count</label>
            <input type="number" value={followerCount} onChange={(e) => setFollowerCount(parseInt(e.target.value) || 0)} className="admin-input text-sm" min={0} />
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsFeatured(!isFeatured)}
            className={`relative w-10 h-5 rounded-full transition-colors ${isFeatured ? 'bg-yellow-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${isFeatured ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <span className="text-xs font-medium text-gray-300">⭐ Featured Producer</span>
        </div>
      </div>

      {/* Submit */}
      <div className="glass-panel p-4 flex items-center justify-end gap-3">
        <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : initialData ? '💾 Update Producer' : '💾 Create Producer'}
        </button>
      </div>
    </form>
  );
}
