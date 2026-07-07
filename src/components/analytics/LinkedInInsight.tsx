'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface LinkedInInsightProps {
  partnerId: string;
  /** معرّف تحويل الـ Lead الرقمي من LinkedIn Campaign Manager — يُستخدم في events.ts */
  conversionId?: string;
}

declare global {
  interface Window {
    lintrk?: { (...args: unknown[]): void; q?: unknown[] };
    _linkedin_partner_id?: string;
    _linkedin_data_partner_ids?: string[];
    __liLeadConversionId?: string;
  }
}

// نفس منطق الموافقة في MetaPixel: وسم إعلاني يُحمَّل فقط عند 'accepted'.
function getConsentLevel(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('cookie-consent');
  if (stored === 'accepted' || stored === 'necessary') return stored;

  const cookie = document.cookie.split(';').find(c => c.trim().startsWith('cookie-consent='));
  if (cookie) {
    const value = cookie.split('=')[1].trim();
    if (value === 'accepted' || value === 'necessary') return value;
  }
  return '';
}

export default function LinkedInInsight({ partnerId, conversionId }: LinkedInInsightProps) {
  // يبدأ false دائمًا لتطابق الترطيب مع الخادم (انظر MetaPixel.tsx).
  const [adsConsent, setAdsConsent] = useState(false);

  useEffect(() => {
    setAdsConsent(getConsentLevel() === 'accepted');

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newLevel = customEvent.detail?.level || (customEvent.detail?.ads ? 'accepted' : 'necessary');
      setAdsConsent(newLevel === 'accepted');
    };

    window.addEventListener('cookie-consent-changed' as any, handleConsentChange);
    return () => window.removeEventListener('cookie-consent-changed' as any, handleConsentChange);
  }, []);

  useEffect(() => {
    if (conversionId) window.__liLeadConversionId = conversionId;
  }, [conversionId]);

  if (!partnerId || !adsConsent) return null;

  return (
    <>
      <Script
        id="linkedin-insight-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            _linkedin_partner_id = "${partnerId}";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l) {
              if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
              window.lintrk.q=[]}
              var s = document.getElementsByTagName("script")[0];
              var b = document.createElement("script");
              b.type = "text/javascript";b.async = true;
              b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
              s.parentNode.insertBefore(b, s);
            })(window.lintrk);
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://px.ads.linkedin.com/collect/?pid=${partnerId}&fmt=gif`}
        />
      </noscript>
    </>
  );
}
