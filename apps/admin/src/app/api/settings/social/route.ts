import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';
import type { Brand, SocialPlatform } from '@media-network/shared';

// GET /api/settings/social?brand=saucewire
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const brand = request.nextUrl.searchParams.get('brand') as Brand | null;

    let query = supabase.from('social_media_settings').select('*');
    if (brand) query = query.eq('brand', brand);

    const { data, error } = await query.order('platform');
    if (error) throw error;

    return NextResponse.json({ data: data || [] });
  } catch (error: any) {
    console.error('Error fetching social settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch social settings' },
      { status: 500 }
    );
  }
}

// POST /api/settings/social — upsert social media settings
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();

    const {
      brand,
      platform,
      enabled,
      credentials,
      auto_share_on_publish,
      default_template,
      default_hashtags,
    } = body as {
      brand: Brand;
      platform: SocialPlatform;
      enabled?: boolean;
      credentials?: Record<string, string>;
      auto_share_on_publish?: boolean;
      default_template?: string;
      default_hashtags?: string[];
    };

    if (!brand || !platform) {
      return NextResponse.json(
        { error: 'brand and platform are required' },
        { status: 400 }
      );
    }

    const record: Record<string, unknown> = {
      brand,
      platform,
      updated_at: new Date().toISOString(),
    };

    if (enabled !== undefined) record.enabled = enabled;
    if (credentials !== undefined) record.credentials = credentials;
    if (auto_share_on_publish !== undefined) record.auto_share_on_publish = auto_share_on_publish;
    if (default_template !== undefined) record.default_template = default_template;
    if (default_hashtags !== undefined) record.default_hashtags = default_hashtags;

    const { data, error } = await supabase
      .from('social_media_settings')
      .upsert(record, { onConflict: 'brand,platform' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Error saving social settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save social settings' },
      { status: 500 }
    );
  }
}
