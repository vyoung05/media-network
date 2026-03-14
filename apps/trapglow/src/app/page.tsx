import { HomePageClient } from '@/components/HomePageClient';
import {
  getArtists,
  getFeaturedArtists,
  getDailyPicks,
  getGlowUpLeaderboard,
  fetchTrendingArticles,
} from '@/lib/supabase';
import { JsonLd } from '@media-network/shared';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [allArtists, featuredArtists, dailyPicks, leaderboardArtists, trendingArticles] = await Promise.all([
    getArtists(),
    getFeaturedArtists(),
    getDailyPicks(),
    getGlowUpLeaderboard(10),
    fetchTrendingArticles(8),
  ]);

  return (
    <>
      <JsonLd
        type="organization"
        name="TrapGlow"
        url="https://trapglow.com"
        description="Shining Light on What's Next. Discover emerging artists in hip-hop, R&B, pop, and beyond."
      />
      <HomePageClient
        featuredArtists={featuredArtists}
        dailyPicks={dailyPicks}
        leaderboardArtists={leaderboardArtists}
        trendingArticles={trendingArticles}
        allArtists={allArtists}
      />
    </>
  );
}
