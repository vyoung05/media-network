'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Brand, SocialPlatform, SocialShareLog } from '@media-network/shared';
import { SOCIAL_PLATFORMS } from '@media-network/shared';

interface ShareButtonProps {
  articleId: string;
  brand: Brand;
  articleTitle: string;
  compact?: boolean;
}

export function ShareButton({ articleId, brand, articleTitle, compact = false }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [shareLog, setShareLog] = useState<SocialShareLog[]>([]);
  const [enabledPlatforms, setEnabledPlatforms] = useState<SocialPlatform[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingLog, setLoadingLog] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch share log and enabled platforms when opening
  useEffect(() => {
    if (!isOpen) return;

    setLoadingLog(true);
    Promise.all([
      fetch(`/api/social/share-log?article_id=${articleId}`).then((r) => r.json()),
      fetch(`/api/settings/social?brand=${brand}`).then((r) => r.json()),
    ])
      .then(([logRes, settingsRes]) => {
        setShareLog(logRes.data || []);
        const enabled = (settingsRes.data || [])
          .filter((s: { enabled: boolean }) => s.enabled)
          .map((s: { platform: SocialPlatform }) => s.platform);
        setEnabledPlatforms(enabled);
      })
      .catch(console.error)
      .finally(() => setLoadingLog(false));
  }, [isOpen, articleId, brand]);

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleShare = async () => {
    if (selectedPlatforms.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/social/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: articleId,
          platforms: selectedPlatforms,
          brand,
        }),
      });
      const data = await res.json();
      if (data.results) {
        // Refresh log
        const logRes = await fetch(`/api/social/share-log?article_id=${articleId}`).then((r) => r.json());
        setShareLog(logRes.data || []);
      }
      setSelectedPlatforms([]);
    } catch (err) {
      console.error('Share failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'failed': return '❌';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const hasSharedAnything = shareLog.length > 0;

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
          compact
            ? 'px-2 py-1.5 rounded-md hover:bg-white/[0.06] text-gray-400 hover:text-white'
            : 'admin-btn-ghost px-3 py-2 min-h-[44px] sm:min-h-0'
        }`}
        title="Share to social media"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {!compact && 'Share'}
        {hasSharedAnything && (
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-72 glass-panel z-50 overflow-hidden shadow-xl"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h4 className="text-sm font-semibold text-white">Share to Social</h4>
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{articleTitle}</p>
            </div>

            {loadingLog ? (
              <div className="p-6 text-center">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : (
              <>
                {/* Platform checkboxes */}
                <div className="p-3 space-y-1">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const isEnabled = enabledPlatforms.includes(platform.id);
                    const isSelected = selectedPlatforms.includes(platform.id);
                    const logs = shareLog.filter((l) => l.platform === platform.id);
                    const lastLog = logs[0];

                    return (
                      <button
                        key={platform.id}
                        onClick={() => isEnabled && togglePlatform(platform.id)}
                        disabled={!isEnabled}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                          !isEnabled
                            ? 'opacity-40 cursor-not-allowed'
                            : isSelected
                            ? 'bg-white/[0.08]'
                            : 'hover:bg-white/[0.04]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                            isSelected
                              ? 'border-transparent bg-blue-500'
                              : 'border-gray-600'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-base">{platform.icon}</span>
                        <span className="text-sm text-white flex-1">{platform.name}</span>
                        {lastLog && (
                          <span className="text-xs" title={lastLog.status}>
                            {getStatusIcon(lastLog.status)}
                          </span>
                        )}
                        {!isEnabled && (
                          <span className="text-[10px] text-gray-600">Not configured</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Share history */}
                {shareLog.length > 0 && (
                  <div className="px-4 py-2 border-t border-white/[0.06]">
                    <p className="text-[10px] font-mono text-gray-600 uppercase tracking-wider mb-1">Recent Shares</p>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {shareLog.slice(0, 5).map((log) => {
                        const p = SOCIAL_PLATFORMS.find((sp) => sp.id === log.platform);
                        return (
                          <div key={log.id} className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{getStatusIcon(log.status)}</span>
                            <span>{p?.name || log.platform}</span>
                            <span className="text-gray-700">•</span>
                            <span className="font-mono text-gray-600">
                              {new Date(log.shared_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Action */}
                <div className="px-4 py-3 border-t border-white/[0.06]">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleShare}
                    disabled={selectedPlatforms.length === 0 || loading}
                    className="admin-btn-primary w-full text-sm flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {selectedPlatforms.length > 0
                          ? `Share Now (${selectedPlatforms.length})`
                          : 'Select platforms'}
                      </>
                    )}
                  </motion.button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
