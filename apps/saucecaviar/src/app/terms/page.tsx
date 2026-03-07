import type { Metadata } from 'next';
import { TermsClient } from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for SauceCaviar.',
};

export default function TermsPage() {
  return <TermsClient />;
}
