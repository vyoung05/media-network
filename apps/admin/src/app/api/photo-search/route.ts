import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/api-auth';
import {
  searchWikimediaCommons,
  searchWikipediaImage,
  searchMedia,
  type WikimediaImage,
  type MediaSearchResult,
} from '@/lib/media-search';

export interface PhotoSearchResponse {
  wikimediaImages: WikimediaImage[];
  wikipediaImage: { url: string; title: string } | null;
  stockImages: { url: string; credit: string }[];
  aiImages: { url: string; prompt: string }[];
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const auth = await validateRequest(request);
    if (!auth.authenticated) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const { query, type } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    // Run all image searches in parallel
    const [wikimediaImages, wikipediaImage, mediaResult] = await Promise.all([
      searchWikimediaCommons(query),
      searchWikipediaImage(query),
      searchMedia({ query, type: 'images' }),
    ]);

    const response: PhotoSearchResponse = {
      wikimediaImages,
      wikipediaImage,
      stockImages: mediaResult.stockImages,
      aiImages: mediaResult.aiImages,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error('Photo search error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to search photos' },
      { status: 500 }
    );
  }
}
