import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// GET /api/notifications — list notifications for current user (or all for admin)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  const unreadOnly = searchParams.get('unread') === 'true';

  const supabase = getServiceClient();

  let query = supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq('read', false);
  }

  const { data, error } = await query;

  if (error) {
    // Table might not exist yet — return empty
    if (error.code === '42P01') {
      return NextResponse.json({ notifications: [], unreadCount: 0 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const unreadCount = (data || []).filter((n: any) => !n.read).length;
  return NextResponse.json({ notifications: data || [], unreadCount });
}

// POST /api/notifications — create a notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, message, link, brand } = body;

    if (!type || !title) {
      return NextResponse.json({ error: 'type and title are required' }, { status: 400 });
    }

    const supabase = getServiceClient();

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        type,
        title,
        message: message || null,
        link: link || null,
        brand: brand || null,
        read: false,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ notification: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/notifications — mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, markAllRead } = body;

    const supabase = getServiceClient();

    if (markAllRead) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    if (ids?.length) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', ids);

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'ids or markAllRead required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
