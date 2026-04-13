import mongoose, { Schema, Model } from 'mongoose';

export interface ISiteCms {
  _id: string;
  key: string;
  pages: unknown[];
  partners: unknown[];
  socialLinks: unknown[];
  contactSubmissions: unknown[];
  notificationEmail: string;
  footerData: Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const siteCmsSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: 'primary',
    },
    pages: { type: [Schema.Types.Mixed], default: [] },
    partners: { type: [Schema.Types.Mixed], default: [] },
    socialLinks: { type: [Schema.Types.Mixed], default: [] },
    contactSubmissions: { type: [Schema.Types.Mixed], default: [] },
    notificationEmail: {
      type: String,
      default: 'sales@orbit.sa',
    },
    footerData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const existingSiteCmsModel = mongoose.models.SiteCms as Model<unknown> | undefined;

// In dev hot-reload, Mongoose may keep an old schema in memory.
// Rebuild the model if the new footerData path is missing.
if (existingSiteCmsModel && !existingSiteCmsModel.schema.path('footerData')) {
  delete mongoose.models.SiteCms;
}

const SiteCms = (mongoose.models.SiteCms as Model<unknown>) ||
  mongoose.model('SiteCms', siteCmsSchema);

export default SiteCms;
