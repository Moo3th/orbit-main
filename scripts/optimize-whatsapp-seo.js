/**
 * تحسين SEO صفحة واتساب بناءً على أبحاث Ahrefs (السوق السعودي):
 * المرتكز عنقود «واتساب API»: واتساب api (250/KD0)، واتساب بزنس api (60)، سعر/تكلفة/تفعيل/اشتراك/مقدمي حلول واتساب api.
 * الاستراتيجية: قيادة العنوان و H1 بالعبارة المستهدفة حرفياً + تغطية نية الكلمات التعريفية والتجارية.
 *
 * التشغيل: node scripts/optimize-whatsapp-seo.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const WA_SEO = {
  title: 'واتساب بزنس API في السعودية | أسعار وتفعيل واتساب API — المدار',
  titleEn: 'WhatsApp Business API in Saudi Arabia — Pricing & Activation | CORBIT',
  description:
    'واتساب بزنس API من المدار، مزوّد حلول واتساب API في السعودية: تفعيل واشتراك سريع، أسعار واضحة، قوالب رسائل معتمدة، شات بوت، الشارة الخضراء، وتكامل مع سلة ودفترة. ابدأ تجربتك المجانية.',
  descriptionEn:
    'CORBIT — your WhatsApp Business API provider in Saudi Arabia: fast activation, clear pricing, approved templates, chatbot, green tick, and Salla/Daftra integration. Start your free trial.',
  keywords:
    'واتساب api, واتساب بزنس api, واتساب بيزنس api, api واتساب, api واتساب للأعمال, واتساب للأعمال api, واتساب أعمال api, واجهة api واتساب للأعمال في السعودية, سعر واتساب api, تكاليف واتساب api, اشتراك واتساب api, تفعيل واتساب api, رابط واتساب api, تحميل واتساب api, مقدمي حلول واتساب api, تكامل api واتساب, خدمة واتساب بزنس api, ماهو واتساب api, واتساب api مجانا, واتساب api السعودية, قوالب واتساب, الشارة الخضراء, المدار, CORBIT',
  keywordsEn:
    'WhatsApp Business API, WhatsApp API, WhatsApp Business API Saudi Arabia, WhatsApp API pricing, WhatsApp API provider, WhatsApp API integration, WhatsApp API activation, WhatsApp API subscription, WhatsApp cloud API, business messaging, CORBIT',
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const pages = doc.pages || [];
  const idx = pages.findIndex((p) => p && (p.id === 'whatsapp' || p.path === '/products/whatsapp'));
  if (idx === -1) throw new Error('لا توجد صفحة whatsapp');

  const page = pages[idx];
  const prev = (page.seo && typeof page.seo === 'object') ? page.seo : {};
  console.log('— SEO الحالية —');
  console.log(JSON.stringify(prev, null, 1));

  pages[idx] = {
    ...page,
    seo: {
      ...prev,
      ...WA_SEO,
      canonical: prev.canonical || 'https://corbit.sa/products/whatsapp',
      ogImage: prev.ogImage || '',
      noIndex: prev.noIndex === true ? true : false,
    },
  };
  await col.updateOne({ _id: doc._id }, { $set: { pages } });
  console.log('\n— SEO الجديدة —');
  console.log(JSON.stringify(pages[idx].seo, null, 1));
  console.log('\n✅ تم.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
