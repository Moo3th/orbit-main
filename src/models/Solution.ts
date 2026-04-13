import mongoose, { Schema, Model } from 'mongoose';

export interface ISolutionFeature {
  en: string;
  ar: string;
  icon: string;
}

export interface ISolution {
  _id: string;
  slug: string; // 'sms-platform', 'whatsapp-business-api', 'otime', 'gov-gate'
  title: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  heroImage?: string;
  features: ISolutionFeature[];
  benefits?: {
    en: string[];
    ar: string[];
  };
  useCases?: {
    en: string[];
    ar: string[];
  };
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const solutionFeatureSchema = new Schema({
  en: { type: String, required: true },
  ar: { type: String, required: true },
  icon: { type: String, required: true },
}, { _id: false });

const solutionSchema = new Schema<ISolution>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      enum: ['sms-platform', 'whatsapp-business-api', 'otime', 'gov-gate', 'healthcare'],
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
    features: [solutionFeatureSchema],
    benefits: {
      en: [{ type: String }],
      ar: [{ type: String }],
    },
    useCases: {
      en: [{ type: String }],
      ar: [{ type: String }],
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

export const Solution = (mongoose.models.Solution as Model<ISolution>) || 
  mongoose.model<ISolution>('Solution', solutionSchema);






