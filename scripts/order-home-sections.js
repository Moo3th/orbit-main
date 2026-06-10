/**
 * ترحيل لمرة واحدة: ضبط ترتيب أقسام الصفحة الرئيسية في القاعدة ليطابق الترتيب البصري.
 * الهيرو أولًا ← الترتيب القانوني للأقسام المعروفة ← أي أقسام متبقية (مثل home-navbar) بآخرها.
 * يحافظ على كل حقول الأقسام وقيمها كما هي.
 *
 * التشغيل: node scripts/order-home-sections.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const CANONICAL_ORDER = [
  'home-hero',
  'home-stats',
  'home-trust',
  'home-solutions',
  'home-persona-tabs',
  'home-integrations',
  'home-testimonials',
  'home-whyus',
  'home-faq',
  'home-cta',
];

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل بقاعدة البيانات:', mongoose.connection.name);

  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  if (!doc) throw new Error('لم يتم العثور على وثيقة sitecms');

  const pages = Array.isArray(doc.pages) ? doc.pages : [];
  const idx = pages.findIndex((p) => p && (p.id === 'home' || p.path === '/'));
  if (idx === -1) throw new Error('لم يتم العثور على صفحة الرئيسية في pages');

  const page = pages[idx];
  const sections = Array.isArray(page.sections) ? page.sections : [];
  console.log('— الترتيب الحالي —');
  console.log(sections.map((s) => s.id).join(' , '));

  const byId = new Map(sections.map((s) => [s.id, s]));
  const ordered = [];
  // 1) الأقسام المعروفة بالترتيب القانوني.
  for (const id of CANONICAL_ORDER) {
    if (byId.has(id)) {
      ordered.push(byId.get(id));
      byId.delete(id);
    }
  }
  // 2) أي أقسام متبقية (home-navbar أو غيرها) بآخرها مع الحفاظ على ترتيبها النسبي.
  for (const s of sections) {
    if (byId.has(s.id)) {
      ordered.push(s);
      byId.delete(s.id);
    }
  }

  const sameOrder = ordered.length === sections.length && ordered.every((s, i) => s.id === sections[i].id);
  if (sameOrder) {
    console.log('\n✅ الترتيب صحيح أصلًا — لا حاجة للتغيير.');
    await mongoose.disconnect();
    return;
  }

  pages[idx] = { ...page, sections: ordered };
  await col.updateOne({ _id: doc._id }, { $set: { pages } });

  console.log('\n— الترتيب الجديد —');
  console.log(ordered.map((s) => s.id).join(' , '));
  console.log('\n✅ تم ضبط الترتيب بنجاح.');

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error('❌ خطأ:', e.message);
  process.exit(1);
});
