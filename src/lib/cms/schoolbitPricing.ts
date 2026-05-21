export interface SchoolBitPlan {
  name: string;
  nameEn: string;
  price: number | null;
  price3Months: number | null;
  priceYearly: number | null;
  description: string;
  descriptionEn: string;
  featured: boolean;
  features: string[];
  featuresEn: string[];
  isCustom: boolean;
  ctaUrl?: string;
  ctaUrlEn?: string;
}

export function getDiscountPercent(monthlyPrice: number, yearlyPrice: number): number {
  if (monthlyPrice <= 0) return 0;
  return Math.round(((monthlyPrice - yearlyPrice) / monthlyPrice) * 100);
}

export function get3MonthDiscountPercent(monthlyPrice: number, price3Months: number): number {
  if (monthlyPrice <= 0) return 0;
  return Math.round(((monthlyPrice - price3Months) / monthlyPrice) * 100);
}

export function get3MonthTotal(monthlyPrice: number, price3Months: number): number {
  return price3Months * 3;
}

export function getYearlyTotal(monthlyPrice: number, yearlyPrice: number): number {
  return yearlyPrice * 12;
}

export interface SchoolBitSmsPlan {
  name: string;
  nameEn: string;
  messages: number;
  price: number;
  priceEn: string;
}

export function parseSchoolBitSmsPlans(raw: string, fallback: SchoolBitSmsPlan[]): SchoolBitSmsPlan[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;
    return parsed.map((p: Record<string, unknown>) => ({
      name: String(p.name || ''),
      nameEn: String(p.nameEn || p.name || ''),
      messages: Number(p.messages || 0),
      price: Number(p.price || 0),
      priceEn: String(p.priceEn || String(p.price || '')),
    }));
  } catch {
    return fallback;
  }
}

export function serializeSchoolBitSmsPlans(plans: SchoolBitSmsPlan[]): string {
  return JSON.stringify(plans);
}

export function getDefaultSchoolBitSmsPlans(isRTL: boolean): SchoolBitSmsPlan[] {
  return [
    { name: 'رسائل 500', nameEn: '500 SMS', messages: 500, price: 59, priceEn: '59 SAR' },
    { name: 'رسائل 1,000', nameEn: '1,000 SMS', messages: 1000, price: 99, priceEn: '99 SAR' },
    { name: 'رسائل 2,500', nameEn: '2,500 SMS', messages: 2500, price: 189, priceEn: '189 SAR' },
    { name: 'رسائل 5,000', nameEn: '5,000 SMS', messages: 5000, price: 309, priceEn: '309 SAR' },
    { name: 'رسائل 10,000', nameEn: '10,000 SMS', messages: 10000, price: 489, priceEn: '489 SAR' },
    { name: 'رسائل 25,000', nameEn: '25,000 SMS', messages: 25000, price: 899, priceEn: '899 SAR' },
  ];
}

export function parseSchoolBitPlans(raw: string, fallback: SchoolBitPlan[]): SchoolBitPlan[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return fallback;
    return parsed.map((plan: Record<string, unknown>) => ({
      name: String(plan.name || ''),
      nameEn: String(plan.nameEn || plan.name || ''),
      price: plan.price !== null && plan.price !== undefined ? Number(plan.price) : null,
      price3Months: plan.price3Months !== null && plan.price3Months !== undefined ? Number(plan.price3Months) : null,
      priceYearly: plan.priceYearly !== null && plan.priceYearly !== undefined ? Number(plan.priceYearly) : null,
      description: String(plan.description || ''),
      descriptionEn: String(plan.descriptionEn || plan.description || ''),
      featured: Boolean(plan.featured),
      features: Array.isArray(plan.features) ? plan.features.map(String) : [],
      featuresEn: Array.isArray(plan.featuresEn) ? plan.featuresEn.map(String) : Array.isArray(plan.features) ? plan.features.map(String) : [],
      isCustom: Boolean(plan.isCustom),
      ctaUrl: String(plan.ctaUrl || ''),
      ctaUrlEn: String(plan.ctaUrlEn || plan.ctaUrl || ''),
    }));
  } catch {
    return fallback;
  }
}

export function serializeSchoolBitPlans(plans: SchoolBitPlan[]): string {
  return JSON.stringify(plans);
}

export function getDefaultSchoolBitPlans(isRTL: boolean): SchoolBitPlan[] {
  return [
    {
      name: 'الأساسي',
      nameEn: 'Basic',
      price: 0,
      price3Months: 0,
      priceYearly: 0,
      description: 'للمدارس الصغيرة التي تبدأ الرقمنة',
      descriptionEn: 'For small schools starting digitization',
      featured: false,
      isCustom: false,
      features: [
        'لوحة تحكم أساسية',
        'تسجيل حضور يومي',
        'ملف الطالب الأساسي',
        'إرسال رسائل SMS',
        'تقارير بسيطة',
      ],
      featuresEn: [
        'Basic dashboard',
        'Daily attendance tracking',
        'Basic student profile',
        'SMS messaging',
        'Simple reports',
      ],
      ctaUrl: 'https://schoolbit.corbit.sa/',
      ctaUrlEn: 'https://schoolbit.corbit.sa/',
    },
    {
      name: 'الاحترافي',
      nameEn: 'Professional',
      price: 299,
      price3Months: 266,
      priceYearly: 239,
      description: 'للمدارس التي تريد إدارة متكاملة وذكية',
      descriptionEn: 'For schools seeking complete and smart management',
      featured: true,
      isCustom: false,
      features: [
        'كل مميزات الأساسي',
        'ربط أجهزة BioTime',
        'رسائل WhatsApp',
        'تقارير متقدمة ومجدولة',
        'تكامل مع نظام نور',
        'إدارة الجداول والاختبارات',
        'تنبيهات ذكية',
        'دعم فني مخصص',
      ],
      featuresEn: [
        'All Basic features',
        'BioTime device integration',
        'WhatsApp messaging',
        'Advanced & scheduled reports',
        'Noor system integration',
        'Schedule & exam management',
        'Smart alerts',
        'Dedicated support',
      ],
      ctaUrl: 'https://schoolbit.corbit.sa/',
      ctaUrlEn: 'https://schoolbit.corbit.sa/',
    },
    {
      name: 'المؤسسي',
      nameEn: 'Enterprise',
      price: null,
      price3Months: null,
      priceYearly: null,
      description: 'للإدارات التعليمية وسلاسل المدارس',
      descriptionEn: 'For educational districts and school chains',
      featured: false,
      isCustom: true,
      features: [
        'كل مميزات الاحترافي',
        'إدارة مدارس متعددة',
        'أدوار وصلاحيات متقدمة',
        'API وتكاملات مخصصة',
        'تقارير مؤسسية',
        'مدير حساب مخصص',
        'تدريب وتهيئة شامل',
        'SLA مضمون',
      ],
      featuresEn: [
        'All Professional features',
        'Multi-school management',
        'Advanced roles & permissions',
        'Custom API & integrations',
        'Enterprise reporting',
        'Dedicated account manager',
        'Full training & onboarding',
        'Guaranteed SLA',
      ],
      ctaUrl: '/contact',
      ctaUrlEn: '/contact',
    },
  ];
}