import { unstable_cache } from 'next/cache';
import { connectDB } from '@/lib/mongodb';
import { LegalPage, type ILegalPage } from '@/models/LegalPage';

export interface SystemLegalPageSeed {
  slug: string;
  order: number;
  title: { en: string; ar: string };
  content: { en: string; ar: string };
  seoDescription: { en: string; ar: string };
}

/**
 * الصفحات القانونية النظامية الافتراضية — تُزرع في قاعدة البيانات أول مرة،
 * ثم تصبح قابلة للتحرير بالكامل (الاسم، الرابط، المحتوى) من لوحة التحكم.
 */
export const SYSTEM_LEGAL_PAGES: SystemLegalPageSeed[] = [
  {
    slug: 'terms',
    order: 1,
    title: { en: 'Terms & Conditions', ar: 'الشروط والأحكام' },
    seoDescription: { en: 'Terms & Conditions for CORBIT services.', ar: 'الشروط والأحكام لخدمات المدار (CORBIT).' },
    content: {
      ar: `<h2>مقدمة</h2><p>تحكم هذه الشروط والأحكام استخدامك لموقع وخدمات شركة المدار (CORBIT). باستخدامك خدماتنا فإنك توافق على الالتزام بهذه الشروط.</p>
<h2>الخدمات</h2><p>تقدّم المدار حلولاً تقنية تشمل خدمة الرسائل النصية، وواتساب للأعمال، ونظام O-Time للموارد البشرية، وبوابة Gov Gate. قد تخضع كل خدمة لشروط إضافية خاصة بها.</p>
<h2>التزامات العميل</h2><p>يلتزم العميل باستخدام الخدمات وفق الأنظمة المعمول بها في المملكة العربية السعودية، وعدم استخدامها في أي غرض غير مشروع أو مخالف.</p>
<h2>المسؤولية</h2><p>نبذل قصارى جهدنا لضمان استمرارية الخدمة وجودتها، دون ضمان خلوها من الانقطاعات الطارئة خارجة عن إرادتنا.</p>
<h2>التواصل</h2><p>لأي استفسار يتعلق بهذه الشروط، تواصل معنا عبر البريد <a href="mailto:info@corbit.sa">info@corbit.sa</a> أو الهاتف 920006900.</p>
<p>السجل التجاري: 7012398264 — رقم الترخيص: LGP0921-22.</p>`,
      en: `<h2>Introduction</h2><p>These Terms &amp; Conditions govern your use of the website and services of CORBIT. By using our services, you agree to be bound by these terms.</p>
<h2>Services</h2><p>CORBIT provides technical solutions including SMS messaging, WhatsApp Business API, the O-Time HR system, and the Gov Gate portal. Each service may be subject to additional specific terms.</p>
<h2>Customer Obligations</h2><p>The customer agrees to use the services in accordance with the regulations of the Kingdom of Saudi Arabia, and not to use them for any unlawful purpose.</p>
<h2>Liability</h2><p>We strive to ensure service continuity and quality, without guaranteeing it is free from emergency interruptions beyond our control.</p>
<h2>Contact</h2><p>For any inquiry regarding these terms, contact us at <a href="mailto:info@corbit.sa">info@corbit.sa</a> or 920006900.</p>
<p>Commercial Registration: 7012398264 — License No.: LGP0921-22.</p>`,
    },
  },
  {
    slug: 'privacy',
    order: 2,
    title: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
    seoDescription: { en: 'Privacy Policy for CORBIT services.', ar: 'سياسة الخصوصية لخدمات المدار (CORBIT).' },
    content: {
      ar: `<h2>مقدمة</h2><p>تحترم المدار (CORBIT) خصوصيتك. توضّح هذه السياسة كيف نجمع بياناتك ونستخدمها ونحميها.</p>
<h2>البيانات التي نجمعها</h2><p>قد نجمع الاسم والبريد الإلكتروني ورقم الجوال وبيانات الشركة عند تعبئة نماذج التواصل أو طلب الخدمات.</p>
<h2>استخدام البيانات</h2><p>نستخدم بياناتك للرد على طلباتك وتقديم الخدمات وتحسين تجربتك. لا نبيع بياناتك لأي طرف ثالث.</p>
<h2>حماية البيانات</h2><p>نطبّق إجراءات تقنية وتنظيمية مناسبة لحماية بياناتك من الوصول غير المصرّح به.</p>
<h2>حقوقك</h2><p>يحق لك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها عبر التواصل معنا.</p>
<h2>التواصل</h2><p>لأي استفسار حول الخصوصية: <a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p>`,
      en: `<h2>Introduction</h2><p>CORBIT respects your privacy. This policy explains how we collect, use, and protect your data.</p>
<h2>Data We Collect</h2><p>We may collect your name, email, phone number, and company details when you fill in contact forms or request services.</p>
<h2>Use of Data</h2><p>We use your data to respond to your requests, provide services, and improve your experience. We do not sell your data to any third party.</p>
<h2>Data Protection</h2><p>We apply appropriate technical and organizational measures to protect your data from unauthorized access.</p>
<h2>Your Rights</h2><p>You have the right to request access to, correction of, or deletion of your data by contacting us.</p>
<h2>Contact</h2><p>For any privacy inquiry: <a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p>`,
    },
  },
  {
    slug: 'refund-policy',
    order: 3,
    title: { en: 'Refund & Cancellation Policy', ar: 'سياسة الاسترجاع والإلغاء' },
    seoDescription: { en: 'Refund & Cancellation Policy for CORBIT services.', ar: 'سياسة الاسترجاع والإلغاء لخدمات المدار (CORBIT).' },
    content: {
      ar: `<h2>مقدمة</h2><p>توضّح هذه السياسة أحكام الاسترجاع والإلغاء لخدمات المدار (CORBIT).</p>
<h2>طلبات الإلغاء</h2><p>يمكن طلب إلغاء الاشتراك وفق شروط كل باقة. تواصل مع فريق الدعم لبدء الإجراء.</p>
<h2>الاسترجاع</h2><p>تخضع طلبات الاسترجاع للمراجعة حسب نوع الخدمة ومدى استهلاكها. الخدمات المستهلكة (كالرسائل المرسلة) غير قابلة للاسترجاع.</p>
<h2>مدة المعالجة</h2><p>تُعالَج طلبات الاسترجاع المعتمدة خلال مدة معقولة عبر وسيلة الدفع الأصلية.</p>
<h2>التواصل</h2><p>لطلب الإلغاء أو الاسترجاع: <a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p>`,
      en: `<h2>Introduction</h2><p>This policy explains the refund and cancellation terms for CORBIT services.</p>
<h2>Cancellation Requests</h2><p>Subscription cancellation may be requested according to each package's terms. Contact our support team to start the process.</p>
<h2>Refunds</h2><p>Refund requests are reviewed based on the service type and usage. Consumed services (such as sent messages) are non-refundable.</p>
<h2>Processing Time</h2><p>Approved refunds are processed within a reasonable period via the original payment method.</p>
<h2>Contact</h2><p>To request cancellation or refund: <a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p>`,
    },
  },
  {
    slug: 'acceptable-use',
    order: 4,
    title: { en: 'Acceptable Use Policy', ar: 'سياسة الاستخدام المقبول' },
    seoDescription: { en: 'Acceptable Use Policy for CORBIT services.', ar: 'سياسة الاستخدام المقبول لخدمات المدار (CORBIT).' },
    content: {
      ar: `<h2>مقدمة</h2><p>تحدّد هذه السياسة الاستخدامات المقبولة لخدمات المدار (CORBIT) لضمان بيئة آمنة للجميع.</p>
<h2>الاستخدامات الممنوعة</h2><p>يُمنع استخدام الخدمات في إرسال محتوى مزعج (Spam) أو احتيالي، أو مخالف للأنظمة، أو ينتهك حقوق الغير.</p>
<h2>الرسائل والحملات</h2><p>يلتزم العميل بالحصول على موافقة المستلمين قبل إرسال الرسائل التسويقية، والالتزام بأنظمة هيئة الاتصالات والفضاء والتقنية.</p>
<h2>المخالفات</h2><p>يحق للمدار تعليق أو إنهاء الخدمة عند مخالفة هذه السياسة دون إشعار مسبق.</p>
<h2>التواصل</h2><p>للإبلاغ عن إساءة استخدام: <a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p>`,
      en: `<h2>Introduction</h2><p>This policy defines the acceptable uses of CORBIT services to ensure a safe environment for everyone.</p>
<h2>Prohibited Uses</h2><p>Using the services to send spam or fraudulent content, or content that violates regulations or infringes others' rights, is prohibited.</p>
<h2>Messages &amp; Campaigns</h2><p>The customer must obtain recipients' consent before sending marketing messages and comply with the regulations of CST (Communications, Space &amp; Technology Commission).</p>
<h2>Violations</h2><p>CORBIT reserves the right to suspend or terminate the service upon violation of this policy without prior notice.</p>
<h2>Contact</h2><p>To report misuse: <a href="mailto:info@corbit.sa">info@corbit.sa</a> — 920006900.</p>`,
    },
  },
];

async function fetchAllLegalPages(): Promise<ILegalPage[]> {
  try {
    await connectDB();
    const docs = await LegalPage.find({}).sort({ order: 1, createdAt: 1 }).lean<ILegalPage[]>();
    return JSON.parse(JSON.stringify(docs));
  } catch (error) {
    console.error('Failed to load legal pages:', error);
    return [];
  }
}

/** كل الصفحات القانونية (مع كاش). يشمل غير النشطة — استخدم getActiveLegalPages للعرض العام. */
export function getAllLegalPages(): Promise<ILegalPage[]> {
  return unstable_cache(fetchAllLegalPages, ['legal-pages-all'], {
    tags: ['legal-pages'],
    revalidate: 3600,
  })();
}

export async function getActiveLegalPages(): Promise<ILegalPage[]> {
  const all = await getAllLegalPages();
  return all.filter((p) => p.isActive);
}

export async function getLegalPageBySlug(slug: string): Promise<ILegalPage | null> {
  const all = await getAllLegalPages();
  return all.find((p) => p.slug === slug && p.isActive) || null;
}
