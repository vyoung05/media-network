import type { Metadata } from 'next';
import { AdvertisePageClient } from './AdvertisePageClient';

export const metadata: Metadata = {
  title: 'Advertise',
  description: 'Advertise in SauceCaviar Magazine. Premium ad placements in our luxury digital magazine reaching 250K+ culture enthusiasts.',
};

export default function AdvertisePage() {
  return <AdvertisePageClient />;
}
