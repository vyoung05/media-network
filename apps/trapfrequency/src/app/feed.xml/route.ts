import { NextResponse } from 'next/server';

function getMockFeedItems() {
  const now = new Date();
  const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600 * 1000).toISOString();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 86400 * 1000).toISOString();

  return [
    {
      title: 'How to Make Hard-Hitting 808s in FL Studio from Scratch',
      slug: 'tutorials/hard-hitting-808s-fl-studio',
      excerpt: 'Learn how to synthesize, layer, and process 808 bass sounds that rattle speakers.',
      category: 'Tutorials',
      author: 'Bass Architect',
      published_at: hoursAgo(6),
    },
    {
      title: 'Ableton Live: Creating Lush Pads with Wavetable Synthesis',
      slug: 'tutorials/ableton-wavetable-pads',
      excerpt: 'Deep dive into Ableton\'s Wavetable synth for cinematic pads.',
      category: 'Tutorials',
      author: 'Kira Voltage',
      published_at: hoursAgo(18),
    },
    {
      title: 'Akai MPC Live II Review: The Ultimate Standalone Beat Machine',
      slug: 'gear/akai-mpc-live-ii-review',
      excerpt: 'The MPC Live II is the best standalone beat machine ever made.',
      category: 'Gear',
      author: 'OG Sampler',
      published_at: daysAgo(3),
    },
    {
      title: 'Music Theory for Producers: Chord Progressions That Hit Different',
      slug: 'tutorials/music-theory-chord-progressions',
      excerpt: 'Learn the chord progressions behind the biggest hits.',
      category: 'Tutorials',
      author: 'Nebula Keys',
      published_at: daysAgo(4),
    },
    {
      title: 'Shure SM7B: The Vocal Mic That Changed Everything',
      slug: 'gear/shure-sm7b-review',
      excerpt: 'The SM7B is the most versatile dynamic mic ever made.',
      category: 'Gear',
      author: 'KVNG Beats',
      published_at: daysAgo(10),
    },
    {
      title: 'Phonk Production Masterclass: Memphis Rap Meets Modern Bass',
      slug: 'tutorials/phonk-production-masterclass',
      excerpt: 'Dive into the world of phonk production techniques.',
      category: 'Tutorials',
      author: 'Phantom 808',
      published_at: daysAgo(10),
    },
    {
      title: 'Beginner\'s Guide to Mixing Trap Beats — EQ, Compression & More',
      slug: 'tutorials/beginners-guide-mixing-trap',
      excerpt: 'Learn the fundamentals of EQ, compression, and gain staging.',
      category: 'Tutorials',
      author: 'KVNG Beats',
      published_at: daysAgo(1),
    },
    {
      title: 'Yamaha HS8 Studio Monitors: Honest Sound at a Fair Price',
      slug: 'gear/yamaha-hs8-studio-monitors',
      excerpt: 'The Yamaha HS8s deliver flat, honest monitoring for every mix.',
      category: 'Gear',
      author: 'Melo Circuit',
      published_at: daysAgo(7),
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trapfrequency.com';
  const items = getMockFeedItems();
  const buildDate = new Date().toUTCString();

  const rssItems = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${siteUrl}/${item.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${item.slug}</guid>
      <description>${escapeXml(item.excerpt)}</description>
      <category>${escapeXml(item.category)}</category>
      <dc:creator>${escapeXml(item.author)}</dc:creator>
      <pubDate>${new Date(item.published_at).toUTCString()}</pubDate>
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
    <title>TrapFrequency — Tune Into The Craft</title>
    <link>${siteUrl}</link>
    <description>Music production tutorials, beats, gear reviews, and producer spotlights. The ultimate hub for producers, beatmakers, and audio engineers.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${siteUrl}/logo.png</url>
      <title>TrapFrequency</title>
      <link>${siteUrl}</link>
    </image>
    <copyright>© ${new Date().getFullYear()} TrapFrequency. All rights reserved.</copyright>
    <managingEditor>beats@trapfrequency.com (TrapFrequency)</managingEditor>
    <webMaster>beats@trapfrequency.com (TrapFrequency)</webMaster>
    <category>Music Production</category>
    <category>Beats</category>
    <category>Tutorials</category>
    <category>Gear Reviews</category>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
