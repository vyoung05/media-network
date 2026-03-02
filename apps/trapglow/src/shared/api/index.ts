import type { SupabaseClient } from '@supabase/supabase-js';
import type {
  Article,
  ArticleFilters,
  Submission,
  SubmissionFilters,
  PaginatedResponse,
  Brand,
  ArticleStatus,
  SubmissionStatus,
  User,
} from '../types';

// ======================== ARTICLES ========================

export async function getArticles(
  supabase: SupabaseClient,
  filters: ArticleFilters = {}
): Promise<PaginatedResponse<Article>> {
  const {
    brand,
    category,
    status = 'published',
    author_id,
    is_breaking,
    tags,
    search,
    page = 1,
    per_page = 20,
  } = filters;

  let query = supabase
    .from('articles')
    .select('*, author:users!author_id(*)', { count: 'exact' })
    .eq('status', status)
    .order('published_at', { ascending: false });

  if (brand) query = query.eq('brand', brand);
  if (category) query = query.eq('category', category);
  if (author_id) query = query.eq('author_id', author_id);
  if (is_breaking !== undefined) query = query.eq('is_breaking', is_breaking);
  if (tags && tags.length > 0) query = query.overlaps('tags', tags);
  if (search) query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`);

  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Article[],
    count: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page),
  };
}

export async function getArticleBySlug(
  supabase: SupabaseClient,
  brand: Brand,
  slug: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:users!author_id(*)')
    .eq('brand', brand)
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Article;
}

export async function getArticleById(
  supabase: SupabaseClient,
  id: string
): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:users!author_id(*)')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Article;
}

export async function getBreakingNews(
  supabase: SupabaseClient,
  brand: Brand
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:users!author_id(*)')
    .eq('brand', brand)
    .eq('status', 'published')
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(5);

  if (error) throw error;
  return (data || []) as Article[];
}

export async function getTrendingArticles(
  supabase: SupabaseClient,
  brand: Brand,
  limit: number = 10
): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*, author:users!author_id(*)')
    .eq('brand', brand)
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as Article[];
}

export async function createArticle(
  supabase: SupabaseClient,
  article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'view_count' | 'author'>
): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select('*, author:users!author_id(*)')
    .single();

  if (error) throw error;
  return data as Article;
}

export async function updateArticle(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<Article>
): Promise<Article> {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select('*, author:users!author_id(*)')
    .single();

  if (error) throw error;
  return data as Article;
}

export async function updateArticleStatus(
  supabase: SupabaseClient,
  id: string,
  status: ArticleStatus
): Promise<Article> {
  const updates: Partial<Article> = { status };
  if (status === 'published') {
    updates.published_at = new Date().toISOString();
  }
  return updateArticle(supabase, id, updates);
}

export async function deleteArticle(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase.from('articles').delete().eq('id', id);
  if (error) throw error;
}

// ======================== SUBMISSIONS ========================

export async function getSubmissions(
  supabase: SupabaseClient,
  filters: SubmissionFilters = {}
): Promise<PaginatedResponse<Submission>> {
  const {
    brand,
    type,
    status,
    user_id,
    page = 1,
    per_page = 20,
  } = filters;

  let query = supabase
    .from('submissions')
    .select('*, user:users!user_id(*), reviewer:users!reviewer_id(*)', { count: 'exact' })
    .order('submitted_at', { ascending: false });

  if (brand) query = query.eq('brand', brand);
  if (type) query = query.eq('type', type);
  if (status) query = query.eq('status', status);
  if (user_id) query = query.eq('user_id', user_id);

  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as Submission[],
    count: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page),
  };
}

export async function createSubmission(
  supabase: SupabaseClient,
  submission: Omit<Submission, 'id' | 'submitted_at' | 'reviewed_at' | 'reviewer' | 'user'>
): Promise<Submission> {
  const { data, error } = await supabase
    .from('submissions')
    .insert(submission)
    .select()
    .single();

  if (error) throw error;
  return data as Submission;
}

export async function reviewSubmission(
  supabase: SupabaseClient,
  id: string,
  status: SubmissionStatus,
  reviewer_id: string,
  reviewer_notes?: string
): Promise<Submission> {
  const { data, error } = await supabase
    .from('submissions')
    .update({
      status,
      reviewer_id,
      reviewer_notes: reviewer_notes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Submission;
}

// ======================== USERS ========================

export async function getUsers(
  supabase: SupabaseClient,
  filters: { role?: string; brand?: Brand; page?: number; per_page?: number } = {}
): Promise<PaginatedResponse<User>> {
  const { role, brand, page = 1, per_page = 20 } = filters;

  let query = supabase
    .from('users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (role) query = query.eq('role', role);
  if (brand) query = query.contains('brand_affiliations', [brand]);

  const from = (page - 1) * per_page;
  const to = from + per_page - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: (data || []) as User[],
    count: count || 0,
    page,
    per_page,
    total_pages: Math.ceil((count || 0) / per_page),
  };
}

// ======================== ANALYTICS ========================

export async function recordPageView(
  supabase: SupabaseClient,
  view: {
    article_id?: string;
    brand: Brand;
    path?: string;
    referrer?: string;
  }
): Promise<void> {
  const { error } = await supabase.from('page_views').insert({
    article_id: view.article_id || null,
    brand: view.brand,
    path: view.path || null,
    referrer: view.referrer || null,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  });

  if (error) console.error('Failed to record page view:', error);
}

export async function getAnalyticsSummary(
  supabase: SupabaseClient,
  brand?: Brand
) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

  let baseQuery = supabase.from('page_views').select('*', { count: 'exact' });
  if (brand) baseQuery = baseQuery.eq('brand', brand);

  const [totalRes, todayRes, weekRes, monthRes] = await Promise.all([
    baseQuery,
    supabase
      .from('page_views')
      .select('*', { count: 'exact' })
      .gte('viewed_at', todayStart)
      .then(r => r),
    supabase
      .from('page_views')
      .select('*', { count: 'exact' })
      .gte('viewed_at', weekStart)
      .then(r => r),
    supabase
      .from('page_views')
      .select('*', { count: 'exact' })
      .gte('viewed_at', monthStart)
      .then(r => r),
  ]);

  return {
    total_views: totalRes.count || 0,
    views_today: todayRes.count || 0,
    views_this_week: weekRes.count || 0,
    views_this_month: monthRes.count || 0,
    top_articles: [],
    views_by_country: [],
  };
}
