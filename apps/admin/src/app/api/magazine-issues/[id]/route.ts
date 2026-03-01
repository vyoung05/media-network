import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    const { id } = await params;

    // Fetch issue
    const { data: issue, error: issueError } = await supabase
      .from('magazine_issues')
      .select('*')
      .eq('id', id)
      .single();

    if (issueError) throw issueError;

    // Fetch pages for this issue
    const { data: pages, error: pagesError } = await supabase
      .from('magazine_pages')
      .select('*')
      .eq('issue_id', id)
      .order('page_number', { ascending: true });

    if (pagesError) throw pagesError;

    return NextResponse.json({ ...issue, pages: pages || [] });
  } catch (err: any) {
    console.error('API /magazine-issues/[id] GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    const { id } = await params;
    const body = await request.json();

    // If title changes, update slug too
    if (body.title && !body.slug) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    const { data, error } = await supabase
      .from('magazine_issues')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API /magazine-issues/[id] PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    const { id } = await params;

    // Pages are cascade-deleted via FK
    const { error } = await supabase
      .from('magazine_issues')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /magazine-issues/[id] DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
