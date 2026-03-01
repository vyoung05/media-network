import { HomePageClient } from '@/components/HomePageClient';
import {
  getArtists,
  getFeaturedArtists,
  getDailyPicks,
  getGlowUpLeaderboard,
} from '@/lib/supabase';
import { getTrendingPosts } from '@/lib/mock-data';

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
    <HomePageClient
      featuredArtists={featuredArtists}
      dailyPicks={dailyPicks}
      leaderboardArtists={leaderboardArtists}
      trendingPosts={trendingPosts}
      allArtists={allArtists}
    />
  );
}
