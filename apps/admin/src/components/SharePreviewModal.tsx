'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand, SocialPlatform, SocialMediaSettings } from '@media-network/shared';
import { SOCIAL_PLATFORMS, BRAND_CONFIGS } from '@media-network/shared';

const BRAND_DOMAINS: Record<Brand, string> = {
  saucewire: 'https://saucewire.com',
  saucecaviar: 'https://saucecaviar.com',
  trapglow: 'https://trapglow.com',
  trapfrequency: 'https://trapfrequency.com',
};

interface SharePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (platforms: SocialPlatform[]) => void;
  article: {
    id: string;
    title: string;
    excerpt: string | null;
    brand: Brand;
    slug: string;
    author?: { name: string } | null;
  };
  loading?: boolean;
}

function fillTemplate(
  template: string,
  article: { title: string; excerpt: string | null; brand: Brand; author?: { name: string } | null },
  url: string
): string {
  const brandConfig = BRAND_CONFIGS[article.brand];
  return template
    .replace(/\{title\}/g, article.title)
    .replace(/\{excerpt\}/g, article.excerpt || '')
    .replace(/\{url\}/g, url)
    .replace(/\{brand\}/g, brandConfig.name)
    .replace(/\{author\}/g, article.author?.name || 'Staff');
}

export function SharePreviewModal({
  isOpen,
  onClose,
  onConfirm,
  article,
  loading = false,
}: SharePreviewModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [settings, setSettings] = useState<SocialMediaSettings[]>([]);
  const [activePlatformPreview, setActivePlatformPreview] = useState<SocialPlatform>('twitter');

  useEffect(() => {
    if (!isOpen) return;
    fetch(`/api/settings/social?brand=${article.brand}`)
      .then((r) => r.json())
      .then((data) => {
        setSettings(data.data || []);
        const enabled = (data.data || [])
          .filter((s: SocialMediaSettings) => s.enabled)
          .map((s: SocialMediaSettings) => s.platform as SocialPlatform);
        if (enabled.length > 0) {
          setActivePlatformPreview(enabled[0]);
        }
      })
      .catch(console.error);
  }, [isOpen, article.brand]);

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const getPreviewText = (platform: SocialPlatform) => {
    const setting = settings.find((s) => s.platform === platform);
    const template = setting?.default_template || '{title}\n\n{excerpt}\n\n{url}';
    const url = `${BRAND_DOMAINS[article.brand]}/${article.slug}`;
    let text = fillTemplate(template, article, url);

    if (setting?.default_hashtags?.length) {
      const hashtags = setting.default_hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ');
      text = `${text}\n\n${hashtags}`;
    }

    return text;
  };

  const enabledSettings = settings.filter((s) => s.enabled);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="glass-panel w-full max-w-lg mx-4 overflow-hidden max-h-[85vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                📤 Share Preview
              </h3>
              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{article.title}</p>
            </div>

            {/* Body - scrollable */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {/* Platform selector */}
              <div className="space-y-2">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Select Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const isEnabled = enabledSettings.some((s) => s.platform === platform.id);
                    const isSelected = selectedPlatforms.includes(platform.id);
                    return (
                      <motion.button
                        key={platform.id}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => {
                          if (isEnabled) {
                            togglePlatform(platform.id);
                            setActivePlatformPreview(platform.id);
                          }
                        }}
                        disabled={!isEnabled}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          !isEnabled
                            ? 'opacity-30 cursor-not-allowed bg-white/[0.02]'
                            : isSelected
                            ? 'bg-white/[0.10] border border-white/[0.15]'
                            : 'bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06]'
                        }`}
                      >
                        <span>{platform.icon}</span>
                        <span className={isSelected ? 'text-white' : 'text-gray-400'}>
                          {platform.name}
                        </span>
                        {isSelected && (
                          <span className="text-green-400 text-xs">✓</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Preview tabs */}
              {selectedPlatforms.length > 0 && (
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {selectedPlatforms.map((pid) => {
                      const p = SOCIAL_PLATFORMS.find((sp) => sp.id === pid);
                      return (
                        <button
                          key={pid}
                          onClick={() => setActivePlatformPreview(pid)}
                          className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                            activePlatformPreview === pid
                              ? 'bg-white/[0.10] text-white'
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {p?.icon} {p?.name}
                        </button>
                      );
                    })}
                  </div>

                  {/* Preview card */}
                  <motion.div
                    key={activePlatformPreview}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center text-sm">
                        {SOCIAL_PLATFORMS.find((sp) => sp.id === activePlatformPreview)?.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {BRAND_CONFIGS[article.brand].name}
                        </p>
                        <p className="text-[10px] text-gray-600">@{article.brand} • Just now</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">
                      {getPreviewText(activePlatformPreview)}
                    </p>
                    {activePlatformPreview === 'twitter' && (
                      <div className="mt-2 flex items-center gap-1">
                        <span
                          className={`text-xs font-mono ${
                            getPreviewText('twitter').length > 280
                              ? 'text-red-400'
                              : 'text-gray-600'
                          }`}
                        >
                          {getPreviewText('twitter').length}/280
                        </span>
                        {getPreviewText('twitter').length > 280 && (
                          <span className="text-xs text-red-400">⚠️ Over limit</span>
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              )}

              {enabledSettings.length === 0 && (
                <div className="text-center py-6">
                  <p className="text-sm text-gray-500">
                    No social platforms configured for this brand.
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Go to Settings → Social Media to set up accounts.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => onConfirm(selectedPlatforms)}
                disabled={selectedPlatforms.length === 0 || loading}
                className="admin-btn-primary flex items-center gap-2 disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Share to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
