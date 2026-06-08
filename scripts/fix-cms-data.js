/**
 * ترحيل لمرة واحدة: تصحيح البيانات الرسمية المخزّنة في CMS داخل MongoDB
 * (البريد، النطاق، السجل التجاري/الترخيص، اسم العلامة) لتطابق الكود بعد الإصلاح.
 *
 * التشغيل: node scripts/fix-cms-data.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// نفس قواعد الاستبدال المطبّقة على الكود
function fixString(s) {
  if (typeof s !== 'string') return s;
  let v = s;
  // 1) توحيد البريد
  for (const e of ['sales@orbit.sa', 'info@orbit.sa', 'support@orbit.sa', 'noreply@orbit.sa', 'info@ot.com.sa', 'marketing@corbit.sa', 'sales@corbit.sa']) {
    v = v.split(e).join('info@corbit.sa');
  }
  // 2) السجل التجاري والترخيص
  v = v.split('7012398264').join('7012398264').split('LGP0921-22').join('LGP0921-22');
  // 3) النطاق orbit.sa -> corbit.sa (تجاهل corbit.sa)
  v = v.replace(/(?<!c)orbit\.sa/g, 'corbit.sa');
  // 4) اسم العلامة
  v = v.replace(/(?<!C)ORBIT/g, 'CORBIT');
  v = v.split('to Orbit').join('to CORBIT').split('(Orbit)').join('(CORBIT)').split('Orbit. All rights').join('CORBIT. All rights');
  v = v.split('ot.com.sa').join('corbit.sa');
  return v;
}

// تطبيق عميق على أي بنية (كائن/مصفوفة/نص)
function deepFix(obj) {
  if (typeof obj === 'string') return fixString(obj);
  if (Array.isArray(obj)) return obj.map(deepFix);
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, val] of Object.entries(obj)) out[k] = deepFix(val);
    return out;
  }
  return obj;
}

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل بقاعدة البيانات:', mongoose.connection.name);

  // نعمل مباشرة على المجموعات لتجنّب قيود الـ schema
  const db = mongoose.connection.db;
  const collections = ['sitecms', 'seosettings', 'mainpagesettings', 'cmspagecontents', 'solutions', 'packages', 'pagecontents'];

  let totalChanged = 0;
  for (const name of collections) {
    const col = db.collection(name);
    const docs = await col.find({}).toArray();
    let changed = 0;
    for (const doc of docs) {
      const { _id, ...rest } = doc;
      const fixed = deepFix(rest);
      if (JSON.stringify(fixed) !== JSON.stringify(rest)) {
        await col.updateOne({ _id }, { $set: fixed });
        changed++;
      }
    }
    if (docs.length) console.log(`  ${name}: ${changed}/${docs.length} وثيقة صُحّحت`);
    totalChanged += changed;
  }

  console.log(`\n✅ اكتمل الترحيل — إجمالي الوثائق المصححة: ${totalChanged}`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => {
  console.error('❌ فشل الترحيل:', e.message);
  process.exit(1);
});
