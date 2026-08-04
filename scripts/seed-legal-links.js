/**
 * ضبط روابط السياسات الظاهرة في تذييل الموقع (idempotent):
 *   1) الشروط والأحكام            /terms            (موجودة)
 *   2) سياسة الخصوصية             /privacy          (موجودة — تُفعَّل)
 *   3) سياسة الاسترجاع والإلغاء    /refund-policy    (موجودة — تُفعَّل)
 *   4) تنظيمات الرسائل الاقتحامية  /anti-spam        (تُنشأ)
 *   5) سياسة الاستخدام المقبول     /acceptable-use   (موجودة — تُفعَّل)
 *
 * كذلك يضيف الحقل `link` (سلوك الرابط عند الضغط) للصفحات القديمة بقيمته
 * الافتراضية «فتح صفحة السياسة»، حتى تظهر الخيارات الثلاثة في لوحة التحكم.
 *
 * لا يكتب فوق محتوى محرَّر: الصفحة الموجودة يُضبط ظهورها وترتيبها فقط.
 * التشغيل: npm run seed:legal-links
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const bi = () => ({ en: { type: String, default: '' }, ar: { type: String, default: '' } });
const linkSchema = new mongoose.Schema({
  type: { type: String, enum: ['page', 'anchor', 'file'], default: 'page' },
  targetSlug: { type: String, default: '' },
  targetAnchor: { type: String, default: '' },
  targetLabel: bi(),
  fileUrl: { type: String, default: '' },
  fileName: { type: String, default: '' },
  openInNewTab: { type: Boolean, default: false },
}, { _id: false });

const schema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  title: bi(), content: bi(),
  seo: { title: bi(), description: bi() },
  link: { type: linkSchema, default: () => ({ type: 'page' }) },
  isActive: { type: Boolean, default: true },
  isSystem: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const LegalPage = mongoose.models.LegalPage || mongoose.model('LegalPage', schema);

const CONTACT_AR = '<a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900';
const CONTACT_EN = '<a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900';

/** الترتيب المطلوب لروابط التذييل. */
const ORDER = {
  terms: 1,
  privacy: 2,
  'refund-policy': 3,
  'anti-spam': 4,
  'acceptable-use': 5,
};

/** صفحة جديدة: تنظيمات الرسائل الاقتحامية (سياسة مستقلة). */
const ANTI_SPAM = {
  slug: 'anti-spam',
  order: ORDER['anti-spam'],
  title: { ar: 'تنظيمات الرسائل الاقتحامية', en: 'Anti-Spam Regulations' },
  seo: {
    title: { ar: 'تنظيمات الرسائل الاقتحامية | المدار', en: 'Anti-Spam Regulations | CORBIT' },
    description: {
      ar: 'تنظيمات الحد من الرسائل والمكالمات الاقتحامية المطبَّقة على خدمات المدار (CORBIT) وفق أنظمة هيئة الاتصالات والفضاء والتقنية.',
      en: 'Regulations on limiting unsolicited messages and calls applied to CORBIT services in line with CST rules.',
    },
  },
  content: {
    ar: `<h2>مقدمة</h2><p>تلتزم المدار (CORBIT) بتنظيمات الحد من الرسائل والمكالمات الاقتحامية الصادرة عن هيئة الاتصالات والفضاء والتقنية، ويلتزم عملاؤنا بها كشرط لاستخدام الخدمة.</p>
<h2>الموافقة المسبقة</h2><p>لا تُرسل الرسائل التسويقية إلا إلى من وافق مسبقاً على استقبالها، ويجب أن تكون الموافقة صريحة وموثّقة ويمكن إثباتها عند الطلب.</p>
<h2>هوية المرسل</h2><p>يجب أن تحمل كل رسالة اسم المرسل المعتمد بوضوح، ويُمنع انتحال هوية جهة أخرى أو إخفاء مصدر الرسالة.</p>
<h2>إيقاف الاستقبال</h2><p>تتضمن الرسائل التسويقية وسيلة واضحة ومجانية لإيقاف الاستقبال، ويُنفَّذ طلب الإيقاف فوراً دون شروط أو تأخير.</p>
<h2>المحتوى الممنوع</h2><p>يُمنع إرسال محتوى احتيالي أو مضلل أو مخالف للأنظمة، ويُمنع الإرسال الجماعي دون موافقة المستلمين.</p>
<h2>المخالفات والبلاغات</h2><p>يحق للمدار تعليق أو إنهاء الخدمة فوراً عند مخالفة هذه التنظيمات. للإبلاغ عن رسالة اقتحامية تواصل معنا.</p>
<h2>التواصل</h2><p>${CONTACT_AR}.</p>
<p>السجل التجاري: 7012398264 — رقم الترخيص: LGP0921-22.</p>`,
    en: `<h2>Introduction</h2><p>CORBIT complies with the regulations on limiting unsolicited messages and calls issued by the Communications, Space &amp; Technology Commission (CST). Our customers must comply with them as a condition of using the service.</p>
<h2>Prior Consent</h2><p>Marketing messages are sent only to recipients who have given prior, explicit, and documented consent that can be evidenced on request.</p>
<h2>Sender Identity</h2><p>Every message must clearly carry the approved sender name. Impersonating another party or hiding the message source is prohibited.</p>
<h2>Opt-Out</h2><p>Marketing messages include a clear, free way to stop receiving them, and opt-out requests are honored immediately, unconditionally, and without delay.</p>
<h2>Prohibited Content</h2><p>Fraudulent, misleading, or unlawful content is prohibited, as is bulk messaging without recipient consent.</p>
<h2>Violations &amp; Reports</h2><p>CORBIT may suspend or terminate the service immediately upon violation of these regulations. To report a spam message, contact us.</p>
<h2>Contact</h2><p>${CONTACT_EN}.</p>
<p>Commercial Registration: 7012398264 — License No.: LGP0921-22.</p>`,
  },
};

/** أُنشئت بالخطأ كرابط واحد مجمّع — السياسات الثلاث منفصلة. */
const OBSOLETE_SLUG = 'privacy-refund-anti-spam';

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);

  // 1) الحقل الجديد للصفحات القديمة
  const backfilled = await LegalPage.updateMany(
    { link: { $exists: false } },
    { $set: { link: { type: 'page', targetSlug: '', targetAnchor: '', targetLabel: { ar: '', en: '' }, fileUrl: '', fileName: '', openInNewTab: false } } }
  );
  console.log(`  حقل link: أُضيف إلى ${backfilled.modifiedCount} صفحة`);

  // 2) إزالة الصفحة المجمّعة إن وُجدت
  const obsolete = await LegalPage.findOne({ slug: OBSOLETE_SLUG });
  if (obsolete) {
    await LegalPage.deleteOne({ _id: obsolete._id });
    console.log('  حُذفت الصفحة المجمّعة:', OBSOLETE_SLUG);
  }

  // 3) صفحة تنظيمات الرسائل الاقتحامية
  const antiSpam = await LegalPage.findOne({ slug: ANTI_SPAM.slug });
  if (!antiSpam) {
    await LegalPage.create({ ...ANTI_SPAM, isSystem: true, isActive: true, link: { type: 'page' } });
    console.log('  أُنشئت:', ANTI_SPAM.slug);
  } else if (!antiSpam.isActive || antiSpam.order !== ANTI_SPAM.order) {
    antiSpam.isActive = true;
    antiSpam.order = ANTI_SPAM.order;
    await antiSpam.save();
    console.log('  فُعّلت ورُتّبت:', ANTI_SPAM.slug);
  } else {
    console.log('  تخطّي (نشطة):', ANTI_SPAM.slug);
  }

  // 4) تفعيل وترتيب بقية السياسات الظاهرة في التذييل
  for (const slug of ['terms', 'privacy', 'refund-policy', 'acceptable-use']) {
    const page = await LegalPage.findOne({ slug });
    if (!page) {
      console.log(`  ⚠️ ${slug} غير موجودة — شغّل npm run seed:legal أولاً`);
      continue;
    }
    if (!page.isActive || page.order !== ORDER[slug]) {
      page.isActive = true;
      page.order = ORDER[slug];
      await page.save();
      console.log('  فُعّلت ورُتّبت:', slug);
    } else {
      console.log('  تخطّي (نشطة):', slug);
    }
  }

  const active = await LegalPage.find({ isActive: true }).sort({ order: 1 }).lean();
  console.log('\nروابط التذييل الآن:');
  for (const p of active) console.log(`  ${p.order}. ${p.title?.ar} → /${p.slug} (${p.link?.type || 'page'})`);

  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => { console.error('❌', e.message); process.exit(1); });
