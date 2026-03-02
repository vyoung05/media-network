'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseBrowserClient } from '@media-network/shared';
import type { Brand, SubmissionStatus, SubmissionType } from '@media-network/shared';

// ======================== TYPES ========================

interface SubmissionItem {
  id: string;
  title: string;
  content: string;
  type: SubmissionType;
  brand: Brand;
  status: SubmissionStatus;
  contact_name: string;
  contact_email: string;
  is_anonymous: boolean;
  media_urls: string[];
  submitted_at: string;
  reviewed_at: string | null;
  reviewer_notes: string | null;
  user_id: string | null;
}

// ======================== CONSTANTS ========================

const BRAND_COLORS: Record<Brand, string> = {
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  saucewire: '#E63946',
  trapfrequency: '#39FF14',
};

const BRAND_NAMES: Record<Brand, string> = {
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  saucewire: 'SauceWire',
  trapfrequency: 'TrapFrequency',
};

const TYPE_LABELS: Record<SubmissionType, { label: string; icon: string; color: string }> = {
  article_pitch: { label: 'Article Pitch', icon: '✏️', color: 'text-blue-400 bg-blue-400/10' },
  artist_feature: { label: 'Artist Feature', icon: '🎤', color: 'text-purple-400 bg-purple-400/10' },
  beat_submission: { label: 'Beat', icon: '🎵', color: 'text-emerald-400 bg-emerald-400/10' },
  news_tip: { label: 'News Tip', icon: '📡', color: 'text-amber-400 bg-amber-400/10' },
};

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; color: string; dot: string }> = {
  pending: { label: 'Pending', color: 'text-amber-400 bg-amber-400/10', dot: 'bg-amber-400' },
  under_review: { label: 'Under Review', color: 'text-blue-400 bg-blue-400/10', dot: 'bg-blue-400' },
  approved: { label: 'Approved', color: 'text-emerald-400 bg-emerald-400/10', dot: 'bg-emerald-400' },
  rejected: { label: 'Rejected', color: 'text-red-400 bg-red-400/10', dot: 'bg-red-400' },
  published: { label: 'Published', color: 'text-indigo-400 bg-indigo-400/10', dot: 'bg-indigo-400' },
};

// ======================== DETAIL PANEL ========================

function SubmissionDetail({
  submission,
  onClose,
  onStatusChange,
}: {
  submission: SubmissionItem;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus, notes?: string) => void;
}) {
  const [notes, setNotes] = useState(submission.reviewer_notes || '');
  const [saving, setSaving] = useState(false);
  const typeInfo = TYPE_LABELS[submission.type];
  const statusInfo = STATUS_CONFIG[submission.status];

  const handleAction = async (status: SubmissionStatus) => {
    setSaving(true);
    await onStatusChange(submission.id, status, notes);
    setSaving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-panel-solid shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 border-b border-white/[0.06] bg-admin-card flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${typeInfo.color}`}>
                {typeInfo.icon} {typeInfo.label}
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: BRAND_COLORS[submission.brand] }}
              />
              <span className="text-xs text-gray-500 font-mono">
                {BRAND_NAMES[submission.brand]}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white leading-tight">{submission.title}</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">From</p>
              <p className="text-sm text-white">
                {submission.is_anonymous ? '🕶️ Anonymous' : submission.contact_name || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm text-white font-mono">{submission.contact_email || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Submitted</p>
              <p className="text-sm text-white font-mono">
                {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                  hour: 'numeric', minute: '2-digit',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Attachments</p>
              <p className="text-sm text-white">{submission.media_urls.length} file(s)</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Content</p>
            <div className="p-4 bg-admin-bg/60 rounded-lg border border-admin-border text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {submission.content}
            </div>
          </div>

          {submission.media_urls.length > 0 && (
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Links / Media</p>
              <div className="space-y-2">
                {submission.media_urls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-admin-bg/40 rounded-lg border border-admin-border hover:border-blue-500/30 transition-colors group"
                  >
                    <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">{url}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Reviewer Notes</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this submission..."
              rows={3}
              className="admin-input text-sm resize-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-white/[0.06] bg-admin-card flex items-center justify-between gap-3">
          <button onClick={onClose} className="admin-btn-ghost">Close</button>
          <div className="flex items-center gap-2">
            {submission.status !== 'rejected' && (
              <button
                onClick={() => handleAction('rejected')}
                disabled={saving}
                className="admin-btn-danger flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reject
              </button>
            )}
            {submission.status !== 'under_review' && submission.status !== 'approved' && (
              <button
                onClick={() => handleAction('under_review')}
                disabled={saving}
                className="admin-btn-primary flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Review
              </button>
            )}
            {submission.status !== 'approved' && (
              <button
                onClick={() => handleAction('approved')}
                disabled={saving}
                className="admin-btn-success flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================== MAIN COMPONENT ========================

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterBrand, setFilterBrand] = useState<Brand | 'all'>('all');
  const [filterType, setFilterType] = useState<SubmissionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();

      const { data, error: fetchError } = await supabase
        .from('submissions')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(100);

      if (fetchError) throw fetchError;

      const mapped: SubmissionItem[] = (data || []).map((s) => ({
        id: s.id,
        title: s.title,
        content: s.content,
        type: s.type as SubmissionType,
        brand: s.brand as Brand,
        status: s.status as SubmissionStatus,
        contact_name: s.contact_name || '',
        contact_email: s.contact_email || '',
        is_anonymous: s.is_anonymous || false,
        media_urls: s.media_urls || [],
        submitted_at: s.submitted_at,
        reviewed_at: s.reviewed_at,
        reviewer_notes: s.reviewer_notes,
        user_id: s.user_id,
      }));

      setSubmissions(mapped);
      setError(null);
    } catch (err) {
      console.error('Fetch submissions error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleStatusChange = async (id: string, status: SubmissionStatus, notes?: string) => {
    try {
      const supabase = getSupabaseBrowserClient();

      const updates: Record<string, unknown> = {
        status,
        reviewed_at: new Date().toISOString(),
      };
      if (notes !== undefined) {
        updates.reviewer_notes = notes;
      }

      const { error: updateError } = await supabase
        .from('submissions')
        .update(updates)
        .eq('id', id);

      if (updateError) throw updateError;

      // Update local state
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id
            ? { ...s, status, reviewer_notes: notes ?? s.reviewer_notes, reviewed_at: new Date().toISOString() }
            : s
        )
      );
      setSelectedSubmission(null);
    } catch (err) {
      console.error('Status change error:', err);
      alert(`Failed to update submission: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const filtered = submissions.filter((s) => {
    if (filterBrand !== 'all' && s.brand !== filterBrand) return false;
    if (filterType !== 'all' && s.type !== filterType) return false;
    if (filterStatus !== 'all' && s.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.content.toLowerCase().includes(q) ||
        s.contact_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusCounts = {
    all: submissions.length,
    pending: submissions.filter((s) => s.status === 'pending').length,
    under_review: submissions.filter((s) => s.status === 'under_review').length,
    approved: submissions.filter((s) => s.status === 'approved').length,
    rejected: submissions.filter((s) => s.status === 'rejected').length,
    published: submissions.filter((s) => s.status === 'published').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Submissions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `${submissions.length} total submissions • ${statusCounts.pending} pending review`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search submissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input pl-10 w-64 text-sm"
            />
          </div>
        </div>
      </motion.div>

      {/* Error banner */}
      {error && (
        <div className="glass-panel p-4 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={fetchSubmissions} className="ml-auto text-xs text-red-300 hover:text-white underline">Retry</button>
          </div>
        </div>
      )}

      {/* Status tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-1 border-b border-white/[0.06] pb-px"
      >
        {([
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'under_review', label: 'Under Review' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
        ] as const).map((tab) => {
          const isActive = filterStatus === tab.key;
          const count = statusCounts[tab.key];
          return (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`relative px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${
                  isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-gray-600'
                }`}>
                  {count}
                </span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="submissions-tab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Filters bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-3 flex flex-wrap items-center gap-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Brand:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterBrand('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterBrand === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              All
            </button>
            {(Object.keys(BRAND_NAMES) as Brand[]).map((brand) => (
              <button
                key={brand}
                onClick={() => setFilterBrand(brand)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                  filterBrand === brand ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[brand] }} />
                {BRAND_NAMES[brand]}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-5 bg-white/10" />

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Type:</span>
          <div className="flex gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterType === 'all' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              All
            </button>
            {(Object.keys(TYPE_LABELS) as SubmissionType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterType === type ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
                }`}
              >
                {TYPE_LABELS[type].icon} {TYPE_LABELS[type].label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="glass-panel p-5">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-white/10 animate-pulse mt-1.5" />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-3/4 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submissions list */}
      {!loading && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((sub, i) => {
              const typeInfo = TYPE_LABELS[sub.type];
              const statusInfo = STATUS_CONFIG[sub.status];
              return (
                <motion.div
                  key={sub.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedSubmission(sub)}
                  className="glass-panel p-5 hover:bg-admin-hover/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1.5">
                      <div
                        className="w-3 h-3 rounded-full transition-shadow group-hover:shadow-lg"
                        style={{ backgroundColor: BRAND_COLORS[sub.brand] }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${typeInfo.color}`}>
                          {typeInfo.icon} {typeInfo.label}
                        </span>
                        <span className={`text-xs font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${statusInfo.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                        <span className="text-xs text-gray-600 font-mono">{BRAND_NAMES[sub.brand]}</span>
                        {sub.is_anonymous && (
                          <span className="text-xs text-gray-500 font-mono">🕶️ Anon</span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-100 transition-colors">
                        {sub.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{sub.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                        {!sub.is_anonymous && sub.contact_name && (
                          <span>From {sub.contact_name}</span>
                        )}
                        <span className="font-mono">
                          {new Date(sub.submitted_at).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric',
                            hour: 'numeric', minute: '2-digit',
                          })}
                        </span>
                        {sub.media_urls.length > 0 && (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                            </svg>
                            {sub.media_urls.length} link(s)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      {sub.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(sub.id, 'approved'); }}
                            className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(sub.id, 'rejected'); }}
                            className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-16 text-center"
            >
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {submissions.length === 0 ? 'No submissions yet' : 'No submissions found'}
              </h3>
              <p className="text-sm text-gray-500">
                {searchQuery
                  ? `No results for "${searchQuery}". Try a different search.`
                  : submissions.length === 0
                  ? 'Submissions from writers and artists will appear here.'
                  : 'No submissions match the current filters.'}
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {selectedSubmission && (
          <SubmissionDetail
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
