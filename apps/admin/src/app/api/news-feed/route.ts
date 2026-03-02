import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ======================== TYPES ========================

type FeedPriority = 'breaking' | 'trending' | 'normal';

interface FeedItem {
  id: string;
  source: string;
  title: string;
  link: string;
  pubDate: string;
  category: string;
  // Which brands this item is most relevant to
  brandAffinity: string[];
  // Breaking news priority
  priority: FeedPriority;
}

interface FeedHealthEntry {
  name: string;
  url: string;
  status: 'active' | 'failed' | 'slow';
  lastFetchedAt: string;
  itemCount: number;
  responseTimeMs: number;
  error?: string;
}

// ======================== FEED SOURCES ========================

const FEED_SOURCES: Array<{
  name: string;
  url: string;
  defaultCategory: string;
  // Which brands this source primarily serves
  primaryBrands: string[];
}> = [
  // ==================== SAUCEWIRE (breaking news, sports, entertainment) ====================
  { name: 'TMZ', url: 'https://www.tmz.com/rss.xml', defaultCategory: 'Celebrity', primaryBrands: ['saucewire', 'trapglow'] },
  { name: 'ESPN', url: 'https://www.espn.com/espn/rss/news', defaultCategory: 'Sports', primaryBrands: ['saucewire'] },
  { name: 'Variety', url: 'https://variety.com/feed/', defaultCategory: 'Entertainment', primaryBrands: ['saucewire', 'saucecaviar'] },
  { name: 'AP News', url: 'https://rsshub.app/apnews/topics/apf-entertainment', defaultCategory: 'Entertainment', primaryBrands: ['saucewire'] },
  { name: 'Reuters Entertainment', url: 'https://rsshub.app/reuters/world', defaultCategory: 'Entertainment', primaryBrands: ['saucewire'] },
  { name: 'CNN Entertainment', url: 'https://rss.cnn.com/rss/edition_entertainment.rss', defaultCategory: 'Entertainment', primaryBrands: ['saucewire'] },
  { name: 'NBC News Entertainment', url: 'https://feeds.nbcnews.com/nbcnews/public/entertainment', defaultCategory: 'Entertainment', primaryBrands: ['saucewire'] },
  { name: 'Yahoo Entertainment', url: 'https://rsshub.app/yahoo/news/entertainment', defaultCategory: 'Entertainment', primaryBrands: ['saucewire'] },
  { name: 'Page Six', url: 'https://pagesix.com/feed/', defaultCategory: 'Celebrity', primaryBrands: ['saucewire'] },
  { name: 'The Shade Room', url: 'https://rsshub.app/instagram/user/theshaderoom', defaultCategory: 'Celebrity', primaryBrands: ['saucewire', 'trapglow'] },
  { name: 'Bossip', url: 'https://bossip.com/feed/', defaultCategory: 'Celebrity', primaryBrands: ['saucewire'] },
  { name: 'MediaTakeOut', url: 'https://mediatakeout.com/feed/', defaultCategory: 'Celebrity', primaryBrands: ['saucewire'] },

  // ==================== SAUCECAVIAR (fashion, culture, luxury, lifestyle) ====================
  { name: 'Vogue', url: 'https://www.vogue.com/feed/rss', defaultCategory: 'Fashion', primaryBrands: ['saucecaviar'] },
  { name: 'Highsnobiety', url: 'https://www.highsnobiety.com/feed/', defaultCategory: 'Culture', primaryBrands: ['saucecaviar', 'trapglow'] },
  { name: 'Hypebeast', url: 'https://hypebeast.com/feed', defaultCategory: 'Culture', primaryBrands: ['saucecaviar', 'trapglow'] },
  { name: 'GQ', url: 'https://www.gq.com/feed/rss', defaultCategory: 'Fashion', primaryBrands: ['saucecaviar'] },
  { name: 'Elle', url: 'https://www.elle.com/rss/all.xml/', defaultCategory: 'Fashion', primaryBrands: ['saucecaviar'] },
  { name: 'Architectural Digest', url: 'https://www.architecturaldigest.com/feed/rss', defaultCategory: 'Lifestyle', primaryBrands: ['saucecaviar'] },
  { name: 'Robb Report', url: 'https://robbreport.com/feed/', defaultCategory: 'Lifestyle', primaryBrands: ['saucecaviar'] },
  { name: 'Luxe Digital', url: 'https://luxe.digital/feed/', defaultCategory: 'Lifestyle', primaryBrands: ['saucecaviar'] },

  // ==================== TRAPGLOW (hip-hop, R&B, emerging artists, music culture) ====================
  { name: 'HotNewHipHop', url: 'https://www.hotnewhiphop.com/rss.xml', defaultCategory: 'Hip-Hop', primaryBrands: ['trapglow', 'saucewire'] },
  { name: 'Billboard', url: 'https://www.billboard.com/feed/', defaultCategory: 'Music', primaryBrands: ['trapglow', 'saucewire', 'saucecaviar'] },
  { name: 'Complex', url: 'https://www.complex.com/feeds/music.xml', defaultCategory: 'Music', primaryBrands: ['trapglow'] },
  { name: 'Pitchfork', url: 'https://pitchfork.com/feed/feed-news/rss', defaultCategory: 'Music', primaryBrands: ['trapglow', 'saucecaviar'] },
  { name: 'Stereogum', url: 'https://www.stereogum.com/feed/', defaultCategory: 'Music', primaryBrands: ['trapglow'] },
  { name: 'Genius', url: 'https://rsshub.app/genius/latest', defaultCategory: 'Hip-Hop', primaryBrands: ['trapglow'] },
  { name: 'XXL Magazine', url: 'https://www.xxlmag.com/feed/', defaultCategory: 'Hip-Hop', primaryBrands: ['trapglow', 'saucewire'] },
  { name: 'NME', url: 'https://www.nme.com/news/music/feed', defaultCategory: 'Music', primaryBrands: ['trapglow'] },
  { name: 'Clash Magazine', url: 'https://www.clashmusic.com/feed/', defaultCategory: 'Music', primaryBrands: ['trapglow'] },
  { name: 'WORLDSTARHIPHOP', url: 'https://rsshub.app/worldstarhiphop/featured', defaultCategory: 'Hip-Hop', primaryBrands: ['trapglow', 'saucewire'] },

  // ==================== TRAPFREQUENCY (production, gear, tech, tutorials) ====================
  { name: 'MusicRadar', url: 'https://www.musicradar.com/rss', defaultCategory: 'Gear', primaryBrands: ['trapfrequency'] },
  { name: 'Sound On Sound', url: 'https://www.soundonsound.com/feeds/rss.xml', defaultCategory: 'Tutorials', primaryBrands: ['trapfrequency'] },
  { name: 'The Verge Music', url: 'https://www.theverge.com/rss/entertainment/index.xml', defaultCategory: 'Tech', primaryBrands: ['trapfrequency', 'saucewire'] },
  { name: 'Sweetwater', url: 'https://www.sweetwater.com/insync/feed/', defaultCategory: 'Gear', primaryBrands: ['trapfrequency'] },
  { name: 'Reverb News', url: 'https://reverb.com/news/feed', defaultCategory: 'Gear', primaryBrands: ['trapfrequency'] },
  { name: 'Ableton Blog', url: 'https://rsshub.app/ableton/blog', defaultCategory: 'Tutorials', primaryBrands: ['trapfrequency'] },
  { name: 'Native Instruments Blog', url: 'https://blog.native-instruments.com/feed/', defaultCategory: 'Tutorials', primaryBrands: ['trapfrequency'] },
  { name: 'Plugin Boutique', url: 'https://www.pluginboutique.com/feed', defaultCategory: 'Gear', primaryBrands: ['trapfrequency'] },
];

// ======================== BRAND TOPIC DETECTION ========================

// More granular topic detection tied to specific brands
const BRAND_TOPIC_RULES: Array<{
  pattern: RegExp;
  category: string;
  brands: string[];
}> = [
  // TrapFrequency — production, gear, tech
  { pattern: /\b(daw|plugin|vst|synth|synthesizer|midi|audio.interface|studio.monitor|headphone|microphone|preamp|compressor|eq|mixing|mastering|sample.pack|drum.kit|beat.?making|producer|production.tip|fl.studio|ableton|logic.pro|pro.tools|serum|omnisphere)\b/i, category: 'Production', brands: ['trapfrequency'] },
  { pattern: /\b(gear|equipment|review|hands.on|first.look|spec|hardware|software|update|firmware|release.note)\b/i, category: 'Gear', brands: ['trapfrequency'] },
  { pattern: /\b(tutorial|how.to|guide|tip|trick|technique|workflow|template|preset)\b/i, category: 'Tutorials', brands: ['trapfrequency'] },

  // SauceCaviar — luxury, fashion, art, high culture
  { pattern: /\b(fashion|runway|designer|couture|vogue|gucci|louis.vuitton|prada|balenciaga|dior|chanel|luxury|haute|met.gala|fashion.week|style|wardrobe|collection)\b/i, category: 'Fashion', brands: ['saucecaviar'] },
  { pattern: /\b(art|gallery|exhibit|museum|auction|sotheby|christie|contemporary.art|sculpture|painting|installation)\b/i, category: 'Art', brands: ['saucecaviar'] },
  { pattern: /\b(lifestyle|wellness|gourmet|fine.dining|wine|champagne|caviar|yacht|penthouse|mansion|luxury.travel)\b/i, category: 'Lifestyle', brands: ['saucecaviar'] },

  // TrapGlow — underground hip-hop, emerging artists, nightlife
  { pattern: /\b(rapper|hip.hop|trap|drill|underground|emerging|up.and.coming|debut|mixtape|freestyle|cypher|soundcloud|unsigned)\b/i, category: 'Hip-Hop', brands: ['trapglow'] },
  { pattern: /\b(r&b|rnb|soul|neo.soul|afrobeats|reggaeton|latin.trap)\b/i, category: 'R&B', brands: ['trapglow'] },
  { pattern: /\b(festival|club|nightlife|party|rave|edm|electronic|dj.set)\b/i, category: 'Electronic', brands: ['trapglow'] },

  // SauceWire — breaking news, sports, broad entertainment
  { pattern: /\b(nba|nfl|mlb|nhl|soccer|football|basketball|baseball|ufc|boxing|tennis|sport|athlete|draft|trade|playoff|championship|super.bowl)\b/i, category: 'Sports', brands: ['saucewire'] },
  { pattern: /\b(breaking|exclusive|just.in|report|arrest|lawsuit|scandal|controversy|feud|beef|charged|indicted)\b/i, category: 'Entertainment', brands: ['saucewire'] },
  { pattern: /\b(movie|film|tv|show|series|streaming|netflix|hulu|disney|hbo|premiere|box.office|oscar|emmy|grammy|award)\b/i, category: 'Entertainment', brands: ['saucewire', 'saucecaviar'] },

  // General music — shared between TrapGlow and SauceWire
  { pattern: /\b(album|song|single|release|music.video|tour|concert|ep|lp|deluxe|platinum|gold|charting|billboard.hot|number.one)\b/i, category: 'Music', brands: ['trapglow', 'saucewire'] },
  { pattern: /\b(celebrity|dating|couple|wedding|divorce|pregnant|baby|red.carpet|paparazzi)\b/i, category: 'Celebrity', brands: ['saucewire'] },
];

function detectBrandAffinity(title: string, sourcebrands: string[]): { category: string; brands: string[] } {
  const lowerTitle = title.toLowerCase();

  // Check all topic rules
  for (const rule of BRAND_TOPIC_RULES) {
    if (rule.pattern.test(lowerTitle)) {
      return { category: rule.category, brands: rule.brands };
    }
  }

  // Fall back to source's primary brands
  return { category: '', brands: sourcebrands };
}

// ======================== BREAKING NEWS PRIORITY ========================

const BREAKING_KEYWORDS = /\b(breaking|just\s+in|exclusive|developing|urgent|live\s+update|confirmed|first\s+look|sources?\s+say|report(?:ed)?ly)\b/i;

function detectPriority(title: string, pubDate: string): FeedPriority {
  const now = Date.now();
  const published = new Date(pubDate).getTime();
  const ageMs = now - published;
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const SIX_HOURS = 6 * 60 * 60 * 1000;

  // Invalid or future dates get normal priority
  if (isNaN(published) || published > now) return 'normal';

  // Less than 2 hours old + breaking keywords → breaking
  if (ageMs < TWO_HOURS && BREAKING_KEYWORDS.test(title)) {
    return 'breaking';
  }

  // Less than 6 hours old → trending
  if (ageMs < SIX_HOURS) {
    return 'trending';
  }

  return 'normal';
}

const PRIORITY_ORDER: Record<FeedPriority, number> = { breaking: 0, trending: 1, normal: 2 };

// ======================== HTML ENTITY DECODER ========================

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_m, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ======================== XML PARSER ========================

function extractItems(xml: string, sourceName: string, defaultCategory: string, primaryBrands: string[]): FeedItem[] {
  const items: FeedItem[] = [];

  const itemRegex = /<item[\s>]([\s\S]*?)<\/item>|<entry[\s>]([\s\S]*?)<\/entry>/gi;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1] || match[2] || '';

    const titleMatch = block.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
    const title = titleMatch
      ? decodeHtmlEntities(titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim())
      : '';

    const linkMatch =
      block.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i) ||
      block.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
    const link = linkMatch ? linkMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() : '';

    const dateMatch =
      block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) ||
      block.match(/<published[^>]*>([\s\S]*?)<\/published>/i) ||
      block.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i) ||
      block.match(/<dc:date[^>]*>([\s\S]*?)<\/dc:date>/i);
    const pubDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString();

    // Smart brand/category detection based on title content
    const detected = detectBrandAffinity(title, primaryBrands);
    const category = detected.category || defaultCategory;
    const brandAffinity = detected.brands;

    if (title && link) {
      items.push({
        id: `${sourceName}-${Buffer.from(link).toString('base64').slice(0, 16)}`,
        source: sourceName,
        title,
        link,
        pubDate,
        category,
        brandAffinity,
        priority: detectPriority(title, pubDate),
      });
    }
  }

  return items;
}

// ======================== FETCH FEED ========================

// Global feed health tracker for this request cycle
const feedHealthMap: Map<string, FeedHealthEntry> = new Map();

async function fetchFeed(source: typeof FEED_SOURCES[number]): Promise<FeedItem[]> {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MediaNetwork/1.0 RSS Reader',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });

    clearTimeout(timeout);
    const responseTimeMs = Date.now() - startTime;

    if (!res.ok) {
      feedHealthMap.set(source.name, {
        name: source.name, url: source.url, status: 'failed',
        lastFetchedAt: new Date().toISOString(), itemCount: 0,
        responseTimeMs, error: `HTTP ${res.status}`,
      });
      return [];
    }

    const xml = await res.text();
    const items = extractItems(xml, source.name, source.defaultCategory, source.primaryBrands);

    feedHealthMap.set(source.name, {
      name: source.name, url: source.url,
      status: responseTimeMs > 5000 ? 'slow' : 'active',
      lastFetchedAt: new Date().toISOString(),
      itemCount: items.length,
      responseTimeMs,
    });

    return items;
  } catch (err) {
    const responseTimeMs = Date.now() - startTime;
    const errMsg = err instanceof Error ? err.message : String(err);
    console.warn(`Failed to fetch feed ${source.name}:`, errMsg);
    feedHealthMap.set(source.name, {
      name: source.name, url: source.url, status: 'failed',
      lastFetchedAt: new Date().toISOString(), itemCount: 0,
      responseTimeMs, error: errMsg,
    });
    return [];
  }
}

// ======================== ROUTE HANDLER ========================

export async function GET() {
  try {
    // Fetch custom feeds from Supabase and merge with hardcoded defaults
    let customFeeds: typeof FEED_SOURCES = [];
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
      const { data } = await supabase.from('rss_feeds').select('*').eq('enabled', true);
      if (data) {
        customFeeds = data.map((f: any) => ({
          name: f.name,
          url: f.url,
          defaultCategory: f.default_category,
          primaryBrands: f.primary_brands || [],
        }));
      }
    } catch (err) {
      console.warn('Failed to fetch custom RSS feeds:', err);
    }

    // Custom feeds override defaults if same URL exists
    const customUrls = new Set(customFeeds.map(f => f.url));
    const mergedSources = [
      ...FEED_SOURCES.filter(f => !customUrls.has(f.url)),
      ...customFeeds,
    ];

    const results = await Promise.allSettled(mergedSources.map(fetchFeed));

    const allItems: FeedItem[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled') {
        allItems.push(...result.value);
      }
    }

    // Sort by priority first (breaking > trending > normal), then by date within each priority
    allItems.sort((a, b) => {
      const priorityDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      return dateB - dateA;
    });

    // Return top 60 (more items for better brand distribution across 30+ sources)
    const topItems = allItems.slice(0, 60);

    // Collect feed health data
    const feedHealth: FeedHealthEntry[] = Array.from(feedHealthMap.values());

    return NextResponse.json(
      {
        items: topItems,
        sources: mergedSources.map((s) => s.name),
        feedHealth,
        fetchedAt: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=600, s-maxage=600',
        },
      }
    );
  } catch (err) {
    console.error('News feed API error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch news feeds', items: [], sources: [], fetchedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
