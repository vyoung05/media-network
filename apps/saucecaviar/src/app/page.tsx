import { HomePageClient } from '@/components/HomePageClient';
import { fetchAllIssues, fetchLatestIssue, fetchTrendingArticles } from '@/lib/supabase';
import { getAllIssues, getLatestIssue } from '@/lib/mock-data';
import { JsonLd } from '@media-network/shared';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Try Supabase first, fall back to mock data
  let latestIssue = await fetchLatestIssue();
  let allIssues = await fetchAllIssues();

  // Fallback to mock data if Supabase returns nothing
  if (!latestIssue) latestIssue = getLatestIssue();
  if (allIssues.length === 0) allIssues = getAllIssues();

  // Fetch trending articles from Supabase
  const trendingArticles = await fetchTrendingArticles(8);

  return (
    <>
      <JsonLd
        type="organization"
        name="SauceCaviar"
        url="https://saucecaviar.com"
        description="Culture Served Premium. Fashion, music, art, culture, and lifestyle — the finest editorial experience."
      />
      <HomePageClient
        latestIssue={latestIssue}
        allIssues={allIssues}
        trendingArticles={trendingArticles}
      />
    </>
  );
}
