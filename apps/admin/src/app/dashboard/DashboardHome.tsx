'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, change, changeType, icon, color }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded-full ${
            changeType === 'up'
              ? 'bg-emerald-500/10 text-emerald-400'
              : changeType === 'down'
              ? 'bg-red-500/10 text-red-400'
              : 'bg-gray-500/10 text-gray-400'
          }`}
        >
          {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '–'} {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { action: 'Article published', detail: 'Drake Drops Surprise Album at Midnight', time: '2m ago', type: 'publish', brand: 'saucewire' },
    { action: 'Submission received', detail: 'New artist feature request from @jayflow', time: '15m ago', type: 'submission', brand: 'trapglow' },
    { action: 'Writer approved', detail: 'Maya Chen — Culture Editor', time: '1h ago', type: 'writer', brand: 'saucecaviar' },
    { action: 'Article pending', detail: 'Nike x Pharrell Collection — AI Draft', time: '2h ago', type: 'pending', brand: 'saucewire' },
    { action: 'Beat submitted', detail: 'Producer @808mafia — "Midnight Bounce"', time: '3h ago', type: 'submission', brand: 'trapfrequency' },
    { action: 'Article rejected', detail: 'Duplicate story — already covered', time: '4h ago', type: 'rejected', brand: 'saucewire' },
    { action: 'New writer application', detail: 'Jordan Davis — Sports Journalist', time: '5h ago', type: 'writer', brand: 'saucewire' },
    { action: 'Issue drafted', detail: 'SauceCaviar Issue #7 — "The Glow Up Issue"', time: '6h ago', type: 'publish', brand: 'saucecaviar' },
  ];

  const typeColors: Record<string, string> = {
    publish: 'bg-emerald-500',
    submission: 'bg-blue-500',
    writer: 'bg-purple-500',
    pending: 'bg-amber-500',
    rejected: 'bg-red-500',
  };

  const brandColors: Record<string, string> = {
    saucecaviar: '#C9A84C',
    trapglow: '#8B5CF6',
    saucewire: '#E63946',
    trapfrequency: '#39FF14',
  };

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {activities.map((activity, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="px-6 py-3.5 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColors[activity.type]}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-gray-300">{activity.action}</p>
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: brandColors[activity.brand] }}
                  />
                </div>
                <p className="text-xs text-gray-500 truncate">{activity.detail}</p>
              </div>
              <span className="text-xs font-mono text-gray-600 whitespace-nowrap">{activity.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: 'New Article', icon: '✏️', href: '#' },
    { label: 'Review Queue', icon: '📋', href: '/dashboard/content' },
    { label: 'View Submissions', icon: '📥', href: '/dashboard/submissions' },
    { label: 'AI Pipeline', icon: '🤖', href: '#' },
  ];

  return (
    <div className="glass-panel p-6">
      <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.04] transition-all duration-200 group"
          >
            <span className="text-lg">{action.icon}</span>
            <span className="text-sm text-gray-400 group-hover:text-white transition-colors">
              {action.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function BrandOverview() {
  const brands = [
    { name: 'SauceWire', color: '#E63946', articles: 156, views: '23.4K', status: 'Active' },
    { name: 'SauceCaviar', color: '#C9A84C', articles: 42, views: '8.1K', status: 'Active' },
    { name: 'TrapGlow', color: '#8B5CF6', articles: 89, views: '15.2K', status: 'Active' },
    { name: 'TrapFrequency', color: '#39FF14', articles: 34, views: '5.7K', status: 'Setup' },
  ];

  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06]">
        <h3 className="text-sm font-semibold text-white">Brand Overview</h3>
      </div>
      <div className="divide-y divide-white/[0.04]">
        {brands.map((brand) => (
          <div key={brand.name} className="px-6 py-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: brand.color }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{brand.name}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono text-gray-300">{brand.articles} articles</p>
              <p className="text-xs font-mono text-gray-500">{brand.views} views</p>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                brand.status === 'Active'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-amber-500/10 text-amber-400'
              }`}
            >
              {brand.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your media network — {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <StatCard
            label="Total Articles"
            value="321"
            change="12 this week"
            changeType="up"
            color="#3B82F6"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            }
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <StatCard
            label="Pending Review"
            value="8"
            change="3 urgent"
            changeType="neutral"
            color="#F59E0B"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard
            label="Active Writers"
            value="14"
            change="2 new"
            changeType="up"
            color="#10B981"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard
            label="Submissions"
            value="12"
            change="5 today"
            changeType="up"
            color="#8B5CF6"
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            }
          />
        </motion.div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <BrandOverview />
        </div>
      </div>
    </div>
  );
}
