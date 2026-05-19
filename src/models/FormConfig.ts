import mongoose from 'mongoose';

const formFieldOptionSchema = new mongoose.Schema({
  value: { type: String, required: true, trim: true },
  labelAr: { type: String, required: true, trim: true },
  labelEn: { type: String, required: true, trim: true },
}, { _id: false });

const formFieldSchema = new mongoose.Schema({
  id: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['text', 'textarea', 'email', 'tel', 'number', 'select', 'multiselect', 'radio', 'rating', 'scale', 'date', 'time', 'file', 'richtext', 'spacing', 'divider'], default: 'text' },
  labelAr: { type: String, required: true, trim: true },
  labelEn: { type: String, required: true, trim: true },
  placeholderAr: { type: String, default: '', trim: true },
  placeholderEn: { type: String, default: '', trim: true },
  required: { type: Boolean, default: false },
  step: { type: Number, default: 2 },
  min: { type: Number, default: 1 },
  max: { type: Number, default: 10 },
  stepSize: { type: Number, default: 1 },
  ratingType: { type: String, enum: ['star', 'emoji', 'number'], default: 'number' },
  htmlContent: { type: String, default: '' },
  spacingSize: { type: String, enum: ['sm', 'md', 'lg', 'xl'], default: 'md' },
  options: { type: [formFieldOptionSchema], default: [] },
}, { _id: false });

const formConfigSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true, trim: true },
  productName: { type: String, required: true, trim: true },
  productNameEn: { type: String, required: true, trim: true },
  titleAr: { type: String, trim: true },
  titleEn: { type: String, trim: true },
  thankYouMessageAr: { type: String, trim: true },
  thankYouMessageEn: { type: String, trim: true },
  formType: { type: String, enum: ['service', 'survey'], default: 'service' },
  displayMode: { type: String, enum: ['wizard', 'single'], default: 'wizard' },
  acceptingResponses: { type: Boolean, default: true },
  closedMessageAr: { type: String, trim: true },
  closedMessageEn: { type: String, trim: true },
  slug: { type: String, trim: true, index: true },
  customDomain: { type: String, trim: true, index: true },
  notificationEmails: { type: String, default: '' },
  primaryColor: { type: String, default: '#7A1E2E' },
  buttonTextColor: { type: String, default: '#FFFFFF' },
  buttonHoverColor: { type: String, default: '#601824' },
  optionSelectedTextColor: { type: String, default: '#FFFFFF' },
  formBgColor: { type: String, default: '#f9fafb' },
  formCardBgColor: { type: String, default: '#ffffff' },
  formTitleColor: { type: String, default: '#161616' },
  fieldLabelColor: { type: String, default: '#374151' },
  fieldBorderColor: { type: String, default: '#d1d5db' },
  optionBgColor: { type: String, default: '#ffffff' },
  optionBorderColor: { type: String, default: '#e5e7eb' },
  optionTextColor: { type: String, default: '#111827' },
  successColor: { type: String, default: '#16a34a' },
  showRefillButton: { type: Boolean, default: false },
  showBackToFormButton: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  fields: { type: [formFieldSchema], default: [] },
}, { timestamps: true });

export default mongoose.models.FormConfig || mongoose.model('FormConfig', formConfigSchema);