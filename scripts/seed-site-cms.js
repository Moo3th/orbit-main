const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const SiteCmsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  pages: { type: [mongoose.Schema.Types.Mixed], default: [] },
  partners: { type: [mongoose.Schema.Types.Mixed], default: [] },
  socialLinks: { type: [mongoose.Schema.Types.Mixed], default: [] },
  contactSubmissions: { type: [mongoose.Schema.Types.Mixed], default: [] },
  notificationEmail: String,
  footerData: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const SiteCms = mongoose.models.SiteCms || mongoose.model('SiteCms', SiteCmsSchema);

const generateId = () => `section_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const today = new Date().toISOString().split('T')[0];

const seedSiteCms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const homePage = {
      id: 'home',
      title: 'الصفحة الرئيسية',
      titleEn: 'Home Page',
      path: '/',
      lastEdited: today,
      sections: [
        {
          id: 'home-hero',
          name: 'البانر الرئيسي',
          nameEn: 'Hero Banner',
          visible: true,
          fields: [
            { key: 'badge', label: 'البادج', labelEn: 'Badge', type: 'text', value: '🚀 الحل التقني الأول في السعودية', valueEn: '🚀 The First Tech Solution in Saudi Arabia' },
            { key: 'title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'حلول تقنية متكاملة لنجاح أعمالك', valueEn: 'Integrated Technical Solutions for Your Business Success' },
            { key: 'description', label: 'الوصف', labelEn: 'Description', type: 'textarea', value: 'نقدم لكم مجموعة شاملة من الحلول التقنية المتكاملة التي تساعد الشركات والمؤسسات على تحسين أداءها وتحقيق أهدافها بكفاءة عالية', valueEn: 'We offer a comprehensive range of integrated technical solutions that help companies and organizations improve their performance and achieve their goals efficiently' },
            { key: 'cta1_text', label: 'نص الزر الأول', labelEn: 'CTA 1 Text', type: 'text', value: 'ابدأ الآن', valueEn: 'Get Started' },
            { key: 'cta1_url', label: 'رابط الزر الأول', labelEn: 'CTA 1 URL', type: 'url', value: 'https://app.mobile.net.sa/reg', valueEn: 'https://app.mobile.net.sa/reg' },
            { key: 'cta2_text', label: 'نص الزر الثاني', labelEn: 'CTA 2 Text', type: 'text', value: 'تواصل معنا', valueEn: 'Contact Us' },
            { key: 'cta2_url', label: 'رابط الزر الثاني', labelEn: 'CTA 2 URL', type: 'url', value: '/contact', valueEn: '/contact' },
            { key: 'cta_api_docs_url', label: 'رابط زر تصفح ملفات API', labelEn: 'Browse API Docs Button URL', type: 'url', value: 'https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view?usp=drive_link', valueEn: 'https://drive.google.com/file/d/1xhdFti973PHqik0T5rGGDipm_30gq064/view?usp=drive_link' },
          ],
        },
        {
          id: 'home-solutions',
          name: 'قسم المنتجات والحلول',
          nameEn: 'Products & Solutions Section',
          visible: true,
          fields: [
            { key: 'general_title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'حلول تقنية متكاملة', valueEn: 'Integrated Technical Solutions' },
            { key: 'general_subtitle', label: 'العنوان الفرعي', labelEn: 'Subtitle', type: 'text', value: 'اكتشف مجموعتنا الشاملة من الحلول التقنية المتكاملة', valueEn: 'Explore our comprehensive range of integrated technical solutions' },
            { key: 'wa_title', label: 'عنوان بطاقة واتساب', labelEn: 'WhatsApp Card Title', type: 'text', value: 'واتساب للأعمال API', valueEn: 'WhatsApp Business API' },
            { key: 'wa_desc', label: 'وصف بطاقة واتساب', labelEn: 'WhatsApp Card Description', type: 'textarea', value: 'تواصل مع عملائك عبر واتساب بطريقة احترافية وآمنة مع حلول API متكاملة.', valueEn: 'Communicate with your customers on WhatsApp in a professional and secure way with integrated API solutions.' },
            { key: 'wa_features', label: 'مزايا واتساب (سطر لكل ميزة)', labelEn: 'WhatsApp Features (one per line)', type: 'list', value: 'رسائل فورية ومباشرة\nإشعارات آلية ومجدولة\nدعم متعدد المستخدمين\nتقارير وتحليلات متقدمة', valueEn: 'Instant direct messages\nAutomated scheduled notifications\nMulti-user support\nAdvanced analytics and reporting' },
            { key: 'sms_title', label: 'عنوان بطاقة SMS', labelEn: 'SMS Card Title', type: 'text', value: 'خدمة الرسائل النصية SMS', valueEn: 'SMS Messaging Service' },
            { key: 'sms_desc', label: 'وصف بطاقة SMS', labelEn: 'SMS Card Description', type: 'textarea', value: 'أرسل رسائل نصية فعّالة ومباشرة لجمهورك المستهدف بسهولة وأمان.', valueEn: 'Send effective and direct SMS messages to your target audience easily and securely.' },
            { key: 'sms_features', label: 'مزايا SMS (سطر لكل ميزة)', labelEn: 'SMS Features (one per line)', type: 'list', value: 'توصيل سريع ومضمون\nأسعار تنافسية\nتتبع الحالة والتقارير\nدعم API متكامل', valueEn: 'Fast and guaranteed delivery\nCompetitive pricing\nStatus tracking and reports\nIntegrated API support' },
            { key: 'otime_title', label: 'عنوان بطاقة O-Time', labelEn: 'O-Time Card Title', type: 'text', value: 'O-Time برنامج الموارد البشرية', valueEn: 'O-Time HR Software' },
            { key: 'otime_desc', label: 'وصف بطاقة O-Time', labelEn: 'O-Time Card Description', type: 'textarea', value: 'منصة متكاملة لإدارة الموارد البشرية تشمل الحضور والرواتب ودورة حياة الموظف بالكامل.', valueEn: 'A complete HR operations platform for attendance, payroll, and employee lifecycle management.' },
            { key: 'otime_features', label: 'مزايا O-Time (سطر لكل ميزة)', labelEn: 'O-Time Features (one per line)', type: 'list', value: 'إدارة الحضور والإجازات\nأتمتة مسيرات الرواتب\nبوابة الخدمة الذاتية للموظف\nلوحات تحكم وتحليلات فورية', valueEn: 'Attendance and leave management\nAutomated payroll workflows\nEmployee self-service portal\nReal-time HR analytics dashboards' },
            { key: 'govgate_title', label: 'عنوان بطاقة Gov Gate', labelEn: 'Gov Gate Card Title', type: 'text', value: 'Gov Gate', valueEn: 'Gov Gate' },
            { key: 'govgate_desc', label: 'وصف بطاقة Gov Gate', labelEn: 'Gov Gate Card Description', type: 'textarea', value: 'بوابة مراسلة مؤسسية آمنة ببنية مخصصة وامتثال كامل وتحكم متقدم.', valueEn: 'Secure enterprise messaging gateway with dedicated infrastructure, compliance, and advanced controls.' },
            { key: 'govgate_features', label: 'مزايا Gov Gate (سطر لكل ميزة)', labelEn: 'Gov Gate Features (one per line)', type: 'list', value: 'بوابة مراسلة خاصة وآمنة\nصلاحيات دقيقة بحسب الأدوار\nأمان مؤسسي وامتثال تشريعي\nتقارير تشغيلية وسجل تدقيق مفصل', valueEn: 'Private secure messaging portal\nGranular role-based permissions\nEnterprise-grade security and compliance\nDetailed operational audit reporting' },
          ],
        },
        {
          id: 'home-trust',
          name: 'قسم شركاء النجاح',
          nameEn: 'Success Partners Section',
          visible: true,
          fields: [
            { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'شركاء النجاح', valueEn: 'Success Partners' },
            { key: 'subtitle', label: 'الوصف الفرعي', labelEn: 'Subtitle', type: 'text', value: 'يضعون ثقته في حلولنا التقنية', valueEn: 'Who trust our technical solutions' },
          ],
        },
      ],
    };

    const smsPage = {
      id: 'sms',
      title: 'خدمة الرسائل النصية SMS',
      titleEn: 'SMS Messaging Service',
      path: '/products/sms',
      lastEdited: today,
      sections: [
        {
          id: 'sms-hero',
          name: 'البانر الرئيسي',
          nameEn: 'Hero Banner',
          visible: true,
          fields: [
            { key: 'retail_badge', label: 'بادج قطاع التجارة', labelEn: 'Retail Badge', type: 'text', value: 'قطاع التجارة', valueEn: 'Retail Segment' },
            { key: 'retail_title', label: 'عنوان قطاع التجارة', labelEn: 'Retail Title', type: 'text', value: 'رسائل نصية فعّالة لمتاجر التجزئة', valueEn: 'Effective SMS for Retail Stores' },
            { key: 'retail_desc', label: 'وصف قطاع التجارة', labelEn: 'Retail Description', type: 'textarea', value: 'أرسل عروض الخصومات والعروض الترويجية مباشرة لعملائك', valueEn: 'Send discount offers and promotions directly to your customers' },
            { key: 'finance_badge', label: 'بادج قطاع المالية', labelEn: 'Finance Badge', type: 'text', value: 'قطاع المالية', valueEn: 'Finance Segment' },
            { key: 'finance_title', label: 'عنوان قطاع المالية', labelEn: 'Finance Title', type: 'text', value: 'إشعارات مالية فورية وآمنة', valueEn: 'Instant and Secure Financial Notifications' },
            { key: 'finance_desc', label: 'وصف قطاع المالية', labelEn: 'Finance Description', type: 'textarea', value: 'أبلغ عملاءك بحركاتهم المالية فوراً', valueEn: 'Notify your customers of their financial transactions immediately' },
            { key: 'education_badge', label: 'بادج قطاع التعليم', labelEn: 'Education Badge', type: 'text', value: 'قطاع التعليم', valueEn: 'Education Segment' },
            { key: 'education_title', label: 'عنوان قطاع التعليم', labelEn: 'Education Title', type: 'text', value: 'تواصل تعليمي فعّال', valueEn: 'Effective Educational Communication' },
            { key: 'education_desc', label: 'وصف قطاع التعليم', labelEn: 'Education Description', type: 'textarea', value: 'أبلغ أولياء الأمور والطلاب بالأنشطة والمواعيد المهمة', valueEn: 'Notify parents and students of important activities and dates' },
            { key: 'logistics_badge', label: 'بادج قطاع اللوجستيات', labelEn: 'Logistics Badge', type: 'text', value: 'قطاع اللوجستيات', valueEn: 'Logistics Segment' },
            { key: 'logistics_title', label: 'عنوان قطاع اللوجستيات', labelEn: 'Logistics Title', type: 'text', value: 'تحديثات شحن وتوصيل', valueEn: 'Shipping and Delivery Updates' },
            { key: 'logistics_desc', label: 'أوصف قطاع اللوجستيات', labelEn: 'Logistics Description', type: 'textarea', value: 'أبلغ عملاءك بحالة طلباتهم وشحناتهم', valueEn: 'Notify your customers of their order and shipment status' },
            { key: 'health_badge', label: 'بادج قطاع الصحة', labelEn: 'Healthcare Badge', type: 'text', value: 'قطاع الصحة', valueEn: 'Healthcare Segment' },
            { key: 'health_title', label: 'عنوان قطاع الصحة', labelEn: 'Healthcare Title', type: 'text', value: 'تذكيرات ومواعيد طبية', valueEn: 'Medical Reminders and Appointments' },
            { key: 'health_desc', label: 'وصف قطاع الصحة', labelEn: 'Healthcare Description', type: 'textarea', value: 'قلل نسبة المواعيد الضائعة وتذكر المرضى بمواعيدهم', valueEn: 'Reduce missed appointments and remind patients of their schedules' },
            { key: 'general_title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'خدمة الرسائل النصية SMS', valueEn: 'SMS Messaging Service' },
            { key: 'general_desc', label: 'الوصف الرئيسي', labelEn: 'Main Description', type: 'textarea', value: 'أرسل رسائل نصية فعّالة ومباشرة لجمهورك المستهدف', valueEn: 'Send effective and direct SMS messages to your target audience' },
          ],
        },
        {
          id: 'sms-features',
          name: 'مميزات الخدمة',
          nameEn: 'Service Features',
          visible: true,
          fields: [
            { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'لماذا تختار خدمة الرسائل النصية من المدار؟', valueEn: 'Why Choose ORBIT SMS Service?' },
            { key: 'feature1_icon', label: 'أيقونة الميزة 1', labelEn: 'Feature 1 Icon', type: 'text', value: '⚡', valueEn: '⚡' },
            { key: 'feature1_title', label: 'عنوان الميزة 1', labelEn: 'Feature 1 Title', type: 'text', value: 'توصيل فائق السرعة', valueEn: 'Ultra-Fast Delivery' },
            { key: 'feature1_desc', label: 'وصف الميزة 1', labelEn: 'Feature 1 Description', type: 'textarea', value: 'رسائلك تصل خلال ثوانٍ معدودة', valueEn: 'Your messages arrive in seconds' },
            { key: 'feature2_icon', label: 'أيقونة الميزة 2', labelEn: 'Feature 2 Icon', type: 'text', value: '💰', valueEn: '💰' },
            { key: 'feature2_title', label: 'عنوان الميزة 2', labelEn: 'Feature 2 Title', type: 'text', value: 'أسعار تنافسية', valueEn: 'Competitive Pricing' },
            { key: 'feature2_desc', label: 'وصف الميزة 2', labelEn: 'Feature 2 Description', type: 'textarea', value: 'أفضل الأسعار في السوق مع حزم مرنة', valueEn: 'Best market prices with flexible packages' },
            { key: 'feature3_icon', label: 'أيقونة الميزة 3', labelEn: 'Feature 3 Icon', type: 'text', value: '📊', valueEn: '📊' },
            { key: 'feature3_title', label: 'عنوان الميزة 3', labelEn: 'Feature 3 Title', type: 'text', value: 'تقارير مفصلة', labelEn: 'Detailed Reports', type: 'text', value: 'تتبع حالة كل رسالة وتقارير شاملة', valueEn: 'Track every message status and comprehensive reports' },
            { key: 'feature3_desc', label: 'وصف الميزة 3', labelEn: 'Feature 3 Description', type: 'textarea', value: 'تتبع حالة كل رسالة وتقارير شاملة', valueEn: 'Track every message status and comprehensive reports' },
          ],
        },
        {
          id: 'sms-pricing',
          name: 'تسعير SMS',
          nameEn: 'SMS Pricing',
          visible: true,
          fields: [
            { key: 'general_title', label: 'عنوان قسم الباقات', labelEn: 'Packages Section Title', type: 'text', value: 'اختر الباقة المناسبة لنمو أعمالك', valueEn: 'Choose the right package for your business growth' },
            { key: 'general_subtitle', label: 'وصف قسم الباقات', labelEn: 'Packages Section Subtitle', type: 'textarea', value: 'باقات مرنة تناسب جميع أحجام الأعمال', valueEn: 'Flexible packages suitable for all business sizes' },
            { key: 'benefit1', label: 'الفائدة الأولى', labelEn: 'Benefit 1', type: 'text', value: 'أسعار خاصة للكميات الكبيرة', valueEn: 'Special prices for large quantities' },
            { key: 'benefit2', label: 'الفائدة الثانية', labelEn: 'Benefit 2', type: 'text', value: 'لا رسوم تأسيس أو تكاليف خفية', valueEn: 'No setup fees or hidden costs' },
            { key: 'benefit3', label: 'الفائدة الثالثة', labelEn: 'Benefit 3', type: 'text', value: 'تقارير مفصلة مجانية', valueEn: 'Free detailed reports' },
            { key: 'plans_list', label: 'تفاصيل الباقات', labelEn: 'Package Details', type: 'list', value: '1000|110|الباقة الأساسية|للشركات الصغيرة|false|false\n5000|450|الباقة المتقدمة|للشركات المتوسطة|false|false\n10000|850|الباقة الاحترافية|للشركات الكبيرة|true|false\n|custom|باقة مخصصة|اتصل للحصول على عرض سعر مخصص|false|true' },
          ],
        },
        {
          id: 'sms-cta',
          name: 'دعوة للتفاعل',
          nameEn: 'Call to Action',
          visible: true,
          fields: [
            { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'هل أنت مستعد للبدء؟', valueEn: 'Ready to Get Started?' },
            { key: 'subtitle', label: 'الوصف', labelEn: 'Subtitle', type: 'textarea', value: 'سجل مجاناً وابدأ بإرسال رسائل SMS اليوم', valueEn: 'Register for free and start sending SMS today' },
            { key: 'cta_text', label: 'نص الزر', labelEn: 'Button Text', type: 'text', value: 'سجل الآن', valueEn: 'Register Now' },
            { key: 'cta_url', label: 'رابط الزر', labelEn: 'Button URL', type: 'url', value: 'https://app.mobile.net.sa/reg', valueEn: 'https://app.mobile.net.sa/reg' },
          ],
        },
      ],
    };

    const whatsappPage = {
      id: 'whatsapp',
      title: 'واتساب للأعمال',
      titleEn: 'WhatsApp Business',
      path: '/products/whatsapp',
      lastEdited: today,
      sections: [
        {
          id: 'wa-hero',
          name: 'البانر الرئيسي',
          nameEn: 'Hero Banner',
          visible: true,
          fields: [
            { key: 'general_title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'واتساب للأعمال API', valueEn: 'WhatsApp Business API' },
            { key: 'general_desc', label: 'الوصف الرئيسي', labelEn: 'Main Description', type: 'textarea', value: 'تواصل مع عملائك عبر واتساب بطريقة احترافية وآمنة', valueEn: 'Communicate with your customers on WhatsApp in a professional and secure way' },
            { key: 'cta_text', label: 'نص الزر', labelEn: 'Button Text', type: 'text', value: 'اطلب الخدمة', valueEn: 'Request Service' },
            { key: 'cta_url', label: 'رابط الزر', labelEn: 'Button URL', type: 'url', value: '/products/whatsapp/request', valueEn: '/products/whatsapp/request' },
          ],
        },
        {
          id: 'wa-features',
          name: 'مميزات واتساب',
          nameEn: 'WhatsApp Features',
          visible: true,
          fields: [
            { key: 'general_title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'مميزات واتساب للأعمال', valueEn: 'WhatsApp Business Features' },
            { key: 'solutions_title', label: 'عنوان قسم الحلول', labelEn: 'Solutions Section Title', type: 'text', value: 'حلول واتساب', valueEn: 'WhatsApp Solutions' },
            { key: 'campaigns_title', label: 'عنوان قسم الحملات', labelEn: 'Campaigns Section Title', type: 'text', value: 'حملات واتساب', valueEn: 'WhatsApp Campaigns' },
            { key: 'api_title', label: 'عنوان قسم API', labelEn: 'API Section Title', type: 'text', value: 'API واتساب', valueEn: 'WhatsApp API' },
          ],
        },
        {
          id: 'wa-pricing',
          name: 'تسعير واتساب',
          nameEn: 'WhatsApp Pricing',
          visible: true,
          fields: [
            { key: 'title', label: 'عنوان قسم الباقات', labelEn: 'Packages Section Title', type: 'text', value: 'اختر الباقة المناسبة لنمو أعمالك', valueEn: 'Choose the right package for your business growth' },
            { key: 'subtitle', label: 'وصف قسم الباقات', labelEn: 'Packages Section Subtitle', type: 'textarea', value: 'باقات مرنة تناسب جميع أحجام الأعمال', valueEn: 'Flexible packages suitable for all business sizes' },
            { key: 'plans_note', label: 'عنوان ملاحظة الباقات', labelEn: 'Plans Note Title', type: 'text', value: 'ملاحظة مهمة', valueEn: 'Important Note' },
            { key: 'contact_note', label: 'نص ملاحظة الباقات', labelEn: 'Plans Note Text', type: 'textarea', value: 'الأسعار تشمل 3 شرائح لكل باقة', valueEn: 'Prices include 3 tiers for each package' },
            { key: 'plans_list', label: 'تفاصيل الباقات والشرائح', labelEn: 'Packages and Tiers Details', type: 'list', value: '' },
            { key: 'api_title', label: 'عنوان أسعار محادثات API', labelEn: 'API Pricing Title', type: 'text', value: 'أسعار محادثات واتساب API', valueEn: 'WhatsApp API Conversation Prices' },
            { key: 'api_subtitle', label: 'وصف أسعار محادثات API', labelEn: 'API Pricing Subtitle', type: 'textarea', value: 'الأسعار محددة من واتساب (Meta) للسوق السعودي', valueEn: 'Prices standardized by WhatsApp (Meta) for Saudi Market' },
            { key: 'api_prices_list', label: 'قائمة أسعار محادثات API', labelEn: 'API Conversation Pricing List', type: 'list', value: '' },
            { key: 'api_tip_title', label: 'عنوان النصيحة', labelEn: 'Tip Title', type: 'text', value: 'نصيحة احترافية', valueEn: 'Pro Tip' },
            { key: 'api_tip_description', label: 'وصف النصيحة', labelEn: 'Tip Description', type: 'textarea', value: 'محادثات خدمة العملاء مجانية خلال 24 ساعة!', valueEn: 'Customer service conversations are free within 24 hours!' },
          ],
        },
        {
          id: 'wa-request-form',
          name: 'فورم طلب واتساب',
          nameEn: 'WhatsApp Request Form',
          visible: true,
          fields: [
            { key: 'industry_options', label: 'خيارات الصناعة', labelEn: 'Industry Options', type: 'textarea', value: 'تجزئة ومبيعات\nمطاعم وكافيهات\nصحة وعناية صحية\nتعليم\nعقارات\nلوجستيات ونقل\nبنوك ومالية\nحكومي', valueEn: 'Retail & Sales\nRestaurants & Cafes\nHealthcare\nEducation\nReal Estate\nLogistics & Transport\nBanking & Finance\nGovernment' },
            { key: 'employee_count_options', label: 'خيارات عدد الموظفين', labelEn: 'Employee Count Options', type: 'textarea', value: '1-10:1 - 10 موظفين\n11-50:11 - 50 موظف\n51-100:51 - 100 موظف\n101-500:101 - 500 موظف', valueEn: '1-10:1 - 10 employees\n11-50:11 - 50 employees\n51-100:51 - 100 employees\n101-500:101 - 500 employees' },
            { key: 'service_goals', label: 'أهداف الخدمة', labelEn: 'Service Goals', type: 'textarea', value: 'customer-support:دعم العملاء\nsales:مبيعات وتسويق\nnotifications:إشعارات آلية', valueEn: 'customer-support:Customer Support\nsales:Sales & Marketing\nnotifications:Automated Notifications' },
            { key: 'notification_email', label: 'بريد الإشعارات', labelEn: 'Notification Email', type: 'text', value: 'marketing@corbit.sa', valueEn: 'marketing@corbit.sa' },
          ],
        },
        {
          id: 'wa-cta',
          name: 'دعوة للتفاعل',
          nameEn: 'Call to Action',
          visible: true,
          fields: [
            { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'هل أنت مستعد للبدء مع واتساب؟', valueEn: 'Ready to Get Started with WhatsApp?' },
            { key: 'subtitle', label: 'الوصف', labelEn: 'Subtitle', type: 'textarea', value: 'تواصل مع فريقنا للحصول على استشارة مجانية', valueEn: 'Contact our team for a free consultation' },
            { key: 'cta_text', label: 'نص الزر', labelEn: 'Button Text', type: 'text', value: 'تواصل معنا', valueEn: 'Contact Us' },
            { key: 'cta_url', label: 'رابط الزر', labelEn: 'Button URL', type: 'url', value: '/contact', valueEn: '/contact' },
          ],
        },
      ],
    };

    const otimePage = {
      id: 'otime',
      title: 'O-Time نظام الموارد البشرية',
      titleEn: 'O-Time HR System',
      path: '/products/o-time',
      lastEdited: today,
      sections: [
        {
          id: 'ot-hero',
          name: 'البانر الرئيسي',
          nameEn: 'Hero Banner',
          visible: true,
          fields: [
            { key: 'general_title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'O-Time نظام الموارد البشرية', valueEn: 'O-Time HR System' },
            { key: 'general_desc', label: 'الوصف الرئيسي', labelEn: 'Main Description', type: 'textarea', value: 'منصة متكاملة لإدارة الموارد البشرية', valueEn: 'Integrated HR Management Platform' },
            { key: 'cta_text', label: 'نص الزر', labelEn: 'Button Text', type: 'text', value: 'اكتشف المزيد', valueEn: 'Learn More' },
            { key: 'cta_url', label: 'رابط الزر', labelEn: 'Button URL', type: 'url', value: '#features', valueEn: '#features' },
          ],
        },
        {
          id: 'ot-features',
          name: 'مميزات O-Time',
          nameEn: 'O-Time Features',
          visible: true,
          fields: [
            { key: 'general_title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'مميزات O-Time', valueEn: 'O-Time Features' },
            { key: 'modules_title', label: 'عنوان قسم الوحدات', labelEn: 'Modules Section Title', type: 'text', value: 'وحدات النظام', valueEn: 'System Modules' },
            { key: 'screenshots_title', label: 'عنوان قسم لقطات النظام', labelEn: 'Screenshots Section Title', type: 'text', value: 'واجهة النظام', valueEn: 'System Interface' },
            { key: 'tech_title', label: 'عنوان قسم المواصفات التقنية', labelEn: 'Technical Section Title', type: 'text', value: 'المواصفات التقنية', valueEn: 'Technical Specifications' },
          ],
        },
        {
          id: 'ot-pricing',
          name: 'تسعير O-Time',
          nameEn: 'O-Time Pricing',
          visible: true,
          fields: [
            { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'أسعار O-Time', valueEn: 'O-Time Pricing' },
            { key: 'subtitle', label: 'الوصف', labelEn: 'Subtitle', type: 'textarea', value: 'أسعار تنافسية مع دعم فني متواصل', valueEn: 'Competitive pricing with continuous technical support' },
          ],
        },
        {
          id: 'ot-cta',
          name: 'دعوة للتفاعل',
          nameEn: 'Call to Action',
          visible: true,
          fields: [
            { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'هل أنت مستعد لتجربة O-Time؟', valueEn: 'Ready to Try O-Time?' },
            { key: 'subtitle', label: 'الوصف', labelEn: 'Subtitle', type: 'textarea', value: 'احصل على عرض توضيحي مجاني', valueEn: 'Get a free demo' },
            { key: 'cta_text', label: 'نص الزر', labelEn: 'Button Text', type: 'text', value: 'اطلب عرض توضيحي', valueEn: 'Request Demo' },
            { key: 'cta_url', label: 'رابط الزر', labelEn: 'Button URL', type: 'url', value: '/contact', valueEn: '/contact' },
          ],
        },
      ],
    };

    const govgatePage = {
      id: 'govgate',
      title: 'Gov Gate البوابة الحكومية',
      titleEn: 'Gov Gate',
      path: '/products/gov-gate',
      lastEdited: today,
      sections: [
        {
          id: 'gg-hero',
          name: 'البانر الرئيسي',
          nameEn: 'Hero Banner',
          visible: true,
          fields: [
            { key: 'general_title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'Gov Gate البوابة الحكومية', valueEn: 'Gov Gate' },
            { key: 'general_desc', label: 'الوصف الرئيسي', labelEn: 'Main Description', type: 'textarea', value: 'بوابة مراسلة مؤسسية آمنة', valueEn: 'Secure Enterprise Messaging Gateway' },
          ],
        },
        {
          id: 'gg-features',
          name: 'مميزات Gov Gate',
          nameEn: 'Gov Gate Features',
          visible: true,
          fields: [
            { key: 'title', label: 'العنوان', labelEn: 'Title', type: 'text', value: 'مميزات Gov Gate', valueEn: 'Gov Gate Features' },
            { key: 'security_title', label: 'عنوان قسم الأمان', labelEn: 'Security Section Title', type: 'text', value: 'الأمان والامتثال', valueEn: 'Security & Compliance' },
            { key: 'integration_title', label: 'عنوان قسم التكامل', labelEn: 'Integration Section Title', type: 'text', value: 'التكامل مع الأنظمة', valueEn: 'System Integration' },
          ],
        },
        {
          id: 'gg-cta',
          name: 'دعوة للتفاعل',
          nameEn: 'Call to Action',
          visible: true,
          fields: [
            { key: 'general_title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'هل أنت مستعد للبدء مع Gov Gate؟', valueEn: 'Ready to Get Started with Gov Gate?' },
            { key: 'final_title', label: 'عنوان الرسالة الختامية', labelEn: 'Final CTA Title', type: 'text', value: 'تواصل معنا للحصول على استشارة', valueEn: 'Contact us for a consultation' },
            { key: 'cta_text', label: 'نص الزر', labelEn: 'Button Text', type: 'text', value: 'تواصل معنا', valueEn: 'Contact Us' },
            { key: 'cta_url', label: 'رابط الزر', labelEn: 'Button URL', type: 'url', value: '/contact', valueEn: '/contact' },
          ],
        },
      ],
    };

    const contactPage = {
      id: 'contact',
      title: 'تواصل معنا',
      titleEn: 'Contact Us',
      path: '/contact',
      lastEdited: today,
      sections: [
        {
          id: 'contact-hero',
          name: 'مقدمة الصفحة',
          nameEn: 'Page Intro',
          visible: true,
          fields: [
            { key: 'title', label: 'العنوان الرئيسي', labelEn: 'Main Title', type: 'text', value: 'تواصل معنا', valueEn: 'Contact Us' },
            { key: 'description', label: 'الوصف', labelEn: 'Description', type: 'textarea', value: 'نحن هنا للإجابة على استفساراتك', valueEn: 'We are here to answer your questions' },
          ],
        },
        {
          id: 'contact-info',
          name: 'بطاقات التواصل',
          nameEn: 'Contact Info Cards',
          visible: true,
          fields: [
            { key: 'phone', label: 'رقم الهاتف', labelEn: 'Phone Number', type: 'text', value: '920006900', valueEn: '920006900' },
            { key: 'phone_note', label: 'ملاحظة الهاتف', labelEn: 'Phone Note', type: 'text', value: 'الأحد للخميس، 8ص - 6م', valueEn: 'Sunday to Thursday, 8 AM - 6 PM' },
            { key: 'email', label: 'البريد الإلكتروني', labelEn: 'Email Address', type: 'text', value: 'sales@orbit.sa', valueEn: 'sales@orbit.sa' },
            { key: 'email_note', label: 'ملاحظة البريد', labelEn: 'Email Note', type: 'text', value: 'نرد خلال 24 ساعة', valueEn: 'We reply within 24 hours' },
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
            { key: 'service_options', label: 'خيارات الخدمة', labelEn: 'Service Options', type: 'list', value: 'sms|الرسائل النصية SMS|SMS Messaging\nwhatsapp|واتساب أعمال API|WhatsApp Business API\no-time|O-Time نظام الموارد البشرية|O-Time HR System\ngov-gate|Gov Gate بوابة حكومية|Gov Gate\nother|استفسار عام|General Inquiry' },
            { key: 'submit_text', label: 'نص زر الإرسال', labelEn: 'Submit Button Text', type: 'text', value: 'إرسال الرسالة', valueEn: 'Send Message' },
            { key: 'privacy_note', label: 'نص سياسة الخصوصية', labelEn: 'Privacy Note', type: 'text', value: 'بإرسال النموذج، أنت توافق على سياسة الخصوصية.', valueEn: 'By sending this form, you agree to the privacy policy.' },
          ],
        },
      ],
    };

    const pages = [homePage, smsPage, whatsappPage, otimePage, govgatePage, contactPage];

    const existingSite = await SiteCms.findOne({ key: 'primary' });
    
    if (existingSite) {
      existingSite.pages = pages;
      await existingSite.save();
      console.log('✅ Updated existing SiteCms with new pages');
    } else {
      await SiteCms.create({
        key: 'primary',
        isActive: true,
        pages,
        partners: [],
        socialLinks: [],
        contactSubmissions: [],
        notificationEmail: 'sales@orbit.sa',
        footerData: {},
      });
      console.log('✅ Created new SiteCms with all pages');
    }

    console.log('\n🎉 SiteCms seed completed successfully!');
    console.log(`📄 Seeded ${pages.length} pages:`);
    pages.forEach(p => console.log(`   - ${p.title} (${p.id})`));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding SiteCms:', error);
    process.exit(1);
  }
};

seedSiteCms();
