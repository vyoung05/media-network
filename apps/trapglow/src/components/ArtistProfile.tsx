'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GlassMorphCard } from './GlassMorphCard';
import { MusicEmbed } from './MusicEmbed';
import type { Artist, BlogPost } from '@/lib/mock-data';
import { formatListeners } from '@/lib/mock-data';

interface ArtistProfileProps {
  artist: Artist;
  relatedPosts: BlogPost[];
}

export function ArtistProfile({ artist, relatedPosts }: ArtistProfileProps) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const socialIcons: Record<string, React.ReactNode> = {
    spotify: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    soundcloud: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.057-.05-.1-.1-.1zm1.58-1.359a.137.137 0 0 0-.131.112l-.209 3.512.209 3.387c.005.07.061.118.131.118a.134.134 0 0 0 .131-.118l.236-3.387-.236-3.512a.134.134 0 0 0-.131-.112zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z" />
      </svg>
    ),
    apple_music: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.997 6.124a9.23 9.23 0 00-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043A5.022 5.022 0 0019.7.164 10.286 10.286 0 0017.48 0H6.515c-.483 0-.966.023-1.447.074a5.167 5.167 0 00-1.992.569C1.765 1.38.994 2.38.677 3.692a9.09 9.09 0 00-.237 2.097c-.005.142-.009.284-.009.426v11.568c0 .143.003.285.009.427.015.738.081 1.47.237 2.19.317 1.31 1.088 2.31 2.399 3.043.545.3 1.138.505 1.76.59.56.078 1.125.097 1.692.097h11.078c.568 0 1.133-.02 1.694-.097a5.167 5.167 0 001.76-.59c1.31-.733 2.08-1.733 2.398-3.043.156-.72.222-1.452.237-2.19.006-.142.009-.284.009-.427V6.55c0-.143-.003-.285-.009-.426zm-6.484 9.83c0 .3-.018.584-.094.864-.167.619-.573.99-1.19 1.08-.204.03-.413.016-.617-.02a3.93 3.93 0 01-.8-.29c-.388-.2-.647-.51-.769-.928a1.545 1.545 0 01-.056-.474c.004-.345.12-.647.338-.915.246-.303.56-.5.913-.61.294-.094.6-.14.904-.18.24-.03.48-.044.72-.08.12-.02.24-.04.347-.09.11-.05.16-.13.16-.24V8.424c0-.12-.05-.22-.16-.26a.673.673 0 00-.273-.04l-5.346.97c-.05.01-.1.02-.14.05-.08.05-.12.13-.12.24v7.824c0 .25-.01.49-.05.74a1.787 1.787 0 01-.263.72c-.292.44-.712.68-1.22.76-.18.03-.37.04-.55.03a3.77 3.77 0 01-.857-.19c-.447-.16-.781-.44-.963-.89a1.47 1.47 0 01-.1-.57c0-.35.1-.66.32-.93a2.3 2.3 0 01.92-.64c.32-.12.65-.19.98-.23.26-.04.52-.06.78-.1.12-.01.24-.04.35-.09.1-.05.15-.13.15-.24V6.62c0-.19.08-.35.24-.44.11-.07.23-.1.36-.12l6.2-1.15c.08-.02.16-.03.24-.03.22 0 .37.12.4.34.01.06.01.12.01.18v10.45z" />
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    youtube: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    tiktok: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  };

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          <Image
            src={artist.cover_image}
            alt={artist.name}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <motion.div style={{ opacity: heroOpacity }} className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/60 to-secondary/20" />

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container-glow">
            {/* Trend badge */}
            {artist.glow_trend === 'rising' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30 mb-4"
              >
                <svg className="w-3.5 h-3.5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-xs font-bold text-accent">RISING ARTIST</span>
              </motion.div>
            )}

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-accent font-bold text-white mb-2"
            >
              {artist.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/60 font-body mb-4"
            >
              {artist.city} {artist.real_name && `· ${artist.real_name}`}
            </motion.p>

            {/* Genre tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {artist.genre.map((g) => (
                <span key={g} className="px-3 py-1 text-xs font-body font-medium bg-primary/20 text-primary backdrop-blur-sm rounded-full border border-primary/30">
                  {g}
                </span>
              ))}
              {artist.mood.map((m) => (
                <span key={m} className="px-3 py-1 text-xs font-body font-medium bg-white/10 text-white/60 backdrop-blur-sm rounded-full">
                  {m}
                </span>
              ))}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-8"
            >
              <div>
                <p className="text-2xl font-headline font-bold text-white">{formatListeners(artist.monthly_listeners)}</p>
                <p className="text-xs text-white/40 font-body uppercase tracking-wide">Monthly Listeners</p>
              </div>
              <div>
                <p className="text-2xl font-headline font-bold text-accent">{artist.glow_score}</p>
                <p className="text-xs text-white/40 font-body uppercase tracking-wide">Glow Score</p>
              </div>
              <div>
                <p className="text-2xl font-headline font-bold text-white">{formatListeners(artist.followers)}</p>
                <p className="text-xs text-white/40 font-body uppercase tracking-wide">Followers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-glow py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <GlassMorphCard className="p-6 md:p-8">
              <h2 className="text-xl font-headline font-bold text-white mb-4">About</h2>
              <p className="text-white/70 font-body leading-relaxed">{artist.bio}</p>
            </GlassMorphCard>

            {/* Music */}
            <GlassMorphCard className="p-6 md:p-8">
              <h2 className="text-xl font-headline font-bold text-white mb-4 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-0.5 bg-accent rounded-full waveform-bar" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                Music
              </h2>
              <MusicEmbed
                spotifyUrl={artist.spotify_embed}
                soundcloudUrl={artist.soundcloud_embed}
                appleMusicUrl={artist.apple_music_embed}
              />
            </GlassMorphCard>

            {/* Gallery */}
            {artist.gallery.length > 0 && (
              <GlassMorphCard className="p-6 md:p-8">
                <h2 className="text-xl font-headline font-bold text-white mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {artist.gallery.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <Image
                        src={img}
                        alt={`${artist.name} gallery ${i + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                    </motion.div>
                  ))}
                </div>
              </GlassMorphCard>
            )}

            {/* Related articles */}
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-xl font-headline font-bold text-white mb-4">Features & Interviews</h2>
                <div className="space-y-3">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`}>
                      <GlassMorphCard className="p-4 group">
                        <div className="flex gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] text-accent font-body uppercase tracking-wider">{post.category}</span>
                            <h3 className="text-sm font-headline font-bold text-white group-hover:text-accent transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-xs text-white/40 font-body mt-1">{post.reading_time_minutes} min read</p>
                          </div>
                        </div>
                      </GlassMorphCard>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social links */}
            <GlassMorphCard className="p-6">
              <h3 className="text-sm font-headline font-bold text-white uppercase tracking-wider mb-4">Connect</h3>
              <div className="space-y-2">
                {Object.entries(artist.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                  >
                    <span className="text-white/40 group-hover:text-accent transition-colors">
                      {socialIcons[platform] || <span className="w-5 h-5 block" />}
                    </span>
                    <span className="text-sm text-white/60 group-hover:text-white transition-colors font-body capitalize">
                      {platform.replace('_', ' ')}
                    </span>
                    <svg className="w-4 h-4 text-white/20 group-hover:text-accent ml-auto transition-all group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </GlassMorphCard>

            {/* Tags */}
            <GlassMorphCard className="p-6">
              <h3 className="text-sm font-headline font-bold text-white uppercase tracking-wider mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {artist.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs font-body bg-white/5 text-white/40 rounded-full hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </GlassMorphCard>

            {/* Featured Track card */}
            <GlassMorphCard className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-0.5 bg-accent rounded-full waveform-bar" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <span className="text-xs text-white/40 font-body uppercase tracking-wider">Featured Track</span>
              </div>
              <p className="text-lg font-accent font-bold text-white">{artist.featured_track}</p>
              <p className="text-xs text-white/40 font-body mt-1">by {artist.name}</p>
            </GlassMorphCard>
          </div>
        </div>
      </div>
    </div>
  );
}
