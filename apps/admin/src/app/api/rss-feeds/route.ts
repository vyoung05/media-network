import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// GET: list all RSS feeds (optional ?brand= filter)
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseService();
    const brand = request.nextUrl.searchParams.get('brand');

    let query = supabase
      .from('rss_feeds')
      .select('*')
      .order('brand', { ascending: true })
      .order('name', { ascending: true });

    if (brand) {
      query = query.eq('brand', brand);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ feeds: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: add a new RSS feed
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseService();
    const body = await request.json();

    const { brand, name, url, category } = body;

    if (!brand || !name || !url) {
      return NextResponse.json(
        { error: 'brand, name, and url are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('rss_feeds')
      .insert({
        brand,
        name,
        url,
        category: category || 'General',
        enabled: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ feed: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
