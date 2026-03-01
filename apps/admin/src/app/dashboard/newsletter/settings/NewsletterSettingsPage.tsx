'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Brand, NewsletterSettings } from '@media-network/shared';

const BRANDS: { id: string; name: string; color: string }[] = [
  { id: 'saucewire', name: 'SauceWire', color: '#E63946' },
  { id: 'saucecaviar', name: 'SauceCaviar', color: '#C9A84C' },
  { id: 'trapglow', name: 'TrapGlow', color: '#8B5CF6' },
  { id: 'trapfrequency', name: 'TrapFrequency', color: '#39FF14' },
];

const PROVIDERS = [
  { id: 'resend', name: 'Resend', desc: 'Modern email API for developers' },
  { id: 'sendgrid', name: 'SendGrid', desc: 'Twilio email delivery service' },
  { id: 'mailgun', name: 'Mailgun', desc: 'Email API by Sinch' },
];

export function NewsletterSettingsPage() {
  const [selectedBrand, setSelectedBrand] = useState<string>('saucewire');
  const [settings, setSettings] = useState<Partial<NewsletterSettings>>({
    enabled: false,
    provider: 'resend',
    api_key_encrypted: '',
    from_email: '',
    from_name: '',
    reply_to: '',
    template_style: 'default',
    footer_text: '',
    auto_send_on_publish: false,
    digest_frequency: 'instant',
    digest_day: 1,
    digest_hour: 9,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await fetch(`/api/newsletter/settings?brand=${selectedBrand}`);
        const data = await res.json();
        if (data) {
          setSettings(data);
        } else {
          setSettings({
            brand: selectedBrand,
            enabled: false,
            provider: 'resend',
            api_key_encrypted: '',
            from_email: '',
            from_name: '',
            reply_to: '',
            template_style: 'default',
            footer_text: '',
            auto_send_on_publish: false,
            digest_frequency: 'instant',
            digest_day: 1,
            digest_hour: 9,
          });
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [selectedBrand]);

  const saveSettings = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/newsletter/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, brand: selectedBrand }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/newsletter" className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Back to Newsletter
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Newsletter Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure email delivery per brand</p>
      </div>

      {/* Brand Tabs */}
      <div className="flex gap-2 flex-wrap">
        {BRANDS.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedBrand(b.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              selectedBrand === b.id
                ? 'bg-white/10 text-white'
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
            style={selectedBrand === b.id ? { borderLeft: `3px solid ${b.color}` } : {}}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: b.color }} />
            {b.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="glass-panel p-8 text-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-5">
          {/* Enable Toggle */}
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Enable Newsletter</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Turn on email newsletter for {BRANDS.find(b => b.id === selectedBrand)?.name}
                </p>
              </div>
              <button
                onClick={() => update('enabled', !settings.enabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.enabled ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Provider */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Provider</h3>
            <div className="grid grid-cols-3 gap-3">
              {PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => update('provider', p.id)}
                  className={`p-4 rounded-lg text-left transition-all ${
                    settings.provider === p.id
                      ? 'bg-blue-500/10 border border-blue-500/30'
                      : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04]'
                  }`}
                >
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key & Sender */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sender Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs text-gray-400 mb-1">API Key</label>
                <input
                  type="password"
                  value={settings.api_key_encrypted || ''}
                  onChange={(e) => update('api_key_encrypted', e.target.value)}
                  placeholder={`${settings.provider || 'Provider'} API key`}
                  className="admin-input text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">From Name</label>
                <input
                  type="text"
                  value={settings.from_name || ''}
                  onChange={(e) => update('from_name', e.target.value)}
                  placeholder="SauceWire"
                  className="admin-input text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">From Email</label>
                <input
                  type="email"
                  value={settings.from_email || ''}
                  onChange={(e) => update('from_email', e.target.value)}
                  placeholder="newsletter@saucewire.com"
                  className="admin-input text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Reply-To Email</label>
                <input
                  type="email"
                  value={settings.reply_to || ''}
                  onChange={(e) => update('reply_to', e.target.value)}
                  placeholder="hello@saucewire.com"
                  className="admin-input text-sm w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Footer Text</label>
                <input
                  type="text"
                  value={settings.footer_text || ''}
                  onChange={(e) => update('footer_text', e.target.value)}
                  placeholder="Custom footer text"
                  className="admin-input text-sm w-full"
                />
              </div>
            </div>
          </div>

          {/* Auto-Send & Digest */}
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Automation</h3>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-white">Auto-send on publish</p>
                <p className="text-xs text-gray-500">Automatically create and send a campaign when an article is published</p>
              </div>
              <button
                onClick={() => update('auto_send_on_publish', !settings.auto_send_on_publish)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  settings.auto_send_on_publish ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.auto_send_on_publish ? 'translate-x-5' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="border-t border-white/5 pt-4">
              <label className="block text-xs text-gray-400 mb-2">Digest Frequency</label>
              <div className="flex gap-2">
                {[
                  { id: 'instant', label: 'Instant', desc: 'Send per article' },
                  { id: 'daily', label: 'Daily', desc: 'Daily digest' },
                  { id: 'weekly', label: 'Weekly', desc: 'Weekly roundup' },
                ].map(freq => (
                  <button
                    key={freq.id}
                    onClick={() => update('digest_frequency', freq.id)}
                    className={`flex-1 p-3 rounded-lg text-center transition-all ${
                      settings.digest_frequency === freq.id
                        ? 'bg-blue-500/10 border border-blue-500/30'
                        : 'bg-white/[0.02] border border-white/[0.04]'
                    }`}
                  >
                    <p className="text-sm font-medium text-white">{freq.label}</p>
                    <p className="text-xs text-gray-500">{freq.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {settings.digest_frequency === 'weekly' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Day of Week</label>
                  <select
                    value={settings.digest_day || 1}
                    onChange={(e) => update('digest_day', parseInt(e.target.value))}
                    className="admin-input text-sm w-full"
                  >
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((d, i) => (
                      <option key={i} value={i}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Hour (24h)</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={settings.digest_hour || 9}
                    onChange={(e) => update('digest_hour', parseInt(e.target.value))}
                    className="admin-input text-sm w-full"
                  />
                </div>
              </div>
            )}

            {settings.digest_frequency === 'daily' && (
              <div className="pt-2">
                <label className="block text-xs text-gray-400 mb-1">Send Hour (24h)</label>
                <input
                  type="number"
                  min={0}
                  max={23}
                  value={settings.digest_hour || 9}
                  onChange={(e) => update('digest_hour', parseInt(e.target.value))}
                  className="admin-input text-sm w-48"
                />
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="glass-panel p-4 flex items-center justify-end gap-3">
            {saved && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-emerald-400"
              >
                ✓ Saved successfully
              </motion.span>
            )}
            <button
              onClick={saveSettings}
              disabled={saving}
              className="admin-btn-primary text-sm flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : '💾 Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
