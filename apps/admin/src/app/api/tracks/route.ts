import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseService();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const issueId = searchParams.get('issue_id');
    const sortBy = searchParams.get('sort') || 'hot_percentage';
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = supabase
      .from('magazine_tracks')
      .select('*, issue:magazine_issues(id, title, issue_number)')
      .order(sortBy, { ascending: false })
      .limit(limit);

    if (status) query = query.eq('status', status);
    if (issueId) query = query.eq('issue_id', issueId);

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ tracks: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseService();
    const body = await request.json();

    const { title, artist_name, album, cover_image, preview_url, spotify_url, apple_music_url, soundcloud_url, youtube_url, genre, issue_id, submitted_by } = body;

    if (!title || !artist_name) {
      return NextResponse.json({ error: 'title and artist_name required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('magazine_tracks')
      .insert({
        title,
        artist_name,
        album: album || null,
        cover_image: cover_image || null,
        preview_url: preview_url || null,
        spotify_url: spotify_url || null,
        apple_music_url: apple_music_url || null,
        soundcloud_url: soundcloud_url || null,
        youtube_url: youtube_url || null,
        genre: genre || null,
        issue_id: issue_id || null,
        submitted_by: submitted_by || null,
        status: 'active',
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
