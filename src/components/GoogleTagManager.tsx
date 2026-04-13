'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

interface GoogleTagManagerProps {
  gtmId: string;
}

type CookieConsentChangedEvent = CustomEvent<{ consent?: boolean }>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_GRANTED = {
  analytics_storage: 'granted',
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
};

const CONSENT_DENIED = {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
};

export default function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string>('');

  useEffect(() => {
    const updateConsent = (isGranted: boolean) => {
      if (typeof window === 'undefined') {
        return;
      }

      window.dataLayer = window.dataLayer || [];
      if (typeof window.gtag !== 'function') {
        window.gtag = (...args: unknown[]) => {
          window.dataLayer.push(args);
        };
      }

      window.gtag('consent', 'update', isGranted ? CONSENT_GRANTED : CONSENT_DENIED);
    };

    const storedConsent = localStorage.getItem('cookie-consent');
    updateConsent(storedConsent === 'accepted');

    const handleConsentChange = (event: Event) => {
      const consentEvent = event as CookieConsentChangedEvent;
      updateConsent(Boolean(consentEvent.detail?.consent));
    };

    window.addEventListener('cookie-consent-changed', handleConsentChange);
    return () => {
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !pathname) {
      return;
    }

    const pagePath = pathname;
    if (lastTrackedPathRef.current === pagePath) {
      return;
    }

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
