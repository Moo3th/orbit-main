// أسئلة شائعة افتراضية لصفحة واتساب أعمال — تُستخدم في المكوّن (Faq) وفي FAQPage JSON-LD على الخادم.
// قابلة للتحرير بالكامل من اللوحة عبر حقل wa-faq/faq_json (هذه قيم افتراضية آمنة).

export interface WaFaqItem {
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
}

export const WA_FAQ_DEFAULTS: WaFaqItem[] = [
  {
    qAr: 'ما الفرق بين واتساب أعمال API وتطبيق واتساب بزنس العادي؟',
    qEn: 'What is the difference between WhatsApp Business API and the regular WhatsApp Business app?',
    aAr: 'تطبيق واتساب بزنس مناسب للأعمال الصغيرة بجهاز واحد. أما واتساب أعمال API فيتيح إرسال حملات لآلاف العملاء، ردودًا آلية، تعدد المستخدمين، وتكاملًا مع أنظمتك ومتجرك — وهو ما نوفّره لك.',
    aEn: 'The WhatsApp Business app suits small businesses on a single device. WhatsApp Business API enables campaigns to thousands of customers, automated replies, multi-user access, and integration with your systems and store — which is what we provide.',
  },
  {
    qAr: 'كيف أحصل على العلامة الخضراء الموثّقة (Green Tick)؟',
    qEn: 'How do I get the verified green tick?',
    aAr: 'نساعدك في تجهيز حساب واتساب أعمال وتقديم طلب التوثيق إلى Meta للحصول على العلامة الخضراء الرسمية التي تعزّز ثقة عملائك.',
    aEn: 'We help you set up your WhatsApp Business account and submit the verification request to Meta to obtain the official green tick that boosts your customers’ trust.',
  },
  {
    qAr: 'هل يمكنني إرسال حملات تسويقية وقوالب رسائل؟',
    qEn: 'Can I send marketing campaigns and message templates?',
    aAr: 'نعم، يمكنك إرسال حملات موجّهة باستخدام قوالب رسائل معتمدة من Meta مع أزرار تفاعلية، ونساعدك في اعتماد القوالب بسرعة.',
    aEn: 'Yes, you can send targeted campaigns using Meta-approved message templates with interactive buttons, and we help you get templates approved quickly.',
  },
  {
    qAr: 'هل يوجد شات بوت للردود الآلية وربط مع المتجر؟',
    qEn: 'Is there a chatbot for automated replies and store integration?',
    aAr: 'نعم، توفّر المنصة ردودًا آلية (شات بوت) لخدمة عملائك على مدار الساعة، وتكاملًا مع منصات مثل سلة ودفترة وأنظمتك عبر API مرن.',
    aEn: 'Yes, the platform offers a chatbot for 24/7 automated customer service, plus integration with platforms like Salla and Daftra and your systems via a flexible API.',
  },
  {
    qAr: 'كيف تُحتسب التكلفة في واتساب أعمال API؟',
    qEn: 'How is WhatsApp Business API priced?',
    aAr: 'تعتمد التكلفة على عدد المحادثات ونوعها (تسويقية، خدمية، مصادقة) حسب أسعار Meta، إضافةً إلى باقة المنصة. تواصل معنا لعرض سعر يناسب حجم أعمالك.',
    aEn: 'Pricing depends on the number and type of conversations (marketing, utility, authentication) per Meta’s rates, plus the platform plan. Contact us for a quote tailored to your business size.',
  },
];
