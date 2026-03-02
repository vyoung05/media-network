import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

// Public endpoint — no auth required
// GET /api/brand-settings/public/[brand]
export async function GET(
  request: NextRequest,
  { params }: { params: { brand: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const { data, error } = await supabase
      .from('brand_settings')
      .select(
        'brand, site_name, tagline, primary_color, secondary_color, accent_color, background_color, text_color, logo_url, logo_dark_url, favicon_url, hero_image_url, hero_title, hero_subtitle, hero_cta_text, hero_cta_url, og_image_url, footer_text, social_links, custom_fonts, navigation_items, is_maintenance, maintenance_message'
      )
      .eq('brand', params.brand)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // Cache for 5 minutes, stale-while-revalidate for 1 hour
    return NextResponse.json(
      { data },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
