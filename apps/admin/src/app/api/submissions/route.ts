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
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const per_page = parseInt(searchParams.get('per_page') || '50', 10);

    // Main query
    let query = supabase
      .from('submissions')
      .select('*, user:users!user_id(*), reviewer:users!reviewer_id(*)', { count: 'exact' })
      .order('submitted_at', { ascending: false })
      .range(0, per_page - 1);

    if (brand) query = query.eq('brand', brand);
    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw error;

    // Fetch status counts in parallel
    const [allRes, pendingRes, reviewRes, approvedRes, rejectedRes] = await Promise.all([
      supabase.from('submissions').select('id', { count: 'exact', head: true }),
      supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'under_review'),
      supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('submissions').select('id', { count: 'exact', head: true }).eq('status', 'rejected'),
    ]);

    const statusCounts = {
      all: allRes.count || 0,
      pending: pendingRes.count || 0,
      under_review: reviewRes.count || 0,
      approved: approvedRes.count || 0,
      rejected: rejectedRes.count || 0,
      published: 0,
    };

    return NextResponse.json({ data: data || [], count: count || 0, statusCounts });
  } catch (err: any) {
    console.error('API /submissions error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
