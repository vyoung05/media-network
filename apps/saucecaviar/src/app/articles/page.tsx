import { fetchArticles } from '@/lib/supabase';
import { ArticlesPageClient } from './ArticlesPageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'The latest stories from SauceCaviar — fashion, music, art, culture, and luxury lifestyle.',
};

export default async function ArticlesPage() {
  const { articles } = await fetchArticles({ per_page: 24 });
  return <ArticlesPageClient articles={articles} />;
}
