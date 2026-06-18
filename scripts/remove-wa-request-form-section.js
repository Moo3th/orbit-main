/**
 * توحيد فورم الواتساب: حذف قسم wa-request-form من صفحة whatsapp في sitecms،
 * بعد نقل قيمته notification_email إلى FormConfig(whatsapp).notificationEmails (إن لم تكن مضبوطة).
 *
 * التشغيل: node scripts/remove-wa-request-form-section.js
 */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function run() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI غير معرّف في .env.local');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);
  const db = mongoose.connection.db;

  // (1) اقرأ notification_email من قسم wa-request-form
  const cms = db.collection('sitecms');
  const doc = (await cms.findOne({ key: 'primary' })) || (await cms.findOne({}));
  const pages = doc.pages || [];
  const pi = pages.findIndex((p) => p && (p.id === 'whatsapp' || p.path === '/products/whatsapp'));
  if (pi === -1) throw new Error('لا توجد صفحة whatsapp');
  const sections = pages[pi].sections || [];
  const si = sections.findIndex((s) => s.id === 'wa-request-form');

  let notifyEmail = '';
  if (si !== -1) {
    const f = (sections[si].fields || []).find((x) => x.key === 'notification_email');
    notifyEmail = (f && (f.value || f.valueEn)) || '';
    console.log('— notification_email من القسم:', notifyEmail || '(فارغ)');
  } else {
    console.log('— لا يوجد قسم wa-request-form (ربما أُزيل سابقًا).');
  }

  // (2) انقل البريد إلى FormConfig(whatsapp) إن لم يكن مضبوطًا
  if (notifyEmail) {
    const fc = db.collection('formconfigs');
    const wa = await fc.findOne({ productId: 'whatsapp' });
    if (wa && !(wa.notificationEmails && wa.notificationEmails.trim())) {
      await fc.updateOne({ productId: 'whatsapp' }, { $set: { notificationEmails: notifyEmail, updatedAt: new Date() } });
      console.log('📧 ضُبِط FormConfig(whatsapp).notificationEmails =', notifyEmail);
    } else if (wa) {
      console.log('ℹ️  FormConfig(whatsapp).notificationEmails مضبوط مسبقًا:', wa.notificationEmails);
    } else {
      console.log('⚠️  لا يوجد FormConfig بـ productId=whatsapp.');
    }
  }

  // (3) احذف القسم
  if (si !== -1) {
    pages[pi] = { ...pages[pi], sections: sections.filter((s) => s.id !== 'wa-request-form') };
    await cms.updateOne({ _id: doc._id }, { $set: { pages } });
    console.log('🗑️  حُذف قسم wa-request-form من صفحة whatsapp.');
  }

  console.log('\n✅ تم.');
  await mongoose.disconnect();
}

run().catch((e) => { console.error('❌', e.message); process.exit(1); });
