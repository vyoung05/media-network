import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArchivePageClient } from './ArchivePageClient';
import { mockArticles } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all SauceWire articles. Search and filter through our complete news archive.',
};

export default function ArchivePage() {
  return (
    <Suspense fallback={<div className="container-wire py-8"><div className="text-neutral">Loading archive...</div></div>}>
      <ArchivePageClient articles={mockArticles} />
    </Suspense>
  );
}
