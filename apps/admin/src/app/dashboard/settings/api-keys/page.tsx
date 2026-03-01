'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApiKeyInfo {
  id: string;
  label: string;
  description: string;
  icon: string;
  configured: boolean;
  source: 'dashboard' | 'env' | 'none';
  maskedValue: string | null;
  updatedAt: string | null;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newValue, setNewValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/api-keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const saveKey = async (keyName: string) => {
    if (!newValue.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyName, keyValue: newValue.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: 'success', text: `${keyName} updated successfully` });
        setEditingKey(null);
        setNewValue('');
        fetchKeys();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to save' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const removeKey = async (keyName: string) => {
    if (!confirm(`Remove ${keyName} from dashboard? It will fall back to the Vercel environment variable if one exists.`)) return;
    try {
      const res = await fetch('/api/settings/api-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyName }),
      });
      if (res.ok) {
        setMessage({ type: 'success', text: `${keyName} removed from dashboard` });
        fetchKeys();
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          🔑 API Keys
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your API keys directly from the dashboard. Changes take effect immediately — no redeployment needed.
        </p>
      </motion.div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`px-4 py-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-4"
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div className="text-xs text-gray-400 space-y-1">
            <p><strong className="text-gray-300">Dashboard keys</strong> override Vercel environment variables and take effect instantly.</p>
            <p><strong className="text-gray-300">Env keys</strong> are set in Vercel and require a redeployment to change.</p>
            <p>Keys are stored securely in your database. Only masked values are shown.</p>
          </div>
        </div>
      </motion.div>

      {/* Key Cards */}
      <div className="space-y-3">
        {keys.map((key, i) => (
          <motion.div
            key={key.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-panel overflow-hidden"
          >
            <div className="px-5 py-4 flex items-center justify-between gap-4">
              {/* Left: Icon + Info */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl flex-shrink-0">{key.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">{key.label}</h3>
                    {key.configured ? (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        key.source === 'dashboard'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {key.source === 'dashboard' ? '📊 Dashboard' : '⚙️ Env Var'}
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                        Not set
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{key.description}</p>
                  {key.maskedValue && (
                    <code className="text-[10px] text-gray-600 font-mono mt-1 block">{key.maskedValue}</code>
                  )}
                </div>
              </div>

              {/* Right: Status + Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`w-2.5 h-2.5 rounded-full ${key.configured ? 'bg-green-500' : 'bg-red-500'}`} />
                {editingKey !== key.id && (
                  <button
                    onClick={() => { setEditingKey(key.id); setNewValue(''); }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.06] text-gray-300 hover:bg-white/[0.1] transition-all"
                  >
                    {key.configured ? 'Update' : 'Set Key'}
                  </button>
                )}
                {key.source === 'dashboard' && editingKey !== key.id && (
                  <button
                    onClick={() => removeKey(key.id)}
                    className="px-2 py-1.5 rounded-lg text-xs text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Edit Form */}
            <AnimatePresence>
              {editingKey === key.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/[0.06] overflow-hidden"
                >
                  <div className="px-5 py-4 space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">New API Key</label>
                      <input
                        type="password"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder={`Paste your ${key.label}...`}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/[0.2] font-mono"
                        autoFocus
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => saveKey(key.id)}
                        disabled={saving || !newValue.trim()}
                        className="px-4 py-2 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all disabled:opacity-40"
                      >
                        {saving ? (
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </span>
                        ) : '💾 Save Key'}
                      </button>
                      <button
                        onClick={() => { setEditingKey(null); setNewValue(''); }}
                        className="px-4 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-3">How API Keys Work</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <span className="text-2xl">📊</span>
            <p className="text-xs font-medium text-white mt-2">Dashboard Keys</p>
            <p className="text-[10px] text-gray-500 mt-1">Stored in Supabase. Highest priority. Change anytime, no redeploy.</p>
          </div>
          <div className="text-center">
            <span className="text-2xl">⚙️</span>
            <p className="text-xs font-medium text-white mt-2">Env Variables</p>
            <p className="text-[10px] text-gray-500 mt-1">Set in Vercel. Used as fallback. Requires redeployment to change.</p>
          </div>
          <div className="text-center">
            <span className="text-2xl">🔒</span>
            <p className="text-xs font-medium text-white mt-2">Security</p>
            <p className="text-[10px] text-gray-500 mt-1">Keys are never exposed in full. Only masked previews shown.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
