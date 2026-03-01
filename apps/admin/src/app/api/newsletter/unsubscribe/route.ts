import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

// Public endpoint — CORS-enabled for brand sites
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();

    if (!body.email || !body.brand) {
      return NextResponse.json(
        { error: 'Email and brand are required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const { data: subscriber, error: findErr } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', body.email.toLowerCase().trim())
      .eq('brand', body.brand)
      .single();

    if (findErr || !subscriber) {
      return NextResponse.json(
        { message: 'Email not found in subscriber list.' },
        { status: 404, headers: corsHeaders() }
      );
    }

    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString(),
      })
      .eq('id', subscriber.id);

    if (error) throw error;

    return NextResponse.json(
      { message: 'You have been unsubscribed. Sorry to see you go!' },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
