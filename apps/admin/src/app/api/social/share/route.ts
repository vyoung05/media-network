import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient, getArticleById, BRAND_CONFIGS } from '@media-network/shared';
import type { Brand, SocialPlatform, SocialMediaSettings } from '@media-network/shared';

const BRAND_DOMAINS: Record<Brand, string> = {
  saucewire: 'https://saucewire.com',
  saucecaviar: 'https://saucecaviar.com',
  trapglow: 'https://trapglow.com',
  trapfrequency: 'https://trapfrequency.com',
};

// Fill template variables
function fillTemplate(
  template: string,
  article: { title: string; excerpt: string | null; brand: Brand; author?: { name: string } | null },
  url: string
): string {
  const brandConfig = BRAND_CONFIGS[article.brand];
  return template
    .replace(/\{title\}/g, article.title)
    .replace(/\{excerpt\}/g, article.excerpt || '')
    .replace(/\{url\}/g, url)
    .replace(/\{brand\}/g, brandConfig.name)
    .replace(/\{author\}/g, article.author?.name || 'Staff');
}

// Placeholder social posting functions — ready for real API integrations
async function postToTwitter(text: string, _credentials: Record<string, string>): Promise<{ success: boolean; post_url?: string; error?: string }> {
  console.log('[Social] Twitter post (placeholder):', text.substring(0, 100));
  // TODO: Integrate with Twitter API v2
  // const client = new TwitterApi({ appKey, appSecret, accessToken, accessSecret });
  // const tweet = await client.v2.tweet(text);
  return { success: true, post_url: `https://twitter.com/i/status/placeholder_${Date.now()}` };
}

async function postToFacebook(text: string, _credentials: Record<string, string>): Promise<{ success: boolean; post_url?: string; error?: string }> {
  console.log('[Social] Facebook post (placeholder):', text.substring(0, 100));
  // TODO: Integrate with Facebook Graph API
  return { success: true, post_url: `https://facebook.com/post/placeholder_${Date.now()}` };
}

async function postToInstagram(text: string, _credentials: Record<string, string>): Promise<{ success: boolean; post_url?: string; error?: string }> {
  console.log('[Social] Instagram post (placeholder):', text.substring(0, 100));
  // TODO: Integrate with Instagram Graph API (requires image)
  return { success: true, post_url: `https://instagram.com/p/placeholder_${Date.now()}` };
}

async function postToTikTok(text: string, _credentials: Record<string, string>): Promise<{ success: boolean; post_url?: string; error?: string }> {
  console.log('[Social] TikTok post (placeholder):', text.substring(0, 100));
  // TODO: Integrate with TikTok Content Posting API
  return { success: true };
}

async function postToLinkedIn(text: string, _credentials: Record<string, string>): Promise<{ success: boolean; post_url?: string; error?: string }> {
  console.log('[Social] LinkedIn post (placeholder):', text.substring(0, 100));
  // TODO: Integrate with LinkedIn Marketing API
  return { success: true, post_url: `https://linkedin.com/feed/update/placeholder_${Date.now()}` };
}

const PLATFORM_POSTERS: Record<SocialPlatform, (text: string, creds: Record<string, string>) => Promise<{ success: boolean; post_url?: string; error?: string }>> = {
  twitter: postToTwitter,
  facebook: postToFacebook,
  instagram: postToInstagram,
  tiktok: postToTikTok,
  linkedin: postToLinkedIn,
};

// POST /api/social/share — Share an article to selected platforms
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const { article_id, platforms, brand, custom_text } = await request.json() as {
      article_id: string;
      platforms: SocialPlatform[];
      brand: Brand;
      custom_text?: string;
    };

    if (!article_id || !platforms?.length || !brand) {
      return NextResponse.json(
        { error: 'article_id, platforms, and brand are required' },
        { status: 400 }
      );
    }

    // Get article
    const article = await getArticleById(supabase, article_id);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Get social settings for each platform
    const { data: settings } = await supabase
      .from('social_media_settings')
      .select('*')
      .eq('brand', brand)
      .in('platform', platforms);

    const settingsMap = new Map<string, SocialMediaSettings>();
    (settings || []).forEach((s: SocialMediaSettings) => settingsMap.set(s.platform, s));

    const articleUrl = `${BRAND_DOMAINS[brand]}/${article.slug}`;
    const results: Array<{ platform: SocialPlatform; status: string; post_url?: string; error?: string }> = [];

    for (const platform of platforms) {
      const platformSettings = settingsMap.get(platform);
      const template = custom_text || platformSettings?.default_template || '{title} {url}';
      let postText = fillTemplate(template, article, articleUrl);

      // Append hashtags
      if (platformSettings?.default_hashtags?.length) {
        const hashtags = platformSettings.default_hashtags.map(h => h.startsWith('#') ? h : `#${h}`).join(' ');
        postText = `${postText}\n\n${hashtags}`;
      }

      // Enforce character limits
      if (platform === 'twitter' && postText.length > 280) {
        postText = postText.substring(0, 277) + '...';
      }

      try {
        const poster = PLATFORM_POSTERS[platform];
        const result = await poster(postText, platformSettings?.credentials || {});

        // Log to share log
        await supabase.from('social_share_log').insert({
          article_id,
          platform,
          brand,
          status: result.success ? 'success' : 'failed',
          post_url: result.post_url || null,
          error_message: result.error || null,
        });

        results.push({
          platform,
          status: result.success ? 'success' : 'failed',
          post_url: result.post_url,
          error: result.error,
        });
      } catch (err: any) {
        await supabase.from('social_share_log').insert({
          article_id,
          platform,
          brand,
          status: 'failed',
          error_message: err.message,
        });

        results.push({
          platform,
          status: 'failed',
          error: err.message,
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('Error sharing to social:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to share' },
      { status: 500 }
    );
  }
}
