import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  getArticles,
  getArticleBySlug,
  getBreakingNews,
  getTrendingArticles,
} from '@media-network/shared';
import type { Article, Brand } from '@media-network/shared';
import type { Artist } from './mock-data';

const BRAND: Brand = 'trapglow';

function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('Supabase env vars missing — returning null client');
    return null;
  }
  return createClient(url, key);
}

// ======================== DATA MAPPER ========================

function mapArtist(row: any): Artist {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    real_name: row.real_name,
    avatar: row.avatar,
    cover_image: row.cover_image,
    bio: row.bio,
    genre: row.genre || [],
    mood: row.mood || [],
    region: row.region || '',
    city: row.city || '',
    social: row.social || {},
    spotify_embed: row.spotify_embed,
    soundcloud_embed: row.soundcloud_embed,
    apple_music_embed: row.apple_music_embed,
    monthly_listeners: row.monthly_listeners || 0,
    followers: row.followers || 0,
    glow_score: row.glow_score || 0,
    glow_trend: row.glow_trend || 'new',
    is_featured: row.is_featured || false,
    is_daily_pick: row.is_daily_pick || false,
    featured_track: row.featured_track || '',
    featured_track_url: row.featured_track_url,
    tags: row.tags || [],
    gallery: row.gallery || [],
    created_at: row.created_at || '',
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

export async function fetchArticlesByCategory(category: string): Promise<Article[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const res = await getArticles(supabase, {
    brand: BRAND,
    status: 'published',
    category,
    per_page: 50,
  });
  return res.data;
}

// ======================== ARTISTS ========================

export async function getArtists(filters?: {
  genre?: string;
  mood?: string;
  region?: string;
}): Promise<Artist[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  let query = supabase
    .from('artists')
    .select('*')
    .eq('status', 'published')
    .order('glow_score', { ascending: false });
  if (filters?.genre) query = query.contains('genre', [filters.genre]);
  if (filters?.mood) query = query.contains('mood', [filters.mood]);
  if (filters?.region) query = query.eq('region', filters.region);
  const { data, error } = await query;
  if (error) { console.error('getArtists error:', error); return []; }
  return (data || []).map(mapArtist);
}

export async function getArtistBySlug(slug: string): Promise<Artist | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  if (error) { console.error('getArtistBySlug error:', error); return null; }
  return data ? mapArtist(data) : null;
}

export async function getFeaturedArtists(): Promise<Artist[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('glow_score', { ascending: false });
  if (error) { console.error('getFeaturedArtists error:', error); return []; }
  return (data || []).map(mapArtist);
}

export async function getDailyPick(): Promise<Artist | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('status', 'published')
    .eq('is_daily_pick', true)
    .order('glow_score', { ascending: false })
    .limit(1);
  if (error) { console.error('getDailyPick error:', error); return null; }
  return data && data.length > 0 ? mapArtist(data[0]) : null;
}

export async function getDailyPicks(): Promise<Artist[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('status', 'published')
    .eq('is_daily_pick', true)
    .order('glow_score', { ascending: false });
  if (error) { console.error('getDailyPicks error:', error); return []; }
  return (data || []).map(mapArtist);
}

export async function getGlowUpLeaderboard(limit: number = 10): Promise<Artist[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('status', 'published')
    .order('glow_score', { ascending: false })
    .limit(limit);
  if (error) { console.error('getGlowUpLeaderboard error:', error); return []; }
  return (data || []).map(mapArtist);
}
