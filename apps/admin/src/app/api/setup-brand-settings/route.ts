import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'public' },
  });
}

const BRANDS = ['saucecaviar', 'trapglow', 'saucewire', 'trapfrequency'] as const;

const BRAND_DEFAULTS: Record<string, { site_name: string; tagline: string; primary_color: string; secondary_color: string; accent_color: string }> = {
  saucecaviar: {
    site_name: 'SauceCaviar',
    tagline: 'Premium Culture & Lifestyle',
    primary_color: '#C9A84C',
    secondary_color: '#1A1A2E',
    accent_color: '#D4AF37',
  },
  trapglow: {
    site_name: 'TrapGlow',
    tagline: 'Discover New Music',
    primary_color: '#8B5CF6',
    secondary_color: '#4C1D95',
    accent_color: '#A78BFA',
  },
  saucewire: {
    site_name: 'SauceWire',
    tagline: 'Breaking News & Culture',
    primary_color: '#E63946',
    secondary_color: '#1D3557',
    accent_color: '#F77F00',
  },
  trapfrequency: {
    site_name: 'TrapFrequency',
    tagline: 'Production & Beats',
    primary_color: '#39FF14',
    secondary_color: '#0D1117',
    accent_color: '#00FF41',
  },
};

// POST /api/setup-brand-settings — create brand_settings table and seed defaults
export async function POST() {
  const supabase = getServiceClient();
  const results: string[] = [];

  // Step 1: Try to insert default brand settings
  // If the table doesn't exist, we need to create it first via SQL
  // Since exec_sql RPC doesn't exist, we'll use the from() approach
  // to test if the table exists, then insert defaults

  for (const brand of BRANDS) {
    try {
      // Check if brand already has settings
      const { data: existing, error: checkError } = await supabase
        .from('brand_settings')
        .select('id')
        .eq('brand', brand)
        .maybeSingle();

      if (checkError) {
        // Table likely doesn't exist
        results.push(`${brand}: table error - ${checkError.message}`);
        continue;
      }

      if (existing) {
        results.push(`${brand}: already exists`);
        continue;
      }

      // Insert default settings
      const defaults = BRAND_DEFAULTS[brand];
      const { error: insertError } = await supabase
        .from('brand_settings')
        .insert({
          brand,
          ...defaults,
          background_color: '#0A0A0F',
          text_color: '#FFFFFF',
          hero_cta_text: 'Explore',
          hero_cta_url: '/',
          social_links: {},
          custom_fonts: { heading: 'Inter', body: 'Inter' },
          navigation_items: [],
          is_maintenance: false,
          maintenance_message: 'We\'ll be back soon.',
          footer_text: `© ${new Date().getFullYear()} ${defaults.site_name}. All rights reserved.`,
        });

      if (insertError) {
        results.push(`${brand}: insert error - ${insertError.message}`);
      } else {
        results.push(`${brand}: created with defaults`);
      }
    } catch (err: any) {
      results.push(`${brand}: error - ${err.message}`);
    }
  }

  return NextResponse.json({ 
    message: 'Brand settings setup complete',
    results,
    note: 'If table does not exist, create it via Supabase Dashboard SQL Editor first.',
    sql: `CREATE TABLE IF NOT EXISTS brand_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  brand text UNIQUE NOT NULL,
  site_name text,
  tagline text,
  primary_color text DEFAULT '#3B82F6',
  secondary_color text DEFAULT '#8B5CF6',
  accent_color text DEFAULT '#F59E0B',
  background_color text DEFAULT '#0A0A0F',
  text_color text DEFAULT '#FFFFFF',
  logo_url text,
  logo_dark_url text,
  favicon_url text,
  hero_image_url text,
  hero_title text,
  hero_subtitle text,
  hero_cta_text text DEFAULT 'Explore',
  hero_cta_url text DEFAULT '/',
  og_image_url text,
  footer_text text,
  social_links jsonb DEFAULT '{}'::jsonb,
  custom_css text,
  custom_fonts jsonb DEFAULT '{"heading": "Inter", "body": "Inter"}'::jsonb,
  navigation_items jsonb DEFAULT '[]'::jsonb,
  is_maintenance boolean DEFAULT false,
  maintenance_message text DEFAULT 'We will be back soon.',
  analytics_id text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid
);

ALTER TABLE brand_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brand_settings_public_read" ON brand_settings FOR SELECT USING (true);
CREATE POLICY "brand_settings_service_all" ON brand_settings FOR ALL USING (true) WITH CHECK (true);
CREATE INDEX IF NOT EXISTS idx_brand_settings_brand ON brand_settings(brand);`
  });
}
