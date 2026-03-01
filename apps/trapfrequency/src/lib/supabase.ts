import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  getArticles,
  getArticleBySlug,
  getTrendingArticles,
} from '@media-network/shared';
import type { Article, Brand } from '@media-network/shared';
import type { Producer, Tutorial, Beat, GearReview, SamplePack } from './mock-data';

const BRAND: Brand = 'trapfrequency';

function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('Supabase env vars missing — returning null client');
    return null;
  }
  return createClient(url, key);
}

// ======================== DATA MAPPERS (snake_case DB → camelCase UI) ========================

function mapProducer(row: any): Producer {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    avatar: row.avatar,
    coverImage: row.cover_image,
    bio: row.bio,
    location: row.location,
    daws: row.daws || [],
    genres: row.genres || [],
    credits: row.credits || [],
    beatCount: row.beat_count || 0,
    followerCount: row.follower_count || 0,
    links: row.links || {},
    featured: row.featured || false,
    joinedAt: row.joined_at || row.created_at || '',
  };
}

function mapTutorial(row: any): Tutorial {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    body: row.body || '',
    coverImage: row.cover_image,
    daw: row.daw,
    skillLevel: row.skill_level,
    category: row.category,
    duration: row.duration || '',
    author: row.producer ? mapProducer(row.producer) : row.author ? mapProducer(row.author) : {
      id: '', name: 'Unknown', slug: '', avatar: null, coverImage: null, bio: '',
      location: '', daws: [], genres: [], credits: [], beatCount: 0, followerCount: 0,
      links: {}, featured: false, joinedAt: '',
    },
    tags: row.tags || [],
    viewCount: row.view_count || 0,
    likeCount: row.like_count || 0,
    publishedAt: row.published_at || '',
  };
}

function mapBeat(row: any): Beat {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    producer: row.producer ? mapProducer(row.producer) : {
      id: '', name: 'Unknown', slug: '', avatar: null, coverImage: null, bio: '',
      location: '', daws: [], genres: [], credits: [], beatCount: 0, followerCount: 0,
      links: {}, featured: false, joinedAt: '',
    },
    bpm: row.bpm || 0,
    key: row.key || '',
    genre: row.genre || '',
    tags: row.tags || [],
    duration: row.duration || '',
    waveformData: row.waveform_data || [],
    plays: row.plays || 0,
    likes: row.likes || 0,
    coverImage: row.cover_image,
    audioUrl: row.audio_url,
    isFeatured: row.is_featured || false,
    publishedAt: row.published_at || '',
  };
}

function mapGearReview(row: any): GearReview {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    product: row.product || '',
    brand: row.brand || '',
    category: row.category,
    price: row.price || '',
    rating: row.rating || 0,
    excerpt: row.excerpt || '',
    body: row.body || '',
    coverImage: row.cover_image,
    pros: row.pros || [],
    cons: row.cons || [],
    verdict: row.verdict || '',
    affiliateUrl: row.affiliate_url,
    author: row.producer ? mapProducer(row.producer) : row.author ? mapProducer(row.author) : {
      id: '', name: 'Unknown', slug: '', avatar: null, coverImage: null, bio: '',
      location: '', daws: [], genres: [], credits: [], beatCount: 0, followerCount: 0,
      links: {}, featured: false, joinedAt: '',
    },
    publishedAt: row.published_at || '',
  };
}

function mapSamplePack(row: any): SamplePack {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    creator: row.creator || '',
    price: row.price || '',
    isFree: row.is_free || false,
    sampleCount: row.sample_count || 0,
    genres: row.genres || [],
    description: row.description || '',
    coverImage: row.cover_image,
    previewSounds: row.preview_sounds || [],
    rating: row.rating || 0,
    downloadCount: row.download_count || 0,
    publishedAt: row.published_at || '',
  };
}

// ======================== ARTICLES (existing) ========================

export async function fetchArticles(options: {
  category?: string;
  page?: number;
  per_page?: number;
  search?: string;
} = {}): Promise<{ articles: Article[]; count: number; totalPages: number }> {
  const supabase = getSupabase();
  if (!supabase) return { articles: [], count: 0, totalPages: 0 };
  const res = await getArticles(supabase, {
    brand: BRAND,
    status: 'published',
    category: options.category,
    page: options.page,
    per_page: options.per_page || 20,
    search: options.search,
  });
  return { articles: res.data, count: res.count, totalPages: res.total_pages };
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  return getArticleBySlug(supabase, BRAND, slug);
}

export async function fetchTrendingArticles(limit = 8): Promise<Article[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  return getTrendingArticles(supabase, BRAND, limit);
}

// ======================== PRODUCERS ========================

export async function getProducers(): Promise<Producer[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('producers')
    .select('*')
    .eq('status', 'published')
    .order('follower_count', { ascending: false });
  if (error) { console.error('getProducers error:', error); return []; }
  return (data || []).map(mapProducer);
}

export async function getProducerBySlug(slug: string): Promise<Producer | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('producers')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) { console.error('getProducerBySlug error:', error); return null; }
  return data ? mapProducer(data) : null;
}

export async function getFeaturedProducers(): Promise<Producer[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('producers')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('follower_count', { ascending: false });
  if (error) { console.error('getFeaturedProducers error:', error); return []; }
  return (data || []).map(mapProducer);
}

// ======================== TUTORIALS ========================

export async function getTutorials(filters?: {
  daw?: string;
  skill_level?: string;
  category?: string;
}): Promise<Tutorial[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  let query = supabase
    .from('tutorials')
    .select('*, producer:producers(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (filters?.daw) query = query.eq('daw', filters.daw);
  if (filters?.skill_level) query = query.eq('skill_level', filters.skill_level);
  if (filters?.category) query = query.eq('category', filters.category);
  const { data, error } = await query;
  if (error) { console.error('getTutorials error:', error); return []; }
  return (data || []).map(mapTutorial);
}

export async function getTutorialBySlug(slug: string): Promise<Tutorial | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('tutorials')
    .select('*, producer:producers(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) { console.error('getTutorialBySlug error:', error); return null; }
  return data ? mapTutorial(data) : null;
}

export async function getLatestTutorials(count: number = 6): Promise<Tutorial[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('tutorials')
    .select('*, producer:producers(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(count);
  if (error) { console.error('getLatestTutorials error:', error); return []; }
  return (data || []).map(mapTutorial);
}

// ======================== BEATS ========================

export async function getBeats(filters?: {
  genre?: string;
}): Promise<Beat[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  let query = supabase
    .from('beats')
    .select('*, producer:producers(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (filters?.genre) query = query.eq('genre', filters.genre);
  const { data, error } = await query;
  if (error) { console.error('getBeats error:', error); return []; }
  return (data || []).map(mapBeat);
}

export async function getBeatBySlug(slug: string): Promise<Beat | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('beats')
    .select('*, producer:producers(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) { console.error('getBeatBySlug error:', error); return null; }
  return data ? mapBeat(data) : null;
}

export async function getFeaturedBeats(): Promise<Beat[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('beats')
    .select('*, producer:producers(*)')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('plays', { ascending: false });
  if (error) { console.error('getFeaturedBeats error:', error); return []; }
  return (data || []).map(mapBeat);
}

export async function getBeatsByProducer(producerId: string): Promise<Beat[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('beats')
    .select('*, producer:producers(*)')
    .eq('producer_id', producerId)
    .eq('status', 'published')
    .order('plays', { ascending: false });
  if (error) { console.error('getBeatsByProducer error:', error); return []; }
  return (data || []).map(mapBeat);
}

// ======================== GEAR REVIEWS ========================

export async function getGearReviews(filters?: {
  category?: string;
}): Promise<GearReview[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  let query = supabase
    .from('gear_reviews')
    .select('*, producer:producers(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (filters?.category) query = query.eq('category', filters.category);
  const { data, error } = await query;
  if (error) { console.error('getGearReviews error:', error); return []; }
  return (data || []).map(mapGearReview);
}

export async function getGearReviewBySlug(slug: string): Promise<GearReview | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('gear_reviews')
    .select('*, producer:producers(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) { console.error('getGearReviewBySlug error:', error); return null; }
  return data ? mapGearReview(data) : null;
}

export async function getTopGearReviews(count: number = 4): Promise<GearReview[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('gear_reviews')
    .select('*, producer:producers(*)')
    .eq('status', 'published')
    .order('rating', { ascending: false })
    .limit(count);
  if (error) { console.error('getTopGearReviews error:', error); return []; }
  return (data || []).map(mapGearReview);
}

// ======================== SAMPLE PACKS ========================

export async function getSamplePacks(): Promise<SamplePack[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('sample_packs')
    .select('*')
    .eq('status', 'published')
    .order('download_count', { ascending: false });
  if (error) { console.error('getSamplePacks error:', error); return []; }
  return (data || []).map(mapSamplePack);
}
