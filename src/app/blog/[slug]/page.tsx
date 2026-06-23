import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BlogPostPageClient from '@/components/blog/BlogPostPageClient';
import { getPublishedBlogPostBySlug } from '@/lib/blog/server';
import { buildBlogPostJsonLd } from '@/lib/blog/jsonld';
import { getCachedSeoSettings, generatePageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const postPath = (slug: string) => `/blog/${slug}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const [post, settings] = await Promise.all([
    getPublishedBlogPostBySlug(decodedSlug),
    getCachedSeoSettings(),
  ]);

  if (!post) return {};

  const baseUrl = settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa';
  const canonical = post.seo?.canonical?.trim() || `${baseUrl}${postPath(decodedSlug)}`;

  const normalizedPage = {
    seo: {
      title: {
        ar: post.seo?.title?.ar || post.titleAr || post.title,
        en: post.seo?.title?.en || post.title,
      },
      description: {
        ar: post.seo?.description?.ar || post.descriptionAr || post.description,
        en: post.seo?.description?.en || post.description,
      },
      keywords: {
        ar: post.seo?.keywords?.ar || (post.tags || []).join('، '),
        en: post.seo?.keywords?.en || (post.tags || []).join(', '),
      },
      canonical,
      noIndex: post.seo?.noIndex || false,
    },
    social: {
      ogImage: post.seo?.ogImage || post.image || undefined,
    },
    path: postPath(decodedSlug),
  };

  return generatePageMetadata(normalizedPage, settings);
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const [post, settings] = await Promise.all([
    getPublishedBlogPostBySlug(decodedSlug),
    getCachedSeoSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const baseUrl = settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa';
  const pageUrl = post.seo?.canonical?.trim() || `${baseUrl}${postPath(decodedSlug)}`;
  const jsonLd = buildBlogPostJsonLd(post, settings, pageUrl);

  return (
    <>
      {jsonLd.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      <BlogPostPageClient post={post} />
    </>
  );
}
