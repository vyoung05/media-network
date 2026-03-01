import type { Metadata } from 'next';
import { mockIssues } from '@/lib/mock-data';
import { IssueReaderClient } from './IssueReaderClient';

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return mockIssues.map((issue) => ({
    slug: issue.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const issue = mockIssues.find((i) => i.slug === params.slug);
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

export default function IssueReaderPage({ params }: Props) {
  return <IssueReaderClient slug={params.slug} />;
}
