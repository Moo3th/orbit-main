import mongoose from 'mongoose';

const formSubmissionSchema = new mongoose.Schema({
  formId: { type: String, required: true, trim: true },
  productId: { type: String, required: true, trim: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
}, { timestamps: true });

formSubmissionSchema.index({ formId: 1, createdAt: -1 });
formSubmissionSchema.index({ productId: 1, createdAt: -1 });

export default mongoose.models.FormSubmission || mongoose.model('FormSubmission', formSubmissionSchema);