import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: [
      'https://saucewire.com/sitemap.xml',
      'https://saucewire.com/news-sitemap.xml',
    ],
  };
}
