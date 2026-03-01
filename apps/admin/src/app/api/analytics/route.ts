import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function getDateFilter(range: string): string | null {
  const now = new Date();
  switch (range) {
    case '7d': return new Date(now.getTime() - 7 * 86400000).toISOString();
    case '30d': return new Date(now.getTime() - 30 * 86400000).toISOString();
    case '90d': return new Date(now.getTime() - 90 * 86400000).toISOString();
    default: return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseService();
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';
    const brand = searchParams.get('brand');
    const dateFrom = getDateFilter(range);

    // === Overview stats ===
    let articlesQuery = supabase.from('articles').select('id, status, view_count, reading_time_minutes, brand, category, title, published_at', { count: 'exact' });
    if (brand) articlesQuery = articlesQuery.eq('brand', brand);
    if (dateFrom) articlesQuery = articlesQuery.gte('created_at', dateFrom);
    const { data: articles, count: totalArticles } = await articlesQuery;

    const publishedArticles = articles?.filter((a: any) => a.status === 'published') || [];
    const totalViews = articles?.reduce((sum: number, a: any) => sum + (a.view_count || 0), 0) || 0;
    const avgReadingTime = articles?.length
      ? Math.round(articles.reduce((sum: number, a: any) => sum + (a.reading_time_minutes || 0), 0) / articles.length)
      : 0;

    // Total votes
    let votesQuery = supabase.from('magazine_tracks').select('total_votes, hot_percentage, title, artist_name');
    const { data: tracks } = await votesQuery;
    const totalVotes = tracks?.reduce((sum: number, t: any) => sum + (t.total_votes || 0), 0) || 0;

    // Subscribers count (if table exists)
    let totalSubscribers = 0;
    try {
      let subQuery = supabase.from('newsletter_subscribers').select('id', { count: 'exact' }).eq('is_active', true);
      if (brand) subQuery = subQuery.eq('brand', brand);
      const { count } = await subQuery;
      totalSubscribers = count || 0;
    } catch { /* table may not exist yet */ }

    // === Top articles by views ===
    let topQuery = supabase.from('articles').select('id, title, brand, view_count, category, published_at')
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(10);
    if (brand) topQuery = topQuery.eq('brand', brand);
    if (dateFrom) topQuery = topQuery.gte('published_at', dateFrom);
    const { data: topArticles } = await topQuery;

    // === Brand breakdown ===
    const brands = ['saucewire', 'saucecaviar', 'trapglow', 'trapfrequency'];
    const brandBreakdown = [];
    for (const b of brands) {
      if (brand && b !== brand) continue;
      const brandArticles = articles?.filter((a: any) => a.brand === b) || [];
      brandBreakdown.push({
        brand: b,
        articles: brandArticles.length,
        views: brandArticles.reduce((sum: number, a: any) => sum + (a.view_count || 0), 0),
        published: brandArticles.filter((a: any) => a.status === 'published').length,
      });
    }

    // === Vote trends ===
    const voteTrends = (tracks || [])
      .filter((t: any) => t.total_votes > 0)
      .sort((a: any, b: any) => b.total_votes - a.total_votes)
      .slice(0, 10)
      .map((t: any) => ({
        trackTitle: t.title,
        artist: t.artist_name,
        hotPct: t.hot_percentage || 0,
        totalVotes: t.total_votes || 0,
      }));

    // === Category breakdown ===
    const catMap = new Map<string, { count: number; brand: string }>();
    (articles || []).forEach((a: any) => {
      const key = `${a.category}|${a.brand}`;
      const existing = catMap.get(key);
      if (existing) {
        existing.count++;
      } else {
        catMap.set(key, { count: 1, brand: a.brand });
      }
    });
    const categoryBreakdown = Array.from(catMap.entries())
      .map(([key, val]) => ({ category: key.split('|')[0], ...val }))
      .sort((a, b) => b.count - a.count);

    // === Recent activity ===
    let activityQuery = supabase.from('articles').select('title, brand, status, updated_at')
      .order('updated_at', { ascending: false })
      .limit(20);
    if (brand) activityQuery = activityQuery.eq('brand', brand);
    const { data: recentArticles } = await activityQuery;

    const recentActivity = (recentArticles || []).map((a: any) => ({
      type: a.status === 'published' ? 'publish' : a.status,
      title: `${a.status === 'published' ? '🚀 Published' : a.status === 'draft' ? '📝 Drafted' : '📋 Updated'}: ${a.title}`,
      brand: a.brand,
      time: new Date(a.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    }));

    return NextResponse.json({
      overview: {
        totalArticles: totalArticles || 0,
        publishedArticles: publishedArticles.length,
        totalViews,
        avgReadingTime,
        totalVotes,
        totalSubscribers,
      },
      topArticles: topArticles || [],
      brandBreakdown,
      voteTrends,
      categoryBreakdown,
      recentActivity,
    });
  } catch (err: any) {
    console.error('Analytics error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
