import type { Metadata } from 'next';
import { IssuesPageClient } from './IssuesPageClient';
import { fetchAllIssues } from '@/lib/supabase';
import { getAllIssues } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Issues Archive',
  description: 'Browse all past issues of SauceCaviar Magazine. Each issue is a curated, interactive digital magazine experience.',
};

export default async function IssuesPage() {
  let issues = await fetchAllIssues();
  if (issues.length === 0) issues = getAllIssues();
  return <IssuesPageClient issues={issues} />;
}
