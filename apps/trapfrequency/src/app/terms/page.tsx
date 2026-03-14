import type { Metadata } from 'next';
import { TermsClient } from './TermsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for TrapFrequency.',
};

export default function TermsPage() {
  return <TermsClient />;
}
