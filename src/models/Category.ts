import mongoose, { Schema, Model } from 'mongoose';

export interface ICategory {
  _id?: string;
  name: string;
  nameAr?: string;
  type: 'news' | 'offer' | 'client';
  slug: string;
  description?: string;
  descriptionAr?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
    },
    type: {
      type: String,
      enum: ['news', 'offer', 'client'],
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    descriptionAr: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Category = (mongoose.models.Category as Model<ICategory>) || 
  mongoose.model<ICategory>('Category', categorySchema);







