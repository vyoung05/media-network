import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Allow up to 300 seconds for bulk TTS
export const maxDuration = 300;

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { brand, limit = 10 } = body as { brand?: string; limit?: number };

    const supabase = getSupabase();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://media-network-admin.vercel.app';

    // Find published articles that DON'T have a 'ready' audio_version
    // Step 1: Get all article IDs that already have audio
    const { data: existingAudio } = await supabase
      .from('audio_versions')
      .select('article_id')
      .eq('status', 'ready');

    const audioArticleIds = new Set((existingAudio || []).map((a: any) => a.article_id));

    // Step 2: Get published articles
    let query = supabase
      .from('articles')
      .select('id, title, brand')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(500);

    if (brand && brand !== 'all') {
      query = query.eq('brand', brand);
    }

    const { data: articles, error: articlesError } = await query;
    if (articlesError) throw articlesError;

    // Step 3: Filter to only those missing audio
    const missingAudio = (articles || []).filter((a: any) => !audioArticleIds.has(a.id));
    const batch = missingAudio.slice(0, Math.min(limit, 20)); // Cap at 20 per request

    if (batch.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All articles already have audio!',
        processed: 0,
        totalMissing: 0,
      });
    }

    // Step 4: Generate audio for each article sequentially
    const results: { id: string; title: string; status: string; error?: string }[] = [];

    for (const article of batch) {
      try {
        const res = await fetch(`${siteUrl}/api/tts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ articleId: article.id }),
        });

        const data = await res.json();
        if (res.ok) {
          results.push({ id: article.id, title: article.title, status: 'success' });
        } else {
          results.push({
            id: article.id,
            title: article.title,
            status: 'error',
            error: data.error || 'Unknown error',
          });
        }
      } catch (err: any) {
        results.push({
          id: article.id,
          title: article.title,
          status: 'error',
          error: err.message || 'Request failed',
        });
      }

      // Small delay between generations
      await new Promise((r) => setTimeout(r, 500));
    }

    const succeeded = results.filter((r) => r.status === 'success').length;
    const failed = results.filter((r) => r.status === 'error').length;

    return NextResponse.json({
      success: true,
      message: `Generated ${succeeded} audio files (${failed} failed). ${missingAudio.length - batch.length} still remaining.`,
      processed: batch.length,
      succeeded,
      failed,
      totalMissing: missingAudio.length,
      remaining: missingAudio.length - batch.length,
      results,
    });
  } catch (err: any) {
    console.error('Bulk TTS error:', err);
    return NextResponse.json({ error: err.message || 'Bulk TTS failed' }, { status: 500 });
  }
}
