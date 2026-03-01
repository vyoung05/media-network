'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───────────────────────────────────────────────

type PageType =
  | 'cover' | 'toc' | 'article' | 'spread' | 'video' | 'ad' | 'artist' | 'full-bleed' | 'back-cover'
  | 'gallery' | 'video-ad' | 'interactive' | 'audio' | 'quote' | 'credits' | 'letter';

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
  // ─── New DB columns ───
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
}

// ─── Constants ───────────────────────────────────────────

const PAGE_TYPE_ICONS: Record<PageType, string> = {
  'cover': '📰',
  'toc': '📋',
  'article': '📝',
  'spread': '🖼️',
  'video': '🎬',
  'ad': '📢',
  'artist': '🎤',
  'full-bleed': '🌅',
  'back-cover': '📕',
  'gallery': '🖼️',
  'video-ad': '📺',
  'interactive': '🎮',
  'audio': '🎵',
  'quote': '💬',
  'credits': '🎬',
  'letter': '✉️',
};

const PAGE_TYPE_LABELS: Record<PageType, string> = {
  'cover': 'Cover',
  'toc': 'Table of Contents',
  'article': 'Article',
  'spread': 'Spread',
  'video': 'Video',
  'ad': 'Advertisement',
  'artist': 'Artist Feature',
  'full-bleed': 'Full Bleed',
  'back-cover': 'Back Cover',
  'gallery': 'Photo Gallery',
  'video-ad': 'Video Ad/Commercial',
  'interactive': 'Interactive Embed',
  'audio': 'Audio Embed',
  'quote': 'Pull Quote / Statement',
  'credits': 'Credits Page',
  'letter': 'Letter from Editor',
};

const ALL_PAGE_TYPES: PageType[] = [
  'cover', 'toc', 'article', 'spread', 'video', 'ad', 'artist', 'full-bleed', 'back-cover',
  'gallery', 'video-ad', 'interactive', 'audio', 'quote', 'credits', 'letter',
];

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  published: 'bg-green-500/20 text-green-400 border-green-500/30',
  archived: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

// ─── Page type field definitions ─────────────────────────

type FieldDef = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'color' | 'tags' | 'toc-entries' | 'artist-links' | 'select' | 'number' | 'gallery-editor' | 'credits-editor';
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  group?: string;
};

// ─── Common field groups appended to every page type ─────

const COMMON_FIELDS: FieldDef[] = [
  { key: 'lower_third_text', label: 'Lower Third Text', type: 'text', placeholder: 'Overlay text...', group: 'Lower Third / Captions' },
  { key: 'lower_third_subtitle', label: 'Lower Third Subtitle', type: 'text', placeholder: 'Subtitle overlay...', group: 'Lower Third / Captions' },
  { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Caption text...', group: 'Lower Third / Captions' },
  { key: 'photo_credit', label: 'Photo/Media Credit', type: 'text', placeholder: 'Photo by...', group: 'Lower Third / Captions' },
  { key: 'layout_style', label: 'Layout Style', type: 'select', options: [
    { value: 'standard', label: 'Standard' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'immersive', label: 'Immersive' },
  ], group: 'Layout & Effects' },
  { key: 'animation', label: 'Enter Animation', type: 'select', options: [
    { value: 'none', label: 'None' },
    { value: 'fade', label: 'Fade' },
    { value: 'slide', label: 'Slide' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'parallax', label: 'Parallax' },
  ], group: 'Layout & Effects' },
  { key: 'transition_effect', label: 'Page Transition', type: 'select', options: [
    { value: 'none', label: 'None' },
    { value: 'slide', label: 'Slide' },
    { value: 'fade', label: 'Fade' },
    { value: 'flip', label: 'Flip' },
    { value: 'dissolve', label: 'Dissolve' },
  ], group: 'Layout & Effects' },
  { key: 'cta_text', label: 'CTA Button Text', type: 'text', placeholder: 'Learn More', group: 'CTA' },
  { key: 'cta_url', label: 'CTA Link URL', type: 'url', placeholder: 'https://...', group: 'CTA' },
];

const FONT_SIZE_OPTIONS = [
  { value: 'lg', label: 'Large' },
  { value: 'xl', label: 'Extra Large' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
];

const FONT_SIZE_QUOTE_OPTIONS = [
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: '4xl', label: '4XL' },
];

const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

const TEXT_POSITION_OPTIONS = [
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
  { value: 'bottom', label: 'Bottom' },
];

const CTA_STYLE_OPTIONS = [
  { value: 'button', label: 'Button' },
  { value: 'link', label: 'Link' },
  { value: 'banner', label: 'Banner' },
];

const GALLERY_LAYOUT_OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'masonry', label: 'Masonry' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'filmstrip', label: 'Filmstrip' },
];

const PAGE_TYPE_FIELDS: Record<PageType, FieldDef[]> = {
  'cover': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Cover title', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Cover subtitle', group: 'Content' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'youtube_url', label: 'YouTube URL (video cover background)', type: 'url', placeholder: 'https://youtube.com/...', group: 'Media' },
    { key: 'background_color', label: 'Background Color', type: 'color', placeholder: '#000000', group: 'Media' },
    { key: 'title_font_size', label: 'Title Font Size', type: 'select', options: FONT_SIZE_OPTIONS, group: 'Typography' },
    { key: 'title_alignment', label: 'Title Alignment', type: 'select', options: ALIGNMENT_OPTIONS, group: 'Typography' },
    { key: 'text_position', label: 'Text Position', type: 'select', options: TEXT_POSITION_OPTIONS, group: 'Typography' },
    { key: 'overlay_opacity', label: 'Overlay Opacity', type: 'number', min: 0, max: 1, step: 0.1, group: 'Layout & Effects' },
    ...COMMON_FIELDS,
  ],
  'toc': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Table of Contents', group: 'Content' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'toc_entries', label: 'TOC Entries', type: 'toc-entries', group: 'Content' },
    ...COMMON_FIELDS,
  ],
  'article': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Article title', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Article subtitle', group: 'Content' },
    { key: 'author', label: 'Author', type: 'text', placeholder: 'Author name', group: 'Content' },
    { key: 'author_title', label: 'Author Title', type: 'text', placeholder: 'e.g. Senior Editor', group: 'Content' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Culture', group: 'Content' },
    { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Article body...', group: 'Content' },
    { key: 'pull_quote', label: 'Pull Quote', type: 'text', placeholder: 'A standout quote...', group: 'Content' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'youtube_url', label: 'YouTube Video URL', type: 'url', placeholder: 'https://youtube.com/...', group: 'Media' },
    { key: 'audio_embed_url', label: 'Audio Embed URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'spotify_embed', label: 'Spotify Embed URL', type: 'url', placeholder: 'https://open.spotify.com/...', group: 'Media' },
    { key: 'gallery_images', label: 'Gallery Images', type: 'gallery-editor', group: 'Media' },
    { key: 'tags', label: 'Tags', type: 'tags', placeholder: 'culture, fashion, music', group: 'Content' },
    ...COMMON_FIELDS,
  ],
  'spread': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Spread title', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Spread subtitle', group: 'Content' },
    { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Spread body...', group: 'Content' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Fashion', group: 'Content' },
    { key: 'image_url', label: 'Primary Image URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'secondary_image_url', label: 'Secondary Image URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'gallery_images', label: 'Additional Gallery Images', type: 'gallery-editor', group: 'Media' },
    { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Image caption...', group: 'Lower Third / Captions' },
    { key: 'photo_credit', label: 'Photo Credit', type: 'text', placeholder: 'Photo by...', group: 'Lower Third / Captions' },
    ...COMMON_FIELDS.filter(f => f.key !== 'caption' && f.key !== 'photo_credit'),
  ],
  'video': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Video title', group: 'Content' },
    { key: 'content', label: 'Description', type: 'textarea', placeholder: 'Video description...', group: 'Content' },
    { key: 'video_url', label: 'Video URL (legacy)', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'youtube_url', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/...', group: 'Media' },
    { key: 'video_embed_url', label: 'Video Embed URL (non-YouTube)', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'title_font_size', label: 'Title Font Size', type: 'select', options: FONT_SIZE_OPTIONS, group: 'Typography' },
    { key: 'overlay_opacity', label: 'Overlay Opacity', type: 'number', min: 0, max: 1, step: 0.1, group: 'Layout & Effects' },
    ...COMMON_FIELDS,
  ],
  'ad': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Ad title', group: 'Content' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'video_embed_url', label: 'Video Ad URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'youtube_url', label: 'YouTube Ad URL', type: 'url', placeholder: 'https://youtube.com/...', group: 'Media' },
    { key: 'advertiser_name', label: 'Advertiser Name', type: 'text', placeholder: 'Brand name', group: 'Advertiser' },
    { key: 'advertiser_tagline', label: 'Tagline', type: 'text', placeholder: 'The tagline...', group: 'Advertiser' },
    { key: 'advertiser_cta', label: 'CTA Text', type: 'text', placeholder: 'Shop Now', group: 'Advertiser' },
    { key: 'advertiser_url', label: 'CTA URL', type: 'url', placeholder: 'https://...', group: 'Advertiser' },
    { key: 'cta_style', label: 'CTA Style', type: 'select', options: CTA_STYLE_OPTIONS, group: 'Advertiser' },
    { key: 'background_color', label: 'Background Color', type: 'color', placeholder: '#000000', group: 'Media' },
    ...COMMON_FIELDS,
  ],
  'artist': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Feature title', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Subtitle', group: 'Content' },
    { key: 'artist_name', label: 'Artist Name', type: 'text', placeholder: 'Artist name', group: 'Artist' },
    { key: 'artist_bio', label: 'Artist Bio', type: 'textarea', placeholder: 'Artist biography...', group: 'Artist' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'artist_links', label: 'Artist Links', type: 'artist-links', group: 'Artist' },
    { key: 'music_embed', label: 'Music Embed', type: 'url', placeholder: 'Spotify/SoundCloud embed URL', group: 'Artist' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g. Hip-Hop', group: 'Content' },
    { key: 'pull_quote', label: 'Pull Quote', type: 'text', placeholder: 'A standout quote...', group: 'Content' },
    ...COMMON_FIELDS,
  ],
  'full-bleed': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Title', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Subtitle', group: 'Content' },
    { key: 'category', label: 'Category', type: 'text', placeholder: 'Category', group: 'Content' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'youtube_url', label: 'YouTube URL (video background)', type: 'url', placeholder: 'https://youtube.com/...', group: 'Media' },
    { key: 'title_font_size', label: 'Title Font Size', type: 'select', options: FONT_SIZE_OPTIONS, group: 'Typography' },
    { key: 'title_alignment', label: 'Title Alignment', type: 'select', options: ALIGNMENT_OPTIONS, group: 'Typography' },
    { key: 'text_position', label: 'Text Position', type: 'select', options: TEXT_POSITION_OPTIONS, group: 'Typography' },
    { key: 'overlay_opacity', label: 'Overlay Opacity', type: 'number', min: 0, max: 1, step: 0.1, group: 'Layout & Effects' },
    ...COMMON_FIELDS,
  ],
  'back-cover': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Title', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Subtitle', group: 'Content' },
    { key: 'content', label: 'Content', type: 'textarea', placeholder: 'Back cover content...', group: 'Content' },
    { key: 'image_url', label: 'Image URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'background_color', label: 'Background Color', type: 'color', placeholder: '#000000', group: 'Media' },
    ...COMMON_FIELDS,
  ],
  // ─── NEW PAGE TYPES ───────────────────────────────────
  'gallery': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Gallery title', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Gallery subtitle', group: 'Content' },
    { key: 'gallery_images', label: 'Gallery Images', type: 'gallery-editor', group: 'Media' },
    { key: 'caption', label: 'Caption', type: 'text', placeholder: 'Gallery caption...', group: 'Lower Third / Captions' },
    { key: 'photo_credit', label: 'Photo Credit', type: 'text', placeholder: 'Photos by...', group: 'Lower Third / Captions' },
    { key: 'layout_style', label: 'Gallery Layout', type: 'select', options: GALLERY_LAYOUT_OPTIONS, group: 'Layout & Effects' },
    ...COMMON_FIELDS.filter(f => f.key !== 'caption' && f.key !== 'photo_credit' && f.key !== 'layout_style'),
  ],
  'video-ad': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Video ad title', group: 'Content' },
    { key: 'video_embed_url', label: 'Video Embed URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'youtube_url', label: 'YouTube URL', type: 'url', placeholder: 'https://youtube.com/...', group: 'Media' },
    { key: 'advertiser_name', label: 'Advertiser Name', type: 'text', placeholder: 'Brand name', group: 'Advertiser' },
    { key: 'advertiser_tagline', label: 'Advertiser Tagline', type: 'text', placeholder: 'The tagline...', group: 'Advertiser' },
    { key: 'advertiser_cta', label: 'Advertiser CTA', type: 'text', placeholder: 'Watch Now', group: 'Advertiser' },
    { key: 'advertiser_url', label: 'Advertiser URL', type: 'url', placeholder: 'https://...', group: 'Advertiser' },
    { key: 'cta_style', label: 'CTA Style', type: 'select', options: CTA_STYLE_OPTIONS, group: 'Advertiser' },
    { key: 'overlay_opacity', label: 'Overlay Opacity', type: 'number', min: 0, max: 1, step: 0.1, group: 'Layout & Effects' },
    { key: 'background_color', label: 'Background Color', type: 'color', placeholder: '#000000', group: 'Media' },
    ...COMMON_FIELDS,
  ],
  'interactive': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Interactive content title', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Subtitle', group: 'Content' },
    { key: 'content', label: 'Description', type: 'textarea', placeholder: 'Describe the interactive content...', group: 'Content' },
    { key: 'iframe_url', label: 'iFrame URL (game/quiz)', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'interactive_embed_url', label: 'Interactive Embed URL (backup)', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'image_url', label: 'Fallback Thumbnail', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'cta_text', label: 'CTA Text', type: 'text', placeholder: 'Play Now', group: 'CTA' },
    { key: 'cta_url', label: 'CTA URL', type: 'url', placeholder: 'https://...', group: 'CTA' },
    ...COMMON_FIELDS.filter(f => f.key !== 'cta_text' && f.key !== 'cta_url'),
  ],
  'audio': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Audio title', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Subtitle', group: 'Content' },
    { key: 'artist_name', label: 'Artist Name', type: 'text', placeholder: 'Artist / Host name', group: 'Content' },
    { key: 'content', label: 'Description', type: 'textarea', placeholder: 'Episode/track description...', group: 'Content' },
    { key: 'spotify_embed', label: 'Spotify Embed URL', type: 'url', placeholder: 'https://open.spotify.com/...', group: 'Media' },
    { key: 'audio_embed_url', label: 'Audio Embed URL', type: 'url', placeholder: 'https://soundcloud.com/...', group: 'Media' },
    { key: 'image_url', label: 'Cover Art URL', type: 'url', placeholder: 'https://...', group: 'Media' },
    ...COMMON_FIELDS,
  ],
  'quote': [
    { key: 'title', label: 'Quote Text', type: 'textarea', placeholder: 'The big quote...', group: 'Content' },
    { key: 'subtitle', label: 'Attribution', type: 'text', placeholder: '— Author Name', group: 'Content' },
    { key: 'image_url', label: 'Background Image', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'background_color', label: 'Background Color', type: 'color', placeholder: '#000000', group: 'Media' },
    { key: 'text_color', label: 'Text Color', type: 'color', placeholder: '#FFFFFF', group: 'Typography' },
    { key: 'title_font_size', label: 'Quote Font Size', type: 'select', options: FONT_SIZE_QUOTE_OPTIONS, group: 'Typography' },
    { key: 'title_alignment', label: 'Text Alignment', type: 'select', options: ALIGNMENT_OPTIONS, group: 'Typography' },
    { key: 'overlay_opacity', label: 'Overlay Opacity', type: 'number', min: 0, max: 1, step: 0.1, group: 'Layout & Effects' },
    ...COMMON_FIELDS,
  ],
  'credits': [
    { key: 'title', label: 'Credits Title', type: 'text', placeholder: 'Credits', group: 'Content' },
    { key: 'content', label: 'Credits Text', type: 'textarea', placeholder: 'Additional credits text...', group: 'Content' },
    { key: 'credits', label: 'Credits List', type: 'credits-editor', group: 'Content' },
    { key: 'image_url', label: 'Background Image', type: 'url', placeholder: 'https://...', group: 'Media' },
    { key: 'background_color', label: 'Background Color', type: 'color', placeholder: '#000000', group: 'Media' },
    ...COMMON_FIELDS,
  ],
  'letter': [
    { key: 'title', label: 'Title', type: 'text', placeholder: 'Letter from the Editor', group: 'Content' },
    { key: 'subtitle', label: 'Subtitle', type: 'text', placeholder: 'Subtitle', group: 'Content' },
    { key: 'author', label: 'Author', type: 'text', placeholder: 'Editor name', group: 'Content' },
    { key: 'author_title', label: 'Author Title', type: 'text', placeholder: 'e.g. Editor-in-Chief', group: 'Content' },
    { key: 'content', label: 'Letter Content', type: 'textarea', placeholder: 'Dear readers...', group: 'Content' },
    { key: 'pull_quote', label: 'Pull Quote', type: 'text', placeholder: 'A standout quote...', group: 'Content' },
    { key: 'image_url', label: 'Author Photo', type: 'url', placeholder: 'https://...', group: 'Media' },
    ...COMMON_FIELDS,
  ],
};

// ─── Field grouping helpers ──────────────────────────────

const GROUP_ORDER = [
  'Content',
  'Media',
  'Artist',
  'Advertiser',
  'Typography',
  'Layout & Effects',
  'Lower Third / Captions',
  'CTA',
];

const GROUP_ICONS: Record<string, string> = {
  'Content': '📝',
  'Media': '🎞️',
  'Artist': '🎤',
  'Advertiser': '📢',
  'Typography': '🔤',
  'Layout & Effects': '✨',
  'Lower Third / Captions': '💬',
  'CTA': '🔗',
};

function groupFields(fields: FieldDef[]): { group: string; fields: FieldDef[] }[] {
  const grouped: Record<string, FieldDef[]> = {};
  for (const field of fields) {
    const g = field.group || 'Content';
    if (!grouped[g]) grouped[g] = [];
    grouped[g].push(field);
  }
  return GROUP_ORDER
    .filter((g) => grouped[g] && grouped[g].length > 0)
    .map((g) => ({ group: g, fields: grouped[g] }));
}

// ═══════════════════════════════════════════════════════════
// COLLAPSIBLE FIELD GROUP
// ═══════════════════════════════════════════════════════════

function FieldGroup({
  group,
  fields,
  pageForm,
  setPageForm,
  defaultOpen,
}: {
  group: string;
  fields: FieldDef[];
  pageForm: Record<string, any>;
  setPageForm: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] active:bg-white/[0.06] transition-colors touch-manipulation"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <span>{GROUP_ICONS[group] || '📄'}</span>
          {group}
          <span className="text-xs text-gray-600">({fields.length})</span>
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {fields.map((field) => (
                <PageFieldEditor
                  key={field.key}
                  field={field}
                  value={pageForm[field.key]}
                  onChange={(val) => setPageForm((f) => ({ ...f, [field.key]: val }))}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function EditMagazineIssuePage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.id as string;

  // ─── State ───
  const [issue, setIssue] = useState<MagazineIssue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Issue form fields
  const [issueForm, setIssueForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    season: '',
    featured_color: '#C9A84C',
    cover_image: '',
  });

  // Page management
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [editingPage, setEditingPage] = useState<MagazinePage | null>(null);
  const [pageForm, setPageForm] = useState<Record<string, any>>({});
  const [savingPage, setSavingPage] = useState(false);

  // ─── Fetch issue ───
  const fetchIssue = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}`);
      if (!res.ok) throw new Error('Failed to fetch issue');
      const data: MagazineIssue = await res.json();
      setIssue(data);
      setIssueForm({
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        season: data.season || '',
        featured_color: data.featured_color || '#C9A84C',
        cover_image: data.cover_image || '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [issueId]);

  useEffect(() => { fetchIssue(); }, [fetchIssue]);

  // ─── Flash success message ───
  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // ─── Save issue details ───
  const handleSaveIssue = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(issueForm),
      });
      if (!res.ok) throw new Error('Failed to save issue');
      const updated = await res.json();
      setIssue((prev) => prev ? { ...prev, ...updated } : prev);
      flash('Issue details saved!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ─── Publish issue ───
  const handlePublish = async () => {
    if (!confirm('Publish this issue? It will become publicly visible.')) return;
    setPublishing(true);
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}/publish`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to publish');
      const updated = await res.json();
      setIssue((prev) => prev ? { ...prev, ...updated } : prev);
      flash('Issue published! 🎉');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  };

  // ─── Add page ───
  const handleAddPage = async (type: PageType) => {
    setShowAddPageModal(false);
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, title: `New ${PAGE_TYPE_LABELS[type]}` }),
      });
      if (!res.ok) throw new Error('Failed to add page');
      flash(`${PAGE_TYPE_LABELS[type]} page added!`);
      fetchIssue();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ─── Delete page ───
  const handleDeletePage = async (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this page?')) return;
    try {
      const res = await fetch(`/api/magazine-issues/${issueId}/pages/${pageId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete page');
      if (editingPage?.id === pageId) {
        setEditingPage(null);
        setPageForm({});
      }
      flash('Page deleted');
      fetchIssue();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ─── Move page ───
  const handleMovePage = async (page: MagazinePage, direction: 'up' | 'down') => {
    if (!issue) return;
    const pages = [...issue.pages].sort((a, b) => a.page_number - b.page_number);
    const idx = pages.findIndex((p) => p.id === page.id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= pages.length) return;

    const thisPage = pages[idx];
    const otherPage = pages[swapIdx];

    try {
      await Promise.all([
        fetch(`/api/magazine-issues/${issueId}/pages/${thisPage.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page_number: otherPage.page_number }),
        }),
        fetch(`/api/magazine-issues/${issueId}/pages/${otherPage.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page_number: thisPage.page_number }),
        }),
      ]);
      fetchIssue();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ─── Open page editor ───
  const openPageEditor = (page: MagazinePage) => {
    setEditingPage(page);
    const formData: Record<string, any> = {};
    const fields = PAGE_TYPE_FIELDS[page.type] || [];
    for (const field of fields) {
      if (field.type === 'tags') {
        formData[field.key] = Array.isArray((page as any)[field.key])
          ? (page as any)[field.key].join(', ')
          : (page as any)[field.key] || '';
      } else if (field.type === 'toc-entries') {
        formData[field.key] = (page as any)[field.key] || [];
      } else if (field.type === 'artist-links') {
        formData[field.key] = (page as any)[field.key] || {};
      } else if (field.type === 'gallery-editor') {
        formData[field.key] = Array.isArray((page as any)[field.key])
          ? (page as any)[field.key]
          : [];
      } else if (field.type === 'credits-editor') {
        formData[field.key] = Array.isArray((page as any)[field.key])
          ? (page as any)[field.key]
          : [];
      } else if (field.type === 'number') {
        formData[field.key] = (page as any)[field.key] ?? '';
      } else {
        formData[field.key] = (page as any)[field.key] || '';
      }
    }
    setPageForm(formData);
  };

  // ─── Save page ───
  const handleSavePage = async () => {
    if (!editingPage) return;
    setSavingPage(true);
    setError(null);
    try {
      const payload: Record<string, any> = { ...pageForm };
      const fields = PAGE_TYPE_FIELDS[editingPage.type] || [];
      for (const field of fields) {
        if (field.type === 'tags' && typeof payload[field.key] === 'string') {
          payload[field.key] = payload[field.key]
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean);
        }
        if (field.type === 'number' && payload[field.key] !== '' && payload[field.key] !== undefined) {
          payload[field.key] = parseFloat(payload[field.key]);
        }
      }

      const res = await fetch(`/api/magazine-issues/${issueId}/pages/${editingPage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save page');
      flash('Page saved!');
      setEditingPage(null);
      setPageForm({});
      fetchIssue();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingPage(false);
    }
  };

  // ─── Loading / Error states ───
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error && !issue) {
    return (
      <div className="glass-panel p-6 border border-red-500/20 bg-red-500/5 max-w-lg mx-auto mt-12">
        <p className="text-sm text-red-400 mb-3">{error}</p>
        <button onClick={() => router.push('/dashboard/magazine')} className="admin-btn-ghost text-sm">← Back to Issues</button>
      </div>
    );
  }

  if (!issue) return null;

  const sortedPages = [...issue.pages].sort((a, b) => a.page_number - b.page_number);
  const fieldGroups = editingPage ? groupFields(PAGE_TYPE_FIELDS[editingPage.type] || []) : [];

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard/magazine')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/15 rounded-lg transition-colors touch-manipulation"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Issue #{issue.issue_number}: {issue.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${STATUS_COLORS[issue.status]}`}>
                {issue.status}
              </span>
              <span className="text-xs text-gray-500">{issue.pages.length} pages</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/dashboard/magazine/${params.id}/preview`)}
            className="admin-btn-ghost flex items-center gap-2 touch-manipulation text-sm"
          >
            👁️ Preview
          </button>
          {issue.status !== 'published' && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="admin-btn-primary flex items-center gap-2 touch-manipulation disabled:opacity-50 text-sm"
            >
              {publishing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                '🚀'
              )}
              Publish
            </button>
          )}
        </div>
      </div>

      {/* Success / Error banners */}
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel p-3 border border-green-500/20 bg-green-500/5"
          >
            <p className="text-sm text-green-400">{successMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>
      {error && (
        <div className="glass-panel p-3 border border-red-500/20 bg-red-500/5">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* ═══ Issue Details Section ═══ */}
      <div className="glass-panel p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono text-[#C9A84C] uppercase tracking-wider">Issue Details</h2>
          <button
            onClick={handleSaveIssue}
            disabled={saving}
            className="admin-btn-primary text-sm flex items-center gap-2 touch-manipulation disabled:opacity-50"
          >
            {saving ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            Save Details
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
            <input
              type="text"
              value={issueForm.title}
              onChange={(e) => setIssueForm((f) => ({ ...f, title: e.target.value }))}
              className="admin-input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Subtitle</label>
            <input
              type="text"
              value={issueForm.subtitle}
              onChange={(e) => setIssueForm((f) => ({ ...f, subtitle: e.target.value }))}
              className="admin-input w-full text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
          <textarea
            value={issueForm.description}
            onChange={(e) => setIssueForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="admin-input w-full text-sm resize-y"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Season</label>
            <input
              type="text"
              value={issueForm.season}
              onChange={(e) => setIssueForm((f) => ({ ...f, season: e.target.value }))}
              placeholder="e.g. Spring 2025"
              className="admin-input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Featured Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={issueForm.featured_color}
                onChange={(e) => setIssueForm((f) => ({ ...f, featured_color: e.target.value }))}
                className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer flex-shrink-0"
              />
              <input
                type="text"
                value={issueForm.featured_color}
                onChange={(e) => setIssueForm((f) => ({ ...f, featured_color: e.target.value }))}
                className="admin-input w-full text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Cover Image URL</label>
            <input
              type="url"
              value={issueForm.cover_image}
              onChange={(e) => setIssueForm((f) => ({ ...f, cover_image: e.target.value }))}
              placeholder="https://..."
              className="admin-input w-full text-sm"
            />
          </div>
        </div>
      </div>

      {/* ═══ Pages Section ═══ */}
      <div className="glass-panel p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono text-[#C9A84C] uppercase tracking-wider">
            Pages ({sortedPages.length})
          </h2>
          <button
            onClick={() => setShowAddPageModal(true)}
            className="admin-btn-primary text-sm flex items-center gap-2 touch-manipulation"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Page
          </button>
        </div>

        {sortedPages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">📄</div>
            <p className="text-sm text-gray-500">No pages yet. Add your first page to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedPages.map((page, idx) => (
              <motion.div
                key={page.id}
                layout
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer touch-manipulation ${
                  editingPage?.id === page.id
                    ? 'border-[#C9A84C]/40 bg-[#C9A84C]/5'
                    : 'border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.02] active:bg-white/[0.04]'
                }`}
                onClick={() => openPageEditor(page)}
              >
                {/* Reorder buttons */}
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMovePage(page, 'up'); }}
                    disabled={idx === 0}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors touch-manipulation"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMovePage(page, 'down'); }}
                    disabled={idx === sortedPages.length - 1}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors touch-manipulation"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Page number */}
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-gray-400 flex-shrink-0">
                  {page.page_number}
                </div>

                {/* Type icon */}
                <span className="text-lg flex-shrink-0">{PAGE_TYPE_ICONS[page.type]}</span>

                {/* Thumbnail */}
                {page.image_url && (
                  <div className="w-10 h-10 rounded-lg bg-gray-800 overflow-hidden flex-shrink-0 hidden sm:block">
                    <img src={page.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {page.title || PAGE_TYPE_LABELS[page.type]}
                  </div>
                  <div className="text-xs text-gray-500">{PAGE_TYPE_LABELS[page.type]}</div>
                </div>

                {/* Delete */}
                <button
                  onClick={(e) => handleDeletePage(page.id, e)}
                  className="p-2 text-gray-600 hover:text-red-400 active:text-red-300 transition-colors flex-shrink-0 touch-manipulation"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ Page Edit Panel — Grouped Fields ═══ */}
      <AnimatePresence>
        {editingPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="glass-panel p-5 sm:p-6 space-y-5 border border-[#C9A84C]/20"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-mono text-[#C9A84C] uppercase tracking-wider flex items-center gap-2">
                {PAGE_TYPE_ICONS[editingPage.type]} Edit {PAGE_TYPE_LABELS[editingPage.type]} — Page {editingPage.page_number}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => { setEditingPage(null); setPageForm({}); }}
                  className="admin-btn-ghost text-sm touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePage}
                  disabled={savingPage}
                  className="admin-btn-primary text-sm flex items-center gap-2 touch-manipulation disabled:opacity-50"
                >
                  {savingPage ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  Save Page
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {fieldGroups.map((g, i) => (
                <FieldGroup
                  key={g.group}
                  group={g.group}
                  fields={g.fields}
                  pageForm={pageForm}
                  setPageForm={setPageForm}
                  defaultOpen={i < 2}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Add Page Modal ═══ */}
      <AnimatePresence>
        {showAddPageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowAddPageModal(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-2xl glass-panel rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto"
            >
              <h3 className="text-lg font-bold text-white mb-1">Add Page</h3>
              <p className="text-sm text-gray-500 mb-4">Choose a page type to add to this issue.</p>

              {/* Original types */}
              <p className="text-xs font-mono text-[#C9A84C] uppercase tracking-wider mb-2">Standard Pages</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                {(['cover', 'toc', 'article', 'spread', 'video', 'ad', 'artist', 'full-bleed', 'back-cover'] as PageType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddPage(type)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.06] hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 active:bg-[#C9A84C]/10 transition-all touch-manipulation min-h-[80px]"
                  >
                    <span className="text-2xl">{PAGE_TYPE_ICONS[type]}</span>
                    <span className="text-xs font-medium text-gray-300 text-center">{PAGE_TYPE_LABELS[type]}</span>
                  </button>
                ))}
              </div>

              {/* New rich types */}
              <p className="text-xs font-mono text-[#C9A84C] uppercase tracking-wider mb-2">Rich / Interactive Pages</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['gallery', 'video-ad', 'interactive', 'audio', 'quote', 'credits', 'letter'] as PageType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleAddPage(type)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[#C9A84C]/10 hover:border-[#C9A84C]/30 hover:bg-[#C9A84C]/5 active:bg-[#C9A84C]/10 transition-all touch-manipulation min-h-[80px] bg-[#C9A84C]/[0.02]"
                  >
                    <span className="text-2xl">{PAGE_TYPE_ICONS[type]}</span>
                    <span className="text-xs font-medium text-gray-300 text-center">{PAGE_TYPE_LABELS[type]}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddPageModal(false)}
                className="w-full mt-4 admin-btn-ghost text-sm touch-manipulation"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PAGE FIELD EDITOR COMPONENT
// ═══════════════════════════════════════════════════════════

function PageFieldEditor({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: any;
  onChange: (val: any) => void;
}) {
  // ─── Select dropdown ───
  if (field.type === 'select') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="admin-input w-full text-sm bg-transparent appearance-none cursor-pointer"
        >
          <option value="" className="bg-gray-900">— Select —</option>
          {(field.options || []).map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-gray-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // ─── Number input ───
  if (field.type === 'number') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            value={value || field.min || 0}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="flex-1 accent-[#C9A84C] h-2"
          />
          <input
            type="number"
            min={field.min}
            max={field.max}
            step={field.step}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="admin-input w-20 text-sm text-center"
          />
        </div>
      </div>
    );
  }

  // ─── Gallery Editor ───
  if (field.type === 'gallery-editor') {
    const images: GalleryImage[] = Array.isArray(value) ? value : [];

    const addImage = () => {
      onChange([...images, { image_url: '', caption: '', alt: '' }]);
    };

    const updateImage = (idx: number, key: string, val: string) => {
      const updated = images.map((img, i) => i === idx ? { ...img, [key]: val } : img);
      onChange(updated);
    };

    const removeImage = (idx: number) => {
      onChange(images.filter((_, i) => i !== idx));
    };

    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">{field.label}</label>
        <div className="space-y-3">
          {images.map((img, idx) => (
            <div key={idx} className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.01] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Image {idx + 1}</span>
                <button
                  onClick={() => removeImage(idx)}
                  className="p-1.5 text-gray-500 hover:text-red-400 transition-colors touch-manipulation"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="url"
                value={img.image_url || ''}
                onChange={(e) => updateImage(idx, 'image_url', e.target.value)}
                placeholder="Image URL"
                className="admin-input w-full text-sm"
              />
              {img.image_url && img.image_url.match(/\.(jpg|jpeg|png|gif|webp)/i) && (
                <div className="max-w-[80px] rounded overflow-hidden bg-gray-800">
                  <img src={img.image_url} alt="" className="w-full h-auto" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={img.caption || ''}
                  onChange={(e) => updateImage(idx, 'caption', e.target.value)}
                  placeholder="Caption"
                  className="admin-input text-sm"
                />
                <input
                  type="text"
                  value={img.alt || ''}
                  onChange={(e) => updateImage(idx, 'alt', e.target.value)}
                  placeholder="Alt text"
                  className="admin-input text-sm"
                />
              </div>
            </div>
          ))}
          <button
            onClick={addImage}
            className="text-xs text-[#C9A84C] hover:text-[#d4b35a] transition-colors touch-manipulation flex items-center gap-1 py-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add image
          </button>
        </div>
      </div>
    );
  }

  // ─── Credits Editor ───
  if (field.type === 'credits-editor') {
    const entries: CreditEntry[] = Array.isArray(value) ? value : [];

    const addEntry = () => {
      onChange([...entries, { role: '', name: '' }]);
    };

    const updateEntry = (idx: number, key: string, val: string) => {
      const updated = entries.map((e, i) => i === idx ? { ...e, [key]: val } : e);
      onChange(updated);
    };

    const removeEntry = (idx: number) => {
      onChange(entries.filter((_, i) => i !== idx));
    };

    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">{field.label}</label>
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <input
                type="text"
                value={entry.role || ''}
                onChange={(e) => updateEntry(idx, 'role', e.target.value)}
                placeholder="Role (e.g. Director)"
                className="admin-input flex-1 text-sm"
              />
              <input
                type="text"
                value={entry.name || ''}
                onChange={(e) => updateEntry(idx, 'name', e.target.value)}
                placeholder="Name"
                className="admin-input flex-1 text-sm"
              />
              <button
                onClick={() => removeEntry(idx)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors touch-manipulation flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addEntry}
            className="text-xs text-[#C9A84C] hover:text-[#d4b35a] transition-colors touch-manipulation flex items-center gap-1 py-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add credit
          </button>
        </div>
      </div>
    );
  }

  // ─── TOC Entries ───
  if (field.type === 'toc-entries') {
    const entries: { title: string; page: number; category: string }[] = Array.isArray(value) ? value : [];

    const addEntry = () => {
      onChange([...entries, { title: '', page: 1, category: '' }]);
    };

    const updateEntry = (idx: number, key: string, val: any) => {
      const updated = entries.map((e, i) => i === idx ? { ...e, [key]: val } : e);
      onChange(updated);
    };

    const removeEntry = (idx: number) => {
      onChange(entries.filter((_, i) => i !== idx));
    };

    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">{field.label}</label>
        <div className="space-y-2">
          {entries.map((entry, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <input
                type="text"
                value={entry.title}
                onChange={(e) => updateEntry(idx, 'title', e.target.value)}
                placeholder="Entry title"
                className="admin-input flex-1 text-sm"
              />
              <input
                type="number"
                value={entry.page}
                onChange={(e) => updateEntry(idx, 'page', parseInt(e.target.value) || 1)}
                placeholder="Pg"
                className="admin-input w-16 text-sm"
              />
              <input
                type="text"
                value={entry.category}
                onChange={(e) => updateEntry(idx, 'category', e.target.value)}
                placeholder="Category"
                className="admin-input w-28 text-sm"
              />
              <button
                onClick={() => removeEntry(idx)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors touch-manipulation flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addEntry}
            className="text-xs text-[#C9A84C] hover:text-[#d4b35a] transition-colors touch-manipulation flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add entry
          </button>
        </div>
      </div>
    );
  }

  // ─── Artist Links ───
  if (field.type === 'artist-links') {
    const links: Record<string, string> = typeof value === 'object' && value ? value : {};
    const platforms = ['spotify', 'instagram', 'twitter', 'youtube', 'soundcloud', 'tiktok'];

    const updateLink = (platform: string, url: string) => {
      const updated = { ...links, [platform]: url };
      if (!url) delete updated[platform];
      onChange(updated);
    };

    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-2">{field.label}</label>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <div key={platform} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-20 capitalize flex-shrink-0">{platform}</span>
              <input
                type="url"
                value={links[platform] || ''}
                onChange={(e) => updateLink(platform, e.target.value)}
                placeholder={`https://${platform}.com/...`}
                className="admin-input flex-1 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Tags ───
  if (field.type === 'tags') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="admin-input w-full text-sm"
        />
        <p className="text-xs text-gray-600 mt-1">Comma-separated</p>
      </div>
    );
  }

  // ─── Color picker ───
  if (field.type === 'color') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={value || '#000000'}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded border border-white/10 bg-transparent cursor-pointer flex-shrink-0"
          />
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className="admin-input flex-1 text-sm"
          />
        </div>
      </div>
    );
  }

  // ─── Textarea ───
  if (field.type === 'textarea') {
    return (
      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className="admin-input w-full text-sm resize-y"
        />
      </div>
    );
  }

  // ─── Default: text or url ───
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
      <input
        type={field.type === 'url' ? 'url' : 'text'}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className="admin-input w-full text-sm"
      />
      {field.type === 'url' && value && (value as string).match(/\.(jpg|jpeg|png|gif|webp)/i) && (
        <div className="mt-2 max-w-[120px] rounded-lg overflow-hidden bg-gray-800">
          <img src={value} alt="" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
}
