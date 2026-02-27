import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getRelatedPosts, mockBlogPosts, getArtistBySlug, mockArtists } from '@/lib/mock-data';
import { BlogPostClient } from './BlogPostClient';

interface BlogPostPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return mockBlogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export function generateMetadata({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image],
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.cover_image],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post.id, 3);
  const associatedArtist = post.artist_id
    ? mockArtists.find(a => a.id === post.artist_id)
    : undefined;

  return (
    <BlogPostClient
      post={post}
      relatedPosts={relatedPosts}
      artist={associatedArtist}
    />
  );
}
