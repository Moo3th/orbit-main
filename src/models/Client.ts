import mongoose, { Schema, Model } from 'mongoose';

export interface IClient {
  _id: string;
  name: string;
  logo?: string;
  category: string;
  description?: string;
  blogText?: string;
  workImages?: string[];
  workVideo?: string[];
  services?: string[];
  slug?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const clientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Automotive',
        'Communication',
        'Corporate',
        'Food & Beverages',
        'Construction & Real Estate',
        'Health',
        'Governmental',
        'Fashion & Beauty',
        'Home & Furniture',
        'Hospitality & Entertainment',
        'Sports',
      ],
    },
    description: {
      type: String,
    },
    blogText: {
      type: String,
    },
    workImages: {
      type: [String],
      default: [],
    },
    workVideo: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
    },
    services: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Client = (mongoose.models.Client as Model<IClient>) || 
  mongoose.model<IClient>('Client', clientSchema);

