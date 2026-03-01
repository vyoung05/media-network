import { HomePageClient } from '@/components/HomePageClient';
import {
  getArtists,
  getFeaturedArtists,
  getDailyPicks,
  getGlowUpLeaderboard,
} from '@/lib/supabase';
import { getTrendingPosts } from '@/lib/mock-data';
import { JsonLd } from '@media-network/shared';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [allArtists, featuredArtists, dailyPicks, leaderboardArtists] = await Promise.all([
    getArtists(),
    getFeaturedArtists(),
    getDailyPicks(),
    getGlowUpLeaderboard(10),
  ]);

  // Blog posts still from mock data (they're not in the artists table)
  const trendingPosts = getTrendingPosts(5);

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
        trendingPosts={trendingPosts}
        allArtists={allArtists}
      />
    </>
  );
}
