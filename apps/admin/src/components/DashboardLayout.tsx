'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import type { Brand } from '@media-network/shared';
import { Sidebar } from './Sidebar';
import { NotificationDropdown } from './NotificationDropdown';
import { SearchDropdown } from './SearchDropdown';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [activeBrand, setActiveBrand] = useState<Brand>('saucewire');
  const [authChecked, setAuthChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/');
      } else {
        setAuthChecked(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-bg">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar activeBrand={activeBrand} onBrandChange={setActiveBrand} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-14 lg:h-16 glass-panel-solid flex items-center justify-between px-4 lg:px-8 border-b border-admin-border rounded-none">
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <SearchDropdown />
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationDropdown />

            {/* Brand indicator */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    activeBrand === 'saucecaviar' ? '#C9A84C'
                    : activeBrand === 'trapglow' ? '#8B5CF6'
                    : activeBrand === 'saucewire' ? '#E63946'
                    : '#39FF14',
                }}
              />
              <span className="text-xs font-mono text-gray-400">
                {activeBrand === 'saucecaviar' ? 'SauceCaviar'
                  : activeBrand === 'trapglow' ? 'TrapGlow'
                  : activeBrand === 'saucewire' ? 'SauceWire'
                  : 'TrapFrequency'}
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
            className="p-4 lg:p-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
