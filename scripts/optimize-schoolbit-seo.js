/**
 * تحسين SEO صفحة SchoolBit بناءً على أبحاث Ahrefs (السوق السعودي، عربي).
 * الإستراتيجية: القيادة بعنقود «حضور وانصراف/بصمة» التجاري منخفض الصعوبة وعالي CPC
 *   (برنامج حضور وانصراف 150/KD1، جهاز بصمة حضور وانصراف 200/KD0، نظام حضور وانصراف ذكي 50/KD12)،
 *   مع «إدارة مدرسية» للاتّساع و«تكامل نظام نور» كصلة (نور 1.88M لكنها ملاحية/حكومية لا تُستهدف أساسًا).
 *
 * التشغيل: node scripts/optimize-schoolbit-seo.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const SB_SEO = {
  title: 'نظام حضور وانصراف وإدارة مدرسية | سكول بت من المدار',
  titleEn: 'School Management & Attendance System (KSA) | SchoolBit by CORBIT',
  description:
    'سكول بت من المدار: نظام حضور وانصراف ذكي وإدارة مدرسية عربي بالكامل — بصمة BioTime، تكامل نظام نور، إشعارات واتساب ورسائل SMS لأولياء الأمور، تقارير وجداول واختبارات. اطلب عرضًا توضيحيًا.',
  descriptionEn:
    'SchoolBit by CORBIT: an Arabic-first school management & smart attendance system — BioTime biometrics, Noor integration, WhatsApp/SMS parent alerts, reports, schedules & exams. Book a demo.',
  keywords:
    'نظام حضور وانصراف, برنامج حضور وانصراف, نظام حضور وانصراف ذكي, بصمة حضور وانصراف, جهاز بصمة حضور وانصراف, نظام إدارة المدارس, برنامج إدارة مدرسية, نظام تواصل المدرسة مع ولي الأمر, تكامل نظام نور, سكول بت, المدار',
  keywordsEn:
    'school management system, school attendance system, student attendance software, biometric attendance for schools, BioTime integration, Noor system integration, parent communication app, SchoolBit, CORBIT',
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const pages = doc.pages || [];
  const idx = pages.findIndex((p) => p && (p.id === 'schoolbit' || p.path === '/products/schoolbit'));
  if (idx === -1) throw new Error('لا توجد صفحة schoolbit');

  const page = pages[idx];
  const prev = (page.seo && typeof page.seo === 'object') ? page.seo : {};
  console.log('— SEO الحالية —');
  console.log(JSON.stringify(prev, null, 1));

  pages[idx] = {
    ...page,
    seo: {
      ...prev,
      ...SB_SEO,
      canonical: prev.canonical || 'https://corbit.sa/products/schoolbit',
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
