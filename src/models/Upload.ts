import mongoose from 'mongoose';

const UploadSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadedBy: { type: String, default: 'admin' },
  folder: { type: String, default: 'general' },
}, { timestamps: true });

UploadSchema.index({ filename: 1 });

export const Upload = mongoose.models.Upload || mongoose.model('Upload', UploadSchema);
