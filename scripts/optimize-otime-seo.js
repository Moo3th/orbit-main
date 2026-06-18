/**
 * تحسين SEO صفحة O-Time بناءً على أبحاث Ahrefs (السوق السعودي، عربي).
 * الإستراتيجية: عنقود «حضور وانصراف + شؤون الموظفين» التجاري منخفض الصعوبة (KD 0–2، CPC مرتفع)
 *   + «نظام موارد بشرية» كموضوع أب. تجنّب «موارد بشرية» الواسعة التعليمية وعنقود قوالب الإكسل.
 *
 * التشغيل: node scripts/optimize-otime-seo.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const OT_SEO = {
  title: 'نظام موارد بشرية وحضور وانصراف | O-Time أو-تايم من المدار',
  titleEn: 'O-Time HR, Attendance & Payroll System (KSA) | CORBIT',
  description:
    'أو-تايم نظام موارد بشرية سعودي من المدار: حضور وانصراف بالبصمة، إدارة الإجازات، أتمتة مسير الرواتب، خدمة ذاتية للموظف، وتقارير ولوحات تحليلية متوافقة مع نظام حماية الأجور. اطلب عرضك الآن.',
  descriptionEn:
    'O-Time by CORBIT is a Saudi HR system: biometric attendance, leave management, automated payroll, employee self-service, and analytics dashboards. Book a demo.',
  keywords:
    'نظام موارد بشرية, برنامج حضور وانصراف, نظام شؤون الموظفين, برنامج شؤون الموظفين, نظام حضور وانصراف ذكي, أتمتة الرواتب, إدارة الإجازات, الخدمة الذاتية للموظف, بصمة الحضور والانصراف, أو-تايم',
  keywordsEn:
    'HR system Saudi Arabia, attendance system, employee management software, payroll automation, leave management software, biometric attendance, employee self-service, O-Time, HR software KSA',
};

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const pages = doc.pages || [];
  const idx = pages.findIndex((p) => p && (p.id === 'otime' || p.path === '/products/o-time'));
  if (idx === -1) throw new Error('لا توجد صفحة otime');

  const page = pages[idx];
  const prev = (page.seo && typeof page.seo === 'object') ? page.seo : {};
  console.log('— SEO الحالية —');
  console.log(JSON.stringify(prev, null, 1));

  pages[idx] = {
    ...page,
    seo: {
      ...prev,
      ...OT_SEO,
      canonical: prev.canonical || 'https://corbit.sa/products/o-time',
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
