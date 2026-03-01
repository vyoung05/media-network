import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');

    let query = supabase.from('newsletter_settings').select('*');
    if (brand) query = query.eq('brand', brand);

    const { data, error } = await query;
    if (error) throw error;

    // If querying single brand, return single object
    if (brand) {
      return NextResponse.json(data?.[0] || null);
    }
    return NextResponse.json(data || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();

    if (!body.brand) {
      return NextResponse.json({ error: 'Brand is required' }, { status: 400 });
    }

    // Upsert settings
    const { data, error } = await supabase
      .from('newsletter_settings')
      .upsert(
        {
          brand: body.brand,
          enabled: body.enabled ?? false,
          provider: body.provider || 'resend',
          api_key_encrypted: body.api_key_encrypted || null,
          from_email: body.from_email || null,
          from_name: body.from_name || null,
          reply_to: body.reply_to || null,
          template_style: body.template_style || 'default',
          footer_text: body.footer_text || null,
          auto_send_on_publish: body.auto_send_on_publish ?? false,
          digest_frequency: body.digest_frequency || 'instant',
          digest_day: body.digest_day ?? 1,
          digest_hour: body.digest_hour ?? 9,
        },
        { onConflict: 'brand' }
      )
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
