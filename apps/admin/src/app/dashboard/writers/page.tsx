import type { Metadata } from 'next';
import { WritersPage } from './WritersPage';

export const metadata: Metadata = {
  title: 'Writers',
};

export default function Page() {
  return <WritersPage />;
}
