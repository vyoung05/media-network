import { BeatsPageClient } from './BeatsPageClient';
import { mockBeats } from '@/lib/mock-data';

export const metadata = {
  title: 'Beats',
  description: 'Discover fresh instrumentals from top producers. Browse beats by genre, BPM, key, and more.',
};

export default function BeatsPage() {
  return <BeatsPageClient beats={mockBeats} />;
}
