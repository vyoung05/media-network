import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre') || '';
    const producer_id = searchParams.get('producer_id') || '';
    const is_featured = searchParams.get('is_featured');
    const per_page = parseInt(searchParams.get('per_page') || '100', 10);

    let query = supabase
      .from('beats')
      .select('*, producer:producers(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(0, per_page - 1);

    if (genre) query = query.eq('genre', genre);
    if (producer_id) query = query.eq('producer_id', producer_id);
    if (is_featured === 'true') query = query.eq('is_featured', true);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ data: data || [], count: count || 0 });
  } catch (err: any) {
    console.error('API /beats GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const { data, error } = await supabase
      .from('beats')
      .insert(body)
      .select('*, producer:producers(*)')
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error('API /beats POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
