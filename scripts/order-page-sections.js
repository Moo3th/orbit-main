/**
 * ضبط ترتيب أقسام صفحة منتج في القاعدة للترتيب القانوني (الأقسام المعروفة أولاً ثم البقية).
 * يُستخدم لمواءمة ترتيب مصفوفة الـ CMS مع الترتيب البصري بعد جعل الصفحة مدفوعة بالترتيب (flex order).
 *
 * التشغيل: node scripts/order-page-sections.js <pageId>
 *   pageId: sms | whatsapp
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const CANONICAL = {
  sms: ['sms-hero', 'sms-trust', 'sms-value', 'sms-special-offer', 'sms-usecases', 'sms-pricing', 'sms-developers', 'sms-faq', 'sms-final-cta'],
  // الترتيب البصري الفعلي ثم الأقسام غير المرئية (wa-hero/wa-solutions ميتة، wa-request-form فورم منفصل) بالآخر.
  whatsapp: ['wa-chatbot', 'wa-stats', 'wa-partners', 'wa-features', 'wa-why', 'wa-marketing', 'wa-pricing', 'wa-green-tick', 'wa-integrations', 'wa-persona', 'wa-footer-cta', 'wa-faq', 'wa-hero', 'wa-solutions'],
};

async function run() {
  const pageId = process.argv[2];
  if (!pageId || !CANONICAL[pageId]) throw new Error('مرّر pageId صحيح: sms | whatsapp');
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const pages = doc.pages || [];
  const idx = pages.findIndex((p) => p && p.id === pageId);
  if (idx === -1) throw new Error('لا توجد الصفحة: ' + pageId);

  const page = pages[idx];
  const sections = Array.isArray(page.sections) ? page.sections : [];
  console.log('— الترتيب الحالي —\n', sections.map((s) => s.id).join(' , '));

  const order = CANONICAL[pageId];
  const byId = new Map(sections.map((s) => [s.id, s]));
  const ordered = [];
  for (const id of order) { if (byId.has(id)) { ordered.push(byId.get(id)); byId.delete(id); } }
  for (const s of sections) { if (byId.has(s.id)) { ordered.push(s); byId.delete(s.id); } } // البقية بترتيبها

  const same = ordered.length === sections.length && ordered.every((s, i) => s.id === sections[i].id);
  if (same) { console.log('\n✅ الترتيب صحيح أصلاً.'); await mongoose.disconnect(); return; }

  pages[idx] = { ...page, sections: ordered };
  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log('\n— الترتيب الجديد —\n', ordered.map((s) => s.id).join(' , '));
  console.log('\n✅ تم.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
