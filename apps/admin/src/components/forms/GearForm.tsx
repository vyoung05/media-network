'use client';

import React, { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/ImageUpload';

const GEAR_CATEGORIES = ['Controllers', 'Monitors', 'Headphones', 'Microphones', 'Audio Interfaces', 'MIDI Controllers', 'Drum Machines', 'Synthesizers', 'Software', 'Accessories'];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

interface GearFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  saving: boolean;
}

export function GearForm({ initialData, onSubmit, saving }: GearFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [product, setProduct] = useState(initialData?.product || '');
  const [brandName, setBrandName] = useState(initialData?.brand_name || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [rating, setRating] = useState(initialData?.rating || 3);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [body, setBody] = useState(initialData?.body || '');
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || '');
  const [pros, setPros] = useState<string[]>(initialData?.pros || []);
  const [cons, setCons] = useState<string[]>(initialData?.cons || []);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const [verdict, setVerdict] = useState(initialData?.verdict || '');
  const [affiliateUrl, setAffiliateUrl] = useState(initialData?.affiliate_url || '');
  const [producerId, setProducerId] = useState(initialData?.producer_id || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [producers, setProducers] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/producers').then((r) => r.json()).then((d) => setProducers(d.data || [])).catch(() => {});
  }, []);

  const addPro = () => { if (newPro.trim()) { setPros([...pros, newPro.trim()]); setNewPro(''); } };
  const addCon = () => { if (newCon.trim()) { setCons([...cons, newCon.trim()]); setNewCon(''); } };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      slug: slug || slugify(title),
      product,
      brand_name: brandName,
      category,
      price: price ? parseFloat(price) : null,
      rating,
      excerpt,
      body,
      cover_image: coverImage || null,
      pros,
      cons,
      verdict,
      affiliate_url: affiliateUrl || null,
      producer_id: producerId || null,
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Review Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Title <span className="text-red-400">*</span></label>
            <input type="text" value={title} onChange={(e) => { setTitle(e.target.value); if (!initialData) setSlug(slugify(e.target.value)); }} className="admin-input text-sm" required />
            {title && <p className="text-[10px] text-gray-600 mt-0.5 font-mono">Slug: {slug || slugify(title)}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Product Name</label>
            <input type="text" value={product} onChange={(e) => setProduct(e.target.value)} className="admin-input text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Brand</label>
            <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="admin-input text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input text-sm">
              <option value="">Select...</option>
              {GEAR_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Price ($)</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min={0} step="0.01" className="admin-input text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Rating (1-5)</label>
          <div className="flex items-center gap-2">
            <input type="range" min={1} max={5} value={rating} onChange={(e) => setRating(parseInt(e.target.value))} className="flex-1 accent-yellow-500" />
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={`text-lg ${s <= rating ? 'text-yellow-400' : 'text-gray-700'}`}>★</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Content</h3>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Excerpt</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="admin-input text-sm resize-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Body</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="admin-input text-sm resize-y font-mono" />
        </div>
        <ImageUpload
          label="Cover Image"
          value={coverImage}
          onChange={(url) => setCoverImage(url)}
          folder="gear/covers"
        />
      </div>

      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pros & Cons</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-green-400 mb-2">✅ Pros</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newPro} onChange={(e) => setNewPro(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())} className="admin-input text-sm flex-1" placeholder="Add a pro..." />
              <button type="button" onClick={addPro} className="admin-btn-primary text-xs px-3">+</button>
            </div>
            <div className="space-y-1">
              {pros.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-300 bg-green-500/5 px-3 py-1.5 rounded">
                  <span className="flex-1">{p}</span>
                  <button type="button" onClick={() => setPros(pros.filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400">×</button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-red-400 mb-2">❌ Cons</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={newCon} onChange={(e) => setNewCon(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())} className="admin-input text-sm flex-1" placeholder="Add a con..." />
              <button type="button" onClick={addCon} className="admin-btn-primary text-xs px-3">+</button>
            </div>
            <div className="space-y-1">
              {cons.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-300 bg-red-500/5 px-3 py-1.5 rounded">
                  <span className="flex-1">{c}</span>
                  <button type="button" onClick={() => setCons(cons.filter((_, j) => j !== i))} className="text-gray-500 hover:text-red-400">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Verdict</label>
          <textarea value={verdict} onChange={(e) => setVerdict(e.target.value)} rows={3} className="admin-input text-sm resize-none" />
        </div>
      </div>

      <div className="glass-panel p-5 space-y-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Publishing</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Affiliate URL</label>
            <input type="url" value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} className="admin-input text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Author/Producer</label>
            <select value={producerId} onChange={(e) => setProducerId(e.target.value)} className="admin-input text-sm">
              <option value="">Select...</option>
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
      </div>

      <div className="glass-panel p-4 flex items-center justify-end gap-3">
        <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2 disabled:opacity-50">
          {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : initialData ? '💾 Update Review' : '💾 Create Review'}
        </button>
      </div>
    </form>
  );
}
