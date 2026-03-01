'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { MagazinePage } from '@/lib/mock-data';
import { MusicPlayer } from '../MusicPlayer';

interface AudioTemplateProps {
  page: MagazinePage;
}

export function AudioTemplate({ page }: AudioTemplateProps) {
  // Parse music sources from the page data
  const spotifyUrl = page.musicEmbed?.includes('spotify') ? page.musicEmbed : (page as any).spotify_embed || undefined;
  const soundcloudUrl = page.musicEmbed?.includes('soundcloud') ? page.musicEmbed : undefined;
  const youtubeUrl = page.musicEmbed?.includes('youtube') || page.musicEmbed?.includes('youtu.be') ? page.musicEmbed : ((page as any).youtube_url || undefined);
  const previewUrl = (page as any).audio_embed_url || (page.musicEmbed && !spotifyUrl && !soundcloudUrl && !youtubeUrl ? page.musicEmbed : undefined);

  return (
    <div
      className="relative w-full h-full magazine-page overflow-hidden page-texture flex flex-col"
      style={{ backgroundColor: page.backgroundColor || '#0A0A0A' }}
    >
      {/* Background image with heavy overlay */}
      {page.imageUrl && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-110 blur-md"
            style={{ backgroundImage: `url(${page.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
      )}

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center h-full p-6 md:p-10">
        {/* Category */}
        <motion.p
          className="text-[9px] tracking-[0.4em] uppercase text-[#C9A84C]/60 font-body mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {page.category || 'Now Playing'}
        </motion.p>

        {/* Cover art */}
        {page.imageUrl && (
          <motion.div
            className="w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-2xl mb-6 mx-auto"
            initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <img src={page.imageUrl} alt={page.title || ''} className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Title */}
        <motion.h2
          className="text-2xl md:text-3xl font-headline text-white text-center tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {page.title}
        </motion.h2>

        {/* Subtitle / Artist */}
        {(page.subtitle || page.artistName) && (
          <motion.p
            className="text-sm text-[#C9A84C]/80 font-accent mt-1 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {page.subtitle || page.artistName}
          </motion.p>
        )}

        {/* Description */}
        {page.content && (
          <motion.p
            className="text-xs text-white/50 font-body mt-3 text-center max-w-md leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            {page.content.substring(0, 200)}
          </motion.p>
        )}

        {/* Music Player */}
        <motion.div
          className="w-full max-w-md mt-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <MusicPlayer
            spotifyUrl={spotifyUrl}
            soundcloudUrl={soundcloudUrl}
            youtubeUrl={youtubeUrl}
            previewUrl={previewUrl}
            trackTitle={page.title}
            trackArtist={page.artistName || page.subtitle}
            coverImage={page.imageUrl}
          />
        </motion.div>

        {/* Pull quote */}
        {page.pullQuote && (
          <motion.blockquote
            className="mt-6 text-sm font-accent italic text-white/40 text-center max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            &ldquo;{page.pullQuote}&rdquo;
          </motion.blockquote>
        )}

        {/* Footer */}
        <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
          <p className="text-[8px] tracking-[0.2em] uppercase text-white/20 font-body">
            SauceCaviar
          </p>
          <p className="text-[8px] tracking-[0.2em] uppercase text-white/20 font-body">
            {page.pageNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
