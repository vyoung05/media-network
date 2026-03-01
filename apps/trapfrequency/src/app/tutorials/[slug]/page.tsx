import { getTutorialBySlug } from '@/lib/supabase';
import { TutorialDetailClient } from './TutorialDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tutorial = await getTutorialBySlug(params.slug);
  if (!tutorial) return { title: 'Tutorial Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trapfrequency.com';
  const ogParams = new URLSearchParams({
    title: tutorial.title,
    category: 'Tutorials',
    ...(tutorial.author?.name && { author: tutorial.author.name }),
    ...(tutorial.coverImage && { image: tutorial.coverImage }),
  });
  const ogImageUrl = `${siteUrl}/api/og?${ogParams.toString()}`;

  return {
    title: tutorial.title,
    description: tutorial.excerpt,
    openGraph: {
      title: tutorial.title,
      description: tutorial.excerpt,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: tutorial.title }],
      type: 'article',
      siteName: 'TrapFrequency',
    },
    twitter: {
      card: 'summary_large_image',
      title: tutorial.title,
      description: tutorial.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function TutorialPage({ params }: Props) {
  const tutorial = await getTutorialBySlug(params.slug);
  if (!tutorial) notFound();

  return <TutorialDetailClient tutorial={tutorial} />;
}
