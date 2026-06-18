/**
 * مصدر موحّد لقراءة مستوى موافقة الكوكيز.
 *
 * كان منطق القراءة مكرّرًا في ثلاثة مواضع (PrivacyConsent / GoogleTagManager / events).
 * هذا الملف يوحّده ويصنّف الموافقة إلى:
 *  - تحليلات (analytics): تُمنح عند 'accepted' أو 'necessary'.
 *  - إعلانات (ads / Meta): تُمنح عند 'accepted' فقط.
 *
 * ملاحظة: لا تُطلق أي أحداث قبل اختيار المستخدم لمستوى (null) — يطابق سلوك
 * Consent Mode الافتراضي 'denied' في GoogleTagManager.
 */

export type ConsentLevel = 'accepted' | 'necessary' | null;

export const CONSENT_STORAGE_KEY = 'cookie-consent';

/** يقرأ المستوى من localStorage ثم من الكوكي كحلٍّ احتياطي. */
export function getConsentLevel(): ConsentLevel {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'accepted' || stored === 'necessary') return stored;
  } catch {
    // localStorage قد يكون محظورًا (وضع التصفّح الخاص) — نتابع للكوكي.
  }

  const cookie = document.cookie
    .split(';')
    .find((c) => c.trim().startsWith(`${CONSENT_STORAGE_KEY}=`));
  if (cookie) {
    const value = cookie.split('=')[1]?.trim();
    if (value === 'accepted' || value === 'necessary') return value;
  }

  return null;
}

/** موافقة التحليلات: 'accepted' أو 'necessary'. */
export function hasAnalyticsConsent(): boolean {
  const level = getConsentLevel();
  return level === 'accepted' || level === 'necessary';
}

/** موافقة الإعلانات (Meta Pixel): 'accepted' فقط. */
export function hasAdsConsent(): boolean {
  return getConsentLevel() === 'accepted';
}
