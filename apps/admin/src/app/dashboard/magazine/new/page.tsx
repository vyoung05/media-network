'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMagazineIssuePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    issue_number: '',
    season: '',
    featured_color: '#C9A84C',
    cover_image: '',
    scheduled_publish_at: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: Record<string, any> = {
        ...form,
        issue_number: parseInt(form.issue_number, 10),
        slug: form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      };
      if (!scheduleEnabled || !form.scheduled_publish_at) {
        delete payload.scheduled_publish_at;
      }

      const res = await fetch('/api/magazine-issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create issue');
      }

      const issue = await res.json();
      router.push(`/dashboard/magazine/${issue.id}/edit`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const generatedSlug = form.title
    ? form.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    : '';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard/magazine')}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors touch-manipulation"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Issue</h1>
          <p className="text-sm text-gray-500 mt-0.5">Set up a new SauceCaviar magazine issue</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="glass-panel p-4 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 space-y-5">
          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider">Issue Details</h2>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. The Culture Issue"
              className="admin-input w-full"
            />
            {generatedSlug && (
              <p className="text-xs text-gray-600 mt-1">Slug: <span className="text-gray-400">{generatedSlug}</span></p>
            )}
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={form.subtitle}
              onChange={handleChange}
              placeholder="A secondary headline..."
              className="admin-input w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description of this issue..."
              rows={3}
              className="admin-input w-full resize-y"
            />
          </div>

          {/* Issue Number + Season — side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Issue Number *</label>
              <input
                type="number"
                name="issue_number"
                value={form.issue_number}
                onChange={handleChange}
                required
                min={1}
                placeholder="1"
                className="admin-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Season</label>
              <input
                type="text"
                name="season"
                value={form.season}
                onChange={handleChange}
                placeholder="e.g. Spring 2025"
                className="admin-input w-full"
              />
            </div>
          </div>

          {/* Featured Color */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Featured Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="featured_color"
                value={form.featured_color}
                onChange={handleChange}
                className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                name="featured_color"
                value={form.featured_color}
                onChange={handleChange}
                placeholder="#C9A84C"
                className="admin-input flex-1"
              />
            </div>
          </div>

          {/* Scheduled Publish */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-300">Schedule Publication</label>
              <button
                type="button"
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  scheduleEnabled ? 'bg-[#C9A84C]' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                    scheduleEnabled ? 'left-[22px]' : 'left-[2px]'
                  }`}
                />
              </button>
            </div>
            {scheduleEnabled && (
              <div className="mt-2">
                <input
                  type="datetime-local"
                  name="scheduled_publish_at"
                  value={form.scheduled_publish_at}
                  onChange={handleChange}
                  className="admin-input w-full"
                  min={new Date().toISOString().slice(0, 16)}
                />
                <p className="text-[10px] text-gray-600 mt-1">
                  ⏰ Issue will auto-publish at this date and time (your timezone)
                </p>
              </div>
            )}
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Cover Image URL</label>
            <input
              type="url"
              name="cover_image"
              value={form.cover_image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="admin-input w-full"
            />
            {form.cover_image && (
              <div className="mt-2 relative aspect-[3/2] max-w-xs rounded-lg overflow-hidden bg-gray-900">
                <img src={form.cover_image} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => router.push('/dashboard/magazine')}
            className="admin-btn-ghost w-full sm:w-auto touch-manipulation"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.title || !form.issue_number}
            className="admin-btn-primary w-full sm:w-auto flex items-center justify-center gap-2 touch-manipulation disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Create Issue'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
