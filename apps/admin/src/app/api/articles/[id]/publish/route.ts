import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient, updateArticleStatus, getArticleById, updateArticle, BRAND_CONFIGS } from '@media-network/shared';
import type { Brand, SocialPlatform } from '@media-network/shared';

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

    // Parse optional cross-posting and sharing options from body
    let crossPostBrands: Brand[] = [];
    let sharePlatforms: SocialPlatform[] = [];
    try {
      const body = await request.json();
      crossPostBrands = body.cross_post_to || [];
      sharePlatforms = body.share_to || [];
    } catch {
      // No body or invalid JSON — just publish without extras
    }

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

    // ==================== NEWSLETTER AUTO-TRIGGER ====================
    try {
      const nlArticle = await getArticleById(supabase, params.id);
      if (nlArticle) {
        const { data: nlSettings } = await supabase
          .from('newsletter_settings')
          .select('*')
          .eq('brand', nlArticle.brand)
          .eq('auto_send_on_publish', true)
          .single();

        if (nlSettings?.enabled) {
          // Create a campaign for this article
          const { data: campaign } = await supabase
            .from('newsletter_campaigns')
            .insert({
              brand: nlArticle.brand,
              subject: `New: ${nlArticle.title}`,
              article_ids: [params.id],
              status: 'draft',
            })
            .select()
            .single();

          if (campaign) {
            fetch(`${siteUrl}/api/newsletter/campaigns/${campaign.id}/send`, {
              method: 'POST',
            }).catch((err) => console.error('Newsletter send failed:', err));
          }
        }
      }
    } catch (nlErr) {
      console.error('Newsletter auto-trigger failed (non-blocking):', nlErr);
    }

    // ==================== CROSS-POSTING ====================
    if (crossPostBrands.length > 0) {
      try {
        const fullArticle = await getArticleById(supabase, params.id);
        if (fullArticle) {
          const crossPostedIds: string[] = [];

          for (const targetBrand of crossPostBrands) {
            if (targetBrand === fullArticle.brand) continue; // skip same brand

            const targetConfig = BRAND_CONFIGS[targetBrand];
            // Pick the first category from target brand that exists, or default
            const targetCategory = targetConfig.categories[0] || fullArticle.category;

            const { data: crossPost, error: crossErr } = await supabase
              .from('articles')
              .insert({
                title: fullArticle.title,
                slug: `${fullArticle.slug}-x-${targetBrand}`,
                body: fullArticle.body,
                excerpt: fullArticle.excerpt,
                cover_image: fullArticle.cover_image,
                brand: targetBrand,
                category: targetCategory,
                tags: [...(fullArticle.tags || []), 'cross-posted'],
                author_id: fullArticle.author_id,
                status: 'published',
                is_breaking: false,
                is_ai_generated: fullArticle.is_ai_generated,
                source_url: fullArticle.source_url,
                reading_time_minutes: fullArticle.reading_time_minutes,
                metadata: {
                  ...(fullArticle.metadata || {}),
                  cross_posted_from_brand: fullArticle.brand,
                  cross_posted_from_title: fullArticle.title,
                },
                cross_posted_from: fullArticle.id,
                published_at: new Date().toISOString(),
              })
              .select('id')
              .single();

            if (crossErr) {
              console.error(`Cross-post to ${targetBrand} failed:`, crossErr);
            } else if (crossPost) {
              crossPostedIds.push(crossPost.id);
            }
          }

          // Update original article with cross_posted_to array
          if (crossPostedIds.length > 0) {
            await supabase
              .from('articles')
              .update({ cross_posted_to: crossPostedIds })
              .eq('id', params.id);
          }
        }
      } catch (crossErr) {
        console.error('Cross-posting failed (non-blocking):', crossErr);
      }
    }

    // ==================== AUTO-SHARE TO SOCIAL ====================
    // Check for auto-share settings + manual share requests
    try {
      const fullArticle = await getArticleById(supabase, params.id);
      if (fullArticle) {
        // Get all auto-share-enabled platforms for this brand
        const { data: autoShareSettings } = await supabase
          .from('social_media_settings')
          .select('platform')
          .eq('brand', fullArticle.brand)
          .eq('enabled', true)
          .eq('auto_share_on_publish', true);

        const autoSharePlatforms = (autoShareSettings || []).map((s: { platform: string }) => s.platform as SocialPlatform);

        // Merge with manually selected platforms (dedup)
        const allPlatforms = [...new Set([...autoSharePlatforms, ...sharePlatforms])];

        if (allPlatforms.length > 0) {
          // Fire-and-forget social sharing
          fetch(`${siteUrl}/api/social/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              article_id: params.id,
              platforms: allPlatforms,
              brand: fullArticle.brand,
            }),
          }).catch((err) => console.error('Social share trigger failed:', err));
        }
      }
    } catch (shareErr) {
      console.error('Auto-share check failed (non-blocking):', shareErr);
    }

    return NextResponse.json(article);
  } catch (error: any) {
    console.error('Error publishing article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to publish article' },
      { status: 500 }
    );
  }
}
