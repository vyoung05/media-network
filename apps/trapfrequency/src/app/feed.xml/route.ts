import { fetchArticles } from '@/lib/supabase';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trapfrequency.com';

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
      <link>${siteUrl}/tutorials/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/tutorials/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || ''}]]></description>
      <category>${article.category}</category>
      <dc:creator>${article.author?.name || 'TrapFrequency'}</dc:creator>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>TrapFrequency — Tune Into The Craft</title>
    <link>${siteUrl}</link>
    <description>Music production tutorials, beat reviews, gear guides, and producer interviews.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <copyright>© ${new Date().getFullYear()} TrapFrequency</copyright>
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
