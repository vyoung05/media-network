import { getProducerBySlug, getBeatsByProducer } from '@/lib/supabase';
import { ProducerProfile } from '@/components/ProducerProfile';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const producer = await getProducerBySlug(params.slug);
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

export default async function ProducerPage({ params }: Props) {
  const producer = await getProducerBySlug(params.slug);
  if (!producer) notFound();

  const beats = await getBeatsByProducer(producer.id);

  return <ProducerProfile producer={producer} beats={beats} />;
}
