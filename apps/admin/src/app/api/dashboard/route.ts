import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand') || undefined;

    // Build queries with optional brand filter
    let publishedQuery = supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published');
    let pendingQuery = supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'pending_review');
    let submissionsQuery = supabase.from('submissions').select('id', { count: 'exact', head: true });
    let pendingSubsQuery = supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending');
    let writersQuery = supabase.from('users').select('id', { count: 'exact', head: true }).in('role', ['writer', 'editor']);
    let recentQuery = supabase.from('articles').select('id, title, brand, status, published_at, created_at').eq('status', 'published').order('published_at', { ascending: false }).limit(10);

    if (brand) {
      publishedQuery = publishedQuery.eq('brand', brand);
      pendingQuery = pendingQuery.eq('brand', brand);
      submissionsQuery = submissionsQuery.eq('brand', brand);
      pendingSubsQuery = pendingSubsQuery.eq('brand', brand);
      writersQuery = writersQuery.contains('brand_affiliations', [brand]);
      recentQuery = recentQuery.eq('brand', brand);
    }

    // Fetch all stats in parallel using service role (bypasses RLS)
    const [
      publishedRes,
      pendingRes,
      submissionsRes,
      pendingSubsRes,
      writersRes,
      // Per-brand counts (always fetch all brands)
      swRes, scRes, tgRes, tfRes,
      // Recent published articles
      recentRes,
    ] = await Promise.all([
      publishedQuery,
      pendingQuery,
      submissionsQuery,
      pendingSubsQuery,
      writersQuery,
      // Per brand
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('brand', 'saucewire').eq('status', 'published'),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('brand', 'saucecaviar').eq('status', 'published'),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('brand', 'trapglow').eq('status', 'published'),
      supabase.from('articles').select('id', { count: 'exact', head: true }).eq('brand', 'trapfrequency').eq('status', 'published'),
      recentQuery,
    ]);

    const stats = {
      totalArticles: publishedRes.count || 0,
      pendingReview: pendingRes.count || 0,
      totalSubmissions: submissionsRes.count || 0,
      pendingSubmissions: pendingSubsRes.count || 0,
      activeWriters: writersRes.count || 0,
      totalViews: 0,
    };

    const brands = {
      saucewire: { articles: swRes.count || 0, views: '0' },
      saucecaviar: { articles: scRes.count || 0, views: '0' },
      trapglow: { articles: tgRes.count || 0, views: '0' },
      trapfrequency: { articles: tfRes.count || 0, views: '0' },
    };

    const recentActivity = (recentRes.data || []).map((article: any) => ({
      action: 'Article published',
      detail: article.title,
      time: article.published_at || article.created_at,
      type: 'publish',
      brand: article.brand,
    }));

    return NextResponse.json({ stats, brands, recentActivity });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
