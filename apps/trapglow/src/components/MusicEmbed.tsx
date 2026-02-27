'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface MusicEmbedProps {
  spotifyUrl?: string;
  soundcloudUrl?: string;
  appleMusicUrl?: string;
  className?: string;
  compact?: boolean;
}

type Platform = 'spotify' | 'soundcloud' | 'apple';

export function MusicEmbed({
  spotifyUrl,
  soundcloudUrl,
  appleMusicUrl,
  className = '',
  compact = false,
}: MusicEmbedProps) {
  const platforms: { key: Platform; url: string; label: string; color: string }[] = [];
  if (spotifyUrl) platforms.push({ key: 'spotify', url: spotifyUrl, label: 'Spotify', color: '#1DB954' });
  if (appleMusicUrl) platforms.push({ key: 'apple', url: appleMusicUrl, label: 'Apple Music', color: '#FC3C44' });
  if (soundcloudUrl) platforms.push({ key: 'soundcloud', url: soundcloudUrl, label: 'SoundCloud', color: '#FF5500' });

  const [activePlatform, setActivePlatform] = useState<Platform>(platforms[0]?.key || 'spotify');

  if (platforms.length === 0) return null;

  const activeUrl = platforms.find(p => p.key === activePlatform)?.url || platforms[0].url;

  const getEmbedSrc = () => {
    switch (activePlatform) {
      case 'spotify':
        return `${activeUrl}?theme=0`;
      case 'soundcloud':
        return `${activeUrl}&color=%238B5CF6&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`;
      case 'apple':
        return activeUrl;
      default:
        return activeUrl;
    }
  };

  const getHeight = () => {
    if (compact) return activePlatform === 'spotify' ? 80 : 100;
    return activePlatform === 'spotify' ? 152 : activePlatform === 'soundcloud' ? 166 : 175;
  };

  return (
    <div className={`${className}`}>
      {/* Platform tabs */}
      {platforms.length > 1 && (
        <div className="flex gap-2 mb-3">
          {platforms.map((platform) => (
            <button
              key={platform.key}
              onClick={() => setActivePlatform(platform.key)}
              className={`px-3 py-1.5 text-xs font-body rounded-lg transition-all duration-300 ${
                activePlatform === platform.key
                  ? 'text-white font-bold'
                  : 'text-white/40 hover:text-white/70 bg-white/5'
              }`}
              style={
                activePlatform === platform.key
                  ? { backgroundColor: platform.color + '20', color: platform.color }
                  : {}
              }
            >
              {platform.label}
            </button>
          ))}
        </div>
      )}

      {/* Embed */}
      <motion.div
        key={activePlatform}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl overflow-hidden bg-surface/50"
      >
        <iframe
          src={getEmbedSrc()}
          width="100%"
          height={getHeight()}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className="rounded-xl"
          style={{ borderRadius: '12px' }}
        />
      </motion.div>
    </div>
  );
}
