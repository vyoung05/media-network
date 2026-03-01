import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://saucecaviar.com';
const BRAND = 'saucecaviar';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let articleUrls = '';
  let issueUrls = '';

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

    // Fetch magazine issues
    const { data: issues } = await supabase
      .from('magazine_issues')
      .select('id, title, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(100);

    issueUrls = (issues || []).map(i => `
  <url>
    <loc>${SITE_URL}/issues/${i.id}</loc>
    <lastmod>${i.updated_at || i.published_at}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
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
    <loc>${SITE_URL}/issues</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${SITE_URL}/subscribe</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>${issueUrls}${articleUrls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
