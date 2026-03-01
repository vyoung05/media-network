import { fetchArticles } from '@/lib/supabase';
import { mockIssues } from '@/lib/mock-data';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saucecaviar.com';

  // Fetch real articles from Supabase
  let articles: any[] = [];
  try {
    const result = await fetchArticles({ per_page: 20 });
    articles = result.articles;
  } catch (err) {
    console.error('Error fetching articles for RSS feed:', err);
  }

  // Include published issues from mock data (until issues are in Supabase)
  const issueItems = mockIssues
    .filter((issue) => issue.status === 'published')
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
      <category>${article.category}</category>
      <dc:creator>${article.author?.name || 'SauceCaviar'}</dc:creator>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
    </item>`
    )
    .join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>SauceCaviar — Culture Served Premium</title>
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
