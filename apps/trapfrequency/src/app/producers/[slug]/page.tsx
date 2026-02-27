import { mockProducers, getBeatsByProducer } from '@/lib/mock-data';
import { ProducerProfile } from '@/components/ProducerProfile';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const producer = mockProducers.find(p => p.slug === params.slug);
  if (!producer) return { title: 'Producer Not Found' };

  return {
    title: `${producer.name} — Producer Profile`,
    description: producer.bio,
    openGraph: {
      title: `${producer.name} — TrapFrequency`,
      description: producer.bio,
      type: 'profile',
      siteName: 'TrapFrequency',
    },
  };
}

export function generateStaticParams() {
  return mockProducers.map(p => ({ slug: p.slug }));
}

export default function ProducerPage({ params }: Props) {
  const producer = mockProducers.find(p => p.slug === params.slug);
  if (!producer) notFound();

  const beats = getBeatsByProducer(producer.id);

  return <ProducerProfile producer={producer} beats={beats} />;
}
