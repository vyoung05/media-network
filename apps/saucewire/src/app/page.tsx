import { HomePageClient } from '@/components/HomePageClient';
import {
  mockArticles,
  getBreakingArticles,
  getTrendingArticles,
} from '@/lib/mock-data';

export default function HomePage() {
  const breakingArticles = getBreakingArticles();
  const trendingArticles = getTrendingArticles(8);
  const feedArticles = mockArticles;

  return (
    <HomePageClient
      articles={feedArticles}
      breakingArticles={breakingArticles}
      trendingArticles={trendingArticles}
    />
  );
}
