/**
 * تحديث بيانات SEO لصفحة الرئيسية بناءً على أبحاث الكلمات المفتاحية (Ahrefs / السوق السعودي).
 * يحافظ على canonical / ogImage / noIndex الحاليّة ويحدّث العنوان/الوصف/الكلمات فقط.
 *
 * التشغيل: node scripts/optimize-home-seo.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const HOME_SEO = {
  title: 'المدار CORBIT | الرسائل النصية وواتساب أعمال API وحلول المراسلة',
  titleEn: 'CORBIT | SMS & WhatsApp Business API Messaging Solutions in Saudi Arabia',
  description:
    'المدار (CORBIT) منصة سعودية متكاملة لحلول المراسلة: خدمة الرسائل النصية SMS، واتساب أعمال API، نظام الموارد البشرية O-Time، وبوابة المراسلة الحكومية — بدعم محلي على مدار الساعة.',
  descriptionEn:
    'CORBIT is an integrated Saudi messaging platform: SMS service, WhatsApp Business API, the O-Time HR system, and a government messaging gateway — with 24/7 local support.',
  keywords:
    'المدار, المدار التقني, CORBIT, خدمة الرسائل النصية, واتساب أعمال, واتساب API, رسائل SMS, نظام موارد بشرية, بوابة مراسلة حكومية, إرسال رسائل جماعية',
  keywordsEn:
    'CORBIT, SMS service Saudi Arabia, WhatsApp Business API, bulk SMS, HR system, government messaging gateway, messaging platform',
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل بقاعدة البيانات:', mongoose.connection.name);

  const col = mongoose.connection.db.collection('sitecms');
  const doc = await col.findOne({ key: 'primary' }) || await col.findOne({});
  if (!doc) throw new Error('لم يتم العثور على وثيقة sitecms');

  const pages = Array.isArray(doc.pages) ? doc.pages : [];
  const idx = pages.findIndex((p) => p && (p.id === 'home' || p.path === '/'));
  if (idx === -1) throw new Error('لم يتم العثور على صفحة الرئيسية في pages');

  const page = pages[idx];
  const prevSeo = (page.seo && typeof page.seo === 'object') ? page.seo : {};
  console.log('— SEO الحالية للرئيسية —');
  console.log(JSON.stringify(prevSeo, null, 2));

  const nextSeo = {
    ...prevSeo,
    ...HOME_SEO,
    canonical: prevSeo.canonical || 'https://corbit.sa/',
    ogImage: prevSeo.ogImage || '',
    noIndex: prevSeo.noIndex === true ? true : false,
  };

  pages[idx] = { ...page, seo: nextSeo };
  await col.updateOne({ _id: doc._id }, { $set: { pages } });

  console.log('\n— SEO الجديدة للرئيسية —');
  console.log(JSON.stringify(nextSeo, null, 2));
  console.log('\n✅ تم التحديث بنجاح.');

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error('❌ خطأ:', e.message);
  process.exit(1);
});
