import { NextRequest, NextResponse } from 'next/server';

// Manual trigger for AI pipeline — proxies to the cron endpoint
// Used by the admin dashboard "Generate Articles" button

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const brand = body.brand; // optional: run for specific brand only
    const engine = body.engine; // optional: 'openai' or 'gemini'

    // Call the cron endpoint internally with engine param
    const baseUrl = request.nextUrl.origin;
    const engineParam = engine ? `?engine=${engine}` : '';
    const res = await fetch(`${baseUrl}/api/cron/ai-pipeline${engineParam}`, {
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
        .select('id, title, status, created_at', { count: 'exact' })
        .eq('brand', brand)
        .eq('is_ai_generated', true)
        .order('created_at', { ascending: false })
        .limit(5);

      stats[brand] = {
        totalGenerated: count || 0,
        recent: data || [],
      };
    }

    // Determine active engine
    const preferred = (process.env.AI_ENGINE || '').toLowerCase();
    const hasGemini = !!process.env.GEMINI_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    let activeEngine = 'none';
    if (preferred === 'gemini' && hasGemini) activeEngine = 'gemini';
    else if (preferred === 'openai' && hasOpenAI) activeEngine = 'openai';
    else if (hasGemini) activeEngine = 'gemini';
    else if (hasOpenAI) activeEngine = 'openai';

    return NextResponse.json({
      enabled: (hasOpenAI || hasGemini) && !!process.env.BRAVE_SEARCH_API_KEY,
      hasOpenAI,
      hasGemini,
      hasBraveSearch: !!process.env.BRAVE_SEARCH_API_KEY,
      activeEngine,
      brands: stats,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
