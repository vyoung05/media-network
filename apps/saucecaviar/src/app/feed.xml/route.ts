import { fetchArticles, fetchAudioUrl, fetchAllIssues } from '@/lib/supabase';
import { mockIssues } from '@/lib/mock-data';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saucecaviar.com';

  // Fetch real articles from Supabase
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

  // Fetch real issues from Supabase, fall back to mock
  let issues = await fetchAllIssues();
  if (issues.length === 0) issues = mockIssues.filter((i) => i.status === 'published');

  const issueItems = issues
    .map(
      (issue) => `
    <item>
      <title><![CDATA[${issue.title} — Issue #${issue.issueNumber}]]></title>
      <link>${baseUrl}/issues/${issue.slug}</link>
      <guid isPermaLink="true">${baseUrl}/issues/${issue.slug}</guid>
      <description><![CDATA[${issue.description}]]></description>
      <pubDate>${new Date(issue.publishedAt).toUTCString()}</pubDate>
      <category>Magazine Issue</category>
    </item>`
    )
    .join('\n');

  const articleItems = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/${article.slug}</guid>
      <description><![CDATA[${article.excerpt || ''}]]></description>
      <category>${escapeXml(article.category)}</category>
      <dc:creator>${escapeXml(article.author?.name || 'SauceCaviar')}</dc:creator>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>${audioUrls[article.id] ? `
      <enclosure url="${escapeXml(audioUrls[article.id]!)}" type="audio/mpeg" />` : ''}
    </item>`
    )
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>SauceCaviar — Luxury Culture Magazine</title>
    <link>${baseUrl}</link>
    <description>A digital magazine celebrating fashion, art, music, and culture at its finest.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <copyright>© ${new Date().getFullYear()} SauceCaviar</copyright>
    <ttl>60</ttl>
    ${issueItems}
    ${articleItems}
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
