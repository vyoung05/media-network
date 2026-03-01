import { getBeatBySlug } from '@/lib/supabase';
import { BeatDetailClient } from './BeatDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const beat = await getBeatBySlug(params.slug);
  if (!beat) return { title: 'Beat Not Found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trapfrequency.com';
  const ogParams = new URLSearchParams({
    title: `${beat.title} by ${beat.producer.name}`,
    type: 'beat',
    category: beat.genre,
    author: beat.producer.name,
    ...(beat.coverImage && { image: beat.coverImage }),
  });
  const ogImageUrl = `${siteUrl}/api/og?${ogParams.toString()}`;

  return {
    title: `${beat.title} by ${beat.producer.name}`,
    description: `${beat.genre} beat at ${beat.bpm} BPM in ${beat.key}. Produced by ${beat.producer.name}.`,
    openGraph: {
      title: `${beat.title} by ${beat.producer.name}`,
      description: `${beat.genre} beat at ${beat.bpm} BPM in ${beat.key}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: beat.title }],
      type: 'article',
      siteName: 'TrapFrequency',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${beat.title} by ${beat.producer.name}`,
      images: [ogImageUrl],
    },
  };
}

export default async function BeatPage({ params }: Props) {
  const beat = await getBeatBySlug(params.slug);
  if (!beat) notFound();

  return <BeatDetailClient beat={beat} />;
}
