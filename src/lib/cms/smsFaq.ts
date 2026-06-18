// أسئلة شائعة افتراضية لصفحة الرسائل النصية SMS — تُستخدم في المكوّن (Faq) وفي FAQPage JSON-LD على الخادم.
// تبقى قابلة للتحرير بالكامل من اللوحة عبر حقل sms-faq/faq_json (هذه قيم افتراضية آمنة فقط).

export interface SmsFaqItem {
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
}

export const SMS_FAQ_DEFAULTS: SmsFaqItem[] = [
  {
    qAr: 'ما هو اسم المرسل (Sender ID) وكيف أحصل عليه؟',
    qEn: 'What is a Sender ID and how do I get one?',
    aAr: 'اسم المرسل هو الاسم الذي يظهر للمستلم بدل الرقم (مثل اسم شركتك). نساعدك في تسجيله واعتماده لدى مزوّدي الشبكة وفق متطلبات هيئة الاتصالات.',
    aEn: 'A Sender ID is the name recipients see instead of a number (e.g. your brand). We help you register and get it approved with the carriers per CITC requirements.',
  },
  {
    qAr: 'كم مدة صلاحية رصيد الرسائل؟',
    qEn: 'How long is the SMS credit valid?',
    aAr: 'رصيد الرسائل صالح لمدة سنة كاملة من تاريخ الشحن، فلا يضيع رصيدك ويمكنك استخدامه وقت ما تشاء.',
    aEn: 'Your SMS credit is valid for a full year from the top-up date, so it never goes to waste and you can use it whenever you need.',
  },
  {
    qAr: 'هل يمكنني إرسال أكواد التحقق OTP؟',
    qEn: 'Can I send OTP verification codes?',
    aAr: 'نعم، منصتنا مهيّأة لإرسال أكواد OTP بتسليم فوري وموثوق، مع واجهة برمجية تسهّل دمجها في تطبيقك أو موقعك.',
    aEn: 'Yes, our platform is built for instant, reliable OTP delivery, with an API that makes it easy to integrate into your app or website.',
  },
  {
    qAr: 'هل توجد واجهة برمجية (API) للربط؟',
    qEn: 'Is there an API for integration?',
    aAr: 'نعم، نوفّر REST API مرنًا وموثّقًا بالكامل مع تكاملات جاهزة (سلة، دفترة، ووردبريس وغيرها) ودعم فني من مطوّر لمطوّر.',
    aEn: 'Yes, we provide a flexible, fully documented REST API with ready integrations (Salla, Daftra, WordPress and more) and developer-to-developer support.',
  },
  {
    qAr: 'ما طرق الدفع المتاحة؟',
    qEn: 'What payment methods are available?',
    aAr: 'نقبل التحويل البنكي، مدى، فيزا، بالإضافة إلى الدفع الآجل للشركات الكبرى.',
    aEn: 'We accept bank transfer, Mada, Visa, plus deferred payment for large enterprises.',
  },
];
