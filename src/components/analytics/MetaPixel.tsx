'use client';

import { useEffect, useState, useRef } from 'react';
import Script from 'next/script';

interface MetaPixelProps {
  pixelId: string;
}

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

const META_PIXEL_URL = 'https://connect.facebook.net/en_US/fbevents.js';

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

export default function MetaPixel({ pixelId }: MetaPixelProps) {
  const [adsConsent, setAdsConsent] = useState(getConsentLevel() === 'accepted');
  const initializedRef = useRef(false);

  useEffect(() => {
    const level = getConsentLevel();
    setAdsConsent(level === 'accepted');

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newLevel = customEvent.detail?.level || (customEvent.detail?.ads ? 'accepted' : 'necessary');
      setAdsConsent(newLevel === 'accepted');
    };

    window.addEventListener('cookie-consent-changed' as any, handleConsentChange);
    return () => {
      window.removeEventListener('cookie-consent-changed' as any, handleConsentChange);
    };
  }, []);

  useEffect(() => {
    if (!adsConsent || initializedRef.current || !pixelId) return;
    if (typeof window === 'undefined') return;

    if (window.fbq) {
      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
      initializedRef.current = true;
      return;
    }
  }, [adsConsent, pixelId]);

  if (!pixelId) return null;

  if (!adsConsent) return null;

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

  const level = getConsentLevel();
  if (level !== 'accepted') {
    console.warn('Meta Pixel: ads consent not granted');
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