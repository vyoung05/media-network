import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  getArticles,
  getArticleBySlug,
  getBreakingNews,
  getTrendingArticles,
  getArticleAudioUrl,
} from '@media-network/shared';
import type { Article, Brand } from '@media-network/shared';

const BRAND: Brand = 'saucewire';

// Create a simple Supabase client for server-side use (no cookies needed for public reads)
function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('Supabase env vars missing — returning null client');
    return null;
  }
  return createClient(url, key);
}

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

export async function fetchBreakingArticles(): Promise<Article[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  return getBreakingNews(supabase, BRAND);
}

export async function fetchTrendingArticles(limit = 8): Promise<Article[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  return getTrendingArticles(supabase, BRAND, limit);
}

export async function fetchAudioUrl(articleId: string): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  return getArticleAudioUrl(supabase, articleId);
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
