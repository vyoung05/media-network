import { HomePageClient } from '@/components/HomePageClient';
import {
  getLatestTutorials,
  getFeaturedBeats,
  getTopGearReviews,
  getFeaturedProducers,
  mockFrequencyChart,
  mockSamplePacks,
  mockBeats,
} from '@/lib/mock-data';

export default function HomePage() {
  const tutorials = getLatestTutorials(6);
  const beats = mockBeats;
  const gearReviews = getTopGearReviews(4);
  const producers = getFeaturedProducers();
  const chartEntries = mockFrequencyChart;
  const samplePacks = mockSamplePacks;

  return (
    <HomePageClient
      tutorials={tutorials}
      beats={beats}
      gearReviews={gearReviews}
      producers={producers}
      chartEntries={chartEntries}
      samplePacks={samplePacks}
    />
  );
}
