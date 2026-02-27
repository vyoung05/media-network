import type { Metadata } from 'next';
import { IssuesPageClient } from './IssuesPageClient';

export const metadata: Metadata = {
  title: 'Issues Archive',
  description: 'Browse all past issues of SauceCaviar Magazine. Each issue is a curated, interactive digital magazine experience.',
};

export default function IssuesPage() {
  return <IssuesPageClient />;
}
