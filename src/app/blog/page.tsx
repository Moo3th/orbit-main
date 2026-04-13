import BlogListPageClient from '@/components/blog/BlogListPageClient';
import { getPublishedBlogPosts } from '@/lib/blog/server';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  return <BlogListPageClient posts={posts} />;
}
