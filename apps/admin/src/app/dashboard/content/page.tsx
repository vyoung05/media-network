import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ContentQueuePage } from './ContentQueuePage';

export const metadata: Metadata = {
  title: 'Content Queue',
};

export default function Page() {
  return (
    <Suspense fallback={<div className="animate-pulse text-gray-400 p-8">Loading...</div>}>
      <ContentQueuePage />
    </Suspense>
  );
}
