// أسئلة شائعة افتراضية لصفحة واتساب أعمال — تُستخدم في المكوّن (Faq) وفي FAQPage JSON-LD على الخادم.
// قابلة للتحرير بالكامل من اللوحة عبر حقل wa-faq/faq_json (هذه قيم افتراضية آمنة).
// مُحسّنة لعنقود «واتساب API»: ماهو/الفرق/التفعيل/السعر/المجاني/التحميل/مقدّم الحلول — تلتقط أسئلة PAA واستشهادات AI Overview.

export interface WaFaqItem {
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
}

export const WA_FAQ_DEFAULTS: WaFaqItem[] = [
  {
    qAr: 'ما هو واتساب API (WhatsApp Business API)؟',
    qEn: 'What is WhatsApp Business API?',
    aAr: 'واتساب API هو واجهة واتساب الأعمال الرسمية من Meta، موجَّهة للشركات لإرسال الإشعارات والحملات والردود الآلية وإدارة محادثات آلاف العملاء عبر أنظمتك — دون تطبيق على الهاتف. يُستخدم عبر مزوّد حلول معتمد (BSP) مثل المدار يوفّر لك لوحة تحكم وواجهة برمجة وتفعيلاً رسمياً.',
    aEn: 'WhatsApp Business API is Meta’s official business interface for sending notifications, campaigns, and automated replies and managing conversations with thousands of customers through your own systems — without a phone app. It is used via an authorized solution provider (BSP) such as CORBIT, which gives you a dashboard, an API, and official activation.',
  },
  {
    qAr: 'ما الفرق بين واتساب أعمال API وتطبيق واتساب بزنس العادي؟',
    qEn: 'What is the difference between WhatsApp Business API and the regular WhatsApp Business app?',
    aAr: 'تطبيق واتساب بزنس مناسب للأعمال الصغيرة بجهاز واحد. أما واتساب أعمال API فيتيح إرسال حملات لآلاف العملاء، ردودًا آلية، تعدد المستخدمين، وتكاملًا مع أنظمتك ومتجرك — وهو ما نوفّره لك.',
    aEn: 'The WhatsApp Business app suits small businesses on a single device. WhatsApp Business API enables campaigns to thousands of customers, automated replies, multi-user access, and integration with your systems and store — which is what we provide.',
  },
  {
    qAr: 'كيف أفعّل واتساب API وأشترك فيه؟',
    qEn: 'How do I activate and subscribe to WhatsApp API?',
    aAr: 'تفعيل واتساب API مع المدار بسيط: تختار الباقة، نوثّق حساب أعمالك لدى Meta، نعتمد رقمك وقوالب رسائلك، ثم نسلّمك مفاتيح API ولوحة التحكم جاهزة للإرسال. يستغرق التفعيل عادةً من يوم إلى أيام قليلة حسب جاهزية المستندات.',
    aEn: 'Activating WhatsApp API with CORBIT is simple: pick a plan, we verify your business account with Meta, approve your number and message templates, then hand over your API keys and a ready-to-use dashboard. Activation usually takes from one day to a few days depending on your documents.',
  },
  {
    qAr: 'كم سعر واتساب API وكيف تُحتسب التكلفة؟',
    qEn: 'How much does WhatsApp API cost and how is pricing calculated?',
    aAr: 'تتكوّن التكلفة من جزأين: اشتراك منصة المدار الشهري (باقات مرنة موضّحة أعلى الصفحة)، وتكلفة المحادثات حسب أسعار Meta ونوعها (تسويقية، خدمية، مصادقة) — ومحادثات خدمة العملاء مجانية خلال 24 ساعة من آخر رسالة. تواصل معنا لعرض سعر يناسب حجم أعمالك.',
    aEn: 'Cost has two parts: CORBIT’s monthly platform subscription (flexible plans shown above) and per-conversation cost based on Meta’s rates and type (marketing, utility, authentication) — customer-service conversations are free within 24 hours of the last message. Contact us for a quote tailored to your size.',
  },
  {
    qAr: 'هل واتساب API مجاني؟',
    qEn: 'Is WhatsApp API free?',
    aAr: 'واجهة واتساب API ليست مجانية بالكامل: هناك اشتراك منصة وتكلفة محادثات حسب Meta. لكننا نوفّر تجربة مجانية للبدء، ومحادثات خدمة العملاء مجانية خلال 24 ساعة. احذر عروض «واتساب API مجاني» غير الرسمية فقد تُعرّض رقمك للحظر من Meta.',
    aEn: 'The WhatsApp API itself is not entirely free: there is a platform subscription and per-conversation cost set by Meta. However, we offer a free trial to get started, and customer-service conversations are free within 24 hours. Beware of unofficial “free WhatsApp API” offers — they can get your number banned by Meta.',
  },
  {
    qAr: 'هل أحتاج إلى تحميل برنامج أو تطبيق لاستخدام واتساب API؟',
    qEn: 'Do I need to download an app or software to use WhatsApp API?',
    aAr: 'لا. واتساب API خدمة سحابية تُدار من لوحة تحكم عبر المتصفح ومن خلال روابط الواجهة البرمجية (API) — لا يوجد «تحميل» أو رابط تنزيل لتطبيق. نوصّل رقمك بالواجهة الرسمية ونمنحك لوحة ومفاتيح للربط مع متجرك وأنظمتك.',
    aEn: 'No. WhatsApp API is a cloud service managed from a browser dashboard and through API endpoints — there is no app “download”. We connect your number to the official interface and give you a dashboard and keys to integrate with your store and systems.',
  },
  {
    qAr: 'من هو أفضل مقدّم حلول واتساب API في السعودية؟',
    qEn: 'Who is the best WhatsApp API provider in Saudi Arabia?',
    aAr: 'المدار مزوّد حلول واتساب API في السعودية، مرخّص من هيئة الاتصالات والفضاء والتقنية، بدعم عربي وفوترة محلية وتكامل مع سلة ودفترة ونور. نساعدك في التوثيق والعلامة الخضراء واعتماد القوالب وربط الـ API — كل ذلك من جهة واحدة موثوقة.',
    aEn: 'CORBIT is a WhatsApp API provider in Saudi Arabia, licensed by CST, with Arabic support, local invoicing, and integration with Salla, Daftra, and Noor. We help with verification, the green tick, template approval, and API integration — all from one trusted partner.',
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
    qAr: 'هل يوجد شات بوت للردود الآلية وتكامل مع المتجر؟',
    qEn: 'Is there a chatbot for automated replies and store integration?',
    aAr: 'نعم، توفّر المنصة ردودًا آلية (شات بوت) لخدمة عملائك على مدار الساعة، وتكاملًا عبر API مرن مع منصات مثل سلة ودفترة ونور وأنظمتك الخاصة.',
    aEn: 'Yes, the platform offers a chatbot for 24/7 automated customer service, plus integration via a flexible API with platforms like Salla, Daftra, and Noor and your own systems.',
  },
];
