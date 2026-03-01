import { HomePageClient } from '@/components/HomePageClient';
import {
  getLatestTutorials,
  getBeats,
  getTopGearReviews,
  getFeaturedProducers,
  getSamplePacks,
  getFeaturedBeats,
} from '@/lib/supabase';
import { JsonLd } from '@media-network/shared';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [tutorials, beats, gearReviews, producers, samplePacks] = await Promise.all([
    getLatestTutorials(6),
    getBeats(),
    getTopGearReviews(4),
    getFeaturedProducers(),
    getSamplePacks(),
  ]);

  // Build frequency chart from beats sorted by plays
  const sortedByPlays = [...beats].sort((a, b) => b.plays - a.plays);
  const chartEntries = sortedByPlays.slice(0, 10).map((beat, i) => ({
    rank: i + 1,
    beat,
    previousRank: i === 0 ? 2 : i === 1 ? 1 : i + 2 <= 10 ? i + 2 : null,
    weeksOnChart: Math.max(1, 14 - i * 2),
  }));

  return (
    <>
      <JsonLd
        type="organization"
        name="TrapFrequency"
        url="https://trapfrequency.com"
        description="Tune Into The Craft. Tutorials, beats, gear reviews, and producer spotlights for music creators."
      />
      <HomePageClient
        tutorials={tutorials}
        beats={beats}
        gearReviews={gearReviews}
        producers={producers}
        chartEntries={chartEntries}
        samplePacks={samplePacks}
      />
    </>
  );
}
