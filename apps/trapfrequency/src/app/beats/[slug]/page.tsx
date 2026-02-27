import { mockBeats } from '@/lib/mock-data';
import { BeatDetailClient } from './BeatDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const beat = mockBeats.find(b => b.slug === params.slug);
  if (!beat) return { title: 'Beat Not Found' };

  return {
    title: `${beat.title} by ${beat.producer.name}`,
    description: `${beat.genre} beat at ${beat.bpm} BPM in ${beat.key}. Produced by ${beat.producer.name}.`,
  };
}

export function generateStaticParams() {
  return mockBeats.map(b => ({ slug: b.slug }));
}

export default function BeatPage({ params }: Props) {
  const beat = mockBeats.find(b => b.slug === params.slug);
  if (!beat) notFound();

  return <BeatDetailClient beat={beat} />;
}
