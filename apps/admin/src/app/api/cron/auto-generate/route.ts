import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering — this route reads headers and hits external APIs
export const dynamic = 'force-dynamic';

// ======================== CRON: AUTO-GENERATE ========================
// Vercel Cron endpoint — runs every 6 hours
// Checks if auto-pilot is enabled, then generates articles for all brands

const BRAND_NAMES: Record<string, string> = {
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  saucewire: 'SauceWire',
  trapfrequency: 'TrapFrequency',
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function logCronResult(
  supabase: ReturnType<typeof getSupabase>,
  results: unknown,
  articlesCreated: number,
  errors: string[]
) {
  try {
    await supabase.from('ai_pipeline_logs').insert({
      timestamp: new Date().toISOString(),
      results_json: results,
      articles_created: articlesCreated,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (err) {
    console.error('Failed to log cron result:', err);
  }
}

export async function GET(request: Request) {
  try {
    // Verify this is a legitimate cron request (Vercel sends this header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabase();

    // Check if auto-pilot is enabled in settings table
    const { data: settingRow, error: settingsError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'ai_pipeline_autopilot')
      .single();

    if (settingsError && settingsError.code !== 'PGRST116') {
      // PGRST116 = row not found, which just means auto-pilot was never configured
      console.error('Failed to read auto-pilot setting:', settingsError);
    }

    const isEnabled = settingRow?.value === true || settingRow?.value === 'true';

    if (!isEnabled) {
      await logCronResult(supabase, { message: 'Auto-pilot is disabled' }, 0, []);
      return NextResponse.json({
        success: true,
        message: 'Auto-pilot is disabled. Enable it in the settings table (key: ai_pipeline_autopilot).',
        articlesCreated: 0,
      });
    }

    // Build base URL from the request
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // Call auto-generate for all brands with count=3 per brand
    const allResults: unknown[] = [];
    const allErrors: string[] = [];
    let totalCreated = 0;

    // Generate for each brand individually to ensure even distribution
    for (const brand of Object.keys(BRAND_NAMES)) {
      try {
        const genRes = await fetch(`${baseUrl}/api/auto-generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            brand,
            count: 3,
          }),
        });

        const genData = await genRes.json();

        if (genRes.ok && genData.success) {
          allResults.push({ brand, ...genData.summary });
          totalCreated += genData.summary?.success || 0;

          // Collect any errors from this brand's batch
          const brandErrors = (genData.results || [])
            .filter((r: { status: string }) => r.status === 'error')
            .map((r: { reason?: string; sourceTitle?: string }) => `${brand}: ${r.reason || 'Unknown error'} (${r.sourceTitle || 'no title'})`);
          allErrors.push(...brandErrors);
        } else {
          allErrors.push(`${brand}: ${genData.error || 'Generation request failed'}`);
          allResults.push({ brand, error: genData.error });
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        allErrors.push(`${brand}: ${errMsg}`);
        allResults.push({ brand, error: errMsg });
      }

      // Small delay between brands to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Log the results
    await logCronResult(supabase, allResults, totalCreated, allErrors);

    return NextResponse.json({
      success: true,
      message: `Auto-pilot cron completed. Generated ${totalCreated} articles across ${Object.keys(BRAND_NAMES).length} brands.`,
      articlesCreated: totalCreated,
      results: allResults,
      errors: allErrors.length > 0 ? allErrors : undefined,
      ranAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Cron auto-generate error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Cron job failed' },
      { status: 500 }
    );
  }
}
