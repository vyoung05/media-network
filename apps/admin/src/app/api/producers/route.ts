import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const per_page = parseInt(searchParams.get('per_page') || '100', 10);

    let query = supabase
      .from('producers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(0, per_page - 1);

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ data: data || [], count: count || 0 });
  } catch (err: any) {
    console.error('API /producers GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const { data, error } = await supabase
      .from('producers')
      .insert(body)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    console.error('API /producers POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
