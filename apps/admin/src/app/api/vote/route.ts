import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Public voting endpoint — can be called from the magazine site
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseService();
    const body = await request.json();
    const { track_id, vote, fingerprint } = body;

    if (!track_id || !vote || !['hot', 'not'].includes(vote)) {
      return NextResponse.json({ error: 'track_id and vote (hot|not) required' }, { status: 400 });
    }

    // Check for duplicate vote by fingerprint
    if (fingerprint) {
      const { data: existing } = await supabase
        .from('magazine_votes')
        .select('id')
        .eq('track_id', track_id)
        .eq('voter_fingerprint', fingerprint)
        .single();

      if (existing) {
        return NextResponse.json({ error: 'Already voted on this track', alreadyVoted: true }, { status: 409 });
      }
    }

    // Get voter IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() || 'unknown';

    // Insert vote
    const { error: voteError } = await supabase
      .from('magazine_votes')
      .insert({
        track_id,
        vote,
        voter_fingerprint: fingerprint || null,
        voter_ip: ip,
      });

    if (voteError) throw voteError;

    // Return updated track stats (trigger auto-updates counts)
    // Small delay to let trigger fire
    await new Promise(r => setTimeout(r, 100));

    const { data: track } = await supabase
      .from('magazine_tracks')
      .select('id, title, artist_name, hot_count, not_count, total_votes, hot_percentage')
      .eq('id', track_id)
      .single();

    return NextResponse.json({
      success: true,
      track,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// Get results for a track or all tracks in an issue
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseService();
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get('track_id');
    const issueId = searchParams.get('issue_id');

    if (trackId) {
      const { data, error } = await supabase
        .from('magazine_tracks')
        .select('id, title, artist_name, cover_image, hot_count, not_count, total_votes, hot_percentage, genre, spotify_url')
        .eq('id', trackId)
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }

    if (issueId) {
      const { data, error } = await supabase
        .from('magazine_tracks')
        .select('id, title, artist_name, cover_image, hot_count, not_count, total_votes, hot_percentage, genre, spotify_url')
        .eq('issue_id', issueId)
        .eq('status', 'active')
        .order('hot_percentage', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ tracks: data || [] });
    }

    return NextResponse.json({ error: 'track_id or issue_id required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
