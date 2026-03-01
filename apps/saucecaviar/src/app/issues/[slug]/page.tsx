import type { Metadata } from 'next';
import { fetchIssueBySlug, fetchIssuesSlugs } from '@/lib/supabase';
import { mockIssues, getIssueBySlug } from '@/lib/mock-data';
import { IssueReaderClient } from './IssueReaderClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let issue = await fetchIssueBySlug(params.slug);
  if (!issue) issue = getIssueBySlug(params.slug) || null;
  if (!issue) return { title: 'Issue Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saucecaviar.com';
  const ogParams = new URLSearchParams({
    title: issue.title,
    issue: `Issue #${issue.issueNumber}`,
    ...(issue.coverImage && { image: issue.coverImage }),
  });
  const ogImageUrl = `${siteUrl}/api/og?${ogParams.toString()}`;

  return {
    title: `${issue.title} — Issue #${issue.issueNumber}`,
    description: issue.description,
    openGraph: {
      title: `SauceCaviar — ${issue.title}`,
      description: issue.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: issue.title }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: issue.title,
      description: issue.description,
      images: [ogImageUrl],
    },
  };
}

export default async function IssueReaderPage({ params }: Props) {
  // Fetch from Supabase with pages
  let issue = await fetchIssueBySlug(params.slug);

  // Fall back to mock data
  if (!issue) issue = getIssueBySlug(params.slug) || null;

  return <IssueReaderClient slug={params.slug} serverIssue={issue} />;
}
