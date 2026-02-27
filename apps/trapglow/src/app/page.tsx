import { HomePageClient } from '@/components/HomePageClient';
import {
  mockArtists,
  getFeaturedArtists,
  getDailyPicks,
  getGlowUpLeaderboard,
  getTrendingPosts,
} from '@/lib/mock-data';

export default function HomePage() {
  const featuredArtists = getFeaturedArtists();
  const dailyPicks = getDailyPicks();
  const leaderboardArtists = getGlowUpLeaderboard();
  const trendingPosts = getTrendingPosts(5);

  return (
    <HomePageClient
      featuredArtists={featuredArtists}
      dailyPicks={dailyPicks}
      leaderboardArtists={leaderboardArtists}
      trendingPosts={trendingPosts}
      allArtists={mockArtists}
    />
  );
}
