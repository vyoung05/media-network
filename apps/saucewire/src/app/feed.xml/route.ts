import { NextResponse } from 'next/server';

// In production this would fetch from Supabase; using mock data structure for now
function getMockArticles() {
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();

  return [
    {
      title: 'Drake Drops Surprise Album at Midnight — Fans Go Wild on Social Media',
      slug: 'drake-surprise-album-midnight',
      excerpt: 'Drake releases "Nocturnal" at midnight with 16 tracks, featuring Future, SZA, and a posthumous Juice WRLD verse.',
      category: 'Music',
      author: 'DJ Source',
      published_at: hoursAgo(1),
    },
    {
      title: 'Nike x Pharrell "Humanrace" Collection Drops This Friday — First Look Inside',
      slug: 'nike-pharrell-humanrace-collection',
      excerpt: 'Nike and Pharrell\'s latest "Humanrace" collab includes NMDs, Air Max 1s, and a full apparel line.',
      category: 'Fashion',
      author: 'Maya Chen',
      published_at: hoursAgo(3),
    },
    {
      title: 'Apple Vision Pro Gets Major Update — Spatial Music Videos Are Here',
      slug: 'apple-vision-pro-spatial-music-videos',
      excerpt: 'Apple Vision Pro now supports spatial music videos with Travis Scott, Bad Bunny, and Billie Eilish.',
      category: 'Tech',
      author: 'TechWire',
      published_at: hoursAgo(5),
    },
    {
      title: 'LeBron James Launches Production Company Focused on Hip-Hop Documentaries',
      slug: 'lebron-james-hiphop-documentaries',
      excerpt: 'LeBron\'s new "Vault Productions" has deals with Netflix and Amazon for hip-hop documentaries.',
      category: 'Entertainment',
      author: 'Sports Desk',
      published_at: hoursAgo(7),
    },
    {
      title: 'NBA All-Star Weekend 2025: Everything You Need to Know',
      slug: 'nba-all-star-weekend-2025-guide',
      excerpt: 'Complete guide to NBA All-Star Weekend 2025 — new format, musical performances, and all events.',
      category: 'Sports',
      author: 'Sports Desk',
      published_at: hoursAgo(10),
    },
    {
      title: "Kanye West's Donda Academy Unveils New Campus Design",
      slug: 'kanye-donda-academy-new-campus',
      excerpt: 'Donda Academy reveals Tadao Ando-designed campus with performing arts center and recording facilities.',
      category: 'Music',
      author: 'Maya Chen',
      published_at: hoursAgo(14),
    },
    {
      title: 'Rihanna Teases Fenty Fragrance Launch With Cryptic Instagram Posts',
      slug: 'rihanna-fenty-fragrance-teaser',
      excerpt: "Rihanna's cryptic Instagram posts point to a new Fenty fragrance launch coming next month.",
      category: 'Fashion',
      author: 'Maya Chen',
      published_at: hoursAgo(18),
    },
    {
      title: 'TikTok Launches Creator Fund 2.0 With Bigger Payouts for Music Content',
      slug: 'tiktok-creator-fund-2-music',
      excerpt: "TikTok's Creator Fund 2.0 offers 3x higher payouts for music content plus a $50M emerging creators fund.",
      category: 'Tech',
      author: 'TechWire',
      published_at: hoursAgo(22),
    },
    {
      title: 'Megan Thee Stallion Announces Global Tour With All-Female Opening Acts',
      slug: 'megan-thee-stallion-global-tour',
      excerpt: 'Megan Thee Stallion\'s 40-city "Hot Girl World Tour" features GloRilla, Ice Spice, and Saweetie.',
      category: 'Music',
      author: 'DJ Source',
      published_at: hoursAgo(26),
    },
    {
      title: 'Caitlin Clark Signs Record-Breaking Endorsement Deal With Jordan Brand',
      slug: 'caitlin-clark-jordan-brand-deal',
      excerpt: "Caitlin Clark's $28M Jordan Brand deal is the biggest in women's basketball history.",
      category: 'Sports',
      author: 'Sports Desk',
      published_at: hoursAgo(30),
    },
  ];
}

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
  const articles = getMockArticles();
  const buildDate = new Date().toUTCString();

  const rssItems = articles
    .map(
      (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${siteUrl}/${article.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${article.slug}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <category>${escapeXml(article.category)}</category>
      <dc:creator>${escapeXml(article.author)}</dc:creator>
      <pubDate>${new Date(article.published_at).toUTCString()}</pubDate>
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
