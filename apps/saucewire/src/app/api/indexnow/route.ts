import { NextRequest, NextResponse } from 'next/server';

const INDEXNOW_KEY = 'd88f55b19eb06b56374d66c4e0b9aa10';
const SITE_URL = 'https://saucewire.com';

/**
 * POST /api/indexnow
 * Body: { urls: string[] }
 * Pings Bing/Yandex/IndexNow to instantly index new or updated URLs.
 * Called after publishing an article.
 */
export async function POST(req: NextRequest) {
  try {
    const { urls } = await req.json();

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'urls array required' }, { status: 400 });
    }

    // IndexNow API — notifies Bing, Yandex, Seznam, Naver simultaneously
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'saucewire.com',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.map((u: string) => (u.startsWith('http') ? u : `${SITE_URL}${u}`)),
      }),
    });

    return NextResponse.json({
      success: true,
      status: response.status,
      submitted: urls.length,
    });
  } catch (error) {
    console.error('IndexNow error:', error);
    return NextResponse.json({ error: 'IndexNow submission failed' }, { status: 500 });
  }
}
