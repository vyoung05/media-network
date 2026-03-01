import type { Metadata } from 'next';
import { SamplePacksPage } from './SamplePacksPage';

export const metadata: Metadata = { title: 'Sample Packs' };

export default function Page() {
  return <SamplePacksPage />;
}
