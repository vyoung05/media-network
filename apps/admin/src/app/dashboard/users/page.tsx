'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrand } from '@/contexts/BrandContext';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'writer' | 'reader';
  avatar_url: string | null;
  bio: string | null;
  brand_affiliations: string[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

const ROLE_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  admin: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  editor: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
  writer: { bg: 'bg-green-500/10', text: 'text-green-400', dot: 'bg-green-400' },
  reader: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
};

const BRAND_COLORS: Record<string, string> = {
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  saucewire: '#E63946',
  trapfrequency: '#39FF14',
};

const BRAND_NAMES: Record<string, string> = {
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  saucewire: 'SauceWire',
  trapfrequency: 'TrapFrequency',
};

const ALL_BRANDS = ['saucecaviar', 'trapglow', 'saucewire', 'trapfrequency'];

export default function UsersPage() {
  const { activeBrand } = useBrand();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (filterRole !== 'all') params.set('role', filterRole);
      if (activeBrand !== 'all') params.set('brand', activeBrand);

      const res = await fetch(`/api/users?${params}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterRole, activeBrand]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (user: User) => {
    if (!confirm(`Delete ${user.name} (${user.email})? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  const roleCounts = users.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage team members, roles, and brand access
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="admin-btn-primary px-4 py-2.5 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {['admin', 'editor', 'writer', 'reader'].map((role) => (
          <div key={role} className="glass-panel p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[role].dot}`} />
              <span className="text-xs font-mono text-gray-500 uppercase">{role}s</span>
            </div>
            <p className="text-2xl font-bold text-white">{roleCounts[role] || 0}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5">
          {['all', 'admin', 'editor', 'writer', 'reader'].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filterRole === role
                  ? 'bg-white/10 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1) + 's'}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-600 ml-auto font-mono">
          {users.length} user{users.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between">
          <p className="text-sm text-red-400">{error}</p>
          <button onClick={fetchUsers} className="text-xs text-red-400 hover:text-red-300 underline">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <svg className="w-12 h-12 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-gray-400 mb-2">No users found</p>
          <p className="text-sm text-gray-600">Create your first team member to get started</p>
        </div>
      ) : (
        /* Users Table */
        <div className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Brands</th>
                <th className="text-left px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Joined</th>
                <th className="text-right px-6 py-3 text-xs font-mono text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        ROLE_COLORS[user.role]?.bg
                      } ${ROLE_COLORS[user.role]?.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${ROLE_COLORS[user.role]?.dot}`} />
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {user.brand_affiliations?.length > 0 ? (
                        user.brand_affiliations.map((brand) => (
                          <span
                            key={brand}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-white/5"
                            title={BRAND_NAMES[brand] || brand}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: BRAND_COLORS[brand] || '#888' }}
                            />
                            <span className="text-gray-400">{BRAND_NAMES[brand] || brand}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-600">No brands</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_verified ? (
                      <span className="inline-flex items-center gap-1 text-xs text-green-400">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      {new Date(user.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-1.5 text-gray-500 hover:text-white transition-colors rounded-md hover:bg-white/5"
                        title="Edit user"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-md hover:bg-red-500/5"
                        title="Delete user"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || editingUser) && (
          <UserModal
            user={editingUser}
            onClose={() => {
              setShowCreateModal(false);
              setEditingUser(null);
            }}
            onSaved={() => {
              setShowCreateModal(false);
              setEditingUser(null);
              fetchUsers();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ======================== USER MODAL ========================

function UserModal({
  user,
  onClose,
  onSaved,
}: {
  user: User | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!user;
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'writer',
    bio: user?.bio || '',
    brand_affiliations: user?.brand_affiliations || [],
    is_verified: user?.is_verified ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleBrand = (brand: string) => {
    setForm((prev) => ({
      ...prev,
      brand_affiliations: prev.brand_affiliations.includes(brand)
        ? prev.brand_affiliations.filter((b) => b !== brand)
        : [...prev.brand_affiliations, brand],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `/api/users/${user!.id}` : '/api/users';
      const method = isEdit ? 'PATCH' : 'POST';

      const body: any = {
        name: form.name,
        role: form.role,
        brand_affiliations: form.brand_affiliations,
        bio: form.bio || null,
        is_verified: form.is_verified,
      };

      if (!isEdit) {
        body.email = form.email;
        body.password = form.password;
      } else if (form.password) {
        body.password = form.password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');

      onSaved();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
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
        <h2 className="text-lg font-bold text-white mb-1">
          {isEdit ? 'Edit User' : 'Create New User'}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {isEdit
            ? 'Update user details, role, and brand access'
            : 'Add a new team member who can log in and manage content'}
        </p>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input"
              placeholder="Full name"
              required
            />
          </div>

          {/* Email (only on create) */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="admin-input"
                placeholder="user@example.com"
                required
              />
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              {isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="admin-input"
              placeholder={isEdit ? '••••••••' : 'Min 6 characters'}
              required={!isEdit ? true : false}
              minLength={!isEdit ? 6 : undefined}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Role</label>
            <div className="grid grid-cols-4 gap-2">
              {['admin', 'editor', 'writer', 'reader'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role: role as any })}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    form.role === role
                      ? `${ROLE_COLORS[role].bg} ${ROLE_COLORS[role].text} border-current`
                      : 'border-white/[0.06] text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Access */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Brand Access</label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_BRANDS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => toggleBrand(brand)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                    form.brand_affiliations.includes(brand)
                      ? 'border-current bg-white/10 text-white'
                      : 'border-white/[0.06] text-gray-500 hover:text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BRAND_COLORS[brand] }}
                  />
                  {BRAND_NAMES[brand]}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio (optional)</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="admin-input min-h-[80px] resize-none"
              placeholder="Brief bio..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="admin-btn-ghost px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="admin-btn-primary px-4 py-2 flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Create User'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
