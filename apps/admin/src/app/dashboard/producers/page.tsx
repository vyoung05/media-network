import type { Metadata } from 'next';
import { ProducersPage } from './ProducersPage';

export const metadata: Metadata = {
  title: 'Producers',
};

export default function Page() {
  return <ProducersPage />;
}
