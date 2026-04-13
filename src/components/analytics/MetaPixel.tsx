'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface MetaPixelProps {
  pixelId: string;
}

type CookieConsentChangedEvent = CustomEvent<{ consent?: boolean }>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const META_PIXEL_URL = 'https://connect.facebook.net/en_US/fbevents.js';

export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const initializedRef = useRef(false);

  useEffect(() => {
    const initPixel = (consent: boolean) => {
      if (!consent || initializedRef.current || typeof window === 'undefined') {
        return;
      }

      if (window.fbq) {
        initializedRef.current = true;
        return;
      }

      initializedRef.current = true;
    };

    const storedConsent = localStorage.getItem('cookie-consent');
    if (storedConsent === 'accepted') {
      initPixel(true);
    }

    const handleConsentChange = (event: Event) => {
      const consentEvent = event as CookieConsentChangedEvent;
      if (consentEvent.detail?.consent) {
        initPixel(true);
      }
    };

    window.addEventListener('cookie-consent-changed', handleConsentChange);

    return () => {
      window.removeEventListener('cookie-consent-changed', handleConsentChange);
    };
  }, [pixelId]);

  if (!pixelId) {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            '${META_PIXEL_URL}');
            fbq('init', '${pixelId}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

export function trackMetaEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window === 'undefined' || !window.fbq) {
    console.warn('Meta Pixel not initialized');
    return;
  }

  const storedConsent = localStorage.getItem('cookie-consent');
  if (storedConsent !== 'accepted') {
    console.warn('Meta Pixel: consent not granted');
    return;
  }

  window.fbq('track', eventName, params);
}

export function trackLead(contentName: string, contentCategory: string = 'Lead') {
  trackMetaEvent('Lead', {
    content_name: contentName,
    content_category: contentCategory,
  });
}

export function trackViewContent(
  contentName: string,
  contentCategory: string,
  contentIds?: string[]
) {
  trackMetaEvent('ViewContent', {
    content_name: contentName,
    content_category: contentCategory,
    ...(contentIds ? { content_ids: contentIds } : {}),
  });
}

export function trackCompleteRegistration(method: string = 'form') {
  trackMetaEvent('CompleteRegistration', {
    method: method,
  });
}

export function trackSubscribe(contentName: string = 'Newsletter') {
  trackMetaEvent('Subscribe', {
    content_name: contentName,
  });
}