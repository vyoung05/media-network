import { BeatsPageClient } from './BeatsPageClient';
import { getBeats } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Beats',
  description: 'Discover fresh instrumentals from top producers. Browse beats by genre, BPM, key, and more.',
};

export default async function BeatsPage() {
  const beats = await getBeats();
  return <BeatsPageClient beats={beats} />;
}
