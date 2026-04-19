export interface WhatsAppPlanTier {
  name: string;
  price: string;
  priceWithTax: string;
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

export interface WhatsAppConversationPrice {
  type: string;
  price: string;
  duration: string;
  description: string;
  isFree: boolean;
}

const DEFAULT_SUBSCRIBE_URL = "https://wapp.mobile.net.sa/billing-subscription";

const defaultWhatsAppPlansAr: WhatsAppPlanConfig[] = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    period: "شهرياً",
    popular: false,
    badge: "",
    subscribeLabel: "اشترك الآن",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "الويب هوك وواجهة برمجة التطبيقات",
      "ربط المتجر مع المنصة",
      "دعم فني فضي",
    ],
    tiers: [
      { name: "الشريحة 1", price: "399", priceWithTax: "459", setupFee: "850", conversations: "1,000", broadcastMessages: "10,000", users: "7" },
      { name: "الشريحة 2", price: "699", priceWithTax: "804", setupFee: "850", conversations: "2,500", broadcastMessages: "25,000", users: "15" },
      { name: "الشريحة 3", price: "1,199", priceWithTax: "1,379", setupFee: "850", conversations: "5,000", broadcastMessages: "50,000", users: "25" },
    ],
  },
  {
    id: "growth",
    name: "باقة النمو",
    period: "شهرياً",
    popular: true,
    badge: "الأكثر طلباً",
    subscribeLabel: "اشترك الآن",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "كل مميزات الباقة الأساسية",
      "ربط أكثر من متجر مع المنصة",
      "شات بوت ذكي (Smart Chatbot)",
      "مدير حساب مخصص",
      "دعم فني ذهبي",
    ],
    tiers: [
      { name: "الشريحة 1", price: "659", priceWithTax: "758", setupFee: "1,919", conversations: "1,000", broadcastMessages: "10,000", users: "7" },
      { name: "الشريحة 2", price: "999", priceWithTax: "1,149", setupFee: "1,919", conversations: "2,500", broadcastMessages: "25,000", users: "15" },
      { name: "الشريحة 3", price: "1,619", priceWithTax: "1,862", setupFee: "1,919", conversations: "5,000", broadcastMessages: "50,000", users: "25" },
    ],
  },
  {
    id: "professional",
    name: "الباقة الاحترافية",
    period: "شهرياً",
    popular: false,
    badge: "",
    subscribeLabel: "اشترك الآن",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "كل مميزات باقة النمو",
      "موظف ذكاء اصطناعي (AI Agent)",
      "استضافة محلية (حسب الطلب)",
      "مدير حساب VIP",
      "دعم فني بلاتيني",
    ],
    tiers: [
      { name: "الشريحة 1", price: "999", priceWithTax: "1,149", setupFee: "2,919", conversations: "1,000", broadcastMessages: "10,000", users: "7" },
      { name: "الشريحة 2", price: "1,499", priceWithTax: "1,724", setupFee: "2,919", conversations: "2,500", broadcastMessages: "25,000", users: "15" },
      { name: "الشريحة 3", price: "2,199", priceWithTax: "2,529", setupFee: "2,919", conversations: "5,000", broadcastMessages: "50,000", users: "25" },
    ],
  },
];

const defaultWhatsAppPlansEn: WhatsAppPlanConfig[] = [
  {
    id: "basic",
    name: "Basic Package",
    period: "Monthly",
    popular: false,
    badge: "",
    subscribeLabel: "Subscribe Now",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "Webhooks and API",
      "Store integration with platform",
      "Silver technical support",
    ],
    tiers: [
      { name: "Tier 1", price: "399", priceWithTax: "459", setupFee: "850", conversations: "1,000", broadcastMessages: "10,000", users: "7" },
      { name: "Tier 2", price: "699", priceWithTax: "804", setupFee: "850", conversations: "2,500", broadcastMessages: "25,000", users: "15" },
      { name: "Tier 3", price: "1,199", priceWithTax: "1,379", setupFee: "850", conversations: "5,000", broadcastMessages: "50,000", users: "25" },
    ],
  },
  {
    id: "growth",
    name: "Growth Package",
    period: "Monthly",
    popular: true,
    badge: "Most Popular",
    subscribeLabel: "Subscribe Now",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "All features of the Basic Package",
      "Multiple store integrations",
      "Smart Chatbot",
      "Dedicated Account Manager",
      "Gold technical support",
    ],
    tiers: [
      { name: "Tier 1", price: "659", priceWithTax: "758", setupFee: "1,919", conversations: "1,000", broadcastMessages: "10,000", users: "7" },
      { name: "Tier 2", price: "999", priceWithTax: "1,149", setupFee: "1,919", conversations: "2,500", broadcastMessages: "25,000", users: "15" },
      { name: "Tier 3", price: "1,619", priceWithTax: "1,862", setupFee: "1,919", conversations: "5,000", broadcastMessages: "50,000", users: "25" },
    ],
  },
  {
    id: "professional",
    name: "Professional Package",
    period: "Monthly",
    popular: false,
    badge: "",
    subscribeLabel: "Subscribe Now",
    subscribeUrl: DEFAULT_SUBSCRIBE_URL,
    subscribeUrlType: "form",
    additionalFeatures: [
      "All features of the Growth Package",
      "AI Agent Employee",
      "Local Hosting (Upon request)",
      "VIP Account Manager",
      "Platinum technical support",
    ],
    tiers: [
      { name: "Tier 1", price: "999", priceWithTax: "1,149", setupFee: "2,919", conversations: "1,000", broadcastMessages: "10,000", users: "7" },
      { name: "Tier 2", price: "1,499", priceWithTax: "1,724", setupFee: "2,919", conversations: "2,500", broadcastMessages: "25,000", users: "15" },
      { name: "Tier 3", price: "2,199", priceWithTax: "2,529", setupFee: "2,919", conversations: "5,000", broadcastMessages: "50,000", users: "25" },
    ],
  },
];

const defaultWhatsAppConversationPricesAr: WhatsAppConversationPrice[] = [
  {
    type: "محادثات خدمة العملاء",
    price: "مجانية",
    duration: "24 ساعة",
    description: "الرد على استفسارات العملاء خلال 24 ساعة من آخر رسالة",
    isFree: true,
  },
  {
    type: "رسائل التحقق (OTP)",
    price: "0.04",
    duration: "للرسالة",
    description: "رموز التحقق وتأكيد الهوية للمصادقة الآمنة",
    isFree: false,
  },
  {
    type: "محادثات التفعيل",
    price: "0.08",
    duration: "للرسالة",
    description: "تأكيد الطلبات، إشعارات الشحن، وتحديثات الحساب",
    isFree: false,
  },
  {
    type: "محادثات التسويق",
    price: "0.17",
    duration: "للرسالة",
    description: "رسائل ترويجية وحملات إعلانية للعملاء",
    isFree: false,
  },
];

const defaultWhatsAppConversationPricesEn: WhatsAppConversationPrice[] = [
  {
    type: "Customer Service Conversations",
    price: "Free",
    duration: "24 Hours",
    description: "Reply to customer inquiries within 24 hours of their last message",
    isFree: true,
  },
  {
    type: "Verification Messages (OTP)",
    price: "0.04",
    duration: "per msg",
    description: "Verification codes and identity confirmation for secure authentication",
    isFree: false,
  },
  {
    type: "Activation Conversations",
    price: "0.08",
    duration: "per msg",
    description: "Order confirmations, shipping notices, and account updates",
    isFree: false,
  },
  {
    type: "Marketing Conversations",
    price: "0.17",
    duration: "per msg",
    description: "Promotional messages and ad campaigns for customers",
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
    setupFee: asString(value.setupFee).trim(),
    conversations: asString(value.conversations).trim(),
    broadcastMessages: asString(value.broadcastMessages).trim(),
    users: asString(value.users).trim(),
  };
};

const normalizePlan = (value: unknown, index: number): WhatsAppPlanConfig | null => {
  if (!isRecord(value)) return null;
  const name = asString(value.name).trim();
  if (!name) return null;

  const rawTiers = Array.isArray(value.tiers) ? value.tiers : [];
  const tiers = rawTiers.map(normalizePlanTier).filter((tier): tier is WhatsAppPlanTier => Boolean(tier));
  if (!tiers.length) return null;

  const rawFeatures = Array.isArray(value.additionalFeatures) ? value.additionalFeatures : [];
  const additionalFeatures = rawFeatures
    .map((feature) => asString(feature).trim())
    .filter(Boolean);

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

export const parseWhatsAppPlans = (raw: string, fallback: WhatsAppPlanConfig[]): WhatsAppPlanConfig[] => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return fallback;
    const normalized = parsed.map(normalizePlan).filter((plan): plan is WhatsAppPlanConfig => Boolean(plan));
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

