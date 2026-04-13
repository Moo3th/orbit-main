import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    descriptionAr: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    durationAr: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    featuresAr: {
      type: [String],
      required: true,
    },
    icon: {
      type: String,
      default: '📦',
    },
    highlighted: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);

