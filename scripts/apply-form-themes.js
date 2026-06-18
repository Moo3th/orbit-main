/**
 * تطبيق ثيم كل منتج على فورمات FormConfig الموجودة في القاعدة.
 * القيم تطابق src/lib/forms/themePresets.ts — أبقِهما متطابقَين.
 * يطبّق على فورمات الخدمة للمنتجات؛ ويترك الاستبيانات المخصّصة كما هي (تُطبَّق presets يدويًا من اللوحة عند الحاجة).
 *
 * التشغيل: node scripts/apply-form-themes.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const NEUTRAL = {
  buttonTextColor: '#FFFFFF',
  optionSelectedTextColor: '#FFFFFF',
  formBgColor: '#f9fafb',
  formCardBgColor: '#ffffff',
  formTitleColor: '#161616',
  fieldLabelColor: '#374151',
  fieldBorderColor: '#d1d5db',
  optionBgColor: '#ffffff',
  optionBorderColor: '#e5e7eb',
  optionTextColor: '#111827',
};
const make = (primaryColor, buttonHoverColor, successColor) => ({ ...NEUTRAL, primaryColor, buttonHoverColor, successColor });
const PRESETS = {
  whatsapp: make('#128C7E', '#075E54', '#25D366'),
  otime: make('#104E8B', '#0d3d6e', '#16a34a'),
  govgate: make('#0A2647', '#104E8B', '#16a34a'),
  schoolbit: make('#1B6BF1', '#1559c4', '#16a34a'),
};
// خريطة productId في القاعدة → preset
const PRODUCT_TO_PRESET = {
  whatsapp: 'whatsapp',
  otime: 'otime',
  govgate: 'govgate',
  schoolbitstarteroffer: 'schoolbit',
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('formconfigs');
  let updated = 0;
  for (const [productId, presetKey] of Object.entries(PRODUCT_TO_PRESET)) {
    const theme = PRESETS[presetKey];
    const res = await col.updateOne({ productId }, { $set: { ...theme, updatedAt: new Date() } });
    if (res.matchedCount) { updated++; console.log(`🎨 ${productId} → ثيم ${presetKey} (primary ${theme.primaryColor})`); }
    else console.log(`⚠️  لا يوجد FormConfig بـ productId=${productId} (تخطّي)`);
  }
  console.log(`\n✅ تم تحديث ${updated} فورم.`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
