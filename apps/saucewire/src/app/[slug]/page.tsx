import { notFound } from 'next/navigation';
import { fetchArticleBySlug, fetchTrendingArticles, fetchArticles, fetchAudioUrl } from '@/lib/supabase';
import { ArticlePageClient } from './ArticlePageClient';

export const revalidate = 60;

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: article.cover_image ? [article.cover_image] : [],
      type: 'article',
      publishedTime: article.published_at || undefined,
      authors: article.author ? [article.author.name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.title,
      images: article.cover_image ? [article.cover_image] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await fetchArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const [{ articles: allArticles }, trendingArticles, audioUrl] = await Promise.all([
    fetchArticles({ category: article.category, per_page: 5 }),
    fetchTrendingArticles(5),
    fetchAudioUrl(article.id),
  ]);

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 4);

  return (
    <ArticlePageClient
      article={article}
      relatedArticles={relatedArticles}
      trendingArticles={trendingArticles}
      audioUrl={audioUrl}
    />
  );
}
