'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandProvider, useBrand } from '@/contexts/BrandContext';
import { Sidebar } from './Sidebar';
import { NotificationBell } from './NotificationBell';

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 ml-0 md:ml-64 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 glass-panel-solid flex items-center justify-between px-4 md:px-8 border-b border-admin-border rounded-none">
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="relative hidden sm:block flex-1 max-w-xs md:max-w-sm lg:max-w-md">
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
                className="admin-input pl-10 w-full text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {/* Notifications */}
            <NotificationBell />

            {/* Brand indicator */}
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-white/5">
              {activeBrand !== 'all' && (
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: BRAND_COLORS[activeBrand] || '#888' }}
                />
              )}
              <span className="text-xs font-mono text-gray-400 hidden sm:inline">
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
            className="p-4 md:p-8"
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
