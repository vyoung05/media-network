import { getGearReviewBySlug } from '@/lib/supabase';
import { GearDetailClient } from './GearDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = await getGearReviewBySlug(params.slug);
  if (!review) return { title: 'Review Not Found' };

  return {
    title: review.title,
    description: review.excerpt,
  };
}

export default async function GearDetailPage({ params }: Props) {
  const review = await getGearReviewBySlug(params.slug);
  if (!review) notFound();

  return <GearDetailClient review={review} />;
}
