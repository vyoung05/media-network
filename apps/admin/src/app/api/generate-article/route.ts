import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { searchMedia, pickBestCoverImage, type MediaSearchResult } from '@/lib/media-search';
import { trackCost, estimateTokens } from '@/lib/cost-tracker';

// Allow up to 60 seconds for AI generation + media search + Supabase insert
export const maxDuration = 60;

// ======================== TYPES ========================

interface GenerateRequest {
  newsUrl: string;
  newsTitle: string;
  newsSource: string;
  brand: string;
  category: string;
  // BYOK: user-supplied API key (overrides server key)
  apiKey?: string;
  aiProvider?: 'gemini' | 'openai' | 'anthropic';
}

interface GeneratedArticle {
  title: string;
  body: string;
  excerpt: string;
  metaDescription: string;
  suggestedCategory: string;
  tags: string[];
}

// ======================== BRAND VOICES ========================

const BRAND_VOICES: Record<string, string> = {
  saucecaviar: `You write for SauceCaviar — "Culture Served Premium." A sophisticated, refined digital magazine covering luxury culture, high fashion, fine art, and premium lifestyle. 
CATEGORIES: Fashion, Music, Art, Culture, Lifestyle.
TONE: Elegant, polished, authoritative. Think Vogue meets GQ meets high-end cultural criticism. Use rich vocabulary, flowing sentences, and cultural references. Never use slang or casual language.
AUDIENCE: Cultured readers who appreciate the finer things — fashion, art exhibitions, luxury brands, high-profile cultural moments.
ANGLE: Even when covering mainstream news, find the LUXURY or CULTURAL angle. A rapper's album release becomes about their fashion line or artistic evolution. A sports story becomes about the athlete's style or cultural impact.
DO NOT write generic entertainment news — always elevate it through SauceCaviar's premium lens.`,

  trapglow: `You write for TrapGlow — "Shining Light on What's Next." An energetic, youthful publication focused on underground hip-hop, emerging artists, and the neon-lit culture of urban music and nightlife.
CATEGORIES: Hip-Hop, R&B, Pop, Electronic, Alternative, Latin.
TONE: Hype, vibrant, plugged-in. Use contemporary slang naturally (not excessively), short punchy sentences mixed with flowing descriptions. You're the friend who always knows what's next.
AUDIENCE: Music fans who want to discover new artists, hear about underground movements, and stay ahead of trends.
ANGLE: Focus on the MUSIC and the ARTISTS. New releases, emerging talent, underground movements, artist spotlights, music culture. Think Complex meets Pigeons & Planes.
DO NOT write about sports, production gear, or luxury lifestyle. Stay in the music/artist lane.`,

  saucewire: `You write for SauceWire — "Culture Connected Now" An authoritative, fast-paced news wire covering breaking entertainment, music, sports, and culture news.
CATEGORIES: Music, Fashion, Entertainment, Sports, Tech.
TONE: Sharp, direct, journalistic. Lead with the most important facts. AP-style news writing with a cultural edge. Think TMZ's speed meets Billboard's authority.
AUDIENCE: People who want to know what's happening RIGHT NOW in entertainment, sports, and pop culture.
ANGLE: Hard news. Breaking stories. What just happened, who said what, what's the latest. Cover the breadth — music drops, sports trades, celebrity news, tech launches, fashion events.
This is the NEWS brand — be first, be accurate, be concise. No fluff — every sentence carries weight.`,

  trapfrequency: `You write for TrapFrequency — "Tune Into The Craft." A deeply knowledgeable publication for music producers, beatmakers, and audio enthusiasts.
CATEGORIES: Tutorials, Beats, Gear, DAW Tips, Samples, Interviews.
TONE: Laid-back but deeply informed. Think of explaining complex things simply to a fellow creative. Use production terminology naturally.
AUDIENCE: Beatmakers, producers, audio engineers, music creators who want to level up their craft.
ANGLE: ALWAYS tie back to PRODUCTION. A new album? Analyze the production techniques. New gear dropped? Review it. Artist interview? Ask about their creative process and studio setup. Think Tape Op meets a producer's Discord server.
DO NOT write generic music news or entertainment gossip. Everything should serve the CREATOR audience.`,
};

const BRAND_NAMES: Record<string, string> = {
  saucecaviar: 'SauceCaviar',
  trapglow: 'TrapGlow',
  saucewire: 'SauceWire',
  trapfrequency: 'TrapFrequency',
};

// AI Editor Personas — mapped to Supabase user records
// These are the verified AI editors who "write" for each brand
const BRAND_AI_EDITORS: Record<string, { name: string }> = {
  saucecaviar: { name: 'Maia Fontaine' },
  trapglow: { name: 'Zion Volt' },
  saucewire: { name: 'Dex Monroe' },
  trapfrequency: { name: 'Kayo Drum' },
};

// Unsplash keywords per category for cover images
const COVER_IMAGE_KEYWORDS: Record<string, string> = {
  Music: 'concert,music,artist,performance',
  Entertainment: 'entertainment,celebrity,red-carpet,media',
  Celebrity: 'celebrity,famous,star,portrait',
  Fashion: 'fashion,style,runway,designer',
  Sports: 'sports,athlete,stadium,competition',
  Culture: 'culture,art,city,urban',
  Tech: 'technology,digital,innovation,gadget',
  'Hip-Hop': 'hiphop,rap,urban-music,studio',
  'R&B': 'rnb,soul,music-studio,singer',
  Pop: 'pop-music,concert,stage,performance',
  Electronic: 'electronic-music,dj,festival,neon',
  Tutorials: 'music-production,studio,equipment,mixing',
  Beats: 'beatmaker,drums,producer,studio',
  Gear: 'audio-equipment,headphones,studio-gear,microphone',
  Lifestyle: 'lifestyle,luxury,aesthetic,modern',
};

// ======================== HELPERS ========================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 128);
}

async function fetchArticleContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MediaNetwork/1.0; +https://saucewire.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    clearTimeout(timeout);

    if (!res.ok) return '';

    const html = await res.text();

    // Extract text content from HTML
    // Remove scripts, styles, and HTML tags
    let text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<nav[\s\S]*?<\/nav>/gi, '')
      .replace(/<header[\s\S]*?<\/header>/gi, '')
      .replace(/<footer[\s\S]*?<\/footer>/gi, '')
      .replace(/<aside[\s\S]*?<\/aside>/gi, '');

    // Extract meta description
    const metaMatch = html.match(/<meta\s+(?:name|property)=["'](?:description|og:description)["']\s+content=["']([^"']+)["']/i);
    const metaDesc = metaMatch ? metaMatch[1] : '';

    // Extract article body (common patterns)
    const articleMatch = text.match(/<article[\s\S]*?<\/article>/i)
      || text.match(/<div[^>]*class="[^"]*(?:article|story|content|post-body)[^"]*"[\s\S]*?<\/div>/i);

    const articleText = articleMatch ? articleMatch[0] : text;

    // Strip remaining HTML tags
    const cleanText = articleText
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();

    // Return meta description + article text, truncated to ~3000 chars
    const combined = metaDesc ? `Summary: ${metaDesc}\n\nFull text: ${cleanText}` : cleanText;
    return combined.slice(0, 3000);
  } catch (err) {
    console.warn('Failed to fetch article content:', err instanceof Error ? err.message : err);
    return '';
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function lookupAIEditorId(supabase: any, brand: string): Promise<string | null> {
  const editor = BRAND_AI_EDITORS[brand];
  if (!editor) return null;

  try {
    const result = await supabase
      .from('users')
      .select('id')
      .eq('name', editor.name)
      .eq('is_verified', true)
      .limit(1);

    const rows = result.data as Array<{ id: string }> | null;
    return rows && rows.length > 0 ? rows[0].id : null;
  } catch {
    return null;
  }
}

function getCoverImageUrl(category: string, title: string): string {
  // Generate a deterministic but varied Unsplash image based on category + title
  const keywords = COVER_IMAGE_KEYWORDS[category] || COVER_IMAGE_KEYWORDS['Entertainment'] || 'entertainment,culture';
  const primaryKeyword = keywords.split(',')[0];
  // Use title hash for variety so each article gets a different image
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const sig = hash % 10000;
  return `https://images.unsplash.com/photo-${primaryKeyword}?w=1200&h=630&fit=crop&auto=format&q=80&sig=${sig}`;
}

// Better approach: use Unsplash source API which actually works with keywords
function getUnsplashCover(category: string, title: string): string {
  const keywords = COVER_IMAGE_KEYWORDS[category] || 'entertainment,culture';
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Unsplash Source API (free, no auth needed) — returns random photo matching query
  return `https://source.unsplash.com/1200x630/?${encodeURIComponent(keywords)}&sig=${hash % 99999}`;
}

// ======================== AI PROVIDERS ========================

type AIProvider = 'gemini' | 'openai' | 'anthropic';

async function generateWithGemini(prompt: string, systemPrompt: string, apiKey: string): Promise<string> {
  const model = process.env.AI_MODEL || 'gemini-2.5-flash-preview-05-20';
  // Use v1beta for preview models, v1 for stable — v1beta supports both
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.8,
      },
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned empty response');
  return text;
}

async function generateWithOpenAI(prompt: string, systemPrompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2048,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned empty response');
  return text;
}

async function generateWithAnthropic(prompt: string, systemPrompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error('Anthropic returned empty response');
  return text;
}

async function generateArticleContent(
  prompt: string,
  systemPrompt: string,
  provider: AIProvider = 'openai',
  apiKey?: string,
): Promise<string> {
  // Resolve API key: BYOK key takes priority, then fall back to env vars
  let resolvedKey = apiKey || '';

  if (!resolvedKey) {
    switch (provider) {
      case 'gemini':
        resolvedKey = process.env.GEMINI_API_KEY || '';
        break;
      case 'openai':
        resolvedKey = process.env.OPENAI_API_KEY || '';
        break;
      case 'anthropic':
        resolvedKey = process.env.ANTHROPIC_API_KEY || '';
        break;
    }
  }

  if (!resolvedKey) {
    throw new Error(`No API key available for ${provider}. Provide your own key or ask the admin to configure one.`);
  }

  switch (provider) {
    case 'openai':
      return generateWithOpenAI(prompt, systemPrompt, resolvedKey);
    case 'anthropic':
      return generateWithAnthropic(prompt, systemPrompt, resolvedKey);
    case 'gemini':
    default:
      return generateWithGemini(prompt, systemPrompt, resolvedKey);
  }
}

// ======================== QUALITY SCORING ========================

interface QualityScoreResult {
  score: number;
  flags: string[];
  breakdown: {
    wordCount: number;
    wordCountScore: number;
    fieldsPresent: number;
    fieldScore: number;
    paragraphCount: number;
    paragraphScore: number;
    artifactScore: number;
  };
}

const AI_ARTIFACT_PATTERNS = [
  /\bAs an AI\b/i,
  /\bI'm an AI\b/i,
  /\bAs a language model\b/i,
  /\[insert\b/i,
  /\[your\b/i,
  /\[placeholder\b/i,
  /\[PLACEHOLDER\b/,
  /\[TODO\b/i,
  /\[TBD\b/i,
  /\bI cannot\b.*\breal-time\b/i,
  /\bI don't have access\b/i,
  /\bAs of my\s+(last\s+)?training\b/i,
  /\bmy training data\b/i,
  /\bLorem ipsum\b/i,
  /amazon\.com\/dp\/[A-Z0-9]{10}/i,
];

function scoreArticleQuality(article: { title: string; body: string; excerpt: string; tags: string[] }): QualityScoreResult {
  const flags: string[] = [];

  // 1. Word count scoring (max 30 points)
  const words = article.body.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  let wordCountScore: number;
  if (wordCount >= 400 && wordCount <= 800) {
    wordCountScore = 30; // Sweet spot
  } else if (wordCount >= 300 && wordCount < 400) {
    wordCountScore = 20;
  } else if (wordCount > 800 && wordCount <= 1000) {
    wordCountScore = 22;
  } else if (wordCount < 300) {
    wordCountScore = Math.max(0, Math.floor((wordCount / 300) * 15));
    flags.push(`Too short (${wordCount} words)`);
  } else {
    // Over 1000
    wordCountScore = 15;
    flags.push(`Too long (${wordCount} words)`);
  }

  // 2. Required fields present (max 25 points)
  const fieldsPresent = [
    article.title && article.title.length > 5,
    article.excerpt && article.excerpt.length > 10,
    article.body && article.body.length > 50,
    article.tags && article.tags.length >= 2,
  ].filter(Boolean).length;
  const fieldScore = Math.floor((fieldsPresent / 4) * 25);
  if (fieldsPresent < 4) {
    const missing: string[] = [];
    if (!article.title || article.title.length <= 5) missing.push('title');
    if (!article.excerpt || article.excerpt.length <= 10) missing.push('excerpt');
    if (!article.body || article.body.length <= 50) missing.push('body');
    if (!article.tags || article.tags.length < 2) missing.push('tags');
    flags.push(`Missing fields: ${missing.join(', ')}`);
  }

  // 3. Paragraph structure (max 25 points)
  const paragraphs = article.body.split(/\n\s*\n/).filter(p => p.trim().length > 30);
  const paragraphCount = paragraphs.length;
  let paragraphScore: number;
  if (paragraphCount >= 4) {
    paragraphScore = 25;
  } else if (paragraphCount === 3) {
    paragraphScore = 20;
  } else if (paragraphCount === 2) {
    paragraphScore = 12;
    flags.push('Needs more paragraphs');
  } else {
    paragraphScore = 5;
    flags.push('Single block of text — poor structure');
  }

  // 4. No AI artifacts (max 20 points)
  let artifactScore = 20;
  for (const pattern of AI_ARTIFACT_PATTERNS) {
    if (pattern.test(article.body) || pattern.test(article.title)) {
      artifactScore = Math.max(0, artifactScore - 10);
      flags.push(`AI artifact detected: ${pattern.source.slice(0, 30)}`);
    }
  }

  const score = Math.min(100, wordCountScore + fieldScore + paragraphScore + artifactScore);

  return {
    score,
    flags,
    breakdown: {
      wordCount,
      wordCountScore,
      fieldsPresent,
      fieldScore,
      paragraphCount,
      paragraphScore,
      artifactScore,
    },
  };
}

function parseGeneratedArticle(raw: string): GeneratedArticle & { coverSearch: string } {
  // Parse structured output from AI
  const titleMatch = raw.match(/TITLE:\s*(.+?)(?:\n|$)/i);
  const excerptMatch = raw.match(/EXCERPT:\s*(.+?)(?:\n\n|\nBODY:|\nMETA|$)/is);
  const metaMatch = raw.match(/META_DESCRIPTION:\s*(.+?)(?:\n\n|\nCATEGORY:|\nTAGS:|$)/is);
  const categoryMatch = raw.match(/CATEGORY:\s*(.+?)(?:\n|$)/i);
  const tagsMatch = raw.match(/TAGS:\s*(.+?)(?:\n\n|\nCOVER_SEARCH:|\nBODY:|$)/is);
  const coverSearchMatch = raw.match(/COVER_SEARCH:\s*(.+?)(?:\n|$)/i);
  const bodyMatch = raw.match(/BODY:\s*([\s\S]+?)(?:\n\n(?:TITLE:|EXCERPT:|META|CATEGORY:|TAGS:|COVER_SEARCH:)|$)/i);

  // Fallback: if structured format wasn't followed, try to extract sensibly
  const title = titleMatch?.[1]?.trim() || '';
  const excerpt = excerptMatch?.[1]?.trim() || '';
  const metaDescription = metaMatch?.[1]?.trim() || excerpt.slice(0, 160);
  const suggestedCategory = categoryMatch?.[1]?.trim() || 'Entertainment';
  const tags = tagsMatch?.[1]?.trim().split(',').map(t => t.trim()).filter(Boolean) || [];
  const coverSearch = coverSearchMatch?.[1]?.trim() || '';
  
  let body = bodyMatch?.[1]?.trim() || '';
  
  // If we couldn't parse structured output, use the whole response as body
  if (!body && !title) {
    body = raw.trim();
  }

  return { title, body, excerpt, metaDescription, suggestedCategory, tags, coverSearch };
}

function stripFakeAmazonLinks(html: string): string {
  // Strip fake ASIN links (invented /dp/XXXXX URLs) but KEEP valid search links (/s?k=...)
  // HTML links with fake ASINs
  let cleaned = html.replace(/<a[^>]*href="([^"]*amazon\.com\/dp\/[^"]*)"[^>]*>(.*?)<\/a>/gi, '$2');
  // Markdown links with fake ASINs
  cleaned = cleaned.replace(/\[([^\]]+)\]\(https?:\/\/[^)]*amazon\.com\/dp\/[^)]*\)/gi, '$1');
  return cleaned;
}

// ======================== ROUTE HANDLER ========================

export async function POST(request: Request) {
  try {
    const body: GenerateRequest = await request.json();
    const { newsUrl, newsTitle, newsSource, brand, category, apiKey, aiProvider } = body;

    // Validate
    if (!newsTitle || !brand) {
      return NextResponse.json({ error: 'newsTitle and brand are required' }, { status: 400 });
    }

    if (!BRAND_VOICES[brand]) {
      return NextResponse.json({ error: `Invalid brand: ${brand}` }, { status: 400 });
    }

    // Determine provider and key
    const provider: AIProvider = aiProvider || 'openai';
    const userKey = apiKey || '';

    // Check that SOME key is available (BYOK or server)
    const hasServerKey = provider === 'gemini' ? !!process.env.GEMINI_API_KEY
      : provider === 'openai' ? !!process.env.OPENAI_API_KEY
      : provider === 'anthropic' ? !!process.env.ANTHROPIC_API_KEY
      : false;

    if (!userKey && !hasServerKey) {
      return NextResponse.json({
        error: `No API key available for ${provider}. Please provide your own key in Settings → AI API Key.`,
      }, { status: 503 });
    }

    // Fetch article content if URL provided
    let sourceContent = '';
    if (newsUrl) {
      sourceContent = await fetchArticleContent(newsUrl);
    }

    // Build the prompt
    const systemPrompt = `${BRAND_VOICES[brand]}

You are an AI content writer for ${BRAND_NAMES[brand]}. Generate a complete article based on the news story provided. 

IMPORTANT: Output your response in this EXACT format (keep the labels):

TITLE: [Your catchy, brand-appropriate headline]
EXCERPT: [1-2 sentence teaser that hooks the reader]
META_DESCRIPTION: [SEO-optimized description, max 160 characters]
CATEGORY: [Suggested category]
TAGS: [tag1, tag2, tag3, tag4, tag5]
COVER_SEARCH: [The main person or subject's FULL NAME for the cover photo. If the article is about a celebrity, athlete, musician, or public figure, use their real name (e.g. "Chad Ochocinco", "Shannon Sharpe", "Zendaya"). Only use generic terms like "concert stage" if no specific person is the subject.]
BODY: [Full article body, 400-800 words. Use double line breaks between paragraphs. Write in the brand's voice. Do not include the title in the body.]

PRODUCT LINKS: When mentioning a specific purchasable product (gadget, phone, headphones, gear, clothing item, etc.), link it using an Amazon SEARCH URL in this exact format:
https://www.amazon.com/s?k=PRODUCT+NAME+HERE&tag=vincentyoung-20
Replace spaces with + signs. Examples:
- [Google Pixel 8a](https://www.amazon.com/s?k=Google+Pixel+8a&tag=vincentyoung-20)
- [AirPods Pro](https://www.amazon.com/s?k=AirPods+Pro+2nd+generation&tag=vincentyoung-20)
- [Nike Air Max 90](https://www.amazon.com/s?k=Nike+Air+Max+90&tag=vincentyoung-20)
NEVER invent Amazon product IDs (ASINs like /dp/B0CX23V2ZK). ONLY use search URLs as shown above. Only add product links when naturally relevant — don't force them. Non-product links (news sources, social media) should use real URLs only.

IMPORTANT: The CATEGORY must be one of the brand's valid categories listed above. Do not use generic categories.`;

    const userPrompt = `Write an article based on this news story:

Source: ${newsSource || 'Unknown'}
Original Title: ${newsTitle}
Category: ${category || 'Entertainment'}
${sourceContent ? `\nSource Content:\n${sourceContent}` : '\n(No source content available — write based on the title and your knowledge)'}

Remember: Write 400-800 words in the ${BRAND_NAMES[brand]} voice. Make it engaging, original, and NOT a direct copy. Add your own analysis, context, and perspective.`;

    // Generate the article (uses BYOK key if provided, else server key)
    const rawOutput = await generateArticleContent(userPrompt, systemPrompt, provider, userKey || undefined);
    const generated = parseGeneratedArticle(rawOutput);
    generated.body = stripFakeAmazonLinks(generated.body);

    // Track API cost (fire-and-forget)
    const providerModelMap: Record<string, string> = {
      gemini: process.env.AI_MODEL || 'gemini-2.5-flash-preview-05-20',
      openai: 'gpt-4o-mini',
      anthropic: 'claude-sonnet-4-20250514',
    };
    trackCost({
      service: 'article-generation',
      operation: 'generate',
      model: providerModelMap[provider] || provider,
      provider,
      brand,
      tokens_in: estimateTokens(userPrompt + systemPrompt),
      tokens_out: estimateTokens(rawOutput),
    });

    // Use generated title or fall back to a rewrite of the original
    const finalTitle = generated.title || `${newsTitle} — ${BRAND_NAMES[brand]}`;
    const finalBody = generated.body || rawOutput;
    const finalExcerpt = generated.excerpt || finalBody.split('\n\n')[0]?.slice(0, 200) || '';

    // Score the article quality
    const qualityResult = scoreArticleQuality({
      title: finalTitle,
      body: finalBody,
      excerpt: finalExcerpt,
      tags: generated.tags,
    });

    // Append AI metadata to body (including quality score)
    const providerModels: Record<AIProvider, string> = {
      gemini: process.env.AI_MODEL || 'gemini-2.5-flash-preview-05-20',
      openai: 'gpt-4o-mini',
      anthropic: 'claude-sonnet-4-20250514',
    };
    const aiMetaObj = {
      source_url: newsUrl || null,
      source_title: newsTitle,
      source_name: newsSource || null,
      generated_at: new Date().toISOString(),
      provider,
      model: providerModels[provider],
      byok: !!userKey,
      brand,
      quality_score: qualityResult.score,
      quality_flags: qualityResult.flags,
    };
    const aiMeta = JSON.stringify(aiMetaObj);
    const bodyWithMeta = `${finalBody}\n\n<!-- AI_META:${aiMeta} -->`;

    // Insert into Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Look up the correct AI editor persona for this brand
    const aiEditorId = await lookupAIEditorId(supabase, brand);

    // --- Media Enrichment: search for images and videos ---
    const coverSearchTerm = generated.coverSearch || generated.suggestedCategory || category || 'entertainment';
    const fallbackCoverUrl = `https://source.unsplash.com/1200x630/?${encodeURIComponent(coverSearchTerm.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ','))}`;

    let mediaResults: MediaSearchResult = {
      sourceImages: [],
      stockImages: [],
      aiImages: [],
      wikimediaImages: [],
      wikipediaImage: null,
      videos: [],
    };

    try {
      mediaResults = await searchMedia({
        query: coverSearchTerm,
        newsUrl: newsUrl || undefined,
        type: 'all',
      });
    } catch (mediaErr) {
      console.warn('Media enrichment failed (non-fatal):', mediaErr instanceof Error ? mediaErr.message : mediaErr);
    }

    // Pick the best cover image from all available sources
    const coverImageUrl = pickBestCoverImage(mediaResults, fallbackCoverUrl);

    // Build metadata with media options
    const articleMetadata: Record<string, unknown> = {
      media_options: {
        sourceImages: mediaResults.sourceImages,
        stockImages: mediaResults.stockImages,
        aiImages: mediaResults.aiImages,
        videos: mediaResults.videos,
      },
      ai_meta: aiMetaObj,
      content_type: 'article',
    };

    const slug = slugify(finalTitle) + '-' + Date.now().toString(36);
    const wordCount = finalBody.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    // Ensure tags are comprehensive
    const finalTags = generated.tags.length > 0
      ? generated.tags
      : [brand, generated.suggestedCategory || category || 'entertainment', 'ai-generated'].map(t => t.toLowerCase());

    const { data: article, error: insertError } = await supabase
      .from('articles')
      .insert({
        title: finalTitle,
        slug,
        body: bodyWithMeta,
        excerpt: finalExcerpt,
        cover_image: coverImageUrl,
        brand,
        category: generated.suggestedCategory || category || 'Entertainment',
        tags: finalTags,
        status: 'pending_review',
        is_breaking: false,
        is_ai_generated: true,
        source_url: newsUrl || null,
        author_id: aiEditorId || 'bfd7420b-6d11-4599-8169-d5d568c2287c',
        reading_time_minutes: readingTime,
        view_count: 0,
        metadata: articleMetadata,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      throw new Error(`Failed to save article: ${insertError.message}`);
    }

    // Count media found for the response
    const mediaImageCount = mediaResults.sourceImages.length + mediaResults.stockImages.length + mediaResults.aiImages.length;
    const mediaVideoCount = mediaResults.videos.length;

    const responseData: Record<string, unknown> = {
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        brand: article.brand,
        category: article.category,
        status: article.status,
        excerpt: finalExcerpt,
        tags: generated.tags,
        metaDescription: generated.metaDescription,
        wordCount,
        readingTime,
        qualityScore: qualityResult.score,
        qualityBreakdown: qualityResult.breakdown,
      },
      media: {
        imagesFound: mediaImageCount,
        videosFound: mediaVideoCount,
      },
    };

    // Flag low-quality articles
    if (qualityResult.score < 40) {
      responseData.warning = `Low quality score (${qualityResult.score}/100). Issues: ${qualityResult.flags.join('; ')}`;
      responseData.qualityFlags = qualityResult.flags;
    }

    return NextResponse.json(responseData);
  } catch (err) {
    console.error('Generate article error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to generate article' },
      { status: 500 }
    );
  }
}
