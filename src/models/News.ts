import mongoose, { Schema, Model } from 'mongoose';

export interface INews {
  _id?: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  content?: string;
  contentAr?: string;
  image?: string;
  images?: string[];
  category: string;
  slug: string;
  isActive: boolean;
  featured?: boolean;
  publishedAt?: Date;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

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
    image: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
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







