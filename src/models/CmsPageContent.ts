import mongoose, { Schema, Model } from 'mongoose';

export interface ICmsField {
  key: string;
  value: string;
  valueEn?: string;
  richText?: boolean;
}

export interface ICmsSection {
  id: string;
  type: 'hero' | 'features' | 'pricing' | 'cta' | 'testimonials' | 'trust' | 'custom';
  order: number;
  fields: ICmsField[];
}

export interface ICmsPageContent {
  pageId: string;
  path: string;
  order: number;
  seo: {
    title: { en: string; ar: string };
    description: { en: string; ar: string };
    keywords: { en: string; ar: string };
    canonical: string;
    noIndex: boolean;
  };
  social: {
    ogImage: string;
    ogTitle: { en: string; ar: string };
    ogDescription: { en: string; ar: string };
  };
  sections: ICmsSection[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const cmsFieldSchema = new Schema<ICmsField>({
  key: { type: String, required: true },
  value: { type: String, default: '' },
  valueEn: { type: String },
  richText: { type: Boolean, default: false },
});

const cmsSectionSchema = new Schema<ICmsSection>({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ['hero', 'features', 'pricing', 'cta', 'testimonials', 'trust', 'custom'],
    required: true,
  },
  order: { type: Number, default: 0 },
  fields: [cmsFieldSchema],
});

const cmsPageContentSchema = new Schema<ICmsPageContent>(
  {
    pageId: {
      type: String,
      required: true,
      unique: true,
    },
    path: {
      type: String,
      required: true,
      unique: true,
    },
    order: { type: Number, default: 0 },
    seo: {
      title: {
        en: { type: String, default: '' },
        ar: { type: String, default: '' },
      },
      description: {
        en: { type: String, default: '' },
        ar: { type: String, default: '' },
      },
      keywords: {
        en: { type: String, default: '' },
        ar: { type: String, default: '' },
      },
      canonical: { type: String, default: '' },
      noIndex: { type: Boolean, default: false },
    },
    social: {
      ogImage: { type: String, default: '' },
      ogTitle: {
        en: { type: String, default: '' },
        ar: { type: String, default: '' },
      },
      ogDescription: {
        en: { type: String, default: '' },
        ar: { type: String, default: '' },
      },
    },
    sections: [cmsSectionSchema],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

cmsPageContentSchema.index({ pageId: 1 }, { unique: true });
cmsPageContentSchema.index({ path: 1 }, { unique: true });
cmsPageContentSchema.index({ isActive: 1 });

export const CmsPageContent = (mongoose.models.CmsPageContent as Model<ICmsPageContent>) ||
  mongoose.model<ICmsPageContent>('CmsPageContent', cmsPageContentSchema);
