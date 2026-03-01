import { fetchArticles, fetchAudioUrl } from '@/lib/supabase';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trapfrequency.com';

  let articles: any[] = [];
  try {
    const result = await fetchArticles({ per_page: 50 });
    articles = result.articles;
  } catch (err) {
    console.error('Error fetching articles for RSS feed:', err);
  }

  // Fetch audio URLs for all articles (in parallel, non-blocking)
  const audioUrls: Record<string, string | null> = {};
  try {
    const audioPromises = articles.map(async (article) => {
      try {
        const url = await fetchAudioUrl(article.id);
        if (url) audioUrls[article.id] = url;
      } catch {
        // Skip individual audio failures
      }
    });
    await Promise.all(audioPromises);
  } catch {
    // Non-blocking
  }

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${siteUrl}/tutorials/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/tutorials/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || ''}]]></description>
      <category>${escapeXml(article.category)}</category>
      <dc:creator>${escapeXml(article.author?.name || 'TrapFrequency')}</dc:creator>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>${audioUrls[article.id] ? `
      <enclosure url="${escapeXml(audioUrls[article.id]!)}" type="audio/mpeg" />` : ''}
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>TrapFrequency — Music Production</title>
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
