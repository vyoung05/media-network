'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandProvider, useBrand } from '@/contexts/BrandContext';
import { Sidebar } from './Sidebar';

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
  all: 'All Brands',
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayoutInner({ children }: DashboardLayoutProps) {
  const { activeBrand } = useBrand();

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 glass-panel-solid flex items-center justify-between px-8 border-b border-admin-border rounded-none">
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search articles, submissions..."
                className="admin-input pl-10 w-80 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
            </button>

            {/* Brand indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              {activeBrand !== 'all' && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: BRAND_COLORS[activeBrand] || '#888' }}
                />
              )}
              <span className="text-xs font-mono text-gray-400">
                {BRAND_NAMES[activeBrand] || 'All Brands'}
              </span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <AnimatePresence mode="wait">
          <motion.main
            key="main-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="p-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <BrandProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </BrandProvider>
  );
}
