import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 30;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST() {
  try {
    const supabase = getSupabase();
    const results: string[] = [];

    // Create api_costs table
    const { error: costErr } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS api_costs (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          service text NOT NULL,
          operation text NOT NULL,
          model text,
          provider text,
          brand text,
          article_id uuid,
          tokens_in int DEFAULT 0,
          tokens_out int DEFAULT 0,
          estimated_cost numeric(10,6) DEFAULT 0,
          metadata jsonb DEFAULT '{}',
          created_at timestamptz DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_api_costs_created ON api_costs(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_api_costs_service ON api_costs(service);
      `
    });
    results.push(costErr ? `api_costs: ${costErr.message}` : 'api_costs: created ✅');

    // Create link_clicks table
    const { error: clickErr } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS link_clicks (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          article_id uuid,
          brand text,
          link_type text NOT NULL DEFAULT 'affiliate',
          destination_url text NOT NULL,
          referrer text,
          user_agent text,
          ip_hash text,
          country text,
          created_at timestamptz DEFAULT now()
        );
        CREATE INDEX IF NOT EXISTS idx_link_clicks_created ON link_clicks(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_link_clicks_article ON link_clicks(article_id);
        CREATE INDEX IF NOT EXISTS idx_link_clicks_type ON link_clicks(link_type);
      `
    });
    results.push(clickErr ? `link_clicks: ${clickErr.message}` : 'link_clicks: created ✅');

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
