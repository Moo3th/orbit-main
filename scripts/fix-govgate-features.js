/**
 * توحيد مصدر مميزات Gov Gate في القاعدة:
 * (1) يضبط gg-features/features_json بالمميزات الثلاث الحالية (شكل عام: titleAr/titleEn/descAr/descEn/icon)
 *     ليصبح المصدر الوحيد القابل للإضافة/الحذف من المحرّر.
 * (2) يحذف الحقول القديمة المكرّرة (feature1_title..feature3_desc) من القسم — لتنظيف لوحة التعديل.
 *
 * التشغيل: node scripts/fix-govgate-features.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const FEATURES = [
  { titleAr: 'استقلالية تامة', titleEn: 'Full Independence', descAr: 'بنية تحتية خاصة لا تعتمد على أطراف ثالثة، مما يضمن سيطرة كاملة على بياناتك وعملياتك', descEn: 'Private infrastructure independent of third parties, ensuring full control over your data and operations', icon: '' },
  { titleAr: 'أمان متقدم', titleEn: 'Advanced Security', descAr: 'تشفير شامل من طرف لطرف مع صلاحيات دقيقة ومراقبة مستمرة لجميع العمليات', descEn: 'Comprehensive end-to-end encryption with granular permissions and continuous monitoring of all operations', icon: '' },
  { titleAr: 'موثوقية عالية', titleEn: 'High Reliability', descAr: 'ضمان وقت تشغيل 99.9% مع نسخ احتياطي تلقائي واسترداد فوري للخدمات', descEn: '99.9% uptime guarantee with automatic backups and instant service recovery', icon: '' },
];
const LEGACY = new Set(['feature1_title', 'feature1_desc', 'feature2_title', 'feature2_desc', 'feature3_title', 'feature3_desc']);

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const pages = doc.pages || [];
  const pi = pages.findIndex((p) => p && (p.id === 'govgate' || p.path === '/products/gov-gate'));
  if (pi === -1) throw new Error('لا توجد صفحة govgate');
  const sections = pages[pi].sections || [];
  const si = sections.findIndex((s) => s.id === 'gg-features');
  if (si === -1) throw new Error('لا يوجد قسم gg-features');

  const fields = Array.isArray(sections[si].fields) ? sections[si].fields : [];
  const before = fields.map((f) => f.key).join(', ');

  // (2) احذف القديمة
  let next = fields.filter((f) => !LEGACY.has(f.key));
  // (1) اضبط features_json (أنشئه إن غاب)
  const fjIdx = next.findIndex((f) => f.key === 'features_json');
  const blob = JSON.stringify(FEATURES);
  const fjField = { key: 'features_json', label: 'قائمة المميزات (إضافة/حذف، أيقونة اختيارية)', labelEn: 'Features List (add/remove, optional icon)', type: 'list', value: blob, valueEn: '' };
  if (fjIdx === -1) next.unshift(fjField);
  else next[fjIdx] = { ...next[fjIdx], value: blob, valueEn: next[fjIdx].valueEn || '' };

  sections[si] = { ...sections[si], fields: next };
  pages[pi] = { ...pages[pi], sections };
  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log('— قبل —', before);
  console.log('— بعد —', next.map((f) => f.key).join(', '));
  console.log('✅ تم: features_json مضبوط (3 مميزات) والحقول القديمة محذوفة.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
