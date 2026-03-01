import { notFound } from 'next/navigation';
import { SAUCEWIRE_CATEGORIES } from '@media-network/shared';
import { CategoryPageClient } from './CategoryPageClient';
import { fetchArticlesByCategory, fetchTrendingArticles } from '@/lib/supabase';

export const revalidate = 60;

interface CategoryPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return SAUCEWIRE_CATEGORIES.map((cat) => ({
    slug: cat.toLowerCase(),
  }));
}

export function generateMetadata({ params }: CategoryPageProps) {
  const category = SAUCEWIRE_CATEGORIES.find(
    (c) => c.toLowerCase() === params.slug.toLowerCase()
  );
  if (!category) return {};

  return {
    title: `${category} News`,
    description: `Latest ${category.toLowerCase()} news and updates from SauceWire.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = SAUCEWIRE_CATEGORIES.find(
    (c) => c.toLowerCase() === params.slug.toLowerCase()
  );

  if (!category) {
    notFound();
  }

  const [articles, trendingArticles] = await Promise.all([
    fetchArticlesByCategory(category),
    fetchTrendingArticles(5),
  ]);

  return (
    <CategoryPageClient
      category={category}
      articles={articles}
      trendingArticles={trendingArticles}
    />
  );
}
