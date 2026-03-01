export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://trapglow.com/sitemap.xml

Crawl-delay: 1
`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
