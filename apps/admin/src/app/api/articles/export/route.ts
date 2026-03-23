import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

function escapeCSV(val: string): string {
  if (!val) return '';
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const status = searchParams.get('status');

    let query = supabase
      .from('articles')
      .select('id, title, slug, brand, category, status, is_ai_generated, author_id, view_count, reading_time_minutes, source_url, created_at, published_at, tags')
      .order('created_at', { ascending: false });

    if (brand && brand !== 'all') query = query.eq('brand', brand);
    if (status && status !== 'all') query = query.eq('status', status);

    const { data: articles, error } = await query;
    if (error) throw error;

    // Build CSV
    const headers = ['ID', 'Title', 'Brand', 'Category', 'Status', 'AI Generated', 'Views', 'Reading Time (min)', 'Source URL', 'Tags', 'Created', 'Published'];
    const rows = (articles || []).map((a: any) => [
      a.id,
      escapeCSV(a.title),
      a.brand,
      a.category,
      a.status,
      a.is_ai_generated ? 'Yes' : 'No',
      a.view_count || 0,
      a.reading_time_minutes || 0,
      a.source_url || '',
      (a.tags || []).join('; '),
      a.created_at ? new Date(a.created_at).toLocaleDateString() : '',
      a.published_at ? new Date(a.published_at).toLocaleDateString() : '',
    ]);

    const csv = [headers.join(','), ...rows.map((r: any[]) => r.join(','))].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="articles-export-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
