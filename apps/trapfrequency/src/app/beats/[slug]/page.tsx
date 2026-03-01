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

  return {
    title: `${beat.title} by ${beat.producer.name}`,
    description: `${beat.genre} beat at ${beat.bpm} BPM in ${beat.key}. Produced by ${beat.producer.name}.`,
  };
}

export default async function BeatPage({ params }: Props) {
  const beat = await getBeatBySlug(params.slug);
  if (!beat) notFound();

  return <BeatDetailClient beat={beat} />;
}
