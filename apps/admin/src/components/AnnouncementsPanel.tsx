'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Announcement {
  id: string;
  title: string;
  message: string | null;
  type: string;
  video_url: string | null;
  pinned: boolean;
  active: boolean;
  created_at: string;
}

const TYPE_STYLES: Record<string, { bg: string; icon: string; label: string }> = {
  welcome: { bg: 'from-blue-500/20 to-purple-500/20', icon: '👋', label: 'Welcome' },
  update: { bg: 'from-emerald-500/20 to-teal-500/20', icon: '🆕', label: 'Update' },
  alert: { bg: 'from-red-500/20 to-orange-500/20', icon: '⚠️', label: 'Alert' },
  info: { bg: 'from-blue-500/20 to-indigo-500/20', icon: 'ℹ️', label: 'Info' },
};

export function AnnouncementsPanel({ isAdmin = false }: { isAdmin?: boolean }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch('/api/announcements?limit=5&active=true');
        const data = await res.json();
        if (res.ok) setAnnouncements(data.announcements || []);
      } catch {}
      setLoading(false);
    }
    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch {}
  };

  if (loading) {
    return (
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📢</span>
          <h3 className="text-sm font-semibold text-white">Announcements</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-20 bg-white/5 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📢</span>
          <h3 className="text-sm font-semibold text-white">Announcements</h3>
          {announcements.length > 0 && (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
              {announcements.length}
            </span>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>
        )}
      </div>

      <div className="divide-y divide-white/[0.04]">
        {announcements.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-gray-500">No announcements</p>
            {isAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 text-xs text-blue-400 hover:text-blue-300"
              >
                Create your first announcement
              </button>
            )}
          </div>
        ) : (
          announcements.map((ann) => {
            const style = TYPE_STYLES[ann.type] || TYPE_STYLES.info;
            return (
              <motion.div
                key={ann.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-6 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg bg-gradient-to-br ${style.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-sm">{style.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{ann.title}</p>
                      {ann.pinned && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    {ann.message && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{ann.message}</p>
                    )}
                    {ann.video_url && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-white/[0.06]">
                        <video
                          src={ann.video_url}
                          controls
                          className="w-full max-h-48 bg-black"
                          preload="metadata"
                        />
                      </div>
                    )}
                    <p className="text-[10px] font-mono text-gray-600 mt-2">
                      {new Date(ann.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateAnnouncementModal
            onClose={() => setShowCreateModal(false)}
            onCreated={(ann) => {
              setAnnouncements((prev) => [ann, ...prev]);
              setShowCreateModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CreateAnnouncementModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (ann: Announcement) => void;
}) {
  const [form, setForm] = useState({
    title: '',
    message: '',
    type: 'info',
    pinned: false,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('Video must be under 50MB');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      let video_url: string | null = null;

      // Upload video if present
      if (videoFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', videoFile);
        formData.append('bucket', 'media');
        formData.append('folder', 'announcements');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');
        video_url = uploadData.url;
        setUploading(false);
      }

      // Create announcement
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          video_url,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');

      onCreated(data.announcement);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="glass-panel w-full max-w-lg mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-white mb-1">New Announcement</h2>
        <p className="text-sm text-gray-500 mb-6">
          Share updates, welcome messages, or important info with your team
        </p>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="admin-input"
              placeholder="Announcement title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="admin-input min-h-[100px] resize-none"
              placeholder="Details..."
              rows={4}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Type</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(TYPE_STYLES).map(([key, style]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm({ ...form, type: key })}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      form.type === key
                        ? 'border-blue-500/50 bg-blue-500/10 text-white'
                        : 'border-white/[0.06] text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span>{style.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Video (optional)
            </label>
            {videoPreview ? (
              <div className="relative rounded-lg overflow-hidden border border-white/[0.06]">
                <video
                  src={videoPreview}
                  controls
                  className="w-full max-h-48 bg-black"
                />
                <button
                  type="button"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-white/10 rounded-lg text-center hover:border-white/20 transition-colors"
              >
                <svg className="w-8 h-8 mx-auto text-gray-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-500">Click to upload a video</p>
                <p className="text-xs text-gray-600 mt-1">MP4, MOV, WebM — Max 50MB</p>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Pin toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
              className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-300">📌 Pin to top</span>
          </label>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="admin-btn-ghost px-4 py-2">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary px-4 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              {uploading
                ? 'Uploading video...'
                : saving
                ? 'Publishing...'
                : 'Publish Announcement'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
