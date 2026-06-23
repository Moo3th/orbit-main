/**
 * نشر مقال طويل (بصيغة قالب CORBIT) في المدونة من ملف Markdown.
 *
 * يقرأ ملف .md (الترويسة SEO + الجسم + الملحق التقني)، يحوّله إلى مقال منظم
 * (عنوان، وصف، جسم ماركداون، أسئلة شائعة، حقول SEO)، ثم يحفظه في مجموعة News.
 *
 * التشغيل:
 *   node scripts/seed-blog-article.js                       # الملف الافتراضي أدناه
 *   node scripts/seed-blog-article.js path/to/article.md    # ملف مخصّص
 *
 * idempotent: إن وُجد مقال بنفس الـ slug يُحدّث، وإلا يُنشأ.
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const DEFAULT_FILE = path.join(__dirname, '..', 'content', 'articles', '01-whatsapp-business-api-saudi-arabia.md');
const DEFAULTS = {
  category: 'WhatsApp',
  author: 'CORBIT | كوربت',
  image: '',
  featured: true,
  isActive: true,
};

// ──────────────── parsing (mirrors src/lib/blog/importMarkdown.ts) ────────────────
const firstComment = (raw) => (raw.match(/<!--([\s\S]*?)-->/) || [, ''])[1];
const lastComment = (raw) => {
  const all = [...raw.matchAll(/<!--([\s\S]*?)-->/g)];
  return all.length ? all[all.length - 1][1] : '';
};
const stripAllComments = (raw) => raw.replace(/<!--[\s\S]*?-->/g, '').trim();

const valueAfterLabelLine = (block, keyword) => {
  const lines = block.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].includes(keyword)) {
      for (let j = i + 1; j < lines.length; j += 1) {
        const c = lines[j].trim();
        if (c && !c.includes('====') && !c.endsWith(':')) return c;
      }
    }
  }
  return '';
};
const valueOnLabelLine = (block, keyword) => {
  for (const line of block.split(/\r?\n/)) {
    if (line.includes(keyword)) {
      const idx = line.indexOf(':');
      if (idx >= 0) return line.slice(idx + 1).trim();
    }
  }
  return '';
};
const splitKeywords = (v) => v.split(/[،,]/).map((s) => s.trim()).filter(Boolean);

const parseFaqSection = (section) => {
  const items = [];
  let q = '';
  let ans = [];
  const flush = () => {
    const answer = ans.join(' ').replace(/\s+/g, ' ').trim();
    if (q && answer) items.push({ question: q, answer });
    q = '';
    ans = [];
  };
  for (const raw of section.split(/\r?\n/)) {
    const line = raw.trim();
    const bold = line.match(/^\*\*(.+?)\*\*$/);
    if (bold) {
      flush();
      q = bold[1].trim();
    } else if (line.startsWith('#')) {
      flush();
    } else if (q && line) {
      ans.push(line);
    } else if (!line && q && ans.length) {
      flush();
    }
  }
  flush();
  return items;
};

const altFromAppendix = (appendix) => {
  const line = appendix.split(/\r?\n/).find((l) => l.includes('الصورة الرئيسية'));
  if (!line) return '';
  const m = line.match(/[“"«](.+?)[”"»]/);
  return m ? m[1].trim() : '';
};
const canonicalFromJsonLd = (appendix) => {
  const s = appendix.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i);
  if (!s) return '';
  try {
    const data = JSON.parse(s[1].trim());
    const graph = Array.isArray(data['@graph']) ? data['@graph'] : [data];
    const a = graph.find((n) => n && n['@type'] === 'Article');
    return a && typeof a.mainEntityOfPage === 'string' ? a.mainEntityOfPage : '';
  } catch {
    return '';
  }
};

function parseArticle(raw) {
  const seoBlock = firstComment(raw);
  const appendix = lastComment(raw);
  let body = stripAllComments(raw);

  const h1 = body.match(/^#\s+(.+)$/m);
  const titleAr = h1 ? h1[1].trim() : '';
  if (h1) body = body.replace(h1[0], '').trim();

  let faq = [];
  const faqHeading = body.match(/^##\s+.*الأسئلة\s+الشائعة.*$/m);
  if (faqHeading) {
    const start = body.indexOf(faqHeading[0]);
    const rest = body.slice(start + faqHeading[0].length);
    const nextIdx = rest.search(/^##\s+/m);
    const section = nextIdx === -1 ? rest : rest.slice(0, nextIdx);
    faq = parseFaqSection(section);
    const end = nextIdx === -1 ? body.length : start + faqHeading[0].length + nextIdx;
    body = (body.slice(0, start) + body.slice(end)).replace(/\n{3,}/g, '\n\n').trim();
  }

  const seoTitle = valueAfterLabelLine(seoBlock, 'Title Tag');
  const metaDesc = valueAfterLabelLine(seoBlock, 'Meta Description');
  const slug = valueAfterLabelLine(seoBlock, 'Slug');
  const focus = valueOnLabelLine(seoBlock, 'الكلمة المحورية');
  const secondary = valueOnLabelLine(seoBlock, 'الكلمات الثانوية');
  const keywords = [focus, ...splitKeywords(secondary)].filter(Boolean);

  return {
    titleAr,
    descriptionAr: metaDesc,
    slug,
    contentAr: body,
    faq,
    tags: keywords,
    imageAltAr: altFromAppendix(appendix),
    seo: {
      titleAr: seoTitle,
      descriptionAr: metaDesc,
      keywordsAr: keywords.join('، '),
      canonical: canonicalFromJsonLd(appendix),
    },
  };
}

// ──────────────── minimal News model (matches src/models/News.ts) ────────────────
const bi = () => ({ en: { type: String, default: '' }, ar: { type: String, default: '' } });
const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    titleAr: String,
    description: { type: String, required: true },
    descriptionAr: String,
    content: String,
    contentAr: String,
    contentFormat: { type: String, enum: ['html', 'markdown'], default: 'html' },
    image: String,
    images: { type: [String], default: [] },
    imageAlt: bi(),
    category: { type: String, required: true },
    author: { type: String, default: '' },
    tags: { type: [String], default: [] },
    seo: {
      title: bi(),
      description: bi(),
      keywords: bi(),
      canonical: { type: String, default: '' },
      ogImage: { type: String, default: '' },
      noIndex: { type: Boolean, default: false },
    },
    faq: {
      type: [{ question: bi(), answer: bi() }],
      default: [],
    },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const News = mongoose.models.News || mongoose.model('News', newsSchema);

(async () => {
  const dryRun = process.argv.includes('--dry');
  const fileArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
  const file = fileArg ? path.resolve(fileArg) : DEFAULT_FILE;
  if (!fs.existsSync(file)) {
    console.error('❌ الملف غير موجود:', file);
    process.exit(1);
  }
  const raw = fs.readFileSync(file, 'utf8');
  const a = parseArticle(raw);

  if (!a.titleAr || !a.slug) {
    console.error('❌ تعذّر استخراج العنوان أو الـ slug من الملف.');
    process.exit(1);
  }

  const doc = {
    title: a.titleAr, // عربي افتراضياً (الحقل مطلوب في القاعدة)
    titleAr: a.titleAr,
    description: a.descriptionAr,
    descriptionAr: a.descriptionAr,
    contentAr: a.contentAr,
    content: '',
    contentFormat: 'markdown',
    image: DEFAULTS.image,
    imageAlt: { en: '', ar: a.imageAltAr },
    category: DEFAULTS.category,
    author: DEFAULTS.author,
    tags: a.tags,
    seo: {
      title: { en: '', ar: a.seo.titleAr },
      description: { en: '', ar: a.seo.descriptionAr },
      keywords: { en: '', ar: a.seo.keywordsAr },
      canonical: a.seo.canonical,
      ogImage: '',
      noIndex: false,
    },
    faq: a.faq.map((f) => ({ question: { en: '', ar: f.question }, answer: { en: '', ar: f.answer } })),
    isActive: DEFAULTS.isActive,
    featured: DEFAULTS.featured,
    publishedAt: new Date(),
  };

  if (dryRun) {
    console.log('— DRY RUN —');
    console.log('العنوان:', a.titleAr);
    console.log('slug:', a.slug);
    console.log('الوصف:', a.descriptionAr);
    console.log('canonical:', a.seo.canonical);
    console.log('الوسوم:', a.tags);
    console.log('عدد الأسئلة:', a.faq.length);
    a.faq.forEach((f, i) => console.log(`  Q${i + 1}: ${f.question}`));
    console.log('طول جسم الماركداون:', a.contentAr.length, 'حرف');
    console.log('أول 300 حرف من الجسم:\n', a.contentAr.slice(0, 300));
    console.log('آخر 200 حرف من الجسم:\n', a.contentAr.slice(-200));
    process.exit(0);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ متصل:', mongoose.connection.name);

  const existing = await News.findOne({ slug: a.slug });
  if (existing) {
    await News.updateOne({ _id: existing._id }, { $set: doc });
    console.log('♻️  تم تحديث المقال:', a.slug);
  } else {
    await News.create({ ...doc, slug: a.slug });
    console.log('🆕 تم إنشاء المقال:', a.slug);
  }

  console.log(`   العنوان: ${a.titleAr}`);
  console.log(`   الأسئلة الشائعة: ${a.faq.length} — الوسوم: ${a.tags.length}`);
  console.log(`   الرابط: /blog/${a.slug}`);

  await mongoose.disconnect();
  process.exit(0);
})().catch((e) => {
  console.error('❌', e.message);
  process.exit(1);
});
