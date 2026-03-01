// ============================================================
// MEDIA NETWORK — Shared Types
// ============================================================

// ======================== ENUMS ========================

export type Brand = 'saucecaviar' | 'trapglow' | 'saucewire' | 'trapfrequency';

export type UserRole = 'admin' | 'editor' | 'writer' | 'artist' | 'producer' | 'reader';

export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'archived';

export type SubmissionStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'published';

export type SubmissionType = 'article_pitch' | 'artist_feature' | 'beat_submission' | 'news_tip';

export type IssueStatus = 'draft' | 'published' | 'archived';

export type MediaType = 'image' | 'video' | 'audio' | 'document';

export type LayoutType = 'full_image' | 'text_left' | 'text_right' | 'text_only' | 'split' | 'hero' | 'gallery';

// ======================== MODELS ========================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  links: Record<string, string>;
  brand_affiliations: Brand[];
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  cover_image: string | null;
  brand: Brand;
  category: string;
  tags: string[];
  author_id: string | null;
  author?: User;
  status: ArticleStatus;
  is_breaking: boolean;
  is_ai_generated: boolean;
  source_url: string | null;
  reading_time_minutes: number;
  view_count: number;
  metadata?: Record<string, any>;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Issue {
  id: string;
  title: string;
  issue_number: number;
  cover_image: string | null;
  description: string | null;
  status: IssueStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  pages?: IssuePage[];
}

export interface IssuePage {
  id: string;
  issue_id: string;
  page_number: number;
  content: string | null;
  media_url: string | null;
  layout: LayoutType;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  user_id: string | null;
  user?: User;
  brand: Brand;
  type: SubmissionType;
  title: string;
  content: string;
  media_urls: string[];
  contact_email: string | null;
  contact_name: string | null;
  status: SubmissionStatus;
  reviewer_id: string | null;
  reviewer?: User;
  reviewer_notes: string | null;
  is_anonymous: boolean;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface Media {
  id: string;
  url: string;
  filename: string;
  type: MediaType;
  brand: Brand | null;
  uploaded_by: string | null;
  alt_text: string | null;
  size_bytes: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  headline: string | null;
  location: string | null;
  website: string | null;
  twitter_handle: string | null;
  instagram_handle: string | null;
  youtube_url: string | null;
  soundcloud_url: string | null;
  spotify_url: string | null;
  cover_image: string | null;
  featured_work: unknown[];
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface AdPlacement {
  id: string;
  brand: Brand;
  name: string;
  slot: string;
  advertiser_name: string;
  advertiser_email: string | null;
  creative_url: string;
  click_url: string | null;
  issue_id: string | null;
  start_date: string | null;
  end_date: string | null;
  impressions: number;
  clicks: number;
  is_active: boolean;
  price_cents: number;
  payment_status: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface AudioVersion {
  id: string;
  article_id: string;
  url: string;
  duration_seconds: number | null;
  file_size_bytes: number | null;
  voice_id: string | null;
  voice_name: string | null;
  provider: string;
  status: 'processing' | 'ready' | 'error';
  error_message: string | null;
  play_count: number;
  created_at: string;
  updated_at: string;
}

export interface PageView {
  id: string;
  article_id: string | null;
  brand: Brand;
  path: string | null;
  referrer: string | null;
  user_agent: string | null;
  country: string | null;
  city: string | null;
  session_id: string | null;
  viewed_at: string;
}

// ======================== API TYPES ========================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ArticleFilters {
  brand?: Brand;
  category?: string;
  status?: ArticleStatus;
  author_id?: string;
  is_breaking?: boolean;
  is_ai_generated?: boolean;
  tags?: string[];
  search?: string;
  page?: number;
  per_page?: number;
}

export interface SubmissionFilters {
  brand?: Brand;
  type?: SubmissionType;
  status?: SubmissionStatus;
  user_id?: string;
  page?: number;
  per_page?: number;
}

export interface AnalyticsSummary {
  total_views: number;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
  top_articles: Array<{
    article_id: string;
    title: string;
    views: number;
  }>;
  views_by_country: Array<{
    country: string;
    views: number;
  }>;
}

// ======================== BRAND CONFIG ========================

export interface BrandConfig {
  id: Brand;
  name: string;
  tagline: string;
  domain: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    text: string;
    surface: string;
  };
  categories: string[];
}

export const BRAND_CONFIGS: Record<Brand, BrandConfig> = {
  saucecaviar: {
    id: 'saucecaviar',
    name: 'SauceCaviar',
    tagline: 'Culture Served Premium',
    domain: 'saucecaviar.com',
    colors: {
      primary: '#C9A84C',
      secondary: '#0A0A0A',
      accent: '#F5F0E8',
      neutral: '#722F37',
      text: '#FAFAF7',
      surface: '#2D2D2D',
    },
    categories: ['Fashion', 'Music', 'Art', 'Culture', 'Lifestyle'],
  },
  trapglow: {
    id: 'trapglow',
    name: 'TrapGlow',
    tagline: 'Shining Light on What\'s Next',
    domain: 'trapglow.com',
    colors: {
      primary: '#8B5CF6',
      secondary: '#0F0B2E',
      accent: '#06F5D6',
      neutral: '#FF6B35',
      text: '#F8F8FF',
      surface: '#1A1035',
    },
    categories: ['Hip-Hop', 'R&B', 'Pop', 'Electronic', 'Alternative', 'Latin'],
  },
  saucewire: {
    id: 'saucewire',
    name: 'SauceWire',
    tagline: 'Culture. Connected. Now.',
    domain: 'saucewire.com',
    colors: {
      primary: '#E63946',
      secondary: '#111111',
      accent: '#1DA1F2',
      neutral: '#8D99AE',
      text: '#FFFFFF',
      surface: '#1B1B2F',
    },
    categories: ['Music', 'Fashion', 'Entertainment', 'Sports', 'Tech'],
  },
  trapfrequency: {
    id: 'trapfrequency',
    name: 'TrapFrequency',
    tagline: 'Tune Into The Craft',
    domain: 'trapfrequency.com',
    colors: {
      primary: '#39FF14',
      secondary: '#0D0D0D',
      accent: '#FFB800',
      neutral: '#4361EE',
      text: '#E0E0E0',
      surface: '#1A1A2E',
    },
    categories: ['Tutorials', 'Beats', 'Gear', 'DAW Tips', 'Samples', 'Interviews'],
  },
};

// ======================== HELPERS ========================

export const SAUCEWIRE_CATEGORIES = ['Music', 'Fashion', 'Entertainment', 'Sports', 'Tech'] as const;
export type SauceWireCategory = typeof SAUCEWIRE_CATEGORIES[number];

export function getBrandConfig(brand: Brand): BrandConfig {
  return BRAND_CONFIGS[brand];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 128);
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}
