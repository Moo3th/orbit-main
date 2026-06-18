// ثيمات جاهزة (presets) لفورمات/استبيانات FormConfig — لتطبيق هوية كل منتج بنقرة،
// وتمكين تغيير ثيم أي فورم/استبيان مستقبلًا بسهولة. القيم تطابق حقول ألوان نموذج FormConfig.
// (تُكرَّر نفس القيم في scripts/apply-form-themes.js — أبقِهما متطابقَين.)

export interface FormThemeColors {
  primaryColor: string;
  buttonTextColor: string;
  buttonHoverColor: string;
  optionSelectedTextColor: string;
  formBgColor: string;
  formCardBgColor: string;
  formTitleColor: string;
  fieldLabelColor: string;
  fieldBorderColor: string;
  optionBgColor: string;
  optionBorderColor: string;
  optionTextColor: string;
  successColor: string;
}

export interface FormThemePreset {
  key: string;
  labelAr: string;
  labelEn: string;
  colors: FormThemeColors;
}

// خلفيات/حدود/نصوص محايدة فاتحة متناسقة (ثابتة عبر كل الثيمات لأجل وضوح القراءة).
const NEUTRAL = {
  buttonTextColor: '#FFFFFF',
  optionSelectedTextColor: '#FFFFFF',
  formBgColor: '#f9fafb',
  formCardBgColor: '#ffffff',
  formTitleColor: '#161616',
  fieldLabelColor: '#374151',
  fieldBorderColor: '#d1d5db',
  optionBgColor: '#ffffff',
  optionBorderColor: '#e5e7eb',
  optionTextColor: '#111827',
};

const make = (primary: string, hover: string, success: string): FormThemeColors => ({
  ...NEUTRAL,
  primaryColor: primary,
  buttonHoverColor: hover,
  successColor: success,
});

// المفتاح يطابق productId (أو نوع عام) — يُستخدم للتطبيق التلقائي والأزرار في لوحة الأدمن.
export const FORM_THEME_PRESETS: Record<string, FormThemePreset> = {
  whatsapp: { key: 'whatsapp', labelAr: 'واتساب', labelEn: 'WhatsApp', colors: make('#128C7E', '#075E54', '#25D366') },
  otime: { key: 'otime', labelAr: 'O-Time', labelEn: 'O-Time', colors: make('#104E8B', '#0d3d6e', '#16a34a') },
  govgate: { key: 'govgate', labelAr: 'Gov Gate', labelEn: 'Gov Gate', colors: make('#0A2647', '#104E8B', '#16a34a') },
  schoolbit: { key: 'schoolbit', labelAr: 'SchoolBit', labelEn: 'SchoolBit', colors: make('#1B6BF1', '#1559c4', '#16a34a') },
  sms: { key: 'sms', labelAr: 'الرسائل SMS', labelEn: 'SMS', colors: make('#7A1E2E', '#601824', '#16a34a') },
  survey: { key: 'survey', labelAr: 'استبيان', labelEn: 'Survey', colors: make('#8B5CF6', '#7C3AED', '#16a34a') },
};

// ترتيب عرض الأزرار في لوحة الأدمن.
export const FORM_THEME_PRESET_LIST: FormThemePreset[] = [
  FORM_THEME_PRESETS.whatsapp,
  FORM_THEME_PRESETS.otime,
  FORM_THEME_PRESETS.govgate,
  FORM_THEME_PRESETS.schoolbit,
  FORM_THEME_PRESETS.sms,
  FORM_THEME_PRESETS.survey,
];
