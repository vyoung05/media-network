import type { Metadata } from 'next';
import { BlogPageClient } from './BlogPageClient';
import { mockBlogPosts } from '@/lib/mock-data';

export const metadata: Metadata = {
  title: 'Blog — Features, Interviews & Analysis',
  description: 'Long-form artist features, in-depth interviews, industry analysis, and think pieces on the future of music.',
  openGraph: {
    title: 'TrapGlow Blog',
    description: 'Features, interviews, and music culture analysis.',
  },
};

export default function BlogPage() {
  return <BlogPageClient posts={mockBlogPosts} />;
}
