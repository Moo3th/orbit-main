/** قراءة فقط: عرض بنية حقول روابط أزرار صفحة الواتساب (label/type/options/value). */
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const col = mongoose.connection.db.collection('sitecms');
  const doc = (await col.findOne({ key: 'primary' })) || (await col.findOne({}));
  const wa = (doc.pages || []).find((p) => p.id === 'whatsapp');
  const want = /cta|url|type|subscribe|docs|merchant/i;
  for (const sec of wa.sections || []) {
    const fields = (sec.fields || []).filter((f) => want.test(f.key));
    if (!fields.length) continue;
    console.log(`\n## ${sec.id}`);
    for (const f of fields) {
      console.log(`  ${f.key} | type=${f.type || 'text'} | label="${f.label || ''}" / "${f.labelEn || ''}" | opts=${f.options ? JSON.stringify(f.options) : 'none'} | value="${(f.value||'').toString().slice(0,40)}"`);
    }
  }
  await mongoose.disconnect();
}
run().catch((e) => { console.error('ERR', e.message); process.exit(1); });
