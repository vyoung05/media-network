import { GearPageClient } from './GearPageClient';
import { getGearReviews } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Gear Reviews',
  description: 'In-depth reviews of music production gear — controllers, monitors, microphones, interfaces, and more.',
};

export default async function GearPage() {
  const reviews = await getGearReviews();
  return <GearPageClient reviews={reviews} />;
}
