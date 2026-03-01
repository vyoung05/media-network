import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '50');

    let query = supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact' })
      .order('subscribed_at', { ascending: false });

    if (brand) query = query.eq('brand', brand);
    if (search) query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);

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
      .from('newsletter_subscribers')
      .insert({
        email: body.email,
        name: body.name || null,
        brand: body.brand,
        is_active: true,
        preferences: body.preferences || {},
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Subscriber ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Subscriber ID required' }, { status: 400 });
    }

    const updates: any = {};
    if (body.is_active !== undefined) {
      updates.is_active = body.is_active;
      if (!body.is_active) {
        updates.unsubscribed_at = new Date().toISOString();
      } else {
        updates.unsubscribed_at = null;
      }
    }
    if (body.name !== undefined) updates.name = body.name;

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
