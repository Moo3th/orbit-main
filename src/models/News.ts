import mongoose, { Schema, Model } from 'mongoose';

export interface LocalizedText {
  en?: string;
  ar?: string;
}

export interface NewsFaqItem {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface NewsSeo {
  title?: LocalizedText;
  description?: LocalizedText;
  keywords?: LocalizedText;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
}

export interface INews {
  _id?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  content?: string;
  contentAr?: string;
  /** How `content`/`contentAr` are stored. Existing posts are HTML; new long-form articles use markdown. */
  contentFormat?: 'html' | 'markdown';
  image?: string;
  images?: string[];
  /** Cover image alt text (bilingual, falls back to title). */
  imageAlt?: LocalizedText;
  category: string;
  slug: string;
  /** Optional byline / author shown in UI and Article JSON-LD. */
  author?: string;
  /** Free-form tags used for keywords / related content. */
  tags?: string[];
  /** Per-post SEO overrides; falls back to site defaults via lib/seo. */
  seo?: NewsSeo;
  /** Frequently asked questions rendered on the page and emitted as FAQPage JSON-LD. */
  faq?: NewsFaqItem[];
  isActive: boolean;
  featured?: boolean;
  publishedAt?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const localizedTextSchema = new Schema<LocalizedText>(
  {
    en: { type: String, default: '' },
    ar: { type: String, default: '' },
  },
  { _id: false }
);

const newsFaqSchema = new Schema<NewsFaqItem>(
  {
    question: { type: localizedTextSchema, default: () => ({}) },
    answer: { type: localizedTextSchema, default: () => ({}) },
  },
  { _id: false }
);

const newsSeoSchema = new Schema<NewsSeo>(
  {
    title: { type: localizedTextSchema, default: () => ({}) },
    description: { type: localizedTextSchema, default: () => ({}) },
    keywords: { type: localizedTextSchema, default: () => ({}) },
    canonical: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false }
);

const newsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: true,
    },
    titleAr: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
    },
    content: {
      type: String,
    },
    contentAr: {
      type: String,
    },
    contentFormat: {
      type: String,
      enum: ['html', 'markdown'],
      default: 'html',
    },
    image: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    imageAlt: {
      type: localizedTextSchema,
      default: () => ({}),
    },
    category: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    seo: {
      type: newsSeoSchema,
      default: () => ({}),
    },
    faq: {
      type: [newsFaqSchema],
      default: [],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const News = (mongoose.models.News as Model<INews>) || 
  mongoose.model<INews>('News', newsSchema);







