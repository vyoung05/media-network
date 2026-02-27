'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand, UserRole } from '@media-network/shared';
import { StatCard } from '@/components/StatCard';

// ======================== TYPES ========================

interface MockWriter {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  bio: string;
  brand_affiliations: Brand[];
  is_verified: boolean;
  articles_count: number;
  submissions_count: number;
  views_total: number;
  status: 'active' | 'pending' | 'suspended';
  joined_at: string;
  last_active: string;
  links: Record<string, string>;
}

// ======================== MOCK DATA ========================

const MOCK_WRITERS: MockWriter[] = [
  {
    id: 'w1',
    name: 'Maya Chen',
    email: 'maya.chen@email.com',
    role: 'editor',
    avatar_url: null,
    bio: 'Culture editor and fashion journalist. Former Complex contributor. Covering the intersection of streetwear, luxury, and art.',
    brand_affiliations: ['saucecaviar', 'saucewire'],
    is_verified: true,
    articles_count: 47,
    submissions_count: 3,
    views_total: 142000,
    status: 'active',
    joined_at: '2024-01-15T00:00:00Z',
    last_active: '2024-03-15T14:30:00Z',
    links: { twitter: 'https://twitter.com/mayachen', portfolio: 'https://mayachen.com' },
  },
  {
    id: 'w2',
    name: 'DJ Source',
    email: 'djsource@email.com',
    role: 'writer',
    avatar_url: null,
    bio: 'Music journalist and A&R consultant. Specializing in emerging hip-hop and Afrobeats scenes across the diaspora.',
    brand_affiliations: ['trapglow', 'saucewire'],
    is_verified: true,
    articles_count: 31,
    submissions_count: 8,
    views_total: 89000,
    status: 'active',
    joined_at: '2024-01-22T00:00:00Z',
    last_active: '2024-03-15T11:00:00Z',
    links: { twitter: 'https://twitter.com/djsource', instagram: 'https://instagram.com/djsource' },
  },
  {
    id: 'w3',
    name: 'Alex "EngineerAlex" Thompson',
    email: 'alex@studioalchemy.com',
    role: 'writer',
    avatar_url: null,
    bio: 'Audio engineer with 10+ years experience. Grammy-credited. Writing about production techniques, mixing, and the art of sound.',
    brand_affiliations: ['trapfrequency'],
    is_verified: true,
    articles_count: 22,
    submissions_count: 5,
    views_total: 67000,
    status: 'active',
    joined_at: '2024-02-01T00:00:00Z',
    last_active: '2024-03-14T20:00:00Z',
    links: { youtube: 'https://youtube.com/@engineeralex', website: 'https://studioalchemy.com' },
  },
  {
    id: 'w4',
    name: 'Jasmine Rivers',
    email: 'jasmine.rivers@gmail.com',
    role: 'writer',
    avatar_url: null,
    bio: 'Freelance culture writer. Published in XXL, Pitchfork, and The FADER. Passionate about long-form music criticism.',
    brand_affiliations: ['saucecaviar', 'trapglow'],
    is_verified: false,
    articles_count: 12,
    submissions_count: 4,
    views_total: 34000,
    status: 'active',
    joined_at: '2024-02-10T00:00:00Z',
    last_active: '2024-03-15T09:00:00Z',
    links: { twitter: 'https://twitter.com/jasmrivers' },
  },
  {
    id: 'w5',
    name: 'ProducerMike',
    email: 'producermike@beats.com',
    role: 'writer',
    avatar_url: null,
    bio: 'FL Studio certified trainer and trap production tutorial creator. 200K+ YouTube subscribers.',
    brand_affiliations: ['trapfrequency'],
    is_verified: true,
    articles_count: 18,
    submissions_count: 6,
    views_total: 95000,
    status: 'active',
    joined_at: '2024-02-05T00:00:00Z',
    last_active: '2024-03-14T16:00:00Z',
    links: { youtube: 'https://youtube.com/@producermike', twitter: 'https://twitter.com/producermike' },
  },
  {
    id: 'w6',
    name: 'Jordan Davis',
    email: 'jordan.davis@sportswire.com',
    role: 'writer',
    avatar_url: null,
    bio: 'Sports journalist covering the intersection of athletics and culture. Former ESPN contributor.',
    brand_affiliations: ['saucewire'],
    is_verified: false,
    articles_count: 0,
    submissions_count: 1,
    views_total: 0,
    status: 'pending',
    joined_at: '2024-03-15T10:00:00Z',
    last_active: '2024-03-15T10:00:00Z',
    links: { twitter: 'https://twitter.com/jdavissports' },
  },
  {
    id: 'w7',
    name: 'Amara Okafor',
    email: 'amara.okafor@journalist.com',
    role: 'writer',
    avatar_url: null,
    bio: 'Nigerian-American journalist focused on global music trends and the Afrobeats movement. TED speaker.',
    brand_affiliations: ['saucewire', 'trapglow'],
    is_verified: false,
    articles_count: 0,
    submissions_count: 2,
    views_total: 0,
    status: 'pending',
    joined_at: '2024-03-13T10:00:00Z',
    last_active: '2024-03-13T10:30:00Z',
    links: { website: 'https://amaraokafor.com' },
  },
  {
    id: 'w8',
    name: 'TrapLord99',
    email: 'traplord99@gmail.com',
    role: 'writer',
    avatar_url: null,
    bio: 'Beat reviews and producer culture content.',
    brand_affiliations: ['trapfrequency'],
    is_verified: false,
    articles_count: 2,
    submissions_count: 3,
    views_total: 1200,
    status: 'suspended',
    joined_at: '2024-02-20T00:00:00Z',
    last_active: '2024-03-01T12:00:00Z',
    links: {},
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

const STATUS_CONFIG = {
  active: { label: 'Active', color: 'text-emerald-400 bg-emerald-400/10', dot: 'bg-emerald-400' },
  pending: { label: 'Pending Approval', color: 'text-amber-400 bg-amber-400/10', dot: 'bg-amber-400' },
  suspended: { label: 'Suspended', color: 'text-red-400 bg-red-400/10', dot: 'bg-red-400' },
};

const ROLE_LABELS: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'text-red-400 bg-red-400/10' },
  editor: { label: 'Editor', color: 'text-purple-400 bg-purple-400/10' },
  writer: { label: 'Writer', color: 'text-blue-400 bg-blue-400/10' },
  artist: { label: 'Artist', color: 'text-pink-400 bg-pink-400/10' },
  producer: { label: 'Producer', color: 'text-emerald-400 bg-emerald-400/10' },
  reader: { label: 'Reader', color: 'text-gray-400 bg-gray-400/10' },
};

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

// ======================== WRITER DETAIL ========================

function WriterDetail({
  writer,
  onClose,
  onStatusChange,
  onRoleChange,
}: {
  writer: MockWriter;
  onClose: () => void;
  onStatusChange: (id: string, status: MockWriter['status']) => void;
  onRoleChange: (id: string, role: UserRole) => void;
}) {
  const statusInfo = STATUS_CONFIG[writer.status];
  const roleInfo = ROLE_LABELS[writer.role];
  const initials = writer.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

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
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-panel-solid shadow-2xl shadow-black/50"
      >
        {/* Header with avatar */}
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">{writer.name}</h2>
                {writer.is_verified && (
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-400 font-mono">{writer.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
                <span className={`text-xs font-mono px-2 py-0.5 rounded flex items-center gap-1 ${statusInfo.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                  {statusInfo.label}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Bio */}
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1.5">Bio</p>
            <p className="text-sm text-gray-300 leading-relaxed">{writer.bio}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-admin-bg/40 rounded-lg text-center border border-admin-border">
              <p className="text-lg font-bold text-white">{writer.articles_count}</p>
              <p className="text-xs text-gray-500">Articles</p>
            </div>
            <div className="p-3 bg-admin-bg/40 rounded-lg text-center border border-admin-border">
              <p className="text-lg font-bold text-white">{formatViews(writer.views_total)}</p>
              <p className="text-xs text-gray-500">Total Views</p>
            </div>
            <div className="p-3 bg-admin-bg/40 rounded-lg text-center border border-admin-border">
              <p className="text-lg font-bold text-white">{writer.submissions_count}</p>
              <p className="text-xs text-gray-500">Submissions</p>
            </div>
          </div>

          {/* Brand affiliations */}
          <div>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Brand Affiliations</p>
            <div className="flex gap-2 flex-wrap">
              {writer.brand_affiliations.map((brand) => (
                <span
                  key={brand}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/[0.06]"
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS[brand] }} />
                  <span className="text-gray-300">{BRAND_NAMES[brand]}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.keys(writer.links).length > 0 && (
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Links</p>
              <div className="space-y-1.5">
                {Object.entries(writer.links).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    <span className="capitalize">{key}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Joined</p>
              <p className="text-sm text-gray-300 font-mono">
                {new Date(writer.joined_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Last Active</p>
              <p className="text-sm text-gray-300 font-mono">
                {new Date(writer.last_active).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <select
              value={writer.role}
              onChange={(e) => onRoleChange(writer.id, e.target.value as UserRole)}
              className="admin-input text-xs py-1.5 px-2 w-auto"
            >
              <option value="writer">Writer</option>
              <option value="editor">Editor</option>
              <option value="artist">Artist</option>
              <option value="producer">Producer</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            {writer.status === 'pending' && (
              <button
                onClick={() => onStatusChange(writer.id, 'active')}
                className="admin-btn-success text-xs flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Approve Writer
              </button>
            )}
            {writer.status === 'active' && (
              <button
                onClick={() => onStatusChange(writer.id, 'suspended')}
                className="admin-btn-danger text-xs flex items-center gap-1.5"
              >
                Suspend
              </button>
            )}
            {writer.status === 'suspended' && (
              <button
                onClick={() => onStatusChange(writer.id, 'active')}
                className="admin-btn-primary text-xs flex items-center gap-1.5"
              >
                Reactivate
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================== MAIN COMPONENT ========================

export function WritersPage() {
  const [writers, setWriters] = useState(MOCK_WRITERS);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [filterBrand, setFilterBrand] = useState<Brand | 'all'>('all');
  const [selectedWriter, setSelectedWriter] = useState<MockWriter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = writers.filter((w) => {
    if (filterStatus !== 'all' && w.status !== filterStatus) return false;
    if (filterBrand !== 'all' && !w.brand_affiliations.includes(filterBrand)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return w.name.toLowerCase().includes(q) || w.email.toLowerCase().includes(q) || w.bio.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStatusChange = (id: string, status: MockWriter['status']) => {
    setWriters((prev) => prev.map((w) => (w.id === id ? { ...w, status } : w)));
    setSelectedWriter(null);
  };

  const handleRoleChange = (id: string, role: UserRole) => {
    setWriters((prev) => prev.map((w) => (w.id === id ? { ...w, role } : w)));
  };

  const counts = {
    all: writers.length,
    active: writers.filter((w) => w.status === 'active').length,
    pending: writers.filter((w) => w.status === 'pending').length,
    suspended: writers.filter((w) => w.status === 'suspended').length,
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
          <h1 className="text-2xl font-bold text-white">Writers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage contributors across all brands
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search writers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input pl-10 w-56 text-sm"
            />
          </div>
          {/* View toggle */}
          <div className="flex rounded-lg border border-admin-border overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-xs transition-colors ${
                viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Writers"
          value={counts.all}
          change={`${counts.pending} pending`}
          changeType="neutral"
          color="#3B82F6"
          index={0}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
        <StatCard
          label="Active Writers"
          value={counts.active}
          change="2 new this week"
          changeType="up"
          color="#10B981"
          index={1}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Articles"
          value={writers.reduce((sum, w) => sum + w.articles_count, 0)}
          change="15 this week"
          changeType="up"
          color="#8B5CF6"
          index={2}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          }
        />
        <StatCard
          label="Total Views"
          value={formatViews(writers.reduce((sum, w) => sum + w.views_total, 0))}
          change="18% growth"
          changeType="up"
          color="#F59E0B"
          index={3}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
        />
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] pb-px">
        {([
          { key: 'all', label: 'All Writers' },
          { key: 'active', label: 'Active' },
          { key: 'pending', label: 'Pending' },
          { key: 'suspended', label: 'Suspended' },
        ] as const).map((tab) => {
          const isActive = filterStatus === tab.key;
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
                  {counts[tab.key]}
                </span>
              </span>
              {isActive && (
                <motion.div
                  layoutId="writers-tab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Brand filter bar */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-gray-500">Brand:</span>
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

      {/* Writers grid/list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((writer, i) => {
              const statusInfo = STATUS_CONFIG[writer.status];
              const roleInfo = ROLE_LABELS[writer.role];
              const initials = writer.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <motion.div
                  key={writer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedWriter(writer)}
                  className="glass-panel p-5 hover:bg-admin-hover/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-bold text-white flex-shrink-0 group-hover:border-white/20 transition-colors">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-white truncate">{writer.name}</h3>
                        {writer.is_verified && (
                          <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded flex items-center gap-1 ${statusInfo.color}`}>
                          <span className={`w-1 h-1 rounded-full ${statusInfo.dot}`} />
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{writer.bio}</p>

                  {/* Brand pills */}
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {writer.brand_affiliations.map((brand) => (
                      <span
                        key={brand}
                        className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04]"
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND_COLORS[brand] }} />
                        <span className="text-gray-400">{BRAND_NAMES[brand]}</span>
                      </span>
                    ))}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500 pt-3 border-t border-white/[0.04]">
                    <span>{writer.articles_count} articles</span>
                    <span>{formatViews(writer.views_total)} views</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* List view */
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((writer, i) => {
              const statusInfo = STATUS_CONFIG[writer.status];
              const roleInfo = ROLE_LABELS[writer.role];
              const initials = writer.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
              return (
                <motion.div
                  key={writer.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedWriter(writer)}
                  className="glass-panel p-4 hover:bg-admin-hover/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{writer.name}</h3>
                        {writer.is_verified && (
                          <svg className="w-3.5 h-3.5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{writer.email}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {writer.brand_affiliations.map((brand) => (
                        <div
                          key={brand}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: BRAND_COLORS[brand] }}
                          title={BRAND_NAMES[brand]}
                        />
                      ))}
                    </div>
                    <div className="text-right flex-shrink-0 w-24">
                      <p className="text-sm font-mono text-gray-300">{writer.articles_count} articles</p>
                      <p className="text-xs font-mono text-gray-600">{formatViews(writer.views_total)} views</p>
                    </div>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded flex items-center gap-1 flex-shrink-0 ${statusInfo.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                      {statusInfo.label}
                    </span>
                    {writer.status === 'pending' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStatusChange(writer.id, 'active'); }}
                        className="admin-btn-success text-xs px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-16 text-center"
        >
          <div className="text-5xl mb-4">✍️</div>
          <h3 className="text-lg font-semibold text-white mb-2">No writers found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery ? `No results for "${searchQuery}".` : 'No writers match the current filters.'}
          </p>
        </motion.div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {selectedWriter && (
          <WriterDetail
            writer={selectedWriter}
            onClose={() => setSelectedWriter(null)}
            onStatusChange={handleStatusChange}
            onRoleChange={handleRoleChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
