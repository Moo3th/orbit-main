import mongoose, { Schema, Model } from 'mongoose';

export interface IPartner {
  _id: string;
  name: string;
  logo: string; // URL or path to logo
  website?: string;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new Schema<IPartner>(
  {
    name: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    website: {
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

export const Partner = (mongoose.models.Partner as Model<IPartner>) || 
  mongoose.model<IPartner>('Partner', partnerSchema);

