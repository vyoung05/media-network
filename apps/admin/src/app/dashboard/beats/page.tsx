import type { Metadata } from 'next';
import { BeatsPage } from './BeatsPage';

export const metadata: Metadata = { title: 'Beats' };

export default function Page() {
  return <BeatsPage />;
}
