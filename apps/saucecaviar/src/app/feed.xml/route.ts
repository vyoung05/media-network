import { mockIssues } from '@/lib/mock-data';

export async function GET() {
  const baseUrl = 'https://saucecaviar.com';

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
      ${issue.coverImage ? `<enclosure url="${issue.coverImage}" type="image/jpeg" />` : ''}
    </item>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>SauceCaviar — Culture Served Premium</title>
    <link>${baseUrl}</link>
    <description>A luxury interactive digital magazine exploring fashion, music, art, and culture.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>SauceCaviar</title>
      <link>${baseUrl}</link>
    </image>
    ${issueItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
