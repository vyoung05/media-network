import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    const { id } = await params;

    const { data, error } = await supabase
      .from('magazine_pages')
      .select('*')
      .eq('issue_id', id)
      .order('page_number', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    console.error('API /magazine-issues/[id]/pages GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    const { id } = await params;
    const body = await request.json();

    // If no page_number, auto-assign next number
    if (!body.page_number) {
      const { data: existing } = await supabase
        .from('magazine_pages')
        .select('page_number')
        .eq('issue_id', id)
        .order('page_number', { ascending: false })
        .limit(1);

      body.page_number = existing && existing.length > 0
        ? existing[0].page_number + 1
        : 1;
    }

    const { data: page, error: pageError } = await supabase
      .from('magazine_pages')
      .insert({ ...body, issue_id: id })
      .select()
      .single();

    if (pageError) throw pageError;

    // Update page_count on the issue
    const { count } = await supabase
      .from('magazine_pages')
      .select('*', { count: 'exact', head: true })
      .eq('issue_id', id);

    await supabase
      .from('magazine_issues')
      .update({ page_count: count || 0 })
      .eq('id', id);

    return NextResponse.json(page, { status: 201 });
  } catch (err: any) {
    console.error('API /magazine-issues/[id]/pages POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
