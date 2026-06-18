/**
 * تنظيف لوحة الرئيسية:
 * (1) الحلول: بذر solutions_json من الحقول القديمة (wa_/sms_/otime_/govgate_) ليصبح كل حل قابلاً
 *     للإضافة/الحذف/الإخفاء/الترتيب، ثم حذف الحقول القديمة المكرّرة.
 * (2) التكاملات: حذف الحقول القديمة المكرّرة (integrations_list + integration_*_icon)
 *     مع الإبقاء على integrations_json كمصدر وحيد.
 *
 * التشغيل: node scripts/fix-home-solutions-integrations.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const fieldVal = (sec, key) => {
  const f = (sec.fields || []).find((x) => x.key === key);
  return f ? { value: f.value || '', valueEn: f.valueEn || f.value || '' } : { value: '', valueEn: '' };
};

const PRODUCT_MAP = [
  { prefix: 'wa', productId: 'whatsapp', icon: 'message', color: 'green', link: '/products/whatsapp' },
  { prefix: 'sms', productId: 'sms', icon: 'sms', color: 'primary', link: '/products/sms' },
  { prefix: 'otime', productId: 'otime', icon: 'users', color: 'blue', link: '/products/o-time' },
  { prefix: 'govgate', productId: 'govgate', icon: 'shield', color: 'amber', link: '/products/gov-gate' },
];

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const pages = doc.pages || [];
  const home = pages.find((p) => p.id === 'home');
  if (!home) throw new Error('لا توجد صفحة home');

  // (1) الحلول
  const sol = home.sections.find((s) => s.id === 'home-solutions');
  if (sol) {
    const existingJson = fieldVal(sol, 'solutions_json').value;
    let alreadySeeded = false;
    try { const p = JSON.parse(existingJson); alreadySeeded = Array.isArray(p) && p.length > 0; } catch {}

    if (!alreadySeeded) {
      const solutions = PRODUCT_MAP.map((m) => {
        const title = fieldVal(sol, `${m.prefix}_title`);
        const desc = fieldVal(sol, `${m.prefix}_desc`);
        const feats = fieldVal(sol, `${m.prefix}_features`);
        return {
          titleAr: title.value, titleEn: title.valueEn,
          descAr: desc.value, descEn: desc.valueEn,
          featuresAr: feats.value, featuresEn: feats.valueEn,
          link: m.link, icon: m.icon, color: m.color,
          ctaAr: 'اكتشف المزيد', ctaEn: 'Learn More',
          visible: true, productId: m.productId,
        };
      });
      // ضبط حقل solutions_json
      let jf = (sol.fields || []).find((f) => f.key === 'solutions_json');
      if (!jf) { jf = { key: 'solutions_json', label: 'قائمة الحلول', labelEn: 'Solutions List', type: 'list', value: '', valueEn: '' }; sol.fields.push(jf); }
      jf.value = JSON.stringify(solutions);
      jf.valueEn = jf.value;
      console.log(`✅ بُذرت solutions_json بـ ${solutions.length} حلول.`);
    } else {
      console.log('ℹ️ solutions_json مبذورة مسبقاً — تُركت كما هي.');
    }

    // حذف الحقول القديمة المكرّرة
    const legacySolKeys = [];
    for (const m of PRODUCT_MAP) legacySolKeys.push(`${m.prefix}_title`, `${m.prefix}_desc`, `${m.prefix}_features`);
    const before = sol.fields.length;
    sol.fields = sol.fields.filter((f) => !legacySolKeys.includes(f.key));
    console.log(`🧹 حُذف ${before - sol.fields.length} حقلاً قديماً من الحلول.`);
  }

  // (2) التكاملات
  const integ = home.sections.find((s) => s.id === 'home-integrations');
  if (integ) {
    const before = integ.fields.length;
    integ.fields = integ.fields.filter((f) => f.key !== 'integrations_list' && !/^integration_.*_icon$/.test(f.key));
    console.log(`🧹 حُذف ${before - integ.fields.length} حقلاً قديماً من التكاملات.`);
  }

  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log('\n✅ تم الحفظ.');
  console.log('حقول الحلول الآن:', (sol.fields || []).map((f) => f.key).join(', '));
  console.log('حقول التكاملات الآن:', (integ.fields || []).map((f) => f.key).join(', '));
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
