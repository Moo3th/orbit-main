/**
 * جعل صفحة واتساب قابلة للتحرير بالكامل من اللوحة:
 * يضيف كل الحقول الناقصة لأقسام صفحة whatsapp (نصوص محاكاة الجوال، تقرير الحملة،
 * تبويب المطورين/المتاجر، تسميات بطاقات الأسعار، شعارات الاعتماد، روابط الأزرار...).
 *
 * - idempotent: لا يضيف حقلاً موجوداً ولا يغيّر قيمة محفوظة.
 * - ثنائي اللغة: value = عربي، valueEn = إنجليزي (يطابق getCmsField).
 *
 * التشغيل: node scripts/wa-full-editable-fields.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const f = (key, label, labelEn, value, valueEn = value, type = 'text', extra = {}) => ({
  key, label, labelEn, type, value, valueEn, ...extra,
});

// الحقول المطلوب ضمانها لكل قسم (تُضاف فقط إن كانت غائبة).
const ENSURE = {
  'wa-chatbot': [
    f('cta_secondary_url', 'رابط الزر الثانوي (الهيرو)', 'Hero Secondary CTA URL', '#contact', '#contact', 'text'),
    f('avatars_json', 'صور الأفاتار (الإثبات الاجتماعي)', 'Social Proof Avatars', JSON.stringify([
      { image: '/logo/شعار المدار-01.svg' },
      { image: '/TrustedLogos/حرس الحدود.png' },
      { image: '/TrustedLogos/إمارة منطقة الرياض.png' },
      { image: '/TrustedLogos/جامعة الملك سعود.png' },
    ], null, 2), '', 'list'),
    f('mock_bot_name', 'اسم البوت (محاكاة الجوال)', 'Mock Bot Name', 'بوت المدار 🤖', 'Orbit Bot 🤖'),
    f('mock_status', 'حالة الاتصال (محاكاة)', 'Mock Online Status', 'متصل الآن', 'Online'),
    f('mock_today', 'فاصل التاريخ (محاكاة)', 'Mock Date Separator', 'اليوم', 'Today'),
    f('mock_input_placeholder', 'حقل الكتابة (محاكاة)', 'Mock Input Placeholder', 'اكتب رسالة...', 'Type a message...'),
    f('mock_time', 'وقت الرسائل (محاكاة)', 'Mock Message Time', '9:41', '9:41'),
  ],

  'wa-marketing': [
    f('report_title', 'عنوان تقرير الحملة', 'Campaign Report Title', 'تقرير الحملة الأخيرة', 'Last Campaign Report'),
    f('report_status', 'حالة التقرير', 'Report Status Badge', 'نشطة', 'Active'),
    f('report_metric1_label', 'المؤشر 1 — التسمية', 'Metric 1 Label', 'معدل الفتح', 'Open Rate'),
    f('report_metric1_value', 'المؤشر 1 — القيمة', 'Metric 1 Value', '94.2%', '94.2%'),
    f('report_metric2_label', 'المؤشر 2 — التسمية', 'Metric 2 Label', 'معدل النقر', 'Click Rate'),
    f('report_metric2_value', 'المؤشر 2 — القيمة', 'Metric 2 Value', '67.8%', '67.8%'),
    f('report_metric3_label', 'المؤشر 3 — التسمية', 'Metric 3 Label', 'معدل التحويل', 'Conversion'),
    f('report_metric3_value', 'المؤشر 3 — القيمة', 'Metric 3 Value', '23.4%', '23.4%'),
    f('report_sent_value', 'الرسائل المرسلة — القيمة', 'Messages Sent Value', '12,547', '12,547'),
    f('report_sent_label', 'الرسائل المرسلة — التسمية', 'Messages Sent Label', 'رسالة مرسلة', 'Messages Sent'),
    f('report_conv_value', 'التحويلات — القيمة', 'Conversions Value', '2,936', '2,936'),
    f('report_conv_label', 'التحويلات — التسمية', 'Conversions Label', 'تحويلات ناجحة', 'Conversions'),
  ],

  'wa-pricing': [
    f('plans_eyebrow', 'العنوان التمهيدي (الباقات)', 'Plans Eyebrow', 'الباقات والأسعار', 'Packages & Pricing'),
    f('plans_capacity_title', 'عنوان صندوق السعة', 'Capacity Box Title', 'السعة والحدود', 'Capacity & Limits'),
    f('plans_conversations_label', 'تسمية المحادثات', 'Conversations Label', 'محادثة', 'Conversations'),
    f('plans_broadcasts_label', 'تسمية رسائل البث', 'Broadcasts Label', 'رسالة بث', 'Broadcasts'),
    f('plans_users_prefix', 'بادئة المستخدمين', 'Users Prefix', 'حتى', 'Up to'),
    f('plans_users_label', 'تسمية المستخدمين', 'Users Label', 'مستخدمين', 'Users'),
    f('plans_currency', 'رمز العملة', 'Currency Symbol', 'ر.س', 'SAR'),
    f('plans_period_label', 'تسمية الدورية', 'Period Label', 'شهرياً', 'Monthly'),
    f('plans_tax_label', 'تسمية شامل الضريبة', 'Tax-included Label', 'شامل الضريبة:', 'Tax included:'),
    f('plans_setup_label', 'تسمية رسوم التأسيس', 'Setup Fee Label', 'رسوم التأسيس:', 'Setup fee:'),
    f('plans_features_label', 'تسمية المميزات الإضافية', 'Additional Features Label', 'المميزات الإضافية', 'Additional Features'),
    f('plans_subscribe_label', 'نص زر الاشتراك (افتراضي)', 'Subscribe Button (default)', 'اشترك الآن', 'Subscribe Now'),
    f('api_eyebrow', 'العنوان التمهيدي (أسعار API)', 'API Eyebrow', 'تكلفة المحادثات', 'Conversation Costs'),
    f('api_note', 'حاشية أسعار API', 'API Footnote', '* الأسعار قابلة للتغيير من Meta (واتساب) وقد تختلف حسب المنطقة والعملة.', '* Prices are subject to change by Meta (WhatsApp) and may vary by region and currency.', 'textarea'),
  ],

  'wa-persona': [
    f('merchant_cta_text', 'نص زر المتاجر', 'Merchant CTA Text', 'ابدأ تجربتك المجانية لواتساب', 'Start Your Free WhatsApp Trial'),
    f('merchant_cta_url', 'رابط زر المتاجر', 'Merchant CTA URL', 'https://app.mobile.net.sa/reg', 'https://app.mobile.net.sa/reg', 'url'),
    f('developer_api_title', 'عنوان واجهة المطورين', 'Developer API Title', 'REST API', 'REST API'),
    f('developer_subtitle', 'وصف واجهة المطورين', 'Developer API Subtitle', 'REST API مرن مع توثيق كامل', 'Flexible REST API with complete documentation'),
    f('developer_code', 'نموذج الكود (المطورين)', 'Developer Code Sample', `// Send WhatsApp Message via Orbit API
POST https://api.mobile.net.sa/v1/whatsapp
Authorization: Bearer YOUR_API_KEY

{
  "to": "9665xxxxxxxx",
  "template": "welcome_ar",
  "parameters": ["أحمد", "المدار"]
}

// Response
{
  "status": "sent",
  "messageId": "msg_wa_abc123",
  "cost": 1
}`, '', 'textarea'),
    f('developer_docs_text', 'نص زر التوثيق', 'Docs Button Text', 'تصفح التوثيق', 'Browse Documentation'),
    f('developer_docs_url', 'رابط زر التوثيق', 'Docs Button URL', 'https://docs.mobile.net.sa', 'https://docs.mobile.net.sa', 'url'),
  ],

  'wa-footer-cta': [
    f('cta_secondary_url', 'رابط الزر الثانوي', 'Secondary CTA URL', 'https://wa.me/966920006900', 'https://wa.me/966920006900', 'url'),
    f('badge1_image', 'شعار الاعتماد 1', 'Trust Badge 1 Image', '/WhatsAppPage/cst.png', '/WhatsAppPage/cst.png', 'image'),
    f('badge1_alt', 'النص البديل للشعار 1', 'Badge 1 Alt Text', 'معتمد من هيئة الاتصالات والفضاء والتقنية', 'CST Certified'),
    f('badge2_image', 'شعار الاعتماد 2', 'Trust Badge 2 Image', '/WhatsAppPage/meta.png', '/WhatsAppPage/meta.png', 'image'),
    f('badge2_alt', 'النص البديل للشعار 2', 'Badge 2 Alt Text', 'شريك Meta الرسمي', 'Official Meta Partner'),
  ],
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  if (!doc) throw new Error('لا يوجد مستند sitecms');
  const pages = doc.pages || [];
  const wa = pages.find((p) => p.id === 'whatsapp');
  if (!wa) throw new Error('لا توجد صفحة whatsapp');

  let added = 0;
  for (const [secId, fields] of Object.entries(ENSURE)) {
    const sec = (wa.sections || []).find((s) => s.id === secId);
    if (!sec) { console.log(`⚠️  القسم ${secId} غير موجود — تخطٍّ`); continue; }
    sec.fields = sec.fields || [];
    for (const def of fields) {
      if (sec.fields.some((x) => x.key === def.key)) continue;
      sec.fields.push(def);
      added++;
      console.log(`➕ ${secId}/${def.key}`);
    }
  }

  if (added > 0) {
    await col.updateOne({ _id: doc._id }, { $set: { pages } });
  }
  console.log(`\n✅ أُضيف ${added} حقلاً جديداً.`);
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
