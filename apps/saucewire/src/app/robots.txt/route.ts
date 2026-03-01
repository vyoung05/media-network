export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://saucewire.com/sitemap.xml

# Crawl-delay for politeness
Crawl-delay: 1
`;

  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
