import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

// GET /api/social/share-log?article_id=...&brand=...
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const articleId = request.nextUrl.searchParams.get('article_id');
    const brand = request.nextUrl.searchParams.get('brand');

    let query = supabase
      .from('social_share_log')
      .select('*')
      .order('shared_at', { ascending: false });

    if (articleId) query = query.eq('article_id', articleId);
    if (brand) query = query.eq('brand', brand);

    const { data, error } = await query.limit(100);
    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching share log:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch share log' },
      { status: 500 }
    );
  }
}
