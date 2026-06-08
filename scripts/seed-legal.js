/**
 * زرع الصفحات القانونية النظامية الأربع في قاعدة البيانات (idempotent).
 * يحافظ على أي تعديلات سابقة: لا يكتب فوق صفحة موجودة، فقط ينشئ الناقص.
 * التشغيل: node scripts/seed-legal.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const bi = () => ({ en: { type: String, default: '' }, ar: { type: String, default: '' } });
const schema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  title: bi(), content: bi(),
  seo: { title: bi(), description: bi() },
  isActive: { type: Boolean, default: true },
  isSystem: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });
const LegalPage = mongoose.models.LegalPage || mongoose.model('LegalPage', schema);

const CONTACT_AR = '<a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900';
const PAGES = [
  {
    slug: 'terms', order: 1,
    title: { en: 'Terms & Conditions', ar: 'الشروط والأحكام' },
    seo: { title: { en: 'Terms & Conditions', ar: 'الشروط والأحكام' }, description: { en: 'Terms & Conditions for CORBIT services.', ar: 'الشروط والأحكام لخدمات المدار (CORBIT).' } },
    content: {
      ar: `<h2>مقدمة</h2><p>تحكم هذه الشروط والأحكام استخدامك لموقع وخدمات شركة المدار (CORBIT). باستخدامك خدماتنا فإنك توافق على الالتزام بهذه الشروط.</p>
<h2>الخدمات</h2><p>تقدّم المدار حلولاً تقنية تشمل خدمة الرسائل النصية، وواتساب للأعمال، ونظام O-Time للموارد البشرية، وبوابة Gov Gate.</p>
<h2>التزامات العميل</h2><p>يلتزم العميل باستخدام الخدمات وفق الأنظمة المعمول بها في المملكة العربية السعودية.</p>
<h2>التواصل</h2><p>لأي استفسار: ${CONTACT_AR}.</p><p>السجل التجاري: 7012398264 — رقم الترخيص: LGP0921-22.</p>`,
      en: `<h2>Introduction</h2><p>These Terms &amp; Conditions govern your use of CORBIT services. By using our services you agree to these terms.</p>
<h2>Services</h2><p>CORBIT provides SMS, WhatsApp Business API, O-Time HR, and Gov Gate.</p>
<h2>Customer Obligations</h2><p>Use the services in accordance with the regulations of Saudi Arabia.</p>
<h2>Contact</h2><p><a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p><p>CR: 7012398264 — License: LGP0921-22.</p>`,
    },
  },
  {
    slug: 'privacy', order: 2,
    title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    seo: { title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' }, description: { en: 'Privacy Policy for CORBIT services.', ar: 'سياسة الخصوصية لخدمات المدار (CORBIT).' } },
    content: {
      ar: `<h2>مقدمة</h2><p>تحترم المدار (CORBIT) خصوصيتك. توضّح هذه السياسة كيف نجمع بياناتك ونحميها.</p>
<h2>البيانات التي نجمعها</h2><p>الاسم والبريد ورقم الجوال وبيانات الشركة عند التواصل أو طلب الخدمات.</p>
<h2>استخدام البيانات</h2><p>نستخدمها للرد وتقديم الخدمات. لا نبيع بياناتك لأي طرف ثالث.</p>
<h2>التواصل</h2><p>${CONTACT_AR}.</p>`,
      en: `<h2>Introduction</h2><p>CORBIT respects your privacy. This policy explains how we collect and protect your data.</p>
<h2>Data We Collect</h2><p>Name, email, phone, and company details when you contact us.</p>
<h2>Use of Data</h2><p>To respond and provide services. We do not sell your data.</p>
<h2>Contact</h2><p><a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p>`,
    },
  },
  {
    slug: 'refund-policy', order: 3,
    title: { en: 'Refund & Cancellation Policy', ar: 'سياسة الاسترجاع والإلغاء' },
    seo: { title: { en: 'Refund & Cancellation Policy', ar: 'سياسة الاسترجاع والإلغاء' }, description: { en: 'Refund & Cancellation Policy for CORBIT services.', ar: 'سياسة الاسترجاع والإلغاء لخدمات المدار (CORBIT).' } },
    content: {
      ar: `<h2>مقدمة</h2><p>توضّح هذه السياسة أحكام الاسترجاع والإلغاء لخدمات المدار (CORBIT).</p>
<h2>طلبات الإلغاء</h2><p>يمكن طلب إلغاء الاشتراك وفق شروط كل باقة.</p>
<h2>الاسترجاع</h2><p>الخدمات المستهلكة (كالرسائل المرسلة) غير قابلة للاسترجاع.</p>
<h2>التواصل</h2><p>${CONTACT_AR}.</p>`,
      en: `<h2>Introduction</h2><p>This policy explains refund and cancellation terms for CORBIT services.</p>
<h2>Cancellation</h2><p>Subscription cancellation per each package's terms.</p>
<h2>Refunds</h2><p>Consumed services (such as sent messages) are non-refundable.</p>
<h2>Contact</h2><p><a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p>`,
    },
  },
  {
    slug: 'acceptable-use', order: 4,
    title: { en: 'Acceptable Use Policy', ar: 'سياسة الاستخدام المقبول' },
    seo: { title: { en: 'Acceptable Use Policy', ar: 'سياسة الاستخدام المقبول' }, description: { en: 'Acceptable Use Policy for CORBIT services.', ar: 'سياسة الاستخدام المقبول لخدمات المدار (CORBIT).' } },
    content: {
      ar: `<h2>مقدمة</h2><p>تحدّد هذه السياسة الاستخدامات المقبولة لخدمات المدار (CORBIT).</p>
<h2>الاستخدامات الممنوعة</h2><p>يُمنع إرسال محتوى مزعج أو احتيالي أو مخالف للأنظمة.</p>
<h2>الرسائل والحملات</h2><p>يلتزم العميل بأخذ موافقة المستلمين والالتزام بأنظمة هيئة الاتصالات والفضاء والتقنية.</p>
<h2>التواصل</h2><p>${CONTACT_AR}.</p>`,
      en: `<h2>Introduction</h2><p>This policy defines acceptable uses of CORBIT services.</p>
<h2>Prohibited Uses</h2><p>No spam, fraud, or content that violates regulations.</p>
<h2>Messages &amp; Campaigns</h2><p>Obtain recipients' consent and comply with CST regulations.</p>
<h2>Contact</h2><p><a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p>`,
    },
  },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  let created = 0, skipped = 0;
  for (const p of PAGES) {
    const exists = await LegalPage.findOne({ slug: p.slug });
    if (exists) {
      // نضمن فقط أنها نظامية، دون الكتابة فوق المحتوى المحرّر
      if (!exists.isSystem) { exists.isSystem = true; await exists.save(); }
      skipped++;
      console.log('  تخطّي (موجودة):', p.slug);
    } else {
      await LegalPage.create({ ...p, isSystem: true, isActive: true });
      created++;
      console.log('  أُنشئت:', p.slug);
    }
  }
  console.log(`\n✅ اكتمل: أُنشئت ${created}، موجودة ${skipped}`);
  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
