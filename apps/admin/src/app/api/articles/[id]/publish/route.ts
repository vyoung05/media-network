import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient, updateArticleStatus } from '@media-network/shared';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const article = await updateArticleStatus(supabase, params.id, 'published');

    // Fire-and-forget TTS generation (don't block the publish response)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://media-network-admin.vercel.app';
    fetch(`${siteUrl}/api/tts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId: params.id }),
    }).catch((err) => console.error('TTS trigger failed:', err));

    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Error publishing article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to publish article' },
      { status: 500 }
    );
  }
}
