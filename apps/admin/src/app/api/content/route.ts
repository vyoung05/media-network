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
    const status = searchParams.get('status') || 'pending_review';
    const per_page = parseInt(searchParams.get('per_page') || '50', 10);

    let query = supabase
      .from('articles')
      .select('*, author:users!author_id(*)', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false })
      .range(0, per_page - 1);

    if (brand) query = query.eq('brand', brand);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ data: data || [], count: count || 0 });
  } catch (err: any) {
    console.error('API /content error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
