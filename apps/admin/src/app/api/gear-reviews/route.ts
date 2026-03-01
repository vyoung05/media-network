import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const per_page = parseInt(searchParams.get('per_page') || '100', 10);

    let query = supabase
      .from('gear_reviews')
      .select('*, producer:producers(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(0, per_page - 1);

    if (category) query = query.eq('category', category);
    if (status) query = query.eq('status', status);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ data: data || [], count: count || 0 });
  } catch (err: any) {
    console.error('API /gear-reviews GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const { data, error } = await supabase
      .from('gear_reviews')
      .insert(body)
      .select('*, producer:producers(*)')
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error('API /gear-reviews POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
