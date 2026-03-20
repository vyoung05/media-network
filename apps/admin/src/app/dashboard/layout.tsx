'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { DashboardLayout } from '@/components/DashboardLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    // If we landed here with a ?code= param, redirect to auth callback to exchange it
    const code = searchParams.get('code');
    if (code) {
      router.replace(`/auth/callback?code=${code}`);
      return;
    }
    if (!loading && !session) {
      router.push('/');
    }
  }, [session, loading, router, searchParams]);

  // Show retry button after 5 seconds of loading
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setShowRetry(true), 5000);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-admin-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 font-mono">Loading dashboard...</p>
          {showRetry && (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors"
            >
              Taking too long? Tap to retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
