import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArchivePageClient } from './ArchivePageClient';
import { fetchArticles } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all SauceWire articles. Search and filter through our complete news archive.',
};

export default async function ArchivePage() {
  const { articles } = await fetchArticles({ per_page: 100 });

  return (
    <Suspense fallback={<div className="container-wire py-8"><div className="text-neutral">Loading archive...</div></div>}>
      <ArchivePageClient articles={articles} />
    </Suspense>
  );
}
