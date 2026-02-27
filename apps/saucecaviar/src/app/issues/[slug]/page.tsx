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

  return {
    title: `${issue.title} — Issue #${issue.issueNumber}`,
    description: issue.description,
    openGraph: {
      title: `SauceCaviar — ${issue.title}`,
      description: issue.description,
      images: [issue.coverImage],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: issue.title,
      description: issue.description,
      images: [issue.coverImage],
    },
  };
}

export default function IssueReaderPage({ params }: Props) {
  return <IssueReaderClient slug={params.slug} />;
}
