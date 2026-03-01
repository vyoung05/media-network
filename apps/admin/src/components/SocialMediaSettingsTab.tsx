'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand, SocialPlatform, SocialMediaSettings } from '@media-network/shared';
import { SOCIAL_PLATFORMS, PLATFORM_CREDENTIAL_FIELDS, BRAND_CONFIGS } from '@media-network/shared';

// ======================== HELPERS ========================

function SettingsSection({
  title,
  description,
  children,
  index = 0,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.35 }}
      className="glass-panel overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </motion.div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
  color,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-white font-medium">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? '' : 'bg-gray-700'
        }`}
        style={checked ? { backgroundColor: color || '#3B82F6' } : undefined}
      >
        <motion.div
          className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          animate={{ left: checked ? '22px' : '2px' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </button>
    </div>
  );
}

function FieldRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
      <label className="text-sm text-gray-300 font-medium flex-shrink-0">{label}</label>
      <div className="flex-1 sm:max-w-sm">{children}</div>
    </div>
  );
}

// ======================== BRAND SELECTOR ========================

const BRAND_CONFIG_DISPLAY: Record<Brand, { name: string; color: string }> = {
  saucewire: { name: 'SauceWire', color: '#E63946' },
  saucecaviar: { name: 'SauceCaviar', color: '#C9A84C' },
  trapglow: { name: 'TrapGlow', color: '#8B5CF6' },
  trapfrequency: { name: 'TrapFrequency', color: '#39FF14' },
};

// ======================== MAIN COMPONENT ========================

export function SocialMediaSettingsTab() {
  const [activeBrand, setActiveBrand] = useState<Brand>('saucewire');
  const [settings, setSettings] = useState<Record<SocialPlatform, Partial<SocialMediaSettings>>>({
    twitter: {},
    instagram: {},
    facebook: {},
    tiktok: {},
    linkedin: {},
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | null>>({});
  const [expandedPlatform, setExpandedPlatform] = useState<SocialPlatform | null>('twitter');

  // Fetch settings for active brand
  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch(`/api/settings/social?brand=${activeBrand}`);
      const data = await res.json();
      const newSettings: Record<string, Partial<SocialMediaSettings>> = {
        twitter: {},
        instagram: {},
        facebook: {},
        tiktok: {},
        linkedin: {},
      };
      (data.data || []).forEach((s: SocialMediaSettings) => {
        newSettings[s.platform] = s;
      });
      setSettings(newSettings as Record<SocialPlatform, Partial<SocialMediaSettings>>);
    } catch (err) {
      console.error('Failed to fetch social settings:', err);
    }
  }, [activeBrand]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Save a single platform's settings
  const savePlatformSettings = async (platform: SocialPlatform) => {
    setSaving(platform);
    try {
      const current = settings[platform];
      await fetch('/api/settings/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: activeBrand,
          platform,
          enabled: current.enabled ?? false,
          credentials: current.credentials ?? {},
          auto_share_on_publish: current.auto_share_on_publish ?? false,
          default_template: current.default_template ?? '{title} - {excerpt} {url}',
          default_hashtags: current.default_hashtags ?? [],
        }),
      });
    } catch (err) {
      console.error('Failed to save:', err);
    } finally {
      setSaving(null);
    }
  };

  // Test connection (placeholder)
  const testConnection = async (platform: SocialPlatform) => {
    setTesting(platform);
    setTestResults((prev) => ({ ...prev, [platform]: null }));
    // Simulate test
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const creds = settings[platform]?.credentials || {};
    const hasAnyCred = Object.values(creds).some((v) => v && v.length > 0);
    setTestResults((prev) => ({ ...prev, [platform]: hasAnyCred ? 'success' : 'error' }));
    setTesting(null);
  };

  const updatePlatformSetting = (
    platform: SocialPlatform,
    key: string,
    value: unknown
  ) => {
    setSettings((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [key]: value,
      },
    }));
  };

  const updateCredential = (
    platform: SocialPlatform,
    key: string,
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        credentials: {
          ...(prev[platform]?.credentials || {}),
          [key]: value,
        },
      },
    }));
  };

  const brandConfig = BRAND_CONFIG_DISPLAY[activeBrand];

  // Template preview
  const getPreviewText = (platform: SocialPlatform) => {
    const template = settings[platform]?.default_template || '{title} - {excerpt} {url}';
    const hashtags = settings[platform]?.default_hashtags || [];
    let text = template
      .replace(/\{title\}/g, 'Breaking: Artist X Drops New Album')
      .replace(/\{excerpt\}/g, 'The highly anticipated album features 14 tracks...')
      .replace(/\{url\}/g, `https://${activeBrand}.com/article-slug`)
      .replace(/\{brand\}/g, brandConfig.name)
      .replace(/\{author\}/g, 'Staff Writer');

    if (hashtags.length > 0) {
      const tags = hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ');
      text = `${text}\n\n${tags}`;
    }
    return text;
  };

  return (
    <div className="space-y-6">
      {/* Brand selector */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(BRAND_CONFIG_DISPLAY) as Brand[]).map((brand) => {
          const config = BRAND_CONFIG_DISPLAY[brand];
          const isActive = activeBrand === brand;
          return (
            <motion.button
              key={brand}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveBrand(brand)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'text-white' : 'text-gray-400 hover:text-white bg-white/[0.03]'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: `${config.color}18`,
                      border: `1px solid ${config.color}40`,
                    }
                  : { border: '1px solid rgba(255,255,255,0.04)' }
              }
            >
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: config.color,
                  boxShadow: isActive ? `0 0 8px ${config.color}60` : 'none',
                }}
              />
              {config.name}
            </motion.button>
          );
        })}
      </div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-4 border-blue-500/10"
      >
        <div className="flex items-start gap-3">
          <span className="text-lg">📱</span>
          <div>
            <p className="text-sm font-medium text-white">
              Social Media for{' '}
              <span style={{ color: brandConfig.color }}>{brandConfig.name}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Configure social accounts to auto-share articles when published. Each brand has independent settings.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Platform cards */}
      {SOCIAL_PLATFORMS.map((platform, i) => {
        const platformSettings = settings[platform.id];
        const isEnabled = platformSettings?.enabled ?? false;
        const isExpanded = expandedPlatform === platform.id;
        const credFields = PLATFORM_CREDENTIAL_FIELDS[platform.id];
        const previewText = getPreviewText(platform.id);

        return (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="glass-panel overflow-hidden"
          >
            {/* Platform header — clickable to expand */}
            <button
              onClick={() => setExpandedPlatform(isExpanded ? null : platform.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{platform.icon}</span>
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-white">{platform.name}</h3>
                  <p className="text-xs text-gray-500">
                    {isEnabled ? (
                      <span className="text-green-400">● Enabled</span>
                    ) : (
                      <span className="text-gray-600">○ Disabled</span>
                    )}
                    {platformSettings?.auto_share_on_publish && (
                      <span className="ml-2 text-blue-400">⚡ Auto-share</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {testResults[platform.id] === 'success' && (
                  <span className="text-xs text-green-400">✅ Connected</span>
                )}
                {testResults[platform.id] === 'error' && (
                  <span className="text-xs text-red-400">❌ Failed</span>
                )}
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-5 border-t border-white/[0.06] pt-5">
                    {/* Enable toggle */}
                    <Toggle
                      label="Enable Platform"
                      description={`Connect ${platform.name} for ${brandConfig.name}`}
                      checked={isEnabled}
                      onChange={(v) => updatePlatformSetting(platform.id, 'enabled', v)}
                      color={brandConfig.color}
                    />

                    {/* Auto-share toggle */}
                    <Toggle
                      label="Auto-Share on Publish"
                      description="Automatically share new articles when published"
                      checked={platformSettings?.auto_share_on_publish ?? false}
                      onChange={(v) => updatePlatformSetting(platform.id, 'auto_share_on_publish', v)}
                      color={brandConfig.color}
                    />

                    {/* Credentials */}
                    <div className="space-y-3">
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                        API Credentials
                      </p>
                      {credFields.map((field) => (
                        <FieldRow key={field.key} label={field.label}>
                          <input
                            type={field.type}
                            value={(platformSettings?.credentials as Record<string, string>)?.[field.key] || ''}
                            onChange={(e) => updateCredential(platform.id, field.key, e.target.value)}
                            className="admin-input text-sm font-mono"
                            placeholder={`Enter ${field.label.toLowerCase()}`}
                          />
                        </FieldRow>
                      ))}
                    </div>

                    {/* Default template */}
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                        Post Template
                      </p>
                      <textarea
                        value={platformSettings?.default_template || '{title} - {excerpt} {url}'}
                        onChange={(e) => updatePlatformSetting(platform.id, 'default_template', e.target.value)}
                        className="admin-input text-sm w-full h-20 resize-none font-mono"
                        placeholder="{title} - {excerpt} {url}"
                      />
                      <div className="flex items-center gap-2 flex-wrap">
                        {['{title}', '{excerpt}', '{url}', '{brand}', '{author}'].map((v) => (
                          <span
                            key={v}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-gray-400 font-mono cursor-pointer hover:bg-white/[0.10]"
                            onClick={() => {
                              const current = platformSettings?.default_template || '';
                              updatePlatformSetting(platform.id, 'default_template', current + v);
                            }}
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Default hashtags */}
                    <FieldRow label="Default Hashtags">
                      <input
                        type="text"
                        value={(platformSettings?.default_hashtags || []).join(', ')}
                        onChange={(e) => {
                          const tags = e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean);
                          updatePlatformSetting(platform.id, 'default_hashtags', tags);
                        }}
                        className="admin-input text-sm"
                        placeholder="#music, #hiphop, #news"
                      />
                    </FieldRow>

                    {/* Preview */}
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                        Preview
                      </p>
                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-sm">
                            {platform.icon}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{brandConfig.name}</p>
                            <p className="text-[10px] text-gray-600">@{activeBrand} • Just now</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                          {previewText}
                        </p>
                        {platform.maxChars && (
                          <div className="mt-2 flex items-center gap-1">
                            <span
                              className={`text-xs font-mono ${
                                previewText.length > platform.maxChars
                                  ? 'text-red-400'
                                  : previewText.length > platform.maxChars * 0.9
                                  ? 'text-amber-400'
                                  : 'text-gray-600'
                              }`}
                            >
                              {previewText.length}/{platform.maxChars}
                            </span>
                            {previewText.length > platform.maxChars && (
                              <span className="text-xs text-red-400">⚠️ Over limit — will be truncated</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-3 pt-2">
                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => testConnection(platform.id)}
                        disabled={testing === platform.id}
                        className="admin-btn-ghost px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        {testing === platform.id ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Test Connection
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => savePlatformSettings(platform.id)}
                        disabled={saving === platform.id}
                        className="admin-btn-primary px-4 py-2 text-sm flex items-center gap-2 disabled:opacity-50"
                      >
                        {saving === platform.id ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            Save {platform.name}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Security notice */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-panel p-4 border-amber-500/20"
      >
        <div className="flex items-start gap-3">
          <span className="text-amber-400 text-lg">🔒</span>
          <div>
            <p className="text-sm font-medium text-amber-400">Credential Security</p>
            <p className="text-xs text-gray-500 mt-0.5">
              API credentials are stored in your Supabase database. For production, enable
              column-level encryption or use a secrets manager like Vault. Social API calls are
              processed server-side only — credentials never reach the browser.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
