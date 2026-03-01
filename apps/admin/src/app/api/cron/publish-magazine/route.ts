import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Cron: check for magazine issues scheduled to publish
// Runs every 5 minutes via Vercel Cron
export async function GET() {
  try {
    const supabase = getSupabaseService();
    const now = new Date().toISOString();

    // Find draft issues with scheduled_publish_at <= now
    const { data: issues, error } = await supabase
      .from('magazine_issues')
      .select('id, title, slug, issue_number')
      .eq('status', 'draft')
      .lte('scheduled_publish_at', now)
      .not('scheduled_publish_at', 'is', null);

    if (error) throw error;

    if (!issues || issues.length === 0) {
      return NextResponse.json({ published: 0, message: 'No issues to publish' });
    }

    const results = [];

    for (const issue of issues) {
      // Publish the issue
      const { error: updateError } = await supabase
        .from('magazine_issues')
        .update({
          status: 'published',
          published_at: now,
        })
        .eq('id', issue.id);

      if (updateError) {
        results.push({ id: issue.id, title: issue.title, error: updateError.message });
        continue;
      }

      // Create notification
      await supabase.from('notifications').insert({
        type: 'publish',
        title: `📰 Magazine Issue #${issue.issue_number} Published`,
        message: `"${issue.title}" was auto-published on schedule.`,
        link: `/dashboard/magazine/${issue.id}/edit`,
        brand: 'saucecaviar',
        read: false,
      });

      results.push({ id: issue.id, title: issue.title, status: 'published' });
    }

    return NextResponse.json({
      published: results.filter((r) => !('error' in r)).length,
      results,
    });
  } catch (err: any) {
    console.error('Magazine cron error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
