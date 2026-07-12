export interface WhatsAppPlanTier {
  name: string;
  price: string;
  priceWithTax: string;
  originalPrice?: string; // Discount support
  setupFee: string;
  conversations: string;
  broadcastMessages: string;
  users: string;
}

export interface WhatsAppPlanConfig {
  id: string;
  name: string;
  period: string;
  popular: boolean;
  badge: string;
  subscribeLabel: string;
  subscribeUrl: string;
  subscribeUrlType: 'form' | 'external';
  additionalFeatures: string[];
  tiers: WhatsAppPlanTier[];
}

export type BillingCycle = 'monthly' | 'yearly';

export interface BillingDiscounts {
  monthlyDiscount: number; // نسبة مئوية 0-100
  yearlyDiscount: number;
}

// عرض سعر شريحة لدورة فوترة: المبلغ المعروض دائماً **قيمة شهرية** (في السنوي: المكافئ الشهري بعد
// خصم السنوي)، والأصل الشهري قبل الخصم (للشطب)، وإجمالي السنة بعد الخصم كسطر توضيحي في الدورة السنوية.
// الأسعار النصّية (مثل «تواصل معنا») تمرّ كما هي بلا عملة/فترة/خصم.
export interface TierPriceView {
  isNumeric: boolean;
  amount: string;
  original: string | null;
  discountPercent: number;
  yearlyTotal: string | null;
}

export const parseDiscountPercent = (raw: string): number => {
  const n = parseFloat(String(raw ?? '').replace(/[^\d.]/g, ''));
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
};

const formatAmount = (n: number): string => {
  const rounded = Math.round(n * 100) / 100;
  return rounded.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

export const getTierPriceView = (
  price: string,
  cycle: BillingCycle,
  discounts: BillingDiscounts
): TierPriceView => {
  const numeric = parseFloat(String(price).replace(/[^\d.]/g, ''));
  if (!/\d/.test(price) || !Number.isFinite(numeric)) {
    return { isNumeric: false, amount: price, original: null, discountPercent: 0, yearlyTotal: null };
  }
  const discountPercent = cycle === 'yearly' ? discounts.yearlyDiscount : discounts.monthlyDiscount;
  const amount = numeric * (1 - discountPercent / 100);
  return {
    isNumeric: true,
    amount: formatAmount(amount),
    original: discountPercent > 0 ? formatAmount(numeric) : null,
    discountPercent,
    yearlyTotal: cycle === 'yearly' ? formatAmount(amount * 12) : null,
  };
};

// السعر شامل الضريبة 15% للمبلغ المعروض (يُعاد حسابه لأن المخزّن شهري قبل الخصم).
export const getTaxedAmount = (view: TierPriceView): string | null => {
  if (!view.isNumeric) return null;
  const n = parseFloat(view.amount.replace(/,/g, ''));
  if (!Number.isFinite(n)) return null;
  return formatAmount(n * 1.15);
};

export interface WhatsAppConversationPrice {
  type: string;
  price: string;
  duration: string;
  description: string;
  isFree: boolean;
}

const DEFAULT_SUBSCRIBE_URL = "https://wapp.mobile.net.sa/billing-subscription";

// باقات WhatsBit 2026: أربع باقات، شريحة (سعر) واحدة لكل باقة. الأسعار شهرية قبل الضريبة، و priceWithTax شامل 15%.
// الأرقام المحدّدة بجانبها «+» (قابلة للتوسّع)؛ غير المحدود يبقى «غير محدود». رسوم التأسيس نص «حسب الحالة».
// المؤسسات بلا سعر ثابت: «تواصل معنا» (price نصّي، priceWithTax/setupFee فارغان، الزر يوجّه إلى /contact).
const defaultWhatsAppPlansAr: WhatsAppPlanConfig[] = [
  {
    id: "basic",
    name: "الأساسية",
    period: "شهرياً",
    popular: false,
    badge: "",
    subscribeLabel: "اشترك الآن",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "1,000 محادثة خدمية شهرياً",
      "مستخدمان + رقم واتساب واحد",
      "15 قالب رسالة جاهز",
      "ردود تلقائية بقواعد ثابتة",
      "امتثال كامل ZATCA + PDPL",
      "نسخ احتياطية للمحادثات (30 يوماً)",
      "تقارير إرسال + لوحة معلومات أساسية",
      "دعم بريد إلكتروني خلال 24 ساعة",
    ],
    tiers: [
      { name: "الباقة", price: "199", priceWithTax: "228.85", setupFee: "حسب الحالة", conversations: "1,000+", broadcastMessages: "", users: "2+" },
    ],
  },
  {
    id: "starter",
    name: "البداية",
    period: "شهرياً",
    popular: false,
    badge: "",
    subscribeLabel: "اشترك الآن",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "10,000 محادثة خدمية + 5,000 رسالة بث شهرياً",
      "شات بوت ذكي بـ 5,000 رسالة/شهر",
      "5 مستخدمين + العلامة الزرقاء (التوثيق)",
      "تكامل مع سلة وزد و Shopify",
      "تحليل الحملات + تصدير بيانات Excel",
      "وصول API محدود (5,000 طلب/شهر)",
      "تتبع جودة الحساب + 30 قالباً",
      "دعم بريد + واتساب خلال 4 ساعات",
    ],
    tiers: [
      { name: "الباقة", price: "399", priceWithTax: "458.85", setupFee: "حسب الحالة", conversations: "10,000+", broadcastMessages: "5,000+", users: "5+" },
    ],
  },
  {
    id: "business",
    name: "الأعمال",
    period: "شهرياً",
    popular: true,
    badge: "الأكثر طلباً",
    subscribeLabel: "اشترك الآن",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "محادثات خدمية غير محدودة + 10,000 رسالة بث",
      "شات بوت غير محدود + وكيل AI كامل (10,000 رسالة)",
      "15 مستخدماً + 60 قالب رسالة",
      "API كامل (50,000 طلب/شهر) + Webhooks",
      "تكامل HubSpot/Zoho/Salesforce + ربط ERP",
      "تدريب البوت على بيانات شركتك",
      "مدير حساب مخصص + جلسة تدريب",
      "دعم بريد + هاتف خلال ساعتين",
    ],
    tiers: [
      { name: "الباقة", price: "867", priceWithTax: "997.05", setupFee: "حسب الحالة", conversations: "غير محدود", broadcastMessages: "10,000+", users: "15+" },
    ],
  },
  {
    id: "enterprise",
    name: "المؤسسات",
    period: "شهرياً",
    popular: false,
    badge: "",
    subscribeLabel: "تواصل معنا",
    subscribeUrl: "/contact",
    subscribeUrlType: "external",
    additionalFeatures: [
      "كل شيء غير محدود (محادثات + بث + بوت)",
      "AI Agent (50,000 رسالة) + متعدد الوكلاء",
      "مستخدمون غير محدودون + 10 أرقام واتساب",
      "API مفتوح غير محدود + SDKs رسمية",
      "بيئة اختبار (Sandbox) + Webhooks مخصصة",
      "نماذج LLM متعددة (Claude/GPT/Gemini)",
      "اتفاقية مستوى خدمة SLA 99.9% مخصصة",
      "دعم أولوية 24/7 خلال ساعة واحدة",
    ],
    tiers: [
      { name: "الباقة", price: "تواصل معنا", priceWithTax: "", setupFee: "", conversations: "غير محدود", broadcastMessages: "غير محدود", users: "غير محدود" },
    ],
  },
];

const defaultWhatsAppPlansEn: WhatsAppPlanConfig[] = [
  {
    id: "basic",
    name: "Basic",
    period: "Monthly",
    popular: false,
    badge: "",
    subscribeLabel: "Subscribe Now",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "1,000 service conversations / month",
      "2 users + 1 WhatsApp number",
      "15 ready-made message templates",
      "Rule-based auto-replies",
      "Full ZATCA + PDPL compliance",
      "Conversation backups (30 days)",
      "Delivery reports + basic dashboard",
      "Email support within 24 hours",
    ],
    tiers: [
      { name: "Plan", price: "199", priceWithTax: "228.85", setupFee: "On request", conversations: "1,000+", broadcastMessages: "", users: "2+" },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    period: "Monthly",
    popular: false,
    badge: "",
    subscribeLabel: "Subscribe Now",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "10,000 service conversations + 5,000 broadcast messages / month",
      "Smart chatbot with 5,000 messages/month",
      "5 users + blue tick (verification)",
      "Integration with Salla, Zid & Shopify",
      "Campaign analytics + Excel export",
      "Limited API access (5,000 requests/month)",
      "Account quality tracking + 30 templates",
      "Email + WhatsApp support within 4 hours",
    ],
    tiers: [
      { name: "Plan", price: "399", priceWithTax: "458.85", setupFee: "On request", conversations: "10,000+", broadcastMessages: "5,000+", users: "5+" },
    ],
  },
  {
    id: "business",
    name: "Business",
    period: "Monthly",
    popular: true,
    badge: "Most Popular",
    subscribeLabel: "Subscribe Now",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "Unlimited service conversations + 10,000 broadcast messages",
      "Unlimited chatbot + full AI Agent (10,000 messages)",
      "15 users + 60 message templates",
      "Full API (50,000 requests/month) + Webhooks",
      "HubSpot/Zoho/Salesforce integration + ERP linking",
      "Train the bot on your company data",
      "Dedicated account manager + training session",
      "Email + phone support within 2 hours",
    ],
    tiers: [
      { name: "Plan", price: "867", priceWithTax: "997.05", setupFee: "On request", conversations: "Unlimited", broadcastMessages: "10,000+", users: "15+" },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    period: "Monthly",
    popular: false,
    badge: "",
    subscribeLabel: "Contact us",
    subscribeUrl: "/contact",
    subscribeUrlType: "external",
    additionalFeatures: [
      "Everything unlimited (conversations + broadcast + bot)",
      "AI Agent (50,000 messages) + multi-agent",
      "Unlimited users + 10 WhatsApp numbers",
      "Unlimited open API + official SDKs",
      "Sandbox environment + dedicated Webhooks",
      "Multiple LLM models (Claude/GPT/Gemini)",
      "Custom 99.9% SLA",
      "24/7 priority support within 1 hour",
    ],
    tiers: [
      { name: "Plan", price: "Contact us", priceWithTax: "", setupFee: "", conversations: "Unlimited", broadcastMessages: "Unlimited", users: "Unlimited" },
    ],
  },
];

// رسوم Meta لكل رسالة (محدّثة من ملف باقات WhatsBit 2026) — منفصلة عن اشتراك الباقة.
const defaultWhatsAppConversationPricesAr: WhatsAppConversationPrice[] = [
  {
    type: "محادثات خدمة العملاء",
    price: "مجانية",
    duration: "24 ساعة",
    description: "مجانية تماماً داخل نافذة 24 ساعة من رسالة العميل",
    isFree: true,
  },
  {
    type: "رسائل التحقق المحلية (OTP)",
    price: "0.059",
    duration: "للرسالة",
    description: "للأرقام السعودية — رموز التحقق وتأكيد الهوية للمصادقة الآمنة",
    isFree: false,
  },
  {
    type: "رسائل الخدمات (Utility)",
    price: "0.059",
    duration: "للرسالة",
    description: "تأكيد الطلبات وإشعارات الشحن — مجانية داخل نافذة خدمة العملاء",
    isFree: false,
  },
  {
    type: "رسائل التسويق",
    price: "0.187",
    duration: "للرسالة",
    description: "رسائل ترويجية وحملات إعلانية — حدّثتها Meta في 1 أبريل 2026",
    isFree: false,
  },
];

const defaultWhatsAppConversationPricesEn: WhatsAppConversationPrice[] = [
  {
    type: "Customer Service Conversations",
    price: "Free",
    duration: "24 Hours",
    description: "Completely free within 24 hours of the customer's last message",
    isFree: true,
  },
  {
    type: "Local Verification (OTP)",
    price: "0.059",
    duration: "per message",
    description: "For Saudi numbers — verification codes and identity confirmation",
    isFree: false,
  },
  {
    type: "Utility Messages",
    price: "0.059",
    duration: "per message",
    description: "Order confirmations and shipping notices — free within the customer service window",
    isFree: false,
  },
  {
    type: "Marketing Messages",
    price: "0.187",
    duration: "per message",
    description: "Promotional messages and ad campaigns — updated by Meta on 1 April 2026",
    isFree: false,
  },
];

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const asString = (value: unknown, fallback = ""): string => (typeof value === "string" ? value : fallback);
const asBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  return fallback;
};

const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value));

export const getDefaultWhatsAppPlans = (isArabic: boolean): WhatsAppPlanConfig[] => clone(isArabic ? defaultWhatsAppPlansAr : defaultWhatsAppPlansEn);
export const getDefaultWhatsAppConversationPrices = (isArabic: boolean): WhatsAppConversationPrice[] => clone(isArabic ? defaultWhatsAppConversationPricesAr : defaultWhatsAppConversationPricesEn);

export const serializeWhatsAppPlans = (plans: WhatsAppPlanConfig[]): string => JSON.stringify(plans);
export const serializeWhatsAppConversationPrices = (prices: WhatsAppConversationPrice[]): string => JSON.stringify(prices);

const normalizePlanTier = (value: unknown): WhatsAppPlanTier | null => {
  if (!isRecord(value)) return null;
  const name = asString(value.name).trim();
  if (!name) return null;

  return {
    name,
    price: asString(value.price).trim(),
    priceWithTax: asString(value.priceWithTax).trim(),
    originalPrice: asString(value.originalPrice).trim(),
    setupFee: asString(value.setupFee).trim(),
    conversations: asString(value.conversations).trim(),
    broadcastMessages: asString(value.broadcastMessages).trim(),
    users: asString(value.users).trim(),
  };
};

const normalizePlan = (value: unknown, index: number, keepEmptyFeatures = false): WhatsAppPlanConfig | null => {
  if (!isRecord(value)) return null;
  const name = asString(value.name).trim();
  if (!name) return null;

  const rawTiers = Array.isArray(value.tiers) ? value.tiers : [];
  const tiers = rawTiers.map(normalizePlanTier).filter((tier): tier is WhatsAppPlanTier => Boolean(tier));
  if (!tiers.length) return null;

  const rawFeatures = Array.isArray(value.additionalFeatures) ? value.additionalFeatures : [];
  // المحرّر يعيد قراءة القيمة بعد كل تعديل؛ حذف الفارغ هنا يمحو سطر الميزة الجديد قبل الكتابة فيه.
  const additionalFeatures = keepEmptyFeatures
    ? rawFeatures.map((feature) => asString(feature))
    : rawFeatures.map((feature) => asString(feature).trim()).filter(Boolean);

  return {
    id: asString(value.id).trim() || `plan_${index + 1}`,
    name,
    period: asString(value.period).trim(),
    popular: asBoolean(value.popular),
    badge: asString(value.badge).trim(),
    subscribeLabel: asString(value.subscribeLabel).trim(),
    subscribeUrl: asString(value.subscribeUrl).trim() || DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: (asString(value.subscribeUrlType).trim() === 'external' ? 'external' : 'form') as 'form' | 'external',
    additionalFeatures,
    tiers,
  };
};

const normalizeConversationPrice = (value: unknown): WhatsAppConversationPrice | null => {
  if (!isRecord(value)) return null;
  const type = asString(value.type).trim();
  if (!type) return null;

  return {
    type,
    price: asString(value.price).trim(),
    duration: asString(value.duration).trim(),
    description: asString(value.description).trim(),
    isFree: asBoolean(value.isFree),
  };
};

export const parseWhatsAppPlans = (
  raw: string,
  fallback: WhatsAppPlanConfig[],
  options?: { keepEmptyFeatures?: boolean }
): WhatsAppPlanConfig[] => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallback;
    const normalized = parsed
      .map((plan, index) => normalizePlan(plan, index, options?.keepEmptyFeatures))
      .filter((plan): plan is WhatsAppPlanConfig => Boolean(plan));
    return normalized.length ? normalized : fallback;
  } catch {
    return fallback;
  }
};

export const parseWhatsAppConversationPrices = (
  raw: string,
  fallback: WhatsAppConversationPrice[]
): WhatsAppConversationPrice[] => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallback;
    const normalized = parsed
      .map(normalizeConversationPrice)
      .filter((item): item is WhatsAppConversationPrice => Boolean(item));
    return normalized.length ? normalized : fallback;
  } catch {
    return fallback;
  }
};
