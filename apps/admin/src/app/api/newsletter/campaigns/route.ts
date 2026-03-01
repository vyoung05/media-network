import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');

    let query = supabase
      .from('newsletter_campaigns')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (brand) query = query.eq('brand', brand);
    if (status) query = query.eq('status', status);

    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      page,
      per_page: perPage,
      total_pages: Math.ceil((count || 0) / perPage),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from('newsletter_campaigns')
      .insert({
        brand: body.brand,
        subject: body.subject,
        html_content: body.html_content || null,
        text_content: body.text_content || null,
        article_ids: body.article_ids || [],
        status: body.status || 'draft',
        scheduled_at: body.scheduled_at || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
