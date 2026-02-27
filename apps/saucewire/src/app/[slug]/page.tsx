import { notFound } from 'next/navigation';
import { getArticleBySlug, getTrendingArticles, mockArticles } from '@/lib/mock-data';
import { ArticlePageClient } from './ArticlePageClient';

interface ArticlePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return mockArticles.map((article) => ({
    slug: article.slug,
  }));
}

export function generateMetadata({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);
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

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = getArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = mockArticles
    .filter(a => a.id !== article.id && a.category === article.category)
    .slice(0, 4);

  const trendingArticles = getTrendingArticles(5);

  return (
    <ArticlePageClient
      article={article}
      relatedArticles={relatedArticles}
      trendingArticles={trendingArticles}
    />
  );
}
