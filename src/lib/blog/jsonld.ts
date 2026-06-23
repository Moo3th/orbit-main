import type { BlogPostRecord } from '@/lib/blog/server';
import type { ISeoSettings } from '@/models/SeoSettings';

type JsonLd = Record<string, unknown>;

const pick = (...values: (string | undefined | null)[]): string => {
  for (const v of values) {
    if (v && v.trim()) return v.trim();
  }
  return '';
};

const absoluteUrl = (value: string | undefined, baseUrl: string): string => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return `${baseUrl}${value.startsWith('/') ? '' : '/'}${value}`;
};

/**
 * Build the structured-data graph for a blog post: Article + (optional) FAQPage
 * + BreadcrumbList. Arabic is the primary language, with English fallbacks.
 */
export function buildBlogPostJsonLd(
  post: BlogPostRecord,
  settings: ISeoSettings | null,
  pageUrl: string
): JsonLd[] {
  const baseUrl = settings?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'https://corbit.sa';
  const orgName = settings?.organization?.name || settings?.siteName?.ar || 'CORBIT';
  const logo = absoluteUrl(settings?.organization?.logo || '/logo.png', baseUrl);

  const headline = pick(post.titleAr, post.title);
  const description = pick(post.seo?.description?.ar, post.seo?.description?.en, post.descriptionAr, post.description);
  const image = absoluteUrl(post.seo?.ogImage || post.image, baseUrl);
  const datePublished = post.publishedAt;
  const dateModified = post.updatedAt || post.publishedAt;
  const authorName = pick(post.author, orgName);

  const graph: JsonLd[] = [];

  const article: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    inLanguage: 'ar',
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    author: { '@type': 'Organization', name: authorName },
    publisher: {
      '@type': 'Organization',
      name: orgName,
      logo: { '@type': 'ImageObject', url: logo },
    },
  };
  if (image) article.image = [image];
  if (datePublished) article.datePublished = datePublished;
  if (dateModified) article.dateModified = dateModified;
  if (post.tags && post.tags.length) article.keywords = post.tags.join(', ');
  graph.push(article);

  const faqItems = (post.faq || [])
    .map((item) => ({
      q: pick(item.question?.ar, item.question?.en),
      a: pick(item.answer?.ar, item.answer?.en),
    }))
    .filter((item) => item.q && item.a);

  if (faqItems.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
  }

  graph.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'المدونة', item: `${baseUrl}/blog` },
      { '@type': 'ListItem', position: 3, name: headline, item: pageUrl },
    ],
  });

  return graph;
}
