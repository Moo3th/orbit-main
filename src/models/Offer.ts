import mongoose, { Schema, Model } from 'mongoose';

export interface IOffer {
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
  startDate?: Date;
  endDate?: Date;
  order: number;
  // Package discount fields
  packageId?: string;
  discountPercentage?: number;
  originalPrice?: number;
  discountedPrice?: number;
  theme?: 'national-day' | 'founding-day' | 'black-friday' | 'custom';
  createdAt: Date;
  updatedAt: Date;
}

const offerSchema = new Schema<IOffer>(
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
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    order: {
      type: Number,
      default: 0,
    },
    packageId: {
      type: String,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    originalPrice: {
      type: Number,
    },
    discountedPrice: {
      type: Number,
    },
    theme: {
      type: String,
      enum: ['national-day', 'founding-day', 'black-friday', 'custom'],
      default: 'custom',
    },
  },
  { timestamps: true }
);

export const Offer = (mongoose.models.Offer as Model<IOffer>) || 
  mongoose.model<IOffer>('Offer', offerSchema);
