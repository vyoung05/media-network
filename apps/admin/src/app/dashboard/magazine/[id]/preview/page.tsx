'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';

// ─── Types ───────────────────────────────────────────────

type PageType =
  | 'cover' | 'toc' | 'article' | 'spread' | 'video' | 'ad' | 'artist'
  | 'full-bleed' | 'back-cover' | 'gallery' | 'video-ad' | 'interactive'
  | 'audio' | 'quote' | 'credits' | 'letter';

interface GalleryImage {
  image_url: string;
  caption?: string;
  alt?: string;
}

interface CreditEntry {
  role: string;
  name: string;
}

interface MagazinePage {
  id: string;
  issue_id: string;
  page_number: number;
  type: PageType;
  title?: string;
  subtitle?: string;
  content?: string;
  pull_quote?: string;
  author?: string;
  author_title?: string;
  image_url?: string;
  image_alt?: string;
  secondary_image_url?: string;
  background_color?: string;
  text_color?: string;
  category?: string;
  tags?: string[];
  video_url?: string;
  music_embed?: string;
  artist_name?: string;
  artist_bio?: string;
  artist_links?: Record<string, string>;
  advertiser_name?: string;
  advertiser_tagline?: string;
  advertiser_cta?: string;
  advertiser_url?: string;
  toc_entries?: { title: string; page: number; category: string }[];
  video_embed_url?: string;
  youtube_url?: string;
  gallery_images?: GalleryImage[];
  audio_embed_url?: string;
  spotify_embed?: string;
  interactive_embed_url?: string;
  iframe_url?: string;
  title_font_size?: string;
  title_font_style?: string;
  title_alignment?: string;
  overlay_opacity?: number;
  text_position?: string;
  lower_third_text?: string;
  lower_third_subtitle?: string;
  caption?: string;
  photo_credit?: string;
  credits?: CreditEntry[];
  layout_style?: string;
  animation?: string;
  transition_effect?: string;
  cta_text?: string;
  cta_url?: string;
  cta_style?: string;
}

interface MagazineIssue {
  id: string;
  slug: string;
  title: string;
  issue_number: number;
  subtitle: string;
  description: string;
  cover_image: string;
  published_at: string | null;
  status: 'draft' | 'published' | 'archived';
  page_count: number;
  featured_color: string;
  season: string;
  pages: MagazinePage[];
  updated_at?: string;
}

// ─── Constants ───────────────────────────────────────────

const GOLD = '#C9A84C';

const PAGE_TYPE_LABELS: Record<string, string> = {
  cover: 'Cover',
  toc: 'Contents',
  article: 'Article',
  spread: 'Spread',
  video: 'Video',
  ad: 'Advertisement',
  artist: 'Artist Feature',
  'full-bleed': 'Full Bleed',
  'back-cover': 'Back Cover',
  gallery: 'Gallery',
  'video-ad': 'Video Ad',
  interactive: 'Interactive',
  audio: 'Audio',
  quote: 'Quote',
  credits: 'Credits',
  letter: 'Editor\'s Letter',
};

const FONT_SIZE_MAP: Record<string, string> = {
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
  '2xl': 'text-2xl sm:text-3xl',
  '3xl': 'text-3xl sm:text-4xl',
  '4xl': 'text-4xl sm:text-5xl',
};

const TEXT_ALIGN_MAP: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const TEXT_POS_MAP: Record<string, string> = {
  top: 'justify-start pt-12',
  center: 'justify-center',
  bottom: 'justify-end pb-8',
};

// ─── Helper: YouTube thumbnail ───────────────────────────

function getYouTubeThumbnail(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
}

// ─── Helper: YouTube embed URL ───────────────────────────

function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
}

// ═══════════════════════════════════════════════════════════
// PAGE RENDERERS — Each page type gets its own premium visual
// ═══════════════════════════════════════════════════════════

function CoverPage({ page, color }: { page: MagazinePage; color: string }) {
  const overlayOpacity = page.overlay_opacity ?? 0.5;
  const textPos = TEXT_POS_MAP[page.text_position || 'bottom'] || TEXT_POS_MAP.bottom;
  const titleAlign = TEXT_ALIGN_MAP[page.title_alignment || 'left'] || '';
  const titleSize = FONT_SIZE_MAP[page.title_font_size || '3xl'] || FONT_SIZE_MAP['3xl'];

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: page.background_color || '#0a0a0a' }}>
      {/* Background image */}
      {(page.image_url || getYouTubeThumbnail(page.youtube_url)) && (
        <div className="absolute inset-0">
          <img
            src={page.image_url || getYouTubeThumbnail(page.youtube_url)!}
            alt={page.image_alt || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity + 0.3}), rgba(0,0,0,${overlayOpacity * 0.3}), rgba(0,0,0,${overlayOpacity * 0.5}))` }} />
        </div>
      )}

      {/* Magazine masthead area */}
      <div className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">
            SauceCaviar
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">
            {page.category || 'Magazine'}
          </div>
        </div>
        <div className="w-full h-px mt-2" style={{ background: `linear-gradient(to right, transparent, ${color}40, transparent)` }} />
      </div>

      {/* Title content */}
      <div className={`relative h-full flex flex-col ${textPos} p-6 sm:p-8 z-10 ${titleAlign}`}>
        {page.category && (
          <div className="mb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em]" style={{ color }}>
              {page.category}
            </span>
          </div>
        )}
        {page.title && (
          <h1 className={`${titleSize} font-black text-white leading-[0.9] tracking-tight drop-shadow-2xl`} style={{ fontFamily: 'Inter, sans-serif' }}>
            {page.title}
          </h1>
        )}
        {page.subtitle && (
          <p className="mt-3 text-sm sm:text-base text-white/70 font-light max-w-md leading-relaxed">
            {page.subtitle}
          </p>
        )}
        {/* Lower third */}
        {page.lower_third_text && (
          <div className="mt-4 border-t border-white/10 pt-3">
            <p className="text-xs text-white/50">{page.lower_third_text}</p>
            {page.lower_third_subtitle && (
              <p className="text-[10px] text-white/30 mt-0.5">{page.lower_third_subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom edge accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: `linear-gradient(to right, ${color}, ${color}00)` }} />
    </div>
  );
}

function ArticlePage({ page, color }: { page: MagazinePage; color: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0c0c0c] flex flex-col">
      {/* Hero image — top 40% */}
      {page.image_url && (
        <div className="relative h-[40%] flex-shrink-0 overflow-hidden">
          <img src={page.image_url} alt={page.image_alt || ''} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0c0c0c]" />
          {page.photo_credit && (
            <span className="absolute bottom-2 right-3 text-[8px] text-white/30 uppercase tracking-wider">
              {page.photo_credit}
            </span>
          )}
        </div>
      )}

      {/* Article content */}
      <div className="flex-1 px-6 sm:px-8 py-4 overflow-hidden">
        {/* Category + tags */}
        <div className="flex items-center gap-3 mb-3">
          {page.category && (
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color }}>{page.category}</span>
          )}
          {page.tags?.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[9px] uppercase tracking-wider text-white/30 border border-white/10 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        {page.title && (
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2">{page.title}</h2>
        )}
        {page.subtitle && (
          <p className="text-sm text-white/50 font-light mb-3">{page.subtitle}</p>
        )}

        {/* Author */}
        {page.author && (
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/[0.06]">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${color}30`, color }}>
              {page.author.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-medium text-white/70">{page.author}</span>
              {page.author_title && <span className="text-[10px] text-white/30 ml-1">· {page.author_title}</span>}
            </div>
          </div>
        )}

        {/* Body text — magazine column style */}
        {page.content && (
          <div className="text-xs sm:text-sm text-white/60 leading-relaxed line-clamp-[8] sm:line-clamp-[10]" style={{ columnCount: page.content.length > 400 ? 2 : 1, columnGap: '1.5rem' }}>
            {page.content}
          </div>
        )}

        {/* Pull quote */}
        {page.pull_quote && (
          <blockquote className="mt-4 pl-4 border-l-2 py-2" style={{ borderColor: color }}>
            <p className="text-sm sm:text-base italic text-white/80 font-light leading-relaxed">
              &ldquo;{page.pull_quote}&rdquo;
            </p>
          </blockquote>
        )}
      </div>

      {/* Page footer accent */}
      <div className="px-6 pb-3">
        <div className="h-px w-12" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}

function AdPage({ page, color }: { page: MagazinePage; color: string }) {
  const bgColor = page.background_color || '#111';
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: bgColor }}>
      {/* Background image */}
      {page.image_url && (
        <div className="absolute inset-0">
          <img src={page.image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* "ADVERTISEMENT" tag */}
      <div className="absolute top-3 right-3 z-10">
        <span className="text-[8px] uppercase tracking-[0.3em] text-white/25 font-medium">Advertisement</span>
      </div>

      {/* Ad content */}
      <div className="relative z-10 text-center px-8 max-w-md">
        {page.advertiser_name && (
          <div className="text-xs font-bold uppercase tracking-[0.4em] text-white/50 mb-4">
            {page.advertiser_name}
          </div>
        )}
        {page.title && (
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3 leading-tight">
            {page.title}
          </h2>
        )}
        {page.advertiser_tagline && (
          <p className="text-sm sm:text-base text-white/70 font-light italic mb-6">
            {page.advertiser_tagline}
          </p>
        )}
        {page.advertiser_cta && (
          <div className="inline-block">
            {page.cta_style === 'banner' ? (
              <div className="px-8 py-3 text-sm font-bold uppercase tracking-wider text-black" style={{ backgroundColor: color }}>
                {page.advertiser_cta}
              </div>
            ) : page.cta_style === 'link' ? (
              <span className="text-sm font-medium underline underline-offset-4" style={{ color }}>
                {page.advertiser_cta} →
              </span>
            ) : (
              <button className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black transition-transform hover:scale-105" style={{ backgroundColor: color }}>
                {page.advertiser_cta}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom brand bar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <span className="text-[10px] uppercase tracking-[0.5em] font-medium" style={{ color }}>
          {page.advertiser_name || 'Sponsored'}
        </span>
      </div>
    </div>
  );
}

function SpreadPage({ page, color }: { page: MagazinePage; color: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Full image */}
      {page.image_url && (
        <div className="absolute inset-0">
          <img src={page.image_url} alt={page.image_alt || ''} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
        </div>
      )}

      {/* Secondary image strip */}
      {page.secondary_image_url && (
        <div className="absolute top-4 right-4 w-24 h-32 rounded-lg overflow-hidden border border-white/10 shadow-2xl">
          <img src={page.secondary_image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
        {page.category && (
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block" style={{ color }}>
            {page.category}
          </span>
        )}
        {page.title && (
          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2 drop-shadow-lg">{page.title}</h2>
        )}
        {page.subtitle && (
          <p className="text-sm text-white/60 mb-2">{page.subtitle}</p>
        )}
        {page.content && (
          <p className="text-xs text-white/40 line-clamp-3 max-w-lg leading-relaxed">{page.content}</p>
        )}
        {(page.caption || page.photo_credit) && (
          <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
            {page.caption && <span className="text-[10px] text-white/40 italic">{page.caption}</span>}
            {page.photo_credit && <span className="text-[10px] text-white/30">{page.photo_credit}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

function GalleryPage({ page, color }: { page: MagazinePage; color: string }) {
  const images = page.gallery_images || [];
  const layoutStyle = page.layout_style || 'grid';

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <div className="px-6 pt-6 pb-3 flex-shrink-0">
        {page.title && (
          <h2 className="text-lg sm:text-xl font-bold text-white">{page.title}</h2>
        )}
        {page.subtitle && (
          <p className="text-xs text-white/40 mt-1">{page.subtitle}</p>
        )}
        <div className="w-8 h-0.5 mt-3" style={{ backgroundColor: color }} />
      </div>

      {/* Gallery grid */}
      <div className="flex-1 px-4 pb-4 overflow-hidden">
        {images.length > 0 ? (
          <div className={`h-full gap-1.5 ${
            layoutStyle === 'filmstrip'
              ? 'flex overflow-x-auto'
              : images.length <= 2
                ? 'grid grid-cols-1 grid-rows-2'
                : images.length <= 4
                  ? 'grid grid-cols-2 grid-rows-2'
                  : 'grid grid-cols-3 grid-rows-2'
          }`}>
            {images.slice(0, 6).map((img, i) => (
              <div
                key={i}
                className={`relative rounded-lg overflow-hidden ${layoutStyle === 'filmstrip' ? 'flex-shrink-0 w-40 h-full' : ''} ${
                  i === 0 && images.length >= 3 && layoutStyle !== 'filmstrip' ? 'col-span-2 row-span-2' : ''
                }`}
              >
                <img src={img.image_url} alt={img.alt || ''} className="w-full h-full object-cover" />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <span className="text-[9px] text-white/70">{img.caption}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-white/20">
              <div className="text-4xl mb-2">🖼️</div>
              <p className="text-xs">No gallery images</p>
            </div>
          </div>
        )}
      </div>

      {/* Credits */}
      {(page.photo_credit || page.caption) && (
        <div className="px-6 pb-4 flex-shrink-0">
          <div className="text-[9px] text-white/30">
            {page.photo_credit && <span>{page.photo_credit}</span>}
            {page.caption && <span className="italic ml-2">{page.caption}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

function VideoPage({ page, color }: { page: MagazinePage; color: string }) {
  const ytThumb = getYouTubeThumbnail(page.youtube_url || page.video_url);
  const overlayOpacity = page.overlay_opacity ?? 0.4;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#080808] flex flex-col items-center justify-center">
      {/* Video thumbnail or embed preview */}
      {(page.image_url || ytThumb) && (
        <div className="absolute inset-0">
          <img src={page.image_url || ytThumb!} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }} />
        </div>
      )}

      {/* Play button */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 mb-4" style={{ backgroundColor: `${color}30` }}>
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        {page.title && (
          <h2 className={`${FONT_SIZE_MAP[page.title_font_size || 'xl']} font-bold text-white text-center mb-2 drop-shadow-lg px-6`}>
            {page.title}
          </h2>
        )}
        {page.content && (
          <p className="text-xs sm:text-sm text-white/50 text-center max-w-sm px-6 line-clamp-3">
            {page.content}
          </p>
        )}
      </div>

      {/* Video source badge */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <span className="text-[10px] uppercase tracking-wider text-white/30 flex items-center gap-1.5">
          {page.youtube_url ? '▶ YouTube' : page.video_embed_url ? '▶ Video' : '🎬 Video Feature'}
        </span>
      </div>
    </div>
  );
}

function ArtistPage({ page, color }: { page: MagazinePage; color: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0a] flex flex-col">
      {/* Artist photo — top half */}
      {page.image_url && (
        <div className="relative h-[50%] flex-shrink-0 overflow-hidden">
          <img src={page.image_url} alt={page.artist_name || ''} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
        </div>
      )}

      {/* Artist info */}
      <div className="flex-1 px-6 sm:px-8 -mt-8 relative z-10 overflow-hidden">
        {page.category && (
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 block" style={{ color }}>
            {page.category}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
          {page.artist_name || page.title}
        </h2>
        {page.subtitle && (
          <p className="text-sm text-white/40 italic mb-3">{page.subtitle}</p>
        )}

        {/* Bio */}
        {page.artist_bio && (
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed line-clamp-4 mb-4">
            {page.artist_bio}
          </p>
        )}

        {/* Pull quote */}
        {page.pull_quote && (
          <blockquote className="pl-3 border-l-2 mb-4" style={{ borderColor: color }}>
            <p className="text-sm italic text-white/70">&ldquo;{page.pull_quote}&rdquo;</p>
          </blockquote>
        )}

        {/* Links */}
        {page.artist_links && Object.keys(page.artist_links).length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {Object.entries(page.artist_links).map(([platform, url]) => (
              <span key={platform} className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10 text-white/40">
                {platform}
              </span>
            ))}
          </div>
        )}

        {/* Music embed indicator */}
        {(page.music_embed || page.spotify_embed) && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <span className="text-lg">🎵</span>
            <span className="text-[10px] uppercase tracking-wider text-white/40">Music Embed Available</span>
          </div>
        )}
      </div>
    </div>
  );
}

function QuotePage({ page, color }: { page: MagazinePage; color: string }) {
  const bgColor = page.background_color || '#0a0a0a';
  const txtColor = page.text_color || '#FFFFFF';
  const overlayOpacity = page.overlay_opacity ?? 0.5;
  const fontSize = FONT_SIZE_MAP[page.title_font_size || '3xl'] || FONT_SIZE_MAP['3xl'];
  const textAlign = TEXT_ALIGN_MAP[page.title_alignment || 'center'] || 'text-center';

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: bgColor }}>
      {/* Background image */}
      {page.image_url && (
        <div className="absolute inset-0">
          <img src={page.image_url} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }} />
        </div>
      )}

      {/* Quote content */}
      <div className={`relative z-10 px-8 sm:px-12 max-w-lg ${textAlign}`}>
        {/* Opening quote mark */}
        <div className="text-5xl sm:text-7xl font-serif leading-none mb-2 opacity-30" style={{ color }}>
          &ldquo;
        </div>
        {page.title && (
          <blockquote className={`${fontSize} font-light italic leading-snug mb-6`} style={{ color: txtColor }}>
            {page.title}
          </blockquote>
        )}
        {page.subtitle && (
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px" style={{ backgroundColor: color }} />
            <cite className="text-sm font-medium not-italic tracking-wide" style={{ color: `${txtColor}99` }}>
              {page.subtitle}
            </cite>
            <div className="w-8 h-px" style={{ backgroundColor: color }} />
          </div>
        )}
      </div>
    </div>
  );
}

function TocPage({ page, color }: { page: MagazinePage; color: string }) {
  const entries = page.toc_entries || [];

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0a] flex flex-col">
      {/* Background subtle image */}
      {page.image_url && (
        <div className="absolute inset-0 opacity-10">
          <img src={page.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Header */}
      <div className="relative px-6 sm:px-8 pt-8 pb-4 flex-shrink-0">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {page.title || 'Contents'}
        </h2>
        <div className="w-12 h-0.5 mt-3" style={{ backgroundColor: color }} />
      </div>

      {/* TOC entries */}
      <div className="flex-1 px-6 sm:px-8 overflow-hidden relative">
        {entries.length > 0 ? (
          <div className="space-y-0">
            {entries.map((entry, i) => (
              <div key={i} className="flex items-baseline gap-3 py-2.5 border-b border-white/[0.04] group">
                <span className="text-lg sm:text-xl font-bold font-mono min-w-[2rem]" style={{ color }}>
                  {String(entry.page).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-white group-hover:text-white/90 truncate block">
                    {entry.title}
                  </span>
                  {entry.category && (
                    <span className="text-[9px] uppercase tracking-wider text-white/25">{entry.category}</span>
                  )}
                </div>
                <div className="flex-1 border-b border-dotted border-white/10 mb-1 hidden sm:block" />
                <span className="text-xs font-mono text-white/20 flex-shrink-0">{entry.page}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-white/20 text-xs">
            No table of contents entries
          </div>
        )}
      </div>
    </div>
  );
}

function FullBleedPage({ page, color }: { page: MagazinePage; color: string }) {
  const overlayOpacity = page.overlay_opacity ?? 0.3;
  const textPos = TEXT_POS_MAP[page.text_position || 'bottom'] || TEXT_POS_MAP.bottom;
  const titleAlign = TEXT_ALIGN_MAP[page.title_alignment || 'left'] || '';
  const titleSize = FONT_SIZE_MAP[page.title_font_size || '2xl'] || FONT_SIZE_MAP['2xl'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Full-bleed image */}
      {(page.image_url || getYouTubeThumbnail(page.youtube_url)) && (
        <div className="absolute inset-0">
          <img src={page.image_url || getYouTubeThumbnail(page.youtube_url)!} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity + 0.4}), rgba(0,0,0,${overlayOpacity * 0.3}))` }} />
        </div>
      )}

      {/* Text overlay */}
      <div className={`relative h-full flex flex-col ${textPos} p-6 sm:p-8 z-10 ${titleAlign}`}>
        {page.category && (
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2" style={{ color }}>
            {page.category}
          </span>
        )}
        {page.title && (
          <h2 className={`${titleSize} font-bold text-white leading-tight drop-shadow-lg mb-2`}>
            {page.title}
          </h2>
        )}
        {page.subtitle && (
          <p className="text-sm text-white/60 font-light max-w-md">{page.subtitle}</p>
        )}
        {page.lower_third_text && (
          <div className="mt-4">
            <p className="text-xs text-white/40">{page.lower_third_text}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BackCoverPage({ page, color }: { page: MagazinePage; color: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: page.background_color || '#0a0a0a' }}>
      {page.image_url && (
        <div className="absolute inset-0 opacity-20">
          <img src={page.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative z-10 text-center px-8">
        {page.title && (
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">{page.title}</h2>
        )}
        {page.subtitle && (
          <p className="text-sm text-white/50 mb-4">{page.subtitle}</p>
        )}
        {page.content && (
          <p className="text-xs text-white/30 max-w-sm leading-relaxed">{page.content}</p>
        )}

        {/* SauceCaviar mark */}
        <div className="mt-8">
          <div className="w-12 h-px mx-auto mb-3" style={{ backgroundColor: color }} />
          <span className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold">SauceCaviar</span>
        </div>
      </div>
    </div>
  );
}

function VideoAdPage({ page, color }: { page: MagazinePage; color: string }) {
  const ytThumb = getYouTubeThumbnail(page.youtube_url);
  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ backgroundColor: page.background_color || '#111' }}>
      {/* "Advertisement" tag */}
      <div className="absolute top-3 right-3 z-20">
        <span className="text-[8px] uppercase tracking-[0.3em] text-white/25">Sponsored</span>
      </div>

      {/* Video preview area — top 60% */}
      <div className="relative h-[60%] flex-shrink-0 overflow-hidden flex items-center justify-center bg-black">
        {(page.image_url || ytThumb) && (
          <img src={page.image_url || ytThumb!} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20" style={{ backgroundColor: `${color}40` }}>
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </div>

      {/* Brand info */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {page.advertiser_name && (
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-2">{page.advertiser_name}</span>
        )}
        {page.advertiser_tagline && (
          <p className="text-sm text-white/70 italic mb-3">{page.advertiser_tagline}</p>
        )}
        {page.advertiser_cta && (
          <button className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-black" style={{ backgroundColor: color }}>
            {page.advertiser_cta}
          </button>
        )}
      </div>
    </div>
  );
}

function InteractivePage({ page, color }: { page: MagazinePage; color: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0a] flex flex-col items-center justify-center">
      {page.image_url && (
        <div className="absolute inset-0 opacity-20">
          <img src={page.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative z-10 text-center px-8">
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-white/10" style={{ backgroundColor: `${color}15` }}>
          <span className="text-3xl">🎮</span>
        </div>
        {page.title && (
          <h2 className="text-xl font-bold text-white mb-2">{page.title}</h2>
        )}
        {page.subtitle && (
          <p className="text-sm text-white/40 mb-3">{page.subtitle}</p>
        )}
        {page.content && (
          <p className="text-xs text-white/30 max-w-sm mx-auto leading-relaxed mb-4">{page.content}</p>
        )}
        {page.cta_text && (
          <button className="px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-black" style={{ backgroundColor: color }}>
            {page.cta_text}
          </button>
        )}
        {(page.iframe_url || page.interactive_embed_url) && (
          <p className="mt-4 text-[10px] text-white/20 uppercase tracking-wider">Interactive content available</p>
        )}
      </div>
    </div>
  );
}

function AudioPage({ page, color }: { page: MagazinePage; color: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0a] flex flex-col items-center justify-center">
      {/* Cover art background */}
      {page.image_url && (
        <div className="absolute inset-0">
          <img src={page.image_url} alt="" className="w-full h-full object-cover scale-110 blur-2xl opacity-30" />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center px-8">
        {/* Album art */}
        {page.image_url && (
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 mb-6 border border-white/10">
            <img src={page.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Track info */}
        <h2 className="text-lg sm:text-xl font-bold text-white text-center mb-1">
          {page.title}
        </h2>
        {page.artist_name && (
          <p className="text-sm text-white/50 mb-1">{page.artist_name}</p>
        )}
        {page.subtitle && (
          <p className="text-xs text-white/30 mb-4">{page.subtitle}</p>
        )}

        {/* Fake waveform/player UI */}
        <div className="w-full max-w-xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color }}>
              <svg className="w-3.5 h-3.5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
            <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: color }} />
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-white/20 font-mono">
            <span>1:24</span>
            <span>3:47</span>
          </div>
        </div>

        {/* Platform badge */}
        {page.spotify_embed && (
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20">
            <span className="text-[10px] text-[#1DB954] font-medium">Listen on Spotify</span>
          </div>
        )}
      </div>
    </div>
  );
}

function CreditsPage({ page, color }: { page: MagazinePage; color: string }) {
  const creditsList = page.credits || [];

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col" style={{ backgroundColor: page.background_color || '#0a0a0a' }}>
      {page.image_url && (
        <div className="absolute inset-0 opacity-10">
          <img src={page.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="relative flex-1 flex flex-col items-center justify-center px-8 sm:px-12 overflow-hidden">
        {page.title && (
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 tracking-wide">
            {page.title}
          </h2>
        )}

        {creditsList.length > 0 ? (
          <div className="space-y-3 w-full max-w-sm">
            {creditsList.map((credit, i) => (
              <div key={i} className="flex items-baseline justify-between gap-4">
                <span className="text-[10px] uppercase tracking-wider text-white/30 flex-shrink-0">{credit.role}</span>
                <div className="flex-1 border-b border-dotted border-white/[0.06]" />
                <span className="text-xs text-white/70 font-medium flex-shrink-0">{credit.name}</span>
              </div>
            ))}
          </div>
        ) : page.content ? (
          <p className="text-xs text-white/40 text-center leading-relaxed max-w-sm">{page.content}</p>
        ) : (
          <p className="text-xs text-white/20">No credits listed</p>
        )}

        {/* Logo mark */}
        <div className="mt-8">
          <div className="w-8 h-px mx-auto" style={{ backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

function LetterPage({ page, color }: { page: MagazinePage; color: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0c0c0c] flex flex-col">
      {/* Author photo */}
      <div className="flex items-center gap-4 px-6 sm:px-8 pt-8 pb-4 flex-shrink-0">
        {page.image_url && (
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: `${color}40` }}>
            <img src={page.image_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div>
          <h2 className="text-lg font-bold text-white">{page.title || "Editor's Letter"}</h2>
          {page.author && (
            <p className="text-xs text-white/50">{page.author}{page.author_title ? ` · ${page.author_title}` : ''}</p>
          )}
        </div>
      </div>

      <div className="w-full px-6 sm:px-8">
        <div className="h-px" style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
      </div>

      {/* Letter content */}
      <div className="flex-1 px-6 sm:px-8 py-4 overflow-hidden">
        {page.content && (
          <div className="text-xs sm:text-sm text-white/55 leading-relaxed line-clamp-[12] whitespace-pre-line font-light italic">
            {page.content}
          </div>
        )}

        {page.pull_quote && (
          <blockquote className="mt-4 pl-3 border-l-2 py-1" style={{ borderColor: color }}>
            <p className="text-sm text-white/70 italic">&ldquo;{page.pull_quote}&rdquo;</p>
          </blockquote>
        )}
      </div>

      {/* Signature area */}
      <div className="px-6 sm:px-8 pb-6 flex-shrink-0">
        {page.author && (
          <div className="text-right">
            <p className="text-sm font-medium text-white/60 italic">{page.author}</p>
            {page.author_title && (
              <p className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{page.author_title}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page Renderer Dispatcher ────────────────────────────

function PageRenderer({ page, color }: { page: MagazinePage; color: string }) {
  const renderers: Record<string, React.FC<{ page: MagazinePage; color: string }>> = {
    'cover': CoverPage,
    'article': ArticlePage,
    'ad': AdPage,
    'spread': SpreadPage,
    'gallery': GalleryPage,
    'video': VideoPage,
    'artist': ArtistPage,
    'quote': QuotePage,
    'toc': TocPage,
    'full-bleed': FullBleedPage,
    'back-cover': BackCoverPage,
    'video-ad': VideoAdPage,
    'interactive': InteractivePage,
    'audio': AudioPage,
    'credits': CreditsPage,
    'letter': LetterPage,
  };

  const Renderer = renderers[page.type];
  if (Renderer) return <Renderer page={page} color={color} />;

  // Fallback for unknown types
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      <div className="text-center px-8">
        <div className="text-4xl mb-3">📄</div>
        <h3 className="text-lg font-bold text-white mb-1">{page.title || 'Untitled'}</h3>
        <p className="text-xs text-white/40">{PAGE_TYPE_LABELS[page.type] || page.type}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// THUMBNAIL STRIP
// ═══════════════════════════════════════════════════════════

function ThumbnailStrip({
  pages,
  currentPage,
  onSelect,
  color,
}: {
  pages: MagazinePage[];
  currentPage: number;
  onSelect: (index: number) => void;
  color: string;
}) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stripRef.current) {
      const active = stripRef.current.children[currentPage] as HTMLElement;
      if (active) {
        active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentPage]);

  return (
    <div
      ref={stripRef}
      className="flex gap-2 overflow-x-auto pb-2 px-1 scrollbar-thin"
      style={{ scrollbarWidth: 'thin', scrollbarColor: `${color}40 transparent` }}
    >
      {pages.map((page, i) => (
        <button
          key={page.id}
          onClick={() => onSelect(i)}
          className={`relative flex-shrink-0 w-14 sm:w-16 rounded-lg overflow-hidden transition-all duration-200 ${
            i === currentPage
              ? 'ring-2 scale-105 shadow-lg'
              : 'opacity-50 hover:opacity-80'
          }`}
          style={{
            aspectRatio: '9/16',
            '--tw-ring-color': color,
          } as React.CSSProperties}
        >
          <div className="w-full h-full">
            <div className="w-full h-full transform scale-100 origin-center" style={{ fontSize: '3px' }}>
              {page.image_url ? (
                <img src={page.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: page.background_color || '#111' }}>
                  <span className="text-base sm:text-lg">
                    {PAGE_TYPE_LABELS[page.type]?.charAt(0) || '?'}
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Page number */}
          <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] font-mono text-white/60 bg-black/60 px-1 rounded">
            {page.page_number}
          </div>
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PREVIEW PAGE
// ═══════════════════════════════════════════════════════════

export default function MagazinePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;

  const [issue, setIssue] = useState<MagazineIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'flip' | 'grid'>('flip');
  const [direction, setDirection] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [publishMsg, setPublishMsg] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch/swipe state
  const dragX = useMotionValue(0);

  // ─── Fetch ─────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/magazine-issues/${issueId}`);
        if (!res.ok) throw new Error('Failed to load issue');
        const data = await res.json();
        setIssue({
          ...data,
          pages: (data.pages || []).sort((a: MagazinePage, b: MagazinePage) => a.page_number - b.page_number),
        });
      } catch (err) {
        console.error('Failed to load preview:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [issueId]);

  const totalPages = issue?.pages.length || 0;

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setDirection(page > currentPage ? 1 : -1);
      setCurrentPage(page);
    }
  }, [totalPages, currentPage]);

  // ─── Keyboard nav ──────────────────────────────────────

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPage(currentPage - 1);
      } else if (e.key === 'Escape') {
        router.push(`/dashboard/magazine/${issueId}/edit`);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToPage, currentPage, router, issueId]);

  // ─── Swipe handler ─────────────────────────────────────

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && info.velocity.x < 0) {
      goToPage(currentPage + 1);
    } else if (info.offset.x > threshold && info.velocity.x > 0) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, goToPage]);

  // ─── Publish handler ───────────────────────────────────

  const handlePublish = async () => {
    if (!confirm('Publish this issue? It will become publicly visible on saucecaviar.com.')) return;
    setPublishing(true);
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}/publish`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to publish');
      const updated = await res.json();
      setIssue((prev) => prev ? { ...prev, ...updated } : prev);
      setPublishMsg('Published! 🎉');
      setTimeout(() => setPublishMsg(null), 3000);
    } catch (err: any) {
      setPublishMsg('Failed to publish');
      setTimeout(() => setPublishMsg(null), 3000);
    } finally {
      setPublishing(false);
    }
  };

  const color = issue?.featured_color || GOLD;

  // ─── Loading ───────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: color }} />
          <span className="text-xs text-white/30 uppercase tracking-wider">Loading magazine...</span>
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="glass-panel p-12 text-center max-w-md mx-auto mt-20">
        <div className="text-4xl mb-3">📕</div>
        <p className="text-red-400 mb-4">Issue not found</p>
        <button onClick={() => router.back()} className="admin-btn-ghost text-sm">← Go Back</button>
      </div>
    );
  }

  if (totalPages === 0) {
    return (
      <div className="glass-panel p-12 text-center max-w-md mx-auto mt-20">
        <div className="text-4xl mb-3">📄</div>
        <h2 className="text-lg font-bold text-white mb-2">No Pages Yet</h2>
        <p className="text-sm text-white/40 mb-4">Add pages in the editor to preview your magazine.</p>
        <button
          onClick={() => router.push(`/dashboard/magazine/${issueId}/edit`)}
          className="admin-btn-primary text-sm"
        >
          ✏️ Open Editor
        </button>
      </div>
    );
  }

  // ─── Page transition variants ──────────────────────────

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.92,
      rotateY: dir > 0 ? -15 : 15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-60%' : '60%',
      opacity: 0,
      scale: 0.92,
      rotateY: dir > 0 ? 15 : -15,
    }),
  };

  const isDraft = issue.status === 'draft';

  return (
    <div className="space-y-4 pb-8">
      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/dashboard/magazine/${issueId}/edit`)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-base">📖</span> {issue.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-mono text-white/30">Issue #{issue.issue_number}</span>
              <span className="text-white/10">·</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                issue.status === 'published'
                  ? 'bg-green-500/10 text-green-400 border-green-500/20'
                  : issue.status === 'archived'
                    ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
              }`}>
                {issue.status}
              </span>
              <span className="text-white/10">·</span>
              <span className="text-[10px] text-white/25">{totalPages} pages</span>
              {issue.season && (
                <>
                  <span className="text-white/10">·</span>
                  <span className="text-[10px] text-white/25">{issue.season}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex gap-0.5 bg-white/[0.03] rounded-lg p-0.5 border border-white/[0.04]">
            <button
              onClick={() => setViewMode('flip')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'flip' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              📖 Flip
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                viewMode === 'grid' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              ⊞ Grid
            </button>
          </div>

          {/* Edit button */}
          <button
            onClick={() => router.push(`/dashboard/magazine/${issueId}/edit`)}
            className="admin-btn-ghost text-sm flex items-center gap-1.5"
          >
            ✏️ Edit
          </button>

          {/* Publish button */}
          {issue.status !== 'published' && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="admin-btn-primary text-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {publishing ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                '🚀'
              )}
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Publish success/error */}
      <AnimatePresence>
        {publishMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`glass-panel p-3 border text-sm ${
              publishMsg.includes('🎉')
                ? 'border-green-500/20 bg-green-500/5 text-green-400'
                : 'border-red-500/20 bg-red-500/5 text-red-400'
            }`}
          >
            {publishMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last edited info */}
      {issue.updated_at && (
        <div className="text-[10px] text-white/20 text-right">
          Last updated {new Date(issue.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </div>
      )}

      {/* ═══ FLIP VIEW ═══ */}
      {viewMode === 'flip' && (
        <div className="flex flex-col items-center">
          {/* Magazine page container */}
          <div
            ref={containerRef}
            className="relative w-full max-w-lg mx-auto"
            style={{ perspective: '1200px' }}
          >
            {/* Magazine frame */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-white/[0.08]" style={{ aspectRatio: '9/16' }}>
              {/* DRAFT watermark */}
              {isDraft && (
                <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
                  <div className="text-6xl sm:text-7xl font-black text-white/[0.04] uppercase tracking-[0.3em] -rotate-45 select-none">
                    DRAFT
                  </div>
                </div>
              )}

              {/* Page content with swipe */}
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                  key={currentPage}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  style={{ x: dragX }}
                >
                  <PageRenderer page={issue.pages[currentPage]} color={color} />
                </motion.div>
              </AnimatePresence>

              {/* Edge nav zones (desktop) */}
              <div className="absolute inset-0 z-20 hidden sm:flex pointer-events-none">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="w-16 h-full pointer-events-auto opacity-0 hover:opacity-100 transition-opacity disabled:pointer-events-none"
                >
                  <div className="h-full w-full bg-gradient-to-r from-black/30 to-transparent flex items-center pl-2">
                    <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="w-16 h-full pointer-events-auto opacity-0 hover:opacity-100 transition-opacity disabled:pointer-events-none"
                >
                  <div className="h-full w-full bg-gradient-to-l from-black/30 to-transparent flex items-center justify-end pr-2">
                    <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Page type label below the page */}
            <div className="text-center mt-3">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium px-3 py-1 rounded-full border border-white/[0.06] bg-white/[0.02]" style={{ color: `${color}99` }}>
                {PAGE_TYPE_LABELS[issue.pages[currentPage]?.type] || issue.pages[currentPage]?.type}
              </span>
            </div>
          </div>

          {/* ─── Navigation controls ─── */}
          <div className="flex flex-col items-center gap-3 mt-4 w-full max-w-lg">
            {/* Prev / Page counter / Next */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all touch-manipulation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Page counter */}
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold font-mono" style={{ color }}>
                  {String(currentPage + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-white/20 font-mono">/</span>
                <span className="text-sm text-white/30 font-mono">
                  {String(totalPages).padStart(2, '0')}
                </span>
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all touch-manipulation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 rounded-full bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={false}
                animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>

            {/* Thumbnail strip */}
            <ThumbnailStrip
              pages={issue.pages}
              currentPage={currentPage}
              onSelect={(i) => goToPage(i)}
              color={color}
            />

            {/* Help text */}
            <p className="text-[10px] text-white/15 text-center mt-1">
              Swipe, click edges, or use ← → arrow keys · Esc to exit
            </p>
          </div>
        </div>
      )}

      {/* ═══ GRID VIEW ═══ */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {issue.pages.map((page, i) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4, ease: 'easeOut' }}
              onClick={() => { setViewMode('flip'); goToPage(i); }}
              className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg shadow-black/30 border border-white/[0.06] hover:border-white/[0.12] transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ aspectRatio: '9/16' }}
            >
              <PageRenderer page={page} color={color} />

              {/* DRAFT watermark on grid */}
              {isDraft && (
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-white/[0.05] uppercase -rotate-45">DRAFT</span>
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors z-10 flex items-center justify-center">
                <span className="text-white/0 group-hover:text-white/70 transition-colors text-xs font-medium">
                  Open →
                </span>
              </div>

              {/* Page number badge */}
              <div className="absolute top-2 left-2 z-20 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono bg-black/60 backdrop-blur-sm" style={{ color }}>
                {page.page_number}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
