import type { Metadata } from 'next';
import { BlogPageClient } from './BlogPageClient';
import { fetchArticles } from '@/lib/supabase';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Blog — Features, Interviews & Analysis',
  description: 'Long-form artist features, in-depth interviews, industry analysis, and think pieces on the future of music.',
  openGraph: {
    title: 'TrapGlow Blog',
    description: 'Features, interviews, and music culture analysis.',
  },
};

export default async function BlogPage() {
  const { articles } = await fetchArticles({ per_page: 20 });

  // Map articles to BlogPost-like shape for the client component
  const posts = articles.map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt || '',
    body: a.body,
    cover_image: a.cover_image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
    category: a.category,
    tags: a.tags,
    author: a.author || {
      id: 'system',
      email: 'system@trapglow.com',
      name: 'TrapGlow',
      role: 'writer' as const,
      avatar_url: null,
      bio: null,
      links: {},
      brand_affiliations: ['trapglow' as const],
      is_verified: true,
      created_at: a.created_at,
      updated_at: a.created_at,
    },
    reading_time_minutes: a.reading_time_minutes,
    view_count: a.view_count,
    published_at: a.published_at || a.created_at,
    created_at: a.created_at,
  }));

  return <BlogPageClient posts={posts} />;
}
