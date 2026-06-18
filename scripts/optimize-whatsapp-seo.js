/**
 * تحسين SEO صفحة واتساب بناءً على أبحاث Ahrefs (السوق السعودي):
 * واتساب اعمال (7500/KD7)، واتساب api (250/KD0)، واتساب بزنس (300/KD13)، ربط واتساب (90/KD8).
 *
 * التشغيل: node scripts/optimize-whatsapp-seo.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const WA_SEO = {
  title: 'واتساب أعمال API | منصة واتساب بزنس للشركات — المدار',
  titleEn: 'WhatsApp Business API for Companies in Saudi Arabia | CORBIT',
  description:
    'واتساب أعمال API من المدار: أطلق حملات واتساب بزنس، قوالب رسائل معتمدة، علامة موثّقة (Green Tick)، ردود آلية عبر شات بوت، وتكامل مع متجرك — بدعم سعودي على مدار الساعة. ابدأ تجربتك المجانية.',
  descriptionEn:
    'CORBIT WhatsApp Business API: launch WhatsApp Business campaigns, approved message templates, verified green tick, chatbot auto-replies, and store integrations — with 24/7 Saudi support. Start your free trial.',
  keywords:
    'واتساب أعمال, واتساب اعمال, واتساب بزنس, واتساب API, واتساب للأعمال, ربط واتساب, قوالب واتساب, العلامة الموثقة, شات بوت واتساب, حملات واتساب, واتساب السعودية, المدار, CORBIT',
  keywordsEn:
    'WhatsApp Business API, WhatsApp Business, WhatsApp API Saudi Arabia, WhatsApp templates, green tick verification, WhatsApp chatbot, WhatsApp marketing, business messaging, CORBIT',
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
