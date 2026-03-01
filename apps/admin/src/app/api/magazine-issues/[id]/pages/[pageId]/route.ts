import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; pageId: string } }
) {
  try {
    const supabase = getSupabase();
    const { id, pageId } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('magazine_pages')
      .update(body)
      .eq('id', pageId)
      .eq('issue_id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API /magazine-issues/[id]/pages/[pageId] PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; pageId: string } }
) {
  try {
    const supabase = getSupabase();
    const { id, pageId } = await params;

    const { error } = await supabase
      .from('magazine_pages')
      .delete()
      .eq('id', pageId)
      .eq('issue_id', id);

    if (error) throw error;

    // Update page_count on the issue
    const { count } = await supabase
      .from('magazine_pages')
      .select('*', { count: 'exact', head: true })
      .eq('issue_id', id);

    await supabase
      .from('magazine_issues')
      .update({ page_count: count || 0 })
      .eq('id', id);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /magazine-issues/[id]/pages/[pageId] DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
