/**
 * تنظيف لوحة تعديل صفحة SMS:
 * (1) حذف حقول قوائم JSON الفارغة/الميتة/اليتيمة المكرّرة من أقسام SMS
 *     (slides_json, features_json, usecases_json, cases_json, platforms_json, integrations_json).
 *     كلها فارغة، والمكوّنات تستخدم الحقول القديمة المجمّعة كمصدر وحيد — لا تغيير بصري.
 * (2) إزالة لاحقة «(قديم)» / «(legacy)» من تسميات الحقول المتبقّية لأنها صارت المصدر الوحيد.
 *
 * التشغيل: node scripts/fix-sms-editor-fields.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// حقول JSON تُحذف لكل قسم (آمنة فقط إن كانت فارغة).
const REMOVE = {
  'sms-hero': ['slides_json'],
  'sms-value': ['features_json'],
  'sms-usecases': ['usecases_json', 'cases_json'],
  'sms-developers': ['platforms_json', 'integrations_json'],
};

const cleanLabel = (s) => (typeof s === 'string'
  ? s.replace(/\s*\(قديم\)\s*$/, '').replace(/\s*\(legacy\)\s*$/i, '').trim()
  : s);

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const pages = doc.pages || [];
  const sms = pages.find((p) => p.id === 'sms');
  if (!sms) throw new Error('لا توجد صفحة sms');

  let removed = 0, relabeled = 0, skipped = 0;
  for (const sec of sms.sections) {
    const toRemove = REMOVE[sec.id] || [];
    sec.fields = (sec.fields || []).filter((f) => {
      if (toRemove.includes(f.key)) {
        let hasData = false;
        try { const a = JSON.parse(f.value || '[]'); hasData = Array.isArray(a) && a.length > 0; } catch {}
        if (hasData) { console.log(`⚠️  ${sec.id}/${f.key} يحوي بيانات — لم يُحذف.`); skipped++; return true; }
        removed++; return false;
      }
      return true;
    });
    // إزالة لاحقة (قديم) من التسميات المتبقّية
    sec.fields.forEach((f) => {
      const nl = cleanLabel(f.label); const ne = cleanLabel(f.labelEn);
      if (nl !== f.label) { f.label = nl; relabeled++; }
      if (ne !== f.labelEn) { f.labelEn = ne; }
    });
  }

  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log(`\n✅ حُذف ${removed} حقلاً مكرّراً/فارغاً، صُحّحت ${relabeled} تسمية، وتُخطّي ${skipped}.`);
  for (const sec of sms.sections) {
    console.log(`  ${sec.id}: ${(sec.fields || []).map((f) => f.key).join(', ')}`);
  }
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
