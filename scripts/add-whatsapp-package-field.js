/**
 * يضيف حقل «اختيار باقة» (type: 'package') إلى نموذج خدمة الواتساب (FormConfig productId=whatsapp).
 * الحقل يُحمّل الباقات حيّاً من قسم الأسعار، ويختار العميل الباقة والشريحة، فتظهر في «طلبات واتساب».
 * idempotent: لا يضيف الحقل إن كان موجوداً (بالنوع package أو بالمعرّف package).
 *
 * التشغيل: node scripts/add-whatsapp-package-field.js  (أو: npm run seed:wa-package)
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const PACKAGE_FIELD = {
  id: 'package',
  type: 'package',
  labelAr: 'الباقة المطلوبة',
  labelEn: 'Selected Package',
  placeholderAr: '',
  placeholderEn: '',
  required: false,
  step: 2,
  min: 1,
  max: 10,
  stepSize: 1,
  options: [],
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);

  const col = mongoose.connection.db.collection('formconfigs');
  const config = await col.findOne({ productId: 'whatsapp' });

  if (!config) {
    console.log('⚠️  لا يوجد FormConfig بـ productId=whatsapp — لم يُجرَ أي تغيير.');
    await mongoose.disconnect();
    return;
  }

  const fields = Array.isArray(config.fields) ? config.fields : [];
  const hasPackage = fields.some((f) => f && (f.type === 'package' || f.id === 'package'));

  if (hasPackage) {
    console.log('ℹ️  حقل الباقة موجود مسبقاً — لا حاجة للتعديل (idempotent).');
    await mongoose.disconnect();
    return;
  }

  // نضع حقل الباقة أولاً ليظهر في مقدمة النموذج.
  const newFields = [PACKAGE_FIELD, ...fields];
  const res = await col.updateOne(
    { productId: 'whatsapp' },
    { $set: { fields: newFields, updatedAt: new Date() } }
  );

  console.log(res.modifiedCount ? '🟢 أُضيف حقل الباقة إلى نموذج الواتساب.' : '⚠️  لم يتغيّر شيء.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
