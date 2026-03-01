import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('beats')
      .select('*, producer:producers(*)')
      .eq('id', params.id)
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API /beats/[id] GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const { data, error } = await supabase
      .from('beats')
      .update(body)
      .eq('id', params.id)
      .select('*, producer:producers(*)')
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error('API /beats/[id] PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from('beats')
      .delete()
      .eq('id', params.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('API /beats/[id] DELETE error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
