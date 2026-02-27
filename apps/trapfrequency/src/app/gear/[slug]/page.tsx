import { mockGearReviews } from '@/lib/mock-data';
import { GearDetailClient } from './GearDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = mockGearReviews.find(r => r.slug === params.slug);
  if (!review) return { title: 'Review Not Found' };

  return {
    title: review.title,
    description: review.excerpt,
  };
}

export function generateStaticParams() {
  return mockGearReviews.map(r => ({ slug: r.slug }));
}

export default function GearDetailPage({ params }: Props) {
  const review = mockGearReviews.find(r => r.slug === params.slug);
  if (!review) notFound();

  return <GearDetailClient review={review} />;
}
