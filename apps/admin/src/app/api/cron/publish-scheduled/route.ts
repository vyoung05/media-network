import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel Cron sets this header)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = getSupabaseService();
    const now = new Date().toISOString();

    // Find articles that are pending and scheduled to publish now or in the past
    const { data: articles, error: fetchError } = await supabase
      .from('articles')
      .select('id, title, brand')
      .eq('status', 'pending_review')
      .not('scheduled_publish_at', 'is', null)
      .lte('scheduled_publish_at', now);

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!articles || articles.length === 0) {
      return NextResponse.json({ message: 'No articles to publish', published: 0 });
    }

    const published: string[] = [];
    const failed: string[] = [];

    for (const article of articles) {
      // Update status to published
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          status: 'published',
          published_at: now,
        })
        .eq('id', article.id);

      if (updateError) {
        failed.push(article.id);
        continue;
      }

      published.push(article.id);

      // Fire-and-forget TTS generation
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://media-network-admin.vercel.app';
      fetch(`${siteUrl}/api/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id }),
      }).catch((err) => console.error(`TTS trigger failed for ${article.id}:`, err));

      // Create notification
      await supabase.from('notifications').insert({
        type: 'publish',
        title: 'Scheduled Article Published',
        message: `"${article.title}" was auto-published on schedule`,
        brand: article.brand,
        read: false,
      }).catch(() => {});
    }

    return NextResponse.json({
      message: `Published ${published.length} article(s)`,
      published: published.length,
      failed: failed.length,
      publishedIds: published,
      failedIds: failed,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 });
  }
}
