'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface GoogleTagManagerProps {
  gtmId: string;
}

type CookieConsentChangedEvent = CustomEvent<{ consent?: boolean; analytics?: boolean; ads?: boolean; level?: string }>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_NECESSARY = {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

const CONSENT_ALL = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
};

export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string>('');

  useEffect(() => {
    const applyConsent = (level: string) => {
      if (typeof window === 'undefined') return;

      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== 'function') {
        window.gtag = (...args: unknown[]) => {
          window.dataLayer.push(args);
        };
      }

      if (level === 'accepted') {
        window.gtag('consent', 'update', CONSENT_ALL);
      } else {
        window.gtag('consent', 'update', CONSENT_NECESSARY);
      }
    };

    const getConsentLevel = (): string => {
      const stored = localStorage.getItem('cookie-consent');
      if (stored === 'accepted' || stored === 'necessary') return stored;

      const cookie = document.cookie.split(';').find(c => c.trim().startsWith('cookie-consent='));
      if (cookie) {
        const value = cookie.split('=')[1].trim();
        if (value === 'accepted' || value === 'necessary') return value;
      }
      return '';
    };

    const level = getConsentLevel();
    if (level === 'accepted' || level === 'necessary') {
      applyConsent(level);
    }

    const handleConsentChange = (event: Event) => {
      const consentEvent = event as CookieConsentChangedEvent;
      const level = consentEvent.detail?.level || (consentEvent.detail?.ads ? 'accepted' : 'necessary');
      applyConsent(level);
    };

    window.addEventListener('cookie-consent-changed', handleConsentChange);
    return () => {
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) return;

    const pagePath = pathname;
    if (lastTrackedPathRef.current === pagePath) return;

    lastTrackedPathRef.current = pagePath;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_path: pagePath,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];
            function gtag(){w[l].push(arguments);}
            w.gtag=gtag;
            gtag('consent','default',{
              analytics_storage:'denied',
              ad_storage:'denied',
              ad_user_data:'denied',
              ad_personalization:'denied',
              wait_for_update:500
            });
            w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}