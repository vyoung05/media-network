import type { Metadata } from 'next';
import { DiscoverPageClient } from './DiscoverPageClient';
import { getArtists } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Discover Artists',
  description: 'Browse and discover emerging artists by genre, mood, and region. Filter through hip-hop, R&B, Afrobeats, electronic, and more.',
  openGraph: {
    title: 'Discover Artists | TrapGlow',
    description: 'Find your next favorite artist.',
  },
};

export default async function DiscoverPage() {
  const artists = await getArtists();
  return <DiscoverPageClient artists={artists} />;
}
