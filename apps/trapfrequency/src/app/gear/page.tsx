import { GearPageClient } from './GearPageClient';
import { mockGearReviews } from '@/lib/mock-data';

export const metadata = {
  title: 'Gear Reviews',
  description: 'In-depth reviews of music production gear — controllers, monitors, microphones, interfaces, and more.',
};

export default function GearPage() {
  return <GearPageClient reviews={mockGearReviews} />;
}
