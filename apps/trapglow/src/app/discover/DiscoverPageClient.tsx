'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DiscoverGrid } from '@/components/DiscoverGrid';
import type { Artist } from '@/lib/mock-data';

interface DiscoverPageClientProps {
  artists: Artist[];
}

export function DiscoverPageClient({ artists }: DiscoverPageClientProps) {
  const router = useRouter();

  const handleArtistClick = (artist: Artist) => {
    router.push(`/artist/${artist.slug}`);
  };

  return (
    <div className="container-glow py-8 md:py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-headline font-bold text-white mb-2">
          Discover <span className="text-gradient">Artists</span>
        </h1>
        <p className="text-white/50 font-body max-w-lg">
          Browse emerging talent by genre, mood, and region. Find the sound that moves you.
        </p>
      </div>

      <DiscoverGrid artists={artists} onArtistClick={handleArtistClick} />
    </div>
  );
}
