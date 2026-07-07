/**
 * Server-side Conversion APIs — Meta CAPI + X (Twitter) CAPI + LinkedIn CAPI.
 *
 * تُستدعى من مسارات استقبال الفورمات (form-submit / contact / whatsapp-request /
 * client-inquiries) بعد حفظ الطلب، ومن مسار /api/events (أحداث العميل)، وترسل حدث
 * Lead لكل منصة مفعّلة إعداداتها في لوحة الأدمن (SeoSettings.analytics).
 * أي فشل هنا لا يجب أن يُفشل حفظ الطلب — كل الدوال تلتقط أخطاءها وتكتفي بتسجيلها.
 */

import crypto from 'crypto';
import { connectDB } from '@/lib/mongodb';
import { SeoSettings, ISeoAnalytics } from '@/models/SeoSettings';

export interface ServerLeadEvent {
  eventName?: string; // default 'Lead'
  eventId?: string; // معرّف موحّد لمنع الازدواج مع أحداث البكسل client-side
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  sourceUrl?: string;
  customData?: Record<string, unknown>;
}

// معرّفات مجزّأة SHA-256 (نفس مفاتيح Meta المختصرة em/ph/fn/ln).
export interface HashedIdentifiers {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
}

interface DispatchEvent {
  eventName: string;
  eventId: string;
  sourceUrl?: string;
  customData?: Record<string, unknown>;
  // أسماء خام اختيارية (يستفيد منها LinkedIn userInfo فقط — لا تُرسل لغيره).
  firstName?: string;
  lastName?: string;
}

export type PlatformResult = { platform: string; success: boolean; error?: string };

const sha256 = (value: string) =>
  crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex');

// توحيد الجوال إلى صيغة E.164 قدر الإمكان قبل التجزئة (المنصات تشترطها للمطابقة).
// أرقام سعودية: 05XXXXXXXX → +9665XXXXXXXX.
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^\d+]/g, '');
  if (digits.startsWith('00')) digits = `+${digits.slice(2)}`;
  if (!digits.startsWith('+')) {
    if (/^05\d{8}$/.test(digits)) digits = `+966${digits.slice(1)}`;
    else if (/^5\d{8}$/.test(digits)) digits = `+966${digits}`;
    else if (/^966\d+$/.test(digits)) digits = `+${digits}`;
    else digits = `+${digits}`;
  }
  return digits;
}

// ─────────────────────────── Meta Conversions API ───────────────────────────

async function sendMetaCapi(
  analytics: ISeoAnalytics,
  event: DispatchEvent,
  ids: HashedIdentifiers
): Promise<PlatformResult> {
  const pixelId = analytics.facebookPixelId;
  const accessToken = analytics.facebookAccessToken;
  if (!pixelId || !accessToken) return { platform: 'meta', success: false, error: 'not configured' };

  const userData: Record<string, string[]> = {};
  if (ids.em) userData.em = [ids.em];
  if (ids.ph) userData.ph = [ids.ph];
  if (ids.fn) userData.fn = [ids.fn];
  if (ids.ln) userData.ln = [ids.ln];
  if (Object.keys(userData).length === 0) return { platform: 'meta', success: false, error: 'no identifiers' };

  const body = {
    data: [
      {
        event_name: event.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: event.eventId,
        action_source: 'website',
        event_source_url: event.sourceUrl || 'https://corbit.sa',
        user_data: userData,
        custom_data: event.customData || {},
      },
    ],
    access_token: accessToken,
  };

  const res = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    return { platform: 'meta', success: false, error: err?.error?.message || `HTTP ${res.status}` };
  }
  return { platform: 'meta', success: true };
}

// ─────────────────────────── X (Twitter) Conversion API ───────────────────────────

// توقيع OAuth 1.0a (HMAC-SHA1) — جسم JSON لا يدخل في التوقيع وفق مواصفة X Ads API.
function oauth1Header(
  method: string,
  url: string,
  creds: { apiKey: string; apiSecret: string; accessToken: string; accessSecret: string }
): string {
  const pct = (s: string) =>
    encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: creds.apiKey,
    oauth_nonce: crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: creds.accessToken,
    oauth_version: '1.0',
  };

  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${pct(k)}=${pct(oauthParams[k])}`)
    .join('&');
  const baseString = [method.toUpperCase(), pct(url), pct(paramString)].join('&');
  const signingKey = `${pct(creds.apiSecret)}&${pct(creds.accessSecret)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');

  const all = { ...oauthParams, oauth_signature: signature };
  return (
    'OAuth ' +
    Object.keys(all)
      .sort()
      .map((k) => `${pct(k)}="${pct(all[k as keyof typeof all])}"`)
      .join(', ')
  );
}

async function sendXCapi(
  analytics: ISeoAnalytics,
  event: DispatchEvent,
  ids: HashedIdentifiers
): Promise<PlatformResult> {
  const { xPixelId, xLeadEventId, xApiKey, xApiSecret, xAccessToken, xAccessSecret } = analytics;
  if (!xPixelId || !xLeadEventId || !xApiKey || !xApiSecret || !xAccessToken || !xAccessSecret) {
    return { platform: 'x', success: false, error: 'not configured' };
  }

  const identifiers: Record<string, string>[] = [];
  if (ids.em) identifiers.push({ hashed_email: ids.em });
  if (ids.ph) identifiers.push({ hashed_phone_number: ids.ph });
  if (identifiers.length === 0) return { platform: 'x', success: false, error: 'no identifiers' };

  const url = `https://ads-api.x.com/12/measurement/conversions/${xPixelId}`;
  const body = {
    conversions: [
      {
        conversion_time: new Date().toISOString(),
        event_id: xLeadEventId,
        identifiers,
        conversion_id: event.eventId,
      },
    ],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: oauth1Header('POST', url, {
        apiKey: xApiKey,
        apiSecret: xApiSecret,
        accessToken: xAccessToken,
        accessSecret: xAccessSecret,
      }),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { platform: 'x', success: false, error: `HTTP ${res.status} ${text.slice(0, 200)}` };
  }
  return { platform: 'x', success: true };
}

// ─────────────────────────── LinkedIn Conversions API ───────────────────────────

async function sendLinkedInCapi(
  analytics: ISeoAnalytics,
  event: DispatchEvent,
  ids: HashedIdentifiers
): Promise<PlatformResult> {
  const { linkedInAccessToken, linkedInConversionUrn } = analytics;
  if (!linkedInAccessToken || !linkedInConversionUrn) {
    return { platform: 'linkedin', success: false, error: 'not configured' };
  }
  if (!ids.em) return { platform: 'linkedin', success: false, error: 'no email identifier' };

  const body = {
    conversion: linkedInConversionUrn,
    conversionHappenedAt: Date.now(),
    eventId: event.eventId,
    user: {
      userIds: [{ idType: 'SHA256_EMAIL', idValue: ids.em }],
      ...(event.firstName || event.lastName
        ? {
            userInfo: {
              ...(event.firstName ? { firstName: event.firstName } : {}),
              ...(event.lastName ? { lastName: event.lastName } : {}),
            },
          }
        : {}),
    },
  };

  const res = await fetch('https://api.linkedin.com/rest/conversionEvents', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${linkedInAccessToken}`,
      'LinkedIn-Version': '202411',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { platform: 'linkedin', success: false, error: `HTTP ${res.status} ${text.slice(0, 200)}` };
  }
  return { platform: 'linkedin', success: true };
}

// ─────────────────────────── الواجهة الموحّدة ───────────────────────────

/**
 * يوزّع حدثاً بمعرّفات مجزّأة مسبقاً على كل المنصات المهيأة بالتوازي — لا يرمي أبداً.
 */
export async function dispatchHashedLeadEvent(
  event: DispatchEvent,
  ids: HashedIdentifiers
): Promise<PlatformResult[]> {
  try {
    await connectDB();
    const settings = await SeoSettings.findOne({ key: 'primary' }).lean();
    const analytics = settings?.analytics as ISeoAnalytics | undefined;
    if (!analytics) return [];

    const results = await Promise.allSettled([
      sendMetaCapi(analytics, event, ids),
      sendXCapi(analytics, event, ids),
      sendLinkedInCapi(analytics, event, ids),
    ]);

    const flat: PlatformResult[] = results.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : { platform: ['meta', 'x', 'linkedin'][i], success: false, error: String(r.reason) }
    );

    for (const r of flat) {
      if (!r.success && r.error !== 'not configured') {
        console.error(`[conversions] ${r.platform} failed:`, r.error);
      }
    }
    return flat;
  } catch (error) {
    console.error('[conversions] dispatch error:', error);
    return [];
  }
}

/**
 * يرسل حدث تحويل (Lead افتراضياً) ببيانات خام — يجزّئها ثم يوزّعها على المنصات.
 * الاستدعاء fire-and-forget من مسارات الفورمات؛ لا يرمي أخطاء أبداً.
 */
export async function sendServerLeadEvent(input: ServerLeadEvent): Promise<PlatformResult[]> {
  try {
    const ids: HashedIdentifiers = {};
    if (input.email) ids.em = sha256(input.email);
    if (input.phone) ids.ph = sha256(normalizePhone(input.phone));
    if (input.firstName) ids.fn = sha256(input.firstName);
    if (input.lastName) ids.ln = sha256(input.lastName);

    return await dispatchHashedLeadEvent(
      {
        eventName: input.eventName || 'Lead',
        eventId: input.eventId || `lead_${crypto.randomBytes(8).toString('hex')}`,
        sourceUrl: input.sourceUrl,
        customData: input.customData,
        firstName: input.firstName,
        lastName: input.lastName,
      },
      ids
    );
  } catch (error) {
    console.error('[conversions] sendServerLeadEvent error:', error);
    return [];
  }
}
