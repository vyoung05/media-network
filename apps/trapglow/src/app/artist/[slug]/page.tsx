import { notFound } from 'next/navigation';
import { getArtistBySlug, getPostsByArtist, mockArtists } from '@/lib/mock-data';
import { ArtistProfile } from '@/components/ArtistProfile';

interface ArtistPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return mockArtists.map((artist) => ({
    slug: artist.slug,
  }));
}

export function generateMetadata({ params }: ArtistPageProps) {
  const artist = getArtistBySlug(params.slug);
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

export default function ArtistPage({ params }: ArtistPageProps) {
  const artist = getArtistBySlug(params.slug);

  if (!artist) {
    notFound();
  }

  const relatedPosts = getPostsByArtist(artist.id);

  return <ArtistProfile artist={artist} relatedPosts={relatedPosts} />;
}
