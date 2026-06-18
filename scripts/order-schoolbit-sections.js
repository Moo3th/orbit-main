/**
 * ضبط ترتيب أقسام صفحة SchoolBit في القاعدة للترتيب البصري القانوني،
 * مع إدراج قسم schoolbit-partners (شعارات الشركاء) إن لم يكن موجودًا —
 * حتى يعمل ترتيب/إظهار الأقسام عبر flex order على الصفحة العامة فورًا.
 *
 * التشغيل: node scripts/order-schoolbit-sections.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const CANONICAL = [
  'schoolbit-hero', 'schoolbit-trust', 'schoolbit-partners', 'schoolbit-problem',
  'schoolbit-benefits', 'schoolbit-roles', 'schoolbit-modules', 'schoolbit-automation',
  'schoolbit-integrations', 'schoolbit-security', 'schoolbit-pricing', 'schoolbit-outcomes',
  'schoolbit-cta', 'schoolbit-faq',
];

// أقسام يجوز إنشاؤها كعنصر بنيوي بسيط إن غابت (لها مكوّن لا حقول نصية أساسية).
const SYNTHETIC = {
  'schoolbit-partners': {
    id: 'schoolbit-partners', name: 'شعارات الشركاء', nameEn: 'Partner Logos', visible: true,
    fields: [
      { key: 'spacing', label: 'تباعد القسم', labelEn: 'Section Spacing', type: 'spacing', value: '', valueEn: '' },
      { key: 'margin_before', label: 'هامش أعلى القسم', labelEn: 'Margin Before Section', type: 'margin', value: '', valueEn: '' },
      { key: 'margin_after', label: 'هامش أسفل القسم', labelEn: 'Margin After Section', type: 'margin', value: '', valueEn: '' },
    ],
  },
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  if (!doc) throw new Error('لا يوجد مستند sitecms');
  const pages = doc.pages || [];
  const idx = pages.findIndex((p) => p && p.id === 'schoolbit');
  if (idx === -1) throw new Error('لا توجد صفحة schoolbit');

  const page = pages[idx];
  const sections = Array.isArray(page.sections) ? page.sections : [];
  console.log('— الترتيب الحالي —\n', sections.map((s) => s.id).join(' , '));

  const byId = new Map(sections.map((s) => [s.id, s]));
  const ordered = [];
  for (const id of CANONICAL) {
    if (byId.has(id)) { ordered.push(byId.get(id)); byId.delete(id); }
    else if (SYNTHETIC[id]) { ordered.push(SYNTHETIC[id]); console.log('➕ أُدرج قسم مفقود:', id); }
  }
  for (const s of sections) { if (byId.has(s.id)) { ordered.push(s); byId.delete(s.id); } } // البقية بترتيبها

  const same = ordered.length === sections.length && ordered.every((s, i) => s.id === sections[i].id);
  if (same) { console.log('\n✅ الترتيب صحيح أصلاً ولا قسم مفقود.'); await mongoose.disconnect(); return; }

  pages[idx] = { ...page, sections: ordered };
  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log('\n— الترتيب الجديد —\n', ordered.map((s) => s.id).join(' , '));
  console.log('\n✅ تم.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
