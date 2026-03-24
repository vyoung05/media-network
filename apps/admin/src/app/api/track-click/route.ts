import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// GET /api/track-click?url=...&article=...&brand=...&type=affiliate
// Tracks the click then redirects to the destination URL
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const articleId = searchParams.get('article');
  const brand = searchParams.get('brand');
  const linkType = searchParams.get('type') || 'affiliate';

  if (!url) {
    return NextResponse.json({ error: 'url parameter required' }, { status: 400 });
  }

  // Validate it's a real URL
  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // Track the click (fire-and-forget)
  try {
    const supabase = getSupabase();
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ipHash = ip ? crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16) : null;

    await supabase.from('link_clicks').insert({
      article_id: articleId || null,
      brand: brand || null,
      link_type: linkType,
      destination_url: url,
      referrer: request.headers.get('referer') || null,
      user_agent: request.headers.get('user-agent') || null,
      ip_hash: ipHash,
    });
  } catch (err) {
    console.error('Click tracking failed (non-fatal):', err);
  }

  // Redirect to the actual destination
  return NextResponse.redirect(url, 302);
}

// POST /api/track-click — for batch stats or manual logging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, article_id, brand, link_type = 'affiliate' } = body;

    if (!url) {
      return NextResponse.json({ error: 'url required' }, { status: 400 });
    }

    const supabase = getSupabase();
    const { error } = await supabase.from('link_clicks').insert({
      article_id: article_id || null,
      brand: brand || null,
      link_type: link_type,
      destination_url: url,
    });

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
