import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ─── Config ──────────────────────────────────────────────

function getSupabaseService() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const BRAND_SEARCH_QUERIES: Record<string, { queries: string[]; categories: string[]; voice: string }> = {
  saucewire: {
    queries: [
      'breaking music industry news today',
      'entertainment news today hip hop R&B',
      'fashion trends streetwear luxury 2026',
      'sports news highlights today',
      'tech news AI social media today',
    ],
    categories: ['Music', 'Entertainment', 'Fashion', 'Sports', 'Tech'],
    voice: 'Write as a sharp, authoritative news wire. Short punchy paragraphs. Breaking-news energy. Think AP News meets Complex.',
  },
  trapglow: {
    queries: [
      'new emerging artists hip hop R&B 2026',
      'new music releases this week rap hip hop',
      'indie artist spotlight underground music',
      'streaming numbers Spotify Apple Music new artists',
      'music festival lineup announcements 2026',
    ],
    categories: ['Hip-Hop', 'R&B', 'Pop', 'Electronic', 'Alternative'],
    voice: 'Write with young, energetic discovery vibes. Like a friend texting you about a fire new artist. Casual but knowledgeable. Use phrases like "just dropped", "blowing up", "one to watch".',
  },
  trapfrequency: {
    queries: [
      'music production news DAW updates plugins 2026',
      'beat making tutorial tips producers',
      'new VST plugins synths released 2026',
      'audio gear review headphones monitors',
      'sample pack releases drum kits',
    ],
    categories: ['Tutorials', 'Beats', 'Gear', 'DAW Tips', 'Samples'],
    voice: 'Write like a knowledgeable producer sharing with the community. Technical but accessible. Include specific details (BPM, DAW names, plugin names). Practical and helpful.',
  },
};

// ─── Brave Search ────────────────────────────────────────

async function searchNews(query: string, count = 5): Promise<{ title: string; url: string; description: string; age?: string }[]> {
  const apiKey = process.env.BRAVE_SEARCH_API_KEY;
  if (!apiKey) {
    console.warn('BRAVE_SEARCH_API_KEY not set, using fallback');
    return [];
  }

  try {
    const params = new URLSearchParams({
      q: query,
      count: String(count),
      freshness: 'pd', // past day
      text_decorations: 'false',
    });

    const res = await fetch(`https://api.search.brave.com/res/v1/web/search?${params}`, {
      headers: { 'X-Subscription-Token': apiKey, Accept: 'application/json' },
    });

    if (!res.ok) {
      console.error('Brave search failed:', res.status, await res.text());
      return [];
    }

    const data = await res.json();
    return (data.web?.results || []).map((r: any) => ({
      title: r.title,
      url: r.url,
      description: r.description || '',
      age: r.age,
    }));
  } catch (err: any) {
    console.error('Search error:', err.message);
    return [];
  }
}

// ─── AI Rewrite ──────────────────────────────────────────

type AIEngine = 'openai' | 'gemini';

function getArticlePrompt(
  source: { title: string; description: string; url: string },
  brandVoice: string,
  category: string
): string {
  return `You are a content writer for a media brand. ${brandVoice}

Based on this news source, write an ORIGINAL article (do NOT copy — fully rewrite with your own angle):

SOURCE TITLE: ${source.title}
SOURCE SUMMARY: ${source.description}
SOURCE URL: ${source.url}

Write in JSON format:
{
  "title": "Your catchy headline (different from source)",
  "body": "Full article body, 3-5 paragraphs, 200-400 words. Use markdown for formatting.",
  "excerpt": "One compelling sentence summary, under 160 chars",
  "tags": ["tag1", "tag2", "tag3"]
}

Category: ${category}
Rules:
- 100% original wording — never plagiarize
- Match the brand voice described above
- Include the source URL as a reference at the bottom
- Make it engaging and shareable
- Only return valid JSON, nothing else`;
}

async function rewriteWithOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    console.error('OpenAI error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

async function rewriteWithGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1000,
        },
      }),
    }
  );

  if (!res.ok) {
    console.error('Gemini error:', res.status, await res.text());
    return null;
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

function getActiveEngine(): AIEngine {
  // Check AI_ENGINE env var first, fallback to whichever key is available
  const preferred = (process.env.AI_ENGINE || '').toLowerCase();
  if (preferred === 'gemini' && process.env.GEMINI_API_KEY) return 'gemini';
  if (preferred === 'openai' && process.env.OPENAI_API_KEY) return 'openai';
  // Auto-detect: prefer whichever is configured
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.OPENAI_API_KEY) return 'openai';
  return 'openai'; // fallback
}

async function rewriteArticle(
  source: { title: string; description: string; url: string },
  brandVoice: string,
  category: string,
  engine?: AIEngine
): Promise<{ title: string; body: string; excerpt: string; tags: string[]; engine: AIEngine } | null> {
  const activeEngine = engine || getActiveEngine();
  const prompt = getArticlePrompt(source, brandVoice, category);

  console.log(`[AI Pipeline] Using engine: ${activeEngine}`);

  try {
    let content: string | null = null;

    if (activeEngine === 'gemini') {
      content = await rewriteWithGemini(prompt);
    } else {
      content = await rewriteWithOpenAI(prompt);
    }

    if (!content) {
      console.warn(`${activeEngine} returned empty — cannot rewrite`);
      return null;
    }

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    return { ...parsed, engine: activeEngine };
  } catch (err: any) {
    console.error('Rewrite error:', err.message);
    return null;
  }
}

// ─── Slug Generator ──────────────────────────────────────

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80);
}

// ─── Reading Time ────────────────────────────────────────

function estimateReadingTime(text: string): number {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ─── Main Pipeline ───────────────────────────────────────

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const results: any[] = [];

  // Allow engine override via query param: ?engine=gemini or ?engine=openai
  const engineParam = request.nextUrl.searchParams.get('engine') as AIEngine | null;

  try {
    const supabase = getSupabaseService();

    // Check which brands have AI pipeline enabled
    // For now, check env vars and use defaults
    const enabledBrands = ['saucewire', 'trapglow', 'trapfrequency'];
    const activeEngine = engineParam || getActiveEngine();

    for (const brand of enabledBrands) {
      const config = BRAND_SEARCH_QUERIES[brand];
      if (!config) continue;

      // Pick a random query from the brand's list
      const query = config.queries[Math.floor(Math.random() * config.queries.length)];
      const category = config.categories[Math.floor(Math.random() * config.categories.length)];

      console.log(`[AI Pipeline] ${brand}: searching "${query}" (engine: ${activeEngine})`);

      // Search for news
      const searchResults = await searchNews(query, 5);
      if (searchResults.length === 0) {
        results.push({ brand, status: 'no_results', query });
        continue;
      }

      // Check for duplicate source URLs
      const urls = searchResults.map((r) => r.url);
      const { data: existing } = await supabase
        .from('articles')
        .select('source_url')
        .in('source_url', urls);

      const existingUrls = new Set((existing || []).map((e: any) => e.source_url));
      const newResults = searchResults.filter((r) => !existingUrls.has(r.url));

      if (newResults.length === 0) {
        results.push({ brand, status: 'all_duplicates', query });
        continue;
      }

      // Pick the top result that's not a duplicate
      const source = newResults[0];

      // Rewrite with AI
      const article = await rewriteArticle(source, config.voice, category, activeEngine);
      if (!article) {
        results.push({ brand, status: 'rewrite_failed', source: source.title, engine: activeEngine });
        continue;
      }

      // Generate slug and check uniqueness
      let slug = generateSlug(article.title);
      const { data: slugCheck } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .single();
      if (slugCheck) {
        slug = `${slug}-${Date.now().toString(36)}`;
      }

      // Insert as draft (or published if auto-publish enabled and meets threshold)
      const status = 'draft'; // Default to draft — admin reviews before publishing

      const { data: inserted, error: insertError } = await supabase
        .from('articles')
        .insert({
          title: article.title,
          slug,
          body: article.body,
          excerpt: article.excerpt,
          brand,
          category,
          tags: article.tags || [],
          status,
          is_ai_generated: true,
          source_url: source.url,
          reading_time_minutes: estimateReadingTime(article.body),
          metadata: {
            ai_pipeline: true,
            ai_engine: article.engine,
            search_query: query,
            source_title: source.title,
            generated_at: new Date().toISOString(),
          },
        })
        .select('id, title, slug')
        .single();

      if (insertError) {
        results.push({ brand, status: 'insert_failed', error: insertError.message });
        continue;
      }

      // Create notification
      await supabase.from('notifications').insert({
        type: 'article',
        title: `🤖 AI Article: ${article.title.substring(0, 50)}`,
        message: `New ${brand} article via ${article.engine.toUpperCase()} from "${source.title.substring(0, 50)}"`,
        link: `/dashboard/content`,
        brand,
        read: false,
      });

      results.push({
        brand,
        status: 'created',
        article: { id: inserted?.id, title: article.title, slug },
        source: source.title,
        engine: article.engine,
      });
    }

    const elapsed = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      engine: activeEngine,
      elapsed_ms: elapsed,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('AI Pipeline error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
