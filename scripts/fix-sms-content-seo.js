/**
 * إصلاحات صفحة SMS: (1) خطأ محتوى في عنوان قسم القيمة (بادئة «العنوان:» و«CorBit»),
 * (2) تنظيف مسافات بيانات SEO الزائدة.
 *
 * التشغيل: node scripts/fix-sms-content-seo.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل بقاعدة البيانات:', mongoose.connection.name);

  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  if (!doc) throw new Error('لا توجد وثيقة sitecms');

  const pages = doc.pages || [];
  const sms = pages.find((p) => p.id === 'sms');
  if (!sms) throw new Error('لا توجد صفحة sms');

  let changes = 0;

  // (1) إصلاح عنوان sms-value
  const valueSec = sms.sections.find((s) => s.id === 'sms-value');
  const titleField = valueSec && valueSec.fields.find((f) => f.key === 'title');
  if (titleField) {
    const before = titleField.value;
    titleField.value = 'لماذا الرسائل النصية مع CORBIT؟';
    if (before !== titleField.value) { console.log('عنوان sms-value:', JSON.stringify(before), '→', JSON.stringify(titleField.value)); changes++; }
  }

  // (2) تنظيف مسافات SEO
  if (sms.seo) {
    for (const k of ['title', 'titleEn', 'description', 'descriptionEn', 'keywords', 'keywordsEn']) {
      if (typeof sms.seo[k] === 'string') {
        const trimmed = sms.seo[k].replace(/\s+/g, ' ').trim();
        if (trimmed !== sms.seo[k]) { sms.seo[k] = trimmed; changes++; }
      }
    }
  }

  if (!changes) { console.log('لا تغييرات.'); await mongoose.disconnect(); return; }

  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log(`\n✅ تم تطبيق ${changes} تغيير.`);
  console.log('SEO بعد التنظيف:', JSON.stringify(sms.seo, null, 1));
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
