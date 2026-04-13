const mongoose = require('mongoose');
require('dotenv').config();

const CmsPageContentSchema = new mongoose.Schema({
  pageId: { type: String, required: true, unique: true },
  path: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 },
  seo: {
    title: { en: String, ar: String },
    description: { en: String, ar: String },
    keywords: { en: String, ar: String },
    canonical: String,
    noIndex: Boolean,
  },
  social: {
    ogImage: String,
    ogTitle: { en: String, ar: String },
    ogDescription: { en: String, ar: String },
  },
  sections: [{
    id: String,
    type: String,
    order: Number,
    fields: [{
      key: String,
      value: String,
      valueEn: String,
      richText: Boolean,
    }],
  }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const SeoSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  siteName: {
    en: { type: String, default: 'ORBIT | المدار' },
    ar: { type: String, default: 'ORBIT | المدار' },
  },
  siteUrl: { type: String, default: process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.sa' },
  defaultSeo: {
    title: { en: String, ar: String },
    description: { en: String, ar: String },
    keywords: { en: String, ar: String },
  },
  organization: {
    name: { type: String, default: 'ORBIT' },
    logo: { type: String, default: '/logo/شعار المدار-03.svg' },
    description: { en: String, ar: String },
    address: {
      street: String,
      city: { type: String, default: 'Riyadh' },
      country: { type: String, default: 'SA' },
    },
    phone: String,
    email: { type: String, default: 'info@orbit.sa' },
    socialLinks: {
      twitter: String,
      linkedin: String,
      instagram: String,
      facebook: String,
    },
  },
  analytics: {
    gtmId: String,
    gscVerification: String,
    facebookPixelId: String,
  },
  robotsTxt: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const CmsPageContent = mongoose.model('CmsPageContent', CmsPageContentSchema);
const SeoSettings = mongoose.model('SeoSettings', SeoSettingsSchema);

const generateId = () => `section_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await CmsPageContent.deleteMany({});
    console.log('🗑️ Cleared existing CMS pages');

    await SeoSettings.deleteMany({});
    console.log('🗑️ Cleared existing SEO settings');

    const homePage = await CmsPageContent.create({
      pageId: 'home',
      path: '/',
      order: 0,
      seo: {
        title: { en: 'ORBIT | Leading Technical Solutions', ar: 'ORBIT | حلول تقنية رائدة' },
        description: { en: 'Leading technical solutions provider in Saudi Arabia offering SMS, WhatsApp, and enterprise solutions', ar: 'مزود حلول تقنية رائد في المملكة العربية السعودية' },
        keywords: { en: 'SMS, WhatsApp Business, Enterprise Solutions, Saudi Arabia', ar: 'رسائل SMS، واتساب للأعمال، حلول مؤسسية' },
        canonical: '',
        noIndex: false,
      },
      social: {
        ogImage: '/og-image.png',
        ogTitle: { en: 'ORBIT | Leading Technical Solutions', ar: 'ORBIT | حلول تقنية رائدة' },
        ogDescription: { en: 'Leading technical solutions provider in Saudi Arabia', ar: 'مزود حلول تقنية رائد في المملكة العربية السعودية' },
      },
      sections: [
        {
          id: generateId(),
          type: 'hero',
          order: 0,
          fields: [
            { key: 'badge', value: '🚀 الحل التقني الأول في السعودية', richText: false },
            { key: 'badge_en', value: '🚀 The First Tech Solution in Saudi Arabia', richText: false },
            { key: 'title', value: 'حلول تقنية متكاملة لنجاح أعمالك', richText: false },
            { key: 'title_en', value: 'Integrated Technical Solutions for Your Business Success', richText: false },
            { key: 'description', value: 'نقدم لكم مجموعة شاملة من الحلول التقنية المتكاملة التي تساعد الشركات والمؤسسات على تحسين أداءها وتحقيق أهدافها بكفاءة عالية', richText: true },
            { key: 'description_en', value: 'We offer a comprehensive range of integrated technical solutions that help companies and organizations improve their performance and achieve their goals efficiently', richText: true },
            { key: 'cta1_text', value: 'ابدأ الآن', richText: false },
            { key: 'cta1_text_en', value: 'Get Started', richText: false },
            { key: 'cta1_url', value: 'https://app.mobile.net.sa/reg', richText: false },
            { key: 'cta2_text', value: 'تواصل معنا', richText: false },
            { key: 'cta2_text_en', value: 'Contact Us', richText: false },
            { key: 'cta2_url', value: '/contact', richText: false },
          ],
        },
      ],
      isActive: true,
    });
    console.log('✅ Created home page');

    const smsPage = await CmsPageContent.create({
      pageId: 'sms',
      path: '/solutions/sms-platform',
      order: 1,
      seo: {
        title: { en: 'SMS Platform | ORBIT', ar: 'منصة الرسائل النصية | ORBIT' },
        description: { en: 'Send SMS messages to your customers with high delivery rates and competitive pricing', ar: 'أرسل رسائل نصية لعملائك مع معدلات تسليم عالية وأسعار تنافسية' },
        keywords: { en: 'SMS, bulk SMS, SMS API, Saudi Arabia', ar: 'رسائل نصية، رسائل بالجملة، API الرسائل' },
        canonical: '',
        noIndex: false,
      },
      social: {
        ogImage: '/og-sms.png',
        ogTitle: { en: 'SMS Platform | ORBIT', ar: 'منصة الرسائل النصية | ORBIT' },
        ogDescription: { en: 'Send SMS messages with high delivery rates', ar: 'أرسل رسائل نصية مع معدلات تسليم عالية' },
      },
      sections: [
        {
          id: generateId(),
          type: 'hero',
          order: 0,
          fields: [
            { key: 'badge', value: '📱 منصة الرسائل النصية', richText: false },
            { key: 'badge_en', value: '📱 SMS Platform', richText: false },
            { key: 'title', value: 'رسائل نصية فعّالة لعملائك', richText: false },
            { key: 'title_en', value: 'Effective SMS Messages for Your Customers', richText: false },
            { key: 'description', value: 'منصتنا تتيح لك إرسال رسائل نصية جماعية بسهولة وأمان مع تتبع شامل للحالة', richText: true },
            { key: 'description_en', value: 'Our platform allows you to send bulk SMS messages easily and securely with comprehensive status tracking', richText: true },
            { key: 'cta1_text', value: 'عرض الباقات', richText: false },
            { key: 'cta1_text_en', value: 'View Packages', richText: false },
            { key: 'cta1_url', value: '#pricing', richText: false },
          ],
        },
      ],
      isActive: true,
    });
    console.log('✅ Created SMS page');

    const whatsappPage = await CmsPageContent.create({
      pageId: 'whatsapp',
      path: '/solutions/whatsapp-business-api',
      order: 2,
      seo: {
        title: { en: 'WhatsApp Business API | ORBIT', ar: 'واتساب للأعمال | ORBIT' },
        description: { en: 'Connect with your customers on WhatsApp with our Business API solution', ar: 'تواصل مع عملائك عبر واتساب مع حلنا لـ Business API' },
        keywords: { en: 'WhatsApp Business, WhatsApp API, Customer Communication', ar: 'واتساب للأعمال، واتساب API' },
        canonical: '',
        noIndex: false,
      },
      social: {
        ogImage: '/og-whatsapp.png',
        ogTitle: { en: 'WhatsApp Business API | ORBIT', ar: 'واتساب للأعمال | ORBIT' },
        ogDescription: { en: 'Connect with customers on WhatsApp', ar: 'تواصل مع عملائك عبر واتساب' },
      },
      sections: [
        {
          id: generateId(),
          type: 'hero',
          order: 0,
          fields: [
            { key: 'badge', value: '💬 واتساب للأعمال', richText: false },
            { key: 'badge_en', value: '💬 WhatsApp Business', richText: false },
            { key: 'title', value: 'تواصل فعّال مع عملائك', richText: false },
            { key: 'title_en', value: 'Effective Communication with Your Customers', richText: false },
            { key: 'description', value: 'حلل واتساب لتطبيقات الأعمال يتيح لك التواصل مع عملائك بطريقة احترافية وآمنة', richText: true },
            { key: 'description_en', value: 'WhatsApp Business API allows you to communicate with your customers in a professional and secure way', richText: true },
            { key: 'cta1_text', value: 'ابدأ الآن', richText: false },
            { key: 'cta1_text_en', value: 'Get Started', richText: false },
            { key: 'cta1_url', value: '/products/whatsapp/request', richText: false },
          ],
        },
      ],
      isActive: true,
    });
    console.log('✅ Created WhatsApp page');

    const otimePage = await CmsPageContent.create({
      pageId: 'otime',
      path: '/solutions/otime',
      order: 3,
      seo: {
        title: { en: 'OTime | Attendance Management | ORBIT', ar: 'OTime | إدارة الحضور والانصراف | ORBIT' },
        description: { en: 'Comprehensive attendance and time management solution for your organization', ar: 'حل شامل لإدارة الحضور والانصراف في مؤسستك' },
        keywords: { en: 'Attendance, Time Management, HR, Saudi Arabia', ar: 'الحضور، إدارة الوقت، الموارد البشرية' },
        canonical: '',
        noIndex: false,
      },
      social: {
        ogImage: '/og-otime.png',
        ogTitle: { en: 'OTime | Attendance Management', ar: 'OTime | إدارة الحضور' },
        ogDescription: { en: 'Comprehensive attendance management', ar: 'حل شامل لإدارة الحضور' },
      },
      sections: [
        {
          id: generateId(),
          type: 'hero',
          order: 0,
          fields: [
            { key: 'badge', value: '⏰ إدارة الوقت', richText: false },
            { key: 'badge_en', value: '⏰ Time Management', richText: false },
            { key: 'title', value: 'إدارة ذكية للحضور والانصراف', richText: false },
            { key: 'title_en', value: 'Smart Attendance & Time Management', richText: false },
            { key: 'description', value: 'ظام OTime يوفر لك حل متكامل لإدارة حضور وانصراف الموظفين بسهولة ودقة', richText: true },
            { key: 'description_en', value: 'OTime system provides you with an integrated solution for managing employee attendance easily and accurately', richText: true },
            { key: 'cta1_text', value: 'اكتشف المزيد', richText: false },
            { key: 'cta1_text_en', value: 'Learn More', richText: false },
            { key: 'cta1_url', value: '/products/o-time', richText: false },
          ],
        },
      ],
      isActive: true,
    });
    console.log('✅ Created OTime page');

    const govgatePage = await CmsPageContent.create({
      pageId: 'govgate',
      path: '/solutions/gov-gate',
      order: 4,
      seo: {
        title: { en: 'GovGate | Government Services Integration | ORBIT', ar: 'GovGate | التكامل مع الخدمات الحكومية | ORBIT' },
        description: { en: 'Seamlessly integrate with Saudi government services and portals', ar: 'تكامل سلس مع الخدمات الحكومية السعودية' },
        keywords: { en: 'Government, Integration, Saudi Arabia, eGov', ar: 'حكومي، تكامل، السعودية' },
        canonical: '',
        noIndex: false,
      },
      social: {
        ogImage: '/og-govgate.png',
        ogTitle: { en: 'GovGate | Government Services', ar: 'GovGate | الخدمات الحكومية' },
        ogDescription: { en: 'Government services integration', ar: 'التكامل مع الخدمات الحكومية' },
      },
      sections: [
        {
          id: generateId(),
          type: 'hero',
          order: 0,
          fields: [
            { key: 'badge', value: '🏛️ التكامل الحكومي', richText: false },
            { key: 'badge_en', value: '🏛️ Government Integration', richText: false },
            { key: 'title', value: 'اتصال سلس بالخدمات الحكومية', richText: false },
            { key: 'title_en', value: 'Seamless Government Services Connection', richText: false },
            { key: 'description', value: 'GovGate يوفر لك التكامل مع مختلف المنصات والخدمات الحكومية السعودية بسهولة', richText: true },
            { key: 'description_en', value: 'GovGate provides you with easy integration with various Saudi government platforms and services', richText: true },
            { key: 'cta1_text', value: 'اكتشف المزيد', richText: false },
            { key: 'cta1_text_en', value: 'Learn More', richText: false },
            { key: 'cta1_url', value: '/products/gov-gate', richText: false },
          ],
        },
      ],
      isActive: true,
    });
    console.log('✅ Created GovGate page');

    await SeoSettings.create({
      key: 'primary',
      siteName: {
        en: 'ORBIT | المدار',
        ar: 'ORBIT | المدار',
      },
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.sa',
      defaultSeo: {
        title: {
          en: 'ORBIT | Leading Technical Solutions',
          ar: 'ORBIT | حلول تقنية رائدة',
        },
        description: {
          en: 'Leading technical solutions provider in Saudi Arabia offering SMS, WhatsApp, and enterprise solutions',
          ar: 'مزود حلول تقنية رائد في المملكة العربية السعودية نقدم حلول SMS وواتساب وحلول مؤسسية',
        },
        keywords: {
          en: 'SMS, WhatsApp Business, Enterprise Solutions, Saudi Arabia, ORBIT, المدار',
          ar: 'رسائل SMS، واتساب للأعمال، حلول مؤسسية، السعودية، ORBIT',
        },
      },
      organization: {
        name: 'ORBIT | المدار',
        logo: '/logo/شعار المدار-03.svg',
        description: {
          en: 'Leading technical solutions provider in Saudi Arabia',
          ar: 'مزود حلول تقنية رائد في المملكة العربية السعودية',
        },
        address: {
          street: '',
          city: 'Riyadh',
          country: 'SA',
        },
        phone: '+966XXXXXXXXX',
        email: 'info@orbit.sa',
        socialLinks: {
          twitter: 'https://twitter.com/orbit',
          linkedin: 'https://linkedin.com/company/orbit',
          instagram: 'https://instagram.com/orbit',
          facebook: 'https://facebook.com/orbit',
        },
      },
      analytics: {
        gtmId: '',
        gscVerification: '',
        facebookPixelId: '',
      },
      robotsTxt: `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/
Disallow: /_next/

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://orbit.sa'}/sitemap.xml`,
      isActive: true,
    });
    console.log('✅ Created SEO settings');

    console.log('\n🎉 CMS seed completed successfully!');
    console.log(`📄 Created ${5} CMS pages`);
    console.log('⚙️ Created SEO settings');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding CMS:', error);
    process.exit(1);
  }
};

seedData();
