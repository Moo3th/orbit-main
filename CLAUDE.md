# CLAUDE.md

دليل العمل على مستودع موقع **CORBIT (المدار)** التعريفي لـ Claude Code. اقرأه قبل أي تعديل.

> تمت مزامنة هذا الملف مع الموقع الحيّ `corbit.sa`. الحقائق الرسمية والبنية والمنتجات أدناه مطابقة لما هو منشور فعلاً.

## ⭐ المبدأ الأول: كل شيء قابل للتحرير من لوحة التحكم

هذا المبدأ يعلو على ما عداه. **أي محتوى يراه الزائر يجب أن يأتي من قاعدة البيانات عبر CMS، لا من الكود.** يشمل ذلك:
نصوص الصفحات، روابط القوائم، أزرار الدعوة (CTA)، أسماء المنتجات ووصفها ومزاياها وأسعارها، شعارات الشركاء، آراء العملاء، بطاقات "لماذا المدار"، قائمة التكاملات، بيانات التذييل (الهاتف، البريد، السجل التجاري، رقم الترخيص، روابط التواصل، وسائل الدفع)، والصفحات القانونية، وبيانات SEO لكل صفحة.

- ممنوع كتابة أي نص ظاهر للمستخدم داخل المكوّن مباشرةً. أضِفه إلى نموذج (model) أو إلى `SiteCms` / `CmsPageContent`، واقرأه عبر `getSiteCmsSnapshot()` / `getCmsPageById()`.
- كل حقل نصّي ثنائي اللغة `{ en: string; ar: string }`، مع قيمة افتراضية آمنة عند غياب البيانات.
- أي مكوّن جديد يضيف محتوى ظاهراً يجب أن يصاحبه: حقل في النموذج + واجهة تحرير في لوحة الأدمن + إبطال الكاش بعد الحفظ (`revalidate`).
- التفاصيل الملزمة في `.claude/rules/cms-editability.md`.

## الحقائق الرسمية للشركة (المصدر الموثوق — يجب أن تأتي من CMS)

- **الاسم**: CORBIT (إنجليزي) / المدار (عربي). النطاق `corbit.sa`.
- **السجل التجاري**: 7012398264
- **رقم الترخيص** (هيئة الاتصالات والفضاء والتقنية): LGP0921-22
- **الهاتف**: 920006900
- **البريد**: info@corbit.sa
- **وسائل الدفع**: تحويل بنكي، مدى، فيزا، دفع آجل (للشركات الكبرى).
- **التكاملات**: سلة، دفترة، نور، إتقان.
- **التواصل الاجتماعي**: Instagram و X باسم `orbittec_sa`.
- **معرّف GTM للموقع**: GTM-MKGST5S6.
- **الموقع**: المملكة العربية السعودية (المقر: المدينة المنورة).

### ⚠️ تناقضات يجب توحيدها قبل أي عمل على الهوية
1. **اسم العلامة** يظهر بثلاث صور: `CORBIT` (العنوان) و`CorBit` (اسم الموقع) و`ORBIT` (النص البديل للشعار والملف القديم). وحّد الكتابة على صورة واحدة في كل الموقع.
2. **معرّف التواصل**: `orbittec_sa` على الموقع مقابل `corbitec_sa` في مواضع أخرى. وحّده.
3. **الصفحات القانونية** تشير حالياً خارج الموقع (`app.mobile.net.sa/terms-of-use`) — يجب نقلها إلى صفحات داخلية قابلة للتحرير.

## المنتجات (4 منتجات فعلية)

| المنتج | المسار | الوصف المختصر |
|---|---|---|
| خدمة الرسائل النصية SMS | `/products/sms` | إرسال جماعي سريع، واجهة برمجة مرنة، تقارير فورية، حماية من الإزعاج |
| واتساب أعمال API | `/products/whatsapp` | حملات موجهة، قوالب معتمدة، دعم متعدد العملاء، تقارير أداء |
| O-Time للموارد البشرية | `/products/o-time` | الحضور والإجازات، أتمتة الرواتب، الخدمة الذاتية، لوحات تحليلات |
| Gov Gate (بوابة مراسلة حكومية) | `/products/gov-gate` | بوابة آمنة، صلاحيات حسب الأدوار، امتثال تشريعي، سجل تدقيق |

## المسارات العامة

- `/` الرئيسية · `/about-us` من نحن · `/blog` المدونة · `/contact` تواصل
- `/products/{sms|whatsapp|o-time|gov-gate}` صفحات المنتجات
- **صفحات قانونية مطلوبة (داخلية وقابلة للتحرير)**: `/terms` الشروط والأحكام · `/privacy` سياسة الخصوصية · `/refund-policy` الاسترجاع والإلغاء · `/acceptable-use` الاستخدام المقبول

## الأوامر

```bash
npm run dev          # تطوير (webpack — وليس Turbopack، انظر أدناه)
npm run dev:turbo    # تطوير بـ Turbopack (قد يفشل على Windows)
npm run build        # بناء الإنتاج (webpack)
npm start            # تشغيل الإنتاج
npm run lint         # ESLint
npm run seed         # تهيئة قاعدة البيانات (scripts/init-db.js)
npm run seed:cms     # زرع محتوى CMS الأولي (scripts/seed-site-cms.js)
```

على Windows: `start.bat` أو `start.ps1`.

## التقنيات

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict، لكن `noImplicitAny: false`)
- **MongoDB** عبر **Mongoose** (`src/models/`) — قاعدة `orbit` معزولة، لا تخلطها مع غيرها.
- **Tailwind CSS** (v3) + مكوّنات shadcn/ui في `src/components/business/ui/`
- مصادقة **JWT** عبر `jose` (كوكي `token`، صلاحية 7 أيام)
- حركة: **Framer Motion** و **GSAP**؛ خلفيات WebGL عبر **three / ogl**
- محرر غني: **TipTap** · البريد: **nodemailer**

## البنية

```
src/
├── app/
│   ├── api/            # مسارات API (route.ts) تحت /api/*
│   ├── admin/          # لوحة التحكم (newAdmin/ هي النسخة الحالية)
│   ├── products/       # صفحات المنتجات الأربعة
│   ├── [...slug]/      # catch-all للنماذج الديناميكية والنطاقات المخصّصة
│   └── (صفحات عامة)    # about-us, blog, contact, الصفحات القانونية...
├── components/
│   ├── business/ui/    # shadcn/ui الأساسية
│   ├── business/landing/ # مكوّنات الصفحة الرئيسية
│   └── *.tsx           # Navbar, Footer, Hero, Orb...
├── contexts/           # LanguageContext, ThemeContext, AdminLanguageContext
├── i18n/translations.ts
├── lib/
│   ├── mongodb.ts      # اتصال DB مخزّن
│   ├── auth.ts         # JWT: getSession, requireAuth, requireAdmin
│   ├── cms/            # منطق CMS (siteCms, pageContent, helpers, التسعير)
│   ├── seo/            # توليد metadata و JSON-LD
│   └── email/, analytics/, blog/
└── models/             # نماذج Mongoose
```

## أنماط مهمة

### مسارات API
- ابدأ بـ `export const dynamic = 'force-dynamic'` و `export const runtime = 'nodejs'`.
- استدعِ `await connectDB()` قبل أي عملية على القاعدة.
- احمِ الكتابة بـ `await requireAdmin()` (يرمي `'Unauthorized'` → أعِده 403).
- القراءة: العام يرى `{ isActive: true }`؛ الأدمن يرى الكل عبر `?admin=true`.

### المصادقة
- التوكن في كوكي `token`. استخدم `getSession()` (Server Components) أو `getSessionFromRequest(req)` (في الـ routes). لا يوجد `middleware.ts` — الحماية داخل كل route.

### قاعدة البيانات و i18n
- النماذج ثنائية اللغة: الحقول النصية غالباً `{ en; ar }`.
- اللغة الافتراضية **عربية** (`dir="rtl"`, `lang="ar"`). استخدم `useLanguage()` للوصول إلى `t`, `language`, `isRTL`.
- لا تكتب نصوصاً ثابتة — أضِفها إلى `src/i18n/translations.ts` أو إلى CMS.

### CMS و SEO
- المحتوى مُدار عبر `SiteCms` و `CmsPageContent`، يُقرأ بـ `getSiteCmsSnapshot()` / `getCmsPageById()` مع `unstable_cache`.
- كل صفحة تبني metadata من إعدادات SEO عبر `lib/seo`، وتُرفق JSON-LD المناسب. التفاصيل في `.claude/rules/seo-i18n.md`.

### التوافق مع الجوال والجودة (معيار إلزامي)
- الموقع يجب أن يعمل **بلا مشاكل على iPhone (Safari / iOS) و Android (Chrome)**: تصميم متجاوب (mobile-first)، أهداف لمس لا تقل عن 44×44 بكسل، لا تمرير أفقي، نصوص مقروءة دون تكبير، واتجاه RTL سليم على الجوال.
- خلفيات WebGL والحركة (three/ogl, GSAP) سبب معروف لتعطّل iOS — لا تتجاوز الحدود الموثّقة في `CRITICAL_IOS_CRASH_FIX.md`.
- معيار الجودة: لا يُسلَّم تغيير والبناء فاشل أو الصفحة مكسورة على الجوال. (التحقّق نفسه إجراءٌ تشغيلي، لكن المعيار ملزم.)

## العلامة التجارية والتنسيق

⚠️ ملف `.cursorrules` قديم (يذكر خطوط Gotham/Somar/Montserrat غير المستخدمة). المصدر الموثوق هو `tailwind.config.js` و `src/app/layout.tsx`.

- **الخطوط الفعلية**: IBM Plex Sans (إنجليزي) و IBM Plex Sans Arabic (عربي) عبر `next/font/google`. استخدم `font-sans`/`font-heading` و `font-ibm-plex-arabic`.
- **ألوان العلامة** (من `tailwind.config.js` فقط): `primary` نبيذي `#7A1E2E` · `secondary` بيج `#E8DCCB` · `neutral` رمادي `#A7A9AC` · `black` `#161616` · `white` `#FFFFFF`. لا تُدخل ألواناً خارج اللوحة.
- الاسم: **CORBIT / المدار** (وحّد الكتابة — انظر التناقضات أعلاه). لا تذكر أي اسم قديم آخر.
- المرجع: `ORBIT_STYLE_GUIDE.md`.

## ملاحظات بيئة العمل

- **Windows + webpack**: Turbopack معطّل (`--webpack`) لتجنّب مشاكل symlink. لا تفعّله افتراضياً.
- `reactCompiler: true` في `next.config.ts`. `mongoose`/`mongodb` خارج الحزم (`serverExternalPackages`).
- متغيرات البيئة في `.env.local`: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV` + مفاتيح التحليلات (`NEXT_PUBLIC_GTM_ID=GTM-MKGST5S6`, `NEXT_PUBLIC_SITE_URL=https://corbit.sa`, وغيرها).
- النشر على **Vercel** (منطقة `iad1`). انظر `VERCEL_DEPLOYMENT.md`.
- إصلاح تعطّل iOS موثّق في `CRITICAL_IOS_CRASH_FIX.md` — راجعه قبل تعديل خلفيات WebGL/الحركة.

## الإجراءات والقواعد التشغيلية (خارج الدستور)

هذا الملف **دستور**: مبادئ ومعايير وحقائق وبنية فقط — **لا مهام ولا خطوات تنفيذ**. الإجراءات القابلة للتنفيذ موثّقة منفصلةً ويُرجَع إليها عند العمل:

- `.claude/skills/verify-and-log/` — إجراء ما بعد التعديل: بناء، فحص، معاينة على iPhone و Android، تصحيح الأخطاء، وتسجيل الملفات المعدّلة في `.claude/CHANGES.md`.
- `.claude/rules/cms-editability.md` — تفاصيل جعل المحتوى قابلاً للتحرير من اللوحة.
- `.claude/rules/seo-i18n.md` — تفاصيل السيو والترجمة.

## وثائق مرجعية إضافية

`ORBIT_STYLE_GUIDE.md` · `ORBIT_DATABASE_SETUP.md` · `OFFERS_SYSTEM_GUIDE.md` · `VERCEL_DEPLOYMENT.md` · `IOS_OPTIMIZATION_SUMMARY.md`
