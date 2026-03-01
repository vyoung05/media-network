import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseService();
    const body = await request.json();

    const updates: Record<string, any> = {};
    const allowedFields = ['title', 'artist_name', 'album', 'cover_image', 'preview_url', 'spotify_url', 'apple_music_url', 'soundcloud_url', 'youtube_url', 'genre', 'issue_id', 'status', 'submitted_by'];

    for (const field of allowedFields) {
      if (body[field] !== undefined) updates[field] = body[field];
    }

    // If marking as featured, set featured_at
    if (body.status === 'featured') {
      updates.featured_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('magazine_tracks')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = getSupabaseService();
    const { error } = await supabase.from('magazine_tracks').delete().eq('id', params.id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
