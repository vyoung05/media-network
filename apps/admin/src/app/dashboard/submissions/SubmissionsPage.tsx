'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand, SubmissionStatus, SubmissionType } from '@media-network/shared';

// ======================== TYPES ========================

interface MockSubmission {
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
  reviewer_notes: string | null;
}

// ======================== MOCK DATA ========================

const MOCK_SUBMISSIONS: MockSubmission[] = [
  {
    id: 's1',
    title: 'Rising Atlanta Rapper "Lil Frost" — Feature Request',
    content: 'Hey, I\'m Lil Frost from Atlanta. Been making music for 3 years, just dropped my mixtape "Cold Summer" which got 50K streams first week. Would love to be featured on TrapGlow. My music blends melodic trap with Southern hip-hop roots.',
    type: 'artist_feature',
    brand: 'trapglow',
    status: 'pending',
    contact_name: 'Marcus "Lil Frost" Johnson',
    contact_email: 'lilfrost@email.com',
    is_anonymous: false,
    media_urls: ['https://soundcloud.com/lilfrost/cold-summer'],
    submitted_at: '2024-03-15T14:30:00Z',
    reviewer_notes: null,
  },
  {
    id: 's2',
    title: 'How Playboi Carti Changed the Sound of Modern Rap',
    content: 'An in-depth editorial exploring Carti\'s influence on production styles, vocal delivery trends, and the birth of "rage" subgenre. Includes interviews with 3 producers who worked with him. Approx 2,500 words.',
    type: 'article_pitch',
    brand: 'saucecaviar',
    status: 'under_review',
    contact_name: 'Jasmine Rivers',
    contact_email: 'jasmine.rivers@gmail.com',
    is_anonymous: false,
    media_urls: [],
    submitted_at: '2024-03-15T11:00:00Z',
    reviewer_notes: 'Strong pitch. Checking source credibility.',
  },
  {
    id: 's3',
    title: 'Exclusive: Major Label Merger Happening Behind the Scenes',
    content: 'I have insider info about a potential merger between two major labels. Can provide documents but need to stay anonymous. This could reshape the industry.',
    type: 'news_tip',
    brand: 'saucewire',
    status: 'pending',
    contact_name: '',
    contact_email: 'tipster_anon@protonmail.com',
    is_anonymous: true,
    media_urls: [],
    submitted_at: '2024-03-15T09:15:00Z',
    reviewer_notes: null,
  },
  {
    id: 's4',
    title: '"Midnight Bounce" — Dark Trap Beat (140 BPM)',
    content: 'Hard-hitting trap beat with 808 slides, dark pads, and aggressive hi-hat patterns. Mixed and mastered. Available for lease or exclusive. Perfect for TrapFrequency\'s beat showcase.',
    type: 'beat_submission',
    brand: 'trapfrequency',
    status: 'pending',
    contact_name: 'DJ 808Mafia',
    contact_email: '808mafia.beats@gmail.com',
    is_anonymous: false,
    media_urls: ['https://soundcloud.com/808mafia/midnight-bounce'],
    submitted_at: '2024-03-14T22:45:00Z',
    reviewer_notes: null,
  },
  {
    id: 's5',
    title: 'Street Fashion Photography Portfolio — NYC Edition',
    content: 'I\'m a street fashion photographer based in NYC. Shot 30+ editorial sets this year. Would love to contribute a photo feature or recurring column about NYC street style for SauceCaviar.',
    type: 'artist_feature',
    brand: 'saucecaviar',
    status: 'pending',
    contact_name: 'Devon Clarke',
    contact_email: 'devon.shoots@email.com',
    is_anonymous: false,
    media_urls: ['https://devonclarke.com/portfolio', 'https://instagram.com/devonshoots'],
    submitted_at: '2024-03-14T18:30:00Z',
    reviewer_notes: null,
  },
  {
    id: 's6',
    title: 'The Complete Guide to Mixing Vocals for Trap Music',
    content: 'Step-by-step tutorial covering EQ, compression, reverb, delay, autotune, and vocal layering specifically for trap music. Includes downloadable presets for FL Studio and Logic Pro.',
    type: 'article_pitch',
    brand: 'trapfrequency',
    status: 'approved',
    contact_name: 'Alex "EngineerAlex" Thompson',
    contact_email: 'alex@studioalchemy.com',
    is_anonymous: false,
    media_urls: [],
    submitted_at: '2024-03-14T15:00:00Z',
    reviewer_notes: 'Great tutorial pitch. Approved for publication. Assign to next week\'s content calendar.',
  },
  {
    id: 's7',
    title: 'Up-and-Coming Producer Spotlight: BeatsByNova',
    content: 'BeatsByNova has produced for 5 independent artists, racking up 500K+ total streams. Their unique blend of Jersey club and trap creates an infectious sound. Request to be featured.',
    type: 'artist_feature',
    brand: 'trapglow',
    status: 'pending',
    contact_name: 'Nova Williams',
    contact_email: 'beatsbynova@gmail.com',
    is_anonymous: false,
    media_urls: ['https://youtube.com/@beatsbynova', 'https://soundcloud.com/beatsbynova'],
    submitted_at: '2024-03-14T12:00:00Z',
    reviewer_notes: null,
  },
  {
    id: 's8',
    title: 'Nike Just Cancelled a $50M Sneaker Deal — Insider',
    content: 'A major athlete\'s signature shoe deal was just terminated. My source at Nike corporate confirmed. Story hasn\'t broken yet.',
    type: 'news_tip',
    brand: 'saucewire',
    status: 'rejected',
    contact_name: '',
    contact_email: '',
    is_anonymous: true,
    media_urls: [],
    submitted_at: '2024-03-13T20:00:00Z',
    reviewer_notes: 'Unable to verify. No corroborating sources found. Tip does not meet our editorial standards.',
  },
  {
    id: 's9',
    title: '"Glow Season" EP — 6 Track Submission',
    content: 'Full EP of melodic trap instrumentals themed around personal growth. Each track tells a part of the story. Looking for a full feature on TrapGlow with track-by-track breakdown.',
    type: 'beat_submission',
    brand: 'trapglow',
    status: 'under_review',
    contact_name: 'Jayflow',
    contact_email: 'jayflow.music@gmail.com',
    is_anonymous: false,
    media_urls: ['https://soundcloud.com/jayflow/sets/glow-season-ep'],
    submitted_at: '2024-03-13T16:00:00Z',
    reviewer_notes: 'Listening through the EP. Production quality is solid. Deciding on feature format.',
  },
  {
    id: 's10',
    title: 'Why Afrobeats Will Dominate 2025 — Opinion Piece',
    content: 'Opinion piece examining streaming data, festival bookings, and cultural shifts that point to Afrobeats becoming the dominant global genre. With charts and data visualizations.',
    type: 'article_pitch',
    brand: 'saucewire',
    status: 'pending',
    contact_name: 'Amara Okafor',
    contact_email: 'amara.okafor@journalist.com',
    is_anonymous: false,
    media_urls: [],
    submitted_at: '2024-03-13T10:30:00Z',
    reviewer_notes: null,
  },
  {
    id: 's11',
    title: 'FL Studio 24 — First Look Review',
    content: 'Comprehensive review of the new FL Studio update. Covers new features, workflow improvements, and compatibility. Includes video walkthrough and benchmark tests.',
    type: 'article_pitch',
    brand: 'trapfrequency',
    status: 'pending',
    contact_name: 'ProducerMike',
    contact_email: 'producermike@beats.com',
    is_anonymous: false,
    media_urls: ['https://youtube.com/watch?v=fake123'],
    submitted_at: '2024-03-12T14:00:00Z',
    reviewer_notes: null,
  },
  {
    id: 's12',
    title: 'Emerging Designer "KODA" — Fashion Feature',
    content: 'KODA is a 22-year-old designer from London blending Japanese streetwear with African prints. Just showed at a pop-up during London Fashion Week. Would love editorial coverage.',
    type: 'artist_feature',
    brand: 'saucecaviar',
    status: 'pending',
    contact_name: 'Koda Mensah',
    contact_email: 'koda@kodastudios.co.uk',
    is_anonymous: false,
    media_urls: ['https://kodastudios.co.uk', 'https://instagram.com/kodastudios'],
    submitted_at: '2024-03-12T09:00:00Z',
    reviewer_notes: null,
  },
];

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
  submission: MockSubmission;
  onClose: () => void;
  onStatusChange: (id: string, status: SubmissionStatus, notes?: string) => void;
}) {
  const [notes, setNotes] = useState(submission.reviewer_notes || '');
  const typeInfo = TYPE_LABELS[submission.type];
  const statusInfo = STATUS_CONFIG[submission.status];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
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
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">From</p>
              <p className="text-sm text-white">
                {submission.is_anonymous ? '🕶️ Anonymous' : submission.contact_name || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm text-white font-mono">
                {submission.contact_email || '—'}
              </p>
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

          {/* Content */}
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Content</p>
            <div className="p-4 bg-admin-bg/60 rounded-lg border border-admin-border text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {submission.content}
            </div>
          </div>

          {/* Media links */}
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
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                      {url}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Reviewer notes */}
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
          <button onClick={onClose} className="admin-btn-ghost">
            Close
          </button>
          <div className="flex items-center gap-2">
            {submission.status !== 'rejected' && (
              <button
                onClick={() => onStatusChange(submission.id, 'rejected', notes)}
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
                onClick={() => onStatusChange(submission.id, 'under_review', notes)}
                className="admin-btn-primary flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Review
              </button>
            )}
            {submission.status !== 'approved' && (
              <button
                onClick={() => onStatusChange(submission.id, 'approved', notes)}
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
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [filterBrand, setFilterBrand] = useState<Brand | 'all'>('all');
  const [filterType, setFilterType] = useState<SubmissionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<SubmissionStatus | 'all'>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<MockSubmission | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleStatusChange = (id: string, status: SubmissionStatus, notes?: string) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status, reviewer_notes: notes || s.reviewer_notes, reviewed_at: new Date().toISOString() }
          : s
      )
    );
    setSelectedSubmission(null);
  };

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
            {submissions.length} total submissions • {statusCounts.pending} pending review
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

      {/* Status tabs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex gap-1 border-b border-white/[0.06] pb-px"
      >
        {(
          [
            { key: 'all', label: 'All' },
            { key: 'pending', label: 'Pending' },
            { key: 'under_review', label: 'Under Review' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' },
          ] as const
        ).map((tab) => {
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
        {/* Brand filter */}
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

        {/* Type filter */}
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

      {/* Submissions list */}
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
                  {/* Brand dot */}
                  <div className="flex-shrink-0 mt-1.5">
                    <div
                      className="w-3 h-3 rounded-full transition-shadow group-hover:shadow-lg"
                      style={{
                        backgroundColor: BRAND_COLORS[sub.brand],
                        boxShadow: `0 0 0px ${BRAND_COLORS[sub.brand]}`,
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${typeInfo.color}`}>
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${statusInfo.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                        {statusInfo.label}
                      </span>
                      <span className="text-xs text-gray-600 font-mono">
                        {BRAND_NAMES[sub.brand]}
                      </span>
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

                  {/* Quick actions */}
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

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel p-16 text-center"
          >
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-white mb-2">No submissions found</h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search.`
                : 'No submissions match the current filters.'}
            </p>
          </motion.div>
        )}
      </div>

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
