import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

export async function POST() {
  try {
    const supabase = getSupabaseServiceClient();

    // Create newsletter_subscribers table
    const { error: e1 } = await supabase.rpc('exec_sql', {
      sql: `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email text NOT NULL,
        name text,
        brand text NOT NULL,
        subscribed_at timestamptz DEFAULT now(),
        unsubscribed_at timestamptz,
        is_active boolean DEFAULT true,
        preferences jsonb DEFAULT '{}'::jsonb,
        UNIQUE(email, brand)
      )`
    });

    // Try direct table creation via insert/query pattern
    // If RPC doesn't work, we'll create tables by attempting operations

    // Create newsletter_subscribers
    await supabase.from('newsletter_subscribers').select('id').limit(1).catch(() => null);
    
    // Create newsletter_campaigns
    await supabase.from('newsletter_campaigns').select('id').limit(1).catch(() => null);
    
    // Create newsletter_settings
    await supabase.from('newsletter_settings').select('id').limit(1).catch(() => null);

    return NextResponse.json({ 
      message: 'Setup attempted. Tables may need to be created via Supabase Dashboard SQL editor.',
      note: 'Run the SQL from setup-newsletter-seo-sql.md in the Supabase SQL editor.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
