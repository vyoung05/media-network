import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/api-auth';
import { searchMedia } from '@/lib/media-search';

export async function POST(request: NextRequest) {
  try {
    // Auth check — same pattern as other routes
    const auth = await validateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const { query, newsUrl, type } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const validTypes = ['images', 'videos', 'all'];
    const searchType = validTypes.includes(type) ? type : 'all';

    const result = await searchMedia({
      query,
      newsUrl: newsUrl || undefined,
      type: searchType,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error('Media search error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to search media' },
      { status: 500 }
    );
  }
}
