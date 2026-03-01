import { fetchArticles } from '@/lib/supabase';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trapglow.com';

  let articles: any[] = [];
  try {
    const result = await fetchArticles({ per_page: 20 });
    articles = result.articles;
  } catch (err) {
    console.error('Error fetching articles for RSS feed:', err);
  }

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/blog/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || ''}]]></description>
      <category>${article.category}</category>
      <dc:creator>${article.author?.name || 'TrapGlow'}</dc:creator>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
      ${article.cover_image ? `<enclosure url="${article.cover_image}" type="image/jpeg" />` : ''}
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>TrapGlow — Shining Light on What's Next</title>
    <link>${siteUrl}</link>
    <description>Emerging artist discovery, features, and music culture. TrapGlow shines light on what's next.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <copyright>© ${new Date().getFullYear()} TrapGlow</copyright>
    <ttl>60</ttl>
    ${items}
  </channel>
</rss>`;

  return new Response(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
