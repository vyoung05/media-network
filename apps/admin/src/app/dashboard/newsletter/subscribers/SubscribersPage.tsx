'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBrand } from '@/contexts/BrandContext';
import type { Brand, NewsletterSubscriber } from '@media-network/shared';
import { formatTimestamp } from '@media-network/shared';

const BRAND_COLORS: Record<string, string> = {
  saucewire: '#E63946',
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  trapfrequency: '#39FF14',
};

const BRAND_NAMES: Record<string, string> = {
  saucewire: 'SauceWire',
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  trapfrequency: 'TrapFrequency',
};

export function SubscribersPage() {
  const { activeBrand } = useBrand();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState<string>(activeBrand === 'all' ? 'saucewire' : activeBrand);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '25' });
      if (activeBrand !== 'all') params.set('brand', activeBrand);
      if (search) params.set('search', search);

      const res = await fetch(`/api/newsletter/subscribers?${params}`);
      const data = await res.json();
      setSubscribers(data.data || []);
      setTotal(data.count || 0);
      setTotalPages(data.total_pages || 1);
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  }, [activeBrand, search, page]);

  useEffect(() => { fetchSubscribers(); }, [fetchSubscribers]);

  const toggleActive = async (sub: NewsletterSubscriber) => {
    try {
      await fetch('/api/newsletter/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sub.id, is_active: !sub.is_active }),
      });
      fetchSubscribers();
    } catch (err) {
      console.error('Toggle failed:', err);
    }
  };

  const addSubscriber = async () => {
    if (!newEmail) return;
    try {
      await fetch('/api/newsletter/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, name: newName || null, brand: newBrand }),
      });
      setShowAddModal(false);
      setNewEmail('');
      setNewName('');
      fetchSubscribers();
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const exportCSV = () => {
    const headers = 'Email,Name,Brand,Status,Subscribed At\n';
    const rows = subscribers.map(s =>
      `${s.email},${s.name || ''},${s.brand},${s.is_active ? 'Active' : 'Inactive'},${s.subscribed_at}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${activeBrand}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/newsletter" className="text-gray-500 hover:text-white transition-colors">
              ← Newsletter
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2">Subscribers</h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} total subscribers
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="admin-btn-ghost text-sm flex items-center gap-2">
            📥 Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="admin-btn-primary text-sm flex items-center gap-2">
            + Add Subscriber
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="glass-panel p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by email or name..."
          className="admin-input text-sm w-full"
        />
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No subscribers found</p>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left text-xs font-mono text-gray-500 uppercase px-6 py-3">Email</th>
                  <th className="text-left text-xs font-mono text-gray-500 uppercase px-4 py-3">Name</th>
                  <th className="text-left text-xs font-mono text-gray-500 uppercase px-4 py-3">Brand</th>
                  <th className="text-left text-xs font-mono text-gray-500 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-mono text-gray-500 uppercase px-4 py-3">Subscribed</th>
                  <th className="text-right text-xs font-mono text-gray-500 uppercase px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {subscribers.map((sub, i) => (
                  <motion.tr
                    key={sub.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3">
                      <span className="text-sm text-white">{sub.email}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-400">{sub.name || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: BRAND_COLORS[sub.brand] || '#888' }}
                        />
                        {BRAND_NAMES[sub.brand] || sub.brand}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        sub.is_active
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {sub.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(sub.subscribed_at)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => toggleActive(sub)}
                        className={`text-xs px-3 py-1 rounded-md transition-colors ${
                          sub.is_active
                            ? 'text-red-400 hover:bg-red-500/10'
                            : 'text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {sub.is_active ? 'Unsubscribe' : 'Resubscribe'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="admin-btn-ghost text-xs disabled:opacity-30"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="admin-btn-ghost text-xs disabled:opacity-30"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-bold text-white mb-4">Add Subscriber</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email *</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="admin-input text-sm w-full"
                  placeholder="subscriber@example.com"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="admin-input text-sm w-full"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Brand</label>
                <select
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="admin-input text-sm w-full"
                >
                  {Object.entries(BRAND_NAMES).map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="admin-btn-ghost text-sm">
                Cancel
              </button>
              <button onClick={addSubscriber} className="admin-btn-primary text-sm" disabled={!newEmail}>
                Add Subscriber
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
