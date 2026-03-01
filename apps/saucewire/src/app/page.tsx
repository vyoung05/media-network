import { HomePageClient } from '@/components/HomePageClient';
import {
  fetchArticles,
  fetchBreakingArticles,
  fetchTrendingArticles,
} from '@/lib/supabase';
import { JsonLd } from '@media-network/shared';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [{ articles }, breakingArticles, trendingArticles] = await Promise.all([
    fetchArticles({ per_page: 20 }),
    fetchBreakingArticles(),
    fetchTrendingArticles(8),
  ]);

  return (
    <>
      <JsonLd
        type="organization"
        name="SauceWire"
        url="https://saucewire.com"
        description="Culture. Connected. Now. Breaking news and culture coverage — hip-hop, fashion, entertainment, sports, and tech."
      />
      <HomePageClient
        articles={articles}
        breakingArticles={breakingArticles}
        trendingArticles={trendingArticles}
      />
    </>
  );
}
