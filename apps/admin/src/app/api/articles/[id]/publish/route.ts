import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient, updateArticleStatus, getArticleById, updateArticle, BRAND_CONFIGS } from '@media-network/shared';
import type { Brand } from '@media-network/shared';

const BRAND_DOMAINS: Record<Brand, string> = {
  saucewire: 'https://saucewire.com',
  saucecaviar: 'https://saucecaviar.com',
  trapglow: 'https://trapglow.com',
  trapfrequency: 'https://trapfrequency.com',
};

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const article = await updateArticleStatus(supabase, params.id, 'published');

    // Generate and store OG image URL
    try {
      const fullArticle = await getArticleById(supabase, params.id);
      if (fullArticle) {
        const brandDomain = BRAND_DOMAINS[fullArticle.brand] || BRAND_DOMAINS.saucewire;
        const ogParams = new URLSearchParams({
          title: fullArticle.title,
          ...(fullArticle.category && { category: fullArticle.category }),
          ...(fullArticle.author?.name && { author: fullArticle.author.name }),
          ...(fullArticle.cover_image && { image: fullArticle.cover_image }),
        });
        const ogImageUrl = `${brandDomain}/api/og?${ogParams.toString()}`;

        const existingMetadata = fullArticle.metadata || {};
        await updateArticle(supabase, params.id, {
          metadata: { ...existingMetadata, og_image_url: ogImageUrl },
        } as any);
      }
    } catch (ogErr) {
      console.error('OG image URL storage failed (non-blocking):', ogErr);
    }

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
