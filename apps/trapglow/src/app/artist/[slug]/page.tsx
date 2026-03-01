import { notFound } from 'next/navigation';
import { getArtistBySlug } from '@/lib/supabase';
import { getPostsByArtist } from '@/lib/mock-data';
import { ArtistProfile } from '@/components/ArtistProfile';

export const dynamic = 'force-dynamic';

interface ArtistPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArtistPageProps) {
  const artist = await getArtistBySlug(params.slug);
  if (!artist) return {};

  return {
    title: `${artist.name} — Artist Spotlight`,
    description: artist.bio.slice(0, 160),
    openGraph: {
      title: `${artist.name} | TrapGlow`,
      description: artist.bio.slice(0, 160),
      images: [artist.cover_image],
      type: 'profile',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.name} — TrapGlow Spotlight`,
      description: artist.bio.slice(0, 160),
      images: [artist.cover_image],
    },
  };
}

export default async function ArtistPage({ params }: ArtistPageProps) {
  const artist = await getArtistBySlug(params.slug);

  if (!artist) {
    notFound();
  }

  // Blog posts are still from mock data
  const relatedPosts = getPostsByArtist(artist.id);

  return <ArtistProfile artist={artist} relatedPosts={relatedPosts} />;
}
