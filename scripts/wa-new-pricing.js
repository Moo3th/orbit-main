/**
 * تحديث تسعير صفحة واتساب إلى باقات WhatsBit 2026:
 * - أربع باقات (الأساسية، البداية، الأعمال، المؤسسات)، شريحة (سعر) واحدة لكل باقة.
 * - الأرقام المحدّدة بجانبها «+»؛ المؤسسات = «تواصل معنا» (بلا سعر) ومستخدمون غير محدودون والزر → /contact.
 * - تحديث رسوم Meta لكل رسالة (api_prices_list) لتطابق ملف الباقات.
 * - تحديث ملاحظة الباقات (contact_note) وحاشية رسوم Meta (api_note).
 * - لا تُضاف «حزم الرسائل الإضافية».
 *
 * يكتب على القسم wa-pricing في صفحة whatsapp بمستند sitecms (key=primary):
 * value = عربي، valueEn = إنجليزي (يطابق getCmsField/parseWhatsAppPlans).
 *
 * idempotent: يُحدّث الحقول الموجودة (overwrite) ويُنشئ الناقصة بنفس القيم عند إعادة التشغيل.
 * التشغيل: node scripts/wa-new-pricing.js   (أو npm run seed:wa-pricing)
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const SUBSCRIBE_URL = 'https://wapp.mobile.net.sa/billing-subscription';

// ——— الباقات (عربي) — شريحة واحدة لكل باقة ———
const plansAr = [
  {
    id: 'basic', name: 'الأساسية', period: 'شهرياً', popular: false, badge: '',
    subscribeLabel: 'اشترك الآن', subscribeUrl: SUBSCRIBE_URL, subscribeUrlType: 'form',
    additionalFeatures: [
      '1,000 محادثة خدمية شهرياً',
      'مستخدمان + رقم واتساب واحد',
      '15 قالب رسالة جاهز',
      'ردود تلقائية بقواعد ثابتة',
      'امتثال كامل ZATCA + PDPL',
      'نسخ احتياطية للمحادثات (30 يوماً)',
      'تقارير إرسال + لوحة معلومات أساسية',
      'دعم بريد إلكتروني خلال 24 ساعة',
    ],
    tiers: [{ name: 'الباقة', price: '199', priceWithTax: '228.85', setupFee: 'حسب الحالة', conversations: '1,000+', broadcastMessages: '', users: '2+' }],
  },
  {
    id: 'starter', name: 'البداية', period: 'شهرياً', popular: false, badge: '',
    subscribeLabel: 'اشترك الآن', subscribeUrl: SUBSCRIBE_URL, subscribeUrlType: 'form',
    additionalFeatures: [
      '10,000 محادثة خدمية + 5,000 رسالة بث شهرياً',
      'شات بوت ذكي بـ 5,000 رسالة/شهر',
      '5 مستخدمين + العلامة الزرقاء (التوثيق)',
      'تكامل مع سلة وزد و Shopify',
      'تحليل الحملات + تصدير بيانات Excel',
      'وصول API محدود (5,000 طلب/شهر)',
      'تتبع جودة الحساب + 30 قالباً',
      'دعم بريد + واتساب خلال 4 ساعات',
    ],
    tiers: [{ name: 'الباقة', price: '399', priceWithTax: '458.85', setupFee: 'حسب الحالة', conversations: '10,000+', broadcastMessages: '5,000+', users: '5+' }],
  },
  {
    id: 'business', name: 'الأعمال', period: 'شهرياً', popular: true, badge: 'الأكثر طلباً',
    subscribeLabel: 'اشترك الآن', subscribeUrl: SUBSCRIBE_URL, subscribeUrlType: 'form',
    additionalFeatures: [
      'محادثات خدمية غير محدودة + 10,000 رسالة بث',
      'شات بوت غير محدود + وكيل AI كامل (10,000 رسالة)',
      '15 مستخدماً + 60 قالب رسالة',
      'API كامل (50,000 طلب/شهر) + Webhooks',
      'تكامل HubSpot/Zoho/Salesforce + ربط ERP',
      'تدريب البوت على بيانات شركتك',
      'مدير حساب مخصص + جلسة تدريب',
      'دعم بريد + هاتف خلال ساعتين',
    ],
    tiers: [{ name: 'الباقة', price: '867', priceWithTax: '997.05', setupFee: 'حسب الحالة', conversations: 'غير محدود', broadcastMessages: '10,000+', users: '15+' }],
  },
  {
    id: 'enterprise', name: 'المؤسسات', period: 'شهرياً', popular: false, badge: '',
    subscribeLabel: 'تواصل معنا', subscribeUrl: '/contact', subscribeUrlType: 'external',
    additionalFeatures: [
      'كل شيء غير محدود (محادثات + بث + بوت)',
      'AI Agent (50,000 رسالة) + متعدد الوكلاء',
      'مستخدمون غير محدودون + 10 أرقام واتساب',
      'API مفتوح غير محدود + SDKs رسمية',
      'بيئة اختبار (Sandbox) + Webhooks مخصصة',
      'نماذج LLM متعددة (Claude/GPT/Gemini)',
      'اتفاقية مستوى خدمة SLA 99.9% مخصصة',
      'دعم أولوية 24/7 خلال ساعة واحدة',
    ],
    tiers: [{ name: 'الباقة', price: 'تواصل معنا', priceWithTax: '', setupFee: '', conversations: 'غير محدود', broadcastMessages: 'غير محدود', users: 'غير محدود' }],
  },
];

// ——— الباقات (إنجليزي) ———
const plansEn = [
  {
    id: 'basic', name: 'Basic', period: 'Monthly', popular: false, badge: '',
    subscribeLabel: 'Subscribe Now', subscribeUrl: SUBSCRIBE_URL, subscribeUrlType: 'form',
    additionalFeatures: [
      '1,000 service conversations / month',
      '2 users + 1 WhatsApp number',
      '15 ready-made message templates',
      'Rule-based auto-replies',
      'Full ZATCA + PDPL compliance',
      'Conversation backups (30 days)',
      'Delivery reports + basic dashboard',
      'Email support within 24 hours',
    ],
    tiers: [{ name: 'Plan', price: '199', priceWithTax: '228.85', setupFee: 'On request', conversations: '1,000+', broadcastMessages: '', users: '2+' }],
  },
  {
    id: 'starter', name: 'Starter', period: 'Monthly', popular: false, badge: '',
    subscribeLabel: 'Subscribe Now', subscribeUrl: SUBSCRIBE_URL, subscribeUrlType: 'form',
    additionalFeatures: [
      '10,000 service conversations + 5,000 broadcast messages / month',
      'Smart chatbot with 5,000 messages/month',
      '5 users + blue tick (verification)',
      'Integration with Salla, Zid & Shopify',
      'Campaign analytics + Excel export',
      'Limited API access (5,000 requests/month)',
      'Account quality tracking + 30 templates',
      'Email + WhatsApp support within 4 hours',
    ],
    tiers: [{ name: 'Plan', price: '399', priceWithTax: '458.85', setupFee: 'On request', conversations: '10,000+', broadcastMessages: '5,000+', users: '5+' }],
  },
  {
    id: 'business', name: 'Business', period: 'Monthly', popular: true, badge: 'Most Popular',
    subscribeLabel: 'Subscribe Now', subscribeUrl: SUBSCRIBE_URL, subscribeUrlType: 'form',
    additionalFeatures: [
      'Unlimited service conversations + 10,000 broadcast messages',
      'Unlimited chatbot + full AI Agent (10,000 messages)',
      '15 users + 60 message templates',
      'Full API (50,000 requests/month) + Webhooks',
      'HubSpot/Zoho/Salesforce integration + ERP linking',
      'Train the bot on your company data',
      'Dedicated account manager + training session',
      'Email + phone support within 2 hours',
    ],
    tiers: [{ name: 'Plan', price: '867', priceWithTax: '997.05', setupFee: 'On request', conversations: 'Unlimited', broadcastMessages: '10,000+', users: '15+' }],
  },
  {
    id: 'enterprise', name: 'Enterprise', period: 'Monthly', popular: false, badge: '',
    subscribeLabel: 'Contact us', subscribeUrl: '/contact', subscribeUrlType: 'external',
    additionalFeatures: [
      'Everything unlimited (conversations + broadcast + bot)',
      'AI Agent (50,000 messages) + multi-agent',
      'Unlimited users + 10 WhatsApp numbers',
      'Unlimited open API + official SDKs',
      'Sandbox environment + dedicated Webhooks',
      'Multiple LLM models (Claude/GPT/Gemini)',
      'Custom 99.9% SLA',
      '24/7 priority support within 1 hour',
    ],
    tiers: [{ name: 'Plan', price: 'Contact us', priceWithTax: '', setupFee: '', conversations: 'Unlimited', broadcastMessages: 'Unlimited', users: 'Unlimited' }],
  },
];

// ——— رسوم Meta لكل رسالة (محدّثة من ملف باقات WhatsBit 2026) ———
const convAr = [
  { type: 'محادثات خدمة العملاء', price: 'مجانية', duration: '24 ساعة', description: 'مجانية تماماً داخل نافذة 24 ساعة من رسالة العميل', isFree: true },
  { type: 'رسائل التحقق المحلية (OTP)', price: '0.059', duration: 'للرسالة', description: 'للأرقام السعودية — رموز التحقق وتأكيد الهوية للمصادقة الآمنة', isFree: false },
  { type: 'رسائل الخدمات (Utility)', price: '0.059', duration: 'للرسالة', description: 'تأكيد الطلبات وإشعارات الشحن — مجانية داخل نافذة خدمة العملاء', isFree: false },
  { type: 'رسائل التسويق', price: '0.187', duration: 'للرسالة', description: 'رسائل ترويجية وحملات إعلانية — حدّثتها Meta في 1 أبريل 2026', isFree: false },
];
const convEn = [
  { type: 'Customer Service Conversations', price: 'Free', duration: '24 Hours', description: "Completely free within 24 hours of the customer's last message", isFree: true },
  { type: 'Local Verification (OTP)', price: '0.059', duration: 'per message', description: 'For Saudi numbers — verification codes and identity confirmation', isFree: false },
  { type: 'Utility Messages', price: '0.059', duration: 'per message', description: 'Order confirmations and shipping notices — free within the customer service window', isFree: false },
  { type: 'Marketing Messages', price: '0.187', duration: 'per message', description: 'Promotional messages and ad campaigns — updated by Meta on 1 April 2026', isFree: false },
];

const contactNoteAr = 'الأسعار شهرية وشاملة ضريبة القيمة المضافة 15%. رسوم التأسيس والإعداد تُحدّد حسب كل حالة. تتوفر خصومات خاصة للشركات الكبرى والجهات الحكومية.';
const contactNoteEn = 'Prices are monthly and include 15% VAT. Setup and onboarding fees are determined case by case. Special discounts are available for large companies and government entities.';
const apiNoteAr = '* رسوم Meta لكل رسالة وتُحدّدها Meta وقد تتغيّر ربع سنوياً. التوثيق الدولي 0.191 ر.س للأرقام خارج السعودية، ونافذة CTWA (إعلانات الضغط للواتساب) مجانية 72 ساعة بعد نقر العميل.';
const apiNoteEn = '* Meta charges per message; rates are set by Meta and may change quarterly. International authentication is SAR 0.191 for non-Saudi numbers, and the CTWA (Click-to-WhatsApp ads) window is free for 72 hours after the customer taps.';

// الحقول المراد كتابتها على القسم wa-pricing (overwrite للقيمة، مع إنشاء عند الغياب).
const UPDATES = [
  { key: 'plans_list', label: 'تفاصيل الباقات', labelEn: 'Packages Details', type: 'list', value: JSON.stringify(plansAr), valueEn: JSON.stringify(plansEn) },
  { key: 'api_prices_list', label: 'قائمة رسوم Meta', labelEn: 'Meta Fees List', type: 'list', value: JSON.stringify(convAr), valueEn: JSON.stringify(convEn) },
  { key: 'contact_note', label: 'نص ملاحظة الباقات', labelEn: 'Plans Note Text', type: 'textarea', value: contactNoteAr, valueEn: contactNoteEn },
  { key: 'api_note', label: 'حاشية رسوم Meta', labelEn: 'Meta Fees Footnote', type: 'textarea', value: apiNoteAr, valueEn: apiNoteEn },
];

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
  const sec = (wa.sections || []).find((s) => s.id === 'wa-pricing');
  if (!sec) throw new Error('لا يوجد قسم wa-pricing');
  sec.fields = sec.fields || [];

  let updated = 0, created = 0;
  for (const def of UPDATES) {
    const existing = sec.fields.find((x) => x.key === def.key);
    if (existing) {
      existing.value = def.value;
      existing.valueEn = def.valueEn;
      if (!existing.type) existing.type = def.type;
      updated++;
      console.log(`✏️  حُدّث wa-pricing/${def.key}`);
    } else {
      sec.fields.push(def);
      created++;
      console.log(`➕ أُنشئ wa-pricing/${def.key}`);
    }
  }

  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log(`\n✅ تم: ${updated} محدّث، ${created} منشأ. (4 باقات × شريحة واحدة + رسوم Meta)`);
  console.log('ℹ️  لإظهار التغيير فوراً: احفظ من لوحة الأدمن لإبطال كاش site-cms، أو انتظر ~60 ثانية، أو انشر.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
