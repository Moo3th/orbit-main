'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

interface XPixelProps {
  pixelId: string;
  /** معرّف حدث الـ Lead من X Ads (مثل tw-xxxxx-yyyyy) — يُستخدم في events.ts عند إرسال الفورم */
  leadEventId?: string;
}

declare global {
  interface Window {
    twq?: (...args: unknown[]) => void;
    __xLeadEventId?: string;
  }
}

// نفس منطق الموافقة في MetaPixel: البكسل الإعلاني يُحمَّل فقط عند 'accepted'.
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

export default function XPixel({ pixelId, leadEventId }: XPixelProps) {
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
    if (leadEventId) window.__xLeadEventId = leadEventId;
  }, [leadEventId]);

  if (!pixelId || !adsConsent) return null;

  return (
    <Script
      id="x-pixel-script"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments);
          },s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',
          a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');
          twq('config','${pixelId}');
        `,
      }}
    />
  );
}
