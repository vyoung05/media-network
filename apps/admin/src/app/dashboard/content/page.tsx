import type { Metadata } from 'next';
import { ContentQueuePage } from './ContentQueuePage';

export const metadata: Metadata = {
  title: 'Content Queue',
};

export default function Page() {
  return <ContentQueuePage />;
}
