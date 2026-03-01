import { HomePageClient } from '@/components/HomePageClient';
import {
  fetchArticles,
  fetchBreakingArticles,
  fetchTrendingArticles,
} from '@/lib/supabase';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const [{ articles }, breakingArticles, trendingArticles] = await Promise.all([
    fetchArticles({ per_page: 20 }),
    fetchBreakingArticles(),
    fetchTrendingArticles(8),
  ]);

  return (
    <HomePageClient
      articles={articles}
      breakingArticles={breakingArticles}
      trendingArticles={trendingArticles}
    />
  );
}
