import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ======================== TYPES ========================

interface FeedItem {
  id: string;
  source: string;
  title: string;
  link: string;
  pubDate: string;
  category: string;
  brandAffinity?: string[];
}

interface GenerationResult {
  brand: string;
  title: string;
  sourceTitle: string;
  status: 'success' | 'skipped' | 'error';
  articleId?: string;
  reason?: string;
}

// ======================== BRAND CONFIG ========================

const BRAND_NAMES: Record<string, string> = {
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  saucewire: 'SauceWire',
  trapfrequency: 'TrapFrequency',
};

// Each brand's valid categories (must match what the sites actually display)
const BRAND_CATEGORIES: Record<string, string[]> = {
  saucecaviar: ['Fashion', 'Music', 'Art', 'Culture', 'Lifestyle'],
  trapglow: ['Hip-Hop', 'R&B', 'Pop', 'Electronic', 'Alternative', 'Latin'],
  saucewire: ['Music', 'Fashion', 'Entertainment', 'Sports', 'Tech', 'Gaming'],
  trapfrequency: ['Tutorials', 'Beats', 'Gear', 'DAW Tips', 'Samples', 'Interviews'],
};

// Map generic news categories to each brand's specific category
const CATEGORY_MAPPING: Record<string, Record<string, string>> = {
  saucecaviar: {
    Music: 'Music',
    Celebrity: 'Culture',
    Entertainment: 'Culture',
    Fashion: 'Fashion',
    Culture: 'Culture',
    Art: 'Art',
    Lifestyle: 'Lifestyle',
    Sports: 'Culture', // SauceCaviar covers sports as lifestyle/culture
    'Hip-Hop': 'Music',
    'R&B': 'Music',
    Tech: 'Culture',
    Production: 'Music',
  },
  trapglow: {
    Music: 'Hip-Hop',
    'Hip-Hop': 'Hip-Hop',
    'R&B': 'R&B',
    Celebrity: 'Hip-Hop',
    Entertainment: 'Hip-Hop',
    Electronic: 'Electronic',
    Pop: 'Pop',
    Latin: 'Latin',
    Culture: 'Hip-Hop',
    Fashion: 'Hip-Hop',
    Sports: 'Hip-Hop', // TrapGlow only covers sports with music angle
  },
  saucewire: {
    Music: 'Music',
    Sports: 'Sports',
    Entertainment: 'Entertainment',
    Celebrity: 'Entertainment',
    Fashion: 'Fashion',
    Tech: 'Tech',
    Gaming: 'Gaming',
    Culture: 'Entertainment',
    'Hip-Hop': 'Music',
    'R&B': 'Music',
    Art: 'Entertainment',
    Lifestyle: 'Entertainment',
    Production: 'Tech',
  },
  trapfrequency: {
    Production: 'Tutorials',
    Gear: 'Gear',
    Tutorials: 'Tutorials',
    Tech: 'Gear',
    Music: 'Beats',
    'Hip-Hop': 'Beats',
    'R&B': 'Beats',
    Samples: 'Samples',
    'DAW Tips': 'DAW Tips',
    Entertainment: 'Interviews',
    Celebrity: 'Interviews',
  },
};

// ======================== HELPERS ========================

// Words to ignore for fuzzy title matching (articles, prepositions, conjunctions)
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'up', 'about', 'into', 'over', 'after',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
  'it', 'its', 'this', 'that', 'these', 'those', 'not', 'no', 'just',
  'also', 'than', 'then', 'so', 'if', 'as', 'what', 'how', 'who', 'when',
]);

function getSignificantWords(title: string, count = 5): string[] {
  return title
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
    .slice(0, count);
}

function similarTitle(a: string, b: string): boolean {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 3);
  const wordsA = normalize(a);
  const wordsB = new Set(normalize(b));
  if (wordsA.length === 0) return false;
  const overlap = wordsA.filter(w => wordsB.has(w)).length;
  return overlap / wordsA.length > 0.6;
}

function fuzzyTitleMatch(a: string, b: string): boolean {
  // Check first 5 significant words overlap
  const sigA = getSignificantWords(a, 5);
  const sigB = getSignificantWords(b, 5);
  if (sigA.length === 0 || sigB.length === 0) return false;
  const sigBSet = new Set(sigB);
  const overlap = sigA.filter(w => sigBSet.has(w)).length;
  // If 3+ of the first 5 significant words match, it's likely the same story
  return overlap >= 3;
}

function mapCategoryForBrand(brand: string, feedCategory: string): string {
  const mapping = CATEGORY_MAPPING[brand];
  if (!mapping) return feedCategory;
  return mapping[feedCategory] || BRAND_CATEGORIES[brand]?.[0] || feedCategory;
}

async function fetchNewsFeed(baseUrl: string): Promise<FeedItem[]> {
  try {
    const res = await fetch(`${baseUrl}/api/news-feed`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`News feed returned ${res.status}`);
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error('Failed to fetch news feed:', err);
    return [];
  }
}

// ======================== ROUTE HANDLER ========================

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      brand: targetBrand,
      count = 5,
      brands: targetBrands,
      apiKey,
      aiProvider,
    } = body as {
      brand?: string;
      count?: number;
      brands?: string[];
      apiKey?: string;
      aiProvider?: 'gemini' | 'openai' | 'anthropic';
    };

    const brandsToProcess = targetBrand
      ? [targetBrand]
      : targetBrands?.length
      ? targetBrands
      : Object.keys(BRAND_NAMES);

    for (const b of brandsToProcess) {
      if (!BRAND_NAMES[b]) {
        return NextResponse.json({ error: `Invalid brand: ${b}` }, { status: 400 });
      }
    }

    // Check that at least one key source is available (BYOK or server)
    const provider = aiProvider || 'openai';
    const hasKey = apiKey ||
      (provider === 'gemini' && process.env.GEMINI_API_KEY) ||
      (provider === 'openai' && process.env.OPENAI_API_KEY) ||
      (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY);

    if (!hasKey) {
      return NextResponse.json({
        error: `No API key available for ${provider}. Provide your own key in Settings → AI API Key.`,
      }, { status: 503 });
    }

    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    const newsItems = await fetchNewsFeed(baseUrl);
    if (newsItems.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No news items available',
        results: [],
        summary: { total: 0, success: 0, skipped: 0, errors: 0 },
      });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Dedup window: 3 days — balances freshness vs avoiding repeats
    const { data: recentArticles } = await supabase
      .from('articles')
      .select('title, brand, source_url')
      .gte('created_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(200);

    const existingTitles: Array<{ title: string; brand: string; source_url?: string | null }> = recentArticles || [];

    // Build a map of already-used source URLs PER BRAND (not cross-brand)
    // Different brands SHOULD cover the same story with their own angle
    const usedSourceUrlsByBrand = new Map<string, Set<string>>();
    for (const a of existingTitles) {
      if (!a.source_url) continue;
      const brandSet = usedSourceUrlsByBrand.get(a.brand) || new Set<string>();
      brandSet.add(a.source_url.toLowerCase().trim());
      usedSourceUrlsByBrand.set(a.brand, brandSet);
    }

    const results: GenerationResult[] = [];
    const articlesPerBrand = Math.min(count, 10);

    for (const brand of brandsToProcess) {
      // Filter news items by brand affinity from the feed
      // Items now carry brandAffinity[] from smart topic detection
      const relevantItems = newsItems
        .filter(item => {
          // If item has brandAffinity, check if this brand is in it
          if (item.brandAffinity && item.brandAffinity.length > 0) {
            return item.brandAffinity.includes(brand);
          }
          // Fallback: use old category-based matching
          return true;
        })
        .slice(0, articlesPerBrand * 3); // Get extra to account for duplicates/skips

      let generated = 0;

      for (const item of relevantItems) {
        if (generated >= articlesPerBrand) break;

        // Check for duplicates — per-brand source URL + fuzzy title matching
        // 1. Same-brand source URL match (different brands CAN cover same source)
        const brandUrls = usedSourceUrlsByBrand.get(brand) || new Set<string>();
        const urlDuplicate = item.link && brandUrls.has(item.link.toLowerCase().trim());
        if (urlDuplicate) {
          results.push({
            brand,
            title: '',
            sourceTitle: item.title,
            status: 'skipped',
            reason: 'Source URL already used by this brand',
          });
          continue;
        }

        // 2. Same-brand title similarity
        const titleDuplicate = existingTitles.some(
          existing => existing.brand === brand && similarTitle(existing.title, item.title)
        );

        if (titleDuplicate) {
          results.push({
            brand,
            title: '',
            sourceTitle: item.title,
            status: 'skipped',
            reason: 'Duplicate or similar article already exists for this brand',
          });
          continue;
        }

        // 3. Same-brand fuzzy title match (first 5 significant words)
        const fuzzyDuplicate = existingTitles.some(
          existing => existing.brand === brand && fuzzyTitleMatch(existing.title, item.title)
        );

        if (fuzzyDuplicate) {
          results.push({
            brand,
            title: '',
            sourceTitle: item.title,
            status: 'skipped',
            reason: 'Similar story already covered by this brand',
          });
          continue;
        }

        // Map the feed category to this brand's specific category
        const brandCategory = mapCategoryForBrand(brand, item.category);

        try {
          const genRes = await fetch(`${baseUrl}/api/generate-article`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              newsUrl: item.link,
              newsTitle: item.title,
              newsSource: item.source,
              brand,
              category: brandCategory,
              // Pass through BYOK key and provider
              ...(apiKey ? { apiKey } : {}),
              ...(aiProvider ? { aiProvider } : {}),
            }),
          });

          const genData = await genRes.json();

          if (genRes.ok && genData.success) {
            results.push({
              brand,
              title: genData.article.title,
              sourceTitle: item.title,
              status: 'success',
              articleId: genData.article.id,
            });

            existingTitles.push({ title: genData.article.title, brand, source_url: item.link });
            if (item.link) {
              const brandSet = usedSourceUrlsByBrand.get(brand) || new Set<string>();
              brandSet.add(item.link.toLowerCase().trim());
              usedSourceUrlsByBrand.set(brand, brandSet);
            }
            generated++;
          } else {
            results.push({
              brand,
              title: '',
              sourceTitle: item.title,
              status: 'error',
              reason: genData.error || 'Generation failed',
            });
          }
        } catch (err) {
          results.push({
            brand,
            title: '',
            sourceTitle: item.title,
            status: 'error',
            reason: err instanceof Error ? err.message : 'Unknown error',
          });
        }

        // Small delay between generations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (generated === 0 && relevantItems.length === 0) {
        results.push({
          brand,
          title: '',
          sourceTitle: '',
          status: 'skipped',
          reason: `No relevant news items for ${BRAND_NAMES[brand]}`,
        });
      }
    }

    const summary = {
      total: results.length,
      success: results.filter(r => r.status === 'success').length,
      skipped: results.filter(r => r.status === 'skipped').length,
      errors: results.filter(r => r.status === 'error').length,
    };

    return NextResponse.json({
      success: true,
      results,
      summary,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Auto-generate error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to auto-generate articles' },
      { status: 500 }
    );
  }
}
