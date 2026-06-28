/**
 * زرع محتوى SEO صفحة واتساب في DB (CMS) — مكمّل لتعديلات الكود:
 *  1) تحديث العناوين الظاهرة لتقود بـ«واتساب بزنس API» (overwrite آمن: يطابق القيمة القديمة المعروفة فقط).
 *  2) زرع قسم «ما هو واتساب API؟» (wa-about-api) بعد الهيرو مباشرة — قابل للتحرير من اللوحة.
 *  3) زرع الأسئلة الشائعة الموسّعة (10) في wa-faq/faq_json (تغذّي FAQPage JSON-LD وتُحرَّر بـ FaqListEditor).
 *
 * idempotent: لا يكرّر القسم، ولا يستبدل عنواناً عُدّل يدوياً (يطابق القيمة القديمة فقط).
 * ثنائي اللغة: value = عربي، valueEn = إنجليزي (يطابق getCmsField/getCmsJson).
 *
 * التشغيل: node scripts/wa-seo-content.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// (1) تحديثات العناوين — تُطبَّق فقط إذا طابقت القيمة الحالية القيمة القديمة المعروفة أو كانت فارغة.
const HEADING_UPDATES = [
  {
    sec: 'wa-chatbot', key: 'hero_title_ar',
    oldValue: 'تواصل احترافي مع عملائك عبر واتساب أعمال',
    value: 'واتساب بزنس API — واجهة واتساب الرسمية للتواصل مع عملائك في السعودية',
    valueEn: 'WhatsApp Business API — the Official WhatsApp Interface to Reach Your Customers in Saudi Arabia',
  },
  {
    sec: 'wa-chatbot', key: 'hero_subtitle_ar',
    oldValue: 'كن أقرب لعملائك على واتساب — رسائل تسويقية معتمدة، ردود آلية ذكية، وإدارة محادثات مركزية من لوحة تحكم واحدة',
    value: 'فعّل واجهة واتساب الأعمال الرسمية (WhatsApp Business API): قوالب رسائل معتمدة، ردود آلية وشات بوت، الشارة الخضراء، وتكامل مع متجرك — بأسعار واضحة ودعم سعودي.',
    valueEn: 'Activate the official WhatsApp Business API: approved message templates, auto-replies and chatbot, the green tick, and store integration — with clear pricing and Saudi support.',
  },
  {
    sec: 'wa-features', key: 'solutions_title',
    oldValue: 'أدوات احترافية لإدارة محادثاتك',
    value: 'كل ما تحتاجه من واتساب API لإدارة محادثاتك',
    valueEn: 'Everything you need from WhatsApp API to manage your conversations',
  },
  {
    sec: 'wa-why', key: 'title',
    oldValue: 'لماذا واتساب الأعمال؟',
    value: 'لماذا واتساب بزنس API مع المدار؟',
    valueEn: 'Why WhatsApp Business API with CORBIT?',
  },
];

// (3) الأسئلة الشائعة الموسّعة — تطابق WA_FAQ_DEFAULTS في src/lib/cms/waFaq.ts.
const FAQ = [
  { qAr: 'ما هو واتساب API (WhatsApp Business API)؟', qEn: 'What is WhatsApp Business API?', aAr: 'واتساب API هو واجهة واتساب الأعمال الرسمية من Meta، موجَّهة للشركات لإرسال الإشعارات والحملات والردود الآلية وإدارة محادثات آلاف العملاء عبر أنظمتك — دون تطبيق على الهاتف. يُستخدم عبر مزوّد حلول معتمد (BSP) مثل المدار يوفّر لك لوحة تحكم وواجهة برمجة وتفعيلاً رسمياً.', aEn: 'WhatsApp Business API is Meta’s official business interface for sending notifications, campaigns, and automated replies and managing conversations with thousands of customers through your own systems — without a phone app. It is used via an authorized solution provider (BSP) such as CORBIT, which gives you a dashboard, an API, and official activation.' },
  { qAr: 'ما الفرق بين واتساب أعمال API وتطبيق واتساب بزنس العادي؟', qEn: 'What is the difference between WhatsApp Business API and the regular WhatsApp Business app?', aAr: 'تطبيق واتساب بزنس مناسب للأعمال الصغيرة بجهاز واحد. أما واتساب أعمال API فيتيح إرسال حملات لآلاف العملاء، ردودًا آلية، تعدد المستخدمين، وتكاملًا مع أنظمتك ومتجرك — وهو ما نوفّره لك.', aEn: 'The WhatsApp Business app suits small businesses on a single device. WhatsApp Business API enables campaigns to thousands of customers, automated replies, multi-user access, and integration with your systems and store — which is what we provide.' },
  { qAr: 'كيف أفعّل واتساب API وأشترك فيه؟', qEn: 'How do I activate and subscribe to WhatsApp API?', aAr: 'تفعيل واتساب API مع المدار بسيط: تختار الباقة، نوثّق حساب أعمالك لدى Meta، نعتمد رقمك وقوالب رسائلك، ثم نسلّمك مفاتيح API ولوحة التحكم جاهزة للإرسال. يستغرق التفعيل عادةً من يوم إلى أيام قليلة حسب جاهزية المستندات.', aEn: 'Activating WhatsApp API with CORBIT is simple: pick a plan, we verify your business account with Meta, approve your number and message templates, then hand over your API keys and a ready-to-use dashboard. Activation usually takes from one day to a few days depending on your documents.' },
  { qAr: 'كم سعر واتساب API وكيف تُحتسب التكلفة؟', qEn: 'How much does WhatsApp API cost and how is pricing calculated?', aAr: 'تتكوّن التكلفة من جزأين: اشتراك منصة المدار الشهري (باقات مرنة موضّحة أعلى الصفحة)، وتكلفة المحادثات حسب أسعار Meta ونوعها (تسويقية، خدمية، مصادقة) — ومحادثات خدمة العملاء مجانية خلال 24 ساعة من آخر رسالة. تواصل معنا لعرض سعر يناسب حجم أعمالك.', aEn: 'Cost has two parts: CORBIT’s monthly platform subscription (flexible plans shown above) and per-conversation cost based on Meta’s rates and type (marketing, utility, authentication) — customer-service conversations are free within 24 hours of the last message. Contact us for a quote tailored to your size.' },
  { qAr: 'هل واتساب API مجاني؟', qEn: 'Is WhatsApp API free?', aAr: 'واجهة واتساب API ليست مجانية بالكامل: هناك اشتراك منصة وتكلفة محادثات حسب Meta. لكننا نوفّر تجربة مجانية للبدء، ومحادثات خدمة العملاء مجانية خلال 24 ساعة. احذر عروض «واتساب API مجاني» غير الرسمية فقد تُعرّض رقمك للحظر من Meta.', aEn: 'The WhatsApp API itself is not entirely free: there is a platform subscription and per-conversation cost set by Meta. However, we offer a free trial to get started, and customer-service conversations are free within 24 hours. Beware of unofficial “free WhatsApp API” offers — they can get your number banned by Meta.' },
  { qAr: 'هل أحتاج إلى تحميل برنامج أو تطبيق لاستخدام واتساب API؟', qEn: 'Do I need to download an app or software to use WhatsApp API?', aAr: 'لا. واتساب API خدمة سحابية تُدار من لوحة تحكم عبر المتصفح ومن خلال روابط الواجهة البرمجية (API) — لا يوجد «تحميل» أو رابط تنزيل لتطبيق. نوصّل رقمك بالواجهة الرسمية ونمنحك لوحة ومفاتيح للربط مع متجرك وأنظمتك.', aEn: 'No. WhatsApp API is a cloud service managed from a browser dashboard and through API endpoints — there is no app “download”. We connect your number to the official interface and give you a dashboard and keys to integrate with your store and systems.' },
  { qAr: 'من هو أفضل مقدّم حلول واتساب API في السعودية؟', qEn: 'Who is the best WhatsApp API provider in Saudi Arabia?', aAr: 'المدار مزوّد حلول واتساب API في السعودية، مرخّص من هيئة الاتصالات والفضاء والتقنية، بدعم عربي وفوترة محلية وتكامل مع سلة ودفترة ونور. نساعدك في التوثيق والعلامة الخضراء واعتماد القوالب وربط الـ API — كل ذلك من جهة واحدة موثوقة.', aEn: 'CORBIT is a WhatsApp API provider in Saudi Arabia, licensed by CST, with Arabic support, local invoicing, and integration with Salla, Daftra, and Noor. We help with verification, the green tick, template approval, and API integration — all from one trusted partner.' },
  { qAr: 'كيف أحصل على العلامة الخضراء الموثّقة (Green Tick)؟', qEn: 'How do I get the verified green tick?', aAr: 'نساعدك في تجهيز حساب واتساب أعمال وتقديم طلب التوثيق إلى Meta للحصول على العلامة الخضراء الرسمية التي تعزّز ثقة عملائك.', aEn: 'We help you set up your WhatsApp Business account and submit the verification request to Meta to obtain the official green tick that boosts your customers’ trust.' },
  { qAr: 'هل يمكنني إرسال حملات تسويقية وقوالب رسائل؟', qEn: 'Can I send marketing campaigns and message templates?', aAr: 'نعم، يمكنك إرسال حملات موجّهة باستخدام قوالب رسائل معتمدة من Meta مع أزرار تفاعلية، ونساعدك في اعتماد القوالب بسرعة.', aEn: 'Yes, you can send targeted campaigns using Meta-approved message templates with interactive buttons, and we help you get templates approved quickly.' },
  { qAr: 'هل يوجد شات بوت للردود الآلية وتكامل مع المتجر؟', qEn: 'Is there a chatbot for automated replies and store integration?', aAr: 'نعم، توفّر المنصة ردودًا آلية (شات بوت) لخدمة عملائك على مدار الساعة، وتكاملًا عبر API مرن مع منصات مثل سلة ودفترة ونور وأنظمتك الخاصة.', aEn: 'Yes, the platform offers a chatbot for 24/7 automated customer service, plus integration via a flexible API with platforms like Salla, Daftra, and Noor and your own systems.' },
];

// (2) بطاقات قسم «ما هو واتساب API؟» — تطابق ABOUT_API_BLOCKS في المكوّن.
const ABOUT_BLOCKS = [
  { titleAr: 'ما هو واتساب API؟', titleEn: 'What is WhatsApp API?', descAr: 'واتساب API (واجهة واتساب الأعمال الرسمية من Meta) حلٌّ للشركات لإرسال الإشعارات والحملات والردود الآلية وإدارة محادثات آلاف العملاء عبر أنظمتك — دون تطبيق على الهاتف، وعبر مزوّد حلول معتمد (BSP).', descEn: 'WhatsApp API (Meta’s official WhatsApp Business interface) lets businesses send notifications, campaigns, and automated replies and manage conversations with thousands of customers through your systems — without a phone app, via an authorized provider (BSP).' },
  { titleAr: 'الفرق عن تطبيق واتساب بزنس', titleEn: 'Difference from the WhatsApp Business app', descAr: 'تطبيق واتساب بزنس لجهاز واحد وأعمال صغيرة. أما واتساب بزنس API فيدعم تعدد المستخدمين، الحملات الجماعية، الشات بوت، والتكامل البرمجي مع متجرك وأنظمتك — بلا حدود الجهاز الواحد.', descEn: 'The WhatsApp Business app is for a single device and small businesses. WhatsApp Business API supports multiple users, bulk campaigns, chatbots, and programmatic integration with your store and systems — without single-device limits.' },
  { titleAr: 'كيف تشترك وتفعّل واتساب API؟', titleEn: 'How to subscribe and activate WhatsApp API', descAr: 'تختار الباقة، نوثّق حساب أعمالك لدى Meta، نعتمد رقمك وقوالبك، ثم نسلّمك مفاتيح API ولوحة التحكم. لا حاجة لتحميل برنامج — الخدمة سحابية بالكامل، ويُنجَز التفعيل عادةً خلال أيام قليلة.', descEn: 'Pick a plan, we verify your business with Meta, approve your number and templates, then hand over API keys and a dashboard. No software download — it’s fully cloud-based, and activation usually completes within a few days.' },
  { titleAr: 'أسعار وتكلفة واتساب API', titleEn: 'WhatsApp API pricing and cost', descAr: 'التكلفة = اشتراك المنصة الشهري + تكلفة المحادثات حسب أسعار Meta ونوعها (تسويقية/خدمية/مصادقة). محادثات خدمة العملاء مجانية خلال 24 ساعة. اطّلع على الباقات والأسعار في هذه الصفحة أو اطلب عرضاً.', descEn: 'Cost = monthly platform subscription + per-conversation cost per Meta’s rates and type (marketing/utility/authentication). Customer-service conversations are free within 24 hours. See plans and pricing on this page or request a quote.' },
  { titleAr: 'المدار: مقدّم حلول واتساب API في السعودية', titleEn: 'CORBIT: WhatsApp API provider in Saudi Arabia', descAr: 'المدار مزوّد معتمد ومرخّص من هيئة الاتصالات والفضاء والتقنية، يوفّر تفعيل واتساب API، العلامة الخضراء، اعتماد القوالب، شات بوت، وتكامل مع سلة ودفترة ونور — بدعم عربي وفوترة محلية.', descEn: 'CORBIT is a CST-licensed provider offering WhatsApp API activation, the green tick, template approval, chatbots, and integration with Salla, Daftra, and Noor — with Arabic support and local invoicing.' },
];

const ABOUT_SECTION = {
  id: 'wa-about-api',
  name: 'ما هو واتساب API؟ (تعريفي)',
  nameEn: 'What is WhatsApp API? (Intro)',
  visible: true,
  fields: [
    { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'ما هو واتساب API؟ ولماذا تحتاجه؟', valueEn: 'What is WhatsApp API and why do you need it?' },
    { key: 'subtitle', label: 'المقدّمة', labelEn: 'Intro', type: 'textarea', value: 'دليل سريع لفهم واجهة واتساب الأعمال الرسمية (WhatsApp Business API): ما هي، الفرق عن التطبيق، التفعيل والاشتراك، الأسعار، وكيف تبدأ مع مزوّد معتمد في السعودية.', valueEn: 'A quick guide to the official WhatsApp Business API: what it is, how it differs from the app, activation and subscription, pricing, and how to start with an authorized provider in Saudi Arabia.' },
    { key: 'blocks_json', label: 'البطاقات التعريفية', labelEn: 'Info Blocks', type: 'list', value: JSON.stringify(ABOUT_BLOCKS), valueEn: '' },
    { key: 'cta_text', label: 'نص رابط الدليل', labelEn: 'Guide Link Text', type: 'text', value: 'اقرأ الدليل الكامل: واتساب API خطوة بخطوة', valueEn: 'Read the full guide: WhatsApp API step by step' },
    { key: 'cta_url', label: 'رابط الدليل', labelEn: 'Guide Link URL', type: 'url', value: '/blog/whatsapp-business-api-saudi-arabia', valueEn: '/blog/whatsapp-business-api-saudi-arabia' },
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
  wa.sections = wa.sections || [];

  // (1) العناوين
  for (const u of HEADING_UPDATES) {
    const sec = wa.sections.find((s) => s.id === u.sec);
    if (!sec) { console.log(`⚠️  قسم ${u.sec} غير موجود — تخطٍّ`); continue; }
    sec.fields = sec.fields || [];
    const fld = sec.fields.find((x) => x.key === u.key);
    if (!fld) {
      sec.fields.push({ key: u.key, type: 'text', value: u.value, valueEn: u.valueEn });
      console.log(`➕ ${u.sec}/${u.key} (أُضيف)`);
    } else if (!fld.value || fld.value.trim() === '' || fld.value.trim() === u.oldValue.trim()) {
      fld.value = u.value;
      fld.valueEn = u.valueEn;
      console.log(`✏️  ${u.sec}/${u.key} (حُدِّث)`);
    } else {
      console.log(`⏭️  ${u.sec}/${u.key} (قيمة مخصّصة — لم تُلمس)`);
    }
  }

  // (3) الأسئلة الشائعة → wa-faq/faq_json (لا يُستبدل محتوى مخصّص موجود)
  const faqSec = wa.sections.find((s) => s.id === 'wa-faq');
  if (faqSec) {
    faqSec.fields = faqSec.fields || [];
    let faqFld = faqSec.fields.find((x) => x.key === 'faq_json');
    const isEmptyOrShort = (v) => {
      if (!v || !v.trim()) return true;
      try { const a = JSON.parse(v); return Array.isArray(a) && a.length <= 5; } catch { return true; }
    };
    if (!faqFld) {
      faqSec.fields.push({ key: 'faq_json', label: 'الأسئلة الشائعة', labelEn: 'FAQ', type: 'list', value: JSON.stringify(FAQ), valueEn: '' });
      console.log('➕ wa-faq/faq_json (أُضيف 10 أسئلة)');
    } else if (isEmptyOrShort(faqFld.value)) {
      faqFld.value = JSON.stringify(FAQ);
      console.log('✏️  wa-faq/faq_json (زُرعت 10 أسئلة)');
    } else {
      console.log('⏭️  wa-faq/faq_json (محتوى مخصّص — لم يُلمس)');
    }
  } else {
    console.log('⚠️  قسم wa-faq غير موجود — تخطٍّ');
  }

  // (2) قسم wa-about-api — إدراج بعد wa-chatbot مباشرة إن لم يكن موجوداً، ثم ضمان الحقول (idempotent)
  let aboutSec = wa.sections.find((s) => s.id === 'wa-about-api');
  if (!aboutSec) {
    let idx = wa.sections.findIndex((s) => s.id === 'wa-chatbot');
    if (idx === -1) idx = wa.sections.findIndex((s) => s.id === 'wa-hero');
    aboutSec = ABOUT_SECTION;
    wa.sections.splice(idx + 1, 0, aboutSec);
    console.log(`➕ wa-about-api (أُدرج في الفهرس ${idx + 1})`);
  } else {
    console.log('⏭️  wa-about-api موجود — ضمان الحقول');
  }
  aboutSec.fields = aboutSec.fields || [];
  for (const def of ABOUT_SECTION.fields) {
    if (!aboutSec.fields.some((x) => x.key === def.key)) {
      aboutSec.fields.push(def);
      console.log(`➕ wa-about-api/${def.key}`);
    }
  }

  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log('\n✅ تم حفظ التغييرات.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
