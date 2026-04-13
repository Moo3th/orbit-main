import mongoose from 'mongoose';

const whatsAppRequestSchema = new mongoose.Schema({
  planId: {
    type: String,
    required: true,
    trim: true,
  },
  tierId: {
    type: String,
    required: true,
    trim: true,
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
  companyName: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
  },
  goal: {
    type: String,
    trim: true,
  },
  employeeCount: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new',
  },
}, {
  timestamps: true,
});

export default mongoose.models.WhatsAppRequest ||
  mongoose.model('WhatsAppRequest', whatsAppRequestSchema);
