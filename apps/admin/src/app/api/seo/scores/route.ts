import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@media-network/shared';

function calculateSEOScore(article: any): { score: number; rules: any[] } {
  const rules: any[] = [];
  let passed = 0;
  const total = 9;

  const title = article.seo_title || article.title || '';
  const description = article.seo_description || article.excerpt || '';
  const keyword = (article.focus_keyword || '').toLowerCase();
  const body = article.body || '';
  const slug = article.slug || '';

  // 1. Title length 50-60 chars
  const titleLen = title.length;
  const titleOk = titleLen >= 50 && titleLen <= 60;
  rules.push({
    id: 'title_length',
    label: 'Title length (50-60 chars)',
    passed: titleOk,
    suggestion: titleOk ? 'Great title length!' : `Title is ${titleLen} chars. Aim for 50-60.`,
  });
  if (titleOk) passed++;

  // 2. Meta description 120-160 chars
  const descLen = description.length;
  const descOk = descLen >= 120 && descLen <= 160;
  rules.push({
    id: 'meta_description',
    label: 'Meta description (120-160 chars)',
    passed: descOk,
    suggestion: descOk ? 'Perfect description length!' : `Description is ${descLen} chars. Aim for 120-160.`,
  });
  if (descOk) passed++;

  // 3. Focus keyword in title
  const kwInTitle = keyword && title.toLowerCase().includes(keyword);
  rules.push({
    id: 'keyword_in_title',
    label: 'Focus keyword in title',
    passed: !!kwInTitle,
    suggestion: kwInTitle ? 'Keyword found in title!' : keyword ? 'Add your focus keyword to the title.' : 'Set a focus keyword first.',
  });
  if (kwInTitle) passed++;

  // 4. Focus keyword in first paragraph
  const firstPara = body.split('\n').find((p: string) => p.trim().length > 0) || '';
  const kwInFirst = keyword && firstPara.toLowerCase().includes(keyword);
  rules.push({
    id: 'keyword_in_first_para',
    label: 'Focus keyword in first paragraph',
    passed: !!kwInFirst,
    suggestion: kwInFirst ? 'Keyword in opening paragraph!' : 'Include focus keyword in the first paragraph.',
  });
  if (kwInFirst) passed++;

  // 5. Focus keyword in meta description
  const kwInDesc = keyword && description.toLowerCase().includes(keyword);
  rules.push({
    id: 'keyword_in_description',
    label: 'Focus keyword in meta description',
    passed: !!kwInDesc,
    suggestion: kwInDesc ? 'Keyword in description!' : 'Add focus keyword to meta description.',
  });
  if (kwInDesc) passed++;

  // 6. Content length > 300 words
  const wordCount = body.trim().split(/\s+/).length;
  const longEnough = wordCount > 300;
  rules.push({
    id: 'content_length',
    label: 'Content length > 300 words',
    passed: longEnough,
    suggestion: longEnough ? `${wordCount} words — good length!` : `Only ${wordCount} words. Aim for at least 300.`,
  });
  if (longEnough) passed++;

  // 7. Has image with alt text
  const hasImage = !!article.cover_image;
  rules.push({
    id: 'has_image',
    label: 'Has image (cover image)',
    passed: hasImage,
    suggestion: hasImage ? 'Cover image set!' : 'Add a cover image for better SEO.',
  });
  if (hasImage) passed++;

  // 8. Has internal links
  const hasLinks = body.includes('href=') || body.includes('[') || body.includes('<a ');
  rules.push({
    id: 'has_links',
    label: 'Has internal links',
    passed: hasLinks,
    suggestion: hasLinks ? 'Links found in content!' : 'Add links to other articles.',
  });
  if (hasLinks) passed++;

  // 9. Readable URL slug
  const slugOk = slug.length > 0 && slug.length < 80 && /^[a-z0-9-]+$/.test(slug);
  rules.push({
    id: 'readable_slug',
    label: 'Readable URL slug',
    passed: slugOk,
    suggestion: slugOk ? 'Clean URL slug!' : 'Keep slug short, lowercase, with hyphens.',
  });
  if (slugOk) passed++;

  const score = Math.round((passed / total) * 100);

  return { score, rules };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');

    let query = supabase
      .from('articles')
      .select('id, title, slug, excerpt, body, cover_image, brand, status, seo_title, seo_description, focus_keyword, seo_score, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (brand) query = query.eq('brand', brand);

    const { data: articles, error } = await query;
    if (error) throw error;

    const scored = (articles || []).map((article) => {
      const { score, rules } = calculateSEOScore(article);

      // Update seo_score in database (fire-and-forget)
      if (article.seo_score !== score) {
        supabase
          .from('articles')
          .update({ seo_score: score })
          .eq('id', article.id)
          .then(() => {});
      }

      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        brand: article.brand,
        seo_title: article.seo_title,
        seo_description: article.seo_description,
        focus_keyword: article.focus_keyword,
        seo_score: score,
        rules,
        published_at: article.published_at,
      };
    });

    // Sort by score ascending (worst first)
    scored.sort((a, b) => a.seo_score - b.seo_score);

    const avgScore = scored.length > 0
      ? Math.round(scored.reduce((sum, a) => sum + a.seo_score, 0) / scored.length)
      : 0;

    return NextResponse.json({
      articles: scored,
      average_score: avgScore,
      total: scored.length,
      needs_improvement: scored.filter(a => a.seo_score < 60).length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
