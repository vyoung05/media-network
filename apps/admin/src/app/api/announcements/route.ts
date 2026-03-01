import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET /api/announcements — list announcements
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');
  const activeOnly = searchParams.get('active') !== 'false';

  const supabase = getServiceClient();

  let query = supabase
    .from('announcements')
    .select('*')
    .order('pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (activeOnly) {
    query = query.eq('active', true);
  }

  const { data, error } = await query;

  if (error) {
    // Table might not exist yet
    if (error.code === '42P01') {
      return NextResponse.json({ announcements: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ announcements: data || [] });
}

// POST /api/announcements — create announcement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type, video_url, pinned } = body;

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('announcements')
      .insert({
        title,
        message: message || null,
        type: type || 'info', // info, update, welcome, alert
        video_url: video_url || null,
        pinned: pinned || false,
        active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ announcement: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
