import { connectDB } from '@/lib/mongodb';
import { News } from '@/models/News';

export interface BlogPostRecord {
  _id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  content?: string;
  contentAr?: string;
  image?: string;
  category: string;
  slug: string;
  isActive: boolean;
  featured?: boolean;
  publishedAt?: string;
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
  image?: string;
  category?: string;
  slug?: string;
  isActive?: boolean;
  featured?: boolean;
  publishedAt?: Date | string;
  order?: number;
};

const toPostRecord = (row: RawPost): BlogPostRecord => ({
  _id: typeof row._id === 'string' ? row._id : String(row._id ?? ''),
  title: row.title || '',
  titleAr: row.titleAr || '',
  description: row.description || '',
  descriptionAr: row.descriptionAr || '',
  content: row.content || '',
  contentAr: row.contentAr || '',
  image: row.image || '',
  category: row.category || 'General',
  slug: row.slug || '',
  isActive: Boolean(row.isActive),
  featured: Boolean(row.featured),
  publishedAt: row.publishedAt ? new Date(row.publishedAt).toISOString() : undefined,
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
  return row ? toPostRecord(row) : null;
}
