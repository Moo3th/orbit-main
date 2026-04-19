import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SiteCms from '@/models/SiteCms';
import FormConfig from '@/models/FormConfig';
import { cleanupLegacyCollections } from '@/lib/db/legacyCleanup';
import {
  getDefaultWhatsAppConversationPrices,
  getDefaultWhatsAppPlans,
  serializeWhatsAppConversationPrices,
  serializeWhatsAppPlans,
} from '@/lib/cms/whatsappPricing';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type FieldType = 'text' | 'textarea' | 'url' | 'list';

interface SeedSectionField {
  key: string;
  label: string;
  labelEn: string;
  type: FieldType;
  value: string;
  valueEn?: string;
}

interface SeedSection {
  id: string;
  name: string;
  nameEn: string;
  fields: SeedSectionField[];
  visible: boolean;
}

interface SeedPage {
  id: string;
  title: string;
  titleEn: string;
  path: string;
  sections: SeedSection[];
  lastEdited: string;
  seo?: {
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    keywords: string;
    keywordsEn: string;
    canonical: string;
    noIndex: boolean;
    ogImage: string;
  };
}

interface PageBlueprint {
  id: string;
  path: string;
  title: string;
  titleEn: string;
  seo?: {
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    keywords: string;
    keywordsEn: string;
    canonical: string;
    noIndex: boolean;
    ogImage: string;
  };
}

interface ExistingSiteDoc {
  pages?: unknown[];
  partners?: unknown[];
  socialLinks?: unknown[];
  contactSubmissions?: unknown[];
  notificationEmail?: string;
  footerData?: Record<string, unknown>;
}

const DEFAULT_NOTIFICATION_EMAIL = 'sales@orbit.sa';
const API_DOCS_URL = 'https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view?usp=drive_link';

const ACTIVE_PAGE_BLUEPRINTS: PageBlueprint[] = [
  { id: 'home', path: '/', title: 'الصفحة الرئيسية', titleEn: 'Home', seo: { title: 'ORBIT | المدار - حلول تقنية رائدة', titleEn: 'ORBIT - Leading Technical Solutions', description: 'ORBIT المدار - مزود حلول تقنية رائد في المملكة العربية السعودية. خدمات الرسائل النصية SMS وواتساب أعمال API وبرامج الموارد البشرية وبوابات المراسلة الحكومية.', descriptionEn: 'ORBIT - Leading technical solutions provider in Saudi Arabia. SMS messaging, WhatsApp Business API, HR software, and government messaging gateways.', keywords: 'ORBIT, المدار, حلول تقنية, SMS, واتساب, السعودية, رسائل نصية', keywordsEn: 'ORBIT, technical solutions, SMS, WhatsApp, Saudi Arabia, messaging, API', canonical: 'https://orbit.sa/', noIndex: false, ogImage: '' } },
  { id: 'sms', path: '/products/sms', title: 'خدمة الرسائل النصية SMS', titleEn: 'SMS Service', seo: { title: 'خدمة الرسائل النصية SMS | المدار', titleEn: 'SMS Messaging Service | ORBIT', description: 'خدمة الرسائل النصية SMS من المدار - حلول مراسلة موثوقة وفعالة للشركات والمؤسسات في السعودية.', descriptionEn: 'SMS Messaging Service by ORBIT - Reliable and efficient messaging solutions for businesses in Saudi Arabia.', keywords: 'SMS, رسائل نصية, خدمة رسائل, المدار, السعودية', keywordsEn: 'SMS, messaging, text messages, ORBIT, Saudi Arabia, bulk SMS', canonical: 'https://orbit.sa/products/sms', noIndex: false, ogImage: '' } },
  { id: 'whatsapp', path: '/products/whatsapp', title: 'واتساب أعمال API', titleEn: 'WhatsApp Business API', seo: { title: 'واتساب أعمال API | المدار', titleEn: 'WhatsApp Business API | ORBIT', description: 'واتساب أعمال API من المدار - تواصل مع عملائك عبر واتساب بشكل احترافي وآمن.', descriptionEn: 'WhatsApp Business API by ORBIT - Connect with your customers professionally and securely via WhatsApp.', keywords: 'واتساب, WhatsApp, واتساب أعمال, API, المدار, تسويق', keywordsEn: 'WhatsApp, WhatsApp Business, API, ORBIT, marketing, messaging', canonical: 'https://orbit.sa/products/whatsapp', noIndex: false, ogImage: '' } },
  { id: 'otime', path: '/products/o-time', title: 'O-Time برنامج الموارد البشرية', titleEn: 'O-Time HR Software', seo: { title: 'O-Time برنامج الموارد البشرية | المدار', titleEn: 'O-Time HR Software | ORBIT', description: 'برنامج O-Time لإدارة الموارد البشرية - منصة متكاملة للحضور والرواتب ودورة حياة الموظف.', descriptionEn: 'O-Time HR Software - Complete platform for attendance, payroll, and employee lifecycle management.', keywords: 'O-Time, موارد بشرية, إدارة حضور, رواتب, المدار', keywordsEn: 'O-Time, HR, attendance, payroll, ORBIT, employee management', canonical: 'https://orbit.sa/products/o-time', noIndex: false, ogImage: '' } },
  { id: 'govgate', path: '/products/gov-gate', title: 'Gov Gate', titleEn: 'Gov Gate', seo: { title: 'Gov Gate بوابة حكومية | المدار', titleEn: 'Gov Gate | ORBIT', description: 'بوابة Gov Gate للحوسبة المؤسسية - منصة مراسلة آمنة ومتخصصة للجهات الحكومية.', descriptionEn: 'Gov Gate - Secure enterprise messaging gateway for government entities.', keywords: 'Gov Gate, بوابة حكومية, مراسلة, حكومة, المدار', keywordsEn: 'Gov Gate, government gateway, messaging, ORBIT, secure', canonical: 'https://orbit.sa/products/gov-gate', noIndex: false, ogImage: '' } },
  { id: 'contact', path: '/contact', title: 'تواصل معنا', titleEn: 'Contact Us', seo: { title: 'تواصل معنا | المدار', titleEn: 'Contact Us | ORBIT', description: 'تواصل معنا - المدار لحلول التقنية. نحن هنا لمساعدتك في جميع استفساراتك.', descriptionEn: 'Contact ORBIT - We are here to help with all your inquiries.', keywords: 'تواصل معنا, المدار, اتصل بنا, دعم فني', keywordsEn: 'contact us, ORBIT, support, inquiry', canonical: 'https://orbit.sa/contact', noIndex: false, ogImage: '' } },
  { id: 'blog', path: '/blog', title: 'المدونة', titleEn: 'Blog', seo: { title: 'المدونة | المدار', titleEn: 'Blog | ORBIT', description: 'مدونة المدار - أحدث الأخبار والمقالات عن الحلول التقنية والاتصالات.', descriptionEn: 'ORBIT Blog - Latest news and articles about technology solutions and communications.', keywords: 'مدونة, المدار, أخبار تقنية, مقالات', keywordsEn: 'blog, ORBIT, tech news, articles', canonical: 'https://orbit.sa/blog', noIndex: false, ogImage: '' } },
];

const homeHeroExtraFields: SeedSectionField[] = [
  {
    key: 'cta_api_docs_url',
    label: 'رابط زر تصفح ملفات API',
    labelEn: 'Browse API Docs Button URL',
    type: 'url',
    value: API_DOCS_URL,
    valueEn: API_DOCS_URL,
  },
];

const homeSolutionsExtraFields: SeedSectionField[] = [
  {
    key: 'otime_title',
    label: 'عنوان بطاقة O-Time',
    labelEn: 'O-Time Card Title',
    type: 'text',
    value: 'O-Time برنامج الموارد البشرية',
    valueEn: 'O-Time HR Software',
  },
  {
    key: 'otime_desc',
    label: 'وصف بطاقة O-Time',
    labelEn: 'O-Time Card Description',
    type: 'textarea',
    value: 'منصة متكاملة لإدارة الموارد البشرية تشمل الحضور والرواتب ودورة حياة الموظف بالكامل.',
    valueEn: 'A complete HR operations platform for attendance, payroll, and employee lifecycle management.',
  },
  {
    key: 'otime_features',
    label: 'مزايا O-Time (سطر لكل ميزة)',
    labelEn: 'O-Time Features (one per line)',
    type: 'list',
    value: 'إدارة الحضور والإجازات\nأتمتة مسيرات الرواتب\nبوابة الخدمة الذاتية للموظف\nلوحات تحكم وتحليلات فورية',
    valueEn: 'Attendance and leave management\nAutomated payroll workflows\nEmployee self-service portal\nReal-time HR analytics dashboards',
  },
  {
    key: 'govgate_title',
    label: 'عنوان بطاقة Gov Gate',
    labelEn: 'Gov Gate Card Title',
    type: 'text',
    value: 'Gov Gate',
    valueEn: 'Gov Gate',
  },
  {
    key: 'govgate_desc',
    label: 'وصف بطاقة Gov Gate',
    labelEn: 'Gov Gate Card Description',
    type: 'textarea',
    value: 'بوابة مراسلة مؤسسية آمنة ببنية مخصصة وامتثال كامل وتحكم متقدم.',
    valueEn: 'Secure enterprise messaging gateway with dedicated infrastructure, compliance, and advanced controls.',
  },
  {
    key: 'govgate_features',
    label: 'مزايا Gov Gate (سطر لكل ميزة)',
    labelEn: 'Gov Gate Features (one per line)',
    type: 'list',
    value: 'بوابة مراسلة خاصة وآمنة\nصلاحيات دقيقة بحسب الأدوار\nأمان مؤسسي وامتثال تشريعي\nتقارير تشغيلية وسجل تدقيق مفصل',
    valueEn: 'Private secure messaging portal\nGranular role-based permissions\nEnterprise-grade security and compliance\nDetailed operational audit reporting',
  },
];

const defaultHomeSections: SeedSection[] = [
  {
    id: 'home-hero',
    name: 'الهيرو',
    nameEn: 'Hero',
    visible: true,
    fields: [
      { key: 'badge', label: 'الشارة', labelEn: 'Badge', type: 'text', value: 'منصة الرسائل الرسمية الأولى في السعودية', valueEn: 'Saudi Arabia\'s first official messaging platform' },
      { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'textarea', value: 'شريكك الموثوق لحلول الرسائل والتواصل', valueEn: 'Your trusted partner for messaging and communication solutions' },
      { key: 'description', label: 'الوصف', labelEn: 'Description', type: 'textarea', value: 'حلول رسائل واتصالات مؤسسية بمستوى عالٍ من الاعتمادية والامتثال.', valueEn: 'Enterprise messaging solutions with high reliability and compliance.' },
      { key: 'cta1_text', label: 'نص الزر الأول', labelEn: 'Primary Button Text', type: 'text', value: 'ابدأ الآن', valueEn: 'Get Started' },
      { key: 'cta1_url', label: 'رابط الزر الأول', labelEn: 'Primary Button URL', type: 'url', value: 'https://app.mobile.net.sa/reg', valueEn: 'https://app.mobile.net.sa/reg' },
      { key: 'cta2_text', label: 'نص الزر الثاني', labelEn: 'Secondary Button Text', type: 'text', value: 'تواصل مع المبيعات', valueEn: 'Contact Sales' },
      { key: 'trust_text', label: 'نص الثقة', labelEn: 'Trust Text', type: 'text', value: 'موثوق من جهات رائدة في المملكة', valueEn: 'Trusted by leading organizations in the Kingdom' },
      ...homeHeroExtraFields,
    ],
  },
  {
    id: 'home-trust',
    name: 'قسم الثقة',
    nameEn: 'Trust Section',
    visible: true,
    fields: [
      { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'موثوق من جهات رائدة', valueEn: 'Trusted by leading organizations' },
      { key: 'subtitle', label: 'الوصف', labelEn: 'Subtitle', type: 'textarea', value: 'شركاء نجاحنا من القطاع الحكومي والخاص.', valueEn: 'Our success partners from government and private sectors.' },
    ],
  },
  {
    id: 'home-solutions',
    name: 'الحلول الرئيسية',
    nameEn: 'Key Solutions',
    visible: true,
    fields: [
      { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'حلولنا الأساسية', valueEn: 'Our core solutions' },
      { key: 'subtitle', label: 'الوصف', labelEn: 'Subtitle', type: 'textarea', value: 'منتجات مصممة لتناسب مختلف القطاعات.', valueEn: 'Products designed for multiple sectors.' },
      { key: 'wa_title', label: 'عنوان بطاقة واتساب', labelEn: 'WhatsApp Card Title', type: 'text', value: 'واتساب أعمال API', valueEn: 'WhatsApp Business API' },
      { key: 'wa_desc', label: 'وصف بطاقة واتساب', labelEn: 'WhatsApp Card Description', type: 'textarea', value: 'منصة تواصل احترافية عبر واتساب.', valueEn: 'Professional customer communication through WhatsApp.' },
      { key: 'wa_features', label: 'مزايا واتساب (سطر لكل ميزة)', labelEn: 'WhatsApp Features (one per line)', type: 'list', value: 'رسائل تفاعلية\nتكامل API مباشر\nتقارير أداء', valueEn: 'Interactive messages\nDirect API integration\nPerformance reports' },
      { key: 'sms_title', label: 'عنوان بطاقة SMS', labelEn: 'SMS Card Title', type: 'text', value: 'خدمة الرسائل النصية SMS', valueEn: 'SMS Messaging Service' },
      { key: 'sms_desc', label: 'وصف بطاقة SMS', labelEn: 'SMS Card Description', type: 'textarea', value: 'إرسال رسائل فورية بسرعة وموثوقية.', valueEn: 'Send messages instantly with high reliability.' },
      { key: 'sms_features', label: 'مزايا SMS (سطر لكل ميزة)', labelEn: 'SMS Features (one per line)', type: 'list', value: 'سرعة تسليم عالية\nتقارير مفصلة\nتكامل سهل', valueEn: 'High delivery speed\nDetailed reports\nEasy integration' },
      ...homeSolutionsExtraFields,
    ],
  },
  {
    id: 'home-integrations',
    name: 'التكاملات',
    nameEn: 'Integrations',
    visible: true,
    fields: [
      { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'نعمل مع أدواتك المفضلة', valueEn: 'We work with your favorite tools' },
      { key: 'subtitle', label: 'الوصف', labelEn: 'Subtitle', type: 'textarea', value: 'تكامل سريع مع أنظمتك الحالية.', valueEn: 'Fast integration with your existing systems.' },
    ],
  },
  {
    id: 'home-whyus',
    name: 'لماذا نحن',
    nameEn: 'Why Us',
    visible: true,
    fields: [
      { key: 'section_title', label: 'عنوان القسم', labelEn: 'Section Title', type: 'text', value: 'لماذا المدار؟', valueEn: 'Why ORBIT?' },
      { key: 'section_subtitle', label: 'وصف القسم', labelEn: 'Section Subtitle', type: 'text', value: 'نقدم لك مزايا فريدة تجعل تجربتك أفضل', valueEn: 'We offer unique advantages that make your experience better' },
      { key: 'support_title', label: 'عنوان الدعم', labelEn: 'Support Title', type: 'text', value: 'دعم فني محلي', valueEn: 'Local support' },
      { key: 'support_desc', label: 'وصف الدعم', labelEn: 'Support Description', type: 'textarea', value: 'فريق سعودي يساندك على مدار الساعة.', valueEn: 'A Saudi team supporting you 24/7.' },
      { key: 'security_title', label: 'عنوان الأمان', labelEn: 'Security Title', type: 'text', value: 'أمان عالي', valueEn: 'High security' },
      { key: 'security_desc', label: 'وصف الأمان', labelEn: 'Security Description', type: 'textarea', value: 'حماية متقدمة وامتثال للمعايير.', valueEn: 'Advanced protection and compliance standards.' },
      { key: 'payment_title', label: 'عنوان الدفع', labelEn: 'Payment Title', type: 'text', value: 'الدفع المرن', valueEn: 'Flexible payment' },
      { key: 'payment_desc', label: 'وصف الدفع', labelEn: 'Payment Description', type: 'textarea', value: 'خيارات دفع متعددة تناسب احتياجك.', valueEn: 'Multiple payment options matching your needs.' },
    ],
  },
];

const defaultContactSections: SeedSection[] = [
  {
    id: 'contact-hero',
    name: 'مقدمة الصفحة',
    nameEn: 'Page Intro',
    visible: true,
    fields: [
      { key: 'title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'تواصل معنا', valueEn: 'Contact Us' },
      { key: 'description', label: 'الوصف', labelEn: 'Description', type: 'textarea', value: 'نحن هنا للإجابة على استفساراتك ومساعدتك في العثور على الحل المناسب.', valueEn: 'We are here to answer your questions and help you find the right solution.' },
    ],
  },
  {
    id: 'contact-info',
    name: 'بطاقات التواصل',
    nameEn: 'Contact Info Cards',
    visible: true,
    fields: [
      { key: 'phone', label: 'رقم الهاتف', labelEn: 'Phone Number', type: 'text', value: '920006900', valueEn: '920006900' },
      { key: 'phone_note', label: 'ملاحظة الهاتف', labelEn: 'Phone Note', type: 'text', value: 'من الأحد للخميس، 8ص - 6م', valueEn: 'Sunday to Thursday, 8 AM - 6 PM' },
      { key: 'email', label: 'البريد الإلكتروني', labelEn: 'Email Address', type: 'text', value: 'sales@orbit.sa', valueEn: 'sales@orbit.sa' },
      { key: 'email_note', label: 'ملاحظة البريد', labelEn: 'Email Note', type: 'text', value: 'نرد خلال 24 ساعة كحد أقصى', valueEn: 'We reply within 24 hours' },
      { key: 'address', label: 'العنوان', labelEn: 'Address', type: 'text', value: 'المملكة العربية السعودية، الرياض', valueEn: 'Riyadh, Saudi Arabia' },
      { key: 'address_note', label: 'تفاصيل العنوان', labelEn: 'Address Details', type: 'text', value: 'طريق الملك فهد', valueEn: 'King Fahd Road' },
      { key: 'whatsapp_title', label: 'عنوان بطاقة واتساب', labelEn: 'WhatsApp Card Title', type: 'text', value: 'تحدث معنا عبر واتساب', valueEn: 'Chat with us on WhatsApp' },
      { key: 'whatsapp_url', label: 'رابط واتساب', labelEn: 'WhatsApp URL', type: 'url', value: 'https://wa.me/966920006900', valueEn: 'https://wa.me/966920006900' },
    ],
  },
  {
    id: 'contact-form',
    name: 'نموذج التواصل',
    nameEn: 'Contact Form',
    visible: true,
    fields: [
      { key: 'service_label', label: 'تسمية حقل الخدمة', labelEn: 'Service Field Label', type: 'text', value: 'الخدمة المطلوبة', valueEn: 'Requested Service' },
      { key: 'service_placeholder', label: 'نص افتراضي للخدمة', labelEn: 'Service Placeholder', type: 'text', value: 'اختر الخدمة...', valueEn: 'Select a service...' },
      { key: 'service_options', label: 'خيارات الخدمة (صيغة: value|AR|EN)', labelEn: 'Service Options (format: value|AR|EN)', type: 'list', value: 'sms|الرسائل النصية SMS|SMS Messaging\nwhatsapp|واتساب أعمال API|WhatsApp Business API\no-time|O-Time نظام الموارد البشرية|O-Time HR System\ngov-gate|Gov Gate بوابة حكومية|Gov Gate\nother|استفسار عام|General Inquiry', valueEn: 'sms|SMS Messaging|SMS Messaging\nwhatsapp|WhatsApp Business API|WhatsApp Business API\no-time|O-Time HR System|O-Time HR System\ngov-gate|Gov Gate|Gov Gate\nother|General Inquiry|General Inquiry' },
      { key: 'submit_text', label: 'نص زر الإرسال', labelEn: 'Submit Button Text', type: 'text', value: 'إرسال الرسالة', valueEn: 'Send Message' },
      { key: 'privacy_note', label: 'نص سياسة الخصوصية', labelEn: 'Privacy Note', type: 'text', value: 'بإرسال النموذج، أنت توافق على سياسة الخصوصية.', valueEn: 'By sending this form, you agree to the privacy policy.' },
    ],
  },
];

const defaultBlogSections: SeedSection[] = [
  {
    id: 'blog-hero',
    name: 'مقدمة المدونة',
    nameEn: 'Blog Intro',
    visible: true,
    fields: [
      { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'المدونة', valueEn: 'Blog' },
      { key: 'description', label: 'الوصف', labelEn: 'Description', type: 'textarea', value: 'آخر المقالات والتحديثات.', valueEn: 'Latest articles and updates.' },
    ],
  },
];

const defaultPageSectionsById: Record<string, SeedSection[]> = {
  home: defaultHomeSections,
  sms: [
    { id: 'sms-hero', name: 'SMS Hero', nameEn: 'SMS Hero', visible: true, fields: [
      { key: 'general_badge_prefix', label: 'بادج الهيرو (بادئة)', labelEn: 'Hero Badge Prefix', type: 'text', value: 'حلول', valueEn: 'Solutions' },
      { key: 'general_clients_count', label: 'عدد العملاء', labelEn: 'Clients Count', type: 'text', value: '+20,000', valueEn: '+20,000' },
      { key: 'general_clients_label', label: 'وصف العملاء', labelEn: 'Clients Label', type: 'text', value: 'عميل يثق بنا', valueEn: 'clients trust us' },
      { key: 'general_msg1_time', label: 'وقت الرسالة الأولى', labelEn: 'Message 1 Time', type: 'text', value: 'الآن', valueEn: 'Now' },
      { key: 'general_msg2_time', label: 'وقت الرسالة الثانية', labelEn: 'Message 2 Time', type: 'text', value: 'منذ دقيقة', valueEn: '1 min ago' },

      { key: 'retail_label', label: 'اسم تبويب المتاجر', labelEn: 'Retail Tab Label', type: 'text', value: 'متاجر إلكترونية', valueEn: 'E-commerce' },
      { key: 'retail_title', label: 'عنوان المتاجر', labelEn: 'Retail Title', type: 'text', value: 'حوّل السلات المتروكة إلى مبيعات فورية', valueEn: 'Turn abandoned carts into instant sales' },
      { key: 'retail_description', label: 'وصف المتاجر', labelEn: 'Retail Description', type: 'textarea', value: 'حل متكامل لرفع المبيعات في متاجرك الإلكترونية وتعزيز الولاء في فروع التجزئة التقليدية. من استعادة السلات المتروكة آلياً إلى إرسال العروض الحصرية والخصومات لرواد الفروع، نحن شريكك في تحويل الاهتمام إلى عمليات شراء فعلية.', valueEn: 'A complete solution to boost sales in your online stores and strengthen loyalty across traditional retail branches. From automatically recovering abandoned carts to sending exclusive offers and discounts to in-store visitors, we help you turn interest into real purchases.' },
      { key: 'retail_cta', label: 'زر المتاجر', labelEn: 'Retail CTA', type: 'text', value: 'أبدأ بإحترافية أكثر', valueEn: 'Start with greater professionalism' },
      { key: 'retail_msg1_sender', label: 'مرسل الرسالة الأولى - المتاجر', labelEn: 'Retail Message 1 Sender', type: 'text', value: 'Store', valueEn: 'Store' },
      { key: 'retail_msg1_text', label: 'نص الرسالة الأولى - المتاجر', labelEn: 'Retail Message 1 Text', type: 'textarea', value: 'أهلاً سارة، نسيتِ عطورك المفضلة في السلة! استخدمي كود (SAVE10) للحصول على خصم 10% فوراً.', valueEn: 'Hi Sarah, you left your favorite perfumes in the cart! Use code (SAVE10) to get 10% off instantly.' },
      { key: 'retail_msg2_sender', label: 'مرسل الرسالة الثانية - المتاجر', labelEn: 'Retail Message 2 Sender', type: 'text', value: 'Retail', valueEn: 'Retail' },
      { key: 'retail_msg2_text', label: 'نص الرسالة الثانية - المتاجر', labelEn: 'Retail Message 2 Text', type: 'textarea', value: 'عزيزي العميل، استفد من عرض الجمعة البيضاء الحصري! خصم 30% على جميع المنتجات في فروعنا. العرض ساري حتى نهاية الأسبوع.', valueEn: 'Dear customer, enjoy our exclusive White Friday offer! 30% off all products in our branches. Offer valid until the end of the week.' },

      { key: 'finance_label', label: 'اسم تبويب المالية', labelEn: 'Finance Tab Label', type: 'text', value: 'مالية وحكومي', valueEn: 'Finance & Gov' },
      { key: 'finance_title', label: 'عنوان المالية', labelEn: 'Finance Title', type: 'text', value: 'أمان فائق وسرعة لا تُضاهى للقطاعات الحيوية', valueEn: 'Superior security and unmatched speed for critical sectors' },
      { key: 'finance_description', label: 'وصف المالية', labelEn: 'Finance Description', type: 'textarea', value: 'نضمن وصول رسائل التحقق (OTP) والإشعارات البنكية والحكومية عبر مسارات مباشرة تلتزم بأعلى معايير الأمن السيبراني والخصوصية، مع توافق كامل مع بوابة الرسائل الحكومية (Gov Gate).', valueEn: 'We ensure delivery of OTP messages and banking/government notifications through direct routes that comply with the highest cybersecurity and privacy standards, with full compatibility with the government messaging gateway (Gov Gate).' },
      { key: 'finance_cta', label: 'زر المالية', labelEn: 'Finance CTA', type: 'text', value: 'إبدأ بأمان أعلى', valueEn: 'Start with stronger security' },
      { key: 'finance_msg1_sender', label: 'مرسل الرسالة الأولى - المالية', labelEn: 'Finance Message 1 Sender', type: 'text', value: 'Bank', valueEn: 'Bank' },
      { key: 'finance_msg1_text', label: 'نص الرسالة الأولى - المالية', labelEn: 'Finance Message 1 Text', type: 'textarea', value: 'عميلنا العزيز، رمز التحقق للدخول لمرة واحدة هو: 5821. لا تشارك الرمز مع أي شخص لأمان حسابك.', valueEn: 'Dear customer, your one-time login verification code is: 5821. Do not share this code with anyone for your account security.' },
      { key: 'finance_msg2_sender', label: 'مرسل الرسالة الثانية - المالية', labelEn: 'Finance Message 2 Sender', type: 'text', value: 'Gov', valueEn: 'Gov' },
      { key: 'finance_msg2_text', label: 'نص الرسالة الثانية - المالية', labelEn: 'Finance Message 2 Text', type: 'textarea', value: 'نحيطكم علماً بأنه تم تجديد تصريح (....) بنجاح. يمكنك الاطلاع على التفاصيل عبر المنصة الرسمية.', valueEn: 'We would like to inform you that permit (....) has been successfully renewed. You can view details through the official platform.' },

      { key: 'education_label', label: 'اسم تبويب التعليم', labelEn: 'Education Tab Label', type: 'text', value: 'تعليم وتدريب', valueEn: 'Education & Training' },
      { key: 'education_title', label: 'عنوان التعليم', labelEn: 'Education Title', type: 'text', value: 'جسور تواصل تفاعلية بين الصرح التعليمي والأسرة', valueEn: 'Interactive communication bridges between educational institutions and families' },
      { key: 'education_description', label: 'وصف التعليم', labelEn: 'Education Description', type: 'textarea', value: 'ابقِ أولياء الأمور والطلاب على اطلاع دائم بكل ما يخص المسيرة التعليمية. من إشعارات الغياب والحضور إلى نتائج الاختبارات والفعاليات، نحن نوفر لك الربط الأسرع مع أنظمتك الأكاديمية.', valueEn: 'Keep parents and students continuously informed about every part of the learning journey. From absence and attendance alerts to exam results and school events, we provide the fastest connection to your academic systems.' },
      { key: 'education_cta', label: 'زر التعليم', labelEn: 'Education CTA', type: 'text', value: 'أبدأ التواصل بفاعلية', valueEn: 'Start communicating effectively' },
      { key: 'education_msg1_sender', label: 'مرسل الرسالة الأولى - التعليم', labelEn: 'Education Message 1 Sender', type: 'text', value: 'School', valueEn: 'School' },
      { key: 'education_msg1_text', label: 'نص الرسالة الأولى - التعليم', labelEn: 'Education Message 1 Text', type: 'textarea', value: 'ولي الأمر العزيز، نفيدكم بغياب الطالب/ خالد عن الحصص الدراسية اليوم. يرجى التواصل مع الإدارة.', valueEn: 'Dear parent, we inform you that student/ Khaled was absent from classes today. Please contact the administration.' },
      { key: 'education_msg2_sender', label: 'مرسل الرسالة الثانية - التعليم', labelEn: 'Education Message 2 Sender', type: 'text', value: 'Academy', valueEn: 'Academy' },
      { key: 'education_msg2_text', label: 'نص الرسالة الثانية - التعليم', labelEn: 'Education Message 2 Text', type: 'textarea', value: 'مرحباً بك في دورة (التسويق الرقمي). تبدأ المحاضرة الأولى غداً الساعة 5:00 م. رابط القاعة: [رابط]', valueEn: 'Welcome to the (Digital Marketing) course. The first lecture starts tomorrow at 5:00 PM. Classroom link: [Link]' },

      { key: 'logistics_label', label: 'اسم تبويب اللوجستيك', labelEn: 'Logistics Tab Label', type: 'text', value: 'نقل ولوجستيك', valueEn: 'Transport & Logistics' },
      { key: 'logistics_title', label: 'عنوان اللوجستيك', labelEn: 'Logistics Title', type: 'text', value: 'عزز تجربة عملائك بمتابعة لحظية لشحناتهم', valueEn: 'Enhance your customer experience with real-time shipment tracking' },
      { key: 'logistics_description', label: 'وصف اللوجستيك', labelEn: 'Logistics Description', type: 'textarea', value: 'سواء كنت تدير أسطولاً للنقل الجماعي أو شركة شحن بريد سريع، حلولنا تضمن بقاء عميلك في قلب الحدث. أتمتة كاملة لإشعارات حجز التذاكر، تتبع الشحنات لحظياً، وتنبيهات وصول الحافلات أو المناديب لرفع كفاءة العمليات الميدانية.', valueEn: 'Whether you manage a public transportation fleet or an express shipping company, our solutions keep your customer fully informed. Complete automation for ticket-booking notifications, live shipment tracking, and bus/courier arrival alerts to improve field operations efficiency.' },
      { key: 'logistics_cta', label: 'زر اللوجستيك', labelEn: 'Logistics CTA', type: 'text', value: 'أربط أنظمتك بAPI', valueEn: 'Connect your systems via API' },
      { key: 'logistics_msg1_sender', label: 'مرسل الرسالة الأولى - اللوجستيك', labelEn: 'Logistics Message 1 Sender', type: 'text', value: 'Delivery', valueEn: 'Delivery' },
      { key: 'logistics_msg1_text', label: 'نص الرسالة الأولى - اللوجستيك', labelEn: 'Logistics Message 1 Text', type: 'textarea', value: 'طلبك رقم #1234 أصبح الآن "قيد التوصيل". المندوب في طريقه إليك، للتواصل: 050XXXXXXX', valueEn: 'Your order #1234 is now "Out for Delivery". The courier is on the way to you. Contact: 050XXXXXXX' },
      { key: 'logistics_msg2_sender', label: 'مرسل الرسالة الثانية - اللوجستيك', labelEn: 'Logistics Message 2 Sender', type: 'text', value: 'Delivery', valueEn: 'Delivery' },
      { key: 'logistics_msg2_text', label: 'نص الرسالة الثانية - اللوجستيك', labelEn: 'Logistics Message 2 Text', type: 'textarea', value: 'عزيزي العميل، لاستلام شحنتك من المندوب، يرجى تزويده برمز التأكيد: 9920', valueEn: 'Dear customer, to receive your shipment from the courier, please provide confirmation code: 9920' },

      { key: 'health_label', label: 'اسم تبويب الصحة والخدمات', labelEn: 'Health Tab Label', type: 'text', value: 'صحة وخدمات', valueEn: 'Health & Services' },
      { key: 'health_title', label: 'عنوان الصحة والخدمات', labelEn: 'Health Title', type: 'text', value: 'رعاية صحية أدق.. وتواصل أذكى مع المراجعين', valueEn: 'More precise healthcare and smarter communication with clients' },
      { key: 'health_description', label: 'وصف الصحة والخدمات', labelEn: 'Health Description', type: 'textarea', value: 'وحّد تواصلك مع المراجعين والعملاء. نوفر حلولاً مخصصة للمستشفيات لإدارة المواعيد، ولشركات الخدمات (القانونية، الاستشارية، الصيانة، والجمال) لجدولة المواعيد وإرسال التنبيهات، مما يقلل الهدر التشغيلي ويرفع مستوى الرضا.', valueEn: 'Unify your communication with patients and clients. We provide tailored solutions for hospitals to manage appointments, and for service companies (legal, consulting, maintenance, and beauty) to schedule visits and send alerts, reducing operational waste and increasing satisfaction.' },
      { key: 'health_cta', label: 'زر الصحة والخدمات', labelEn: 'Health CTA', type: 'text', value: 'أتمت تواصلك بفاعلية', valueEn: 'Automate your communication effectively' },
      { key: 'health_msg1_sender', label: 'مرسل الرسالة الأولى - الصحة', labelEn: 'Health Message 1 Sender', type: 'text', value: 'Clinic', valueEn: 'Clinic' },
      { key: 'health_msg1_text', label: 'نص الرسالة الأولى - الصحة', labelEn: 'Health Message 1 Text', type: 'textarea', value: 'عزيزي المراجع، نذكرك بموعدك في عيادة الأسنان غداً الساعة 5:00 م.', valueEn: 'Dear patient, this is a reminder of your appointment at the dental clinic tomorrow at 5:00 PM.' },
      { key: 'health_msg2_sender', label: 'مرسل الرسالة الثانية - الصحة', labelEn: 'Health Message 2 Sender', type: 'text', value: 'Service', valueEn: 'Service' },
      { key: 'health_msg2_text', label: 'نص الرسالة الثانية - الصحة', labelEn: 'Health Message 2 Text', type: 'textarea', value: 'فني الصيانة في طريقه إليك الآن لإصلاح (....). كود الزيارة: 552.', valueEn: 'The maintenance technician is on the way now to fix (....). Visit code: 552.' },
    ] },
    { id: 'sms-pricing', name: 'تسعير SMS', nameEn: 'SMS Pricing', visible: true, fields: [
      { key: 'title', label: 'عنوان التسعير', labelEn: 'Pricing Title', type: 'text', value: 'باقات الرسائل', valueEn: 'SMS Packages' },
      { key: 'subtitle', label: 'وصف التسعير', labelEn: 'Pricing Subtitle', type: 'textarea', value: 'اختر الباقة المناسبة لحجم عملك.', valueEn: 'Choose a plan that fits your business.' },
      { key: 'plans_list', label: 'قائمة الباقات', labelEn: 'Plans List', type: 'list', value: '', valueEn: '' },
    ] },
    { id: 'sms-trust', name: 'شعارات الثقة', nameEn: 'Trust Logos', visible: true, fields: [] },
  ],
  whatsapp: [
    { id: 'wa-hero', name: 'WhatsApp Hero', nameEn: 'WhatsApp Hero', visible: true, fields: [
      { key: 'badge', label: 'شارة واتساب', labelEn: 'WhatsApp Badge', type: 'text', value: 'واتساب أعمال API المعتمد', valueEn: 'Official WhatsApp Business API' },
      { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'واتساب أعمال API', valueEn: 'WhatsApp Business API' },
      { key: 'subtitle', label: 'الوصف المختصر', labelEn: 'Subtitle', type: 'text', value: 'تواصل احترافي مع عملائك', valueEn: 'Professional customer communication' },
      { key: 'description', label: 'الوصف التفصيلي', labelEn: 'Detailed Description', type: 'textarea', value: 'كن أقرب لعملائك. نوفر لك ربطاً رسمياً ومعتمداً بخدمة واتساب مع أدوات متقدمة لإدارة المحادثات، الشات بوت، والحملات التسويقية.', valueEn: 'Get closer to your customers. We provide an official WhatsApp integration with advanced tools for chat management, chatbots, and marketing campaigns.' },
      { key: 'cta_primary_text', label: 'نص الزر الأساسي', labelEn: 'Primary CTA Text', type: 'text', value: 'اطلب الخدمة الآن', valueEn: 'Order Service Now' },
      { key: 'cta_primary_type', label: 'نوع الرابط الأساسي', labelEn: 'Primary CTA Type', type: 'text', value: 'form', valueEn: 'form' },
      { key: 'cta_primary_url', label: 'رابط الزر الأساسي (خارجي)', labelEn: 'Primary CTA URL (external)', type: 'url', value: 'https://wapp.mobile.net.sa/billing-subscription', valueEn: 'https://wapp.mobile.net.sa/billing-subscription' },
      { key: 'cta_secondary_text', label: 'نص الزر الثانوي', labelEn: 'Secondary CTA Text', type: 'text', value: 'استعرض الباقات', valueEn: 'View Packages' },
      { key: 'cta_secondary_type', label: 'نوع الرابط الثانوي', labelEn: 'Secondary CTA Type', type: 'text', value: 'external', valueEn: 'external' },
      { key: 'cta_secondary_url', label: 'رابط الزر الثانوي', labelEn: 'Secondary CTA URL', type: 'url', value: 'https://wa.me/966920006900', valueEn: 'https://wa.me/966920006900' },
    ] },
    { id: 'wa-features', name: 'مميزات واتساب', nameEn: 'WhatsApp Features', visible: true, fields: [
      { key: 'title', label: 'عنوان قسم المميزات', labelEn: 'Features Section Title', type: 'text', value: 'أدوات احترافية لإدارة محادثاتك', valueEn: 'Professional Tools to Manage Conversations' },
      { key: 'subtitle', label: 'وصف قسم المميزات', labelEn: 'Features Section Subtitle', type: 'textarea', value: 'كل ما تحتاجه لتحويل واتساب إلى قناة تواصل احترافية مع عملائك', valueEn: 'Everything you need to turn WhatsApp into a professional communication channel with your customers' },
      { key: 'solutions_title', label: 'عنوان قسم الحلول', labelEn: 'Solutions Section Title', type: 'text', value: 'أدوات احترافية لإدارة محادثاتك', valueEn: 'Professional Tools to Manage Conversations' },
      { key: 'campaigns_title', label: 'عنوان قسم الحملات', labelEn: 'Campaigns Section Title', type: 'text', value: 'أطلق حملاتك التسويقية بذكاء', valueEn: 'Launch Your Campaigns Smartly' },
      { key: 'api_pricing_title', label: 'عنوان أسعار محادثات API (قديم)', labelEn: 'API Conversation Prices Title (Legacy)', type: 'text', value: 'أسعار محادثات واتساب API', valueEn: 'WhatsApp API Conversation Prices' },
    ] },
    { id: 'wa-pricing', name: 'تسعير واتساب', nameEn: 'WhatsApp Pricing', visible: true, fields: [
      { key: 'title', label: 'عنوان قسم الباقات', labelEn: 'Packages Section Title', type: 'text', value: 'اختر الباقة المناسبة لنمو أعمالك', valueEn: 'Choose the right package for your business growth' },
      { key: 'subtitle', label: 'وصف قسم الباقات', labelEn: 'Packages Section Subtitle', type: 'textarea', value: 'باقات مرنة تناسب جميع أحجام الأعمال من الشركات الناشئة إلى المؤسسات الكبرى', valueEn: 'Flexible packages suitable for all business sizes from startups to large enterprises' },
      { key: 'plans_note', label: 'عنوان ملاحظة الباقات', labelEn: 'Plans Note Title', type: 'text', value: 'ملاحظة مهمة', valueEn: 'Important Note' },
      { key: 'contact_note', label: 'نص ملاحظة الباقات', labelEn: 'Plans Note Text', type: 'textarea', value: 'الأسعار الموضحة تشمل 3 شرائح لكل باقة. تتوفر خصومات خاصة للشركات الكبرى والجهات الحكومية.', valueEn: 'The stated prices include 3 tiers for each package. Special discounts are available for large companies and government entities.' },
      { key: 'plans_list', label: 'تفاصيل الباقات والشرائح', labelEn: 'Packages and Tiers Details', type: 'list', value: serializeWhatsAppPlans(getDefaultWhatsAppPlans(true)), valueEn: serializeWhatsAppPlans(getDefaultWhatsAppPlans(false)) },
      { key: 'api_title', label: 'عنوان أسعار محادثات API', labelEn: 'API Pricing Title', type: 'text', value: 'أسعار محادثات واتساب API', valueEn: 'WhatsApp API Conversation Prices' },
      { key: 'api_subtitle', label: 'وصف أسعار محادثات API', labelEn: 'API Pricing Subtitle', type: 'textarea', value: 'الأسعار التالية محددة من واتساب (Meta) للسوق السعودي', valueEn: 'The following prices are standardized by WhatsApp (Meta) for the Saudi Market' },
      { key: 'api_prices_list', label: 'قائمة أسعار محادثات API', labelEn: 'API Conversation Pricing List', type: 'list', value: serializeWhatsAppConversationPrices(getDefaultWhatsAppConversationPrices(true)), valueEn: serializeWhatsAppConversationPrices(getDefaultWhatsAppConversationPrices(false)) },
      { key: 'api_tip_title', label: 'عنوان النصيحة', labelEn: 'Tip Title', type: 'text', value: 'نصيحة احترافية', valueEn: 'Pro Tip' },
      { key: 'api_tip_description', label: 'وصف النصيحة', labelEn: 'Tip Description', type: 'textarea', value: 'محادثات خدمة العملاء مجانية تماماً خلال 24 ساعة من آخر رسالة! استفد من هذه الميزة للرد على استفسارات عملائك دون أي تكلفة إضافية.', valueEn: 'Customer service conversations are completely free within 24 hours of the last message. Use this to answer customer questions with no extra cost.' },
    ] },
  ],
  otime: [
    { id: 'ot-hero', name: 'O-Time Hero', nameEn: 'O-Time Hero', visible: true, fields: [
      { key: 'badge', label: 'شارة الصفحة', labelEn: 'Page Badge', type: 'text', value: 'نظام الموارد البشرية السحابي', valueEn: 'Cloud HR System' },
      { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'O-Time', valueEn: 'O-Time' },
      { key: 'subtitle', label: 'الوصف', labelEn: 'Subtitle', type: 'textarea', value: 'نظام متكامل لإدارة الموارد البشرية.', valueEn: 'Integrated HR management system.' },
    ] },
    { id: 'ot-features', name: 'مميزات O-Time', nameEn: 'O-Time Features', visible: true, fields: [] },
  ],
  govgate: [
    { id: 'gg-hero', name: 'Gov Gate Hero', nameEn: 'Gov Gate Hero', visible: true, fields: [
      { key: 'badge', label: 'شارة الصفحة', labelEn: 'Page Badge', type: 'text', value: 'بوابة المراسلات الحكومية', valueEn: 'Government Messaging Gateway' },
      { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'Gov Gate', valueEn: 'Gov Gate' },
      { key: 'subtitle', label: 'الوصف المختصر', labelEn: 'Subtitle', type: 'textarea', value: 'حل مراسلات مؤسسي آمن.', valueEn: 'Secure enterprise messaging solution.' },
    ] },
    { id: 'gg-cta', name: 'دعوة الإجراء', nameEn: 'CTA Section', visible: true, fields: [
      { key: 'cta_text', label: 'نص الزر', labelEn: 'CTA Text', type: 'text', value: 'ابدأ الآن', valueEn: 'Start now' },
      { key: 'cta_url', label: 'رابط الزر', labelEn: 'CTA URL', type: 'url', value: 'https://wa.me/966920006900', valueEn: 'https://wa.me/966920006900' },
    ] },
  ],
  contact: defaultContactSections,
  blog: defaultBlogSections,
};

const cloneField = (field: SeedSectionField): SeedSectionField => ({ ...field });
const cloneSection = (section: SeedSection): SeedSection => ({ ...section, fields: section.fields.map(cloneField) });
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === 'object' && !Array.isArray(value));
const asTrimmedString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const toToday = (): string => new Date().toISOString().split('T')[0];

const normalizeFieldType = (value: unknown): FieldType => {
  if (value === 'text' || value === 'textarea' || value === 'url' || value === 'list') return value;
  return 'text';
};

const normalizeField = (value: unknown, index: number): SeedSectionField => {
  const raw = isRecord(value) ? value : {};
  const key = asTrimmedString(raw.key) || `field_${index + 1}`;
  const label = asTrimmedString(raw.label) || key;
  return {
    key,
    label,
    labelEn: asTrimmedString(raw.labelEn) || label,
    type: normalizeFieldType(raw.type),
    value: typeof raw.value === 'string' ? raw.value : '',
    valueEn: typeof raw.valueEn === 'string' ? raw.valueEn : undefined,
  };
};

const normalizeSection = (value: unknown, index: number): SeedSection => {
  const raw = isRecord(value) ? value : {};
  const id = asTrimmedString(raw.id) || `section_${index + 1}`;
  const rawFields = Array.isArray(raw.fields) ? raw.fields : [];
  return {
    id,
    name: asTrimmedString(raw.name) || id,
    nameEn: asTrimmedString(raw.nameEn) || asTrimmedString(raw.name) || id,
    visible: raw.visible !== false,
    fields: rawFields.map(normalizeField),
  };
};

const shouldForceTemplateField = (pageId: string, sectionId: string): boolean => {
  if (pageId === 'sms' && sectionId === 'sms-hero') return true;
  return false;
};

const mergeTemplateIntoPage = (page: SeedPage, templateSections: SeedSection[]): SeedPage => {
  const currentSections = Array.isArray(page.sections) ? page.sections : [];
  const byId = new Map(currentSections.map((section) => [section.id, section]));
  const merged: SeedSection[] = [];

  for (const template of templateSections) {
    const existing = byId.get(template.id);
    if (!existing) {
      merged.push(cloneSection(template));
      continue;
    }
    const existingFields = Array.isArray(existing.fields) ? existing.fields : [];
    const existingByKey = new Map(existingFields.map((field) => [field.key, field]));

    const mergedFields: SeedSectionField[] = template.fields.map((templateField) => {
      const existingField = existingByKey.get(templateField.key);
      if (!existingField) {
        return cloneField(templateField);
      }
      if (shouldForceTemplateField(page.id, template.id)) {
        return {
          ...existingField,
          ...cloneField(templateField),
          value: templateField.value,
          valueEn: templateField.valueEn,
        };
      }
      return existingField;
    });

    const extraFields = existingFields.filter((field) => !template.fields.some((templateField) => templateField.key === field.key));
    merged.push({ ...existing, fields: [...mergedFields, ...extraFields] });
  }

  for (const section of currentSections) {
    if (!merged.some((item) => item.id === section.id)) merged.push(section);
  }

  return { ...page, sections: merged };
};

const buildDefaultPage = (blueprint: PageBlueprint): SeedPage => ({
  id: blueprint.id,
  title: blueprint.title,
  titleEn: blueprint.titleEn,
  path: blueprint.path,
  lastEdited: toToday(),
  sections: (defaultPageSectionsById[blueprint.id] || []).map(cloneSection),
  seo: blueprint.seo,
});

const ensureHomeHeroFields = (pages: SeedPage[]): SeedPage[] => pages.map((page) => {
  if (page.id !== 'home' && page.path !== '/') return page;
  return mergeTemplateIntoPage(page, [{ id: 'home-hero', name: 'الهيرو', nameEn: 'Hero', visible: true, fields: homeHeroExtraFields }]);
});

const ensureHomeSolutionsFields = (pages: SeedPage[]): SeedPage[] => pages.map((page) => {
  if (page.id !== 'home' && page.path !== '/') return page;
  return mergeTemplateIntoPage(page, [{ id: 'home-solutions', name: 'الحلول الرئيسية', nameEn: 'Key Solutions', visible: true, fields: homeSolutionsExtraFields }]);
});

const normalizePages = (input: unknown): SeedPage[] => {
  const rows = Array.isArray(input) ? input : [];
  const byId = new Map(ACTIVE_PAGE_BLUEPRINTS.map((page) => [page.id, page]));
  const byPath = new Map(ACTIVE_PAGE_BLUEPRINTS.map((page) => [page.path, page]));
  const used = new Set<string>();
  const normalized: SeedPage[] = [];

  for (const row of rows) {
    if (!isRecord(row)) continue;
    const blueprint = byId.get(asTrimmedString(row.id)) || byPath.get(asTrimmedString(row.path));
    if (!blueprint || used.has(blueprint.id)) continue;
    used.add(blueprint.id);

    const rawSections = Array.isArray(row.sections) ? row.sections : [];
    normalized.push({
      id: blueprint.id,
      title: asTrimmedString(row.title) || blueprint.title,
      titleEn: asTrimmedString(row.titleEn) || blueprint.titleEn,
      path: blueprint.path,
      lastEdited: asTrimmedString(row.lastEdited) || toToday(),
      sections: rawSections.length
        ? rawSections.map(normalizeSection)
        : (defaultPageSectionsById[blueprint.id] || []).map(cloneSection),
      seo: (isRecord(row.seo) && Object.keys(row.seo as Record<string, unknown>).length > 0) ? row.seo as SeedPage['seo'] : blueprint.seo,
    });
  }

  for (const blueprint of ACTIVE_PAGE_BLUEPRINTS) {
    if (!used.has(blueprint.id)) normalized.push(buildDefaultPage(blueprint));
  }

  const normalizedWithTemplates = normalized.map((page) =>
    mergeTemplateIntoPage(page, defaultPageSectionsById[page.id] || [])
  );

  return ensureHomeSolutionsFields(ensureHomeHeroFields(normalizedWithTemplates));
};

const normalizePartners = (input: unknown) => {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const rows: Array<{ id: string; name: string; logo: string; active: boolean }> = [];
  for (const row of input) {
    if (!isRecord(row)) continue;
    const id = asTrimmedString(row.id) || `p${rows.length + 1}`;
    if (seen.has(id)) continue;
    const name = asTrimmedString(row.name);
    const logo = asTrimmedString(row.logo);
    if (!name || !logo) continue;
    seen.add(id);
    rows.push({ id, name, logo, active: row.active !== false });
  }
  return rows;
};

const normalizeSocialLinks = (input: unknown) => {
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const rows: Array<{ id: string; platform: string; icon: string; url: string; active: boolean }> = [];
  for (const row of input) {
    if (!isRecord(row)) continue;
    const id = asTrimmedString(row.id) || `s${rows.length + 1}`;
    if (seen.has(id)) continue;
    const platform = asTrimmedString(row.platform);
    const icon = asTrimmedString(row.icon);
    const url = asTrimmedString(row.url);
    if (!platform || !url) continue;
    seen.add(id);
    rows.push({ id, platform, icon, url, active: row.active !== false });
  }
  return rows;
};

const normalizeSubmissions = (input: unknown) => {
  if (!Array.isArray(input)) return [];
  const rows: Array<{ id: string; name: string; email: string; phone: string; company: string; message: string; product: string; date: string; read: boolean }> = [];
  for (const row of input) {
    if (!isRecord(row)) continue;
    const name = asTrimmedString(row.name);
    const email = asTrimmedString(row.email);
    const message = asTrimmedString(row.message);
    if (!name || !email || !message) continue;
    rows.push({
      id: asTrimmedString(row.id) || `cs${Date.now()}${rows.length}`,
      name,
      email,
      phone: asTrimmedString(row.phone),
      company: asTrimmedString(row.company),
      message,
      product: asTrimmedString(row.product) || 'other',
      date: asTrimmedString(row.date) || new Date().toISOString(),
      read: row.read === true,
    });
  }
  return rows;
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const cleanLegacy = url.searchParams.get('cleanLegacy') !== 'false';
    const keepSubmissions = url.searchParams.get('keepSubmissions') === 'true';

    const existing = (await SiteCms.findOne({ key: 'primary' }).lean()) as ExistingSiteDoc | null;
    const pages = normalizePages(existing?.pages);
    const partners = normalizePartners(existing?.partners);
    const socialLinks = normalizeSocialLinks(existing?.socialLinks);
    const contactSubmissions = keepSubmissions ? normalizeSubmissions(existing?.contactSubmissions) : [];
    const notificationEmail = asTrimmedString(existing?.notificationEmail) || DEFAULT_NOTIFICATION_EMAIL;
    const footerData = isRecord(existing?.footerData) ? existing.footerData : {};

    const site = await SiteCms.findOneAndUpdate(
      { key: 'primary' },
      {
        key: 'primary',
        isActive: true,
        pages,
        partners,
        socialLinks,
        contactSubmissions,
        notificationEmail,
        footerData,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    const staleSiteDocs = await SiteCms.deleteMany({ key: { $ne: 'primary' } });
    const legacy = cleanLegacy ? await cleanupLegacyCollections() : null;

    const defaultWhatsAppFormConfig = {
      productId: 'whatsapp',
      productName: 'نموذج طلب واتساب',
      productNameEn: 'WhatsApp Request Form',
      slug: 'whatsapp-request',
      notificationEmails: 'marketing@corbit.sa',
      isActive: true,
      fields: [
        { id: 'name', type: 'text', labelAr: 'الاسم الكامل', labelEn: 'Full Name', placeholderAr: 'أدخل اسمك الكامل', placeholderEn: 'Enter your full name', required: true, step: 2, options: [] },
        { id: 'email', type: 'email', labelAr: 'البريد الإلكتروني', labelEn: 'Email', placeholderAr: 'أدخل بريدك الإلكتروني', placeholderEn: 'Enter your email', required: true, step: 2, options: [] },
        { id: 'phone', type: 'tel', labelAr: 'رقم الجوال', labelEn: 'Phone Number', placeholderAr: '05XXXXXXXX', placeholderEn: '05XXXXXXXX', required: true, step: 2, options: [] },
        { id: 'companyName', type: 'text', labelAr: 'اسم الشركة', labelEn: 'Company Name', placeholderAr: 'أدخل اسم الشركة', placeholderEn: 'Enter company name', required: false, step: 3, options: [] },
        { id: 'industry', type: 'select', labelAr: 'الصناعة', labelEn: 'Industry', placeholderAr: 'اختر الصناعة', placeholderEn: 'Select industry', required: true, step: 3, options: [
          { value: 'retail', labelAr: 'تجزئة ومبيعات', labelEn: 'Retail & Sales' },
          { value: 'restaurants', labelAr: 'مطاعم وكافيهات', labelEn: 'Restaurants & Cafes' },
          { value: 'healthcare', labelAr: 'صحة وعناية صحية', labelEn: 'Healthcare' },
          { value: 'education', labelAr: 'تعليم', labelEn: 'Education' },
          { value: 'realestate', labelAr: 'عقارات', labelEn: 'Real Estate' },
          { value: 'logistics', labelAr: 'لوجستيات ونقل', labelEn: 'Logistics & Transport' },
          { value: 'banking', labelAr: 'بنوك ومالية', labelEn: 'Banking & Finance' },
          { value: 'government', labelAr: 'حكومي', labelEn: 'Government' },
          { value: 'automotive', labelAr: 'سيارات', labelEn: 'Automotive' },
          { value: 'technology', labelAr: 'تكنولوجيا', labelEn: 'Technology' },
          { value: 'manufacturing', labelAr: 'تصنيع', labelEn: 'Manufacturing' },
          { value: 'other', labelAr: 'أخرى', labelEn: 'Other' },
        ] },
        { id: 'goal', type: 'multiselect', labelAr: 'أهداف الخدمة', labelEn: 'Service Goals', placeholderAr: 'اختر أهداف الخدمة', placeholderEn: 'Select service goals', required: false, step: 4, options: [
          { value: 'customer-support', labelAr: 'دعم العملاء', labelEn: 'Customer Support' },
          { value: 'sales', labelAr: 'مبيعات وتسويق', labelEn: 'Sales & Marketing' },
          { value: 'notifications', labelAr: 'إشعارات آلية', labelEn: 'Automated Notifications' },
          { value: 'internal-communication', labelAr: 'تواصل داخلي', labelEn: 'Internal Communication' },
        ] },
        { id: 'employeeCount', type: 'radio', labelAr: 'عدد الموظفين', labelEn: 'Employee Count', placeholderAr: '', placeholderEn: '', required: true, step: 5, options: [
          { value: '1-10', labelAr: '1 - 10 موظفين', labelEn: '1 - 10 employees' },
          { value: '11-50', labelAr: '11 - 50 موظف', labelEn: '11 - 50 employees' },
          { value: '51-100', labelAr: '51 - 100 موظف', labelEn: '51 - 100 employees' },
          { value: '101-500', labelAr: '101 - 500 موظف', labelEn: '101 - 500 employees' },
          { value: '500+', labelAr: 'أكثر من 500', labelEn: '500+ employees' },
        ] },
        { id: 'notes', type: 'textarea', labelAr: 'ملاحظات', labelEn: 'Notes', placeholderAr: 'أي ملاحظات إضافية ترغب في إضافتها', placeholderEn: 'Any additional notes you would like to add', required: false, step: 6, options: [] },
      ],
    };

    await FormConfig.findOneAndUpdate(
      { productId: 'whatsapp' },
      { $set: defaultWhatsAppFormConfig },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Site CMS seeded and normalized for current production pages',
      cleanLegacy,
      keepSubmissions,
      legacy,
      siteCms: {
        id: site?._id,
        pages: pages.length,
        partners: partners.length,
        socialLinks: socialLinks.length,
        contactSubmissions: contactSubmissions.length,
        removedNonPrimaryDocs: staleSiteDocs.deletedCount ?? 0,
      },
      adminDashboardAuth: {
        email: 'admin@corbit',
        password: 'AAaa12341234',
        note: 'Configured in AdminDashboard.tsx (client-side gate)',
      },
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
