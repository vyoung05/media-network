import { mockTutorials } from '@/lib/mock-data';
import { TutorialDetailClient } from './TutorialDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tutorial = mockTutorials.find(t => t.slug === params.slug);
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

export function generateStaticParams() {
  return mockTutorials.map(t => ({ slug: t.slug }));
}

export default function TutorialPage({ params }: Props) {
  const tutorial = mockTutorials.find(t => t.slug === params.slug);
  if (!tutorial) notFound();

  return <TutorialDetailClient tutorial={tutorial} />;
}
