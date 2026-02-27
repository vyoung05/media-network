import type { Metadata } from 'next';
import { SubscribePageClient } from './SubscribePageClient';

export const metadata: Metadata = {
  title: 'Subscribe',
  description: 'Subscribe to SauceCaviar for early access to new issues, exclusive content, and premium features.',
};

export default function SubscribePage() {
  return <SubscribePageClient />;
}
