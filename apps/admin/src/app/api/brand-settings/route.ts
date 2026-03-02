import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

const BRANDS = ['saucecaviar', 'trapglow', 'saucewire', 'trapfrequency'] as const;

const BRAND_DEFAULTS: Record<string, Record<string, unknown>> = {
  saucecaviar: { site_name: 'SauceCaviar', tagline: 'Premium Culture & Lifestyle', primary_color: '#C9A84C', secondary_color: '#1A1A2E', accent_color: '#D4AF37' },
  trapglow: { site_name: 'TrapGlow', tagline: 'Discover New Music', primary_color: '#8B5CF6', secondary_color: '#4C1D95', accent_color: '#A78BFA' },
  saucewire: { site_name: 'SauceWire', tagline: 'Breaking News & Culture', primary_color: '#E63946', secondary_color: '#1D3557', accent_color: '#F77F00' },
  trapfrequency: { site_name: 'TrapFrequency', tagline: 'Production & Beats', primary_color: '#39FF14', secondary_color: '#0D1117', accent_color: '#00FF41' },
};

// GET /api/brand-settings?brand=saucecaviar
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const brand = request.nextUrl.searchParams.get('brand');

    if (brand) {
      // Fetch single brand
      let { data, error } = await supabase
        .from('brand_settings')
        .select('*')
        .eq('brand', brand)
        .maybeSingle();

      if (error) throw error;

      // Auto-create defaults if brand doesn't exist yet
      if (!data && BRANDS.includes(brand as any)) {
        const defaults = BRAND_DEFAULTS[brand] || {};
        const { data: created, error: createError } = await supabase
          .from('brand_settings')
          .insert({
            brand,
            ...defaults,
            background_color: '#0A0A0F',
            text_color: '#FFFFFF',
            social_links: {},
            custom_fonts: { heading: 'Inter', body: 'Inter' },
            navigation_items: [],
            is_maintenance: false,
            footer_text: `© ${new Date().getFullYear()} ${defaults.site_name || brand}. All rights reserved.`,
          })
          .select()
          .single();

        if (createError) throw createError;
        data = created;
      }

      return NextResponse.json({ data });
    }

    // Fetch all brands
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .order('brand');

    if (error) throw error;
    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching brand settings:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch brand settings' }, { status: 500 });
  }
}

// PUT /api/brand-settings — update settings for a brand
export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();
    const { brand, ...settings } = body;

    if (!brand) {
      return NextResponse.json({ error: 'brand is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('brand_settings')
      .update({
        ...settings,
        updated_at: new Date().toISOString(),
      })
      .eq('brand', brand)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error updating brand settings:', error);
    return NextResponse.json({ error: error.message || 'Failed to update brand settings' }, { status: 500 });
  }
}
