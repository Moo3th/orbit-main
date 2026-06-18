/**
 * تنظيف لوحة تعديل صفحة واتساب:
 * حذف حقول قوائم JSON الميتة/اليتيمة الفارغة التي لا يقرأها المكوّن إطلاقاً
 * (تظهر كمحرّرات قوائم فارغة مكرّرة في اللوحة). كلها فارغة → لا تغيير بصري على الموقع.
 *
 * التشغيل: node scripts/fix-wa-editor-fields.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// حقول تُحذف لكل قسم (آمنة فقط إن كانت فارغة).
const REMOVE = {
  'wa-hero': ['slides_json'],
  'wa-features': ['campaigns_json'],
  'wa-solutions': ['solutions_json', 'features_json'],
  'wa-marketing': ['features_json'],
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const pages = doc.pages || [];
  const wa = pages.find((p) => p.id === 'whatsapp');
  if (!wa) throw new Error('لا توجد صفحة whatsapp');

  let removed = 0, skipped = 0;
  for (const sec of wa.sections) {
    const toRemove = REMOVE[sec.id] || [];
    sec.fields = (sec.fields || []).filter((f) => {
      if (toRemove.includes(f.key)) {
        let hasData = false;
        try { const a = JSON.parse(f.value || '[]'); hasData = Array.isArray(a) && a.length > 0; } catch {}
        if (hasData) { console.log(`⚠️  ${sec.id}/${f.key} يحوي بيانات — لم يُحذف.`); skipped++; return true; }
        console.log(`🧹 حذف ${sec.id}/${f.key}`); removed++; return false;
      }
      return true;
    });
  }

  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log(`\n✅ حُذف ${removed} حقلاً (تُخطّي ${skipped}).`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
