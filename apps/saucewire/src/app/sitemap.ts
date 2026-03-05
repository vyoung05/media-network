import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: { fetch: (url, init) => fetch(url, { ...init, cache: 'no-store' }) },
  });

  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at, published_at')
    .eq('brand', 'saucewire')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const base = 'https://saucewire.com';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/archive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/write`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const articlePages: MetadataRoute.Sitemap = (articles || []).map((a) => ({
    url: `${base}/${a.slug}`,
    lastModified: new Date(a.updated_at || a.published_at),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
