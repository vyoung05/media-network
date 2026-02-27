import type { Metadata } from 'next';
import { ArchivePageClient } from './ArchivePageClient';
import { mockArticles } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Archive',
  description: 'Browse all SauceWire articles. Search and filter through our complete news archive.',
};

export default function ArchivePage() {
  return <ArchivePageClient articles={mockArticles} />;
}
