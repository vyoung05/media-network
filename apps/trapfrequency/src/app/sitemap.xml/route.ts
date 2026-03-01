import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://trapfrequency.com';
const BRAND = 'trapfrequency';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let articleUrls = '';
  let tutorialUrls = '';
  let beatUrls = '';
  let producerUrls = '';
  let gearUrls = '';

  if (url && key) {
    const supabase = createClient(url, key);

    // Fetch published articles
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, published_at, updated_at')
      .eq('brand', BRAND)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(1000);

    articleUrls = (articles || []).map(a => `
  <url>
    <loc>${SITE_URL}/articles/${a.slug}</loc>
    <lastmod>${a.updated_at || a.published_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    // Fetch tutorials
    const { data: tutorials } = await supabase
      .from('tutorials')
      .select('slug, updated_at, created_at')
      .limit(500);

    tutorialUrls = (tutorials || []).map(t => `
  <url>
    <loc>${SITE_URL}/tutorials/${t.slug}</loc>
    <lastmod>${t.updated_at || t.created_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

    // Fetch beats
    const { data: beats } = await supabase
      .from('beats')
      .select('slug, updated_at, created_at')
      .limit(500);

    beatUrls = (beats || []).map(b => `
  <url>
    <loc>${SITE_URL}/beats/${b.slug}</loc>
    <lastmod>${b.updated_at || b.created_at}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

    // Fetch producers
    const { data: producers } = await supabase
      .from('producers')
      .select('slug, updated_at, created_at')
      .limit(500);

    producerUrls = (producers || []).map(p => `
  <url>
    <loc>${SITE_URL}/producers/${p.slug}</loc>
    <lastmod>${p.updated_at || p.created_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

    // Fetch gear reviews
    const { data: gear } = await supabase
      .from('gear_reviews')
      .select('slug, updated_at, created_at')
      .limit(500);

    gearUrls = (gear || []).map(g => `
  <url>
    <loc>${SITE_URL}/gear/${g.slug}</loc>
    <lastmod>${g.updated_at || g.created_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/tutorials</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/beats</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/gear</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${SITE_URL}/submit</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>${producerUrls}${tutorialUrls}${beatUrls}${gearUrls}${articleUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
