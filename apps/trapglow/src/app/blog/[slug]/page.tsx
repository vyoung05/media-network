import { notFound } from 'next/navigation';
import { fetchArticleBySlug, fetchArticles } from '@/lib/supabase';
import { BlogPostClient } from './BlogPostClient';
import { JsonLd } from '@media-network/shared';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const article = await fetchArticleBySlug(params.slug);
  if (!article) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trapglow.com';
  const ogParams = new URLSearchParams({
    title: article.title,
    type: 'blog',
    ...(article.category && { category: article.category }),
    ...(article.author?.name && { author: article.author.name }),
    ...(article.cover_image && { image: article.cover_image }),
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const article = await fetchArticleBySlug(params.slug);

  if (!article) {
    notFound();
  }

  // Map article to the post shape expected by the client
  const post = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt || '',
    body: article.body,
    cover_image: article.cover_image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
    category: article.category,
    tags: article.tags,
    author: article.author || {
      id: 'system',
      email: 'system@trapglow.com',
      name: 'TrapGlow',
      role: 'writer' as const,
      avatar_url: null,
      bio: null,
      links: {},
      brand_affiliations: ['trapglow' as const],
      is_verified: true,
      created_at: article.created_at,
      updated_at: article.created_at,
    },
    reading_time_minutes: article.reading_time_minutes,
    view_count: article.view_count,
    published_at: article.published_at || article.created_at,
    created_at: article.created_at,
  };

  // Get related posts
  const { articles: allArticles } = await fetchArticles({ category: article.category, per_page: 4 });
  const relatedPosts = allArticles
    .filter((a) => a.id !== article.id)
    .slice(0, 3)
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt || '',
      body: a.body,
      cover_image: a.cover_image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
      category: a.category,
      tags: a.tags,
      author: a.author || post.author,
      reading_time_minutes: a.reading_time_minutes,
      view_count: a.view_count,
      published_at: a.published_at || a.created_at,
      created_at: a.created_at,
    }));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trapglow.com';

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
        publisher={{ name: 'TrapGlow', url: siteUrl }}
        url={`${siteUrl}/blog/${article.slug}`}
      />
      <JsonLd
        type="breadcrumb"
        items={[
          { name: 'Home', url: siteUrl },
          { name: 'Blog', url: `${siteUrl}/blog` },
          { name: article.title, url: `${siteUrl}/blog/${article.slug}` },
        ]}
      />
      <BlogPostClient
        post={post}
        relatedPosts={relatedPosts}
      />
    </>
  );
}
