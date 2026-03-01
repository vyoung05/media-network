import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';
import { createArticle } from '@media-network/shared';
import { slugify, estimateReadingTime } from '@media-network/shared';
import type { Brand, ArticleStatus } from '@media-network/shared';

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const body = await request.json();

    const {
      title,
      body: articleBody,
      excerpt,
      brand,
      category,
      tags = [],
      cover_image,
      author_id,
      status = 'draft' as ArticleStatus,
      is_breaking = false,
      is_ai_generated = false,
      source_url,
      metadata = {},
      scheduled_publish_at,
    } = body;

    if (!title || !articleBody || !brand || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, body, brand, category' },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const reading_time_minutes = estimateReadingTime(articleBody);

    // Insert directly to include metadata column
    const insertData: Record<string, any> = {
      title,
      slug,
      body: articleBody,
      excerpt: excerpt || null,
      cover_image: cover_image || null,
      brand: brand as Brand,
      category,
      tags,
      author_id: author_id || null,
      status,
      is_breaking,
      is_ai_generated,
      source_url: source_url || null,
      reading_time_minutes,
      published_at: status === 'published' ? new Date().toISOString() : null,
      metadata,
    };

    // Add scheduled_publish_at if provided
    if (scheduled_publish_at) {
      insertData.scheduled_publish_at = scheduled_publish_at;
    }

    const { data: article, error: insertError } = await supabase
      .from('articles')
      .insert(insertData)
      .select('*, author:users!author_id(*)')
      .single();

    if (insertError) throw insertError;

    return NextResponse.json(article, { status: 201 });
  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create article' },
      { status: 500 }
    );
  }
}
