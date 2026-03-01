import type { Metadata } from 'next';
import { ArtistsPage } from './ArtistsPage';

export const metadata: Metadata = { title: 'Artists' };

export default function Page() {
  return <ArtistsPage />;
}
