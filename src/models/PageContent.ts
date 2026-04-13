import mongoose, { Schema, Model } from 'mongoose';

export interface IPageContent {
  _id: string;
  pageSlug: string; // 'enterprise', 'healthcare'
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  heroImage?: string;
  challenges?: {
    title: {
      en: string;
      ar: string;
    };
    items: {
      en: string[];
      ar: string[];
    };
  };
  solutions?: {
    title: {
      en: string;
      ar: string;
    };
    items: {
      en: string[];
      ar: string[];
    };
  };
  benefits?: {
    title: {
      en: string;
      ar: string;
    };
    items: {
      en: string[];
      ar: string[];
    };
  };
  cta?: {
    text: {
      en: string;
      ar: string;
    };
    link: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const pageContentSchema = new Schema<IPageContent>(
  {
    pageSlug: {
      type: String,
      required: true,
      unique: true,
      enum: ['enterprise', 'healthcare'],
    },
    title: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
    heroImage: {
      type: String,
    },
    challenges: {
      title: {
        en: { type: String },
        ar: { type: String },
      },
      items: {
        en: [{ type: String }],
        ar: [{ type: String }],
      },
    },
    solutions: {
      title: {
        en: { type: String },
        ar: { type: String },
      },
      items: {
        en: [{ type: String }],
        ar: [{ type: String }],
      },
    },
    benefits: {
      title: {
        en: { type: String },
        ar: { type: String },
      },
      items: {
        en: [{ type: String }],
        ar: [{ type: String }],
      },
    },
    cta: {
      text: {
        en: { type: String },
        ar: { type: String },
      },
      link: { type: String },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const PageContent = (mongoose.models.PageContent as Model<IPageContent>) || 
  mongoose.model<IPageContent>('PageContent', pageContentSchema);







