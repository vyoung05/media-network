import type { Metadata } from 'next';
import { PrivacyPolicyClient } from './PrivacyPolicyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for TrapFrequency — how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
