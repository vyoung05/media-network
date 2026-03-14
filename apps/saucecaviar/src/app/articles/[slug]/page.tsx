import { fetchArticleBySlug, fetchTrendingArticles } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ArticlePageClient } from './ArticlePageClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: article.title,
    description: article.excerpt || `Read "${article.title}" on SauceCaviar`,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.cover_image ? [{ url: article.cover_image }] : undefined,
      type: 'article',
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = await fetchTrendingArticles(4);
  const related = relatedArticles.filter(a => a.id !== article.id).slice(0, 3);

  return <ArticlePageClient article={article} relatedArticles={related} />;
}
