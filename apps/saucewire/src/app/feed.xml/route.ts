import { NextResponse } from 'next/server';
import { fetchArticles } from '@/lib/supabase';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saucewire.com';

  let articles: any[] = [];
  try {
    const result = await fetchArticles({ per_page: 20 });
    articles = result.articles;
  } catch (err) {
    console.error('Error fetching articles for RSS feed:', err);
  }

  const buildDate = new Date().toUTCString();

  const rssItems = articles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteUrl}/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${article.slug}</guid>
      <description>${escapeXml(article.excerpt || '')}</description>
      <category>${escapeXml(article.category)}</category>
      <dc:creator>${escapeXml(article.author?.name || 'SauceWire')}</dc:creator>
      <pubDate>${new Date(article.published_at || article.created_at).toUTCString()}</pubDate>
    </item>`
    )
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>SauceWire — Culture. Connected. Now.</title>
    <link>${siteUrl}</link>
    <description>Breaking news and culture coverage — hip-hop, fashion, entertainment, sports, and tech. Always on, always plugged in.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>SauceWire</title>
      <link>${siteUrl}</link>
    </image>
    <copyright>© ${new Date().getFullYear()} SauceWire. All rights reserved.</copyright>
    <managingEditor>tips@saucewire.com (SauceWire)</managingEditor>
    <webMaster>tips@saucewire.com (SauceWire)</webMaster>
    <category>Culture</category>
    <category>Hip-Hop</category>
    <category>Fashion</category>
    <category>Entertainment</category>
    <category>Sports</category>
    <category>Technology</category>
    <ttl>30</ttl>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800, s-maxage=1800',
    },
  });
}
