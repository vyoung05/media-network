import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-admin';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    const { id } = await params;

    // Update status to published and set published_at
    const { data, error } = await supabase
      .from('magazine_issues')
      .update({
        status: 'published',
        published_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API /magazine-issues/[id]/publish POST error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
