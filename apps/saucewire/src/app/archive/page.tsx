import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArchivePageClient } from './ArchivePageClient';
import { fetchArticles } from '@/lib/supabase';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all SauceWire articles. Search and filter through our complete news archive.',
};

export default async function ArchivePage() {
  const { articles } = await fetchArticles({ per_page: 50 });
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <ArchivePageClient articles={articles} />
    </Suspense>
  );
}
