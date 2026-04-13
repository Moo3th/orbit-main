import mongoose from 'mongoose';

const clientInquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['quote', 'contact', 'general'],
      default: 'quote',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    serviceType: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
    },
    selectedPackage: {
      type: String,
    },
    packageName: {
      type: String,
    },
    packageType: {
      type: String,
    },
    packagePrice: {
      type: String,
    },
    source: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'converted', 'closed'],
      default: 'new',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    assignedTo: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.ClientInquiry ||
  mongoose.model('ClientInquiry', clientInquirySchema);

