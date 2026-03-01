import { NextRequest, NextResponse } from 'next/server';

// Manual trigger for AI pipeline — proxies to the cron endpoint
// Used by the admin dashboard "Generate Articles" button

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const brand = body.brand; // optional: run for specific brand only
    const engine = body.engine; // optional: 'openai' or 'gemini'
    const source = body.source; // optional: 'both' | 'rss' | 'brave'

    // Build query params
    const params = new URLSearchParams();
    if (engine) params.set('engine', engine);
    if (source) params.set('source', source);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    // Call the cron endpoint internally with params
    const baseUrl = request.nextUrl.origin;
    const res = await fetch(`${baseUrl}/api/cron/ai-pipeline${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    // Filter to specific brand if requested
    if (brand && data.results) {
      data.results = data.results.filter((r: any) => r.brand === brand);
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Get pipeline status / last runs
export async function GET() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Get latest AI-generated articles per brand
    const brands = ['saucewire', 'trapglow', 'trapfrequency'];
    const stats: Record<string, any> = {};

    for (const brand of brands) {
      const { data, count } = await supabase
        .from('articles')
        .select('id, title, status, created_at, metadata', { count: 'exact' })
        .eq('brand', brand)
        .eq('is_ai_generated', true)
        .order('created_at', { ascending: false })
        .limit(5);

      stats[brand] = {
        totalGenerated: count || 0,
        recent: data || [],
      };
    }

    // Check Supabase for dashboard-managed keys
    let dbKeys: Record<string, boolean> = {};
    try {
      const { data: apiKeysData } = await supabase.from('api_keys').select('key_name');
      (apiKeysData || []).forEach((k: any) => { dbKeys[k.key_name] = true; });
    } catch {}

    // Determine active engine (dashboard keys override env vars)
    const preferred = (process.env.AI_ENGINE || '').toLowerCase();
    const hasGemini = !!(dbKeys['GEMINI_API_KEY'] || process.env.GEMINI_API_KEY);
    const hasOpenAI = !!(dbKeys['OPENAI_API_KEY'] || process.env.OPENAI_API_KEY);
    let activeEngine = 'none';
    if (preferred === 'gemini' && hasGemini) activeEngine = 'gemini';
    else if (preferred === 'openai' && hasOpenAI) activeEngine = 'openai';
    else if (hasGemini) activeEngine = 'gemini';
    else if (hasOpenAI) activeEngine = 'openai';

    // Count RSS feeds
    let rssFeedCount = 0;
    try {
      const { count } = await supabase
        .from('rss_feeds')
        .select('id', { count: 'exact', head: true })
        .eq('enabled', true);
      rssFeedCount = count || 0;
    } catch {}

    return NextResponse.json({
      enabled: (hasOpenAI || hasGemini) && !!(process.env.BRAVE_SEARCH_API_KEY || rssFeedCount > 0),
      hasOpenAI,
      hasGemini,
      hasBraveSearch: !!process.env.BRAVE_SEARCH_API_KEY,
      hasRssFeeds: rssFeedCount > 0,
      rssFeedCount,
      activeEngine,
      brands: stats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
