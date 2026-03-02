'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseBrowserClient } from '@media-network/shared';
import type { Brand, UserRole } from '@media-network/shared';
import { StatCard } from '@/components/StatCard';

// ======================== TYPES ========================

/*
 * ================================================================
 * MIGRATION NOTE — Supabase `users` table:
 *
 * ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
 * ALTER TABLE public.users ADD COLUMN IF NOT EXISTS show_on_site BOOLEAN DEFAULT false;
 *
 * - `avatar_url`: PUBLIC URL from Supabase Storage. This is the ONE profile
 *   picture used everywhere — admin dashboard AND all front-end brand sites.
 *   The same URL appears in article bylines, team pages, and author cards.
 * - `show_on_site`: Whether the writer's profile appears publicly on brand sites.
 * - `brand_affiliations`: Already exists — controls which brands the user can work on.
 *
 * ================================================================
 * SUPABASE STORAGE — `avatars` bucket:
 *
 * Create a PUBLIC bucket called `avatars` in Supabase Storage:
 *   1. Go to Storage in Supabase dashboard
 *   2. Create bucket: name = "avatars", public = true
 *   3. Add RLS policy: Allow authenticated users to upload to their own path
 *      - INSERT policy: `(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])`
 *      - Or simpler: allow all authenticated inserts for admin use
 *   4. Public URL pattern: {SUPABASE_URL}/storage/v1/object/public/avatars/{user_id}.{ext}
 *
 * Files are stored as: avatars/{user_id}.{ext} (e.g. avatars/abc123.webp)
 * Uploads upsert (overwrite) so changing your photo replaces the old one.
 * Images are auto-cropped to square on the client before upload.
 * ================================================================
 *
 * FRONT-END NOTE: The public brand sites need to:
 *   1. Show article author name + avatar_url in the byline/author section.
 *      Query: SELECT name, avatar_url FROM users WHERE id = article.author_id
 *   2. Only display writers where show_on_site = true on public team pages.
 *   3. Filter content access based on brand_affiliations.
 *   4. avatar_url is a direct public URL — use it in <img> tags directly.
 * ================================================================
 */

interface WriterItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  bio: string;
  brand_affiliations: Brand[];
  is_verified: boolean;
  show_on_site: boolean;
  articles_count: number;
  views_total: number;
  created_at: string;
  updated_at: string;
  links: Record<string, string>;
}

interface WriterArticle {
  id: string;
  title: string;
  brand: Brand;
  status: string;
  created_at: string;
  view_count: number;
}

// ======================== SUSPENSION / VIOLATION TYPES ========================

type SuspensionDuration = '7d' | '14d' | '30d' | '60d' | 'indefinite';

interface ViolationRecord {
  id: string;
  date: string;
  reason: string;
  duration: SuspensionDuration;
  reinstated: boolean;
  reinstateDate: string | null;
  reinstateNote: string | null;
}

interface SuspensionData {
  violations: ViolationRecord[];
  currentlySuspended: boolean;
  accountDisabled: boolean;
}

const DURATION_LABELS: Record<SuspensionDuration, string> = {
  '7d': '7 days',
  '14d': '14 days',
  '30d': '30 days',
  '60d': '60 days',
  indefinite: 'Indefinite',
};

const DURATION_DAYS: Record<SuspensionDuration, number | null> = {
  '7d': 7,
  '14d': 14,
  '30d': 30,
  '60d': 60,
  indefinite: null,
};

const MAX_VIOLATIONS_BEFORE_REMOVAL = 3;

// ======================== SUSPENSION HELPERS ========================

function getSuspensionStorageKey(userId: string): string {
  return `media-network-suspensions-${userId}`;
}

function loadSuspensionData(userId: string): SuspensionData {
  try {
    const raw = localStorage.getItem(getSuspensionStorageKey(userId));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { violations: [], currentlySuspended: false, accountDisabled: false };
}

function saveSuspensionData(userId: string, data: SuspensionData): void {
  try {
    localStorage.setItem(getSuspensionStorageKey(userId), JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save suspension data:', err);
  }
}

function isCurrentlySuspended(data: SuspensionData): boolean {
  if (data.accountDisabled) return true;
  if (!data.currentlySuspended) return false;

  // Check if the latest active violation has expired
  const activeViolation = [...data.violations]
    .reverse()
    .find((v) => !v.reinstated);

  if (!activeViolation) return false;

  const days = DURATION_DAYS[activeViolation.duration];
  if (days === null) return true; // indefinite

  const suspendDate = new Date(activeViolation.date);
  const expiryDate = new Date(suspendDate.getTime() + days * 24 * 60 * 60 * 1000);
  return new Date() < expiryDate;
}

function getSuspensionReturnDate(data: SuspensionData): string | null {
  const activeViolation = [...data.violations]
    .reverse()
    .find((v) => !v.reinstated);

  if (!activeViolation) return null;

  const days = DURATION_DAYS[activeViolation.duration];
  if (days === null) return null; // indefinite

  const suspendDate = new Date(activeViolation.date);
  const expiryDate = new Date(suspendDate.getTime() + days * 24 * 60 * 60 * 1000);
  return expiryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getViolationSeverity(count: number): { color: string; label: string; bgColor: string } {
  if (count >= 3) return { color: 'text-red-400', label: 'At risk of removal', bgColor: 'bg-red-400/10' };
  if (count === 2) return { color: 'text-orange-400', label: '2 violations', bgColor: 'bg-orange-400/10' };
  if (count === 1) return { color: 'text-amber-400', label: '1 violation', bgColor: 'bg-amber-400/10' };
  return { color: 'text-gray-500', label: 'Clean record', bgColor: 'bg-gray-500/10' };
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

const ROLE_LABELS: Record<UserRole, { label: string; color: string }> = {
  admin: { label: 'Admin', color: 'text-red-400 bg-red-400/10' },
  editor: { label: 'Editor', color: 'text-purple-400 bg-purple-400/10' },
  writer: { label: 'Writer', color: 'text-blue-400 bg-blue-400/10' },
  artist: { label: 'Artist', color: 'text-pink-400 bg-pink-400/10' },
  producer: { label: 'Producer', color: 'text-emerald-400 bg-emerald-400/10' },
  reader: { label: 'Reader', color: 'text-gray-400 bg-gray-400/10' },
};

const ALL_BRANDS: Brand[] = ['saucecaviar', 'trapglow', 'saucewire', 'trapfrequency'];

// ======================== AVATAR COMPONENT ========================

function Avatar({
  name,
  avatarUrl,
  size = 'md',
  round = false,
  className = '',
}: {
  name: string;
  avatarUrl: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  round?: boolean;
  className?: string;
}) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const sizeClasses = {
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-16 h-16 text-lg',
  };

  const borderRadius = round ? 'rounded-full' : 'rounded-xl';

  if (avatarUrl) {
    return (
      <div className={`${sizeClasses[size]} ${borderRadius} overflow-hidden flex-shrink-0 border border-white/10 ${className}`}>
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.classList.add(
                'bg-gradient-to-br', 'from-blue-500/20', 'to-purple-500/20',
                'flex', 'items-center', 'justify-center', 'font-bold', 'text-white'
              );
              parent.textContent = initials;
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${borderRadius} bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
    >
      {initials}
    </div>
  );
}

// ======================== HELPERS ========================

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ======================== CREATE WRITER MODAL ========================

function CreateWriterModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(generateTempPassword());
  const [role, setRole] = useState<'writer' | 'editor'>('writer');
  const [brandAffiliations, setBrandAffiliations] = useState<Brand[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const toggleBrand = (brand: Brand) => {
    setBrandAffiliations((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Name, email, and password are required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim(),
          role,
          brand_affiliations: brandAffiliations,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setSuccessData({
        email: data.credentials.email,
        password: data.credentials.temporary_password,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create writer');
    } finally {
      setSaving(false);
    }
  };

  const copyCredentials = () => {
    if (!successData) return;
    navigator.clipboard.writeText(
      `Email: ${successData.email}\nTemporary Password: ${successData.password}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-panel-solid shadow-2xl shadow-black/50"
      >
        {/* Success State */}
        {successData ? (
          <div className="p-6 space-y-5">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center"
              >
                <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h2 className="text-xl font-bold text-white mb-2">Writer Created!</h2>
              <p className="text-sm text-gray-400">Share these temporary credentials with the new writer.</p>
            </div>

            <div className="p-4 bg-admin-bg/60 rounded-lg border border-admin-border space-y-3">
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-white font-mono">{successData.email}</p>
              </div>
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Temporary Password</p>
                <p className="text-sm text-white font-mono">{successData.password}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyCredentials}
                className="flex-1 admin-btn-primary flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Credentials
                  </>
                )}
              </button>
              <button onClick={onClose} className="admin-btn-ghost">
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit}>
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Create Writer</h2>
                  <p className="text-xs text-gray-500">Invite a new contributor</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
                >
                  {error}
                </motion.div>
              )}

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="admin-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="writer@example.com"
                  className="admin-input text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Temporary Password</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="admin-input text-sm font-mono flex-1"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setPassword(generateTempPassword())}
                    className="admin-btn-ghost text-xs whitespace-nowrap"
                  >
                    Regenerate
                  </button>
                </div>
                <p className="text-xs text-gray-600 mt-1">They should change this on first login</p>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'writer' | 'editor')}
                  className="admin-input text-sm"
                >
                  <option value="writer">Writer</option>
                  <option value="editor">Editor</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 block">Brand Affiliations</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_BRANDS.map((brand) => {
                    const isSelected = brandAffiliations.includes(brand);
                    return (
                      <label
                        key={brand}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-white/20 bg-white/[0.06]'
                            : 'border-admin-border bg-admin-bg/40 hover:border-white/10'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleBrand(brand)}
                          className="sr-only"
                        />
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                            isSelected
                              ? 'border-transparent'
                              : 'border-gray-600'
                          }`}
                          style={isSelected ? { backgroundColor: BRAND_COLORS[brand] } : {}}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND_COLORS[brand] }} />
                          <span className="text-sm text-gray-300">{BRAND_NAMES[brand]}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="admin-btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="admin-btn-primary flex items-center gap-2">
                {saving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Create Writer
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ======================== SUSPEND WRITER MODAL ========================

function SuspendWriterModal({
  writer,
  onClose,
  onSuspended,
}: {
  writer: WriterItem;
  onClose: () => void;
  onSuspended: () => void;
}) {
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState<SuspensionDuration>('7d');
  const [notifyWriter, setNotifyWriter] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Suspension reason is required');
      return;
    }

    const data = loadSuspensionData(writer.id);

    const violation: ViolationRecord = {
      id: `v-${Date.now()}`,
      date: new Date().toISOString(),
      reason: reason.trim(),
      duration,
      reinstated: false,
      reinstateDate: null,
      reinstateNote: null,
    };

    data.violations.push(violation);
    data.currentlySuspended = true;

    saveSuspensionData(writer.id, data);
    onSuspended();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
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
        className="relative w-full max-w-md glass-panel-solid shadow-2xl shadow-black/50"
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Suspend Account</h2>
              <p className="text-xs text-gray-500">Suspending {writer.name}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">
              Reason for Suspension *
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              rows={3}
              placeholder="Describe the reason for this suspension..."
              className="admin-input text-sm resize-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">
              Suspension Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as SuspensionDuration)}
              className="admin-input text-sm"
            >
              {(Object.keys(DURATION_LABELS) as SuspensionDuration[]).map((d) => (
                <option key={d} value={d}>{DURATION_LABELS[d]}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <div>
              <p className="text-sm text-white font-medium">Notify Writer</p>
              <p className="text-xs text-gray-500 mt-0.5">Send an email notification about the suspension</p>
            </div>
            <button
              type="button"
              onClick={() => setNotifyWriter(!notifyWriter)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                notifyWriter ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                animate={{ left: notifyWriter ? '22px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Warning */}
          <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 text-sm mt-0.5">⚠️</span>
              <p className="text-xs text-amber-400/80">
                Suspended writers cannot log in, create content, or access the dashboard until reinstated or the suspension expires.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
          <button onClick={onClose} className="admin-btn-ghost">
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleConfirm}
            className="admin-btn-danger flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Confirm Suspension
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================== REINSTATE WRITER MODAL ========================

function ReinstateWriterModal({
  writer,
  onClose,
  onReinstated,
}: {
  writer: WriterItem;
  onClose: () => void;
  onReinstated: () => void;
}) {
  const [note, setNote] = useState('');

  const handleConfirm = () => {
    const data = loadSuspensionData(writer.id);

    // Find the latest active (non-reinstated) violation and mark it reinstated
    const activeViolation = [...data.violations]
      .reverse()
      .find((v) => !v.reinstated);

    if (activeViolation) {
      activeViolation.reinstated = true;
      activeViolation.reinstateDate = new Date().toISOString();
      activeViolation.reinstateNote = note.trim() || null;
    }

    data.currentlySuspended = false;
    saveSuspensionData(writer.id, data);
    onReinstated();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
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
        className="relative w-full max-w-md glass-panel-solid shadow-2xl shadow-black/50"
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Reinstate Writer</h2>
              <p className="text-xs text-gray-500">Lift suspension for {writer.name}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">
              Reinstatement Note (Optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Optional note about the reinstatement..."
              className="admin-input text-sm resize-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 text-sm mt-0.5">✅</span>
              <p className="text-xs text-emerald-400/80">
                This will lift the active suspension. The writer will regain access to the dashboard immediately. The violation will remain on their record.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
          <button onClick={onClose} className="admin-btn-ghost">
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleConfirm}
            className="admin-btn-success flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Reinstate
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ======================== WRITER DETAIL ========================

function WriterDetail({
  writer,
  onClose,
  onRoleChange,
  onVerifyToggle,
  onShowOnSiteToggle,
  onRefresh,
}: {
  writer: WriterItem;
  onClose: () => void;
  onRoleChange: (id: string, role: UserRole) => void;
  onVerifyToggle: (id: string, verified: boolean) => void;
  onShowOnSiteToggle: (id: string, showOnSite: boolean) => void;
  onRefresh: () => void;
}) {
  const roleInfo = ROLE_LABELS[writer.role];
  const [activeTab, setActiveTab] = useState<'profile' | 'articles' | 'moderation' | 'edit'>('profile');
  const [suspensionData, setSuspensionData] = useState<SuspensionData>(() => loadSuspensionData(writer.id));
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showReinstateModal, setShowReinstateModal] = useState(false);

  // Re-derive suspension status whenever data changes
  const isSuspended = isCurrentlySuspended(suspensionData);
  const violationCount = suspensionData.violations.length;
  const severity = getViolationSeverity(violationCount);
  const returnDate = getSuspensionReturnDate(suspensionData);

  const refreshSuspensionData = () => {
    setSuspensionData(loadSuspensionData(writer.id));
  };

  const handleRemoveAccess = () => {
    if (!confirm(`Are you sure you want to permanently disable ${writer.name}'s account? This cannot be undone.`)) return;
    const data = loadSuspensionData(writer.id);
    data.accountDisabled = true;
    data.currentlySuspended = true;
    saveSuspensionData(writer.id, data);
    refreshSuspensionData();
  };
  const [articles, setArticles] = useState<WriterArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [editName, setEditName] = useState(writer.name);
  const [editBio, setEditBio] = useState(writer.bio);
  const [editAvatarUrl, setEditAvatarUrl] = useState(writer.avatar_url || '');
  const [editBrands, setEditBrands] = useState<Brand[]>(writer.brand_affiliations);
  const [editShowOnSite, setEditShowOnSite] = useState(writer.show_on_site);
  const [editSaving, setEditSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoadingArticles(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data } = await supabase
        .from('articles')
        .select('id, title, brand, status, created_at, view_count')
        .eq('author_id', writer.id)
        .order('created_at', { ascending: false })
        .limit(20);
      setArticles((data as WriterArticle[]) || []);
    } catch (err) {
      console.error('Fetch writer articles error:', err);
    } finally {
      setLoadingArticles(false);
    }
  }, [writer.id]);

  useEffect(() => {
    if (activeTab === 'articles') {
      fetchArticles();
    }
  }, [activeTab, fetchArticles]);

  // Crop image to square (center crop) and convert to WebP for optimal size
  const cropToSquare = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const size = Math.min(img.width, img.height);
        const canvas = document.createElement('canvas');
        // Output at 512x512 max for profile pics
        const outputSize = Math.min(size, 512);
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        // Center crop
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        ctx.drawImage(img, sx, sy, size, size, 0, 0, outputSize, outputSize);
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
          'image/webp',
          0.85
        );
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')); };
      img.src = url;
    });
  };

  const processAvatarFile = async (file: File) => {
    // Validate file type — only jpg/png/webp
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Please select a JPG, PNG, or WebP image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be under 2MB');
      return;
    }

    setAvatarUploading(true);
    try {
      // Crop to square and convert to webp
      const croppedBlob = await cropToSquare(file);

      const supabase = getSupabaseBrowserClient();
      // Store in `avatars` bucket — one file per user, upsert replaces old photo
      const filePath = `${writer.id}.webp`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedBlob, {
          upsert: true,
          contentType: 'image/webp',
        });

      if (uploadError) throw uploadError;

      // Get the PUBLIC url — this same URL is used on all front-end brand sites
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        // Append cache-bust to force refresh in browser
        setEditAvatarUrl(`${urlData.publicUrl}?t=${Date.now()}`);
      }
    } catch (err) {
      console.error('Avatar upload error:', err);
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}. You can also paste a URL directly.`);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processAvatarFile(file);
  };

  const handleAvatarDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processAvatarFile(file);
  };

  const handleSaveEdit = async () => {
    setEditSaving(true);
    try {
      const supabase = getSupabaseBrowserClient();
      // Strip cache-bust query params from avatar URL before saving to DB.
      // The stored URL must be a clean public URL usable by all front-end sites.
      let cleanAvatarUrl = editAvatarUrl.trim() || null;
      if (cleanAvatarUrl) {
        try {
          const urlObj = new URL(cleanAvatarUrl);
          urlObj.searchParams.delete('t');
          cleanAvatarUrl = urlObj.toString();
        } catch {
          // Not a valid URL — keep as-is (could be a relative path)
        }
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          name: editName.trim(),
          bio: editBio.trim() || null,
          avatar_url: cleanAvatarUrl,
          brand_affiliations: editBrands,
          show_on_site: editShowOnSite,
        })
        .eq('id', writer.id);
      if (updateError) throw updateError;
      onRefresh();
      setActiveTab('profile');
    } catch (err) {
      console.error('Save edit error:', err);
      alert(`Failed to save: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setEditSaving(false);
    }
  };

  const toggleEditBrand = (brand: Brand) => {
    setEditBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Quick-toggle brand access from Profile tab (saves to DB immediately)
  const [brandSaving, setBrandSaving] = useState<Brand | null>(null);
  const handleBrandToggle = async (brand: Brand) => {
    setBrandSaving(brand);
    try {
      const supabase = getSupabaseBrowserClient();
      const current = writer.brand_affiliations;
      const updated = current.includes(brand)
        ? current.filter((b: Brand) => b !== brand)
        : [...current, brand];
      const { error: updateError } = await supabase
        .from('users')
        .update({ brand_affiliations: updated })
        .eq('id', writer.id);
      if (updateError) throw updateError;
      // Also sync edit state so Edit tab stays consistent
      setEditBrands(updated);
      onRefresh();
    } catch (err) {
      console.error('Brand toggle error:', err);
    } finally {
      setBrandSaving(null);
    }
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
        className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto glass-panel-solid shadow-2xl shadow-black/50"
      >
        {/* Header with avatar */}
        <div className="px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-start gap-4">
            <Avatar name={writer.name} avatarUrl={writer.avatar_url} size="xl" round />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-white">{writer.name}</h2>
                {writer.is_verified && (
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )}
                {writer.show_on_site && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400">
                    Public
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400 font-mono">{writer.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
                {isSuspended && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20">
                    SUSPENDED
                  </span>
                )}
                {!isSuspended && violationCount > 0 && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${severity.bgColor} ${severity.color}`}>
                    {violationCount} violation{violationCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Suspension banner in header */}
          {isSuspended && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-red-400">
                    {suspensionData.accountDisabled ? 'Account Permanently Disabled' : 'Account Suspended'}
                  </p>
                  {returnDate && !suspensionData.accountDisabled && (
                    <p className="text-[10px] text-red-400/60 mt-0.5">Returns: {returnDate}</p>
                  )}
                </div>
                {!suspensionData.accountDisabled && (
                  <button
                    onClick={() => setShowReinstateModal(true)}
                    className="text-[10px] font-medium text-emerald-400 hover:text-emerald-300 transition-colors px-2 py-1 rounded bg-emerald-400/10 hover:bg-emerald-400/20"
                  >
                    Reinstate
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 mt-4 -mb-4 border-b border-white/[0.04]">
            {(['profile', 'articles', 'moderation', 'edit'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2.5 text-xs font-medium transition-colors capitalize ${
                  activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {tab}
                  {tab === 'moderation' && violationCount > 0 && (
                    <span className={`text-[9px] font-mono px-1 py-px rounded-full ${severity.bgColor} ${severity.color}`}>
                      {violationCount}
                    </span>
                  )}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="writer-detail-tab"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {/* Profile tab */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1.5">Bio</p>
                <p className="text-sm text-gray-300 leading-relaxed">{writer.bio || 'No bio provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-admin-bg/40 rounded-lg text-center border border-admin-border">
                  <p className="text-lg font-bold text-white">{writer.articles_count}</p>
                  <p className="text-xs text-gray-500">Articles</p>
                </div>
                <div className="p-3 bg-admin-bg/40 rounded-lg text-center border border-admin-border">
                  <p className="text-lg font-bold text-white">{formatViews(writer.views_total)}</p>
                  <p className="text-xs text-gray-500">Total Views</p>
                </div>
              </div>

              {/* Brand Access */}
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Brand Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_BRANDS.map((brand) => {
                    const hasAccess = writer.brand_affiliations.includes(brand);
                    const isSaving = brandSaving === brand;
                    return (
                      <button
                        key={brand}
                        onClick={() => handleBrandToggle(brand)}
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                          hasAccess
                            ? 'bg-white/[0.04] border-white/[0.08] hover:border-white/[0.15]'
                            : 'bg-transparent border-white/[0.03] opacity-40 hover:opacity-70 hover:border-white/[0.08]'
                        } ${isSaving ? 'opacity-50 pointer-events-none' : ''}`}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors"
                          style={{
                            backgroundColor: hasAccess ? BRAND_COLORS[brand] : '#4B5563',
                            boxShadow: hasAccess ? `0 0 6px ${BRAND_COLORS[brand]}40` : 'none',
                          }}
                        />
                        <span className={hasAccess ? 'text-gray-300' : 'text-gray-600'}>
                          {BRAND_NAMES[brand]}
                        </span>
                        {isSaving ? (
                          <span className="w-3 h-3 ml-auto border border-gray-500 border-t-white rounded-full animate-spin" />
                        ) : hasAccess ? (
                          <svg className="w-3 h-3 ml-auto text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 ml-auto text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                {writer.brand_affiliations.length === 0 && (
                  <p className="text-xs text-amber-400 mt-2">⚠️ No brand access granted — user cannot create content for any brand</p>
                )}
              </div>

              {/* Public Profile Status */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-sm text-white font-medium">Public Profile</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {writer.show_on_site
                      ? 'Profile visible on brand sites & article bylines'
                      : 'Profile hidden from public sites'}
                  </p>
                </div>
                <span className={`text-xs font-mono px-2 py-1 rounded ${
                  writer.show_on_site
                    ? 'bg-emerald-400/10 text-emerald-400'
                    : 'bg-gray-500/10 text-gray-500'
                }`}>
                  {writer.show_on_site ? 'Visible' : 'Hidden'}
                </span>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Joined</p>
                  <p className="text-sm text-gray-300 font-mono">
                    {new Date(writer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                  <p className="text-sm text-gray-300 font-mono">
                    {new Date(writer.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Articles tab */}
          {activeTab === 'articles' && (
            <div className="space-y-3">
              {loadingArticles ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 bg-admin-bg/40 rounded-lg animate-pulse">
                      <div className="h-4 w-3/4 bg-white/5 rounded mb-2" />
                      <div className="h-3 w-1/3 bg-white/5 rounded" />
                    </div>
                  ))}
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">No articles yet</p>
                </div>
              ) : (
                articles.map((article) => (
                  <div
                    key={article.id}
                    className="p-3 bg-admin-bg/40 rounded-lg border border-admin-border hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-medium text-white truncate">{article.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="font-mono" style={{ color: BRAND_COLORS[article.brand] }}>
                            {BRAND_NAMES[article.brand]}
                          </span>
                          <span>•</span>
                          <span className={`px-1.5 py-0.5 rounded font-mono ${
                            article.status === 'published'
                              ? 'text-emerald-400 bg-emerald-400/10'
                              : article.status === 'pending_review'
                              ? 'text-amber-400 bg-amber-400/10'
                              : 'text-gray-400 bg-gray-400/10'
                          }`}>
                            {article.status.replace('_', ' ')}
                          </span>
                          <span>•</span>
                          <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-gray-600 flex-shrink-0">
                        {formatViews(article.view_count)} views
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Moderation tab */}
          {activeTab === 'moderation' && (
            <div className="space-y-5">
              {/* Status Overview */}
              <div className={`p-4 rounded-lg border ${
                suspensionData.accountDisabled
                  ? 'bg-red-500/5 border-red-500/20'
                  : isSuspended
                  ? 'bg-amber-500/5 border-amber-500/20'
                  : 'bg-emerald-500/5 border-emerald-500/20'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      suspensionData.accountDisabled ? 'bg-red-500' : isSuspended ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                    }`} />
                    <div>
                      <p className={`text-sm font-medium ${
                        suspensionData.accountDisabled ? 'text-red-400' : isSuspended ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {suspensionData.accountDisabled
                          ? 'Account Permanently Disabled'
                          : isSuspended
                          ? 'Currently Suspended'
                          : 'Account Active'}
                      </p>
                      {isSuspended && returnDate && !suspensionData.accountDisabled && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          Returns: <span className="text-white font-mono">{returnDate}</span>
                        </p>
                      )}
                      {isSuspended && !returnDate && !suspensionData.accountDisabled && (
                        <p className="text-xs text-gray-500 mt-0.5">Indefinite — requires manual reinstatement</p>
                      )}
                    </div>
                  </div>
                  {!suspensionData.accountDisabled && (
                    isSuspended ? (
                      <button
                        onClick={() => setShowReinstateModal(true)}
                        className="admin-btn-success text-xs flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Reinstate
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowSuspendModal(true)}
                        className="admin-btn-danger text-xs flex items-center gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Suspend
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Violation Counter */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-admin-bg/40 rounded-lg text-center border border-admin-border">
                  <p className={`text-lg font-bold ${severity.color}`}>{violationCount}</p>
                  <p className="text-xs text-gray-500">Violations</p>
                </div>
                <div className="p-3 bg-admin-bg/40 rounded-lg text-center border border-admin-border">
                  <p className="text-lg font-bold text-white">
                    {suspensionData.violations.filter((v) => v.reinstated).length}
                  </p>
                  <p className="text-xs text-gray-500">Reinstated</p>
                </div>
                <div className="p-3 bg-admin-bg/40 rounded-lg text-center border border-admin-border">
                  <p className="text-lg font-bold text-white">
                    {Math.max(0, MAX_VIOLATIONS_BEFORE_REMOVAL - violationCount)}
                  </p>
                  <p className="text-xs text-gray-500">Remaining</p>
                </div>
              </div>

              {/* Risk level escalation */}
              {violationCount > 0 && (
                <div className={`p-3 rounded-lg border ${
                  violationCount >= 3
                    ? 'bg-red-500/5 border-red-500/20'
                    : violationCount === 2
                    ? 'bg-orange-500/5 border-orange-500/20'
                    : 'bg-amber-500/5 border-amber-500/20'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${
                      violationCount >= 3 ? 'text-red-400' : violationCount === 2 ? 'text-orange-400' : 'text-amber-400'
                    }`}>
                      {violationCount >= 3 ? '🚨' : violationCount === 2 ? '⚠️' : '⚡'}
                    </span>
                    <p className={`text-xs font-medium ${severity.color}`}>
                      {severity.label}
                      {violationCount >= MAX_VIOLATIONS_BEFORE_REMOVAL && ' — Eligible for permanent removal'}
                    </p>
                  </div>
                </div>
              )}

              {/* Remove Access button (at threshold) */}
              {violationCount >= MAX_VIOLATIONS_BEFORE_REMOVAL && !suspensionData.accountDisabled && (
                <motion.button
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRemoveAccess}
                  className="w-full p-3 rounded-lg bg-red-600/20 border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-600/30 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Access Permanently
                </motion.button>
              )}

              {/* Violation History */}
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2">Violation History</p>
                {suspensionData.violations.length === 0 ? (
                  <div className="p-6 text-center bg-admin-bg/20 rounded-lg border border-admin-border">
                    <p className="text-3xl mb-2">✨</p>
                    <p className="text-sm text-gray-400">Clean record</p>
                    <p className="text-xs text-gray-600 mt-1">No violations on file</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...suspensionData.violations].reverse().map((violation, i) => (
                      <motion.div
                        key={violation.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`p-3 rounded-lg border ${
                          violation.reinstated
                            ? 'bg-admin-bg/20 border-admin-border'
                            : 'bg-red-500/5 border-red-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                violation.reinstated ? 'bg-gray-500' : 'bg-red-500'
                              }`} />
                              <span className="text-xs font-mono text-gray-500">
                                {new Date(violation.date).toLocaleDateString('en-US', {
                                  month: 'short', day: 'numeric', year: 'numeric',
                                })}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-500">
                                {DURATION_LABELS[violation.duration]}
                              </span>
                              {violation.reinstated && (
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400">
                                  Reinstated
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-300">{violation.reason}</p>
                            {violation.reinstated && violation.reinstateDate && (
                              <div className="mt-2 pt-2 border-t border-white/[0.04]">
                                <p className="text-[10px] text-gray-600">
                                  Reinstated on{' '}
                                  <span className="text-gray-500">
                                    {new Date(violation.reinstateDate).toLocaleDateString('en-US', {
                                      month: 'short', day: 'numeric', year: 'numeric',
                                    })}
                                  </span>
                                  {violation.reinstateNote && (
                                    <> — &ldquo;{violation.reinstateNote}&rdquo;</>
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit tab */}
          {activeTab === 'edit' && (
            <div className="space-y-5">
              {/* Profile Picture Section */}
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-2 block">Profile Picture</label>
                <div className="flex items-start gap-4">
                  {/* Avatar with click-to-upload and drag-and-drop */}
                  <div
                    className={`relative group flex-shrink-0 ${dragOver ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleAvatarDrop}
                  >
                    {/* Circular preview container */}
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-white/20 transition-colors">
                      {editAvatarUrl ? (
                        <img
                          src={editAvatarUrl}
                          alt={editName || writer.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-white">
                          {(editName || writer.name).split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* Overlay — click or drag to upload */}
                    <label className={`absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center cursor-pointer transition-opacity ${
                      dragOver ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={handleAvatarUpload}
                        className="sr-only"
                        disabled={avatarUploading}
                      />
                      {avatarUploading ? (
                        <svg className="w-5 h-5 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : dragOver ? (
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      <span className="text-[8px] text-white/70 mt-0.5 font-medium">
                        {dragOver ? 'Drop' : 'Upload'}
                      </span>
                    </label>
                  </div>
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={editAvatarUrl}
                      onChange={(e) => setEditAvatarUrl(e.target.value)}
                      placeholder="https://... or upload an image"
                      className="admin-input text-sm font-mono"
                    />
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                      📸 This photo will appear as your <strong className="text-white">author photo on all brand sites</strong> you&apos;re assigned to — article bylines, team pages, and author cards.
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1">
                      JPG, PNG, or WebP · Max 2MB · Auto-cropped to square · Click avatar or drag &amp; drop
                    </p>
                    {editAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditAvatarUrl('')}
                        className="text-[10px] text-red-400 hover:text-red-300 mt-1.5 transition-colors"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Name & Email */}
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="admin-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Email</label>
                <input
                  type="email"
                  value={writer.email}
                  disabled
                  className="admin-input text-sm text-gray-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-600 mt-1">Email is tied to authentication and cannot be changed here</p>
              </div>

              {/* Bio */}
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="admin-input text-sm resize-none"
                  placeholder="Writer bio — displayed on public profile and article bylines..."
                />
              </div>

              {/* Brand Access — This is critical */}
              <div>
                <label className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-1 block">Brand Access</label>
                <p className="text-[10px] text-gray-600 mb-2">Controls which brand sites this user can create content for. No access = cannot work on that brand.</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_BRANDS.map((brand) => {
                    const isSelected = editBrands.includes(brand);
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => toggleEditBrand(brand)}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                          isSelected
                            ? 'border-white/20 bg-white/[0.06]'
                            : 'border-admin-border bg-admin-bg/40 hover:border-white/10'
                        }`}
                      >
                        <div
                          className={`w-8 h-5 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
                            isSelected ? '' : 'bg-gray-700'
                          }`}
                          style={isSelected ? { backgroundColor: BRAND_COLORS[brand] } : undefined}
                        >
                          <motion.div
                            className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                            animate={{ left: isSelected ? '14px' : '2px' }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          />
                        </div>
                        <div className="flex items-center gap-1.5 min-w-0">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: BRAND_COLORS[brand] }} />
                          <span className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                            {BRAND_NAMES[brand]}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {editBrands.length === 0 && (
                  <p className="text-xs text-amber-400 mt-2">⚠️ No brand access — this user won&apos;t be able to create content</p>
                )}
              </div>

              {/* Show on Site Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-sm text-white font-medium">Show on Site</p>
                  <p className="text-xs text-gray-500 mt-0.5">Display profile on public team page & article bylines</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditShowOnSite(!editShowOnSite)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    editShowOnSite ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <motion.div
                    className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                    animate={{ left: editShowOnSite ? '22px' : '2px' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              {/* Role (read-only in edit, changeable in profile actions) */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <p className="text-sm text-white font-medium">Role</p>
                  <p className="text-xs text-gray-500 mt-0.5">Change role from the Profile tab actions</p>
                </div>
                <span className={`text-xs font-mono px-2 py-0.5 rounded ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>

              <button
                onClick={handleSaveEdit}
                disabled={editSaving}
                className="admin-btn-primary w-full flex items-center justify-center gap-2"
              >
                {editSaving ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          )}
        </div>

        {/* Actions (visible in profile tab) */}
        {activeTab === 'profile' && (
          <div className="px-6 py-4 border-t border-white/[0.06] space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <select
                  value={writer.role}
                  onChange={(e) => onRoleChange(writer.id, e.target.value as UserRole)}
                  className="admin-input text-xs py-1.5 px-2 w-auto"
                >
                  <option value="reader">Reader</option>
                  <option value="writer">Writer</option>
                  <option value="editor">Editor</option>
                  <option value="artist">Artist</option>
                  <option value="producer">Producer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShowOnSiteToggle(writer.id, !writer.show_on_site)}
                  className={`text-xs flex items-center gap-1.5 ${
                    writer.show_on_site ? 'admin-btn-ghost' : 'admin-btn-ghost'
                  }`}
                  title={writer.show_on_site ? 'Hide from public sites' : 'Show on public sites'}
                >
                  {writer.show_on_site ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Public
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      Hidden
                    </>
                  )}
                </button>
                <button
                  onClick={() => onVerifyToggle(writer.id, !writer.is_verified)}
                  className={`text-xs flex items-center gap-1.5 ${
                    writer.is_verified ? 'admin-btn-ghost' : 'admin-btn-primary'
                  }`}
                >
                  {writer.is_verified ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Unverify
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verify
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Suspend / Reinstate action */}
            {!suspensionData.accountDisabled && (
              <div className="pt-2 border-t border-white/[0.06]">
                {isSuspended ? (
                  <button
                    onClick={() => setShowReinstateModal(true)}
                    className="w-full admin-btn-success text-xs flex items-center justify-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Reinstate Writer
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSuspendModal(true)}
                    className="w-full text-xs flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Suspend Account
                    {violationCount > 0 && (
                      <span className={`text-[9px] font-mono px-1 py-px rounded-full ${severity.bgColor} ${severity.color}`}>
                        {violationCount} prior
                      </span>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Suspend Modal */}
        <AnimatePresence>
          {showSuspendModal && (
            <SuspendWriterModal
              writer={writer}
              onClose={() => setShowSuspendModal(false)}
              onSuspended={() => {
                setShowSuspendModal(false);
                refreshSuspensionData();
              }}
            />
          )}
        </AnimatePresence>

        {/* Reinstate Modal */}
        <AnimatePresence>
          {showReinstateModal && (
            <ReinstateWriterModal
              writer={writer}
              onClose={() => setShowReinstateModal(false)}
              onReinstated={() => {
                setShowReinstateModal(false);
                refreshSuspensionData();
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ======================== MAIN COMPONENT ========================

export function WritersPage() {
  const [writers, setWriters] = useState<WriterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterBrand, setFilterBrand] = useState<Brand | 'all'>('all');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [selectedWriter, setSelectedWriter] = useState<WriterItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchWriters = useCallback(async () => {
    try {
      setLoading(true);
      const supabase = getSupabaseBrowserClient();

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const { data: articleCounts } = await supabase
        .from('articles')
        .select('author_id');

      const authorArticleCounts: Record<string, number> = {};
      if (articleCounts) {
        for (const a of articleCounts) {
          if (a.author_id) {
            authorArticleCounts[a.author_id] = (authorArticleCounts[a.author_id] || 0) + 1;
          }
        }
      }

      const { data: viewData } = await supabase
        .from('articles')
        .select('author_id, view_count');

      const authorViewCounts: Record<string, number> = {};
      if (viewData) {
        for (const a of viewData) {
          if (a.author_id) {
            authorViewCounts[a.author_id] = (authorViewCounts[a.author_id] || 0) + (a.view_count || 0);
          }
        }
      }

      const mapped: WriterItem[] = (usersData || []).map((u) => ({
        id: u.id,
        name: u.name || 'Unknown',
        email: u.email || '',
        role: u.role as UserRole,
        avatar_url: u.avatar_url,
        bio: u.bio || '',
        brand_affiliations: u.brand_affiliations || [],
        is_verified: u.is_verified || false,
        show_on_site: u.show_on_site || false,
        articles_count: authorArticleCounts[u.id] || 0,
        views_total: authorViewCounts[u.id] || 0,
        created_at: u.created_at,
        updated_at: u.updated_at,
        links: u.links || {},
      }));

      setWriters(mapped);
      setError(null);
    } catch (err) {
      console.error('Fetch writers error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load writers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWriters();
  }, [fetchWriters]);

  const handleRoleChange = async (id: string, role: UserRole) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from('users')
        .update({ role })
        .eq('id', id);

      if (updateError) throw updateError;

      setWriters((prev) => prev.map((w) => (w.id === id ? { ...w, role } : w)));
      if (selectedWriter?.id === id) {
        setSelectedWriter((prev) => prev ? { ...prev, role } : null);
      }
    } catch (err) {
      console.error('Role change error:', err);
      alert(`Failed to update role: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleVerifyToggle = async (id: string, verified: boolean) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_verified: verified })
        .eq('id', id);

      if (updateError) throw updateError;

      setWriters((prev) => prev.map((w) => (w.id === id ? { ...w, is_verified: verified } : w)));
      if (selectedWriter?.id === id) {
        setSelectedWriter((prev) => prev ? { ...prev, is_verified: verified } : null);
      }
    } catch (err) {
      console.error('Verify toggle error:', err);
      alert(`Failed to update verification: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleShowOnSiteToggle = async (id: string, showOnSite: boolean) => {
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: updateError } = await supabase
        .from('users')
        .update({ show_on_site: showOnSite })
        .eq('id', id);

      if (updateError) throw updateError;

      setWriters((prev) => prev.map((w) => (w.id === id ? { ...w, show_on_site: showOnSite } : w)));
      if (selectedWriter?.id === id) {
        setSelectedWriter((prev) => prev ? { ...prev, show_on_site: showOnSite } : null);
      }
    } catch (err) {
      console.error('Show on site toggle error:', err);
      alert(`Failed to update: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const filtered = writers.filter((w) => {
    if (filterRole !== 'all' && w.role !== filterRole) return false;
    if (filterBrand !== 'all' && !w.brand_affiliations.includes(filterBrand)) return false;
    if (filterVerified === 'verified' && !w.is_verified) return false;
    if (filterVerified === 'unverified' && w.is_verified) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return w.name.toLowerCase().includes(q) || w.email.toLowerCase().includes(q) || w.bio.toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all: writers.length,
    writers: writers.filter((w) => w.role === 'writer').length,
    editors: writers.filter((w) => w.role === 'editor').length,
    admins: writers.filter((w) => w.role === 'admin').length,
    verified: writers.filter((w) => w.is_verified).length,
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
            {loading ? 'Loading...' : `Manage ${writers.length} contributors across all brands`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-btn-primary flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Create Writer
          </button>
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

      {/* Error banner */}
      {error && (
        <div className="glass-panel p-4 border-red-500/20 bg-red-500/5">
          <div className="flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={fetchWriters} className="ml-auto text-xs text-red-300 hover:text-white underline">Retry</button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={loading ? '—' : counts.all}
          change={`${counts.verified} verified`}
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
          label="Writers"
          value={loading ? '—' : counts.writers}
          change="active contributors"
          changeType="up"
          color="#10B981"
          index={1}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          }
        />
        <StatCard
          label="Editors"
          value={loading ? '—' : counts.editors}
          change="content managers"
          changeType="neutral"
          color="#8B5CF6"
          index={2}
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          label="Total Views"
          value={loading ? '—' : formatViews(writers.reduce((sum, w) => sum + w.views_total, 0))}
          change="all authors"
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

      {/* Role tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] pb-px">
        {([
          { key: 'all' as const, label: 'All Users' },
          { key: 'writer' as const, label: 'Writers' },
          { key: 'editor' as const, label: 'Editors' },
          { key: 'admin' as const, label: 'Admins' },
          { key: 'artist' as const, label: 'Artists' },
          { key: 'producer' as const, label: 'Producers' },
        ]).map((tab) => {
          const isActive = filterRole === tab.key;
          const count = tab.key === 'all' ? writers.length : writers.filter(w => w.role === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setFilterRole(tab.key)}
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
                  layoutId="writers-tab"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
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
        <div className="w-px h-5 bg-white/10" />
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-gray-500">Verified:</span>
          {(['all', 'verified', 'unverified'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setFilterVerified(v)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                filterVerified === v ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-white'
              }`}
            >
              {v === 'all' ? 'All' : v === 'verified' ? '✓ Verified' : '○ Unverified'}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
                </div>
              </div>
              <div className="h-10 bg-white/5 rounded animate-pulse mb-3" />
              <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Writers grid/list */}
      {!loading && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((writer, i) => {
              const roleInfo = ROLE_LABELS[writer.role];
              const writerSuspension = loadSuspensionData(writer.id);
              const writerIsSuspended = isCurrentlySuspended(writerSuspension);
              const writerViolations = writerSuspension.violations.length;
              const writerSeverity = getViolationSeverity(writerViolations);
              return (
                <motion.div
                  key={writer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedWriter(writer)}
                  className={`glass-panel p-5 hover:bg-admin-hover/30 transition-all cursor-pointer group ${
                    writerIsSuspended ? 'opacity-60 grayscale-[30%]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={writer.name} avatarUrl={writer.avatar_url} size="lg" className="group-hover:border-white/20 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-white truncate">{writer.name}</h3>
                        {writer.is_verified && (
                          <svg className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${roleInfo.color}`}>
                          {roleInfo.label}
                        </span>
                        {writer.show_on_site && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-400/10 text-emerald-400">
                            Public
                          </span>
                        )}
                        {writerIsSuspended && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20">
                            SUSPENDED
                          </span>
                        )}
                        {!writerIsSuspended && writerViolations > 0 && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${writerSeverity.bgColor} ${writerSeverity.color}`}>
                            {writerViolations} violation{writerViolations !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{writer.bio || 'No bio'}</p>

                  {/* Brand Access Dots */}
                  <div className="flex gap-1.5 mb-3 flex-wrap">
                    {ALL_BRANDS.map((brand) => {
                      const hasAccess = writer.brand_affiliations.includes(brand);
                      return (
                        <span
                          key={brand}
                          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                            hasAccess ? 'bg-white/[0.04]' : 'bg-transparent opacity-30'
                          }`}
                          title={`${BRAND_NAMES[brand]}: ${hasAccess ? 'Has access' : 'No access'}`}
                        >
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: hasAccess ? BRAND_COLORS[brand] : '#4B5563' }}
                          />
                          <span className={hasAccess ? 'text-gray-400' : 'text-gray-600'}>{BRAND_NAMES[brand]}</span>
                        </span>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-gray-500 pt-3 border-t border-white/[0.04]">
                    <span>{writer.articles_count} articles</span>
                    <span>{formatViews(writer.views_total)} views</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {!loading && viewMode === 'list' && (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((writer, i) => {
              const roleInfo = ROLE_LABELS[writer.role];
              const writerSuspension = loadSuspensionData(writer.id);
              const writerIsSuspended = isCurrentlySuspended(writerSuspension);
              const writerViolations = writerSuspension.violations.length;
              const writerSeverity = getViolationSeverity(writerViolations);
              return (
                <motion.div
                  key={writer.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setSelectedWriter(writer)}
                  className={`glass-panel p-4 hover:bg-admin-hover/30 transition-all cursor-pointer group ${
                    writerIsSuspended ? 'opacity-60 grayscale-[30%]' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <Avatar name={writer.name} avatarUrl={writer.avatar_url} size="md" />
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
                        {writerIsSuspended && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/20">
                            SUSPENDED
                          </span>
                        )}
                        {!writerIsSuspended && writerViolations > 0 && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${writerSeverity.bgColor} ${writerSeverity.color}`}>
                            {writerViolations}
                          </span>
                        )}
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
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-panel p-16 text-center"
        >
          <div className="text-5xl mb-4">✍️</div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {writers.length === 0 ? 'No users yet' : 'No writers found'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery ? `No results for "${searchQuery}".` : writers.length === 0 ? 'Create your first writer to get started.' : 'No writers match the current filters.'}
          </p>
          {writers.length === 0 && (
            <button onClick={() => setShowCreateModal(true)} className="admin-btn-primary flex items-center gap-2 mx-auto">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create First Writer
            </button>
          )}
        </motion.div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {selectedWriter && (
          <WriterDetail
            writer={selectedWriter}
            onClose={() => setSelectedWriter(null)}
            onRoleChange={handleRoleChange}
            onVerifyToggle={handleVerifyToggle}
            onShowOnSiteToggle={handleShowOnSiteToggle}
            onRefresh={() => {
              fetchWriters();
              setSelectedWriter(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Create Writer Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateWriterModal
            onClose={() => setShowCreateModal(false)}
            onCreated={fetchWriters}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
