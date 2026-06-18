/**
 * تحسين SEO صفحة Gov Gate بناءً على أبحاث Ahrefs (السوق السعودي).
 * الواقع: مصطلحات B2G الحرفية («بوابة مراسلة حكومية»...) حجمها صفر تقريبًا — منتج متخصّص.
 * الإستراتيجية: القيادة بالهوية + عنقود bulk SMS/secure messaging التجاري الملاصق (bulk sms saudi arabia KD0 CPC$1.3،
 *   sms gateway، bulk sms service) مع تمييز «الحكومي الآمن/الامتثال» في النص. otp/اشعارات عالية لكن استهلاكية → ذكر فقط.
 *
 * التشغيل: node scripts/optimize-govgate-seo.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const GG_SEO = {
  title: 'بوابة Gov Gate للمراسلات الحكومية الآمنة | المدار CORBIT',
  titleEn: 'Gov Gate — Secure Bulk SMS Gateway Saudi Arabia | CORBIT',
  description:
    'بوابة Gov Gate من المدار: منصة مراسلات حكومية آمنة لإرسال الرسائل والإشعارات للمواطنين والموظفين، بصلاحيات حسب الأدوار، امتثال تشريعي، وسجل تدقيق وتكامل مع الأنظمة الحكومية.',
  descriptionEn:
    'Gov Gate by CORBIT: a secure messaging gateway for government & enterprise. Bulk SMS and notifications to citizens, role-based access, compliance & full audit log.',
  keywords:
    'بوابة مراسلة حكومية, منصة مراسلات حكومية, نظام مراسلات, رسائل نصية للجهات الحكومية, رسائل المنشآت الحكومية, إشعارات حكومية, مراسلات إلكترونية آمنة, اسم المرسل الحكومي, تكامل مع الأنظمة الحكومية, Gov Gate',
  keywordsEn:
    'bulk sms saudi arabia, sms gateway, bulk sms service, government messaging platform, secure messaging, enterprise messaging, otp sms service, bulk sms marketing platform, Gov Gate',
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const pages = doc.pages || [];
  const idx = pages.findIndex((p) => p && (p.id === 'govgate' || p.path === '/products/gov-gate'));
  if (idx === -1) throw new Error('لا توجد صفحة govgate');

  const page = pages[idx];
  const prev = (page.seo && typeof page.seo === 'object') ? page.seo : {};
  console.log('— SEO الحالية —');
  console.log(JSON.stringify(prev, null, 1));

  pages[idx] = {
    ...page,
    seo: {
      ...prev,
      ...GG_SEO,
      canonical: prev.canonical || 'https://corbit.sa/products/gov-gate',
      ogImage: prev.ogImage || '',
      noIndex: prev.noIndex === true ? true : false,
    },
  };
  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log('\n— SEO الجديدة —');
  console.log(JSON.stringify(pages[idx].seo, null, 1));
  console.log('\n✅ تم.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
