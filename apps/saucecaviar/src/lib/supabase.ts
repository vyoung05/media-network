import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  getArticles,
  getArticleBySlug,
  getTrendingArticles,
  getArticleAudioUrl,
} from '@media-network/shared';
import type { Article, Brand } from '@media-network/shared';
import type { MagazineIssue, MagazinePage } from './mock-data';

const BRAND: Brand = 'saucecaviar';

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

// ======================== MAGAZINE ISSUES ========================

// Map DB snake_case rows to the MagazineIssue/MagazinePage types the components expect
function mapPage(row: any): MagazinePage {
  return {
    id: row.id,
    pageNumber: row.page_number,
    type: row.type,
    title: row.title || undefined,
    subtitle: row.subtitle || undefined,
    content: row.content || undefined,
    pullQuote: row.pull_quote || undefined,
    author: row.author || undefined,
    authorTitle: row.author_title || undefined,
    imageUrl: row.image_url || '',
    imageAlt: row.image_alt || undefined,
    secondaryImageUrl: row.secondary_image_url || undefined,
    backgroundColor: row.background_color || undefined,
    textColor: row.text_color || undefined,
    category: row.category || undefined,
    tags: row.tags || [],
    videoUrl: row.video_url || undefined,
    musicEmbed: row.music_embed || undefined,
    artistName: row.artist_name || undefined,
    artistBio: row.artist_bio || undefined,
    artistLinks: row.artist_links || undefined,
    advertiserName: row.advertiser_name || undefined,
    advertiserTagline: row.advertiser_tagline || undefined,
    advertiserCta: row.advertiser_cta || undefined,
    advertiserUrl: row.advertiser_url || undefined,
    tocEntries: row.toc_entries || undefined,
    // Enhanced fields (from rich magazine editor)
    spotify_embed: row.spotify_embed || undefined,
    audio_embed_url: row.audio_embed_url || undefined,
    youtube_url: row.youtube_url || undefined,
    video_embed_url: row.video_embed_url || undefined,
    gallery_images: row.gallery_images || undefined,
    interactive_embed_url: row.interactive_embed_url || undefined,
    iframe_url: row.iframe_url || undefined,
    lower_third_text: row.lower_third_text || undefined,
    lower_third_subtitle: row.lower_third_subtitle || undefined,
    caption: row.caption || undefined,
    credits: row.credits || undefined,
    cta_text: row.cta_text || undefined,
    cta_url: row.cta_url || undefined,
    layout_style: row.layout_style || undefined,
    animation: row.animation || undefined,
    transition_effect: row.transition_effect || undefined,
  };
}

function mapIssue(row: any, pages: any[] = []): MagazineIssue {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    issueNumber: row.issue_number,
    subtitle: row.subtitle || '',
    description: row.description || '',
    coverImage: row.cover_image || '',
    publishedAt: row.published_at || '',
    status: row.status,
    pageCount: row.page_count || pages.length,
    pages: pages.map(mapPage),
    featuredColor: row.featured_color || '#C9A84C',
    season: row.season || '',
  };
}

export async function fetchAllIssues(): Promise<MagazineIssue[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('magazine_issues')
    .select('*')
    .eq('status', 'published')
    .order('issue_number', { ascending: false });

  if (error || !data) return [];
  return data.map((row: any) => mapIssue(row));
}

export async function fetchLatestIssue(): Promise<MagazineIssue | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('magazine_issues')
    .select('*')
    .eq('status', 'published')
    .order('issue_number', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return mapIssue(data);
}

export async function fetchIssueBySlug(slug: string): Promise<MagazineIssue | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  // Fetch issue
  const { data: issue, error: issueError } = await supabase
    .from('magazine_issues')
    .select('*')
    .eq('slug', slug)
    .single();

  if (issueError || !issue) return null;

  // Fetch pages
  const { data: pages, error: pagesError } = await supabase
    .from('magazine_pages')
    .select('*')
    .eq('issue_id', issue.id)
    .order('page_number', { ascending: true });

  if (pagesError) return mapIssue(issue);
  return mapIssue(issue, pages || []);
}

export async function fetchIssuesSlugs(): Promise<string[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('magazine_issues')
    .select('slug')
    .eq('status', 'published');

  if (error || !data) return [];
  return data.map((row: any) => row.slug);
}
