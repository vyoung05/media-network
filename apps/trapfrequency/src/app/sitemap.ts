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
    .eq('brand', 'trapfrequency')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const base = 'https://trapfrequency.com';

  const staticPages = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${base}/archive`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.8 },
  ];

  const articlePages = (articles || []).map((a) => ({
    url: `${base}/${a.slug}`,
    lastModified: new Date(a.updated_at || a.published_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...articlePages];
}
