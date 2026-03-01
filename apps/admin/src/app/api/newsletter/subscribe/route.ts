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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, is_active')
      .eq('email', body.email)
      .eq('brand', body.brand)
      .single();

    if (existing) {
      if (!existing.is_active) {
        // Resubscribe
        await supabase
          .from('newsletter_subscribers')
          .update({ is_active: true, unsubscribed_at: null })
          .eq('id', existing.id);
        return NextResponse.json(
          { message: 'Welcome back! You have been resubscribed.' },
          { headers: corsHeaders() }
        );
      }
      return NextResponse.json(
        { message: 'You are already subscribed!' },
        { headers: corsHeaders() }
      );
    }

    // Create new subscriber
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: body.email.toLowerCase().trim(),
        name: body.name || null,
        brand: body.brand,
        is_active: true,
      });

    if (error) throw error;

    return NextResponse.json(
      { message: 'Successfully subscribed! Check your inbox.' },
      { status: 201, headers: corsHeaders() }
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
