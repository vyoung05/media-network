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

  return {
    title: tutorial.title,
    description: tutorial.excerpt,
    openGraph: {
      title: tutorial.title,
      description: tutorial.excerpt,
      type: 'article',
      siteName: 'TrapFrequency',
    },
  };
}

export default async function TutorialPage({ params }: Props) {
  const tutorial = await getTutorialBySlug(params.slug);
  if (!tutorial) notFound();

  return <TutorialDetailClient tutorial={tutorial} />;
}
