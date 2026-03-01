import { notFound } from 'next/navigation';
import { fetchArticleBySlug, fetchTrendingArticles, fetchArticles, fetchAudioUrl } from '@/lib/supabase';
import { ArticlePageClient } from './ArticlePageClient';
import { JsonLd } from '@media-network/shared';

export const revalidate = 60;

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saucewire.com';
  const ogParams = new URLSearchParams({
    title: article.title,
    ...(article.category && { category: article.category }),
    ...(article.author?.name && { author: article.author.name }),
    ...(article.cover_image && { image: article.cover_image }),
    ...(article.is_breaking && { breaking: 'true' }),
  });
  const ogImageUrl = `${siteUrl}/api/og?${ogParams.toString()}`;

  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
      type: 'article',
      publishedTime: article.published_at || undefined,
      authors: article.author ? [article.author.name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.title,
      images: [ogImageUrl],
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://saucewire.com';

  return (
    <>
      <JsonLd
        type="article"
        headline={article.title}
        description={article.excerpt || article.title}
        image={article.cover_image || undefined}
        datePublished={article.published_at || undefined}
        dateModified={article.updated_at || article.published_at || undefined}
        author={article.author ? { name: article.author.name } : undefined}
        publisher={{ name: 'SauceWire', url: siteUrl }}
        url={`${siteUrl}/${article.slug}`}
      />
      <JsonLd
        type="breadcrumb"
        items={[
          { name: 'Home', url: siteUrl },
          { name: article.category || 'Article', url: `${siteUrl}/category/${(article.category || 'news').toLowerCase()}` },
          { name: article.title, url: `${siteUrl}/${article.slug}` },
        ]}
      />
      <ArticlePageClient
        article={article}
        relatedArticles={relatedArticles}
        trendingArticles={trendingArticles}
        audioUrl={audioUrl}
      />
    </>
  );
}
