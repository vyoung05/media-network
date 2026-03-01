'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MusicPlayerProps {
  /** Spotify track/album/playlist URL */
  spotifyUrl?: string;
  /** Apple Music embed URL */
  appleMusicUrl?: string;
  /** SoundCloud embed URL */
  soundcloudUrl?: string;
  /** YouTube video URL */
  youtubeUrl?: string;
  /** Direct audio file URL for preview */
  previewUrl?: string;
  /** Track info for standalone player */
  trackTitle?: string;
  trackArtist?: string;
  coverImage?: string;
  /** Compact mode for inline use */
  compact?: boolean;
}

function extractSpotifyId(url: string): { type: string; id: string } | null {
  // https://open.spotify.com/track/xyz or spotify:track:xyz
  const webMatch = url.match(/spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
  if (webMatch) return { type: webMatch[1], id: webMatch[2] };
  const uriMatch = url.match(/spotify:(track|album|playlist):([a-zA-Z0-9]+)/);
  if (uriMatch) return { type: uriMatch[1], id: uriMatch[2] };
  return null;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function SpotifyEmbed({ url, compact }: { url: string; compact?: boolean }) {
  const parsed = extractSpotifyId(url);
  if (!parsed) return null;
  const height = compact ? 80 : parsed.type === 'track' ? 152 : 352;
  return (
    <iframe
      src={`https://open.spotify.com/embed/${parsed.type}/${parsed.id}?utm_source=generator&theme=0`}
      width="100%"
      height={height}
      frameBorder="0"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
      className="rounded-xl"
      style={{ borderRadius: '12px' }}
    />
  );
}

function YouTubeEmbed({ url }: { url: string }) {
  const videoId = extractYoutubeId(url);
  if (!videoId) return null;
  return (
    <div className="relative aspect-video rounded-xl overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="absolute inset-0"
      />
    </div>
  );
}

function SoundCloudEmbed({ url }: { url: string }) {
  const encodedUrl = encodeURIComponent(url);
  return (
    <iframe
      width="100%"
      height={166}
      scrolling="no"
      frameBorder="no"
      allow="autoplay"
      src={`https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23C9A84C&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
      className="rounded-xl"
    />
  );
}

function PreviewPlayer({ url, title, artist, cover, compact }: { url: string; title?: string; artist?: string; cover?: string; compact?: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }, [playing]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-[#1a1a1a] border border-white/[0.08] rounded-xl overflow-hidden ${compact ? 'p-3' : 'p-4'}`}>
      <audio ref={audioRef} src={url} preload="metadata" />
      <div className="flex items-center gap-3">
        {/* Cover art */}
        {cover && !compact && (
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <img src={cover} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        {/* Play button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center flex-shrink-0 touch-manipulation"
        >
          {playing ? (
            <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </motion.button>
        {/* Info + progress */}
        <div className="flex-1 min-w-0">
          {(title || artist) && (
            <div className="mb-1">
              {title && <p className="text-sm text-white font-medium truncate">{title}</p>}
              {artist && <p className="text-[10px] text-white/40 truncate">{artist}</p>}
            </div>
          )}
          {/* Progress bar */}
          <div
            className="w-full h-1.5 bg-white/10 rounded-full cursor-pointer group"
            onClick={seek}
          >
            <div
              className="h-full bg-[#C9A84C] rounded-full relative transition-all"
              style={{ width: duration ? `${(progress / duration) * 100}%` : '0%' }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          {/* Time */}
          <div className="flex justify-between mt-0.5">
            <span className="text-[9px] text-white/20">{formatTime(progress)}</span>
            <span className="text-[9px] text-white/20">{duration ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MusicPlayer({ spotifyUrl, appleMusicUrl, soundcloudUrl, youtubeUrl, previewUrl, trackTitle, trackArtist, coverImage, compact }: MusicPlayerProps) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (spotifyUrl) return 'spotify';
    if (appleMusicUrl) return 'apple';
    if (soundcloudUrl) return 'soundcloud';
    if (youtubeUrl) return 'youtube';
    if (previewUrl) return 'preview';
    return 'spotify';
  });

  const availableTabs = [
    spotifyUrl && { key: 'spotify', label: 'Spotify', icon: '🟢' },
    appleMusicUrl && { key: 'apple', label: 'Apple', icon: '🍎' },
    soundcloudUrl && { key: 'soundcloud', label: 'SoundCloud', icon: '🟠' },
    youtubeUrl && { key: 'youtube', label: 'YouTube', icon: '🔴' },
    previewUrl && { key: 'preview', label: 'Preview', icon: '▶️' },
  ].filter(Boolean) as { key: string; label: string; icon: string }[];

  if (availableTabs.length === 0) return null;

  return (
    <div className="w-full">
      {/* Tab selector (only if multiple sources) */}
      {availableTabs.length > 1 && (
        <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
          {availableTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap touch-manipulation ${
                activeTab === tab.key
                  ? 'bg-[#C9A84C]/20 text-[#C9A84C] border border-[#C9A84C]/30'
                  : 'text-white/40 hover:text-white/60 border border-transparent'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Player content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'spotify' && spotifyUrl && <SpotifyEmbed url={spotifyUrl} compact={compact} />}
          {activeTab === 'apple' && appleMusicUrl && (
            <iframe
              allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
              frameBorder="0"
              height={compact ? 80 : 175}
              style={{ width: '100%', overflow: 'hidden', borderRadius: '12px' }}
              sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
              src={appleMusicUrl}
            />
          )}
          {activeTab === 'soundcloud' && soundcloudUrl && <SoundCloudEmbed url={soundcloudUrl} />}
          {activeTab === 'youtube' && youtubeUrl && <YouTubeEmbed url={youtubeUrl} />}
          {activeTab === 'preview' && previewUrl && (
            <PreviewPlayer url={previewUrl} title={trackTitle} artist={trackArtist} cover={coverImage} compact={compact} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
