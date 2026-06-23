import { connectDB } from '@/lib/mongodb';
import { News } from '@/models/News';
import { resolveContentHtml } from '@/lib/blog/markdown';
import type { LocalizedText, NewsFaqItem, NewsSeo } from '@/models/News';

export interface BlogPostRecord {
  _id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  content?: string;
  contentAr?: string;
  contentFormat: 'html' | 'markdown';
  /** Body resolved to HTML (markdown converted, html passed through). Populated for single-post fetches. */
  contentHtml?: string;
  contentArHtml?: string;
  image?: string;
  imageAlt?: LocalizedText;
  category: string;
  author?: string;
  tags?: string[];
  seo?: NewsSeo;
  faq?: NewsFaqItem[];
  slug: string;
  isActive: boolean;
  featured?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  order: number;
}

type RawPost = {
  _id: unknown;
  title?: string;
  titleAr?: string;
  description?: string;
  descriptionAr?: string;
  content?: string;
  contentAr?: string;
  contentFormat?: 'html' | 'markdown';
  image?: string;
  imageAlt?: LocalizedText;
  category?: string;
  author?: string;
  tags?: string[];
  seo?: NewsSeo;
  faq?: NewsFaqItem[];
  slug?: string;
  isActive?: boolean;
  featured?: boolean;
  publishedAt?: Date | string;
  updatedAt?: Date | string;
  order?: number;
};

const cleanFaq = (faq?: NewsFaqItem[]): NewsFaqItem[] =>
  (Array.isArray(faq) ? faq : [])
    .map((item) => ({
      question: { en: item?.question?.en || '', ar: item?.question?.ar || '' },
      answer: { en: item?.answer?.en || '', ar: item?.answer?.ar || '' },
    }))
    .filter((item) => (item.question.ar || item.question.en) && (item.answer.ar || item.answer.en));

const toPostRecord = (row: RawPost): BlogPostRecord => ({
  _id: typeof row._id === 'string' ? row._id : String(row._id ?? ''),
  title: row.title || '',
  titleAr: row.titleAr || '',
  description: row.description || '',
  descriptionAr: row.descriptionAr || '',
  content: row.content || '',
  contentAr: row.contentAr || '',
  contentFormat: row.contentFormat === 'markdown' ? 'markdown' : 'html',
  image: row.image || '',
  imageAlt: { en: row.imageAlt?.en || '', ar: row.imageAlt?.ar || '' },
  category: row.category || 'General',
  author: row.author || '',
  tags: Array.isArray(row.tags) ? row.tags.filter(Boolean) : [],
  seo: row.seo || {},
  faq: cleanFaq(row.faq),
  slug: row.slug || '',
  isActive: Boolean(row.isActive),
  featured: Boolean(row.featured),
  publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : undefined,
  updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
  order: typeof row.order === 'number' ? row.order : 0,
});

export async function getPublishedBlogPosts(): Promise<BlogPostRecord[]> {
  await connectDB();
  const rows = (await News.find({ isActive: true })
    .sort({ featured: -1, order: 1, publishedAt: -1, createdAt: -1 })
    .lean()) as RawPost[];
  return rows.map(toPostRecord);
}

export async function getPublishedBlogPostBySlug(slug: string): Promise<BlogPostRecord | null> {
  await connectDB();
  const row = (await News.findOne({ slug, isActive: true }).lean()) as RawPost | null;
  if (!row) return null;
  const record = toPostRecord(row);
  // Resolve the full body to HTML only for the single-post view (avoids markdown
  // rendering for every card on the list page).
  record.contentHtml = resolveContentHtml(record.content, record.contentFormat);
  record.contentArHtml = resolveContentHtml(record.contentAr, record.contentFormat);
  return record;
}
