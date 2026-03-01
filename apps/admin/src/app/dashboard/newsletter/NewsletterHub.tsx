'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useBrand } from '@/contexts/BrandContext';
import type { Brand, NewsletterCampaign } from '@media-network/shared';
import { timeAgo } from '@media-network/shared';

const BRAND_COLORS: Record<string, string> = {
  saucewire: '#E63946',
  saucecaviar: '#C9A84C',
  trapglow: '#8B5CF6',
  trapfrequency: '#39FF14',
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  draft: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
  sending: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  sent: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

interface Stats {
  totalSubscribers: number;
  activeSubscribers: number;
  avgOpenRate: number;
  lastSent: string | null;
}

export function NewsletterHub() {
  const { activeBrand } = useBrand();
  const [stats, setStats] = useState<Stats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    avgOpenRate: 0,
    lastSent: null,
  });
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeBrand !== 'all') params.set('brand', activeBrand);

        // Fetch subscribers
        const subRes = await fetch(`/api/newsletter/subscribers?${params}&per_page=1`);
        const subData = await subRes.json();

        // Fetch active subscribers
        const activeParams = new URLSearchParams(params);
        const activeSubRes = await fetch(`/api/newsletter/subscribers?${activeParams}`);
        const activeSubData = await activeSubRes.json();
        const activeCount = (activeSubData.data || []).filter((s: any) => s.is_active).length;

        // Fetch campaigns
        const campRes = await fetch(`/api/newsletter/campaigns?${params}&per_page=10`);
        const campData = await campRes.json();

        // Calculate open rate from sent campaigns
        const sentCampaigns = (campData.data || []).filter((c: any) => c.status === 'sent');
        const avgOpen = sentCampaigns.length > 0
          ? sentCampaigns.reduce((sum: number, c: any) => {
              return sum + (c.sent_count > 0 ? (c.open_count / c.sent_count) * 100 : 0);
            }, 0) / sentCampaigns.length
          : 0;

        const lastSentCampaign = sentCampaigns[0];

        setStats({
          totalSubscribers: subData.count || 0,
          activeSubscribers: activeCount,
          avgOpenRate: Math.round(avgOpen * 10) / 10,
          lastSent: lastSentCampaign?.sent_at || null,
        });
        setCampaigns(campData.data || []);
      } catch (err) {
        console.error('Failed to fetch newsletter data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [activeBrand]);

  const statCards = [
    {
      label: 'Total Subscribers',
      value: loading ? '...' : stats.totalSubscribers.toLocaleString(),
      icon: '👥',
      color: '#3B82F6',
    },
    {
      label: 'Active Subscribers',
      value: loading ? '...' : stats.activeSubscribers.toLocaleString(),
      icon: '✅',
      color: '#10B981',
    },
    {
      label: 'Avg Open Rate',
      value: loading ? '...' : `${stats.avgOpenRate}%`,
      icon: '📧',
      color: '#F59E0B',
    },
    {
      label: 'Last Sent',
      value: loading ? '...' : stats.lastSent ? timeAgo(stats.lastSent) : 'Never',
      icon: '🕐',
      color: '#8B5CF6',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage email campaigns and subscribers
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/newsletter/subscribers"
            className="admin-btn-ghost text-sm flex items-center gap-2"
          >
            👥 Subscribers
          </Link>
          <Link
            href="/dashboard/newsletter/campaigns/new"
            className="admin-btn-primary text-sm flex items-center gap-2"
          >
            ✉️ New Campaign
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-500">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Link
          href="/dashboard/newsletter/campaigns/new"
          className="glass-panel p-6 hover:bg-white/[0.04] transition-colors group"
        >
          <div className="text-3xl mb-3">✉️</div>
          <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
            Create Campaign
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Draft a new newsletter with selected articles
          </p>
        </Link>
        <Link
          href="/dashboard/newsletter/subscribers"
          className="glass-panel p-6 hover:bg-white/[0.04] transition-colors group"
        >
          <div className="text-3xl mb-3">👥</div>
          <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
            Manage Subscribers
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            View, add, or export your subscriber list
          </p>
        </Link>
        <Link
          href="/dashboard/newsletter/settings"
          className="glass-panel p-6 hover:bg-white/[0.04] transition-colors group"
        >
          <div className="text-3xl mb-3">⚙️</div>
          <h3 className="text-white font-semibold group-hover:text-blue-400 transition-colors">
            Newsletter Settings
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Configure providers, templates, and auto-send
          </p>
        </Link>
      </div>

      {/* Campaigns List */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Campaigns</h3>
          <Link href="/dashboard/newsletter/campaigns/new" className="text-xs text-blue-400 hover:text-blue-300">
            + New
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-sm">No campaigns yet</p>
            <Link href="/dashboard/newsletter/campaigns/new" className="text-blue-400 text-sm mt-2 inline-block">
              Create your first campaign →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {campaigns.map((campaign, i) => {
              const statusStyle = STATUS_STYLES[campaign.status] || STATUS_STYLES.draft;
              return (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="px-6 py-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: BRAND_COLORS[campaign.brand] || '#888' }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {campaign.subject}
                      </p>
                      <p className="text-xs text-gray-500">
                        {campaign.brand} · {timeAgo(campaign.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {campaign.sent_count > 0 && (
                        <span className="text-xs text-gray-500">
                          {campaign.sent_count} sent
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                        {campaign.status}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
