import type { Metadata } from 'next';
import { DiscoverPageClient } from './DiscoverPageClient';
import { mockArtists } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Discover Artists',
  description: 'Browse and discover emerging artists by genre, mood, and region. Filter through hip-hop, R&B, Afrobeats, electronic, and more.',
  openGraph: {
    title: 'Discover Artists | TrapGlow',
    description: 'Find your next favorite artist.',
  },
};

export default function DiscoverPage() {
  return <DiscoverPageClient artists={mockArtists} />;
}
