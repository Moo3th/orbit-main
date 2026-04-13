import mongoose from 'mongoose';

// About Section Settings (Vision, Mission, Promises)
const aboutSectionSchema = new mongoose.Schema({
  visionTitleEn: { type: String, default: 'Vision' },
  visionTitleAr: { type: String, default: 'الرؤية' },
  visionTextEn: { type: String, default: 'To be the first and most trusted technical partner in the Kingdom and beyond' },
  visionTextAr: { type: String, default: 'أن نكون الشريك التقني الأول والأكثر ثقة في المملكة وخارجها' },
  
  missionTitleEn: { type: String, default: 'Mission' },
  missionTitleAr: { type: String, default: 'الرسالة' },
  missionTextEn: { type: String, default: 'Providing innovative technical solutions with quality and professionalism that meet our clients\' changing needs' },
  missionTextAr: { type: String, default: 'تقديم حلول تقنية مبتكرة بجودة واحترافية تلبي احتياجات عملائنا المتغيرة' },
  
  promisesTitleEn: { type: String, default: 'We Promise You' },
  promisesTitleAr: { type: String, default: 'نعدكم' },
  promises: [{
    textEn: String,
    textAr: String,
  }]
});

// Why ORBIT Section Settings
const whyOrbitSectionSchema = new mongoose.Schema({
  stats: [{
    number: String,
    labelEn: String,
    labelAr: String,
  }],
  features: [{
    textEn: String,
    textAr: String,
    descriptionEn: String,
    descriptionAr: String,
  }]
});

// Main schema combining all sections
const mainPageSettingsSchema = new mongoose.Schema({
  about: { type: aboutSectionSchema, default: () => ({}) },
  whyOrbit: { type: whyOrbitSectionSchema, default: () => ({}) },
}, {
  timestamps: true,
});

export default mongoose.models.MainPageSettings || mongoose.model('MainPageSettings', mainPageSettingsSchema);

