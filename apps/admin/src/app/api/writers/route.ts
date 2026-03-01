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
    const per_page = parseInt(searchParams.get('per_page') || '100', 10);

    // Fetch writers and editors in parallel
    let writersQuery = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'writer')
      .order('created_at', { ascending: false })
      .range(0, per_page - 1);

    let editorsQuery = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'editor')
      .order('created_at', { ascending: false })
      .range(0, per_page - 1);

    if (brand) {
      writersQuery = writersQuery.contains('brand_affiliations', [brand]);
      editorsQuery = editorsQuery.contains('brand_affiliations', [brand]);
    }

    const [writersRes, editorsRes] = await Promise.all([writersQuery, editorsQuery]);

    if (writersRes.error) throw writersRes.error;
    if (editorsRes.error) throw editorsRes.error;

    const allUsers = [...(editorsRes.data || []), ...(writersRes.data || [])];
    const totalCount = (writersRes.count || 0) + (editorsRes.count || 0);

    return NextResponse.json({ data: allUsers, count: totalCount });
  } catch (err: any) {
    console.error('API /writers error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
