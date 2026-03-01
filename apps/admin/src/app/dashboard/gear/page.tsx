import type { Metadata } from 'next';
import { GearPage } from './GearPage';

export const metadata: Metadata = { title: 'Gear Reviews' };

export default function Page() {
  return <GearPage />;
}
