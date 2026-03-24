import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
    const range = searchParams.get('range') || '30d';

    let dateFrom: string | null = null;
    const now = new Date();
    switch (range) {
      case '7d': dateFrom = new Date(now.getTime() - 7 * 86400000).toISOString(); break;
      case '30d': dateFrom = new Date(now.getTime() - 30 * 86400000).toISOString(); break;
      case '90d': dateFrom = new Date(now.getTime() - 90 * 86400000).toISOString(); break;
    }

    // Fetch all costs
    let query = supabase
      .from('api_costs')
      .select('*')
      .order('created_at', { ascending: false });
    if (dateFrom) query = query.gte('created_at', dateFrom);
    const { data: costs, error: costsError } = await query;

    if (costsError) {
      // Table might not exist yet
      return NextResponse.json({
        totalCost: 0,
        byService: {},
        byProvider: {},
        byBrand: {},
        dailyCosts: [],
        recentEntries: [],
        message: 'Cost tracking table not set up yet. Costs will be tracked automatically once the table is created.',
      });
    }

    const entries = costs || [];

    // Total cost
    const totalCost = entries.reduce((sum, e) => sum + (parseFloat(e.estimated_cost) || 0), 0);

    // By service
    const byService: Record<string, { count: number; cost: number }> = {};
    entries.forEach((e) => {
      const key = e.service || 'unknown';
      if (!byService[key]) byService[key] = { count: 0, cost: 0 };
      byService[key].count++;
      byService[key].cost += parseFloat(e.estimated_cost) || 0;
    });

    // By provider
    const byProvider: Record<string, { count: number; cost: number }> = {};
    entries.forEach((e) => {
      const key = e.provider || 'unknown';
      if (!byProvider[key]) byProvider[key] = { count: 0, cost: 0 };
      byProvider[key].count++;
      byProvider[key].cost += parseFloat(e.estimated_cost) || 0;
    });

    // By brand
    const byBrand: Record<string, { count: number; cost: number }> = {};
    entries.forEach((e) => {
      const key = e.brand || 'unknown';
      if (!byBrand[key]) byBrand[key] = { count: 0, cost: 0 };
      byBrand[key].count++;
      byBrand[key].cost += parseFloat(e.estimated_cost) || 0;
    });

    // Daily costs (last 30 days)
    const dailyCosts: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyCosts[d.toISOString().split('T')[0]] = 0;
    }
    entries.forEach((e) => {
      const day = new Date(e.created_at).toISOString().split('T')[0];
      if (dailyCosts[day] !== undefined) {
        dailyCosts[day] += parseFloat(e.estimated_cost) || 0;
      }
    });

    // Fetch link clicks
    let clickQuery = supabase
      .from('link_clicks')
      .select('*')
      .order('created_at', { ascending: false });
    if (dateFrom) clickQuery = clickQuery.gte('created_at', dateFrom);
    const { data: clicks, error: clicksError } = await clickQuery;

    const totalClicks = clicksError ? 0 : (clicks || []).length;
    const affiliateClicks = clicksError ? 0 : (clicks || []).filter((c: any) => c.link_type === 'affiliate').length;
    const clicksByBrand: Record<string, number> = {};
    if (!clicksError && clicks) {
      clicks.forEach((c: any) => {
        const key = c.brand || 'unknown';
        clicksByBrand[key] = (clicksByBrand[key] || 0) + 1;
      });
    }

    return NextResponse.json({
      totalCost: Math.round(totalCost * 100) / 100,
      totalApiCalls: entries.length,
      byService,
      byProvider,
      byBrand,
      dailyCosts: Object.entries(dailyCosts).map(([date, cost]) => ({
        date,
        cost: Math.round(cost * 1000) / 1000,
      })),
      recentEntries: entries.slice(0, 20).map((e) => ({
        service: e.service,
        operation: e.operation,
        model: e.model,
        provider: e.provider,
        brand: e.brand,
        cost: parseFloat(e.estimated_cost) || 0,
        created_at: e.created_at,
      })),
      clicks: {
        total: totalClicks,
        affiliate: affiliateClicks,
        byBrand: clicksByBrand,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
