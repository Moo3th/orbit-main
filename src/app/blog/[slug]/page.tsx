import { notFound } from 'next/navigation';
import BlogPostPageClient from '@/components/blog/BlogPostPageClient';
import { getPublishedBlogPostBySlug } from '@/lib/blog/server';

export const dynamic = 'force-dynamic';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(decodeURIComponent(slug));

  if (!post) {
    notFound();
  }

  return <BlogPostPageClient post={post} />;
}
