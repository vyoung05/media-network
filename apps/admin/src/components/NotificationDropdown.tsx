'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@media-network/shared';
import type { Brand } from '@media-network/shared';

// ======================== TYPES ========================

interface NotificationItem {
  id: string;
  type: 'article_published' | 'article_pending' | 'submission' | 'new_user' | 'article_archived';
  title: string;
  description: string;
  timestamp: string;
  href: string;
  brand?: Brand;
}

// ======================== CONSTANTS ========================

const STORAGE_KEY = 'media-network-notifications-read';

const BRAND_COLORS: Record<Brand, string> = {
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  saucewire: '#E63946',
  trapfrequency: '#39FF14',
};

const TYPE_CONFIG: Record<NotificationItem['type'], { color: string; label: string }> = {
  article_published: { color: '#10B981', label: 'Published' },
  article_pending: { color: '#F59E0B', label: 'Pending' },
  submission: { color: '#3B82F6', label: 'Submission' },
  new_user: { color: '#8B5CF6', label: 'New User' },
  article_archived: { color: '#6B7280', label: 'Archived' },
};

// ======================== HELPERS ========================

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {}
}

// ======================== COMPONENT ========================

export function NotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load read state from localStorage
  useEffect(() => {
    setReadIds(getReadIds());
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const items: NotificationItem[] = [];

      // Recent articles with status changes
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, status, brand, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(10);

      if (articles) {
        for (const a of articles) {
          const statusMap: Record<string, { type: NotificationItem['type']; desc: string }> = {
            published: { type: 'article_published', desc: 'Article was published' },
            pending_review: { type: 'article_pending', desc: 'Article is awaiting review' },
            archived: { type: 'article_archived', desc: 'Article was archived' },
          };
          const info = statusMap[a.status];
          if (info) {
            items.push({
              id: `article-${a.id}`,
              type: info.type,
              title: a.title,
              description: info.desc,
              timestamp: a.updated_at || a.created_at,
              href: '/dashboard/content',
              brand: a.brand as Brand,
            });
          }
        }
      }

      // Recent submissions
      const { data: submissions } = await supabase
        .from('submissions')
        .select('id, title, brand, contact_name, is_anonymous, submitted_at')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (submissions) {
        for (const s of submissions) {
          items.push({
            id: `submission-${s.id}`,
            type: 'submission',
            title: s.title,
            description: `New submission${s.is_anonymous ? '' : s.contact_name ? ` from ${s.contact_name}` : ''}`,
            timestamp: s.submitted_at,
            href: '/dashboard/submissions',
            brand: s.brand as Brand,
          });
        }
      }

      // Recent new users
      const { data: users } = await supabase
        .from('users')
        .select('id, name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (users) {
        for (const u of users) {
          items.push({
            id: `user-${u.id}`,
            type: 'new_user',
            title: u.name || 'New User',
            description: `Joined as ${u.role}`,
            timestamp: u.created_at,
            href: '/dashboard/writers',
          });
        }
      }

      // Sort by timestamp (most recent first)
      items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setNotifications(items.slice(0, 20));
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when dropdown opens
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;
  const badgeText = unreadCount > 9 ? '9+' : unreadCount.toString();

  const handleMarkAllRead = () => {
    const allIds = new Set([...readIds, ...notifications.map((n) => n.id)]);
    setReadIds(allIds);
    saveReadIds(allIds);
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    // Mark as read
    const newReadIds = new Set([...readIds, notification.id]);
    setReadIds(newReadIds);
    saveReadIds(newReadIds);

    // Navigate
    router.push(notification.href);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {/* Unread badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-blue-500 rounded-full"
          >
            {badgeText}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute right-0 top-full mt-2 w-96 glass-panel-solid shadow-2xl shadow-black/50 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="divide-y divide-white/[0.04]">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full mt-1.5 bg-white/10 animate-pulse" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-32 bg-white/5 rounded animate-pulse" />
                          <div className="h-3 w-48 bg-white/5 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-12 text-center">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="text-sm text-gray-400">All caught up!</p>
                  <p className="text-xs text-gray-600 mt-1">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {notifications.map((notification, i) => {
                    const isRead = readIds.has(notification.id);
                    const typeConfig = TYPE_CONFIG[notification.type];
                    return (
                      <motion.button
                        key={notification.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => handleNotificationClick(notification)}
                        className={`w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors ${
                          isRead ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                            style={{ backgroundColor: typeConfig.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm truncate ${isRead ? 'text-gray-400' : 'text-white font-medium'}`}>
                                {notification.title}
                              </p>
                              {notification.brand && (
                                <div
                                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                  style={{ backgroundColor: BRAND_COLORS[notification.brand] }}
                                />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{notification.description}</p>
                          </div>
                          <span className="text-[10px] font-mono text-gray-600 whitespace-nowrap flex-shrink-0">
                            {timeAgo(notification.timestamp)}
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2.5 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    router.push('/dashboard');
                    setIsOpen(false);
                  }}
                  className="text-xs text-gray-500 hover:text-blue-400 transition-colors w-full text-center"
                >
                  View all activity →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
